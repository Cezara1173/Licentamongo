import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import './ArtistItem.css';

const PRIMARY_PURPLE = "#9c27b0";

const ArtistItem = ({ artist, onTriggerLoginModal, scrollId }) => {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(artist.bio);
  const [currentBio, setCurrentBio] = useState(artist.bio);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;
  const storageKey = userId ? `likedArtists_${userId}` : null;
  const isAdmin = user?.email === 'admin@yahoo.com';

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

  const handleSaveBio = async () => {
    try {
      const res = await fetch(`/api/artists/${artist._id}/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: editedBio }),
      });

      if (res.ok) {
        setCurrentBio(editedBio);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Eroare la salvarea bio-ului:', err);
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

      <div className="artist-text-content">
        <h3 className="artist-name">{artist.name}</h3>

        <div className="artist-bio-section">
          {isEditing ? (
            <>
              <textarea
                className="artist-bio-edit"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
              <div style={{ marginTop: '5px' }}>
                <button className="save-btn" onClick={handleSaveBio}>Salvează</button>
                <button className="cancel-btn" onClick={() => { setIsEditing(false); setEditedBio(currentBio); }}>Anulează</button>
              </div>
            </>
          ) : (
            <>
              <p className="artist-bio">{currentBio}</p>
            </>
          )}
        </div>
      </div>

      {isAdmin && !isEditing && (
        <span className="edit-btn aligned-bottom" onClick={() => setIsEditing(true)}>Edit</span>
      )}
    </div>
  );
};

export default ArtistItem;
