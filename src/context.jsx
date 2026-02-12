import { createContext, useContext, useMemo, useState } from 'react';
import { buildCheckins, buildClassesByRoom, buildUsers, toDayKey } from './data/mockData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  users: 'gymadm-users-v1',
  classes: 'gymadm-classes-v1',
  session: 'gymadm-session-v1',
};

const seedUsers = buildUsers();
const seedClasses = buildClassesByRoom();

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const isValidUser = (user) => user && typeof user.id === 'string' && typeof user.name === 'string' && typeof user.role === 'string';
const isValidUsersShape = (users) => Array.isArray(users) && users.length > 0 && users.every(isValidUser);
const isValidClass = (item) => item && Number.isInteger(item.hour) && typeof item.className === 'string' && typeof item.coach === 'string' && Number.isFinite(item.capacity);
const isValidClassesShape = (classes) => classes && typeof classes === 'object' && Object.values(classes).every((list) => Array.isArray(list) && list.every(isValidClass));
const isValidSessionShape = (session) => !session || (session && session.role === 'admin' && typeof session.name === 'string' && typeof session.dni === 'string');

const initialUsersRaw = safeParse(localStorage.getItem(STORAGE_KEYS.users) || 'null');
const initialClassesRaw = safeParse(localStorage.getItem(STORAGE_KEYS.classes) || 'null');
const initialSessionRaw = safeParse(sessionStorage.getItem(STORAGE_KEYS.session) || 'null');

const initialUsers = isValidUsersShape(initialUsersRaw) ? initialUsersRaw : seedUsers;
const initialClasses = isValidClassesShape(initialClassesRaw) ? initialClassesRaw : seedClasses;
const initialSession = isValidSessionShape(initialSessionRaw) ? initialSessionRaw : null;

export function AppProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [classesByRoom, setClassesByRoom] = useState(initialClasses);
  const [session, setSession] = useState(initialSession);

  const checkins = useMemo(() => buildCheckins(users, classesByRoom), [users, classesByRoom]);

  const persistUsers = (next) => {
    setUsers(next);
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(next));
  };

  const persistClasses = (next) => {
    setClassesByRoom(next);
    localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(next));
  };

  const loginAdmin = (name, dni) => {
    const next = { role: 'admin', name, dni };
    setSession(next);
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(next));
  };

  const logout = () => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEYS.session);
  };

  const resetDemoData = () => {
    setUsers(seedUsers);
    setClassesByRoom(seedClasses);
    setSession(null);
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seedUsers));
    localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(seedClasses));
    sessionStorage.removeItem(STORAGE_KEYS.session);
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

  const getDailyCheckinsByHour = (date = new Date()) => {
    const key = toDayKey(date);
    const totals = Array.from({ length: 24 }, (_, hour) => ({ hour, total: 0 }));
    checkins.forEach((entry) => {
      const stamp = new Date(entry.timestamp);
      if (toDayKey(stamp) === key) totals[stamp.getHours()].total += 1;
    });
    return totals;
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
    resetDemoData,
    getActiveClass,
    getAttendeesForClass,
    getUniqueDailyIncome,
    getDailyCheckinsByHour,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
