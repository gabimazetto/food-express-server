const { Router } = require("express");
const Cliente = require("../database/cliente");
const { Comida } = require("../database/comida");
const Restaurante = require("../database/restaurante");
const Favorito = require("../database/favorito");
const router = Router(); 

router.post("/favoritos/restaurantes", async (req, res) => {
    const { favoritar, restauranteId, clienteId } = req.body;
    try {
        const cliente = await Cliente.findByPk(clienteId);
        const restaurante = await Restaurante.findByPk(restauranteId);

        if (cliente && restaurante) {
            const novoFavorito = await Favorito.create({ favoritar, restauranteId, clienteId })
            res.status(201).json(novoFavorito);
        } else {
            res.status(404).json({ message: "Not Found"})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error 500"})
    }
});

router.post("/favoritos/comidas", async (req, res) => {
    const { favoritar, comidaId, clienteId } = req.body;
    try {
        const cliente = await Cliente.findByPk(clienteId);
        const comida = await Comida.findByPk(comidaId);

        if (cliente && comida) {
            const novoFavorito = await Favorito.create({ favoritar, comidaId, clienteId })
            res.status(201).json(novoFavorito);
        } else {
            res.status(404).json({ message: "Not Found"})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error 500"})
    }
});

router.get("/favoritos/comidas", async (req, res) => {
    const clienteId = req.params.clienteId
    try {
        const favoritos = await Favorito.findAll();
        res.status(201).json(favoritos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error 500"});

// ROTA PARA REMOVER UMA COMIDA FAVORITA - DELETE
router.delete("/favoritos/comidas/:id", async (req, res) => {
    const { id } = req.params;    
    const favorito = await Favorito.findOne({ where: { id } });    
    try {
        if (favorito) {
            await favorito.destroy();
            res.status(200).json({ message: "Comida favorita removida." });
        } else {
            res.status(404).json({ message: "Comida favorita não encontrada." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

module.exports = router;