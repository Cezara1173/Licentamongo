import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import './CommentSection.css';
import { FaTrashAlt } from 'react-icons/fa';

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [showAll, setShowAll] = useState(false);

  const { token, user } = useAuth();
  const isAdmin = user?.email === 'admin@yahoo.com';

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/api/comments/${productId}`);
        setComments(res.data);
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
      const res = await axiosInstance.post('/api/comments', { productId, text });
      setComments((prev) => [res.data, ...prev]);
      setText('');
    } catch (err) {
      alert('Eroare la adăugarea comentariului');
      console.error(err.response?.data || err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Eroare la ștergerea comentariului:', err);
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="comment-section">
      {visibleComments.length > 0 ? (
        visibleComments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <div>
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
              </div>
              {isAdmin && (
                <FaTrashAlt
                  className="comment-trash-icon"
                  onClick={() => handleDeleteComment(comment._id)}
                  title="Șterge comentariul"
                />
              )}
            </div>
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
