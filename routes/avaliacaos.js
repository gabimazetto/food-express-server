const { Router } = require("express");
const Avaliacao = require("../database/avaliacao");
const Restaurante = require("../database/restaurante");
const Pedido = require("../database/pedido");
const Cliente = require("../database/cliente");

const router = Router();

// ROTA PARA ADICIONAR AVALIACAO - POST
router.post ("/avaliacaos", async (req,res) => {
    const { avaliacao, comentario, clienteId, restauranteId, pedidoId } = req.body;
    try {
        const cliente = await Cliente.findByPk(clienteId)
        const restaurante = await Restaurante.findByPk(restauranteId)
        const pedido = await Pedido.findByPk(pedidoId)
        if (cliente && (restaurante || pedido)) {
            const avaliar = await Avaliacao.create({avaliacao, comentario, clienteId, restauranteId, pedidoId})
            res.status(200).json(avaliar);
        } else {
            res.status(404).json({message:"Avaliação não pode ser adicionada."})
        }
    } catch (err){
        console.log(err);
        res.status(500).json({message:"Um erro aconteceu."})
    }
})

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


module.exports = router;