import { getDataAPI, postDataAPI, putDataAPI, deleteDataAPI } from '../../utils/fetchData'

// Obtener todos los comentarios
export const getComments = () => async dispatch => {
  dispatch({ type: 'BLOG_GET_COMMENTS_REQUEST' })
  try {
    const res = await getDataAPI('blog/comments')
    dispatch({ type: 'BLOG_GET_COMMENTS_SUCCESS', payload: res.data.comments })
  } catch (err) {
    dispatch({ type: 'BLOG_GET_COMMENTS_FAIL', payload: err.response?.data?.message || err.message })
  }
}

// Crear un nuevo comentario
export const createComment = (data) => async (dispatch, getState) => {
  try {
    const { auth, socket } = getState()
    const token = auth?.token || localStorage.getItem('token')
    const res = await postDataAPI('blog/comments', data, token)

    dispatch({ type: 'BLOG_CREATE_COMMENT_SUCCESS', payload: res.data.comment })

    // Emitir al servidor para que todos reciban el nuevo comentario
    if (socket) {
      socket.emit('blog:comment:new', { comment: res.data.comment })
    }

    dispatch({ type: 'NOTIFY_ADD', payload: { text: 'Nuevo comentario', url: '/blog' } })
  } catch (err) {
    console.error(err)
  }
}

// Responder a un comentario
export const replyComment = (commentId, data) => async (dispatch, getState) => {
  try {
    const token = getState().auth?.token || localStorage.getItem('token')
    const res = await postDataAPI(`blog/comments/${commentId}/reply`, data, token)
    dispatch({ type: 'BLOG_REPLY_SUCCESS', payload: res.data.comment })
  } catch (err) {
    console.error(err)
  }
}

// Actualizar un comentario
export const updateComment = (id, data) => async (dispatch, getState) => {
  try {
    const token = getState().auth?.token || localStorage.getItem('token')
    const res = await putDataAPI(`blog/comments/${id}`, data, token)
    dispatch({ type: 'BLOG_UPDATE_SUCCESS', payload: res.data.comment })
  } catch (err) {
    console.error(err)
  }
}

// Eliminar un comentario
export const deleteComment = (id) => async (dispatch, getState) => {
  try {
    const token = getState().auth?.token || localStorage.getItem('token')
    await deleteDataAPI(`blog/comments/${id}`, token)
    dispatch({ type: 'BLOG_DELETE_SUCCESS', payload: id })
  } catch (err) {
    console.error(err)
  }
}
