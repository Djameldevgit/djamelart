import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replyComment, updateComment, deleteComment } from '../redux/actions/blogAction';

const BlogCommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth) || {};
  const user = auth.user || null;
  const [replyText, setReplyText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const canEditOrDelete = user && (user._id === comment.user.id || user.role === 'admin');

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    dispatch(replyComment(comment._id, { text: replyText }));
    setReplyText('');
  };

  const handleUpdate = () => {
    dispatch(updateComment(comment._id, { text: editText }));
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Eliminar comentario?')) {
      dispatch(deleteComment(comment._id));
    }
  };

  return (
    <div className="card mb-2 p-2">
      <div className="d-flex justify-content-between">
        <div>
          <strong>{comment.user.name}</strong>
          <div className="text-muted small">{new Date(comment.createdAt).toLocaleString()}</div>
        </div>
        <div>
          {canEditOrDelete && (
            <>
              <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setEditing(!editing)}>{editing ? 'Cancelar' : 'Editar'}</button>
              <button className="btn btn-sm btn-danger" onClick={handleDelete}>Eliminar</button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="mt-2">
          <textarea className="form-control" value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} />
          <button className="btn btn-sm btn-success mt-2" onClick={handleUpdate}>Guardar</button>
        </div>
      ) : (
        <p className="mt-2">{comment.text}</p>
      )}

      {/* Replies (un nivel) */}
      <div className="replies ms-4 mt-2">
        {comment.replies && comment.replies.map((r, i) => (
          <div key={i} className="card p-2 mb-1">
            <strong>{r.user.name}</strong> <div className="small text-muted">{new Date(r.createdAt).toLocaleString()}</div>
            <div>{r.text}</div>
          </div>
        ))}
      </div>

      {/* Reply form */}
      {user && (
        <form onSubmit={handleReply} className="mt-2">
          <textarea className="form-control" value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2} placeholder="Responder..." />
          <button className="btn btn-sm btn-primary mt-1">Responder</button>
        </form>
      )}
    </div>
  );
};

export default BlogCommentItem;
