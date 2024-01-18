import React, { useState, useEffect } from 'react';
import './Products.css'; // Link to the Navbar CSS file
import { Link } from 'react-router-dom'; // Dodany import Link


const Products = () => {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    // Pobieranie danych produktów z serwera
    fetch('/products')
      .then(response => response.json())
      .then(data => {
        // Aktualizacja listy produktów z dynamiczną ścieżką do obrazka
        setProductsList(data.map((product, index) => ({
          ...product,
          image: `/images/popular${product.id}.jpg`
        })));
      })
      .catch(error => console.error('Błąd podczas pobierania danych produktów:', error));
  }, []);
  
 // State for search query
 const [searchQuery, setSearchQuery] = useState('');

 // State for sorting option
 const [sortOption, setSortOption] = useState('default');

 // State for current page
 const [currentPage, setCurrentPage] = useState(1);

 // Products per page
 const productsPerPage = 9;

 // Calculate starting and ending indices of products to display
 const startIndex = (currentPage - 1) * productsPerPage;
 const endIndex = startIndex + productsPerPage;

 // Filter products based on search query and sort option
 const filteredProducts = productsList
   .filter((product) =>
     product.name.toLowerCase().includes(searchQuery.toLowerCase())
   )
   .sort((a, b) => {
     if (sortOption === 'default') {
       // Implement default sorting logic
       return a.id - b.id;
     }
     // Implement additional sorting logic as needed
   });

 // Paginated products to display
 const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

 // Function to handle search input
 const handleSearch = (e) => {
   setSearchQuery(e.target.value);
   setCurrentPage(1); // Reset page when search query changes
 };

 // Function to handle sorting option change
 const handleSortChange = (e) => {
   setSortOption(e.target.value);
   setCurrentPage(1); // Reset page when sort option changes
 };

 // Function to handle page change
 const handlePageChange = (newPage) => {
   setCurrentPage(newPage);
 };

   // State for tracking whether the product is added to cart
   const [addedToCart, setAddedToCart] = useState(Array(productsList.length).fill(false));

   // Function to handle adding to cart
   const handleAddToCart = (productId) => {
     // Update the addedToCart state for the specific product
     const updatedAddedToCart = [...addedToCart];
     updatedAddedToCart[productId - 1] = true; // Assuming product IDs start from 1
     setAddedToCart(updatedAddedToCart);
   };

 return (
   <div className='product-container'>
     {/* Search bar */}
     <div className='search-bar'>
       <input
         type='text'
         placeholder='Search products...'
         value={searchQuery}
         onChange={handleSearch}
       />
       {/* Add sorting options dropdown */}
       <select value={sortOption} onChange={handleSortChange}>
         <option value='default'>Default Sorting</option>
         {/* Add more sorting options as needed */}
       </select>
     </div>
     
      {/* Obszar wyświetlania produktów */}
      <div className='product-display'>
        {paginatedProducts.map((product) => (
       <div className='product-card'>
        <Link to={`/product/${product.id}`} className="product-link">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
        </Link>

         <button
           className={`addToCart ${addedToCart[product.id - 1] ? 'added' : ''}`}
           onClick={() => handleAddToCart(product.id)}
           disabled={addedToCart[product.id - 1]}
         >
           {addedToCart[product.id - 1] ? 'Added' : 'Add to cart'}
         </button>
       </div>     
        ))}
      </div>


     {/* Pagination */}
     <div className='pagination'>
       {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
         <button
           key={index + 1}
           onClick={() => handlePageChange(index + 1)}
           className={currentPage === index + 1 ? 'active' : ''}
         >
           {index + 1}
         </button>
       ))}
     </div>
   </div>
 );
};

export default Products;