const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Restaurante = require("./restaurante");
const { Comida } = require("./comida");
const Cliente = require("./cliente");

const Favorito = connection.define("favorito", {
  favoritar: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },  
});

Restaurante.hasMany(Favorito, { foreignKey: "restauranteId" });
Favorito.belongsTo(Restaurante, { foreignKey: "restauranteId" });

Comida.hasMany(Favorito, { foreignKey: "comidaId" });
Favorito.belongsTo(Comida, { foreignKey: "comidaId" });

Cliente.hasMany(Favorito, { foreignKey: "clienteId" });
Favorito.belongsTo(Cliente, { foreignKey: "clienteId" });

module.exports = Favorito;
