(function () {
  const users = [
    { id: "45112233", name: "Valentina Díaz", role: "alumno" },
    { id: "56223311", name: "Lucas Gómez", role: "alumno" },
    { id: "50331771", name: "Micaela Ruiz", role: "alumno" },
    { id: "44771999", name: "Tomás Lemos", role: "alumno" },
    { id: "99887766", name: "Marco Pérez", role: "profe" },
    { id: "66554433", name: "Laura Méndez", role: "profe" },
    { id: "11223344", name: "Sofía García", role: "admin" },
  ];

  const calendarByRoom = {
    "Salon 1": [
      { hour: 17, className: "Pilates Mat", coach: "Laura Méndez", capacity: 24, attendees: 19 },
      { hour: 18, className: "Gap", coach: "Marco Pérez", capacity: 30, attendees: 20 },
      { hour: 19, className: "Sport Funcional", coach: "Marco Pérez", capacity: 28, attendees: 23 },
      { hour: 20, className: "Cycle", coach: "Laura Méndez", capacity: 20, attendees: 15 },
    ],
    "Salon 2": [
      { hour: 17, className: "Pilates Mat", coach: "Laura Méndez", capacity: 20, attendees: 16 },
      { hour: 18, className: "Gap", coach: "Marco Pérez", capacity: 26, attendees: 19 },
      { hour: 19, className: "Power Barre", coach: "Laura Méndez", capacity: 22, attendees: 18 },
      { hour: 20, className: "Sport Funcional", coach: "Marco Pérez", capacity: 30, attendees: 25 },
    ],
  };

  const today = new Date();
  const toKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const todayKey = toKey(today);

  const checkins = [
    ...Array.from({ length: 192 }, (_, i) => ({
      userId: users[i % users.length].id,
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6 + (i % 15), (i * 9) % 60).toISOString(),
    })),
    ...Array.from({ length: 140 }, (_, i) => ({
      userId: users[i % users.length].id,
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 6 + (i % 15), (i * 11) % 60).toISOString(),
    })),
  ];

  const getDailyIncome = (date = new Date()) => {
    const key = toKey(date);
    return checkins.filter((entry) => toKey(new Date(entry.timestamp)) === key).length;
  };

  const getActiveClass = (roomName, date = new Date()) => {
    const currentHour = date.getHours();
    return (calendarByRoom[roomName] || []).find((entry) => entry.hour === currentHour) || null;
  };

  window.GymData = {
    users,
    calendarByRoom,
    checkins,
    todayKey,
    toKey,
    getDailyIncome,
    getActiveClass,
  };
})();
