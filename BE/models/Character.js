const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Character = sequelize.define(
  "Character",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ability: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    minimal_distance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    born: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    in_space_since: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    beer_consumption: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    knows_the_answer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "character",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Character;
