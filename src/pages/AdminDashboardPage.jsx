import { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context';

const CITY = 'Buenos Aires, AR';

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

export default function AdminDashboardPage() {
  const { classesByRoom, getActiveClass, getAttendeesForClass, getUniqueDailyIncome, getDailyCheckinsByHour } = useApp();
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState({ icon: '🌡️', text: 'Cargando clima', temp: '--°' });
  const rowRefs = useRef({});
  const timelineRefs = useRef({});

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
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m,weather_code');
        const data = await res.json();
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

  const activeHour = now.getHours();

  useEffect(() => {
    Object.entries(timelineRefs.current).forEach(([room, container]) => {
      const activeRow = rowRefs.current[room];
      if (!container || !activeRow) return;

      const target = activeRow.offsetTop - container.clientHeight / 2 + activeRow.clientHeight / 2;
      container.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    });
  }, [activeHour, classesByRoom]);

  const dailySeries = useMemo(() => getDailyCheckinsByHour(now), [getDailyCheckinsByHour, now]);
  const maxSeries = Math.max(...dailySeries.map((item) => item.total), 1);

  return (
    <AdminLayout>
      <section className="dashboard-grid">
        <div className="rooms">
          {Object.entries(classesByRoom).map(([room, list]) => (
            <article className="room" key={room}>
              <h3>{room}</h3>
              <div
                className="timeline"
                ref={(el) => {
                  timelineRefs.current[room] = el;
                }}
              >
                {list.map((entry) => {
                  const isCurrent = entry.hour === activeHour;
                  return (
                    <div
                      key={`${room}-${entry.hour}`}
                      className="timeline-row"
                      ref={(el) => {
                        if (isCurrent) rowRefs.current[room] = el;
                      }}
                    >
                      <div className={`hour ${isCurrent ? 'current' : ''}`}>{String(entry.hour).padStart(2, '0')}:00</div>
                      <div className={`clazz ${isCurrent ? 'current' : ''}`}>{entry.className}</div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <aside className="info">
          <div className="clock">
            <p>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' }).format(now)}</p>
            <p>{new Intl.DateTimeFormat('es-AR', { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}hs</p>
            <p>{CITY}</p>
            <p>{weather.icon} {weather.text}</p>
            <p>{weather.temp}</p>
          </div>
          <div className="total"><p>TOTAL DE INGRESOS</p><strong>{getUniqueDailyIncome(now)} Usuarios</strong></div>
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
        <h2>Concurrencia diaria (mock)</h2>
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
