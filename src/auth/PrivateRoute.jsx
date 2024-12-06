import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = sessionStorage.getItem('token');

  // If no token, redirect to login page
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;