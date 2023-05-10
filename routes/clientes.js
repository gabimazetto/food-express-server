// Importações necessárias
const Avaliacao = require("../database/avaliacao");
const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");
const Pedido = require("../database/pedido");
const { Router } = require("express");

// Criar o grupo de rotas (/clientes);
const router = Router();

// Definição de rotas

// POST - ROTA PARA ADICIONAR UM CLIENTE
router.post("/clientes", async (req, res) => {
    const { nome, email, senha, telefone, cpf, dataNascimento, endereco } =
        req.body;
    try {
        const novo = await Cliente.create(
            { nome, email, senha, telefone, cpf, dataNascimento, endereco },
            { include: [Endereco] }
        );
        res.status(201).json({ novo, message: "Cliente adicionado com sucesso" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

// ROTA PARA LISTAR TODOS OS CLIENTES - GET
router.get("/clientes", async (req, res) => {
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
});

// ROTA PARA LISTAR UM CLIENTE POR ID - GET
router.get("/clientes/:id", async (req, res) => {
    try {
        const cliente = await Cliente.findOne({
            where: { id: req.params.id },
            include: [Endereco],
        });
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" });
    }
});

// ROTA PARA FILTRAR TODOS OS PEDIDOS DE CLIENTE
router.get('/clientes/:id/pedidos', async (req, res) => {
    try {
        const pedidos = await Cliente.findAll({
            where: { id: req.params.id }, // Filtra pelo "id" do cliente
            include: [ Pedido ], 
          });
  
      res.json(pedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
    }
  });

  // ROTA PARA FILTRAR TODAS AS AVALIAÇÕES FEITAS POR CLIENTE
router.get('/clientes/:id/avaliacaos', async (req, res) => {
    try {
        const avaliacoes = await Cliente.findAll({
            where: { id: req.params.id }, // Filtra pelo "id" do cliente
            include: [ Avaliacao ], 
          });
  
      res.json(avaliacoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
    }
  });

// ROTA PARA ATUALIZAR UM CLIENTE - PUT
router.put("/clientes/:id", async (req, res) => {
    const { nome, email, senha, telefone, cpf, dataNascimento, endereco } =
        req.body;
    const { id } = req.params;
    try {
        const atualizarCliente = await Cliente.findByPk(id);
        if (atualizarCliente) {
            if (endereco) {
                await Endereco.update(endereco, { where: { clienteId: id } });
            }
            await atualizarCliente.update({
                nome,
                email,
                senha,
                telefone,
                cpf,
                dataNascimento,
            });
            res.status(200).json({ message: "Cliente editado." });
        } else {
            res.status(404).json({ message: "Cliente não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

// ROTA PARA DELETAR UM CLIENTE - DELETE
router.delete("/clientes/:id", async (req, res) => {
    const { id } = req.params;    
    const cliente = await Cliente.findOne({ where: { id } });
    try {
        if (cliente) {
            await cliente.destroy();
            res.status(200).json({ message: "Cliente removido." });
        } else {
            res.status(404).json({ message: "Cliente não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


module.exports = router;
