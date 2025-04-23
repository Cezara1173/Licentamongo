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

        <section className="expo-scroll-section">
          <h2 className="expo-scroll-subtitle">Despre</h2>
          <p className="expo-scroll-text">{exposition.description}</p>
        </section>

        <section className="expo-scroll-section">
          <h2 className="expo-scroll-subtitle">Artiști</h2>
          <ul className="expo-scroll-artists">
            {exposition.artists.map((artist) => (
              <li key={artist._id}>{artist.name}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ExpositionScrollDetail;
