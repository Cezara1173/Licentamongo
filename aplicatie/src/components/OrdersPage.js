import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/orders/user/${user._id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Eroare la încărcarea comenzilor:', err));
    }
  }, [user]);

  return (
    <div className="orders-page">
      <h2 className="orders-title">Comenzile tale</h2>
      <div className="orders-underline"></div>

      {(!user || orders.length === 0) ? (
        <p className="orders-message">Nu sunt comenzi în istoric.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order._id || index} className="order-item">
              <p><strong>ID comandă:</strong> {order._id}</p>
              <p><strong>Total:</strong> {order.total} RON</p>
              <p><strong>Produse:</strong></p>
              <ul>
                {order.products.map((prod, i) => (
                  <li key={i}>{prod.name} — {prod.price} RON × {prod.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
