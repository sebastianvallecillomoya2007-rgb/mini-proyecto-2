const Cliente = require('../models/Cliente');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeClienteData = (data = {}) => ({
  nombre: typeof data.nombre === 'string' ? data.nombre.trim() : '',
  apellido: typeof data.apellido === 'string' ? data.apellido.trim() : '',
  correo: typeof data.correo === 'string' ? data.correo.trim().toLowerCase() : '',
  telefono: typeof data.telefono === 'string' ? data.telefono.trim() : null,
  direccion: typeof data.direccion === 'string' ? data.direccion.trim() : null,
});

const validateClienteData = (body) => {
  const { nombre, apellido, correo } = normalizeClienteData(body);

  if (!nombre) {
    return 'El nombre es obligatorio.';
  }

  if (!apellido) {
    return 'El apellido es obligatorio.';
  }

  if (!correo) {
    return 'El correo es obligatorio.';
  }

  if (!emailPattern.test(correo)) {
    return 'El correo no tiene un formato válido.';
  }

  return null;
};

const getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['id_cliente', 'ASC']],
    });

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar clientes.',
      error: error.message,
    });
  }
};

const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar el cliente.',
      error: error.message,
    });
  }
};

const createCliente = async (req, res) => {
  try {
    const validationError = validateClienteData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const data = normalizeClienteData(req.body);
    const cliente = await Cliente.create(data);

    return res.status(201).json({
      message: 'Cliente registrado correctamente.',
      cliente,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    if (error.name === 'SequelizeValidationError') {
      const message = error.errors?.[0]?.message || 'Datos inválidos.';
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message: 'Error al registrar cliente.',
      error: error.message,
    });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    const validationError = validateClienteData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const data = normalizeClienteData(req.body);
    await cliente.update(data);

    return res.status(200).json({
      message: 'Cliente actualizado correctamente.',
      cliente,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    if (error.name === 'SequelizeValidationError') {
      const message = error.errors?.[0]?.message || 'Datos inválidos.';
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message: 'Error al actualizar cliente.',
      error: error.message,
    });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    await cliente.destroy();

    return res.status(200).json({ message: 'Cliente eliminado correctamente.' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'No se puede eliminar el cliente porque tiene cuentas asociadas.' });
    }

    return res.status(500).json({
      message: 'Error al eliminar cliente.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
