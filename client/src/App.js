import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import AddResort from './components/AddResort';
import Resorts from './components/Resorts';
import AdminComponent from './components/AdminComponent';
import SelectRole from './components/SelectRole';
import UserProfile from './components/UserProfile';
import ResortDetail from './components/ResortDetail';
import Chat from './components/Chat'; // Import Chat

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

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/resorts" element={<Resorts />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/add-resort" element={<AddResort />} />
      <Route path="/admin" element={<AdminComponent />} />
      <Route path="/user-profile/:id" element={<UserProfile user={user} setUser={setUser} />} />
      <Route path="/resorts/:id" element={<ResortDetail />} />
      <Route path="/chat/:roomId" element={<Chat user={user} chatRoom="roomId" />} /> {/* Add Chat route */}
    </Routes>
  );
};

export default App;
