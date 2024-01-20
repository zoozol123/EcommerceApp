import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginSignup from './Components/LoginSignUp/LoginSignup';
import Home from './Components/Home/Home'; // Assume you have a Home component
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Products from './Components/Products/Products';
import Cart from './Components/Cart/Cart';
import Order from './Components/Order/Order';
import ProductView from './Components/ProductView/ProductView';
import Admin from './Components/Admin/Admin';

function App() {
  useEffect(() => {
    document.title = "Sklep Odzieżowy";
  }, []);
  
  return (
<Router>
  <div className="site-container">
    <Navbar />
    <div className="content-wrap">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LoginSignup} />
        <Route path="/products" component={Products}/>
        <Route path="/product/:productId" component={ProductView} />
        <Route path="/cart" component={Cart} />
        <Route path="/purchase-details" component={Order} />
        <Route path="/admin" component={Admin} />



      </Switch>
    </div>
    <Footer />
  </div>
</Router>

  
  );
}

export default App;
