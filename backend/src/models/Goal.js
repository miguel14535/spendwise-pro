const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Goal = sequelize.define("Goal", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  currentAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Goal;