import React, { useState } from 'react'; 
import './ProductList.css';

const ProductItem = ({ product, onAddToCart }) => {
  const [stock, setStock] = useState(product.stock);

  function reduceStock() {
    if (stock > 0) {
      setStock(stock - 1); 
      onAddToCart(product); 
    } else {
      alert("Stoc epuizat!"); 
    }
  }

  return (
    <div className="product-item">
      <img src={product.images[0]} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Stock: {stock}</p> {}
      <p>Brand: {product.brand}</p>
      <button onClick={reduceStock}>Adaugă în coș</button> {}
    </div>
  );
};

export default ProductItem;
