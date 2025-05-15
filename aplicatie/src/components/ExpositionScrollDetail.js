import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ExpositionScrollDetail.css';

const ExpositionScrollDetail = () => {
  const { id } = useParams();
  const [exposition, setExposition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedLocation, setEditedLocation] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdmin = user?.email === 'admin@yahoo.com';

  useEffect(() => {
    fetch(`http://localhost:5000/api/expositions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setExposition(data);
        setEditedTitle(data.title);
        setEditedDescription(data.description);
        setEditedLocation(data.location || '');
      })
      .catch((err) => console.error('Failed to fetch exposition:', err));
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/expositions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          location: editedLocation,
          artists: exposition.artists.map((a) => a._id),
          image: exposition.image,
          startDate: exposition.startDate,
          endDate: exposition.endDate,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setExposition({
          ...exposition,
          title: updated.title,
          description: updated.description,
          location: updated.location
        });
        setEditedTitle(updated.title);
        setEditedDescription(updated.description);
        setEditedLocation(updated.location);
        setIsEditing(false);
      } else {
        console.error('Failed to save changes');
      }
    } catch (err) {
      console.error('Error updating exposition:', err);
    }
  };

  if (!exposition) return <div className="expo-loading">Se încarcă...</div>;

  return (
    <div className="expo-scroll-detail">
      <div
        className="expo-scroll-hero"
        style={{ backgroundImage: `url(${exposition.image})` }}
      ></div>

      <div className="expo-scroll-content">
        <h1 className="expo-scroll-title">
          {isEditing ? (
            <input
              className="expo-edit-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            exposition.title
          )}
        </h1>

        <div className="expo-scroll-grid">
          <div className="expo-scroll-label">Despre</div>
          <div className="expo-scroll-description">
            {isEditing ? (
              <textarea
                className="expo-edit-description"
                rows={8}
                style={{ width: '100%', minHeight: '160px' }}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            ) : (
              <p>{exposition.description}</p>
            )}
            {isEditing ? (
              <div className="expo-scroll-location">
                <strong>Locație </strong>
                <input
                  className="expo-edit-location"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                />
              </div>
            ) : (
              exposition.location && (
                <p className="expo-scroll-location">
                  <strong>Locație</strong> {exposition.location}
                </p>
              )
            )}
          </div>
        </div>

        <section className="expo-scroll-section">
          <h2 className="expo-scroll-subtitle">Artiști</h2>
          {exposition.artists && exposition.artists.length > 0 ? (
            <ul className="expo-scroll-artist-columns">
              {exposition.artists.map((artist) => (
                <li className="artist-name" key={artist._id}>{artist.name}</li>
              ))}
            </ul>
          ) : (
            <p className="expo-scroll-text">Nu sunt artiști asociați cu această expoziție.</p>
          )}
        </section>

        {isEditing ? (
          <div className="expo-edit-buttons">
            <button className="save-btn" onClick={handleSave}>Salvează</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Anulează</button>
          </div>
        ) : (
          isAdmin && (
            <span className="edit-link" onClick={() => setIsEditing(true)}>Edit</span>
          )
        )}
      </div>
    </div>
  );
};

export default ExpositionScrollDetail;
