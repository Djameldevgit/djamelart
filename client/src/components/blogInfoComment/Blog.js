import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  createComment, getAdminComments } from '../../redux/actions/userAction';
 

const Blog = () => {
  const { auth, socket } = useSelector(state => state);
  const dispatch = useDispatch();
  const [content, setContent] = useState('');

  // Obtener ID del admin de forma segura
  const adminUserId = auth.user?._id; // Asumimos que el blog pertenece al usuario logueado

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !adminUserId) return;

    try {
      await dispatch(createComment({
        newComment: {
          content,
          blogAuthor: adminUserId, // Envía el ID correcto
          ...(!auth.user && { guestCommenterName: 'Anónimo' })
        },
        auth,
        socket
      }));
      setContent('');
    } catch (err) {
      console.error("Error completo al comentar:", {
        error: err,
        response: err.response?.data
      });
    }
  };

  // Cargar comentarios - Versión optimizada
  useEffect(() => {
    if (!adminUserId) return;

    const loadComments = async () => {
      try {
        await dispatch(getAdminComments({ adminUserId, auth }));
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    };

    loadComments();

    // Socket listeners
    const handleNewComment = (newComment) => {
      if (newComment.blogAuthor === adminUserId) {
        dispatch({ type: 'ADD_COMMENT', payload: newComment });
      }
    };

    socket?.on('newAdminComment', handleNewComment);

    return () => {
      socket?.off('newAdminComment', handleNewComment);
    };
  }, [adminUserId, dispatch, socket, auth]);

  return (
    <div className="blog_comments">
      <h3>Comentarios sobre el Administrador</h3>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu comentario..."
          required
          minLength={3}
        />
        <button type="submit" disabled={!content.trim()}>
          Enviar
        </button>
      </form>

      {/* Lista de comentarios aquí */}
    </div>
  );
};

export default Blog