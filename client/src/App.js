import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import AddResort from './components/AddResort';
import Resorts from './components/Resorts';
import AdminDashboard from './components/AdminDashboard';
import SelectRole from './components/SelectRole';
import UserProfile from './components/UserProfile';
import ResortDetail from './components/ResortDetail';
import MyResorts from './components/MyResorts';
import EditResort from './components/EditResort';
import VerifyEmail from './components/VerifyEmail';
import VerifyPhone from './components/VerifyPhone';
import ManageResorts from './components/ManageResorts';
import ManageUsers from './components/ManageUsers';
import HomepageSettings from './components/HomepageSettings';
import EditUser from './components/EditUser';
import CPAdmin from './components/CPAdmin'; // Ensure this is the correct path and name
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute'; // Assuming you have created this component

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

// Function to logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  window.location.href = '/ '; // Adjust the path to your login route
};

// Axios global response interceptor to handle session expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message;
      if (errorMessage === 'انتهت صلاحية الجلسة') {
        alert('انتهت صلاحية الجلسة. سيتم تسجيل خروجك.');
        logout();
      } else {
        alert(errorMessage);
      }
    }
    return Promise.reject(error);
  }
);

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
    logout();
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} setUser={setUser} onLogout={handleLogout} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/resorts" element={<Resorts />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route 
        path="/add-resort" 
        element={
          <ProtectedRoute user={user} allowedRoles={['owner', 'admin']}>
            <AddResort user={user} />
          </ProtectedRoute>
        } 
      />
      <Route path="/cp-admin" element={<CPAdmin setAdmin={setUser} />} />
      <Route 
        path="/cp-admin/dashboard" 
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cp-admin/manage-resorts" 
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ManageResorts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cp-admin/manage-users" 
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cp-admin/edit-user/:id" 
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <EditUser />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cp-admin/homepage-settings" 
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <HomepageSettings />
          </ProtectedRoute>
        } 
      />
      <Route path="/user-profile/:id" element={<UserProfile user={user} setUser={setUser} />} />
      <Route path="/resorts/:id" element={<ResortDetail user={user} />} />
      <Route 
        path="/myresorts" 
        element={
          <ProtectedRoute user={user} allowedRoles={['owner', 'admin']}>
            <MyResorts user={user} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-resort/:id" 
        element={
          <ProtectedRoute user={user} allowedRoles={['owner', 'admin']}>
            <EditResort user={user} />
          </ProtectedRoute>
        } 
      />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/verify-phone/:token" element={<VerifyPhone />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
