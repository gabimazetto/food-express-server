const { Router } = require("express");
const Comida = require("../database/comida");

const router = Router();

// ROTA PARA CADASTRAR UMA COMIDA
router.post("/comidas", async (req, res) => {
  const { codigo, nome, descricao, categoria, preco, peso, imagem } = req.body;
  try {
    const novaComida = await Comida.create({ codigo, nome, descricao, categoria, preco, peso, imagem });
    res.status(201).json(novaComida);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA LISTAR TODAS AS COMIDAS
router.get("/comidas", async (req, res) => {
  try {
    const listaComidas = await Comida.findAll();
    res.status(201).json(listaComidas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});


module.exports = router;