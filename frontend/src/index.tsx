import React, { JSX } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TaskBoard from './pages/Todo';
import Login from './pages/Login';
import Register from './pages/Register'
import './index.css';
import { ToastProvider } from './services/toast';


interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {

  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};



const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
                <Login />
            </PublicRoute>} />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>} /> 

          <Route
            path="/"
            element={
              <RequireAuth>
                <TaskBoard />
              </RequireAuth>
            }
          />
          {/* Перенаправление по умолчанию */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);