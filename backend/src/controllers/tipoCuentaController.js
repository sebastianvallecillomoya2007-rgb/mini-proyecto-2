const TipoCuenta = require('../models/TipoCuenta');

const validateTipoCuentaData = (body) => {
  const data = body || {};
  const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : data.nombre;

  if (!nombre) {
    return 'El nombre del tipo de cuenta es obligatorio.';
  }

  return null;
};

const getAllTiposCuenta = async (req, res) => {
  try {
    const tiposCuenta = await TipoCuenta.findAll({
      order: [['id_tipo_cuenta', 'ASC']],
    });

    return res.status(200).json(tiposCuenta);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al listar tipos de cuenta.',
      error: error.message,
    });
  }
};

const getTipoCuentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoCuenta = await TipoCuenta.findByPk(id);

    if (!tipoCuenta) {
      return res.status(404).json({ message: 'Tipo de cuenta no encontrado.' });
    }

    return res.status(200).json(tipoCuenta);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar el tipo de cuenta.',
      error: error.message,
    });
  }
};

const createTipoCuenta = async (req, res) => {
  try {
    const validationError = validateTipoCuentaData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const tipoCuenta = await TipoCuenta.create({
      nombre: String(req.body.nombre).trim(),
      descripcion: req.body.descripcion ? String(req.body.descripcion).trim() : null,
    });

    return res.status(201).json({
      message: 'Tipo de cuenta registrado correctamente.',
      tipoCuenta,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El nombre del tipo de cuenta ya existe.' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    return res.status(500).json({
      message: 'Error al registrar el tipo de cuenta.',
      error: error.message,
    });
  }
};

const updateTipoCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoCuenta = await TipoCuenta.findByPk(id);

    if (!tipoCuenta) {
      return res.status(404).json({ message: 'Tipo de cuenta no encontrado.' });
    }

    const validationError = validateTipoCuentaData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await tipoCuenta.update({
      nombre: String(req.body.nombre).trim(),
      descripcion: req.body.descripcion ? String(req.body.descripcion).trim() : null,
    });

    return res.status(200).json({
      message: 'Tipo de cuenta actualizado correctamente.',
      tipoCuenta,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El nombre del tipo de cuenta ya existe.' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    return res.status(500).json({
      message: 'Error al actualizar el tipo de cuenta.',
      error: error.message,
    });
  }
};

const deleteTipoCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoCuenta = await TipoCuenta.findByPk(id);

    if (!tipoCuenta) {
      return res.status(404).json({ message: 'Tipo de cuenta no encontrado.' });
    }

    await tipoCuenta.destroy();
    return res.status(200).json({ message: 'Tipo de cuenta eliminado correctamente.' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'No se puede eliminar porque hay cuentas asociadas a este tipo.' });
    }

    return res.status(500).json({
      message: 'Error al eliminar el tipo de cuenta.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTiposCuenta,
  getTipoCuentaById,
  createTipoCuenta,
  updateTipoCuenta,
  deleteTipoCuenta,
};
