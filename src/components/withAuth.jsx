import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { status,role,data } = useSelector((state) => state.auth);
    console.log(data)
    if (status === 'unauthenticated') {
      return <Navigate to="/" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

