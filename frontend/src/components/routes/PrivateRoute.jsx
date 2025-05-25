import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const location = useLocation();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // If user is authenticated, render the child routes (Outlet)
  // If not, redirect to login with a redirect parameter to return after login
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate 
      to={`/login?redirect=${encodeURIComponent(location.pathname)}`} 
      replace 
    />
  );
};

export default PrivateRoute;