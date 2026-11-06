const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const JWT_SECRET = require('../config/jwt');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.unscoped().findByPk(decoded.id_usuario);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no autorizado.' });
    }

    req.user = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido o expirado.',
      error: error.message,
    });
  }
};
