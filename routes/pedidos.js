const Item = require("../database/item");
const Cliente = require("../database/cliente");
const Restaurante = require("../database/restaurante");
const Pedido = require("../database/pedido");
const { Router } = require("express");
const { Comida } = require("../database/comida");
const Endereco = require("../database/endereco");
const { validacaoPedido, validacaoPedidoAtt } = require("../validation/pedido");
const EnderecoPedido = require("../database/enderecoPedido");
const checkTokenRestaurante = require("../validation/tokenRestaurante");
const checkTokenValido = require("../validation/tokenValido");
const checkTokenCliente = require("../validation/tokenCliente");

const router = Router();

// ROTA PARA ADICIONAR UM PEDIDO - POST
router.post("/pedidos", checkTokenCliente, async (req, res) => {
  const {
    dataRegistro,
    status,
    clienteId,
    restauranteId,
    metodoPagamento,
    enderecoPedido,
  } = req.body;
  try {
    const cliente = await Cliente.findByPk(clienteId);
    const restaurante = await Restaurante.findByPk(restauranteId);
    const { error, value } = validacaoPedido.validateAsync(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (cliente && restaurante) {
      const pedido = await Pedido.create(
        {
          dataRegistro,
          status,
          clienteId,
          restauranteId,
          metodoPagamento,
          enderecoPedido,
        },
        { include: [EnderecoPedido] }
      );
      res.status(201).json(pedido);
    } else {
      res.status(404).json({ message: "Pedido não pode ser adicionado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

// ROTA PARA LISTAR PEDIDOS ORDENADOS POR DATA - GET
router.get("/pedidos", checkTokenValido, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Item,
          attributes: ["quantidade"],
          include: [
            {
              model: Comida,
              attributes: ["nome"],
            },
          ],
        },
        {
          model: Cliente,
        },
        {
          model: EnderecoPedido,
        },
        {
          model: Restaurante,
          attributes: ["nomeFantasia", "cnpj", "telefone"],
        },
      ],
      order: [["dataRegistro", "ASC"]],
    });
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA LISTAR PEDIDOS EFETUADOS PELO CLIENTE
router.get("/pedidos/cliente/:clienteId", checkTokenCliente, async (req, res) => {
  const { clienteId } = req.params;
  try {
    const pedidos = await Pedido.findAll({
      where: { clienteId: clienteId },
      include: [
        {
          model: Item,
          attributes: ["quantidade"],
          include: [
            {
              model: Comida,
              attributes: ["nome"],
            },
          ],
        },
        {
          model: Cliente,
        },
        {
          model: EnderecoPedido,
        },
        {
          model: Restaurante,
          attributes: ["nomeFantasia"],
        },
      ],
      order: [["dataRegistro", "DESC"]],
    });
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA LISTAR PEDIDOS RECEBIDOS PELO RESTAURANTE
router.get("/pedidos/restaurante/:restauranteId", checkTokenRestaurante, async (req, res) => {
  const { restauranteId } = req.params;
  const { status } = req.query;
  try {
    if (status) {
      const pedidos = await Pedido.findAll({
        where: { restauranteId: restauranteId, status: status },
        include: [
          {
            model: Item,
            attributes: ["quantidade"],
            include: [
              {
                model: Comida,
                attributes: ["nome"],
              },
            ],
          },
          {
            model: Cliente,
          },
          {
            model: EnderecoPedido,
          },
          {
            model: Restaurante,
            attributes: ["nomeFantasia"],
          },
        ],
        order: [["dataRegistro", "ASC"]],
      });
      res.status(200).json(pedidos);
    } else {
      const pedidos = await Pedido.findAll({
        where: { restauranteId: restauranteId },
        include: [
          {
            model: Item,
            attributes: ["quantidade"],
            include: [
              {
                model: Comida,
                attributes: ["nome"],
              },
            ],
          },
          {
            model: Cliente,
          },
          {
            model: EnderecoPedido,
          },
          {
            model: Restaurante,
            attributes: ["nomeFantasia"],
          },
        ],
        order: [["dataRegistro", "ASC"]],
      });
      res.status(200).json(pedidos);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//ROTA PARA LISTAR PEDIDOS PELO CLIENTE E RESTAURANTE QUE ESTEJA PENDENTE
router.get("/pedidos/:restauranteId/:clienteId", checkTokenValido, async (req, res) => {
  const { restauranteId, clienteId } = req.params;
  try {
    const pedidos = await Pedido.findAll({
      where: {
        restauranteId: restauranteId,
        clienteId: clienteId,
        status: "Pendente"
      },
      include: {
        model: Item
      }
    })
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
})

// ROTA PARA ATUALIZAR UM PEDIDO - PUT
router.put("/pedidos/:id", checkTokenRestaurante, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id);
    const { error, value } = validacaoPedidoAtt.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (pedido) {
      await pedido.update({ status });
      res.status(200).json({ message: "Pedido atualizado." });
    } else {
      res.status(404).json({ message: "Pedido não encontrado." });
    }
  } catch (err) {
    res.status(500).json("Ocorreu um erro.");
  }
});

// ROTA PARA A REMOÇÃO DE UM PEDIDO - DELETE
router.delete("/pedidos/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;
  const pedido = await Pedido.findOne({ where: { id } });
  try {
    if (pedido) {
      await pedido.destroy();
      res.status(200).json({ message: "Pedido removido." });
    } else {
      res.status(404).json({ message: "Pedido não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//ROTA PARA LISTAR PEDIDO DE DETERMINADO CLIENTE
router.get("/pedidos/cliente/:clienteId/:pedidoId", checkTokenCliente, async (req, res) => {
  const { clienteId, pedidoId } = req.params;
  try {
    const pedido = await Pedido.findOne({
      where: { clienteId: clienteId, id: pedidoId },
      include: [
        {
          model: Item,
          attributes: ["quantidade"],
          include: [
            {
              model: Comida,
              attributes: ["nome", "preco"],
            },
          ],
        },
        {
          model: Cliente,
        },
        {
          model: EnderecoPedido,
        },
        {
          model: Restaurante,
          attributes: ["nomeFantasia", "cnpj", "telefone"],
        },
      ],
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    res.status(200).json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
