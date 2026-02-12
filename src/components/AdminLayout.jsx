import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context';

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { session, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="admin-page">
      <header className="topbar">
        <div className="brand"><div className="logo small">GA</div><div><h1>GymAdm</h1><p>Acceso administración.</p></div></div>
        <button className="hamburger" onClick={() => setOpen((v) => !v)}>☰</button>
        <div className={`menu-panel ${open ? 'open' : ''}`}>
          <nav className="nav">
            <NavLink to="/admin/dashboard">Dashboard general</NavLink>
            <NavLink to="/admin/users">Usuarios por roles</NavLink>
            <NavLink to="/admin/calendar">Calendario</NavLink>
            <NavLink to="/admin/classes">Clases y horarios</NavLink>
          </nav>
          <div className="userbox"><span>{session?.name}</span><button onClick={handleLogout}>↩</button></div>
        </div>
      </header>
      {children}
    </main>
  );
}
