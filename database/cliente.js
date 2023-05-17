const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Endereco = require("./endereco");

const Cliente = connection.define(
  "cliente",
  {
    nome: {
      type: DataTypes.STRING(130),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { paranoid: true }
);

Cliente.hasOne(Endereco, { onDelete: "CASCADE" });
Endereco.belongsTo(Cliente);

module.exports = Cliente;
