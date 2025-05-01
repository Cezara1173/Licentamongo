import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ExpositionScrollDetail.css';

const ExpositionScrollDetail = () => {
  const { id } = useParams();
  const [exposition, setExposition] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/expositions/${id}`)
      .then((res) => res.json())
      .then((data) => setExposition(data))
      .catch((err) => console.error('Failed to fetch exposition:', err));
  }, [id]);

  if (!exposition) return <div className="expo-loading">Se încarcă...</div>;

  return (
    <div className="expo-scroll-detail">
      <div
        className="expo-scroll-hero"
        style={{ backgroundImage: `url(${exposition.image})` }}
      ></div>

      <div className="expo-scroll-content">
        <h1 className="expo-scroll-title">{exposition.title}</h1>

        {/* === Despre în format grid: etichetă + conținut === */}
        <div className="expo-scroll-grid">
          <div className="expo-scroll-label">Despre</div>
          <div className="expo-scroll-description">
            <p>{exposition.description}</p>
            {exposition.location && (
              <p className="expo-scroll-location">
                <strong>Locație</strong> {exposition.location}
              </p>
            )}
          </div>
        </div>

        {/* === Artiști === */}
        <section className="expo-scroll-section">
          <h2 className="expo-scroll-subtitle">Artiști</h2>
          {exposition.artists && exposition.artists.length > 0 ? (
            <ul className="expo-scroll-artist-columns">
              {exposition.artists.map((artist) => (
                <li className="artist-name" key={artist._id}>{artist.name}</li>
              ))}
            </ul>
          ) : (
            <p className="expo-scroll-text">Nu sunt artiști asociați cu această expoziție.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ExpositionScrollDetail;
