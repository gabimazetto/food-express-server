const { Router } = require("express");
const Restaurante = require("../database/restaurante");
const Endereco = require("../database/endereco");
const { Op } = require("sequelize");
const { Comida } = require("../database/comida");

const router = Router();

// ROTA PARA ADICIONAR UM RETAURANTE - POST
router.post("/restaurantes", async (req, res) => {
    const { nomeFantasia, razaoSocial, cnpj, email, senha, endereco } = req.body;
    try {
        const novo = await Restaurante.create(
            { nomeFantasia, razaoSocial, cnpj, email, senha, endereco },
            { include: [Endereco] }
        );
        res.status(201).json(novo);
    } catch (err) {
        res.status(500).send('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
});


router.get("/restaurantes", async (req, res) => {
    const listaRestaurantes = await Restaurante.findAll({
        include:[Endereco]
    });
    res.json(listaRestaurantes)
});

// ROTA PARA LISTAR UM RESTAURANTE POR ID - GET
router.get("/restaurantes/:id", async (req, res) => {
    try {
        const restaurante = await Restaurante.findOne({
            where: { id: req.params.id },
            include:[Endereco]
        });
        if (restaurante) {
            res.status(201).json(restaurante);
        } else {
            res.status(404).json({ message: "Restaurante não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

// ROTA PARA LISTAR RESTAURANTES POR NOME, CATEGORIA OU LOCALIZAÇÃO
router.get("/restaurante/:nome", async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll({
            where: {
                [Op.or]: [
                    {
                        nomeFantasia: {
                            [Op.like]: `%${req.params.nome}%`
                        }
                    }, {
                        "$comidas.categoria$": {
                            [Op.like]: `%${req.params.nome}%`
                        }
                    }, {
                        "$endereco.cidade$": {
                            [Op.like]: `%${req.params.nome}%`
                        }
                    }]
            },
            include: [
                {
                    model: Comida,
                    attributes: ["categoria"]
                },
                {
                    model: Endereco,
                    attributes: ["cidade"]
                }
            ],
            order: [["nomeFantasia", "ASC"]]
        });
        if (restaurantes) {
            res.status(200).json(restaurantes);
        } else {
            res.status(404).json({ message: "Nenhum restaurante encontrado." });
        }
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .send("Ocorreu um erro. Por favor, tente novamente mais tarde.");
    }
});

//ROTA PARA LISTAR TODAS COMIDAS DO RESTAURANTE
router.get("/restaurantes/:id/cardapio/", async (req, res) => {
    try {
        const restaurante = await Restaurante.findOne({
            where: { id: req.params.id },
            include: [Comida]
        });
        if (restaurante) {
            res.status(201).json(restaurante);
        } else {
            res.status(404).json({ message: "Restaurante não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

//ROTA PARA ATUALIZAR UM RESTAURANTE - PUT
router.put("/restaurantes/:id", async (req, res) => {
    const { nomeFantasia, razaoSocial, cnpj, email, senha, endereco } = req.body;
    const { id } = req.params;
    try {
        const restauranteAtt = await Restaurante.findByPk(id);

        if (restauranteAtt) {
            if (endereco) {
                await Endereco.update(endereco, { where: { restauranteId: id } })
            }
            await restauranteAtt.update({ nomeFantasia, razaoSocial, cnpj, email, senha });
            res.status(200).json({ message: "Restaurante editado." })
        } else {
            res.status(404).json({ message: "Restaurante não encontrado" })
        }
    } catch (err) {
        res.status(500).send('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
});


// DELETE -> Remover restaurante;
router.delete("/restaurantes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletaRestaurante = await Restaurante.findByPk(id);
        if (deletaRestaurante) {
            await deletaRestaurante.destroy();
            res.status(200).json({ message: "Restaurante removido." });
        } else {
            res.status(404).json({ message: "Restaurante não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


module.exports = router;
