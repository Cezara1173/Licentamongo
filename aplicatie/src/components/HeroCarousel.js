import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroCarousel.css';

const slides = [
  {
    image: '/images/slide1.jpg',
    title: 'Artsy Gallery',
    text: 'Sărbătorim artistele contemporane alături de Katy Hessel.',
    buttonText: 'Explorează',
    expositionId: '65f0a14e00f21a0012f3b0a7',
  },
  {
    image: '/images/slide2.jpg',
    title: 'Arta digitală este în ascensiune',
    text: 'Descoperă interpretări moderne ale NFT-urilor și creații bazate pe tehnologie.',
    buttonText: 'Explorează',
    expositionId: '65f0a14e00f21a0012f3b0a9',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('right');
  const navigate = useNavigate();

  const nextSlide = () => {
    setDirection('right');
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleButtonClick = () => {
    const { expositionId } = slides[current];
    if (expositionId) {
      navigate(`/expositions/${expositionId}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  const { image, title, text, buttonText } = slides[current];

  return (
    <div className="hero-carousel">
      <div className={`hero-slide slide-${direction}`}>
        <div className="hero-image-wrapper">
          <img src={image} alt={title} className="hero-image" />
        </div>

        {/* ✅ wrapper cu z-index mare */}
        <div className="hero-text">
          <div className="hero-text-content">
            <h1>{title}</h1>
            <p>{text}</p>
            <button className="hero-button" onClick={handleButtonClick}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <div className="carousel-controls">
        <button onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>
        <button onClick={nextSlide} aria-label="Next Slide">&#10095;</button>
      </div>
    </div>
  );
};

export default HeroCarousel;
