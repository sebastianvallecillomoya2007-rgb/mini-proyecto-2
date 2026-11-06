require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const app = require('./app');
const sequelize = require('./config/database');

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL exitosa.');

    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar con MySQL:', error.message);
    process.exit(1);
  }
}

startServer();
