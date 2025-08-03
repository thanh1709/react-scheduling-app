import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth || !auth.token) {
        // User is not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userHasRequiredRole = auth.roles && allowedRoles.some(role => auth.roles.includes(role));

    if (!userHasRequiredRole) {
        // User is logged in but does not have the required role
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;