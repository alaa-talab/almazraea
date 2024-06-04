import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';  // Import the HomePage component
import Register from './components/Register';
import Login from './components/Login';
import AddResort from './components/AddResort';
import Resorts from './components/Resorts';
import AdminComponent from './components/AdminComponent';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  };

  const isOwner = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'owner';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* Set HomePage as the root page */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resorts" element={<Resorts />} />
        <Route
          path="/add-resort"
          element={isOwner() ? <AddResort /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAdmin() ? <AdminComponent /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
