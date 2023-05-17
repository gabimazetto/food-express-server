const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const EnderecoPedido = connection.define("enderecoPedido", {

    rua: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
    },
    complemento: {
        type: DataTypes.STRING,
    },
});

module.exports = EnderecoPedido;