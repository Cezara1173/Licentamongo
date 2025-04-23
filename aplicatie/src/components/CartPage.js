// src/components/CartPage.jsx
import React from 'react';
import './CartPage.css';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page-wrapper">
      {/* LEFT BOX: Beneficii */}
      <div className="cart-info-box">
        <h3>De ce să cumperi cu ArtHunt?</h3>
        <ul>
          <li>
            <strong>Mii de recenzii de 5 stele</strong>
            <p>Oferim servicii de top tuturor cumpărătorilor ArtHunt.</p>
          </li>
          <li>
            <strong>Garanția satisfacției</strong>
            <p>Ai 14 zile să te răzgândești. Cumpără fără griji.</p>
          </li>
          <li>
            <strong>Cumpărături sigure</strong>
            <p>Plățile și tranzacțiile sunt criptate și protejate.</p>
          </li>
        </ul>
      </div>

      {/* RIGHT BOX: Coș */}
      <div className="cart-box">
        <h2>Coș</h2>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">👜</span>
            <p>Coșul tău este gol.</p>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.images[0]} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>Preț: ${item.price.toFixed(2)}</p>
                  <p>Cantitate: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item._id)}>Șterge</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <strong>Total: ${totalPrice.toFixed(2)}</strong>
              <button className="checkout-button">Finalizare Comandă</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
