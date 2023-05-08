const { Router } = require("express");
const Restaurante = require("../database/restaurante");
const Endereco = require("../database/endereco");

const router = Router();


// GET -> Listagem de todos restaurantes;
router.get("/restaurantes", async (req, res) => {
    const listaRestaurantes = await Restaurante.findAll();
    res.json(listaRestaurantes)
})


// POST
router.post("/restaurantes", async (req, res) => {
    const { nomeFantasia, razaoSocial, cnpj, email, senha, endereco } = req.body;

    try {
        const novo = await Restaurante.create(
            { nomeFantasia, razaoSocial, cnpj, email, senha, endereco },
            { include: [ Endereco ]}
        );
                res.status(201).json(novo);
    } catch (err) {
        res.status(500).send('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
})



module.exports = router;
