const Sucursal = require('../models/Sucursal');

const validateSucursalData = (body) => {
  const data = body || {};
  const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : data.nombre;
  const direccion = typeof data.direccion === 'string' ? data.direccion.trim() : data.direccion;
  const ciudad = typeof data.ciudad === 'string' ? data.ciudad.trim() : data.ciudad;

  if (!nombre) {
    return 'El nombre de la sucursal es obligatorio.';
  }

  if (!direccion) {
    return 'La dirección de la sucursal es obligatoria.';
  }

  if (!ciudad) {
    return 'La ciudad de la sucursal es obligatoria.';
  }

  return null;
};

const getAllSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.findAll({
      order: [['id_sucursal', 'ASC']],
    });

    return res.status(200).json(sucursales);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al listar sucursales.',
      error: error.message,
    });
  }
};

const getSucursalById = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = await Sucursal.findByPk(id);

    if (!sucursal) {
      return res.status(404).json({ message: 'Sucursal no encontrada.' });
    }

    return res.status(200).json(sucursal);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar la sucursal.',
      error: error.message,
    });
  }
};

const createSucursal = async (req, res) => {
  try {
    const validationError = validateSucursalData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const sucursal = await Sucursal.create({
      nombre: String(req.body.nombre).trim(),
      direccion: String(req.body.direccion).trim(),
      ciudad: String(req.body.ciudad).trim(),
    });

    return res.status(201).json({
      message: 'Sucursal registrada correctamente.',
      sucursal,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El nombre de la sucursal ya existe.' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    return res.status(500).json({
      message: 'Error al registrar la sucursal.',
      error: error.message,
    });
  }
};

const updateSucursal = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = await Sucursal.findByPk(id);

    if (!sucursal) {
      return res.status(404).json({ message: 'Sucursal no encontrada.' });
    }

    const validationError = validateSucursalData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await sucursal.update({
      nombre: String(req.body.nombre).trim(),
      direccion: String(req.body.direccion).trim(),
      ciudad: String(req.body.ciudad).trim(),
    });

    return res.status(200).json({
      message: 'Sucursal actualizada correctamente.',
      sucursal,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El nombre de la sucursal ya existe.' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    return res.status(500).json({
      message: 'Error al actualizar la sucursal.',
      error: error.message,
    });
  }
};

const deleteSucursal = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = await Sucursal.findByPk(id);

    if (!sucursal) {
      return res.status(404).json({ message: 'Sucursal no encontrada.' });
    }

    await sucursal.destroy();
    return res.status(200).json({ message: 'Sucursal eliminada correctamente.' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'No se puede eliminar porque hay cuentas asociadas a esta sucursal.' });
    }

    return res.status(500).json({
      message: 'Error al eliminar la sucursal.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal,
};
