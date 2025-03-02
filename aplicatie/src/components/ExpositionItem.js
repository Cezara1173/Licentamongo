import React from 'react';

const Exposition = ({ event, artists }) => {
  const getArtistName = (artistId) => {
    const artist = artists.find(artist => artist._id.$oid === artistId.$oid);
    return artist ? artist.name : 'Unknown Artist';
  };

  return (
    <div className="expo">
      <h2>{event.title}</h2>
      <img src={event.image} alt={event.title} />
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Start Date:</strong>{' '}
        {event.startDate}
      </p>
      <p>
        <strong>End Date:</strong>{' '}
        {event.endDate}
      </p>
      <p>
        <strong>Artists:</strong>
        <ul>
          {event.artists.map((artistId) => (
            <li key={artistId.$oid}>{getArtistName(artistId)}</li>
          ))}
        </ul>
      </p>
      <p>
        <strong>Created At:</strong>{' '}
        {event.createdAt}
      </p>
      <p>
        <strong>Updated At:</strong>{' '}
        {event.updatedAt}
      </p>
    </div>
  );
};

export default Exposition;
