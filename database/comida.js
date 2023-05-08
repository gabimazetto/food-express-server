const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Restaurante = require("./restaurante");

const Comida = connection.define(
    "comida",
    {
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nome: {
            type: DataTypes.STRING(130),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [
                    [
                        "Açaí",
                        "Lanche",
                        "Pizza",
                        "Brasileira",
                        "Italiana",
                        "Sobremesa",
                        "Japonesa",
                        "Chinesa",
                        "Vegetariana",
                        "Padaria",
                        "Marmita",
                        "Carne",
                        "Fit",
                        "Árabe",
                    ],
                ],
            },
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        peso: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        imagem: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { paranoid: true }
);

Restaurante.hasMany(Comida, { foreignKey: "restauranteId" });
Comida.belongsTo(Restaurante, { foreignKey: "restauranteId" });

module.exports = Comida;
