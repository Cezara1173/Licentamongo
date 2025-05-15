import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

const OrdersPage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/orders/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Eroare la încărcarea comenzilor:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div className="orders-page"><p>Se încarcă comenzile...</p></div>;

  return (
    <div className="orders-page">
      <h2 className="orders-title">Comenzile tale</h2>
      <div className="orders-underline"></div>

      {!user || orders.length === 0 ? (
        <p className="orders-message">Nu ai plasat încă nicio comandă.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order._id || index} className="order-item">
              <p><strong>ID comandă:</strong> {order._id}</p>
              <p><strong>Total:</strong> {order.totalPrice.toFixed(2)} RON</p>
              <p><strong>Dată:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Produse:</strong></p>
              <ul>
                {order.products.map((prod, i) => (
                  <li key={i} className="product-entry">
                    <div className="order-product-image-wrapper">
                      <span className="emoji-icon">🛍️</span>
                    </div>
                    <div className="product-info">
                      <span className="product-name">{prod.productId?.name || 'Produs'}</span>
                      <span className="product-details">
                        {prod.price.toFixed(2)} RON × {prod.quantity}
                      </span>
                    </div>
                  </li>
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
