import React, { useState } from 'react';
import './CartPage.css';
import PaypalButton from './PaypalButton';
import InfoModal from './InfoModal'; // ✅ înlocuiește SuccessModal și ErrorModal
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const [modal, setModal] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentSuccess = () => {
    try {
      // Simulează salvarea comenzii în backend
      const orderSaved = true;
      if (orderSaved) {
        setModal({
          show: true,
          message: 'Comanda a fost salvată cu succes!',
          type: 'success',
        });
      } else {
        throw new Error('Comanda nu a putut fi salvată.');
      }
    } catch (err) {
      setModal({
        show: true,
        message: 'Comanda nu a putut fi salvată.',
        type: 'error',
      });
    }
  };

  const handlePaymentError = () => {
    setModal({
      show: true,
      message: 'A apărut o eroare la procesarea plății.',
      type: 'error',
    });
  };

  const handleModalClose = () => {
    setModal({ ...modal, show: false });

    if (modal.type === 'success') {
      navigate('/'); // Poți înlocui cu /orders dacă vrei
    }
  };

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
            {cartItems.map((item) => (
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
            </div>

            <div className="paypal-wrapper" style={{ marginTop: '20px' }}>
              <PaypalButton
                amount={totalPrice.toFixed(2)}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        )}
      </div>

      {/* ✅ Modal reutilizabil pentru succes/eroare */}
      {modal.show && (
        <InfoModal
          message={modal.message}
          type={modal.type}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default CartPage;
