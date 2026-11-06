import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createCliente,
  createCuenta,
  createSucursal,
  createTipoCuenta,
  createTransaccion,
  createUsuario,
  deleteCliente,
  deleteCuenta,
  deleteSucursal,
  deleteTipoCuenta,
  deleteTransaccion,
  deleteUsuario,
  getClientes,
  getCuentas,
  getSucursales,
  getTiposCuenta,
  getTransacciones,
  getUsuarios,
  updateCliente,
  updateCuenta,
  updateSucursal,
  updateTipoCuenta,
  updateTransaccion,
  updateUsuario,
} from '../services/clientesService';

const definitions = {
  clientes: {
    title: 'Clientes',
    idField: 'id_cliente',
    responseKey: 'cliente',
    list: getClientes,
    create: createCliente,
    update: updateCliente,
    remove: deleteCliente,
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'apellido', label: 'Apellido', required: true },
      { name: 'correo', label: 'Correo', type: 'email', required: true },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'direccion', label: 'Dirección' },
    ],
    columns: [
      { key: 'id_cliente', label: 'ID' },
      { key: 'nombreCompleto', label: 'Nombre', value: (item) => `${item.nombre} ${item.apellido}` },
      { key: 'correo', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'direccion', label: 'Dirección' },
    ],
  },
  cuentas: {
    title: 'Cuentas',
    idField: 'id_cuenta',
    responseKey: 'cuenta',
    list: getCuentas,
    create: createCuenta,
    update: updateCuenta,
    remove: deleteCuenta,
    loadOptions: async () => {
      const [clientes, tipos, sucursales] = await Promise.all([
        getClientes(),
        getTiposCuenta(),
        getSucursales(),
      ]);
      return {
        clientes: clientes.map((item) => ({ value: item.id_cliente, label: `${item.nombre} ${item.apellido}` })),
        tipos: tipos.map((item) => ({ value: item.id_tipo_cuenta, label: item.nombre })),
        sucursales: sucursales.map((item) => ({ value: item.id_sucursal, label: item.nombre })),
      };
    },
    fields: [
      { name: 'id_cliente', label: 'Cliente', type: 'select', optionsKey: 'clientes', required: true, number: true },
      { name: 'id_tipo_cuenta', label: 'Tipo de cuenta', type: 'select', optionsKey: 'tipos', required: true, number: true },
      { name: 'id_sucursal', label: 'Sucursal', type: 'select', optionsKey: 'sucursales', required: true, number: true },
      { name: 'saldo', label: 'Saldo', type: 'number', step: '0.01', min: '0', required: true, number: true },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: [
        { value: 'activa', label: 'Activa' },
        { value: 'inactiva', label: 'Inactiva' },
        { value: 'bloqueada', label: 'Bloqueada' },
      ] },
    ],
    columns: [
      { key: 'id_cuenta', label: 'ID' },
      { key: 'cliente', label: 'Cliente', value: (item) => item.cliente ? `${item.cliente.nombre} ${item.cliente.apellido}` : item.id_cliente },
      { key: 'tipo', label: 'Tipo', value: (item) => item.tipoCuenta?.nombre || item.id_tipo_cuenta },
      { key: 'sucursal', label: 'Sucursal', value: (item) => item.sucursal?.nombre || item.id_sucursal },
      { key: 'saldo', label: 'Saldo', value: (item) => `$${Number(item.saldo || 0).toFixed(2)}` },
      { key: 'estado', label: 'Estado' },
    ],
  },
  'tipos-cuenta': {
    title: 'Tipos de cuenta',
    idField: 'id_tipo_cuenta',
    responseKey: 'tipoCuenta',
    list: getTiposCuenta,
    create: createTipoCuenta,
    update: updateTipoCuenta,
    remove: deleteTipoCuenta,
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    ],
    columns: [
      { key: 'id_tipo_cuenta', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'descripcion', label: 'Descripción' },
    ],
  },
  sucursales: {
    title: 'Sucursales',
    idField: 'id_sucursal',
    responseKey: 'sucursal',
    list: getSucursales,
    create: createSucursal,
    update: updateSucursal,
    remove: deleteSucursal,
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'direccion', label: 'Dirección', required: true },
      { name: 'ciudad', label: 'Ciudad', required: true },
    ],
    columns: [
      { key: 'id_sucursal', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'direccion', label: 'Dirección' },
      { key: 'ciudad', label: 'Ciudad' },
    ],
  },
  transacciones: {
    title: 'Transacciones',
    idField: 'id_transaccion',
    responseKey: 'transaccion',
    list: getTransacciones,
    create: createTransaccion,
    update: updateTransaccion,
    remove: deleteTransaccion,
    loadOptions: async () => {
      const cuentas = await getCuentas();
      return {
        cuentas: cuentas.map((item) => ({ value: item.id_cuenta, label: `Cuenta #${item.id_cuenta}` })),
      };
    },
    fields: [
      { name: 'id_cuenta', label: 'Cuenta', type: 'select', optionsKey: 'cuentas', required: true, number: true },
      { name: 'tipo_transaccion', label: 'Tipo', type: 'select', required: true, options: [
        { value: 'deposito', label: 'Depósito' },
        { value: 'retiro', label: 'Retiro' },
        { value: 'transferencia', label: 'Transferencia' },
        { value: 'pago', label: 'Pago' },
      ] },
      { name: 'monto', label: 'Monto', type: 'number', step: '0.01', min: '0.01', required: true, number: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    ],
    columns: [
      { key: 'id_transaccion', label: 'ID' },
      { key: 'cuenta', label: 'Cuenta', value: (item) => `#${item.cuenta?.id_cuenta || item.id_cuenta}` },
      { key: 'tipo_transaccion', label: 'Tipo' },
      { key: 'monto', label: 'Monto', value: (item) => `$${Number(item.monto || 0).toFixed(2)}` },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'fecha', label: 'Fecha', value: (item) => item.fecha ? new Date(item.fecha).toLocaleString() : '—' },
    ],
  },
  usuarios: {
    title: 'Usuarios',
    idField: 'id_usuario',
    responseKey: 'usuario',
    list: getUsuarios,
    create: createUsuario,
    update: updateUsuario,
    remove: deleteUsuario,
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'correo', label: 'Correo', type: 'email', required: true },
      { name: 'password', label: 'Contraseña', type: 'password', requiredOnCreate: true, minLength: 8 },
    ],
    columns: [
      { key: 'id_usuario', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'correo', label: 'Correo' },
      { key: 'fecha_creacion', label: 'Fecha de creación', value: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString() : '—' },
    ],
  },
};

function emptyForm(definition) {
  return Object.fromEntries(definition.fields.map((field) => [field.name, '']));
}

async function fetchEntityData(definition) {
  const [items, references] = await Promise.all([
    definition.list(),
    definition.loadOptions ? definition.loadOptions() : Promise.resolve({}),
  ]);
  return {
    records: Array.isArray(items) ? items : [],
    options: references,
  };
}

export default function EntityPage({ entity }) {
  const definition = definitions[entity];
  const [records, setRecords] = useState([]);
  const [options, setOptions] = useState({});
  const [form, setForm] = useState(() => emptyForm(definition));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const isEditing = editingId !== null;

  const loadData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await fetchEntityData(definition);
      setRecords(data.records);
      setOptions(data.options);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || `No se pudieron cargar ${definition.title.toLowerCase()}.` });
    } finally {
      setLoading(false);
    }
  }, [definition]);

  useEffect(() => {
    let active = true;
    fetchEntityData(definition)
      .then((data) => {
        if (active) {
          setRecords(data.records);
          setOptions(data.options);
          setMessage({ type: '', text: '' });
        }
      })
      .catch((error) => {
        if (active) {
          setMessage({ type: 'error', text: error.message || `No se pudieron cargar ${definition.title.toLowerCase()}.` });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [definition]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm(definition));
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    const payload = Object.fromEntries(definition.fields
      .filter((field) => !(field.name === 'password' && !form.password))
      .map((field) => [field.name, field.number && form[field.name] !== '' ? Number(form[field.name]) : form[field.name] || null]));

    try {
      if (isEditing) {
        await definition.update(editingId, payload);
        setMessage({ type: 'success', text: `Registro actualizado correctamente en ${definition.title}.` });
      } else {
        await definition.create(payload);
        setMessage({ type: 'success', text: `Registro creado correctamente en ${definition.title}.` });
      }
      resetForm();
      await loadData(true);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'No se pudo guardar el registro.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    const nextForm = emptyForm(definition);
    for (const field of definition.fields) {
      nextForm[field.name] = field.name === 'password' ? '' : record[field.name] ?? '';
    }
    setForm(nextForm);
    setEditingId(record[definition.idField]);
    setMessage({ type: '', text: '' });
  };

  const handleDelete = async (record) => {
    const id = record[definition.idField];
    if (!window.confirm(`¿Deseas eliminar este registro de ${definition.title.toLowerCase()}?`)) {
      return;
    }

    try {
      const response = await definition.remove(id);
      setMessage({ type: 'success', text: response.message || 'Registro eliminado correctamente.' });
      if (editingId === id) resetForm();
      await loadData(true);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'No se pudo eliminar el registro.' });
    }
  };

  const formTitle = useMemo(
    () => `${isEditing ? 'Editar' : 'Registrar'} ${definition.title.toLowerCase()}`,
    [definition.title, isEditing]
  );

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Administración</p>
            <h1>{definition.title}</h1>
          </div>
          <span className="total-badge">{records.length} registros</span>
        </div>

        <form className="cliente-form" onSubmit={handleSubmit}>
          <h2 className="section-title">{formTitle}</h2>
          <div className="input-grid">
            {definition.fields.map((field) => {
              const required = field.required || (field.requiredOnCreate && !isEditing);
              const fieldOptions = field.options || options[field.optionsKey] || [];

              return (
                <label key={field.name}>
                  <span>{field.label}</span>
                  {field.type === 'select' ? (
                    <select name={field.name} value={form[field.name]} onChange={handleChange} required={required}>
                      <option value="">Selecciona una opción</option>
                      {fieldOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea name={field.name} value={form[field.name]} onChange={handleChange} required={required} rows="3" />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required={required}
                      min={field.min}
                      minLength={field.minLength}
                      step={field.step}
                      autoComplete={field.name === 'password' ? 'new-password' : undefined}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div className="form-actions">
            <button type="submit" className="primary" disabled={saving}>
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar'}
            </button>
            {isEditing && <button type="button" className="secondary" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>

        {message.text && <div className={`alert ${message.type}`} role="status">{message.text}</div>}
      </section>

      <section className="table-panel panel">
        <div className="table-header">
          <h2>Registros de {definition.title.toLowerCase()}</h2>
        </div>
        {loading ? (
          <p className="state-text">Cargando...</p>
        ) : records.length === 0 ? (
          <p className="state-text">No hay registros todavía.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {definition.columns.map((column) => <th key={column.key}>{column.label}</th>)}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record[definition.idField]}>
                    {definition.columns.map((column) => (
                      <td key={column.key}>{column.value ? column.value(record) : record[column.key] ?? '—'}</td>
                    ))}
                    <td className="actions-cell">
                      <button type="button" className="table-button edit" onClick={() => handleEdit(record)}>Editar</button>
                      <button type="button" className="table-button delete" onClick={() => handleDelete(record)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
