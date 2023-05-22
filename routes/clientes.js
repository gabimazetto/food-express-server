// Importações necessárias
const Avaliacao = require("../database/avaliacao");
const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");
const Pedido = require("../database/pedido");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validacaoCliente = require("../validation/cliente");
const checkTokenCliente = require("../validation/tokenCliente");

// Criar o grupo de rotas (/clientes);
const router = Router();

// Definição de rotas

//INCIO JWT
// POST - ROTA PARA ADICIONAR UM CLIENTE COM SENHA CRIPTOGRAFADA (brcypt);
router.post("/clientes", async (req, res) => {
  const {
    nome,
    email,
    senha,
    confirmarSenha,
    telefone,
    cpf,
    dataNascimento,
    endereco,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);
    const { error, value } = validacaoCliente.validateAsync(req.body, {
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
    const novo = await Cliente.create(
      {
        nome,
        email,
        senha: senhaHash,
        telefone,
        cpf,
        dataNascimento,
        endereco,
      },
      { include: [Endereco] }
    );
    res.status(201).json({ novo, message: "Cliente adicionado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

//ROTA LOGIN -> CRIANDO TOKEN
router.post("/clientes/login", async (req, res) => {
  const { email, senha } = req.body;
  // validações
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }
  // checar se o cliente existe
  const cliente = await Cliente.findOne({ where: { email: email } });
  if (!cliente) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }
  // checar se a senha está correta
  const checkSenha = await bcrypt.compare(senha, cliente.senha);
  if (!checkSenha) {
    return res.status(422).json({ msg: "Senha inválida" });
  }
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: cliente.id,
        email: cliente.email,
        role: "cliente", // adicionando a informação de role
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
router.get("/clientes/home/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;
  // checar se o cliente existe
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }
  res.status(200).json({ msg: "Bem vindo a esta rota privada" });
});


//ROTA PUBLICA SEM NECESSIDADE DO TOKEN
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a API!" });
});

//FIM JWT

// ROTA PARA LISTAR UM CLIENTE POR ID - GET
router.get("/clientes/:id", checkTokenCliente, async (req, res) => {
  try {
    const cliente = await Cliente.findOne({
      where: { id: req.params.id },
      include: [Endereco],
    });
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

// ROTA PARA FILTRAR TODOS OS PEDIDOS DE CLIENTE
router.get("/clientes/:id/pedidos", checkTokenCliente, async (req, res) => {
  try {
    const pedidos = await Cliente.findAll({
      where: { id: req.params.id }, // Filtra pelo "id" do cliente
      include: [Pedido],
    });

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos do cliente" });
  }
});

// ROTA PARA FILTRAR TODAS AS AVALIAÇÕES FEITAS POR CLIENTE
router.get("/clientes/:id/avaliacaos", checkTokenCliente, async (req, res) => {
  try {
    const avaliacoes = await Cliente.findAll({
      where: { id: req.params.id }, // Filtra pelo "id" do cliente
      include: [Avaliacao],
    });

    res.json(avaliacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos do cliente" });
  }
});

// ROTA PARA ATUALIZAR UM CLIENTE - PUT
router.put("/clientes/:id", checkTokenCliente, async (req, res) => {
  const { nome, email, senha, telefone, cpf, dataNascimento, endereco } =
    req.body;
  const { id } = req.params;
  try {
    const atualizarCliente = await Cliente.findByPk(id);
    const { error, value } = validacaoJoi.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (atualizarCliente) {
      if (endereco) {
        await Endereco.update(endereco, { where: { clienteId: id } });
      }
      await atualizarCliente.update({
        nome,
        email,
        senha,
        telefone,
        cpf,
        dataNascimento,
      });
      res.status(200).json({ message: "Cliente editado." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA DELETAR UM CLIENTE - DELETE
router.delete("/clientes/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.findOne({ where: { id } });
  try {
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: "Cliente removido." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
