import React, { useState, useEffect } from 'react';
import './ProductView.css'; // Link do pliku CSS z nawigacją
import { useHistory } from 'react-router-dom';

const ProductView = ({ match }) => {
  const history = useHistory();
  const productId = match.params.productId;
  const [product, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
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

  const handleAddToCart = () => {
    // Tutaj możesz dodać logikę związana z dodawaniem produktu do koszyka
    // Na przykład, możesz użyć stanu globalnego, kontekstu lub przekazać funkcję z rodzica
    // która zajmuje się dodawaniem produktu do koszyka

    console.log('Dodano do koszyka:', product?.name, 'Rozmiary:', selectedSizes);
    history.push('/cart');
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

        <button
          className={`add ${selectedSizes.length !== 0 ? '' : 'clicked'}`}
          onClick={() => {
            if (selectedSizes.length !== 0) {
              handleAddToCart();
            }
          }}
        >
          Dodaj do koszyka
        </button>

        <p>{product?.description}</p>
        <br></br>

        <h3>Szczegółu produktu:</h3>
        <p>70% Bawełna, 15% Poliester, 15% Elastan</p>
      </div>
    </div>
  );
};

export default ProductView;
