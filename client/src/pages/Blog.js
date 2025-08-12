import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, createComment } from '../redux/actions/blogAction';
import BlogCommentItem from '../components/BlogCommentItem';
 // Si no tienes utils/socket, importa tu socket así: import socket from '../../socket' etc.

const Blog = () => {
  const { auth, socket } = useSelector(state => state)
  const dispatch = useDispatch();
  const { comments, loading } = useSelector(state => state.blog || { comments: [], loading: false });
 
  const [text, setText] = useState('');

  useEffect(() => {
    dispatch(getComments());

    // Suscribir a eventos socket
    if (socket) {
      socket.on('blog:comment:new', ({ comment }) => {
        dispatch({ type: 'BLOG_NEW_COMMENT_WS', payload: comment });
      });
      socket.on('blog:comment:reply', ({ commentId, reply }) => {
        dispatch({ type: 'BLOG_REPLY_WS', payload: { commentId, reply } });
      });
      socket.on('blog:comment:update', ({ commentId, text }) => {
        dispatch({ type: 'BLOG_UPDATE_WS', payload: { commentId, text } });
      });
      socket.on('blog:comment:delete', ({ commentId }) => {
        dispatch({ type: 'BLOG_DELETE_WS', payload: commentId });
      });
    }

    return () => {
      if (socket) {
        socket.off('blog:comment:new');
        socket.off('blog:comment:reply');
        socket.off('blog:comment:update');
        socket.off('blog:comment:delete');
      }
    };
  }, [dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(createComment({ text }));
    setText('');
  };

  return (
    <div className="container py-4">
      <div className="blog-header mb-4">
        <h2>Mi historia breve</h2>
        <div className="bio-box">
          {/* Aquí va tu breve historial - puedes reemplazarlo con contenido estático o dinámico */}
          <p>Soy Djamel, pintor y creador de obras... (breve descripción).</p>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comentarios</h3>

        <form onSubmit={handleCreate} className="mb-3">
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={auth && auth.user ? "Escribe tu comentario..." : "Inicia sesión para comentar"}
            disabled={!auth || !auth.user}
            rows={3}
          />
          <button className="btn btn-primary mt-2" disabled={!auth || !auth.user}>Enviar</button>
        </form>

        {loading ? <p>Cargando...</p> : (
          <div>
            {comments.length === 0 ? <p>No hay comentarios aún.</p> :
              comments.map(c => <BlogCommentItem key={c._id} comment={c} />)
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
