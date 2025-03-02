import React, { useState, useEffect } from 'react';

const ArtistItem = ({ artist }) => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    // Fetch artworks details from the API
    const fetchArtworks = async () => {
      try {
        const responses = await Promise.all(
          artist.artworkIds.map(id =>
            fetch(`http://localhost:5000/api/products/${id}`).then(response => response.json())
          )
        );
        setArtworks(responses);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchArtworks();
  }, [artist.artworkIds]);

  return (
    <div className="artist-item">
      <h2>{artist.name}</h2>
      <p><strong>Bio:</strong> {artist.bio}</p>
      <p><strong>Birth Year:</strong> {artist.birthYear}</p>
      <p><strong>Nationality:</strong> {artist.nationality}</p>
      <h3>Artworks</h3>
      <ul className="artwork-list">
        {artworks.map((artwork) => (
          <li key={artwork._id.$oid} className="artwork-item">
            <img src={artwork.images[0]} alt={artwork.name} className="artwork-image" />
            <p>{artwork.name}</p>
            <p>{artwork.description}</p>
            <p>Price: ${artwork.price}</p>
            <p>Stock: {artwork.stock}</p>
            <p>Color: {artwork.attributes.color}</p>
            <p>Size: {artwork.attributes.size}</p>
            <p>Weight: {artwork.attributes.weight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistItem;
