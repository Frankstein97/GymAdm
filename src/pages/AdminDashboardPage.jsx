import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context';

export default function AdminDashboardPage() {
  const { classesByRoom, getActiveClass, getAttendeesForClass, getUniqueDailyIncome, getDailyCheckinsByHour } = useApp();
  const [now, setNow] = useState(new Date());
  const [temp, setTemp] = useState('--°');

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Argentina/Buenos_Aires');
        const data = await res.json();
        setNow(new Date(data.dateTime));
      } catch {
        setNow(new Date());
      }

      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m');
        const data = await res.json();
        setTemp(`${Math.round(data.current.temperature_2m)}°`);
      } catch {
        setTemp('--°');
      }
    };

    sync();
    const id = setInterval(sync, 60000);
    return () => clearInterval(id);
  }, []);

  const orderedByRoom = useMemo(() => {
    const h = now.getHours();
    return Object.fromEntries(Object.entries(classesByRoom).map(([room, list]) => [room, [...list.slice(h), ...list.slice(0, h)]]));
  }, [classesByRoom, now]);

  const dailySeries = useMemo(() => getDailyCheckinsByHour(now), [getDailyCheckinsByHour, now]);
  const maxSeries = Math.max(...dailySeries.map((item) => item.total), 1);

  return (
    <AdminLayout>
      <section className="dashboard-grid">
        <div className="rooms">
          {Object.entries(orderedByRoom).map(([room, list]) => (
            <article className="room" key={room}>
              <h3>{room}</h3>
              <div className="timeline">
                {list.map((entry, idx) => (
                  <div key={`${room}-${entry.hour}`} className="timeline-row">
                    <div className={`hour ${idx === 0 ? 'current' : ''}`}>{String(entry.hour).padStart(2, '0')}:00</div>
                    <div className={`clazz ${idx === 0 ? 'current' : ''}`}>{entry.className}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="info">
          <div className="clock">
            <p>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' }).format(now)}</p>
            <p>{new Intl.DateTimeFormat('es-AR', { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).format(now).toUpperCase()}hs</p>
            <p>{temp}</p>
          </div>
          <div className="total"><p>TOTAL DE INGRESOS HOY:</p><strong>{getUniqueDailyIncome(now)} Usuarios</strong></div>
        </aside>
      </section>

      <section className="attendance">
        {Object.keys(classesByRoom).map((room) => {
          const active = getActiveClass(room, now);
          const attendees = getAttendeesForClass(room, now);
          const percentage = Math.round((attendees / (active?.capacity || 1)) * 100);
          return <article key={room} className="box"><p>{room.toUpperCase()}</p><p>{active?.className?.toUpperCase() || 'SIN CLASE'}</p><strong>{percentage}%</strong><p>{attendees} asistentes</p></article>;
        })}
      </section>

      <section className="content-card">
        <h2>Concurrencia diaria: (DEMO)</h2>
        <div className="bar-chart">
          {dailySeries.map((item) => (
            <div className="bar-item" key={item.hour}>
              <div className="bar" style={{ height: `${Math.round((item.total / maxSeries) * 100)}%` }} title={`${item.total} ingresos`} />
              <span>{String(item.hour).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
