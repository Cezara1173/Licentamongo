import React, { useState, useEffect } from 'react';

const ArtistArtworks = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    // Fetch artists from the API
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artists'); // Modify this URL to match your API endpoint
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      // Fetch artworks for the selected artist from the API
      const fetchArtworks = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products'); // Modify this URL to match your API endpoint
          const data = await response.json();
          const filteredArtworks = data.filter(artwork => artwork.artist === selectedArtist);
          setArtworks(filteredArtworks);
        } catch (error) {
          console.error('Error fetching artworks:', error);
        }
      };

      fetchArtworks();
    } else {
      setArtworks([]);
    }
  }, [selectedArtist]);

  const handleArtistChange = (event) => {
    setSelectedArtist(event.target.value);
  };

  return (
    <div className="artist-artworks">
      <select value={selectedArtist} onChange={handleArtistChange}>
        <option value="">Select an Artist</option>
        {artists.map(artist => (
          <option key={artist._id} value={artist.name}>{artist.name}</option>
        ))}
      </select>
      <div className="artworks">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <div key={artwork._id.$oid} className="artwork-item">
              <h3>{artwork.name}</h3>
              <img src={artwork.images[0]} alt={artwork.name} style={{ width: '200px' }} />
              <p>{artwork.description}</p>
              <p>Price: ${artwork.price}</p>
              <p>Stock: {artwork.stock}</p>
              <p>Color: {artwork.attributes.color}</p>
              <p>Size: {artwork.attributes.size}</p>
              <p>Weight: {artwork.attributes.weight}</p>
              <p>Artist: {artwork.artist}</p>
            </div>
          ))
        ) : (
          <p>No artworks available for the selected artist.</p>
        )}
      </div>
    </div>
  );
};

export default ArtistArtworks;
