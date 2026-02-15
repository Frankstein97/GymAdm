import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';

const usersByDni = {
  '45112233': { role: 'alumno', name: 'Valentina', className: 'Funcional 19:00', place: 'Sala Norte' },
  '99887766': { role: 'profe', name: 'Marco Pérez', focus: 'Musculación' },
  '11223344': { role: 'admin', name: 'Sofía García' },
};

const demoUsers = [
  { role: 'Admin', dni: '11223344', detail: 'Acceso completo al panel administrativo' },
  { role: 'Profe', dni: '99887766+', detail: 'Acceso docente (usar + al final)' },
  { role: 'Alumno', dni: '45112233', detail: 'Popup de bienvenida corto (2 segundos)' },
];

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const closeTimer = useRef(null);
  const { loginAdmin, resetDemoData } = useApp();
  const navigate = useNavigate();

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const showMessage = (text, autoCloseMs) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMsg(text);
    setOpen(true);

    if (autoCloseMs) {
      closeTimer.current = setTimeout(() => {
        setOpen(false);
        closeTimer.current = null;
      }, autoCloseMs);
    }
  };

  const authenticate = (rawValue) => {
    const raw = rawValue.replace(/\s+/g, '').trim();
    if (!raw) return showMessage('Necesitamos tu DNI');

    const isTeacher = raw.endsWith('+');
    const clean = raw.replace('+', '');
    const user = usersByDni[clean];

    if (!user) return showMessage('No encontramos ese usuario');

    if (user.role === 'admin' && !isTeacher) {
      loginAdmin(user.name, clean);
      navigate('/admin/dashboard');
      return;
    }

    if (user.role === 'alumno' && !isTeacher) {
      showMessage(`Bienvenido ${user.name}. Clase ${user.className}, lugar ${user.place}.`, 2000);
      return;
    }

    if (user.role === 'profe' && isTeacher) {
      showMessage(`Hola profe ${user.name}. Irás al dashboard docente luego.`);
      return;
    }

    showMessage('Ingreso no válido para ese rol.');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    authenticate(dni);
  };

  const quickLogin = (dniValue) => {
    setDni(dniValue);
    authenticate(dniValue);
  };

  return (
    <main className="screen">
      <header className="brand">
        <div className="logo">GA</div>
        <div><h1>GymAdm</h1><p>Acceso rápido para alumnos, profes y administración.</p></div>
        <span className="demo-badge">Esta es una DEMO</span>
      </header>

      <section className="card">
        <h2> INGRESA TU DNI</h2>
        <form onSubmit={onSubmit}>
          <input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Número de Documento" />
          <div className="login-actions">
            <button type="submit">Ingresar</button>
          </div>
        </form>

        <div className="quick-login-row">
          <button type="button" onClick={() => quickLogin('11223344')}>TEST USER: Admin</button>
          <button type="button" onClick={() => quickLogin('99887766+')}>TEST USER: Profes</button>
          <button type="button" onClick={() => quickLogin('45112233')}>TEST USER: Alumnos</button>
        
          <button type="button" className="ghost" onClick={resetDemoData}>RESET DEMO DATA</button>

          
        </div>

      </section>

      <div className={`modal ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setOpen(false)}>×</button><p>{msg}</p></div>
      </div>

      <div className={`modal ${demoOpen ? 'open' : ''}`} onClick={() => setDemoOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close" onClick={() => setDemoOpen(false)}>×</button>
          <h3>Usuarios de ejemplo</h3>
          <p>Usá cualquiera de estos DNI para probar la app:</p>
          <ul className="demo-list">
            {demoUsers.map((user) => (
              <li key={user.dni}><strong>{user.role}:</strong> {user.dni} <span>{user.detail}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
