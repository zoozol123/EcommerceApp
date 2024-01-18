import React, { useState } from 'react';
import './Cart.css'; // Link to the Navbar CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'


const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 20, image: '/images/popular1.jpg', quantity: 1 },
    { id: 2, name: 'Product 2', price: 30, image: '/images/popular2.jpg', quantity: 1 },
    { id: 3, name: 'Product 3', price: 25, image: '/images/popular3.jpg', quantity: 1 },
  ]);

  const paymentMethods = ['Credit Card', 'PayPal', 'Stripe']; // Dodane metody płatności
  const shippingMethods = ['Standard Delivery', 'Express Delivery', 'Pickup']; // Dodane metody dostawy

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0]);
  const [isCheckoutComplete, setCheckoutComplete] = useState(false);

  const hasItems = cartItems && cartItems.length > 0;

  const handleQuantityChange = (itemId, newQuantity) => {
    // Aktualizacja ilości produktu w koszyku
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    // Aktualizacja stanu
    setCartItems(updatedCartItems);
  };

  const handleRemoveItem = (itemId) => {
    // Usunięcie produktu z koszyka
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    // Aktualizacja stanu
    setCartItems(updatedCartItems);
  };

  const handleProceedToCheckout = () => {
    // Tutaj można dodać logikę związana z finalizacją zakupów
    // np. wysyłanie zamówienia do serwera, aktualizacja stanu itp.

    // Po zrealizowaniu zakupów ustaw flagę isCheckoutComplete na true
    setCheckoutComplete(true);
  };

  return (
    <div className={`shopping-cart-container ${hasItems ? 'has-items' : ''}`}>
      {isCheckoutComplete ? (
        <div className="checkout-complete-message-container">
          <p className="checkout-complete-message">Your purchase has been completed!</p>
        </div>
      ) : (
        <div>
          <h2>Shopping Cart</h2>
          {hasItems ? (
            <div className="cart-content">
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className='details-info'>
                      <h3>{item.name}</h3>
                      <p>Price: ${item.price}</p>
                      <label>
                        Quantity:
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        />
                      </label>
                      <button className="input-icon"><FontAwesomeIcon  icon={faTrash} /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <a className='purchase-details' href="/purchase-details"><button>Purchase Details</button></a>

         
            </div>
          ) : (
            <p className="empty-cart-message">Your cart is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;