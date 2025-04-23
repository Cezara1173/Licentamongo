import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import ArtistItem from './ArtistItem';
import './ArtistList.css';

const ArtistList = ({ onTriggerLoginModal }) => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const { searchTerm } = useSearch();

  // Fetch artist data on mount
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

  // Filter artists based on global search
  useEffect(() => {
    const filtered = artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  return (
    <div className="artist-list">
      {filteredArtists.map(artist => (
        <ArtistItem
          key={artist._id}
          artist={artist}
          onTriggerLoginModal={onTriggerLoginModal} // ✅ Forward login modal trigger
        />
      ))}
    </div>
  );
};

export default ArtistList;
