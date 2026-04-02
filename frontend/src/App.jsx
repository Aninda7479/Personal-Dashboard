import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import Wealth from './pages/Wealth';
import Love from './pages/Love';
import Happiness from './pages/Happiness';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><Health /></ProtectedRoute>} />
          <Route path="/wealth" element={<ProtectedRoute><Wealth /></ProtectedRoute>} />
          <Route path="/love" element={<ProtectedRoute><Love /></ProtectedRoute>} />
          <Route path="/happiness" element={<ProtectedRoute><Happiness /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
