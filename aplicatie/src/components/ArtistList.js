import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import ArtistItem from './ArtistItem';
import './ArtistList.css';
import './ArtistCarousel.css'; // stiluri carousel
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ArtistList = ({ onTriggerLoginModal }) => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artists');
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    const filtered = artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(artists.length / itemsPerPage);
  const currentItems = artists.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  const handlePrev = () => {
    setCurrentIndex(prev =>
      prev === 0 ? totalPages - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev =>
      prev === totalPages - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* === Carousel cu Artiști === */}
      <div className="artist-carousel-wrapper">
        <button className="carousel-arrow left" onClick={handlePrev}>
          <FaChevronLeft />
        </button>

        <div className="artist-carousel">
          {currentItems.map(artist => (
            <div key={artist._id} className="carousel-artist-card">
              <img src={artist.image} alt={artist.name} />
              <p>{artist.name}</p>
            </div>
          ))}
        </div>

        <button className="carousel-arrow right" onClick={handleNext}>
          <FaChevronRight />
        </button>

        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* === Lista standard de artiști (ArtistItem) === */}
      <div className="artist-list">
        {filteredArtists.map(artist => (
          <ArtistItem
            key={artist._id}
            artist={artist}
            onTriggerLoginModal={onTriggerLoginModal}
          />
        ))}
      </div>
    </>
  );
};

export default ArtistList;
