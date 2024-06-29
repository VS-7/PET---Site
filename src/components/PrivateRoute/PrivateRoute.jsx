import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthValue } from '../../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthValue();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
