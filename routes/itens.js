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

// ROTA PARA ATUALIZAR UM ITEM - PUT
router.put("/itens/:id", async (req, res) => {
    const { quantidade, comidaId  } = req.body;
    const { id } = req.params;
    try{
      const item = await Item.findByPk(id);  
      if(item) {
      await item.update({ quantidade, comidaId })
      res.status(200).json({message: "Item atualizado."})
      } else {
        res.status(404).json({message:"Item não encontrado."})
      }
    } catch (err) {
      res.status(500).json("Ocorreu um erro.")
    }
  })

// ROTA PARA A REMOÇÃO DE UM ITEM - DELETE
router.delete("/itens/:id", async (req, res) => {
    const { id } = req.params;    
    const item = await Item.findOne({ where: { id } });
    try {
        if (item) {
            await item.destroy();
            res.status(200).json({ message: "Item removido." });
        } else {
            res.status(404).json({ message: "Item não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

module.exports = router;