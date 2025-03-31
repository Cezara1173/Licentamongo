import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroCarousel.css';

const slides = [
  {
    image: '/images/slide1.jpg',
    title: 'Artsy Gallery',
    text: 'Sărbătorim artistele contemporane alături de Katy Hessel.',
    buttonText: 'Explorează',
  },
  {
    image: '/images/slide2.jpg',
    title: 'Arta digitală este în ascensiune',
    text: 'Descoperă interpretări moderne ale NFT-urilor și creații bazate pe tehnologie.',
    buttonText: 'Explorează',
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
    const title = slides[current].title;
    navigate(`/expositions?title=${encodeURIComponent(title)}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right');
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const { image, title, text, buttonText } = slides[current];

  return (
    <div className="hero-carousel">
      <div className={`hero-slide slide-${direction}`}>
        <img src={image} alt={title} className="hero-image" />
        <div className="hero-text">
          <h1>{title}</h1>
          <p>{text}</p>
          <button className="hero-button" onClick={handleButtonClick}>
            {buttonText}
          </button>
        </div>
      </div>
      <div className="carousel-controls">
        <button onClick={prevSlide}>&lt;</button>
        <button onClick={nextSlide}>&gt;</button>
      </div>
    </div>
  );
};

export default HeroCarousel;
