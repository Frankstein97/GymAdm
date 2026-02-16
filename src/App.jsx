import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCalendarPage from './pages/AdminCalendarPage';
import AdminClassesPage from './pages/AdminClassesPage';
import { useApp } from './context';

function PrivateRoute({ children }) {
  const { session } = useApp();
  if (!session || session.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute><AdminUsersPage /></PrivateRoute>} />
      <Route path="/admin/calendar" element={<PrivateRoute><AdminCalendarPage /></PrivateRoute>} />
      <Route path="/admin/classes" element={<PrivateRoute><AdminClassesPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
