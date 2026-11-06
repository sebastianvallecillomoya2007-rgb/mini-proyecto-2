const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const JWT_SECRET = require('../config/jwt');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

const sanitizeUsuario = (usuario) => {
  const data = usuario && usuario.get ? usuario.get({ plain: true }) : { ...usuario };

  if (data && Object.prototype.hasOwnProperty.call(data, 'password')) {
    delete data.password;
  }

  return data;
};

const generateToken = (usuario) =>
  jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

const register = async (req, res) => {
  try {
    const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
    const correo = typeof req.body?.correo === 'string' ? req.body.correo.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    if (!correo) {
      return res.status(400).json({ message: 'El correo es obligatorio.' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const existeUsuario = await Usuario.unscoped().findOne({ where: { correo } });
    if (existeUsuario) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    const usuario = await Usuario.create({ nombre, correo, password });
    const token = generateToken(usuario);

    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      token,
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

const login = async (req, res) => {
  try {
    const correo = typeof req.body?.correo === 'string' ? req.body.correo.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.unscoped().findOne({
      where: { correo },
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = generateToken(usuario);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: sanitizeUsuario(usuario),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al iniciar sesión.',
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.unscoped().findByPk(req.user.id_usuario);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      usuario: sanitizeUsuario(usuario),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el perfil.',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
