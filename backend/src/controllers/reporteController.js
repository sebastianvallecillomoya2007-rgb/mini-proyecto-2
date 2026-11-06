const { Op } = require('sequelize');
const Cliente = require('../models/Cliente');
const Cuenta = require('../models/Cuenta');
const Transaccion = require('../models/Transaccion');

const getResumen = async (req, res) => {
  try {
    const [totalClientes, totalCuentas, totalTransacciones, saldoTotal, cuentasActivas, cuentasBloqueadas] = await Promise.all([
      Cliente.count(),
      Cuenta.count(),
      Transaccion.count(),
      Cuenta.sum('saldo'),
      Cuenta.count({ where: { estado: 'activa' } }),
      Cuenta.count({ where: { estado: 'bloqueada' } }),
    ]);

    const promedioSaldo = totalCuentas > 0 && saldoTotal ? Number(saldoTotal) / totalCuentas : 0;

    return res.status(200).json({
      totalClientes,
      totalCuentas,
      totalTransacciones,
      saldoTotal: Number(saldoTotal || 0),
      promedioSaldo: Number(promedioSaldo.toFixed(2)),
      cuentasActivas: cuentasActivas || 0,
      cuentasBloqueadas: cuentasBloqueadas || 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al generar el resumen bancario.',
      error: error.message,
    });
  }
};

const getReportePorCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await Cuenta.findByPk(id, {
      include: [{
        model: Transaccion,
        as: 'transacciones',
        order: [['fecha', 'DESC']],
      }],
    });

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada.' });
    }

    return res.status(200).json({
      cuenta: {
        id_cuenta: cuenta.id_cuenta,
        saldo: Number(cuenta.saldo || 0),
        estado: cuenta.estado,
      },
      transacciones: cuenta.transacciones || [],
      totalMovimientos: (cuenta.transacciones || []).length,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar el reporte de la cuenta.',
      error: error.message,
    });
  }
};

module.exports = {
  getResumen,
  getReportePorCuenta,
};
