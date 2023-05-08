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

// ROTA PARA LISTAR UMA COMIDA POR ID
router.get("/comidas/:id", async (req, res) => {
  try {
    const comida = await Comida.findOne({
      where: { id: req.params.id },
    });
    if (comida) {
      res.status(201).json(comida);
    } else {
      res.status(404).json({ message: "Comida não encontrada." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// ROTA PARA EDITAR COMIDA
router.put("/comidas/:id", async (req, res) => {
  const { codigo, nome, descricao, categoria, preco, peso, imagem } = req.body;
  const { id } = req.params;
  try{
    const comida = await Comida.findByPk(id);

    if(comida) {
    await comida.update({codigo, nome, descricao, categoria, preco, peso, imagem })
    res.status(200).json({message: "Comida editada."})
    } else {
      res.status(404).json({message:"Comida não encontrada."})
    }
  } catch (err) {
    res.status(500).json("Ocorreu um erro.")
  }
})

module.exports = router;