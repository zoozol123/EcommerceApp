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
  
 
 const [searchQuery, setSearchQuery] = useState('');
 const [sortOption, setSortOption] = useState('default');

 const [currentPage, setCurrentPage] = useState(1);

 // Products per page
 const productsPerPage = 9;

 // Calculate starting and ending indices of products to display
 const startIndex = (currentPage - 1) * productsPerPage;
 const endIndex = startIndex + productsPerPage;

 const compareStrings = (a, b) => {
    // Funkcja pomocnicza do porównywania stringów z uwzględnieniem wielkości liter
    return a.localeCompare(b, 'pl', { sensitivity: 'base' });
  };

  // Sortowanie według nazwy rosnąco
  const sortAlphabeticallyAsc = (a, b) => {
    return compareStrings(a.name, b.name);
  };

  // Sortowanie według nazwy malejąco
  const sortAlphabeticallyDesc = (a, b) => {
    return compareStrings(b.name, a.name);
  };

 // Filter products based on search query and sort option
 const filteredProducts = productsList
  .filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    if (sortOption === 'default') {
      return a.id - b.id;
    } else if (sortOption === 'price-asc') {
      return a.price - b.price;
    } else if (sortOption === 'price-desc') {
      return b.price - a.price;
    } else if (sortOption === 'alpha-asc') {
      return sortAlphabeticallyAsc(a, b);
    } else if (sortOption === 'alpha-desc') {
      return sortAlphabeticallyDesc(a, b);
    }
    // Dodaj więcej opcji sortowania, jeśli potrzebujesz
  });

  // Paginated products to display
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

 return (
   <div className='product-container'>
     {/* Search bar */}
     <div className='search-bar'>
       <input
         type='text'
         placeholder='Szukaj produktów...'
         value={searchQuery}
         onChange={handleSearch}
       />
       {/* Add sorting options dropdown */}
       <select value={sortOption} onChange={handleSortChange}>
        <option value='default'>Domyślnie...</option>
        <option value='alpha-asc'>Nazwa: A-Z</option>
        <option value='alpha-desc'>Nazwa: Z-A</option>
        <option value='price-asc'>Cena: rosnąco</option>
        <option value='price-desc'>Cena: malejąco</option>
      </select>
     </div>
     
      {/* Obszar wyświetlania produktów */}
      <div className='product-display'>
        {paginatedProducts.map((product) => (
       <div className='product-card'>
        <Link to={`/product/${product.id}`} className="product-link">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Cena: {product.price} zł</p>
        </Link>
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