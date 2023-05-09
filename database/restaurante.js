const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Endereco = require("./endereco");

const Restaurante = connection.define("restaurante", {
  nomeFantasia: {
    type: DataTypes.STRING(130),
    allowNull: false
  },
  razaoSocial: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { paranoid: true });

Restaurante.hasOne(Endereco, { onDelete: "CASCADE" });
Endereco.belongsTo(Restaurante);

module.exports = Restaurante;