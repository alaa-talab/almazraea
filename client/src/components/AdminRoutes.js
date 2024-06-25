import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AddResort from './AddResort';
import ManageResorts from './ManageResorts';
import ManageUsers from './ManageUsers';
import HomepageSettings from './HomepageSettings';

const AdminRoutes = ({ admin }) => {
  if (!admin) {
    return <Navigate to="/cp-admin" />;
  }

  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-resort" element={<AddResort />} />
      <Route path="/admin/manage-resorts" element={<ManageResorts />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/homepage-settings" element={<HomepageSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
