import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { LoginPage } from './pages/LoginPage';
import { useAppStore } from './store/appStore';

function App() {
  const { currentUser } = useAppStore();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !currentUser ? <LoginPage /> : <Navigate to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} replace />
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            currentUser?.role === 'admin' ? <AdminDashboard /> : <Navigate to={currentUser ? '/dashboard' : '/login'} replace />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            currentUser ? <UserDashboard /> : <Navigate to="/login" replace />
          } 
        />

        <Route path="/" element={<Navigate to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
