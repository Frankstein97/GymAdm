import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context';

export default function AdminClassesPage() {
  const { classesByRoom, persistClasses } = useApp();
  const [form, setForm] = useState({ room: 'Salon 1', hour: 0, className: '', coach: '', capacity: 20 });

  const onSave = (e) => {
    e.preventDefault();
    const next = structuredClone(classesByRoom);
    const hour = Number(form.hour);
    const payload = { hour, className: form.className, coach: form.coach, capacity: Number(form.capacity) };
    const idx = next[form.room].findIndex((c) => c.hour === hour);
    if (idx >= 0) next[form.room][idx] = payload;
    else next[form.room].push(payload);
    next[form.room].sort((a, b) => a.hour - b.hour);
    persistClasses(next);
    setForm({ room: 'Salon 1', hour: 0, className: '', coach: '', capacity: 20 });
  };

  return (
    <AdminLayout>
      <section className="content-card">
        <h2>Clases y horarios (CRUD local)</h2>
        <form className="inline-form" onSubmit={onSave}>
          <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}><option>Salon 1</option><option>Salon 2</option></select>
          <input type="number" min="0" max="23" value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} />
          <input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="Clase" required />
          <input value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} placeholder="Profe" required />
          <input type="number" min="5" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <button>Guardar</button>
        </form>
        <table className="table"><thead><tr><th>Salón</th><th>Hora</th><th>Clase</th><th>Profe</th><th>Cupos</th><th>Acciones</th></tr></thead><tbody>
          {Object.entries(classesByRoom).flatMap(([room, list]) => list.map((entry) => (
            <tr key={`${room}-${entry.hour}`}><td>{room}</td><td>{entry.hour}:00</td><td>{entry.className}</td><td>{entry.coach}</td><td>{entry.capacity}</td><td><button onClick={() => setForm({ room, hour: entry.hour, className: entry.className, coach: entry.coach, capacity: entry.capacity })}>Editar</button> <button onClick={() => {
              const next = structuredClone(classesByRoom); next[room] = next[room].filter((c) => c.hour !== entry.hour); persistClasses(next);
            }}>Eliminar</button></td></tr>
          )))}
        </tbody></table>
      </section>
    </AdminLayout>
  );
}
