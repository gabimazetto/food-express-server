const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Cliente = require("./cliente");
const Item = require("./item");
const Restaurante = require("./restaurante");

const Pedido = connection.define("pedido", {
  dataRegistro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {    
    type: DataTypes.STRING,
    defaultValue: "Pendente",
    validate: {
      isIn: [[ "Pendente", "Aguardando confirmação", "Confirmado", "A caminho", "Entregue", "Cancelado"]]
    },
  }
}, { paranoid: true });

Item.hasMany(Pedido, { foreignKey: "itemId" });
Pedido.belongsTo(Item, { foreignKey: "itemId" });

Cliente.hasMany(Pedido, { foreignKey: "clienteId" });
Pedido.belongsTo(Cliente, { foreignKey: "clienteId" });

Restaurante.hasMany(Pedido, { foreignKey: "restauranteId" });
Pedido.belongsTo(Restaurante, { foreignKey: "restauranteId" });

module.exports = Pedido;
