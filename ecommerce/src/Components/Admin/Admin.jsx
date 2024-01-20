import React, { useState, useEffect } from 'react';
import './Admin.css'; // Link to the Navbar CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'


const Admin = () => {
    const [productsList, setProductsList] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(1);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescrption] = useState('');
    const [newPrice, setNewPrice] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescrption] = useState('');
    const [price, setPrice] = useState(1);

    const handleProductChange = (e) => {
        setSelectedProductId(e.target.value);
        console.log(e.target.value);
    };

    const fetchProducts = () => {
        fetch('/products')
          .then(response => response.json())
          .then(data => {
            setProductsList(data.map((product) => ({ ...product })));
          })
          .catch(error => console.error('Błąd podczas pobierania danych produktów:', error));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/products/${selectedProductId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                fetchProducts(); // Poczekaj na zakończenie dodawania i pobierz zaktualizowaną listę
                console.log('Produkt został dodany.');
            } else {
                fetchProducts();
                console.error('Błąd podczas usuwania produktu:', response.statusText);
            }
        } catch (error) {
            fetchProducts();
            console.error('Błąd podczas usuwania produktu:', error.message);
        }
    };

    const handleEdit = async () => {
        try { 
            const response = await fetch(`/products${selectedProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newName: newName,
                    newPrice: newPrice,
                    newDescription: newDescription,
                }),
            });
    
            if (response.ok) {
                console.log('Produkt został zaktualizowany.');
                window.location.reload();
            } else {
                window.location.reload();
                console.error('Błąd podczas edycji produktu:', response.statusText);
            }
        } catch (error) {
            window.location.reload();
            console.error('Błąd podczas edycji produktu:', error.message);
        }
    };

    const handleAdd = async () => {
        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    price: price,
                    description: description,
                }),
            });
    
            if (response.ok) {
                window.location.reload();
                const updatedProducts = await response.json();
                setProductsList(updatedProducts);
    
                console.log('Produkt został dodany.');
            } else {
                window.location.reload();
                console.error('Błąd podczas dodawania produktu:', response.statusText);
            }
        } catch (error) {
            window.location.reload();
            console.error('Błąd podczas dodawania produktu:', error.message);
        }
    };

    const handleNewNameInputChange = (e) => { setNewName(e.target.value); };
    const handleNewPriceInputChange = (e) => { setNewPrice(e.target.value); };
    const handleNewDescriptionInputChange = (e) => { setNewDescrption(e.target.value); };
    const handleNameInputChange = (e) => { setName(e.target.value); };
    const handlePriceInputChange = (e) => { setPrice(e.target.value); };
    const handleDescriptionInputChange = (e) => { setDescrption(e.target.value); };

  return (
    <div >
        <div>
          <h1>Panel administratora</h1>
          <h3>Dodaj produkt</h3>
          <br></br>
          <div>Podaj nazwę:</div>
          <input type='text' onChange={(e) => handleNameInputChange(e)}></input>
          <div>Podaj cenę:</div>
          <input type='text' onChange={(e) => handlePriceInputChange(e)}></input>
          <div>Podaj opis:</div>
          <input type='text' onChange={(e) => handleDescriptionInputChange(e)}></input>
          <button onClick={()=>{ handleAdd(); }}>Dodaj</button>

          <br></br> 
          <br></br>  
          <h3>Edytuj produkt</h3>
          <select value={selectedProductId} onChange={handleProductChange}>
            {productsList.map((product) => (
                <option key={product.id} value={product.id}>
                    {product.name}
                </option>   
            ))}
          </select>
          <br></br>
          <div>Podaj nową nazwę:</div>
            <input type='text' onChange={(e) => handleNewNameInputChange(e)}></input>
            <div>Podaj nową cenę:</div>
            <input type='text' onChange={(e) => handleNewPriceInputChange(e)}></input>
            <div>Podaj nowy opis:</div>
            <input type='text' onChange={(e) => handleNewDescriptionInputChange(e)}></input>
          <button onClick={()=>{ handleEdit(); }}>Edytuj</button>

          <br></br> 
          <br></br> 
          <h3>Usuń produkt</h3>
          <select value={selectedProductId} onChange={handleProductChange}>
            {productsList.map((product) => (
                <option key={product.id} value={product.id}>
                    {product.name}
                </option>   
            ))}
          </select>
          <button onClick={()=>{ handleDelete(); }}>Usuń</button>
          
        </div>
        
    </div>
  );
};

export default Admin;
