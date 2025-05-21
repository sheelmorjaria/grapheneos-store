import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaArrowLeft } from 'react-icons/fa';
import { getUserDetails, updateUser } from '../../redux/actions/userActions';
import { USER_UPDATE_RESET } from '../../redux/constants/userConstants';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  
  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;
  
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/admin/userlist');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, navigate, userId, user, successUpdate]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    // Component JSX for the form interface
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Edit User | GrapheneOS Store</title>
      </Helmet>
      <Link to="/admin/userlist" className="btn btn-outline mb-4">
        <FaArrowLeft className="mr-2" /> Back to Users
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isAdmin" className="font-semibold">
              Is Admin
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Update User
          </button>
        </form>
      )}
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {successUpdate && <Message variant="success">User updated successfully</Message>}
    </div>
    );
}
export default UserEditPage;
// This code is a React component for editing user details in an admin panel. It uses Redux for state management and React Router for navigation. The component fetches user details, allows editing of the user's name, email, and admin status, and handles form submission to update the user information.