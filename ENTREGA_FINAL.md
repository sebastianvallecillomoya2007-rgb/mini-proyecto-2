# Entrega final: Sistema bancario

## Descripción

Aplicación académica de administración bancaria con API REST en Node.js/Express y Sequelize, base de datos MySQL y cliente web en React/Vite. Usuarios del sistema y entidades financieras se mantienen separados.

## Funcionalidad implementada

- CRUD REST y página web propia para clientes, cuentas, tipos de cuenta, sucursales, transacciones y usuarios.
- Formularios de alta/edición, listados y eliminación con confirmación.
- Selectores de entidades relacionadas en cuentas y transacciones.
- Resumen financiero y reporte de movimientos por cuenta.
- Registro, inicio de sesión, perfil y cierre de sesión.
- JWT para la protección de endpoints de negocio y rutas de interfaz.
- Hash bcrypt para contraseñas; no se incluyen en respuestas JSON.
- Variables de entorno para MySQL y JWT.
- Diagrama entidad-relación actualizado en [docs/diagrama-entidad-relacion.md](docs/diagrama-entidad-relacion.md).

## Modelo de datos

Un cliente puede tener varias cuentas. Cada cuenta pertenece a un tipo y una sucursal, y puede registrar varias transacciones. `Usuario` es independiente del dominio bancario.

## Rutas principales

- Autenticación: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- Recursos CRUD: `/api/clientes`, `/api/cuentas`, `/api/tipos-cuenta`, `/api/sucursales`, `/api/transacciones`, `/api/usuarios`.
- Reportes: `/api/reportes/resumen`, `/api/reportes/cuenta/:id`.
- Frontend: login, registro, dashboard y páginas protegidas por entidad.

El cliente envía el JWT de sesión dentro del encabezado HTTP `Authorization` para acceder a las rutas protegidas.

## Configuración

1. Copiar `.env.example` a `.env`.
2. Configurar MySQL y crear el esquema `banco`.
3. Generar un secreto JWT aleatorio de al menos 32 caracteres y guardarlo en `.env`.
4. Ejecutar los scripts de `migrations/` si aún no existen las tablas.
5. Instalar dependencias con `npm install`; iniciar backend con `npm start` y frontend con `npm run frontend`.

No se deben compartir ni versionar `.env` o credenciales.

## Agentes organizadores

- [Organizador Día 1](.github/agents/organizador-dia-1.agent.md): modelado y CRUD inicial sin autenticación.
- [Organizador Día 2](.github/agents/organizador-dia-2.agent.md): ERD, autenticación, rutas protegidas y CRUDs por entidad.

## Verificación de esta revisión

- `npm --prefix frontend/miniproyecto run lint`: correcto.
- `npm --prefix frontend/miniproyecto run build`: correcto.
- Módulos de rutas backend y configuración Sequelize basada en entorno cargaron correctamente.
- Login, perfil, listados protegidos y respuesta 401 sin sesión se probaron en el entorno local.
- Las páginas de las seis entidades cargaron en navegador; logout eliminó la sesión y una ruta protegida redirigió al login.

La conexión a MySQL depende de las credenciales locales configuradas en `.env`.
