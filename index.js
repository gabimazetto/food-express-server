const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(cors({ origin: "http://localhost:3000" }));

const { connection, authenticate } = require("./database/database");
authenticate(connection);

// Modelo para criação de rotas:
// const rotaTal = require("./routes/rotaTal");
const rotasClientes = require("./routes/clientes");
const rotasRestaurantes = require("./routes/restaurantes");

// Modelo para configurar as rotas para uso do app
// app.use(rotaTal);
app.use(rotasClientes);
app.use(rotasRestaurantes);

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
