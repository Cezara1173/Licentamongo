// src/components/CommentSection.js
// src/components/CommentSection.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { token } = useAuth();

  // ✅ Fetch comments on mount or productId change
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${productId}`);
        if (!res.ok) throw new Error('Failed to load comments');
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Eroare la încărcarea comentariilor:', err.message);
      }
    };

    fetchComments();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('Te rugăm să te loghezi pentru a comenta.');

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ productId, text }),
      });

      if (!res.ok) {
        throw new Error('Eroare la adăugarea comentariului');
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setText('');
    } catch (err) {
      alert(err.message);
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="comment-section">
      {visibleComments.length > 0 ? (
        visibleComments.map((comment) => (
          <div key={comment._id} className="comment">
            <strong>{comment.user?.username || 'Utilizator șters'}</strong>{' '}
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleString('ro-RO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div>{comment.text}</div>
          </div>
        ))
      ) : (
        <p style={{ fontStyle: 'italic', color: '#888' }}>Nu există comentarii încă.</p>
      )}

      {comments.length > 2 && !showAll && (
        <button onClick={() => setShowAll(true)} className="see-more">
          Vezi toate comentariile
        </button>
      )}

      {token ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Adaugă un comentariu..."
            required
          />
          <button type="submit">Trimite</button>
        </form>
      ) : (
        <p className="login-prompt">Loghează-te pentru a comenta.</p>
      )}
    </div>
  );
};

export default CommentSection;
