const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoCuenta = sequelize.define(
  'TipoCuenta',
  {
    id_tipo_cuenta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_tipo_cuenta',
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre del tipo de cuenta es obligatorio.',
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'tipos_cuenta',
    timestamps: false,
  }
);

module.exports = TipoCuenta;
