import React, { useState, useEffect } from 'react';
import './ProductView.css'; // Link do pliku CSS z nawigacją

const ProductView = ({ match }) => {
  const productId = match.params.productId;

  // Stan dla informacji o produkcie
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Pobieranie danych konkretnego produktu z serwera
    fetch(`/product/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Błąd podczas pobierania danych produktu:', error));
  }, [productId]);

   // State dla zaznaczonych rozmiarów
   const [selectedSizes, setSelectedSizes] = useState([]);

   // Funkcja do obsługi zmiany zaznaczonych rozmiarów
   const handleSizeChange = (size) => {
     // Sprawdź, czy rozmiar jest już zaznaczony
     if (selectedSizes.includes(size)) {
       // Jeśli tak, usuń go ze stanu
       setSelectedSizes(selectedSizes.filter((s) => s !== size));
     } else {
       // Jeśli nie, dodaj do stanu
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
        
      {/* Lista prostokątnych przycisków z numerami rozmiarów */}
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
        {/* Dodaj inne informacje o produkcie, jeśli są dostępne */}
        <br></br>

        <h3>Szczegółu produktu:</h3>
        <p>70% Bawełna, 15% Poliester, 15% Elastan</p>
      </div>
    </div>
  );
};

export default ProductView;
