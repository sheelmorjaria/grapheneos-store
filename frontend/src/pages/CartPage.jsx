import { useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';
import Message from '../components/ui/Message';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
      navigate('/cart');
    }
  }, [dispatch, id, qty, navigate]);
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart | GrapheneOS Store</title>
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FaShoppingCart className="mr-2" />
        Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty.{' '}
          <Link to="/" className="text-primary font-medium">
            Go Back
          </Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.product} className="p-4 flex flex-col sm:flex-row">
                    <div className="sm:w-24 flex-shrink-0 mb-4 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow sm:ml-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-medium text-primary hover:text-primary-dark"
                        >
                          {item.name}
                        </Link>
                        <div className="text-gray-700 mt-1 sm:mt-0">
                          £{item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Display condition if available */}
                      {item.condition && (
                        <div className="mb-2">
                          <span className={`text-xs font-semibold inline-block py-1 px-2 rounded ${
                            item.condition === 'A' ? 'bg-green-200 text-green-800' :
                            item.condition === 'B' ? 'bg-blue-200 text-blue-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {item.condition === 'A' ? 'Excellent' : 
                             item.condition === 'B' ? 'Good' : 'Fair'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">Qty:</span>
                          <select
                            value={item.qty}
                            onChange={(e) =>
                              dispatch(addToCart(item.product, Number(e.target.value)))
                            }
                            className="form-control py-1 px-2"
                          >
                            {[...Array(Math.min(item.countInStock, 5)).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeFromCartHandler(item.product)}
                          className="text-danger hover:text-danger-dark"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                {cartItems.reduce((acc, item) => acc + item.qty, 0) === 1
                  ? 'item'
                  : 'items'})
              </h2>
              
              <div className="text-xl font-bold mb-4">
                £{calculateSubtotal()}
              </div>
              
              <button
                type="button"
                className="btn btn-primary w-full"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
            
            <div className="mt-4 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold mb-2">Secure Checkout</h3>
              <p className="text-sm text-gray-600">
                All transactions are secure and encrypted. Your privacy is our priority.
              </p>
              
              {/* Additional GrapheneOS security messaging */}
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Your purchase of a GrapheneOS device protects your privacy from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;