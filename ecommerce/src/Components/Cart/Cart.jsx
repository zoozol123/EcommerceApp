import React, { useState, useEffect } from 'react';
import './Cart.css'; // Link to the Navbar CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'


const Cart = () => {
  const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('Standard Delivery');
  const [isCheckoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    // Obliczanie sumy cen produktów w koszyku za każdym razem, gdy koszyk się zmienia
    const newTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const hasItems = cartItems && cartItems.length > 0;

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.productId === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
    sessionStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  function handleRemoveItem (itemId) {
    console.log('Przed usunięciem:', cartItems);
    const updatedCartItems = cartItems.filter((item) => item.productId !== itemId);
    console.log('Po usunięciu:', updatedCartItems);
    setCartItems(updatedCartItems);

    // Zapisz zaktualizowany koszyk do sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  return (
    <div className={`shopping-cart-container ${hasItems ? 'has-items' : ''}`}>
      {isCheckoutComplete ? (
        <div className="checkout-complete-message-container">
          <p className="checkout-complete-message">Your purchase has been completed!</p>
        </div>
      ) : (
        <div>
          <h2>Koszyk</h2>
          {cartItems && cartItems.length > 0 ? (
            <div className="cart-content">
              <ul>
                {cartItems.map((item) => (
                  <li key={item?.productId}>
                    <img src={`/images/popular${item?.productId}.jpg`} alt={item?.productName} />
                    <div className='details-info'>
                      <h3>{item?.productName}</h3>
                      <p>Cena: {(item?.price * item?.quantity).toFixed(2)} zł</p>
                      <label>
                        Ilość:
                        <input
                          type="number"
                          min="1"
                          value={item?.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                        />
                      </label>
                      <button className="input-icon" onClick={()=>{ handleRemoveItem(item.productId); }}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className='summary-price'>Suma: {totalPrice.toFixed(2)} zł</p>
              {sessionStorage.getItem('logged') ==='true'?
                <a className='purchase-details' href="/purchase-details"><button>Szczegóły dostawy</button></a>: 
                <a className='purchase-details' href="/login"><button>Szczegóły dostawy</button></a>  }
            </div>
          ) : (
            <p className="empty-cart-message">Twój koszyk jest pusty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
