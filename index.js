// Importações principais e variáveis de ambiente
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON
app.use(morgan("dev"));

// Configurações de acesso
app.use(cors({ origin: "http://localhost:3000" }));

// Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão


// Modelo para criação de rotas:
// const rotaTal = require("./routes/rotaTal");


// Modelo para configurar as rotas para uso do app
// app.use(rotaTal);

// Placeholder até fazer as rotas:
const Cliente = require("./database/cliente");
const Comida = require("./database/comida");
const Endereco = require("./database/endereco");
const Pedido = require("./database/pedido");
const Restaurante = require("./database/restaurante");
const Item = require("./database/item");

app.listen(3001, () => {
    // É bom manter o Force: true até todos os modelos de tabela
    // estarem funcionando certinho como o previsto
    connection.sync({force:true});
    console.log("Servidor rodando em http://localhost:3001/");
});
