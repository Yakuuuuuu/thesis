import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token exists, redirect the user to the login page.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a token exists, render the protected component.
  return <>{children}</>;
};

export default ProtectedRoute;
