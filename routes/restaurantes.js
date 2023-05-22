const { Router } = require("express");
const Restaurante = require("../database/restaurante");
const Endereco = require("../database/endereco");
const { Op } = require("sequelize");
const { Comida } = require("../database/comida");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validacaoRestaurante = require("../validation/restaurante");
const checkTokenRestaurante = require("../validation/tokenRestaurante");
const checkTokenValido = require("../validation/tokenValido");
const checkTokenCliente = require("../validation/tokenCliente");

const router = Router();

//INCIO JWT
// POST - ROTA PARA ADICIONAR UM RESTAURANTE COM SENHA CRIPTOGRAFADA (brcypt);
router.post("/restaurantes", async (req, res) => {
  const {
    nomeFantasia,
    razaoSocial,
    telefone,
    cnpj,
    email,
    senha,
    confirmarSenha,
    endereco,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);
    const { error, value } = validacaoRestaurante.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (senha != confirmarSenha) {
      return res
        .status(422)
        .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }
    const novo = await Restaurante.create(
      {
        nomeFantasia,
        razaoSocial,
        telefone,
        cnpj,
        email,
        senha: senhaHash,
        confirmarSenha,
        endereco,
      },
      { include: [Endereco] }
    );
    res
      .status(201)
      .json({ novo, message: "Restaurante adicionado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

//ROTA LOGIN -> CRIANDO TOKEN
router.post("/restaurantes/login", async (req, res) => {
  const { email, senha } = req.body;
  // validações
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }
  // checar se o restaurante existe
  const restaurante = await Restaurante.findOne({ where: { email: email } });
  if (!restaurante) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }
  // checar se a senha está correta
  const checkSenha = await bcrypt.compare(senha, restaurante.senha);
  if (!checkSenha) {
    return res.status(422).json({ msg: "Senha inválida" });
  }
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: restaurante.id,
        email: restaurante.email,
        role: "restaurante", // adicionando a informação de role
      },
      secret
    );
    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

//ACESSO A ROTA PRIVADA COM UTILIZAÇÃO DO TOKEN
router.get("/restaurantes/home/:id", checkTokenRestaurante, async (req, res) => {
    const { id } = req.params;
    // checar se o restaurante existe
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) {
      return res.status(404).json({ msg: "Restaurante não encontrado!" });
    }
    res.status(200).json({ msg: "Bem vindo a esta rota privada" });
  }
);

//ROTA PUBLICA SEM NECESSIDADE DO TOKEN
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a API!" });
});

//FIM JWT

router.get("/restaurantes", checkTokenValido, async (req, res) => {
  const listaRestaurantes = await Restaurante.findAll({
    include: [Endereco],
  });
  res.json(listaRestaurantes);
});

// ROTA PARA LISTAR UM RESTAURANTE POR ID - GET
router.get("/restaurantes/:id", checkTokenValido, async (req, res) => {
  try {
    const restaurante = await Restaurante.findOne({
      where: { id: req.params.id },
      include: [Endereco],
    });
    if (restaurante) {
      res.status(201).json(restaurante);
    } else {
      res.status(404).json({ message: "Restaurante não encontrado." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA LISTAR RESTAURANTES POR NOME, CATEGORIA OU LOCALIZAÇÃO
router.get("/restaurante/:nome", checkTokenCliente, async (req, res) => {
  try {
    const restaurantes = await Restaurante.findAll({
      where: {
        [Op.or]: [
          {
            nomeFantasia: {
              [Op.like]: `%${req.params.nome}%`,
            },
          },
          {
            "$comidas.categoria$": {
              [Op.like]: `%${req.params.nome}%`,
            },
          },
          {
            "$endereco.cidade$": {
              [Op.like]: `%${req.params.nome}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Comida,
          attributes: ["categoria"],
        },
        {
          model: Endereco,
          attributes: ["cidade"],
        },
      ],
      order: [["nomeFantasia", "ASC"]],
    });
    if (restaurantes) {
      res.status(200).json(restaurantes);
    } else {
      res.status(404).json({ message: "Nenhum restaurante encontrado." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Ocorreu um erro. Por favor, tente novamente mais tarde.");
  }
});

//ROTA PARA LISTAR TODAS COMIDAS DO RESTAURANTE
router.get("/restaurantes/:id/cardapio/", checkTokenRestaurante, async (req, res) => {
    try {
      const restaurante = await Comida.findAll({
        where: { restauranteId: req.params.id },
      });
      if (restaurante) {
        res.status(201).json(restaurante);
      } else {
        res.status(404).json({ message: "Restaurante não encontrado." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Um erro aconteceu." });
    }
  }
);

//ROTA PARA ATUALIZAR UM RESTAURANTE - PUT
router.put("/restaurantes/:id", checkTokenRestaurante, async (req, res) => {
  const { nomeFantasia, razaoSocial, telefone, cnpj, email, senha, endereco } =
    req.body;
  const { id } = req.params;
  try {
    const restauranteAtt = await Restaurante.findByPk(id);
    const { error, value } = validacaoRestaurante.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (restauranteAtt) {
      if (endereco) {
        await Endereco.update(endereco, { where: { restauranteId: id } });
      }
      await restauranteAtt.update({
        nomeFantasia,
        razaoSocial,
        telefone,
        cnpj,
        email,
        senha,
      });
      res.status(200).json({ message: "Restaurante editado." });
    } else {
      res.status(404).json({ message: "Restaurante não encontrado" });
    }
  } catch (err) {
    res
      .status(500)
      .send("Ocorreu um erro. Por favor, tente novamente mais tarde.");
  }
});

// DELETE -> Remover restaurante;
router.delete("/restaurantes/:id", checkTokenRestaurante, async (req, res) => {
  const { id } = req.params;
  try {
    const deletaRestaurante = await Restaurante.findByPk(id);
    if (deletaRestaurante) {
      await deletaRestaurante.destroy();
      res.status(200).json({ message: "Restaurante removido." });
    } else {
      res.status(404).json({ message: "Restaurante não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
