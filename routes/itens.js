const express = require("express");
const router = express.Router();
const Item = require("../database/item");
const Comida = require("../database/comida");

// ROTA PARA ADICIONAR UM ITEM - POST
router.post("/itens", async (req, res) => {
    //Puxando dados do req.body
    const { quantidade, comidaId } = req.body;
    try {
        // Verifica se a quantidade e a comida existe e se são maiores que 0
        if( quantidade && quantidade > 0 && comidaId && comidaId > 0 ){
            // Verifica se existe uma comida com esse id cadastrada no banco de dados
            const comida = await Comida.findByPk(comidaId);
            // Se existir, cria um novo item
            if(comida){
                const novoItem = await Item.create({ quantidade, comidaId });
                res.status(201).json(novoItem);
            } else {
                res.status(404).json({ message: "Comida não encontrada" });
            }
        } else{
            res.status(400).json({ message: "Insira uma quantidade válida para comida e para o Id" });
        }
    } catch (err){
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

// ROTA PARA LISTAR TODOS OS ITENS - GET
router.get("/itens", async (req, res) => {
    const listaItens = await Item.findAll();
    res.json(listaItens);
});


module.exports = router;