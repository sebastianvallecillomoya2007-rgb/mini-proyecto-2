const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const TipoCuenta = require('./TipoCuenta');
const Sucursal = require('./Sucursal');

const Cuenta = sequelize.define(
  'Cuenta',
  {
    id_cuenta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_cuenta',
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente,
        key: 'id_cliente',
      },
    },
    id_tipo_cuenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoCuenta,
        key: 'id_tipo_cuenta',
      },
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sucursal,
        key: 'id_sucursal',
      },
    },
    saldo: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isNumeric: {
          msg: 'El saldo debe ser un valor numérico.',
        },
      },
    },
    fecha_apertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_apertura',
    },
    estado: {
      type: DataTypes.ENUM('activa', 'inactiva', 'bloqueada'),
      allowNull: false,
      defaultValue: 'activa',
      validate: {
        isIn: {
          args: [['activa', 'inactiva', 'bloqueada']],
          msg: 'El estado debe ser activa, inactiva o bloqueada.',
        },
      },
    },
  },
  {
    tableName: 'cuentas',
    timestamps: false,
  }
);

Cuenta.belongsTo(Cliente, {
  foreignKey: 'id_cliente',
  as: 'cliente',
});

Cuenta.belongsTo(TipoCuenta, {
  foreignKey: 'id_tipo_cuenta',
  as: 'tipoCuenta',
});

Cuenta.belongsTo(Sucursal, {
  foreignKey: 'id_sucursal',
  as: 'sucursal',
});

Cliente.hasMany(Cuenta, {
  foreignKey: 'id_cliente',
  as: 'cuentas',
});

TipoCuenta.hasMany(Cuenta, {
  foreignKey: 'id_tipo_cuenta',
  as: 'cuentas',
});

Sucursal.hasMany(Cuenta, {
  foreignKey: 'id_sucursal',
  as: 'cuentas',
});

module.exports = Cuenta;
