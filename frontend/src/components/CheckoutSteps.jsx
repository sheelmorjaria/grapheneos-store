import { Link } from 'react-router-dom';
import { FaUser, FaShippingFast, FaCreditCard, FaCheck } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="mb-8 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        {/* Step 1: Sign In */}
        <div className={`flex flex-col items-center ${step1 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            <FaUser />
          </div>
          <span className="mt-2 text-sm">Sign In</span>
        </div>
        
        {/* Connector Line */}
        <div className={`flex-grow border-t border-gray-300 self-center mx-2 ${
          step2 ? 'border-primary' : 'border-gray-200'
        }`}></div>
        
        {/* Step 2: Shipping */}
        <div className={`flex flex-col items-center ${
          step2 ? 'text-primary' : 'text-gray-400'
        }`}>
          {step1 ? (
            <Link to="/shipping" className="relative">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <FaShippingFast />
              </div>
            </Link>
          ) : (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <FaShippingFast />
            </div>
          )}
          <span className="mt-2 text-sm">Shipping</span>
        </div>
        
        {/* Connector Line */}
        <div className={`flex-grow border-t border-gray-300 self-center mx-2 ${
          step3 ? 'border-primary' : 'border-gray-200'
        }`}></div>
        
        {/* Step 3: Payment */}
        <div className={`flex flex-col items-center ${
          step3 ? 'text-primary' : 'text-gray-400'
        }`}>
          {step2 ? (
            <Link to="/payment" className="relative">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <FaCreditCard />
              </div>
            </Link>
          ) : (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <FaCreditCard />
            </div>
          )}
          <span className="mt-2 text-sm">Payment</span>
        </div>
        
        {/* Connector Line */}
        <div className={`flex-grow border-t border-gray-300 self-center mx-2 ${
          step4 ? 'border-primary' : 'border-gray-200'
        }`}></div>
        
        {/* Step 4: Place Order */}
        <div className={`flex flex-col items-center ${
          step4 ? 'text-primary' : 'text-gray-400'
        }`}>
          {step3 ? (
            <Link to="/placeorder" className="relative">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <FaCheck />
              </div>
            </Link>
          ) : (
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <FaCheck />
            </div>
          )}
          <span className="mt-2 text-sm">Place Order</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;