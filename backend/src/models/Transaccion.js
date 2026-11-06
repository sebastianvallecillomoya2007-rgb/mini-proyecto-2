const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cuenta = require('./Cuenta');

const Transaccion = sequelize.define(
  'Transaccion',
  {
    id_transaccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_transaccion',
    },
    id_cuenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cuenta,
        key: 'id_cuenta',
      },
    },
    tipo_transaccion: {
      type: DataTypes.ENUM('deposito', 'retiro', 'transferencia', 'pago'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['deposito', 'retiro', 'transferencia', 'pago']],
          msg: 'El tipo de transacción debe ser deposito, retiro, transferencia o pago.',
        },
      },
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'El monto debe ser un valor numérico.',
        },
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha',
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'transacciones',
    timestamps: false,
  }
);

Cuenta.hasMany(Transaccion, {
  foreignKey: 'id_cuenta',
  as: 'transacciones',
});

Transaccion.belongsTo(Cuenta, {
  foreignKey: 'id_cuenta',
  as: 'cuenta',
});

module.exports = Transaccion;
