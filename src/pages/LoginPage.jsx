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

const weatherMap = {
  0: { icon: '☀️', text: 'Despejado' },
  1: { icon: '🌤️', text: 'Mayormente despejado' },
  2: { icon: '⛅', text: 'Parcialmente nublado' },
  3: { icon: '☁️', text: 'Nublado' },
  45: { icon: '🌫️', text: 'Niebla' },
  48: { icon: '🌫️', text: 'Niebla' },
  51: { icon: '🌦️', text: 'Llovizna' },
  53: { icon: '🌦️', text: 'Llovizna' },
  55: { icon: '🌧️', text: 'Llovizna intensa' },
  61: { icon: '🌧️', text: 'Lluvia' },
  63: { icon: '🌧️', text: 'Lluvia' },
  65: { icon: '🌧️', text: 'Lluvia fuerte' },
  80: { icon: '🌧️', text: 'Chaparrones' },
  81: { icon: '🌧️', text: 'Chaparrones' },
  82: { icon: '⛈️', text: 'Tormenta' },
};

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [city] = useState('Buenos Aires, AR');
  const [clock, setClock] = useState('--/--/---- --:--');
  const [weather, setWeather] = useState({ icon: '🌡️', text: 'Cargando clima', temp: '--°' });
  const closeTimer = useRef(null);
  const { loginAdmin, resetDemoData } = useApp();
  const navigate = useNavigate();

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const sync = async () => {
      try {
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Argentina/Buenos_Aires');
        const data = await response.json();
        const date = new Date(data.dateTime);
        const formatted = `${new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' }).format(date)} ${new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)}hs`;
        setClock(formatted);
      } catch {
        const now = new Date();
        setClock(`${new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' }).format(now)} ${new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}hs`);
      }

      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m,weather_code');
        const data = await response.json();
        const code = data.current?.weather_code;
        const meta = weatherMap[code] || { icon: '🌤️', text: 'Clima variable' };
        setWeather({ icon: meta.icon, text: meta.text, temp: `${Math.round(data.current.temperature_2m)}°` });
      } catch {
        setWeather({ icon: '🌤️', text: 'Sin conexión clima', temp: '--°' });
      }
    };

    sync();
    const id = setInterval(sync, 60000);
    return () => clearInterval(id);
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
        <img src="/gymadm-logo.svg" alt="Logo GymAdm" className="brand-image" />
        <div><h1>GymAdm</h1><p>Acceso rápido para alumnos, profes y administración.</p></div>
        <span className="demo-badge">Demo local</span>
      </header>

      <section className="card">
        <h2>Ingresá tu DNI</h2>
        <p className="helper">Si sos profe agregá “+” al final de tu DNI. Ej: <strong>99887766+</strong>.</p>
        <form onSubmit={onSubmit}>
          <label>DNI</label>
          <input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Tu DNI" />
          <div className="login-actions">
            <button type="submit">Ingresar</button>
            <button type="button" className="help-button" onClick={() => setDemoOpen(true)} title="Usuarios de ejemplo">?</button>
          </div>
        </form>

        <div className="quick-login-row">
          <button type="button" onClick={() => quickLogin('11223344')}>Probar como Admin</button>
          <button type="button" onClick={() => quickLogin('99887766+')}>Probar como Profe</button>
          <button type="button" onClick={() => quickLogin('45112233')}>Probar como Alumno</button>
        </div>

        <button type="button" className="ghost" onClick={resetDemoData}>Reset demo data</button>

        <div className="login-weather-box">
          <p>{clock}</p>
          <p>{city}</p>
          <p>{weather.icon} {weather.text} · {weather.temp}</p>
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
