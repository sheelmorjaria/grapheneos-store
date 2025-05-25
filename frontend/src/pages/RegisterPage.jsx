import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { register } from '../redux/actions/userActions';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    // If user is already logged in, redirect
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      dispatch(register(name, email, password));
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | GrapheneOS Store</title>
      </Helmet>
      
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label htmlFor="name" className="form-label flex items-center">
                <FaUser className="mr-2" /> Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="form-label flex items-center">
                <FaEnvelope className="mr-2" /> Email Address
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
            
            <div className="mb-4">
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
                minLength="6"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label flex items-center">
                <FaLock className="mr-2" /> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                required
                minLength="6"
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full mb-4">
              Register
            </button>
            
            <div className="text-center">
              Already have an account?{' '}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : '/login'}
                className="text-primary hover:text-primary-dark"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <p>
                By registering, you agree to our{' '}
                <Link to="/terms" className="text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default RegisterPage;