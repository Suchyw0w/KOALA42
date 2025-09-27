const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Nemesis = sequelize.define('Nemesis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  is_alive: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  years: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  character_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'nemesis',
  timestamps: false,
  underscored: true
});

module.exports = Nemesis;