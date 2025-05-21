import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../redux/actions/userActions';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-graphene text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            GrapheneOS Store
          </Link>
          
          {/* Search Bar (Hidden on Mobile) */}
          <div className="hidden md:block">
            <form onSubmit={submitHandler} className="flex">
              <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Products..."
                className="px-3 py-2 text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary px-4 py-2 rounded-r-md hover:bg-primary-dark"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="flex items-center hover:text-primary-light">
              <FaShoppingCart className="mr-1" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-primary text-white text-xs rounded-full px-2 py-1">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center hover:text-primary-light">
                  <FaUser className="mr-1" />
                  {userInfo.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                  {userInfo.isAdmin && (
                    <>
                      <hr className="my-1" />
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Users
                      </Link>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center hover:text-primary-light">
                <FaUser className="mr-1" />
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-xl">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search (Shown only on mobile) */}
        <div className="mt-4 md:hidden">
          <form onSubmit={submitHandler} className="flex">
            <input
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search Products..."
              className="w-full px-3 py-2 text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary px-4 py-2 rounded-r-md hover:bg-primary-dark"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/cart" 
                className="flex items-center py-2 hover:text-primary-light"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaShoppingCart className="mr-2" />
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs rounded-full px-2 py-1">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Link>
              
              {userInfo ? (
                <>
                  <Link 
                    to="/profile" 
                    className="py-2 hover:text-primary-light"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logoutHandler();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left py-2 hover:text-primary-light"
                  >
                    Logout
                  </button>
                  
                  {userInfo.isAdmin && (
                    <>
                      <div className="py-1 text-sm text-gray-400">Admin</div>
                      <Link 
                        to="/admin/userlist" 
                        className="py-2 hover:text-primary-light"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Users
                      </Link>
                      <Link 
                        to="/admin/productlist" 
                        className="py-2 hover:text-primary-light"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Products
                      </Link>
                      <Link 
                        to="/admin/orderlist" 
                        className="py-2 hover:text-primary-light"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="py-2 hover:text-primary-light"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;