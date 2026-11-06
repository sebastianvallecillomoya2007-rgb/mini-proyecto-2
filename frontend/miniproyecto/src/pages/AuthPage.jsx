import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { isAuthenticated, isChecking, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isChecking) {
    return <main className="app-shell"><p className="state-text">Verificando sesión...</p></main>;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ correo: form.correo, password: form.password });
      }
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      setMessage(error.message || 'No se pudo completar la solicitud.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-shell auth-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Sistema bancario</p>
        <h1>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        <p className="auth-description">
          {isRegister ? 'Registra un usuario para acceder al panel.' : 'Ingresa tus credenciales para continuar.'}
        </p>

        <form className="cliente-form" onSubmit={handleSubmit}>
          <div className="input-grid">
            {isRegister && (
              <label className="full-width">
                <span>Nombre</span>
                <input name="nombre" value={form.nombre} onChange={handleChange} autoComplete="name" required />
              </label>
            )}
            <label className="full-width">
              <span>Correo</span>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>
            <label className="full-width">
              <span>Contraseña</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 8 : undefined}
                required
              />
            </label>
          </div>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? 'Procesando...' : isRegister ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        {message && <div className="alert error" role="alert">{message}</div>}
        <p className="auth-switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <Link to={isRegister ? '/login' : '/registro'}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </Link>
        </p>
      </section>
    </main>
  );
}
