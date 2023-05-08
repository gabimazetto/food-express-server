const { Router } = require("express");
const Comida = require("../database/comida");

const router = Router();

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

module.exports = router;