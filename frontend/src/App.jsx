import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Emergency from './pages/Emergency';
import Archive from './pages/Archive';
import CalendarPage from './pages/Calendar';
import Medications from './pages/Medications';
import Vitals from './pages/Vitals';
import Vaccines from './pages/Vaccines';
import Login from './pages/AuthLogin';
import Register from './pages/AuthRegister';
import ThreeBodyViewer from './components/ThreeBodyViewer';
import PublicEmergency from './pages/PublicEmergency';
import Settings from './pages/Settings';
import { api, clearSession, getStoredSession, storeSession } from './lib/api';

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(() => getStoredSession().user);
  const [checkingSession, setCheckingSession] = useState(Boolean(getStoredSession().token));
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = getStoredSession();
    if (!token) {
      setCheckingSession(false);
      return;
    }
    api('/api/auth/me')
      .then(({ user: sessionUser }) => setUser(sessionUser))
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = (session) => {
    storeSession(session);
    setUser(session.user);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    navigate('/login');
  };

  if (checkingSession) {
    return <div className="grid min-h-screen place-items-center bg-[#f5f7f8] text-medink">Apro la tua cartella clinica...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-950">
      <div className="md:flex">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute user={user}><Emergency user={user} /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute user={user}><Archive /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute user={user}><CalendarPage /></ProtectedRoute>} />
            <Route path="/medications" element={<ProtectedRoute user={user}><Medications /></ProtectedRoute>} />
            <Route path="/vitals" element={<ProtectedRoute user={user}><Vitals /></ProtectedRoute>} />
            <Route path="/vaccines" element={<ProtectedRoute user={user}><Vaccines /></ProtectedRoute>} />
            <Route path="/3d-body" element={<ProtectedRoute user={user}><ThreeBodyViewer /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute user={user}><Settings /></ProtectedRoute>} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="/public/emergency/:userId" element={<PublicEmergency />} />
            <Route path="*" element={<div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">Pagina non trovata.</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
