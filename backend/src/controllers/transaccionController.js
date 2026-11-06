const Transaccion = require('../models/Transaccion');
const Cuenta = require('../models/Cuenta');

const VALID_TIPOS = ['deposito', 'retiro', 'transferencia', 'pago'];

const validateTransaccionData = (body) => {
  const data = body || {};

  if (data.id_cuenta === undefined || data.id_cuenta === null || data.id_cuenta === '') {
    return 'El id_cuenta es obligatorio.';
  }

  const parsedCuenta = Number(data.id_cuenta);
  if (!Number.isInteger(parsedCuenta) || parsedCuenta <= 0) {
    return 'El id_cuenta debe ser un identificador válido.';
  }

  const tipo = typeof data.tipo_transaccion === 'string' ? data.tipo_transaccion.trim().toLowerCase() : data.tipo_transaccion;
  if (!VALID_TIPOS.includes(tipo)) {
    return 'El tipo de transacción debe ser deposito, retiro, transferencia o pago.';
  }

  const monto = Number(data.monto);
  if (Number.isNaN(monto) || monto <= 0) {
    return 'El monto debe ser un valor numérico mayor que cero.';
  }

  return null;
};

const includeCuenta = [
  {
    model: Cuenta,
    as: 'cuenta',
    attributes: ['id_cuenta', 'saldo', 'estado'],
  },
];

const getAllTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll({
      include: includeCuenta,
      order: [['id_transaccion', 'DESC']],
    });

    return res.status(200).json(transacciones);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al listar transacciones.',
      error: error.message,
    });
  }
};

const getTransaccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaccion = await Transaccion.findByPk(id, { include: includeCuenta });

    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada.' });
    }

    return res.status(200).json(transaccion);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar la transacción.',
      error: error.message,
    });
  }
};

const createTransaccion = async (req, res) => {
  try {
    const validationError = validateTransaccionData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const cuenta = await Cuenta.findByPk(req.body.id_cuenta);
    if (!cuenta) {
      return res.status(404).json({ message: 'La cuenta indicada no existe.' });
    }

    const tipo = String(req.body.tipo_transaccion).trim().toLowerCase();
    const monto = Number(req.body.monto);
    const descripcion = req.body.descripcion ? String(req.body.descripcion).trim() : null;

    const transaccion = await Transaccion.create({
      id_cuenta: Number(req.body.id_cuenta),
      tipo_transaccion: tipo,
      monto,
      descripcion,
    });

    const transaccionCreada = await Transaccion.findByPk(transaccion.id_transaccion, { include: includeCuenta });

    return res.status(201).json({
      message: 'Transacción registrada correctamente.',
      transaccion: transaccionCreada,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'La cuenta indicada no existe en la base de datos.' });
    }

    return res.status(500).json({
      message: 'Error al registrar la transacción.',
      error: error.message,
    });
  }
};

const updateTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const transaccion = await Transaccion.findByPk(id);

    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada.' });
    }

    const validationError = validateTransaccionData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const cuenta = await Cuenta.findByPk(req.body.id_cuenta);
    if (!cuenta) {
      return res.status(404).json({ message: 'La cuenta indicada no existe.' });
    }

    await transaccion.update({
      id_cuenta: Number(req.body.id_cuenta),
      tipo_transaccion: String(req.body.tipo_transaccion).trim().toLowerCase(),
      monto: Number(req.body.monto),
      descripcion: req.body.descripcion ? String(req.body.descripcion).trim() : null,
    });

    const transaccionActualizada = await Transaccion.findByPk(transaccion.id_transaccion, { include: includeCuenta });

    return res.status(200).json({
      message: 'Transacción actualizada correctamente.',
      transaccion: transaccionActualizada,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'La cuenta indicada no existe en la base de datos.' });
    }

    return res.status(500).json({
      message: 'Error al actualizar la transacción.',
      error: error.message,
    });
  }
};

const deleteTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const transaccion = await Transaccion.findByPk(id);

    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada.' });
    }

    await transaccion.destroy();
    return res.status(200).json({ message: 'Transacción eliminada correctamente.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la transacción.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTransacciones,
  getTransaccionById,
  createTransaccion,
  updateTransaccion,
  deleteTransaccion,
};
