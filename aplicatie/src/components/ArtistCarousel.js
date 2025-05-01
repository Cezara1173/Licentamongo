import React, { useEffect, useState, useRef } from 'react';
import './ArtistCarousel.css';

const ArtistCarousel = () => {
  const [artists, setArtists] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/artists');
        const data = await res.json();
        setArtists(data);
      } catch (err) {
        console.error('Eroare la fetch artiști:', err);
      }
    };
    fetchArtists();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth; // 👉 scroll o pagină întreagă, nu doar 180px
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="artist-carousel-wrapper">
      <button className="carousel-arrow left" onClick={() => scroll('left')}>&lt;</button>

      <div className="artist-carousel" ref={scrollContainerRef}>
        {artists.map((artist) => (
          <div className="carousel-artist-card" key={artist._id}>
            <img src={artist.image} alt={artist.name} className="artist-image" />
            <p className="artist-name">{artist.name}</p>
          </div>
        ))}
      </div>

      <button className="carousel-arrow right" onClick={() => scroll('right')}>&gt;</button>
    </div>
  );
};

export default ArtistCarousel;
