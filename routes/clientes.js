// Importações necessárias
const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");
const { Router } = require("express");

// Criar o grupo de rotas (/clientes);
const router = Router();

// Definição de rotas

// POST
router.post("/clientes", async (req, res) =>{
    // Coletar dados do req.body
    const { nome, email, senha, telefone, cpf, dataNascimento, endereco } = req.body;

    try {
        const novo = await Cliente.create(
            { nome, email, senha, telefone, cpf, dataNascimento, endereco },
            { include: [Endereco] }
        );
        
        res.status(201).json({ novo, message: "Cliente adicionado com sucesso" });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

// GET
router.get("/clientes", async (req, res) =>{
    // SELECT * FROM clientes;
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
})






module.exports = router;
