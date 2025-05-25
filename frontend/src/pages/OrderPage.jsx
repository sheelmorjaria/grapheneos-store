import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaShippingFast, FaCreditCard, FaBox, FaMoneyBillWave, FaPaypal, FaShieldAlt } from 'react-icons/fa';
import { getOrderDetails, payOrder, deliverOrder } from '../redux/actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../redux/constants/orderConstants';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import PayPalButton from '../components/PayPalButton';

const OrderPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const [sdkReady, setSdkReady] = useState(false);
  
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  useEffect(() => {
    // Create PayPal script if needed
    const addPayPalScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.VITE_PAYPAL_CLIENT_ID}&currency=GBP`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };
    
    if (!order || successPay || successDeliver || order._id !== id) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, id, successPay, successDeliver, order]);
  
  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : order ? (
    <>
      <Helmet>
        <title>Order {order._id} | GrapheneOS Store</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Order {order._id.substring(order._id.length - 8)}</h1>
        <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      
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
                <strong>Name: </strong> {order.user.name}
              </p>
              <p className="mb-2">
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`} className="text-primary hover:text-primary-dark">
                  {order.user.email}
                </a>
              </p>
              <p className="mb-4">
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              
              <div className={`p-3 rounded-md ${
                order.isDelivered 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.isDelivered ? (
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Not delivered yet - your GrapheneOS device is being prepared
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-primary" /> Payment
              </h2>
              <p className="mb-4 flex items-center">
                <strong className="mr-1">Method: </strong>
                {order.paymentMethod === 'PayPal' && (
                  <span className="flex items-center">
                    <FaPaypal className="text-blue-600 mx-1" /> PayPal
                  </span>
                )}
              </p>
              
              <div className={`p-3 rounded-md ${
                order.isPaid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.isPaid ? (
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Not paid yet
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaBox className="mr-2 text-primary" /> Order Items
              </h2>
              
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className={`py-4 ${index === 0 ? 'pt-0' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="w-16 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-auto object-contain"
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
                          {item.qty} x £{item.price.toFixed(2)} = £{(item.qty * item.price).toFixed(2)}
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
                <span>£{order.itemsPrice}</span>
              </div>
              
              <div className="py-3 flex justify-between">
                <span>Shipping:</span>
                <span>£{order.shippingPrice}</span>
              </div>
              
              <div className="py-3 flex justify-between">
                <span>Tax (VAT 20%):</span>
                <span>£{order.taxPrice}</span>
              </div>
              
              <div className="py-3 flex justify-between font-bold">
                <span>Total:</span>
                <span>£{order.totalPrice}</span>
              </div>
            </div>
            
            {/* PayPal Button */}
            {!order.isPaid && (
              <div className="mt-6">
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    orderId={order._id}
                  />
                )}
              </div>
            )}
            
            {/* Admin: Mark as Delivered Button */}
            {userInfo && 
             userInfo.isAdmin && 
             order.isPaid && 
             !order.isDelivered && (
              <div className="mt-4">
                {loadingDeliver && <Loader />}
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
            
            {/* Privacy and Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
              <p className="flex items-start">
                <FaShieldAlt className="mt-0.5 mr-2" />
                Your GrapheneOS device is prepared with privacy in mind. We ship with discreet packaging and no external branding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default OrderPage;