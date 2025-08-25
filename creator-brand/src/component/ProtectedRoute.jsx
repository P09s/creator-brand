import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { isAuthenticated, user, token, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (token && !user) {
      initializeAuth();
    }
  }, [token, user, initializeAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = user?.userType === 'influencer' 
      ? '/influencer_dashboard' 
      : '/org_dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;