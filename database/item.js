const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const { Comida } = require("./comida");

const Item = connection.define("item", {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,    
  },
});

Comida.hasMany(Item, { foreignKey: "comidaId" });
Item.belongsTo(Comida, { foreignKey: "comidaId" });

module.exports = Item;