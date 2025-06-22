import { GLOBALTYPES } from './globalTypes';
import { imageUpload } from '../../utils/imageUpload';
import { getDataAPI, patchDataAPI, deleteDataAPI  } from '../../utils/fetchData';
import { removeNotify } from './notifyAction';

export const USER_TYPES = {
    LOADING_USERS: 'LOADING_USERS',
    GET_USERS: 'GET_USERS',
    UPDATE_USER: 'UPDATE_USER',
   
    DELETE_USER: 'DELETE_USER',
 


};
 

export const getUsers = (token) => async (dispatch) => {
    try {
        // Usa exactamente el mismo nombre que definiste en USER_TYPES
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: true });
        
        const res = await getDataAPI('users?limit=9&page=1', token);
        
        // Verifica que la respuesta tenga datos antes de dispatch
        if (!res.data) {
            throw new Error('No data received');
        }

        dispatch({
            type: USER_TYPES.GET_USERS,  // Asegúrate que coincida exactamente
            payload: {
                users: res.data.users || [],
                result: res.data.result || 0,
                page: 1
            }
        });

    } catch (err) {
        console.error('Error in getUsers:', err);
        
        dispatch({
            type: GLOBALTYPES.ALERT,  // Verifica también esta constante
            payload: {
                error: err.response?.data?.msg || 
                      err.message || 
                      'Error loading users'
            }
        });
    } finally {
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: false });
    }
};

// Acción para actualizar un usuario
export const updateUser = ({ content, images, auth, status }) => async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter(img => !img.url);
    const imgOldUrl = images.filter(img => img.url);

    if (status.content === content
        && imgNewUrl.length === 0
        && imgOldUrl.length === status.images.length
    ) return;

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);

        const res = await patchDataAPI(`user/${status._id}`, {
            content, images: [...imgOldUrl, ...media]
        }, auth.token);

        dispatch({ type: USER_TYPES.UPDATE_USER, payload: res.data.newUser });
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};
export const toggleActiveStatus = (userId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`toggle_active/${userId}`, null, token);
    dispatch({
      type: USER_TYPES.UPDATE_USER,
      payload: res.data.user,
    });
  } catch (err) {
    console.error(err);
  }
};


export const deleteUser = ({id, auth}) => async (dispatch) => {
    try {
      dispatch({ type: USER_TYPES.LOADING_USERS, payload: true });
      
      await deleteDataAPI(`user/${id}`, auth.token);
      
      dispatch({
        type: USER_TYPES.DELETE_USER,
        payload: id // Envía solo el ID string
      });
  
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Usuario eliminado correctamente' }
      });
  
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'Error al eliminar usuario' }
      });
    } finally {
      dispatch({ type: USER_TYPES.LOADING_USERS, payload: false });
    }
  };



 
 

 
  
