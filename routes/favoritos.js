const { Router } = require("express");
const Cliente = require("../database/cliente");
const { Comida } = require("../database/comida");
const Restaurante = require("../database/restaurante");
const Favorito = require("../database/favorito");
const router = Router(); 
const { Op } = require("sequelize");


// Adicionando Restaurante Favorito
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

// Adicionando Comida Favorita
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



router.get("/favoritos/comidas/:clienteId", async (req, res) => {
    const { clienteId } = req.params;

    try {
        const favoritos = await Favorito.findAll({
            where: {
                comidaId: {
                    [Op.ne]: null,
                },
                clienteId: clienteId,
            },
            include: [
                {
                    model: Comida,
                    attributes: ["id", "nome", "descricao", "preco", "restauranteId"],
                    include: [
                        {
                            model: Restaurante,
                            attributes: ["nomeFantasia"],
                        },
                    ],
                },
            ],
        });

        const comidaIds = favoritos.map((favorito) => favorito.comidaId);
        const comidasFavoritadasUnico = Array.from(new Set(comidaIds));

        const comidasFavoritadas = await Comida.findAll({
            where: {
                id: {
                    [Op.in]: comidasFavoritadasUnico,
                },
            },
            attributes: ["id", "nome", "descricao", "preco", "restauranteId"],
            include: [
                {
                    model: Restaurante,
                    attributes: ["nomeFantasia"],
                },
            ],
        });

        if (comidasFavoritadas.length > 0) {
            res.status(200).json(comidasFavoritadas);
        } else {
            res.status(404).json({ message: "Nenhuma comida favorita encontrada para este cliente" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro 500" });
    }
});


// Listar Comida(s) Favorita(s)
router.get("/favoritos/comidas", async (req, res) => {
    const clienteId = req.params.clienteId
    try {
        const favoritos = await Favorito.findAll();
        res.status(201).json(favoritos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error 500"});
    }
});


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

router.delete("/favoritos/restaurantes/:id", async (req, res ) => {
    const {id } = req.params;
    const favorito = await Favorito.findOne({where:{ id }});
    try{
        if(favorito) {
            await favorito.destroy();
            res.status(200).json({message: "Restaurante favorito removido."})
        } else {
            res.status(404).json({message: "Restaurante não encontrado."})
        }
    } catch(err) {
        res.status(500).json({message:"Um erro aconteceu."})
    }
})

module.exports = router;