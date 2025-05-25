import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { HelmetProvider } from 'react-helmet-async';
import store from './redux/store';
import App from './App';
import './index.css';

const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "GBP",
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={paypalOptions}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>,
);