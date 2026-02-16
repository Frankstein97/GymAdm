import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context';

export default function AdminCalendarPage() {
  const { classesByRoom } = useApp();
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <AdminLayout>
      <section className="content-card">
        <h2>Calendario semanal (Lunes a Domingo)</h2>
        <div className="weekly-grid">
          {days.map((day) => (
            <article key={day} className="day-card">
              <h3>{day}</h3>
              <div className="day-content">
                {Object.entries(classesByRoom).map(([room, list]) => (
                  <div key={`${day}-${room}`} className="room-chip-wrap">
                    <strong>{room}</strong>
                    {list.slice(0, 8).map((entry) => <span key={`${day}-${room}-${entry.hour}`} className="chip">{String(entry.hour).padStart(2, '0')}:00 {entry.className}</span>)}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
