const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sucursal = sequelize.define(
  'Sucursal',
  {
    id_sucursal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sucursal',
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre de la sucursal es obligatorio.',
        },
      },
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La dirección de la sucursal es obligatoria.',
        },
      },
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La ciudad de la sucursal es obligatoria.',
        },
      },
    },
  },
  {
    tableName: 'sucursales',
    timestamps: false,
  }
);

module.exports = Sucursal;
