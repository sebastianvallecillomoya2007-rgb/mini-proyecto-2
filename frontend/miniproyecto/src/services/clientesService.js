const CLIENTES_API_URL = '/api/clientes';
const CUENTAS_API_URL = '/api/cuentas';
const TIPOS_CUENTA_API_URL = '/api/tipos-cuenta';
const SUCURSALES_API_URL = '/api/sucursales';
const TRANSACCIONES_API_URL = '/api/transacciones';
const REPORTES_API_URL = '/api/reportes';
const AUTH_API_URL = '/api/auth';

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('bankToken');
  const headers = { ...extraHeaders };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(response) {
  const text = await response.text();
  let payload = {};

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      if (!response.ok) {
        throw new Error(`El servidor API respondió con un error HTTP ${response.status}. Verifica que el backend esté ejecutándose.`);
      }

      throw new Error('El servidor API devolvió una respuesta inválida.');
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('bankToken');
      localStorage.removeItem('bankUser');
      window.dispatchEvent(new Event('bank:unauthorized'));
    }
    throw new Error(payload.message || 'Error en la solicitud.');
  }

  return payload;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(options.headers || {}),
  });

  return handleResponse(response);
}

export function getStoredUser() {
  const storedUser = localStorage.getItem('bankUser');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('bankToken');
  localStorage.removeItem('bankUser');
}

export async function registerUsuario({ nombre, correo, password }) {
  const response = await fetch(`${AUTH_API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, password }),
  });

  const payload = await handleResponse(response);
  if (payload.token) {
    localStorage.setItem('bankToken', payload.token);
    localStorage.setItem('bankUser', JSON.stringify(payload.usuario || null));
  }

  return payload;
}

export async function loginUsuario({ correo, password }) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password }),
  });

  const payload = await handleResponse(response);
  if (payload.token) {
    localStorage.setItem('bankToken', payload.token);
    localStorage.setItem('bankUser', JSON.stringify(payload.usuario || null));
  }

  return payload;
}

export async function getProfile() {
  return requestJson(`${AUTH_API_URL}/me`);
}

export async function getClientes() {
  return requestJson(CLIENTES_API_URL);
}

export async function createCliente(cliente) {
  return requestJson(CLIENTES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });
}

export async function updateCliente(id, cliente) {
  return requestJson(`${CLIENTES_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });
}

export async function deleteCliente(id) {
  return requestJson(`${CLIENTES_API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getCuentas() {
  return requestJson(CUENTAS_API_URL);
}

export async function createCuenta(cuenta) {
  return requestJson(CUENTAS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuenta),
  });
}

export async function updateCuenta(id, cuenta) {
  return requestJson(`${CUENTAS_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuenta),
  });
}

export async function deleteCuenta(id) {
  return requestJson(`${CUENTAS_API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getTiposCuenta() {
  return requestJson(TIPOS_CUENTA_API_URL);
}

export async function createTipoCuenta(tipoCuenta) {
  return requestJson(TIPOS_CUENTA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipoCuenta),
  });
}

export async function updateTipoCuenta(id, tipoCuenta) {
  return requestJson(`${TIPOS_CUENTA_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipoCuenta),
  });
}

export async function deleteTipoCuenta(id) {
  return requestJson(`${TIPOS_CUENTA_API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getSucursales() {
  return requestJson(SUCURSALES_API_URL);
}

export async function createSucursal(sucursal) {
  return requestJson(SUCURSALES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sucursal),
  });
}

export async function updateSucursal(id, sucursal) {
  return requestJson(`${SUCURSALES_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sucursal),
  });
}

export async function deleteSucursal(id) {
  return requestJson(`${SUCURSALES_API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getTransacciones() {
  return requestJson(TRANSACCIONES_API_URL);
}

export async function createTransaccion(transaccion) {
  return requestJson(TRANSACCIONES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaccion),
  });
}

export async function updateTransaccion(id, transaccion) {
  return requestJson(`${TRANSACCIONES_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaccion),
  });
}

export async function deleteTransaccion(id) {
  return requestJson(`${TRANSACCIONES_API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function getResumenBanco() {
  return requestJson(`${REPORTES_API_URL}/resumen`);
}

export async function getReporteCuenta(id) {
  return requestJson(`${REPORTES_API_URL}/cuenta/${id}`);
}

export async function getUsuarios() {
  return requestJson('/api/usuarios');
}

export async function createUsuario(usuario) {
  return requestJson('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
}

export async function updateUsuario(id, usuario) {
  return requestJson(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
}

export async function deleteUsuario(id) {
  return requestJson(`/api/usuarios/${id}`, {
    method: 'DELETE',
  });
}
