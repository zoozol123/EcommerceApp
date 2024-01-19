import React, { useState, useEffect } from 'react';
import './ProductView.css'; 

const ProductView = ({ match }) => {
  const productId = match.params.productId;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/product/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Błąd podczas pobierania danych produktu:', error));
  }, [productId]);

   const [selectedSizes, setSelectedSizes] = useState([]);

   const handleSizeChange = (size) => {
     if (selectedSizes.includes(size)) {
       setSelectedSizes(selectedSizes.filter((s) => s !== size));
     } else {
       setSelectedSizes([...selectedSizes, size]);
     }
   };

  return (
    <div className="product-view-container">
      <div className="product-image">
        <img src={`/images/popular${product?.id}.jpg`} alt={product?.name} />
      </div>
      <div className="product-info">
        <h2>{product?.name}</h2>
        <h3>Cena: {product?.price} zł</h3>

        <p>ROZMIARY</p>
        
      <div className="size-list">
          {[...Array(15).keys()].map((size) => (
            <button
              key={size + 32}
              className={`size-rectangle ${selectedSizes.includes(size + 32) ? 'selected' : ''}`}
              onClick={() => handleSizeChange(size + 32)}
            >
              {size + 32}
            </button>
          ))}
        </div>

        <button className='add'>Dodaj do koszyka</button>

        <p>{product?.description}</p>
        <br></br>

        <h3>Szczegółu produktu:</h3>
        <p>70% Bawełna, 15% Poliester, 15% Elastan</p>
      </div>
    </div>
  );
};

export default ProductView;
