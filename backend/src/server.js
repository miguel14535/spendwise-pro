const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Goal = sequelize.define("Goal", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  target: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  current: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Goal;