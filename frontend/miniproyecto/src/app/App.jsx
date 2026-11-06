import '../App.css';
import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/useAuth';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import EntityPage from '../pages/EntityPage';
import ReportsPage from '../pages/ReportsPage';

const navigation = [
  ['/dashboard', 'Resumen'],
  ['/clientes', 'Clientes'],
  ['/cuentas', 'Cuentas'],
  ['/tipos-cuenta', 'Tipos de cuenta'],
  ['/sucursales', 'Sucursales'],
  ['/transacciones', 'Transacciones'],
  ['/usuarios', 'Usuarios'],
  ['/reportes', 'Reportes'],
];

function ApplicationLayout() {
  const { user, logout } = useAuth();

  return (
    <main className="app-shell">
      <header className="app-header panel">
        <div>
          <p className="eyebrow">Sistema bancario</p>
          <h1>Administración</h1>
        </div>
        <div className="user-session">
          <span>{user?.nombre || user?.correo}</span>
          <button type="button" className="secondary" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="app-navigation panel" aria-label="Navegación principal">
        {navigation.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </main>
  );
}

function EntityRoute({ entity }) {
  return <EntityPage key={entity} entity={entity} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/registro" element={<AuthPage mode="register" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ApplicationLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clientes" element={<EntityRoute entity="clientes" />} />
          <Route path="cuentas" element={<EntityRoute entity="cuentas" />} />
          <Route path="tipos-cuenta" element={<EntityRoute entity="tipos-cuenta" />} />
          <Route path="sucursales" element={<EntityRoute entity="sucursales" />} />
          <Route path="transacciones" element={<EntityRoute entity="transacciones" />} />
          <Route path="usuarios" element={<EntityRoute entity="usuarios" />} />
          <Route path="reportes" element={<ReportsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
