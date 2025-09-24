import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comments from '../components/blogInfoComment/Commentsss';
 
import { getComments, createComment } from '../redux/actions/blogAction';
 
 
const Comment = () => {
  const { auth, socket } = useSelector(state => state);
  const { comments = [], loading } = useSelector(state => state.blog || {});
  const dispatch = useDispatch();
 
  const [text, setText] = useState('');

  useEffect(() => {
    dispatch(getComments());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleNewComment = ({ comment }) =>
      dispatch({ type: 'BLOG_NEW_COMMENT_WS', payload: comment });

    const handleReply = ({ commentId, reply }) =>
      dispatch({ type: 'BLOG_REPLY_WS', payload: { commentId, reply } });

    const handleUpdate = ({ commentId, text }) =>
      dispatch({ type: 'BLOG_UPDATE_WS', payload: { commentId, text } });

    const handleDelete = ({ commentId }) =>
      dispatch({ type: 'BLOG_DELETE_WS', payload: commentId });

    socket.on('blog:comment:new', handleNewComment);
    socket.on('blog:comment:reply', handleReply);
    socket.on('blog:comment:update', handleUpdate);
    socket.on('blog:comment:delete', handleDelete);

    return () => {
      socket.off('blog:comment:new', handleNewComment);
      socket.off('blog:comment:reply', handleReply);
      socket.off('blog:comment:update', handleUpdate);
      socket.off('blog:comment:delete', handleDelete);
    };
  }, [socket, dispatch]);

  const handleCreate = useCallback((e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(createComment({ text }));
    setText('');
  }, [text, dispatch]);

  return (
    <div className='container' >
 

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div>
            {comments.length === 0 ? (
              <p>No hay comentarios aún.</p>
            ) : (
              comments.map(c => <Comments key={c._id} comment={c} />)
            )}
          </div>
        )}
 



   <form onSubmit={handleCreate} className="mb-3">
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={auth?.user ? "Escribe tu comentario..." : "Inicia sesión para comentar"}
            disabled={!auth?.user}
            rows={3}
          />
          <button className="btn btn-primary mt-2" disabled={!auth?.user}>
            Enviar
          </button>
        </form>

      </div>
  
  );
};

export default Comment;
