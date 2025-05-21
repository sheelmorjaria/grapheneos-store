import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaCreditCard, FaPaypal, FaLock, FaShieldAlt } from 'react-icons/fa';
import { savePaymentMethod } from '../redux/actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redirect to shipping if shipping address not filled
  if (!shippingAddress.address) {
    navigate('/shipping');
  }
  
  // Default to PayPal
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <>
      <Helmet>
        <title>Payment Method | GrapheneOS Store</title>
      </Helmet>
      
      <CheckoutSteps step1 step2 step3 />
      
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FaCreditCard className="mr-2" />
          Payment Method
        </h1>
        
        <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Select Payment Method</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <input
                type="radio"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 h-4 w-4 text-primary"
              />
              <label htmlFor="PayPal" className="flex items-center cursor-pointer flex-grow">
                <FaPaypal className="text-blue-600 mr-2 text-xl" />
                <div>
                  <div className="font-medium">PayPal or Credit Card</div>
                  <div className="text-sm text-gray-500">Safe and easy payment via PayPal</div>
                </div>
              </label>
              <img 
                src="/img/paypal-cards.png" 
                alt="Payment options" 
                className="h-8 ml-auto" 
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            
            {/* Commented out for future payment methods
            <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 opacity-50 cursor-not-allowed">
              <input
                type="radio"
                id="Stripe"
                name="paymentMethod"
                value="Stripe"
                disabled
                className="mr-3 h-4 w-4"
              />
              <label htmlFor="Stripe" className="flex items-center cursor-not-allowed flex-grow">
                <FaCreditCard className="text-gray-600 mr-2 text-xl" />
                <div>
                  <div className="font-medium">Credit Card (Coming soon)</div>
                  <div className="text-sm text-gray-500">Direct payment with your card</div>
                </div>
              </label>
            </div>
            */}
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm">
            <div className="flex items-start mb-2">
              <FaShieldAlt className="text-blue-600 mt-0.5 mr-2" />
              <p className="text-blue-700">Your payment information is processed securely. We do not store credit card details.</p>
            </div>
            <div className="flex items-start">
              <FaLock className="text-blue-600 mt-0.5 mr-2" />
              <p className="text-blue-700">All financial transactions are encrypted and handled by our secure payment processor.</p>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            Continue to Review Order
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentPage;