import React, { useState } from 'react';
import { FaRegComment, FaTrashAlt } from 'react-icons/fa';
import './ProductList.css';

import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductItem = ({ product, onTriggerLoginModal, onAddToCart, onDeleteClick }) => {
  const { token, user } = useAuth();
  const { addToCart } = useCart();

  const [showComments, setShowComments] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);

  const isAdmin = user?.email === 'admin@yahoo.com';

  const handleAddToCart = () => {
    if (!token) {
      onTriggerLoginModal?.();
      return;
    }

    onAddToCart(product); // delegă verificarea stocului la ProductList
  };

  const handleIconClick = () => {
    if (!token) {
      onTriggerLoginModal?.();
    } else {
      setShowComments(true);
    }
  };

  const handleViewClick = () => {
    setShowComments(prev => !prev);
  };

  const handleDelete = () => {
    onDeleteClick(product._id);
  };

  return (
    <div className="product-item">
      <div className="product-image-wrapper">
        <img src={product.images?.[0]} alt={product.name} />
        {isAdmin && (
          <div className="delete-icon" onClick={handleDelete} title="Șterge produsul">
            <FaTrashAlt />
          </div>
        )}
      </div>

      <div className="product-icons">
        <FaRegComment className="comment-icon" onClick={handleIconClick} />
        <span className="view-comments-sub" onClick={handleViewClick}>
          Vezi comentarii
        </span>
      </div>

      <h3 className="product-title">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">{product.price.toFixed(2)} RON</p>
      <p className="product-stock">Stoc: {product.stock}</p>
      <p className="product-artist">Artist: {product.artist?.name || 'Necunoscut'}</p>

      <div className="product-button-wrapper">
        <button onClick={handleAddToCart}>Adaugă în coș</button>
      </div>

      {showComments && (
        <CommentSection
          productId={product._id}
          isAdmin={isAdmin}
          refreshToggle={refreshComments}
        />
      )}
    </div>
  );
};

export default ProductItem;
