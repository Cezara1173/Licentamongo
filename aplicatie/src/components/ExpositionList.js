import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import ro from 'date-fns/locale/ro';
import { useSearch } from '../context/SearchContext';
import deduplicateByTitleAndId from '../utils/deduplicateByTitleAndId';
import './ExpositionList.css';

const formatDateRange = (start, end) => {
  const fromDate = new Date(start);
  const toDate = new Date(end);
  if (!isValid(fromDate) || !isValid(toDate)) return 'Dată indisponibilă';
  const from = format(fromDate, 'd MMMM yyyy', { locale: ro });
  const to = format(toDate, 'd MMMM yyyy', { locale: ro });
  return `din ${from} în ${to}`;
};

const getCurrentMonthExpositions = (expositions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return expositions.filter((expo) => {
    const start = new Date(expo.startDate);
    return isValid(start) && start.getMonth() === currentMonth && start.getFullYear() === currentYear;
  });
};

const ExpositionList = () => {
  const [expositions, setExpositions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [featuredExpos, setFeaturedExpos] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchExpositions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/expositions');
        const valid = res.data.filter(e =>
          isValid(new Date(e.startDate)) && isValid(new Date(e.endDate))
        );
        const deduplicated = deduplicateByTitleAndId(valid);
        setExpositions(deduplicated);
        setFiltered(deduplicated);

        const currentMonthExpos = getCurrentMonthExpositions(deduplicated);
        const featured = currentMonthExpos.length > 0
          ? currentMonthExpos
          : deduplicated.slice(0, 1);
        setFeaturedExpos(deduplicateByTitleAndId(featured));
      } catch (err) {
        console.error('Error fetching expositions:', err);
      }
    };

    fetchExpositions();
  }, []);

  useEffect(() => {
    let result = [...expositions];

    if (startDate || endDate) {
      const from = startDate ? new Date(startDate) : new Date('2000-01-01');
      const to = endDate ? new Date(endDate) : new Date('3000-01-01');

      result = result.filter((expo) => {
        const expoStart = new Date(expo.startDate);
        const expoEnd = new Date(expo.endDate);
        return expoStart <= to && expoEnd >= from;
      });
    }

    if (locationFilter) {
      result = result.filter((expo) =>
        expo.location?.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      result = result.filter((expo) =>
        expo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(deduplicateByTitleAndId(result));
  }, [startDate, endDate, locationFilter, searchTerm, expositions]);

  useEffect(() => {
    if (featuredExpos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredExpos.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [featuredExpos]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -370, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 370, behavior: 'smooth' });
  };

  const handleClick = (expoId) => {
    navigate(`/expositions/${expoId}`);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setLocationFilter('');
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + featuredExpos.length) % featuredExpos.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % featuredExpos.length);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <>
      {/* === Hero Carousel === */}
      {featuredExpos.length > 0 && (
        <div className="hero-slider">
          {featuredExpos.map((expo, index) => (
            <div
              key={expo._id}
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              onClick={() => handleClick(expo._id)}
            >
              <div className="hero-left">
                <h1>{expo.title}</h1>
                <p>{formatDateRange(expo.startDate, expo.endDate)}</p>
              </div>
              <div className="hero-right">
                <img src={expo.image} alt={expo.title} />
              </div>
            </div>
          ))}

          <button className="hero-arrow left" onClick={prevSlide}>&#10094;</button>
          <button className="hero-arrow right" onClick={nextSlide}>&#10095;</button>

          <div className="hero-dots">
            {featuredExpos.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* === Filters === */}
      <div className="expo-container">
      <div className="date-filters">
      <button className="clear-filters-btn" onClick={clearFilters}>
       Clear filters
      </button>

  <span>Start Date - End Date</span>
  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
  <span> - </span>
  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

  <div className="location-filter">
    <label htmlFor="locationSelect">Location</label>
    <select
      id="locationSelect"
      value={locationFilter}
      onChange={(e) => setLocationFilter(e.target.value)}
    >
      <option value="">Toate</option>
      <option value="Bucuresti">București</option>
      <option value="Cluj">Cluj</option>
      <option value="Constanta">Constanța</option>
      <option value="Iasi">Iași</option>
      <option value="Sibiu">Sibiu</option>
      <option value="Timisoara">Timișoara</option>
    </select>
  </div>
</div>


        {/* === Carousel === */}
        <div className="expo-carousel-wrapper">
          <div className="expo-scroll-arrow left" onClick={scrollLeft}>&#10094;</div>

          <div className="expo-carousel" ref={scrollRef}>
            {filtered
              .filter((expo) => expo.image && expo.title)
              .map((expo) => (
                <div key={expo._id} className="expo-card" onClick={() => handleClick(expo._id)}>
                  <img src={expo.image} alt={expo.title} className="expo-image" />
                  <h3 className="expo-title">{expo.title}</h3>
                  <p className="expo-date">{formatDateRange(expo.startDate, expo.endDate)}</p>
                </div>
              ))}
          </div>

          <div className="expo-scroll-arrow right" onClick={scrollRight}>&#10095;</div>
        </div>
      </div>

      {/* === Flat List === */}
      <div className="expo-list" style={{ marginTop: '20px' }}>
        {filtered.map((expo) => (
          <div className="expo-list-item" key={expo._id} onClick={() => handleClick(expo._id)}>
            <img src={expo.image} alt={expo.title} className="expo-list-img" />
            <div className="expo-list-content">
              <h4 className="expo-list-title">{expo.title}</h4>
              <span className="expo-list-date">{formatDateRange(expo.startDate, expo.endDate)}</span>
            </div>
            <div className="expo-list-arrow">{'>'}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ExpositionList;
