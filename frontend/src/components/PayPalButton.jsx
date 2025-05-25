// Create at src/components/PayPalButton.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import { payOrder } from '../redux/actions/orderActions';
import Loader from './ui/Loader';

const PayPalButton = ({ orderId, amount }) => {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Create PayPal order
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: 'GBP',
          },
          description: `GrapheneOS Store Order #${orderId.substring(0, 8)}`,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING', // Since we already collected shipping info
        brand_name: 'GrapheneOS Store',
        user_action: 'PAY_NOW',
      },
    });
  };

  // Handle successful payment approval
  const onApprove = (data, actions) => {
    setIsPending(true);
    return actions.order.capture()
      .then((details) => {
        // Get PayPal transaction details
        const paymentResult = {
          paypalOrderID: data.orderID,
          id: details.id,
          status: details.status,
          update_time: details.update_time,
          email_address: details.payer.email_address,
          payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        };
        
        // Update order in backend
        dispatch(payOrder(orderId, paymentResult))
          .then(() => {
            setIsPending(false);
            setSuccess(true);
          })
          .catch((err) => {
            console.error('Payment verification error:', err);
            setError('Payment completed, but verification failed. Please contact support.');
            setIsPending(false);
          });
      })
      .catch((err) => {
        console.error('PayPal capture error:', err);
        setError('Payment processing error. Please try again.');
        setIsPending(false);
      });
  };

  // Handle payment cancellation
  const onCancel = () => {
    setError('Payment was cancelled. Please try again when you are ready.');
  };

  // Handle payment errors
  const onError = (err) => {
    console.error('PayPal error:', err);
    setError('Payment processing error. Please try again or use a different payment method.');
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          <div className="flex items-start">
            <FaShieldAlt className="mt-1 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          <div className="flex items-start">
            <FaShieldAlt className="mt-1 mr-2" />
            <p>Payment successful! Your order has been processed.</p>
          </div>
        </div>
      )}
      
      {isPending ? (
        <div className="text-center p-4">
          <p className="mb-2">Processing your payment...</p>
          <Loader />
        </div>
      ) : !success ? (
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="font-medium mb-3">Complete your purchase</h3>
          <PayPalButtons
            style={{
              color: "blue",
              shape: "rect",
              label: "pay",
              height: 40,
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
            onError={onError}
            forceReRender={[amount, orderId]}
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-start mb-2">
              <FaLock className="mt-1 mr-2 text-gray-500" />
              <p>Your payment is secure and encrypted. No payment details are stored on our servers.</p>
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          By completing your purchase, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};

export default PayPalButton;