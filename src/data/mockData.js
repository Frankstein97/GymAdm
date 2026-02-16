export const buildUsers = () => {
  const roles = ['alumno', 'alumno', 'alumno', 'alumno', 'profe', 'admin'];
  const names = ['Sofía', 'Valentina', 'Martina', 'Camila', 'Julieta', 'Catalina', 'Lucía', 'Paula', 'Mora', 'Renata', 'Lautaro', 'Mateo', 'Santino', 'Benjamín', 'Tomás', 'Facundo', 'Lucas', 'Franco', 'Thiago', 'Bruno'];
  const lastNames = ['García', 'Pérez', 'Fernández', 'López', 'Díaz', 'Ruiz', 'Romero', 'Álvarez', 'Méndez', 'Sosa'];

  const users = Array.from({ length: 50 }, (_, index) => ({
    id: String(40000000 + index),
    name: `${names[index % names.length]} ${lastNames[index % lastNames.length]}`,
    role: index === 0 ? 'admin' : roles[index % roles.length],
    createdAt: new Date(Date.now() - (index % 9) * 86400000).toISOString(),
  }));

  users[0] = { ...users[0], id: '11223344', name: 'Sofía García' };
  return users;
};

export const buildClassesByRoom = () => {
  const classPool = ['Pilates Mat', 'Gap', 'Sport Funcional', 'Power Barre', 'Cycle', 'Yoga', 'HIIT', 'Stretch', 'Box Fit'];
  const coaches = ['Laura Méndez', 'Marco Pérez', 'Nadia Rojas', 'Julián Acosta'];

  return {
    'Salon 1': Array.from({ length: 24 }, (_, hour) => ({ hour, className: classPool[hour % classPool.length], coach: coaches[hour % coaches.length], capacity: 22 + (hour % 8) })),
    'Salon 2': Array.from({ length: 24 }, (_, hour) => ({ hour, className: classPool[(hour + 3) % classPool.length], coach: coaches[(hour + 1) % coaches.length], capacity: 20 + ((hour + 2) % 10) })),
  };
};

export const toDayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const buildCheckins = (users, classesByRoom) => {
  const studentIds = users.filter((u) => u.role === 'alumno').map((u) => u.id);
  const buildDay = (offset, count) => {
    const base = new Date();
    base.setDate(base.getDate() - offset);

    return Array.from({ length: count }, (_, i) => {
      const hour = i % 24;
      const roomName = i % 2 === 0 ? 'Salon 1' : 'Salon 2';
      const current = classesByRoom[roomName][hour];
      return {
        userId: studentIds[i % studentIds.length],
        roomName,
        className: current.className,
        timestamp: new Date(base.getFullYear(), base.getMonth(), base.getDate(), hour, (i * 7) % 60).toISOString(),
      };
    });
  };

  return [...buildDay(0, 220), ...buildDay(1, 170), ...buildDay(2, 190)];
};
