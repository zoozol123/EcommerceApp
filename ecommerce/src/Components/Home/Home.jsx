// Home.js
import React, { useEffect } from 'react';
import './Home.css'; // Link to the Navbar CSS file
import { Link } from 'react-router-dom'; // Dodaj ten import


const Home = () => {

    const popularProducts = [
        { id: 1, image: "/images/popular1.jpg", description: "Product 1 Description" },
        { id: 2, image: "/images/popular2.jpg", description: "Product 2 Description" },
        { id: 3, image: "/images/popular3.jpg", description: "Product 1 Description" },
        { id: 4, image: "/images/popular4.jpg", description: "Product 2 Description" },
        { id: 5, image: "/images/popular5.jpg", description: "Product 1 Description" },
        { id: 6, image: "/images/popular6.jpg", description: "Product 2 Description" },
        { id: 7, image: "/images/popular7.jpg", description: "Product 1 Description" },
        { id: 8, image: "/images/popular8.jpg", description: "Product 2 Description" },
        { id: 9, image: "/images/popular9.jpg", description: "Product 1 Description" },
        { id: 10, image: "/images/popular10.jpg", description: "Product 2 Description" },
        { id: 11, image: "/images/popular11.jpg", description: "Product 1 Description" },
        { id: 12, image: "/images/popular12.jpg", description: "Product 2 Description" },
        // Dodaj więcej produktów, jeśli potrzebujesz
      ];
    
      // Funkcja do obsługi kliknięcia na produkt
      const handleProductClick = (productId) => {
        // Nawiguj do widoku ProductView z wybranym identyfikatorem produktu
        // Możesz użyć Link do nawigacji lub innej funkcji zgodnej z Twoim frameworkiem routingu
        // Na przykład, jeśli używasz React Router, to zamiast navigateToProductView użyj history.push
        //history.push(`/product/${productId}`);
      };
  return (
    <div>
      <div className="mainbanner">
        <img src="/images/banner2.png" alt="mainbanner" />
      </div>

      <div className="category-section">
        <div className="category-square">
            <div className='border'>
          <a href="/categories">
            <h2>NEW IN</h2>
          </a>
          </div>
        </div>

        <div className="category-square">
        <div className='border'>
          <a href="/popular-products">
            <h2>WOMEN</h2>
          </a>
          </div>
        </div>

        <div className="category-square">
        <div className='border'>
          <a href="/reviews"> <h2>MAN</h2></a>
          </div>
        </div>

        <div className="category-square">
        <div className='border'>

          <a href="/reviews">
            <h2>HOME</h2>
          </a>
          </div>

        </div>
      </div>


      <div className='popular-products-section'>
        <h2> POPULAR PRODUCTS</h2>
        <div className='photos'>
          {popularProducts.map((product) => (
            // Zmieniłem <img> na <Link> do nawigacji do widoku ProductView po kliknięciu
            <Link key={product.id} to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={`popular-${product.id}`}
                onClick={() => handleProductClick(product.id)}
              />
            </Link>
          ))}
        </div>
        <a href="/products"><button>See More</button></a>

      </div>


      <div className='benefits'>
        <h2>BENEFITS</h2>

        <div className='benefits-row'>

        <div className='benefit-square'>
        <p>Want 10% discount and free delivery? 
            <br></br>Become a Club Member!</p>
        </div>

        <div className='benefit-square'>
        <p>Delivery 2-3 business days</p>
         </div>

        <div className='benefit-square'>
        <p>Free delivery for Club Members when purchasing over $100,and always free for Premium Club Members.</p>
        </div>

        </div>
      </div>

      

    </div>
  );
}

export default Home;
