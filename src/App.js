import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Terms from './pages/Terms';

import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Medicine from './pages/Medicine';
import Period from './pages/Period';
import Fitness from './pages/Fitness';
import Mood from './pages/Mood';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh',
      background: 'linear-gradient(135deg, #26215C, #534AB7, #1D9E75)',
      color: '#fff', fontSize: '18px',
      fontFamily: 'Playfair Display, serif'
    }}>
      Loading...
    </div>
  );

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/terms" element={<Terms />} />
        <Route path="/" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/medicine" element={<ProtectedRoute><Medicine /></ProtectedRoute>} />
        <Route path="/period" element={<ProtectedRoute><Period /></ProtectedRoute>} />
        <Route path="/fitness" element={<ProtectedRoute><Fitness /></ProtectedRoute>} />
        <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
