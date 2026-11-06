const secret = process.env.JWT_SECRET;

if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
  throw new Error('JWT_SECRET es obligatorio y debe tener al menos 32 caracteres.');
}

module.exports = secret;
