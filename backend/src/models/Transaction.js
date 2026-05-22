const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Transaction = sequelize.define("Transaction", {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("Pago", "Pendente"),
    defaultValue: "Pago",
  },

  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Transaction, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Transaction.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = Transaction;