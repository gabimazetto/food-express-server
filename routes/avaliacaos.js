const { Router } = require("express");
const Avaliacao = require("../database/avaliacao");
const Restaurante = require("../database/restaurante");
const Pedido = require("../database/pedido");
const Cliente = require("../database/cliente");
const validacaoAvaliacao = require("../validation/avaliacao");

const router = Router();

// ROTA PARA ADICIONAR AVALIACAO - POST
router.post("/avaliacaos", async (req, res) => {
  const { avaliacao, comentario, clienteId, restauranteId, pedidoId } =
    req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);
    const restaurante = await Restaurante.findByPk(restauranteId);
    const pedido = await Pedido.findByPk(pedidoId);
    const { error, value } = validacaoAvaliacao.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (
      pedido &&
      pedido.status === "Entregue" &&
      cliente &&
      (restaurante || pedido)
    ) {
      const avaliar = await Avaliacao.create({
        avaliacao,
        comentario,
        clienteId,
        restauranteId,
        pedidoId,
      });
      res.status(200).json(avaliar);
    } else {
      res.status(404).json({ message: "Avaliação não pode ser adicionada." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA LISTAR AVALIAÇÕES POR ID DE RESTAURANTE - GET
router.get("/avaliacaos/:restauranteId", async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.findAll({
      where: { restauranteId: req.params.restauranteId },
    });
    res.json(avaliacoes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

router.get("/avaliacaos/cliente/:clienteId", async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.findAll({
      where: { clienteId: req.params.clienteId },
    });
    res.json(avaliacoes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

// ROTA PARA REMOVER UMA AVALIAÇÃO - DELETE
router.delete("/avaliacaos/:id", async (req, res) => {
  const { id } = req.params;
  const avaliacao = await Avaliacao.findOne({ where: { id } });
  try {
    if (avaliacao) {
      await avaliacao.destroy();
      res.status(200).json({ message: "Avaliação removida." });
    } else {
      res.status(404).json({ message: "Avaliação não encontrada." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//Editar uma avaliação por ID
router.put("/avaliacaos/:id", async (req, res) => {
  const { avaliacao, comentario } = req.body;
  const { id } = req.params;
  try {
    const avaliar = await Avaliacao.findByPk(id);
    const { error, value } = validacaoRestaurante.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (avaliar) {
      await avaliar.update({ avaliacao, comentario });
      res.status(200).json({ message: "Sua avaliação foi atualizada." });
    } else {
      res.status(404).json({ message: "Avaliação não encontrada." });
    }
  } catch (err) {
    res.status(500).json("Ocorreu um erro.");
    console.log(err);
  }
});

module.exports = router;
