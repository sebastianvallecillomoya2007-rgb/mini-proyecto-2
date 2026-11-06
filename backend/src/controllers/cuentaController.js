const Cuenta = require('../models/Cuenta');
const Cliente = require('../models/Cliente');
const TipoCuenta = require('../models/TipoCuenta');
const Sucursal = require('../models/Sucursal');

const VALID_ESTADOS = ['activa', 'inactiva', 'bloqueada'];

const parseInteger = (value, label) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} debe ser un número entero válido.`);
  }
  return parsed;
};

const validateCuentaData = (body) => {
  const data = body || {};

  if (data.id_cliente === undefined || data.id_cliente === null || data.id_cliente === '') {
    return 'El id_cliente es obligatorio.';
  }

  if (data.id_tipo_cuenta === undefined || data.id_tipo_cuenta === null || data.id_tipo_cuenta === '') {
    return 'El id_tipo_cuenta es obligatorio.';
  }

  if (data.id_sucursal === undefined || data.id_sucursal === null || data.id_sucursal === '') {
    return 'El id_sucursal es obligatorio.';
  }

  try {
    parseInteger(data.id_cliente, 'id_cliente');
    parseInteger(data.id_tipo_cuenta, 'id_tipo_cuenta');
    parseInteger(data.id_sucursal, 'id_sucursal');
  } catch (error) {
    return error.message;
  }

  const saldoValue = data.saldo === undefined || data.saldo === null || data.saldo === '' ? 0 : Number(data.saldo);
  if (Number.isNaN(saldoValue)) {
    return 'El saldo debe ser un valor numérico.';
  }

  const estado = data.estado === undefined || data.estado === null || data.estado === '' ? 'activa' : String(data.estado).trim().toLowerCase();
  if (!VALID_ESTADOS.includes(estado)) {
    return 'El estado debe ser activa, inactiva o bloqueada.';
  }

  return null;
};

const includeRelations = [
  {
    model: Cliente,
    as: 'cliente',
    attributes: ['id_cliente', 'nombre', 'apellido', 'correo'],
  },
  {
    model: TipoCuenta,
    as: 'tipoCuenta',
    attributes: ['id_tipo_cuenta', 'nombre', 'descripcion'],
  },
  {
    model: Sucursal,
    as: 'sucursal',
    attributes: ['id_sucursal', 'nombre', 'direccion', 'ciudad'],
  },
];

const verifyRelatedEntities = async ({ id_cliente, id_tipo_cuenta, id_sucursal }) => {
  const cliente = await Cliente.findByPk(id_cliente);
  if (!cliente) {
    throw Object.assign(new Error('El cliente indicado no existe.'), { statusCode: 404 });
  }

  const tipoCuenta = await TipoCuenta.findByPk(id_tipo_cuenta);
  if (!tipoCuenta) {
    throw Object.assign(new Error('El tipo de cuenta indicado no existe.'), { statusCode: 404 });
  }

  const sucursal = await Sucursal.findByPk(id_sucursal);
  if (!sucursal) {
    throw Object.assign(new Error('La sucursal indicada no existe.'), { statusCode: 404 });
  }
};

const getAllCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: includeRelations,
      order: [['id_cuenta', 'ASC']],
    });

    return res.status(200).json(cuentas);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al listar cuentas.',
      error: error.message,
    });
  }
};

const getCuentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await Cuenta.findByPk(id, { include: includeRelations });

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada.' });
    }

    return res.status(200).json(cuenta);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar la cuenta.',
      error: error.message,
    });
  }
};

const createCuenta = async (req, res) => {
  try {
    const validationError = validateCuentaData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { id_cliente, id_tipo_cuenta, id_sucursal, saldo, estado } = req.body;
    await verifyRelatedEntities({ id_cliente, id_tipo_cuenta, id_sucursal });

    const cuenta = await Cuenta.create({
      id_cliente: Number(id_cliente),
      id_tipo_cuenta: Number(id_tipo_cuenta),
      id_sucursal: Number(id_sucursal),
      saldo: saldo === undefined || saldo === null || saldo === '' ? 0 : Number(saldo),
      estado: estado === undefined || estado === null || estado === '' ? 'activa' : String(estado).trim().toLowerCase(),
    });

    const cuentaCreada = await Cuenta.findByPk(cuenta.id_cuenta, { include: includeRelations });

    return res.status(201).json({
      message: 'Cuenta registrada correctamente.',
      cuenta: cuentaCreada,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Los datos relacionados no existen en la base de datos.' });
    }

    return res.status(500).json({
      message: 'Error al registrar la cuenta.',
      error: error.message,
    });
  }
};

const updateCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await Cuenta.findByPk(id);

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada.' });
    }

    const validationError = validateCuentaData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { id_cliente, id_tipo_cuenta, id_sucursal, saldo, estado } = req.body;
    await verifyRelatedEntities({ id_cliente, id_tipo_cuenta, id_sucursal });

    await cuenta.update({
      id_cliente: Number(id_cliente),
      id_tipo_cuenta: Number(id_tipo_cuenta),
      id_sucursal: Number(id_sucursal),
      saldo: saldo === undefined || saldo === null || saldo === '' ? 0 : Number(saldo),
      estado: estado === undefined || estado === null || estado === '' ? 'activa' : String(estado).trim().toLowerCase(),
    });

    const cuentaActualizada = await Cuenta.findByPk(cuenta.id_cuenta, { include: includeRelations });

    return res.status(200).json({
      message: 'Cuenta actualizada correctamente.',
      cuenta: cuentaActualizada,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Los datos relacionados no existen en la base de datos.' });
    }

    return res.status(500).json({
      message: 'Error al actualizar la cuenta.',
      error: error.message,
    });
  }
};

const deleteCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await Cuenta.findByPk(id);

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada.' });
    }

    await cuenta.destroy();
    return res.status(200).json({ message: 'Cuenta eliminada correctamente.' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'No se puede eliminar la cuenta porque tiene transacciones asociadas.' });
    }

    return res.status(500).json({
      message: 'Error al eliminar la cuenta.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
};
