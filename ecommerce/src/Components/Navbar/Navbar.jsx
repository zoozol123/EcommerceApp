// Navbar.js
import React from 'react';
import './Navbar.css'; // Link to the Navbar CSS file


const Navbar = () => {
  return (

    <div>
    {/* Banner or Sign Above Navbar */}
    <div className="banner">
      {/* Reference the image directly from the public folder */}
      <img src= '/images/Apparel.png' alt="Banner" />
    </div>

    <nav className="navbar">
      {/* Logo or brand name */}
      <div className="navbar-brand">

      </div>


      {/* User and Cart links */}
      <div className="user-cart">
      <a href="/">Stronga główna</a>
      <a href="/products">Produkty</a>
        <a href="/cart">Koszyk</a>
        <a href="/login">Logowanie</a>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
