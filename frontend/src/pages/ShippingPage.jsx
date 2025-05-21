import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaShippingFast, FaMapMarkedAlt, FaCity, FaGlobe, FaMailBulk } from 'react-icons/fa';
import { saveShippingAddress } from '../redux/actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'GB');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <>
      <Helmet>
        <title>Shipping | GrapheneOS Store</title>
      </Helmet>
      
      <CheckoutSteps step1 step2 />
      
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FaShippingFast className="mr-2" />
          Shipping
        </h1>
        
        <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="address" className="form-label flex items-center">
              <FaMapMarkedAlt className="mr-2" /> Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="city" className="form-label flex items-center">
              <FaCity className="mr-2" /> City
            </label>
            <input
              type="text"
              id="city"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="postalCode" className="form-label flex items-center">
              <FaMailBulk className="mr-2" /> Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="country" className="form-label flex items-center">
              <FaGlobe className="mr-2" /> Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-control"
              required
            >
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="NL">Netherlands</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="SE">Sweden</option>
              <option value="NO">Norway</option>
              <option value="FI">Finland</option>
              <option value="DK">Denmark</option>
              <option value="NZ">New Zealand</option>
              <option value="IE">Ireland</option>
              <option value="BE">Belgium</option>
              <option value="CH">Switzerland</option>
              <option value="AT">Austria</option>
            </select>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Your privacy is our priority. We never share your shipping details with third parties.
            </p>
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            Continue to Payment
          </button>
        </form>
      </div>
    </>
  );
};

export default ShippingPage;