import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';

const usersByDni = {
  '45112233': { role: 'alumno', name: 'Valentina', className: 'Funcional 19:00', place: 'Sala Norte' },
  '99887766': { role: 'profe', name: 'Marco Pérez', focus: 'Musculación' },
  '11223344': { role: 'admin', name: 'Sofía García' },
};

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const { loginAdmin } = useApp();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const raw = dni.replace(/\s+/g, '').trim();
    if (!raw) return setMsg('Necesitamos tu DNI'), setOpen(true);
    const isTeacher = raw.endsWith('+');
    const clean = raw.replace('+', '');
    const user = usersByDni[clean];
    if (!user) return setMsg('No encontramos ese usuario'), setOpen(true);

    if (user.role === 'admin' && !isTeacher) {
      loginAdmin(user.name, clean);
      navigate('/admin/dashboard');
      return;
    }

    if (user.role === 'alumno' && !isTeacher) setMsg(`Bienvenido ${user.name}. Clase ${user.className}, lugar ${user.place}.`);
    else if (user.role === 'profe' && isTeacher) setMsg(`Hola profe ${user.name}. Irás al dashboard docente luego.`);
    else setMsg('Ingreso no válido para ese rol.');
    setOpen(true);
  };

  return (
    <main className="screen">
      <header className="brand"><div className="logo">GA</div><div><h1>GymAdm</h1><p>Acceso rápido para alumnos, profes y administración.</p></div></header>
      <section className="card">
        <h2>Ingresá tu DNI</h2>
        <p className="helper">Si sos profe agregá “+” al final de tu DNI. Ej: <strong>99887766+</strong>.</p>
        <form onSubmit={onSubmit}>
          <label>DNI</label>
          <input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Tu DNI" />
          <button type="submit">Ingresar</button>
        </form>
      </section>
      <div className={`modal ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setOpen(false)}>×</button><p>{msg}</p></div>
      </div>
    </main>
  );
}
