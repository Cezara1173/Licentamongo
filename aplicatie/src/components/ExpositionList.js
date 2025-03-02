import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpositionItem from './ExpositionItem';

const Expositions = () => {
  const [expositions, setExpositions] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expositionsResponse, artistsResponse] = await Promise.all([
          axios.get('/api/expositions'),
          axios.get('/api/artists')
        ]);
        setExpositions(expositionsResponse.data);
        setArtists(artistsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredExpositions = expositions.filter((expo) => {
    return expo.expositions.some((event) => {
      const eventDate = new Date(event.startDate); // Convert to date object
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div> Start Date - End Date </div>
      <input type="date" onChange={handleStartDateChange} value={startDate} />
      <label htmlFor="endDate"> - </label>
      <input type="date" id="endDate" onChange={handleEndDateChange} value={endDate} /> {/* Date pickers */}
      {filteredExpositions.map((expo) => (
        <div key={expo._id.$oid}>
          {expo.expositions.map((event) => (
            <ExpositionItem key={event._id.$oid} event={event} artists={artists} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Expositions;
