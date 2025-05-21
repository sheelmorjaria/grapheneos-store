import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaCheck, FaShippingFast, FaCreditCard, FaBox, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import { createOrder } from '../redux/actions/orderActions';
import { ORDER_CREATE_RESET } from '../redux/constants/orderConstants';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;
  
  // Check if shipping and payment info exist
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, shippingAddress, paymentMethod]);
  
  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  
  cart.itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
  
  cart.taxPrice = addDecimals(Number((0.20 * cart.itemsPrice).toFixed(2)));
  
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);
  
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;
  
  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [navigate, success, order, dispatch]);
  
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Review & Place Order | GrapheneOS Store</title>
      </Helmet>
      
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaShippingFast className="mr-2 text-primary" /> Shipping
              </h2>
              <p className="mb-2">
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-primary" /> Payment Method
              </h2>
              <p className="flex items-center">
                <strong className="mr-2">Method: </strong>
                {paymentMethod === 'PayPal' && (
                  <span className="flex items-center">
                    <FaPaypal className="mr-1 text-blue-600" /> PayPal
                  </span>
                )}
              </p>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaBox className="mr-2 text-primary" /> Order Items
              </h2>
              
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className={`py-4 ${index === 0 ? 'pt-0' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="w-16 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            {item.name}
                          </Link>
                          
                          {/* Display condition if available */}
                          {item.condition && (
                            <div className="mt-1">
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
                        </div>
                        <div className="text-right">
                          {item.qty} x £{item.price} = £{(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-primary" /> Order Summary
            </h2>
            
            <div className="divide-y divide-gray-200">
              <div className="py-3 flex justify-between">
                <span>Items:</span>
                <span>£{cart.itemsPrice}</span>
              </div>
              
              <div className="py-3 flex justify-between">
                <span>Shipping:</span>
                <span>£{cart.shippingPrice}</span>
              </div>
              
              <div className="py-3 flex justify-between">
                <span>Tax (VAT 20%):</span>
                <span>£{cart.taxPrice}</span>
              </div>
              
              <div className="py-3 flex justify-between font-bold">
                <span>Total:</span>
                <span>£{cart.totalPrice}</span>
              </div>
            </div>
            
            {error && <Message variant="danger" className="mt-4">{error}</Message>}
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 mb-4">
              <div className="flex items-start">
                <FaShieldAlt className="mt-0.5 mr-2" />
                <p>
                  Your GrapheneOS device will be securely shipped with privacy-preserving packaging.
                  No logos or branding that could identify the contents.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                  Processing...
                </div>
              ) : (
                <>Place Order</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;