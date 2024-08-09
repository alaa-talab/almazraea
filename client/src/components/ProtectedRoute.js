import React from 'react';
import { Navigate } from 'react-router-dom';

// Assuming you have a `ProtectedRoute` component like this:
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
