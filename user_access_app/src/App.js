// src/App.js
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Router, useRouter } from './context/RouterContext';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import '../src/styles/App.css';

const AppRoutes = () => {
  const { currentPath, navigate } = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && currentPath === '/') {
      switch (user.role?.toLowerCase()) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        default:
          navigate('/employee/dashboard');
          break;
      }
    }
  }, [user, loading, currentPath, navigate]);

  if (loading) {
    return (
      <div className="center-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  switch (currentPath) {
    case '/':
    case '/login':
      return user ? (
        <div className="center-screen">
          <div className="loading-text">Redirecting...</div>
        </div>
      ) : (
        <Login />
      );

    case '/signup':
      return user ? (
        <div className="center-screen">
          <div className="loading-text">Redirecting...</div>
        </div>
      ) : (
        <Signup />
      );

    case '/admin/dashboard':
      return (
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      );

    case '/manager/dashboard':
      return (
        <ProtectedRoute allowedRoles={['Manager']}>
          <ManagerDashboard />
        </ProtectedRoute>
      );

    case '/employee/dashboard':
      return (
        <ProtectedRoute allowedRoles={['Employee']}>
          <EmployeeDashboard />
        </ProtectedRoute>
      );

    default:
      return (
        <div className="center-screen">
          <div className="not-found-container">
            <h2 className="not-found-title">404 - Page Not Found</h2>
            <p className="not-found-message">The page you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/login')}
              className="redirect-button"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
  }
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
