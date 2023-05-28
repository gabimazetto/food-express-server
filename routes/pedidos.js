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
      order: [["dataRegistro", "DESC"]],
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
        order: [["dataRegistro", "DESC"]],
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
        order: [["dataRegistro", "DESC"]],
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
      include: [{
        model: Item,
        attributes: ["id", "comidaId"]
      }]
    });
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//ROTA PARA LISTAR PEDIDOS DE UM CLIENTE QUE ESTEJA PENDENTE
router.get("/pedidos/:clienteId", checkTokenCliente, async (req, res) => {
  const { clienteId } = req.params;
  try {
    const pedidos = await Pedido.findAll({
      where: {
        clienteId: clienteId,
        status: "Pendente"
      },
      include: [
        {
          model: Item,
          attributes: ["id", "quantidade"],
          include: {
            model: Comida,
            attributes: ["id", "nome", "preco"],
          },
        },
        {
          model: Cliente,
          include: {
            model: Endereco
          }
        },
        {
          model: EnderecoPedido,
        },
        {
          model: Restaurante,
          attributes: ["nomeFantasia", "cnpj", "telefone"],
        }
      ]
    });
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//ROTA PARA LISTAR PEDIDO POR ID
router.get("/pedido/unico/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findOne({
      where: { id },
      include: [
        {
          model: Item,
          attributes: ["id", "quantidade", "comidaId", "nome"],
          include: {
            model: Comida,
            attributes: ["nome"],
          },
        },
        {
          model: Cliente,
          include: {
            model: Endereco
          }
        },
        {
          model: EnderecoPedido,
        },
        {
          model: Restaurante,
          attributes: ["nomeFantasia", "cnpj", "telefone"],
        }
      ]

    });

    if (pedido) {
      res.status(200).json(pedido);
    } else {
      res.status(404).json({ message: "Pedido não encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao buscar os itens do pedido" });
  }
});

router.get("/pedidos/:restauranteId/:clienteId", checkTokenValido, async (req, res) => {
  const { restauranteId, clienteId } = req.params;
  try {
    const pedidos = await Pedido.findAll({
      where: {
        restauranteId: restauranteId,
        clienteId: clienteId,
        status: "Pendente"
      },
      include: [
        {
          model: Item,
          attributes: ["id", "comidaId"]
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
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});


// ROTA PARA ATUALIZAR UM PEDIDO - PUT
router.put("/pedidos/:id", checkTokenValido, async (req, res) => {
  const { status, metodoPagamento, enderecoPedido } = req.body;
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
      await pedido.update({ status, metodoPagamento });
      if (enderecoPedido) {
        await EnderecoPedido.update(enderecoPedido, { where: { pedidoId: id } });
      }
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
