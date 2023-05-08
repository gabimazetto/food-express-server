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
});


//PUT
router.put("/restaurantes/:id", async (req, res) =>{
    const { nomeFantasia, razaoSocial, cnpj, email, senha, endereco } = req.body;
    const { id } = req.params;

    try {
        const restauranteAtt = await Restaurante.findByPk(id);
        
        if(restauranteAtt) {
            if(endereco) {
                await Endereco.update(endereco, { where: { restauranteId: id } })
            }
            await restauranteAtt.update({ nomeFantasia, razaoSocial, cnpj, email, senha });
            res.status(200).json({ message: "Restaurante editado."})
        } else {
            res.status(404).json({ message: "Restaurante não encontrado" })
        }
    } catch (err) {
        res.status(500).send('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
});


module.exports = router;
