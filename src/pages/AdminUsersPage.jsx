import { useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context';

const usersToCsv = (rows) => {
  const header = ['dni', 'nombre', 'rol', 'createdAt'];
  const body = rows.map((u) => [u.id, u.name, u.role, u.createdAt || '']);
  return [header, ...body].map((line) => line.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
};

const downloadFile = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function AdminUsersPage() {
  const { users, persistUsers } = useApp();
  const [form, setForm] = useState({ id: '', name: '', role: 'alumno' });

  const sortedUsers = useMemo(() => [...users].sort((a, b) => a.id.localeCompare(b.id)), [users]);

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
        <div className="section-header">
          <h2>Usuarios (CRUD local)</h2>
          <button onClick={() => downloadFile('gymadm-usuarios.csv', usersToCsv(sortedUsers))}>Exportar usuarios CSV</button>
        </div>

        <form className="inline-form" onSubmit={onSave}>
          <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="DNI" required />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>alumno</option><option>profe</option><option>admin</option></select>
          <button>Guardar</button>
        </form>

        <table className="table"><thead><tr><th>DNI</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>
          {sortedUsers.map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.role}</td><td><button onClick={() => setForm({ id: u.id, name: u.name, role: u.role })}>Editar</button> <button onClick={() => persistUsers(users.filter((x) => x.id !== u.id))}>Eliminar</button></td></tr>)}
        </tbody></table>
      </section>
    </AdminLayout>
  );
}
