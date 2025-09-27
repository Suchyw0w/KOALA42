const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Secret = sequelize.define('Secret', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  secret_code: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  nemesis_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'secret',
  timestamps: false,
  underscored: true
});

module.exports = Secret;