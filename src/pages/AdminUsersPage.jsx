import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context';

export default function AdminUsersPage() {
  const { users, persistUsers } = useApp();
  const [form, setForm] = useState({ id: '', name: '', role: 'alumno' });

  const onSave = (e) => {
    e.preventDefault();
    const idx = users.findIndex((u) => u.id === form.id);
    const next = [...users];
    if (idx >= 0) next[idx] = { ...next[idx], ...form };
    else next.unshift({ ...form, createdAt: new Date().toISOString() });
    persistUsers(next);
    setForm({ id: '', name: '', role: 'alumno' });
  };

  return (
    <AdminLayout>
      <section className="content-card">
        <h2>Usuarios (CRUD local)</h2>
        <form className="inline-form" onSubmit={onSave}>
          <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="DNI" required />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>alumno</option><option>profe</option><option>admin</option></select>
          <button>Guardar</button>
        </form>
        <table className="table"><thead><tr><th>DNI</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>
          {users.map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.role}</td><td><button onClick={() => setForm({ id: u.id, name: u.name, role: u.role })}>Editar</button> <button onClick={() => persistUsers(users.filter((x) => x.id !== u.id))}>Eliminar</button></td></tr>)}
        </tbody></table>
      </section>
    </AdminLayout>
  );
}
