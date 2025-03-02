// CosCumparaturi.js
import React from 'react';
import './CosCumparaturi.css';

const CosCumparaturi = ({ cartItems, onRemoveFromCart, onCheckout }) => {
  return (
    <div className="cos-cumparaturi">
      <h2>Coș de cumpărături</h2>
      {cartItems.length === 0 ? (
        <p>Coșul este gol.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item._id}>
                <img src={item.images[0]} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => onRemoveFromCart(item._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <button className="checkout-button" onClick={onCheckout}>Finalizare Comandă</button>
        </>
      )}
    </div>
  );
};

export default CosCumparaturi;
