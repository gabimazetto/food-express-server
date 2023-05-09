const Item = require("../database/item");
const Cliente = require("../database/cliente");
const Restaurante = require("../database/restaurante");
const Pedido = require("../database/pedido");

const { Router } = require("express");

const router = Router();

// ROTA PARA ADICIONAR UM PEDIDO - POST
router.post("/pedidos", async (req, res) => {
    const { dataRegistro, status, clienteId, restauranteId, itemId } = req.body;
    try {
        const cliente = await Cliente.findByPk(clienteId);
        const restaurante = await Restaurante.findByPk(restauranteId);
        const item = await Item.findByPk(itemId);

        if (cliente && restaurante && item) {
            const pedido = await Pedido.create({ dataRegistro, status, clienteId, restauranteId, itemId });
            res.status(201).json(pedido);
        } else {
            res.status(404).json({ message: "Pedido não pode ser adicionado" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

// ROTA PARA A REMOÇÃO DE UM PEDIDO - DELETE
router.delete("/pedidos/:id", async (req, res) => {
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

module.exports = router;