import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import './ArtistItem.css';

const PRIMARY_PURPLE = "#9c27b0";

const ArtistItem = ({ artist, onTriggerLoginModal, scrollId }) => {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;
  const storageKey = userId ? `likedArtists_${userId}` : null;

  useEffect(() => {
    if (!userId) return;
    const likedArtists = JSON.parse(localStorage.getItem(storageKey)) || [];
    setLiked(likedArtists.includes(artist._id));
  }, [artist._id, userId, token, storageKey]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!token || !userId) {
      onTriggerLoginModal?.();
      return;
    }

    const endpoint = liked ? '/api/unlike-artist' : '/api/like-artist';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ artistId: artist._id }),
      });

      if (response.ok) {
        const likedArtists = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updated = liked
          ? likedArtists.filter(id => id !== artist._id)
          : [...likedArtists, artist._id];

        localStorage.setItem(storageKey, JSON.stringify(updated));
        setLiked(!liked);
        if (!liked) {
          setAnimating(true);
          setTimeout(() => setAnimating(false), 500);
        }
      }
    } catch (error) {
      console.error('Failed to like/unlike artist:', error);
    }
  };

  return (
    <div className="artist-card" id={scrollId}>
      <div className="artist-image-container">
        <img
          src={artist.image || '/images/default-artist.jpg'}
          alt={artist.name}
          className="artist-image"
        />
      </div>

      <div className="artist-actions">
        <button
          className={`heart-button ${animating ? 'pulse' : ''}`}
          onClick={handleLikeClick}
          aria-label={liked ? "Unlike" : "Like"}
          type="button"
        >
          {liked ? (
            <FaHeart className="heart-icon filled" style={{ color: PRIMARY_PURPLE }} />
          ) : (
            <FaRegHeart className="heart-icon outlined" style={{ color: PRIMARY_PURPLE }} />
          )}
        </button>
      </div>

      <h3 className="artist-name">{artist.name}</h3>
      <p className="artist-bio">{artist.bio}</p>
    </div>
  );
};

export default ArtistItem;
