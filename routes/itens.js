const express = require("express");
const Item = require("../database/item");
const { Comida } = require("../database/comida");
const validacaoItem = require("../validation/item");
const Pedido = require("../database/pedido");
const Restaurante = require("../database/restaurante");
const checkTokenValido = require("../validation/tokenValido");
const checkTokenCliente = require("../validation/tokenCliente");

const router = express.Router();

// ROTA PARA ADICIONAR UM ITEM - POST
router.post("/itens", checkTokenCliente, async (req, res) => {
  //Puxando dados do req.body
  const { quantidade, comidaId, pedidoId } = req.body;
  try {
    const { error, value } = validacaoItem.validateAsync(req.body, {abortEarly: false});
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    }
    // Verifica se a quantidade e a comida existe e se são maiores que 0
    else if (quantidade && quantidade > 0 && comidaId && comidaId > 0) {
      // Verifica se existe uma comida com esse id cadastrada no banco de dados
      const comida = await Comida.findByPk(comidaId);
      const pedido = await Pedido.findByPk(pedidoId);
      // Se existir, cria um novo item
      if (comida && pedido) {
        const novoItem = await Item.create({ quantidade, comidaId, pedidoId });
        res.status(201).json(novoItem);
      } else {
        res.status(404).json({ message: "Comida não encontrada" });
      }
    } else {
      res.status(400).json({
        message: "Insira uma quantidade válida para comida e para o Id",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROTA PARA LISTAR TODOS OS ITENS - GET
router.get("/itens", checkTokenCliente, async (req, res) => {
  const listaItens = await Item.findAll();
  res.json(listaItens);
});

//ROTA PARA LISTAR PEDIDOS DE CLIENTEID E RESTAURANTEID QUE ESTEJA PENDENTE
router.get("/itens/:restauranteId/:clienteId", checkTokenValido, async (req, res) => {
  const { restauranteId, clienteId } = req.params;

  try {
    const itens = await Item.findAll({
      include: [
        {
          model: Pedido,
          where: {
            restauranteId: restauranteId,
            clienteId: clienteId,
            status: "Pendente"
          }
        }
      ]
    });

    res.status(200).json(itens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});


// ROTA PARA ATUALIZAR UM ITEM - PUT
router.put("/itens/:id", checkTokenCliente, async (req, res) => {
  const { quantidade, comidaId, pedidoId } = req.body;
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    const { error, value } = validacaoItem.validateAsync(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (item) {
      await item.update({ quantidade, comidaId, pedidoId });
      res.status(200).json({ message: "Item atualizado." });
    } else {
      res.status(404).json({ message: "Item não encontrado." });
    }
  } catch (err) {
    res.status(500).json("Ocorreu um erro.");
  }
});

// ROTA PARA A REMOÇÃO DE UM ITEM - DELETE
router.delete("/itens/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;
  const item = await Item.findOne({ where: { id } });
  try {
    if (item) {
      await item.destroy();
      res.status(200).json({ message: "Item removido." });
    } else {
      res.status(404).json({ message: "Item não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
