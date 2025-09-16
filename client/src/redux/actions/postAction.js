import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI,  getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'
import axios from "axios";
 
export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST',
    VIEW_POST: 'VIEW_POST',
}

 
export const getPosts = () => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        const res = await getDataAPI('posts')
        
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const updatePost = ({content, images, auth, status}) => async (dispatch) => {
    let media = []
    const imgNewUrl = images.filter(img => !img.url)
    const imgOldUrl = images.filter(img => img.url)

    if(status.content === content 
        && imgNewUrl.length === 0
        && imgOldUrl.length === status.images.length
    ) return;

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        if(imgNewUrl.length > 0) media = await imageUpload(imgNewUrl)

        const res = await patchDataAPI(`post/${status._id}`, { 
            content, images: [...imgOldUrl, ...media] 
        }, auth.token)

        dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const likePost = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
  
    socket.emit('likePost', newPost)
  
    try {
      await patchDataAPI(`post/${post._id}/like`, null, auth.token)
  
      // Notify
      const msg = {
        id: auth.user._id,
        text: 'like your post.',
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        content: post.content, 
        image: post.images[0]?.url || null, // <-- asegúrate que no pete si no hay imagen
      }
  
      dispatch(createNotify({msg, auth, socket}))
  
    } catch (err) {
      console.error("❌ Error en likePost:", err) // log para debug
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { 
          error: err.response?.data?.msg || err.message || "Error inesperado"
        }
      })
    }
  }
  

export const unLikePost = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('unLikePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const viewPost = ({ id, auth }) => async (dispatch) => {
    console.log("🚀 Entrando a action viewPost con id:", id);
  
    try {
      const res = await postDataAPI(`post/${id}/view`, {}, auth.token);
  
      console.log("✅ Respuesta del backend:", res.data.post.views);
  
      dispatch({
        type: POST_TYPES.VIEW_POST,
        payload: {
          postId: id,
          updatedPost: res.data.post,
        },
      });
    } catch (err) {
      console.error("❌ Error en viewPost:", err.response?.data || err.message);
    }
  };
  

   
export const getPost = ({detailPost, id }) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const res = await getDataAPI(`post/${id}`)
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}
  
 
  
export const deletePost = ({ post, auth, socket }) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post });
  
    try {
      const res = await deleteDataAPI(`post/${post._id}`, auth.token);
  
      const recipients = res.data?.newPost?.user || [];
  
      const msg = {
        id: post._id,
        text: 'added a new post.',
        recipients,
        url: `/post/${post._id}`,
      };
  
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      const errorMsg =
        err?.response?.data?.msg || err?.message || 'Error al eliminar post';
  
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: errorMsg },
      });
    }
  };
  

export const savePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`savePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSavePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}