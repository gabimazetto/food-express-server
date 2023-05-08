const Item = require("../database/item");
const Cliente = require("../database/cliente");
const Restaurante = require("../database/restaurante");
const Pedido = require("../database/pedido");

const { Router } = require("express");

const router = Router();

router.post("/pedidos", async (req, res) => {
    const {dataRegistro, status, clienteId, restauranteId, itemId} = req.body;

    try {
        const cliente = await Cliente.findByPk(clienteId);
        const restaurante = await Restaurante.findByPk(restauranteId);
        const item = await Item.findByPk(itemId);

        if(cliente && restaurante && item) {
            const pedido = await Pedido.create({dataRegistro, status, clienteId, restauranteId, itemId});
            res.status(201).json(pedido);
        } else {
            res.status(404).json({message: "Deu Ruim"});
        } 
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Um erro aconteceu"});
    }
});

module.exports = router;