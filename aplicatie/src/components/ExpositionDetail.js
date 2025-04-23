import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ExpositionDetail.css';

const ExpositionDetail = () => {
  const { id } = useParams();
  const [exposition, setExposition] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/expositions/${id}`)
      .then((res) => res.json())
      .then((data) => setExposition(data))
      .catch((err) => console.error('Failed to fetch exposition:', err));
  }, [id]);

  if (!exposition) return <div className="expo-loading">Loading...</div>;

  return (
    <div className="expo-detail-container">
      <div className="expo-hero" style={{ backgroundImage: `url(${exposition.image})` }}></div>

      <div className="expo-overlay">
        <h1 className="expo-title">{exposition.title}</h1>

        <div className="expo-section">
          <div className="expo-section-title">Despre</div>
          <div className="expo-section-content">{exposition.description}</div>
        </div>

        <div className="expo-section">
          <div className="expo-section-title">Artiști</div>
          <ul className="expo-artist-list">
            {exposition.artists.map((artist) => (
              <li key={artist._id}>{artist.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpositionDetail;