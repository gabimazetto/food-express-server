const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Cliente = require("./cliente");
const Item = require("./item");
const Restaurante = require("./restaurante");
const EnderecoPedido = require("./enderecoPedido");


const Pedido = connection.define("pedido", {
  dataRegistro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pendente",
    validate: {
      isIn: [["Pendente", "Aguardando confirmação", "Confirmado", "A caminho", "Entregue", "Cancelado"]]
    }
  },
  metodoPagamento: {
    type: DataTypes.STRING,
    validate: {
      isIn: [["Cartão de crédito", "Cartão de débito", "Dinheiro", "PIX", "VR", "VA", "Carteira Digital"]]
    },
  }  
}, { paranoid: true });


Pedido.hasMany(Item, { foreignKey: "pedidoId" });
Item.belongsTo(Pedido, { foreignKey: "pedidoId" });

Pedido.belongsTo(Cliente, { foreignKey: "clienteId" });
Cliente.hasOne(Pedido, { foreignKey: "clienteId" });

Restaurante.hasMany(Pedido, { foreignKey: "restauranteId" });
Pedido.belongsTo(Restaurante, { foreignKey: "restauranteId" });

Pedido.hasOne(EnderecoPedido, { foreignKey: "pedidoId" });
EnderecoPedido.belongsTo(Pedido, { foreignKey: "pedidoId" });

module.exports = Pedido;
