const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Restaurante = require("./restaurante");
const Pedido = require("./pedido");
const Cliente = require("./cliente");

const Avaliacao = connection.define("avaliacao", {
  avaliacao: {
    type: DataTypes.STRING,    
    validate: {
      isIn: [[ "1", "2", "3", "4", "5" ]]
    },
  },
  comentario: {
    type: DataTypes.STRING(155),  
  }  
});

Restaurante.hasMany(Avaliacao, { foreignKey: "restauranteId" });
Avaliacao.belongsTo(Restaurante, { foreignKey: "restauranteId" });

Pedido.hasMany(Avaliacao, { foreignKey: "pedidoId" });
Avaliacao.belongsTo(Pedido, { foreignKey: "pedidoId" });

Cliente.hasMany(Avaliacao, { foreignKey: "clienteId" });
Avaliacao.belongsTo(Cliente, { foreignKey: "clienteId" });

module.exports = Avaliacao;
