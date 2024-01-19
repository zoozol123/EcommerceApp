// Order.jsx

import React, { useState } from 'react';
import './Order.css'; // Link to the Order CSS file

const Order = () => {
  const paymentMethods = ['Karta', 'PayPal', 'Google Pay'];
  const shippingMethods = ['Standardowa przesyłka', 'Przesyłka ekspresowa', 'Odbiór osobisty'];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0]);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [isOrderComplete, setOrderComplete] = useState(false);
  const [addressMessage, setAddressMessage] = useState(false);
  const [nameMessage, setNameMessage] = useState(false);
  const [surnameMessage, setSurnameMessage] = useState(false);
  const [countryMessage, setCountryMessage] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState(false);
  const [emailAddressMessage, setEmailAddressMessage] = useState(false);
  const [wrongEmailAddressMessage, setWrongEmailAddressMessage] = useState(false);
  const [wrongPhoneNumberMessage, setWrongPhoneNumberMessage] = useState(false);

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleShippingMethodChange = (e) => {
    setSelectedShippingMethod(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailAddressChange = (e) => {
    setEmailAddress(e.target.value);
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  function isNineDigitNumber(phoneNumber) {
    // Usuwamy spacje, myślniki i inne znaki specjalne z numeru telefonu
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  
    // Sprawdzamy, czy oczyszczony numer telefonu ma dokładnie 9 cyfr
    if (/^\d{9}$/.test(cleanedPhoneNumber)) {
      return true; // Numer telefonu jest liczbą 9-cyfrową
    } else {
      return false; // Numer telefonu nie spełnia kryteriów
    }
  }

  const setMessagesFalse = () => {
    setNameMessage(false);
    setSurnameMessage(false);
    setAddressMessage(false);
    setCountryMessage(false);
    setPhoneNumberMessage(false);
    setEmailAddressMessage(false);
  }

  function isFormFilled() {
    if (name.trim() === '') {
      return true;
    } else if (surname.trim() === '') {
      return true;
    } else if (address.trim() === '') {
      return true;
    } else if (country.trim() === '') {
      return true;
    } else if (phoneNumber.trim() === '') {
      return true;
    } else if (emailAddress.trim() === '') {
      return true;
    } else {
      return false;
    }
  }

  const handleProceedToCheckout = () => {
    if(isFormFilled()) {
      if (name.trim() === '') {
        setNameMessage(true);
        setOrderComplete(false);
      } 
      if (surname.trim() === '') {
        setSurnameMessage(true);
        setOrderComplete(false);
      } 
      if (address.trim() === '') {
        setAddressMessage(true);
        setOrderComplete(false);
      } 
      if (country.trim() === '') {
        setCountryMessage(true);
        setOrderComplete(false);
      } 
      if (phoneNumber.trim() === '') {
        setPhoneNumberMessage(true);
        setWrongPhoneNumberMessage(false);
        setOrderComplete(false);
      } else if(phoneNumber.trim() !== '') {
        setWrongPhoneNumberMessage(false);
        setOrderComplete(false);
      }
      if (emailAddress.trim() === '') {
        setEmailAddressMessage(true);
        setWrongEmailAddressMessage(false);
        setOrderComplete(false);
      } else if (emailAddress.trim() !== '') {
        setWrongEmailAddressMessage(false);
        setOrderComplete(false);
      }
      if (!isValidEmail(emailAddress) && emailAddress.trim() !== '') {
        setWrongEmailAddressMessage(true);
        setOrderComplete(false);
      } 
      if (!isNineDigitNumber(phoneNumber) && phoneNumber.trim() !== ''){
        setWrongPhoneNumberMessage(true);
        setOrderComplete(false);
      }
      return;
    }
    if(isFormFilled() === false) {
      setOrderComplete(true);
    }
  };

  return (
    <div className={`order-summary ${isOrderComplete ? 'order-complete' : ''}`}>
      {isOrderComplete ? (
        <div className="order-complete-message">
          <p>Twoje zamówienie zostało złożone!</p>
        </div>
      ) : (
        <>
      <h3>Podsumowanie zamówienia</h3>
      <div className='personal-data'>
      <label>
        Imię:
        <input type="text" value={name} onChange={handleNameChange} />
        {nameMessage ===true?<div className='error-messages'>Podaj imię aby zamówić.</div>: <div></div>}
      </label>
      
      <label>
        Nazwisko:
        <input type="text" value={surname} onChange={handleSurnameChange} />
        {surnameMessage ===true?<div className='error-messages'>Podaj nazwisko aby zamówić.</div>: <div></div>}
      </label>
      </div>

      <div className='address-data'>
      <label>
        Adres:
        <input type="text" value={address} onChange={handleAddressChange} />
        {addressMessage ===true?<div className='error-messages'>Podaj adres i kod pocztowy aby zamówić.</div>: <div></div>}
      </label>
      <label>
        Kraj:
        <input type="text" value={country} onChange={handleCountryChange} />
        {countryMessage ===true?<div className='error-messages'>Podaj kraj aby zamówić.</div>: <div></div>}
      </label>
      </div>

      <div className='contact-data'>
      <label>
        Numer telefonu:
        <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
        {phoneNumberMessage ===true?<div className='error-messages'>Podaj numer telefonu aby zamówić.</div>: <div></div>}
        {wrongPhoneNumberMessage ===true?<div className='error-messages'>Podany numer telefonu nie jest liczbą 9-cio cyfrową.</div>: <div></div>}
      </label>
      <label>
        Adres e-mail:
        <input type="email" value={emailAddress} onChange={handleEmailAddressChange} />
        {emailAddressMessage ===true?<div className='error-messages'>Podaj adres e-mail aby zamówić.</div>: <div></div>}
        {wrongEmailAddressMessage ===true?<div className='error-messages'>Podany adres e-mail jest nieprawidłowy.</div>: <div></div>}
      </label>
      </div>


      <label>
        Metoda płatności:
        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange}>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
      <label>
        Dostawa:
        <select value={selectedShippingMethod} onChange={handleShippingMethodChange}>
          {shippingMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
          <button onClick={()=>{ setMessagesFalse(); handleProceedToCheckout(); console.log(isOrderComplete)}}>Zamów</button>
        </>
      )}
    </div>
  );
};

export default Order;
