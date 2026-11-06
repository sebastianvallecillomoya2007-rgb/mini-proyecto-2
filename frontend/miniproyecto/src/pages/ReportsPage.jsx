import { useState } from 'react';
import { getReporteCuenta } from '../services/clientesService';

export default function ReportsPage() {
  const [accountId, setAccountId] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);
    try {
      setReport(await getReporteCuenta(accountId));
    } catch (requestError) {
      setError(requestError.message || 'No se pudo consultar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const account = report?.cuenta;
  const transactions = report?.transacciones || [];

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Consultas</p>
          <h1>Reportes</h1>
        </div>
      </div>
      <form className="report-form" onSubmit={handleSubmit}>
        <label>
          <span>Número de cuenta</span>
          <input type="number" min="1" value={accountId} onChange={(event) => setAccountId(event.target.value)} required />
        </label>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar cuenta'}
        </button>
      </form>

      {error && <div className="alert error" role="alert">{error}</div>}
      {account && (
        <div className="report-result">
          <h2>Cuenta #{account.id_cuenta}</h2>
          <p>Saldo: ${Number(account.saldo || 0).toFixed(2)}</p>
          <p>Estado: {account.estado}</p>
          <h3>Movimientos ({transactions.length})</h3>
          {transactions.length === 0 ? (
            <p className="state-text">No hay transacciones registradas para esta cuenta.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Tipo</th><th>Monto</th><th>Fecha</th><th>Descripción</th></tr></thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id_transaccion}>
                      <td>{transaction.tipo_transaccion}</td>
                      <td>${Number(transaction.monto || 0).toFixed(2)}</td>
                      <td>{new Date(transaction.fecha).toLocaleString()}</td>
                      <td>{transaction.descripcion || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
