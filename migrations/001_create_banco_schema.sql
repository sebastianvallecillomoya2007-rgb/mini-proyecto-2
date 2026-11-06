-- Esquema base para el sistema bancario.
-- Este script crea las tablas faltantes en la base de datos `banco`.
-- Se usa CREATE TABLE IF NOT EXISTS para evitar recrear entidades ya existentes.

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  telefono VARCHAR(20) NULL,
  direccion VARCHAR(255) NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cliente),
  UNIQUE KEY uk_clientes_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tipos_cuenta (
  id_tipo_cuenta INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  PRIMARY KEY (id_tipo_cuenta),
  UNIQUE KEY uk_tipos_cuenta_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sucursales (
  id_sucursal INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_sucursal),
  UNIQUE KEY uk_sucursales_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cuentas (
  id_cuenta INT NOT NULL AUTO_INCREMENT,
  id_cliente INT NOT NULL,
  id_tipo_cuenta INT NOT NULL,
  id_sucursal INT NOT NULL,
  saldo DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  fecha_apertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('activa', 'inactiva', 'bloqueada') NOT NULL DEFAULT 'activa',
  PRIMARY KEY (id_cuenta),
  KEY idx_cuentas_cliente (id_cliente),
  KEY idx_cuentas_tipo (id_tipo_cuenta),
  KEY idx_cuentas_sucursal (id_sucursal),
  CONSTRAINT fk_cuentas_cliente
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cuentas_tipo_cuenta
    FOREIGN KEY (id_tipo_cuenta) REFERENCES tipos_cuenta (id_tipo_cuenta)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cuentas_sucursal
    FOREIGN KEY (id_sucursal) REFERENCES sucursales (id_sucursal)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transacciones (
  id_transaccion INT NOT NULL AUTO_INCREMENT,
  id_cuenta INT NOT NULL,
  tipo_transaccion ENUM('deposito', 'retiro', 'transferencia', 'pago') NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descripcion VARCHAR(255) NULL,
  PRIMARY KEY (id_transaccion),
  KEY idx_transacciones_cuenta (id_cuenta),
  CONSTRAINT fk_transacciones_cuenta
    FOREIGN KEY (id_cuenta) REFERENCES cuentas (id_cuenta)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
