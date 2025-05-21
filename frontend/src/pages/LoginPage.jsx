import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaLock } from 'react-icons/fa';
import { login } from '../redux/actions/userActions';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    // If user is already logged in, redirect
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <>
      <Helmet>
        <title>Sign In | GrapheneOS Store</title>
      </Helmet>
      
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        
        {error && <Message variant="danger">{error}</Message>}
        
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label htmlFor="email" className="form-label flex items-center">
                <FaUser className="mr-2" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="form-label flex items-center">
                <FaLock className="mr-2" /> Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full mb-4">
              Sign In
            </button>
            
            <div className="text-center">
              New Customer?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                className="text-primary hover:text-primary-dark"
              >
                Register here
              </Link>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default LoginPage;