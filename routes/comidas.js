const { Op } = require("sequelize");
const { Router } = require("express");
const { Comida, uploadImagemComida } = require("../database/comida");

// Importar o Multer para gerenciar o upload dos arquivos do form.
const multer = require("multer");
const { validacaoComida, validacaoComidaAtt } = require("../validation/comida");
const upload = multer();

const router = Router();

// ROTA PARA CADASTRAR UMA COMIDA
// Logo após a rota, é necessário passar o upload.single("nomeDoCampoQueRecebeArquivo").
router.post("/comidas", upload.single("imagem"), async (req, res) => {
  const { codigo, nome, descricao, categoria, preco, peso, restauranteId } =
    req.body;
  try {
    const { error, value } = validacaoComida.validate(req.body);
    if (error) {
      return res.status(520).json({ msg: " Erro na validação do Joi" });
    } else if (
      codigo &&
      nome &&
      descricao &&
      categoria &&
      preco &&
      peso &&
      restauranteId
    ) {
      const imagemURL = await uploadImagemComida(req.file);
      const novaComida = await Comida.create({
        codigo,
        nome,
        descricao,
        categoria,
        preco,
        peso,
        imagem: imagemURL,
        restauranteId,
      });
      res.status(201).json(novaComida);
    } else if (!restauranteId) {
      res.status(404).json({ message: "Restaurante não encontrado." });
    } else {
      res.status(400).json({ message: "Requisição inválida." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// ROTA PARA LISTAR TODAS AS COMIDAS
// router.get("/comidas", async (req, res) => {
//   try {
//     const listaComidas = await Comida.findAll();
//     res.status(201).json(listaComidas);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Um erro aconteceu." });
//   }
// });

// ROTA PARA LISTAR COMIDAS FILTRADAS POR CATEGORIA, NOME E DESCRIÇÃO
router.get("/comidas", async (req, res) => {
  const categoria = req.query.categoria;
  const nome = req.query.nome;
  const descricao = req.query.descricao;

  const whereClause = {};
  if (nome) {
    whereClause.nome = { [Op.like]: `%${nome}%` };
  }
  if (descricao) {
    whereClause.descricao = { [Op.like]: `%${descricao}%` };
  }
  if (categoria) {
    whereClause.categoria = { [Op.eq]: categoria };
  }
  const listaComidas = await Comida.findAll({ where: whereClause });
  res.json(listaComidas);
});

// ROTA PARA LISTAR UMA COMIDA POR ID
router.get("/comidas/:id", async (req, res) => {
  try {
    const comida = await Comida.findOne({
      where: { id: req.params.id },
    });
    if (comida) {
      res.status(201).json(comida);
    } else {
      res.status(404).json({ message: "Comida não encontrada." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA LISTAR TODAS COMIDAS DE UM RESTAURANTE
router.get("/comidas/restaurante/:id", async (req, res) => {
  try {
    const comida = await Comida.findAll({
      where: { restauranteId: req.params.id },
    });
    if (comida) {
      res.status(201).json(comida);
    } else {
      res.status(404).json({ message: "Comida não encontrada." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA EDITAR COMIDA
router.put("/comidas/:id", upload.single("imagem"), async (req, res) => {
  const { codigo, nome, descricao, categoria, preco, peso } = req.body;
  try {
    const comida = await Comida.findByPk(req.params.id);
    const { error, value } = validacaoComidaAtt.validate(req.body);
    if (error) {
      return res.status(520).json({ msg: " Erro na validação do Joi" });
    } else if (!comida) {
      res.status(404).json({ message: "Comida não encontrada." });
      return;
    }

    if (codigo && nome && descricao && categoria && preco && peso) {
      const imagemURL = comida.imagem;
      if (req.file) {
        imagemURL = await uploadImagemComida(req.file);
      }

      const updatedComida = await comida.update({
        codigo,
        nome,
        descricao,
        categoria,
        preco,
        peso,
        imagem: imagemURL,
      });
      res.status(200).json(updatedComida);
    } else {
      res.status(400).json({ message: "Requisição inválida." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.messages });
  }
});

// ROTA DELETE PARA COMIDA
router.delete("/comidas/:id", async (req, res) => {
  const { id } = req.params;
  const comida = await Comida.findOne({ where: { id } });
  try {
    if (comida) {
      await comida.destroy();
      res.status(200).json({ message: "Comida removida." });
    } else {
      res.status(404).json({ message: "Comida não encontrada." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
