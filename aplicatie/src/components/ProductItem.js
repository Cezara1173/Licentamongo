import React, { useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import './ProductList.css';

import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductItem = ({ product, onTriggerLoginModal }) => {
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [showComments, setShowComments] = useState(false);

  const handleAddToCart = () => {
    if (!token) {
      onTriggerLoginModal?.();
      return;
    }

    if (product.stock > 0) {
      addToCart(product);
    } else {
      alert("Stoc epuizat!");
    }
  };

  // 👇 Deschide login modal DOAR pentru comentariu (iconul)
  const handleIconClick = () => {
    if (!token) {
      onTriggerLoginModal?.();
    } else {
      setShowComments(true);
    }
  };

  // 👇 Vezi comentarii – funcționează și nelogat
  const handleViewClick = () => {
    setShowComments(prev => !prev);
  };

  return (
    <div className="product-item">
      <div className="product-image-wrapper">
        <img src={product.images?.[0]} alt={product.name} />
      </div>

      <div className="product-icons">
        <FaRegComment className="comment-icon" onClick={handleIconClick} />
        <span className="view-comments-sub" onClick={handleViewClick}>
          Vezi comentarii
        </span>
      </div>

      <h3 className="product-title">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-stock">Stoc: {product.stock}</p>

      <div className="product-button-wrapper">
        <button onClick={handleAddToCart}>Adaugă în coș</button>
      </div>

      {showComments && <CommentSection productId={product._id} />}
    </div>
  );
};

export default ProductItem;
