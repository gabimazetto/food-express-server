const { Router } = require("express");
const Avaliavao = require("../database/avaliacao");

const router = Router();

// ROTA PARA ADICIONAR AVALIACAO - POST
router.post("/avaliacao", async (req, res) => {
    const { avaliacao, comentario } = req.body;
    try {
        const novo = await Avaliavao.create(
            { avaliacao, comentario }
        );
        res.status(201).json(novo);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

module.exports = router;