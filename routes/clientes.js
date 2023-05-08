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

// GET BY ID 
router.get("/clientes/:id", async (req, res) => {
    // SELECT * FROM clientes WHERE id = x

    try{
        const cliente = await Cliente.findOne({
            where: {id: req.params.id},
            include: [Endereco]
        });
    
        if(cliente) {
            res.json(cliente);
        }else{
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

//PUT -> Atualizar cliente;

router.put("/clientes/:id", async (req, res) => {
    const { nome, email, senha, telefone, cpf, dataNascimento, endereco } = req.body;
    const { id } = req.params;
    try{
        const atualizarCliente = await Cliente.findByPk( id );
        if(atualizarCliente){
            if(endereco){
                await Endereco.update( endereco, {where: {clienteId: id}});
            }
            await atualizarCliente.update({ nome, email, senha, telefone, cpf, dataNascimento });
            res.status(200).json({ message: "Cliente editado." });
        } else {
            res.status(404).json({ message: "Cliente não encontrado." });
        }
    }catch (err) {
        console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
    }
});





module.exports = router;
