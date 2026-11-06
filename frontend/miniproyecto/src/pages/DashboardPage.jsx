import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResumenBanco } from '../services/clientesService';

const initialSummary = {
  totalClientes: 0,
  totalCuentas: 0,
  totalTransacciones: 0,
  saldoTotal: 0,
  promedioSaldo: 0,
  cuentasActivas: 0,
  cuentasBloqueadas: 0,
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState('');

  useEffect(() => {
    getResumenBanco()
      .then(setSummary)
      .catch((requestError) => setError(requestError.message || 'No se pudo cargar el resumen.'));
  }, []);

  const cards = [
    ['Clientes', summary.totalClientes],
    ['Cuentas', summary.totalCuentas],
    ['Transacciones', summary.totalTransacciones],
    ['Saldo total', `$${Number(summary.saldoTotal || 0).toFixed(2)}`],
    ['Saldo promedio', `$${Number(summary.promedioSaldo || 0).toFixed(2)}`],
    ['Cuentas activas', summary.cuentasActivas],
    ['Cuentas bloqueadas', summary.cuentasBloqueadas],
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Resumen</p>
          <h1>Panel financiero</h1>
        </div>
        <Link className="primary button-link" to="/reportes">Consultar reportes</Link>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}
      <div className="summary-grid">
        {cards.map(([label, value]) => (
          <div className="summary-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
