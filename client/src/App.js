import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'; // Add Navigate import
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import AddResort from './components/AddResort';
import Resorts from './components/Resorts';
import AdminComponent from './components/AdminComponent';
import SelectRole from './components/SelectRole';
import UserProfile from './components/UserProfile';
import ResortDetail from './components/ResortDetail';
import MyResorts from './components/MyResorts'; // Import the MyResorts component
import EditResort from './components/EditResort'; // Import the EditResort component

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    if (token && role && userId) {
      setUser({ role, userId });
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    if (token && role && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      setUser({ role, userId });
      navigate('/');
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} setUser={setUser} onLogout={handleLogout} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/resorts" element={<Resorts />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/add-resort" element={user?.role === 'owner' ? <AddResort /> : <Navigate to="/" />} />
      <Route path="/admin" element={<AdminComponent />} />
      <Route path="/user-profile/:id" element={<UserProfile user={user} setUser={setUser} />} />
      <Route path="/resorts/:id" element={<ResortDetail user={user} />} />
      <Route path="/myresorts" element={user?.role === 'owner' ? <MyResorts user={user} /> : <Navigate to="/" />} />
      <Route path="/edit-resort/:id" element={user?.role === 'owner' ? <EditResort user={user} /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
