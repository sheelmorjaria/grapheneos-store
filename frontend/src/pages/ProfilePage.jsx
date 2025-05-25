import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaEnvelope, FaLock, FaBoxOpen } from 'react-icons/fa';
import { getUserDetails, updateUserProfile } from '../redux/actions/userActions';
import { listMyOrders } from '../redux/actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../redux/constants/userConstants';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;
  
  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          password: password ? password : undefined,
        })
      );
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile | GrapheneOS Store</title>
      </Helmet>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Update Form */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          
          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {successMessage && <Message variant="success">{successMessage}</Message>}
          
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
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label flex items-center">
                  <FaLock className="mr-2" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password (leave blank to keep current)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
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
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full">
                Update Profile
              </button>
            </form>
          )}
        </div>
        
        {/* Order History */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaBoxOpen className="mr-2" /> My Orders
          </h2>
          
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant="danger">{errorOrders}</Message>
          ) : orders && orders.length === 0 ? (
            <Message>You haven't placed any orders yet</Message>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders && orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order._id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          £{order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {order.isPaid ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {new Date(order.paidAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {order.isDelivered ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {new Date(order.deliveredAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Delivered
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="text-primary hover:text-primary-dark"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;