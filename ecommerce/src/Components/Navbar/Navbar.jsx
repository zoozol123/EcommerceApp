import React from 'react';
import './Navbar.css'; 


const Navbar = () => {
  return (

    <div>
    <div className="banner">
      <img src= '/images/Apparel.png' alt="Banner" />
    </div>

    <nav className="navbar">
      <div className="navbar-brand">

      </div>


      <div className="user-cart">
      <a href="/">Strona główna</a>
      <a href="/products">Produkty</a>
        <a href="/cart">Koszyk</a>
        <a href="/login">Logowanie</a>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
