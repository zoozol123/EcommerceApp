// Order.jsx

import React, { useState } from 'react';
import './Order.css'; // Link to the Order CSS file

const Order = () => {
  const paymentMethods = ['Credit Card', 'PayPal', 'Stripe'];
  const shippingMethods = ['Standard Delivery', 'Express Delivery', 'Pickup'];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0]);
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [isOrderComplete, setOrderComplete] = useState(false);

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleShippingMethodChange = (e) => {
    setSelectedShippingMethod(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

  const handleProceedToCheckout = () => {
    // Add logic for any additional processing or validation if needed

    // Mark the order as complete
    setOrderComplete(true);
  };

  return (
    <div className={`order-summary ${isOrderComplete ? 'order-complete' : ''}`}>
      {isOrderComplete ? (
        <div className="order-complete-message">
          <p>Your purchase has been completed!</p>
        </div>
      ) : (
        <>
      <h3>Order Summary</h3>
      <div className='personal-data'>
      <label>
        Name:
        <input type="text" value={address} onChange={handleAddressChange} />
      </label>
      <label>
        Surname:
        <input type="text" value={address} onChange={handleAddressChange} />
      </label>
      </div>

      <div className='address-data'>
      <label>
        Address:
        <input type="text" value={address} onChange={handleAddressChange} />
      </label>
      <label>
        Country:
        <input type="text" value={address} onChange={handleAddressChange} />
      </label>
      </div>

      <div className='contact-data'>
      <label>
        Phone Number:
        <input type="text" value={contact} onChange={handleContactChange} />
      </label>
      <label>
        E-mail address:
        <input type="text" value={contact} onChange={handleContactChange} />
      </label>
      </div>


      <label>
        Payment Method:
        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange}>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
      <label>
        Shipping Method:
        <select value={selectedShippingMethod} onChange={handleShippingMethodChange}>
          {shippingMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
          <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Order;
