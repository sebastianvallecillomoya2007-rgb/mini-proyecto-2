const Usuario = require('../models/Usuario');

const sanitizeUsuario = (usuario) => {
  const data = usuario && usuario.get ? usuario.get({ plain: true }) : { ...usuario };
  if (data && Object.prototype.hasOwnProperty.call(data, 'password')) {
    delete data.password;
  }
  return data;
};

const validateUsuarioData = (body) => {
  const data = body || {};
  const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : data.nombre;
  const correo = typeof data.correo === 'string' ? data.correo.trim() : data.correo;
  const password = typeof data.password === 'string' ? data.password : data.password;

  if (!nombre) {
    return 'El nombre es obligatorio.';
  }

  if (!correo) {
    return 'El correo es obligatorio.';
  }

  if (!password || String(password).length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  return null;
};

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      order: [['id_usuario', 'ASC']],
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al listar usuarios.',
      error: error.message,
    });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al consultar el usuario.',
      error: error.message,
    });
  }
};

const createUsuario = async (req, res) => {
  try {
    const validationError = validateUsuarioData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const usuario = await Usuario.create({
      nombre: String(req.body.nombre).trim(),
      correo: String(req.body.correo).trim(),
      password: String(req.body.password),
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      usuario: sanitizeUsuario(usuario),
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    return res.status(500).json({
      message: 'Error al registrar el usuario.',
      error: error.message,
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : req.body.nombre;
    const correo = typeof req.body.correo === 'string' ? req.body.correo.trim() : req.body.correo;
    const password = req.body.password;

    if (!nombre || !correo) {
      return res.status(400).json({ message: 'El nombre y el correo son obligatorios.' });
    }

    if (password !== undefined && password !== null && String(password).length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    await usuario.update({
      nombre,
      correo,
      ...(password !== undefined && password !== null && password !== '' ? { password: String(password) } : {}),
    });

    return res.status(200).json({
      message: 'Usuario actualizado correctamente.',
      usuario: sanitizeUsuario(usuario),
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Datos inválidos.' });
    }

    return res.status(500).json({
      message: 'Error al actualizar el usuario.',
      error: error.message,
    });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await usuario.destroy();
    return res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el usuario.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
