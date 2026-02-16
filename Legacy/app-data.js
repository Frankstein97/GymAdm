(function () {
  const roles = ["alumno", "alumno", "alumno", "alumno", "profe", "admin"];
  const names = [
    "Sofía", "Valentina", "Martina", "Camila", "Julieta", "Catalina", "Lucía", "Paula", "Mora", "Renata",
    "Lautaro", "Mateo", "Santino", "Benjamín", "Tomás", "Facundo", "Lucas", "Franco", "Thiago", "Bruno",
  ];
  const lastNames = ["García", "Pérez", "Fernández", "López", "Díaz", "Ruiz", "Romero", "Álvarez", "Méndez", "Sosa"];

  const users = Array.from({ length: 50 }, (_, index) => {
    const name = `${names[index % names.length]} ${lastNames[index % lastNames.length]}`;
    const role = index === 0 ? "admin" : roles[index % roles.length];
    return {
      id: String(40000000 + index),
      name,
      role,
      createdAt: new Date(Date.now() - (index % 9) * 86400000).toISOString(),
    };
  });

  users[0].id = "11223344";
  users[0].name = "Sofía García";

  const classPool = ["Pilates Mat", "Gap", "Sport Funcional", "Power Barre", "Cycle", "Yoga", "HIIT", "Stretch", "Box Fit"];
  const coaches = ["Laura Méndez", "Marco Pérez", "Nadia Rojas", "Julián Acosta"];

  const calendarByRoom = {
    "Salon 1": Array.from({ length: 24 }, (_, hour) => ({
      hour,
      className: classPool[hour % classPool.length],
      coach: coaches[hour % coaches.length],
      capacity: 22 + (hour % 8),
    })),
    "Salon 2": Array.from({ length: 24 }, (_, hour) => ({
      hour,
      className: classPool[(hour + 3) % classPool.length],
      coach: coaches[(hour + 1) % coaches.length],
      capacity: 20 + ((hour + 2) % 10),
    })),
  };

  const studentIds = users.filter((u) => u.role === "alumno").map((u) => u.id);
  const toKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const createCheckinsForDay = (dayOffset = 0, count = 180) => {
    const base = new Date();
    base.setDate(base.getDate() - dayOffset);

    return Array.from({ length: count }, (_, i) => {
      const hour = i % 24;
      const roomName = i % 2 === 0 ? "Salon 1" : "Salon 2";
      const roomClass = calendarByRoom[roomName][hour];
      return {
        userId: studentIds[i % studentIds.length],
        role: "alumno",
        roomName,
        className: roomClass.className,
        timestamp: new Date(base.getFullYear(), base.getMonth(), base.getDate(), hour, (i * 7) % 60).toISOString(),
      };
    });
  };

  const checkins = [...createCheckinsForDay(0, 220), ...createCheckinsForDay(1, 170), ...createCheckinsForDay(2, 190)];

  const getUniqueDailyIncome = (date = new Date()) => {
    const key = toKey(date);
    const ids = new Set(checkins.filter((entry) => toKey(new Date(entry.timestamp)) === key).map((entry) => entry.userId));
    return ids.size;
  };

  const getActiveClass = (roomName, date = new Date()) => {
    const currentHour = date.getHours();
    const classes = storage.loadClasses();
    return (classes[roomName] || []).find((entry) => entry.hour === currentHour) || null;
  };

  const getAttendeesForClass = (roomName, date = new Date()) => {
    const active = getActiveClass(roomName, date);
    if (!active) return 0;
    const key = toKey(date);
    return checkins.filter((entry) => {
      const stamp = new Date(entry.timestamp);
      return (
        toKey(stamp) === key &&
        stamp.getHours() === active.hour &&
        entry.roomName === roomName &&
        entry.className === active.className
      );
    }).length;
  };

  const getOrderedTimeline = (roomName, date = new Date()) => {
    const currentHour = date.getHours();
    const classes = storage.loadClasses();
    const timeline = classes[roomName] || [];
    return [...timeline.slice(currentHour), ...timeline.slice(0, currentHour)];
  };

  const storage = {
    loadUsers: () => JSON.parse(localStorage.getItem("gymadm-users") || "null") || users,
    saveUsers: (nextUsers) => localStorage.setItem("gymadm-users", JSON.stringify(nextUsers)),
    loadClasses: () => JSON.parse(localStorage.getItem("gymadm-classes") || "null") || calendarByRoom,
    saveClasses: (nextClasses) => localStorage.setItem("gymadm-classes", JSON.stringify(nextClasses)),
  };

  window.GymData = {
    users,
    calendarByRoom,
    checkins,
    toKey,
    getActiveClass,
    getAttendeesForClass,
    getOrderedTimeline,
    getUniqueDailyIncome,
    storage,
  };
})();
