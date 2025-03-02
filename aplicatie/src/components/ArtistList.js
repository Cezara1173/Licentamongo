import React, { useState, useEffect } from 'react';
import ArtistItem from './ArtistItem';
import './ArtistList.css';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Fetch artistii din API
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artists'); // Modifică acest URL pentru a se potrivi cu endpoint-ul tău API
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="artist-list">
      {artists.map(artist => (
        <ArtistItem key={artist._id} artist={artist} />
      ))}
    </div>
  );
};

export default ArtistList;
