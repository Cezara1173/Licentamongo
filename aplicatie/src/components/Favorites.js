import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const { token, user } = useAuth();
  const [recommendedExpositions, setRecommendedExpositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedExpositions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recomandate', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // 🔁 Eliminăm duplicatele după expo._id
        const uniqueExpos = [];
        const seenIds = new Set();

        for (const expo of response.data) {
          if (!seenIds.has(expo._id)) {
            seenIds.add(expo._id);
            uniqueExpos.push(expo);
          }
        }

        setRecommendedExpositions(uniqueExpos);
      } catch (error) {
        console.error('Error fetching recommended expositions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchRecommendedExpositions();
    }
  }, [user, token]);

  if (!user) {
    return (
      <div className="favorites-page">
        <h1 className="favorites-title">Preferate</h1>
        <div className="favorites-underline" />
        <p className="favorites-message">Trebuie să fii logat pentru a vedea preferințele.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="favorites-page">
        <h1 className="favorites-title">Preferate</h1>
        <div className="favorites-underline" />
        <p className="favorites-message">Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">Preferate</h1>
      <div className="favorites-underline" />

      {recommendedExpositions.length === 0 ? (
        <div className="favorites-empty">
          <p className="favorites-empty-message">
            Descoperă artiștii preferați și crează-ți propria listă de expoziții pe gustul tău.
          </p>
        </div>
      ) : (
        <div className="favorites-list">
          {recommendedExpositions.map((expo) => (
            <Link to={`/expositions/${expo._id}`} key={expo._id} className="favorites-item">
              <img src={expo.image} alt={expo.title} className="favorites-image" />
              <div className="favorites-info">
                <h3>{expo.title}</h3>
                <p>
                  {new Date(expo.startDate).toLocaleDateString()} -{' '}
                  {new Date(expo.endDate).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
