import { createContext, useContext, useMemo, useState } from 'react';
import { buildCheckins, buildClassesByRoom, buildUsers, toDayKey } from './data/mockData';

const AppContext = createContext(null);

const initialUsers = JSON.parse(localStorage.getItem('gymadm-users') || 'null') || buildUsers();
const initialClasses = JSON.parse(localStorage.getItem('gymadm-classes') || 'null') || buildClassesByRoom();
const initialSession = JSON.parse(sessionStorage.getItem('gymadm-session') || 'null');

export function AppProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [classesByRoom, setClassesByRoom] = useState(initialClasses);
  const [session, setSession] = useState(initialSession);

  const checkins = useMemo(() => buildCheckins(users, classesByRoom), [users, classesByRoom]);

  const persistUsers = (next) => {
    setUsers(next);
    localStorage.setItem('gymadm-users', JSON.stringify(next));
  };

  const persistClasses = (next) => {
    setClassesByRoom(next);
    localStorage.setItem('gymadm-classes', JSON.stringify(next));
  };

  const loginAdmin = (name, dni) => {
    const next = { role: 'admin', name, dni };
    setSession(next);
    sessionStorage.setItem('gymadm-session', JSON.stringify(next));
  };

  const logout = () => {
    setSession(null);
    sessionStorage.removeItem('gymadm-session');
  };

  const getActiveClass = (roomName, date = new Date()) => {
    const h = date.getHours();
    return (classesByRoom[roomName] || []).find((c) => c.hour === h) || null;
  };

  const getAttendeesForClass = (roomName, date = new Date()) => {
    const active = getActiveClass(roomName, date);
    if (!active) return 0;
    const key = toDayKey(date);
    return checkins.filter((entry) => {
      const stamp = new Date(entry.timestamp);
      return toDayKey(stamp) === key && stamp.getHours() === active.hour && entry.roomName === roomName && entry.className === active.className;
    }).length;
  };

  const getUniqueDailyIncome = (date = new Date()) => {
    const key = toDayKey(date);
    return new Set(checkins.filter((c) => toDayKey(new Date(c.timestamp)) === key).map((c) => c.userId)).size;
  };

  const value = {
    users,
    classesByRoom,
    checkins,
    session,
    persistUsers,
    persistClasses,
    loginAdmin,
    logout,
    getActiveClass,
    getAttendeesForClass,
    getUniqueDailyIncome,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
