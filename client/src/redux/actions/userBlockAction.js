import { GLOBALTYPES } from './globalTypes';
import {  getDataAPI } from '../../utils/fetchData';

export const USER_TYPES_BLOCK = {
  LOADING_USER: 'LOADING_USER',
 
  GET_USERS_BLOCK: 'GET_USERS_BLOCK',
};
/*
export const bloquearUsuario = ({ auth, datosBloqueo, user }) => async (dispatch) => {
  if (!user || !user._id) {
    return dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: "Usuario no válido para bloquear." }
    });
  }

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await patchDataAPI(`user/${user._id}/block`, {
      motivo: datosBloqueo.motivo,
      content: datosBloqueo.content,
      fechaLimite: datosBloqueo.fechaLimite,
     
    }, auth.token);

    // 🟢 ACTUALIZA el estado de Redux
    dispatch({
      type: USER_TYPES.UPDATE_USER_BLOCK_STATUS,
      payload: {
        userId: user._id,
        esBloqueado: true,
      },
    });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.msg }
    });

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || "Error al bloquear usuario" }
    });
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

 
export const unBlockUser = ({ user, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await patchDataAPI(`user/${user._id}/unblock`, {}, auth.token);

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.msg }
    });

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || "Error al desbloquear usuario" }
    });
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};*/

export const getBlockedUsers = (token) => async (dispatch) => {
  try {
    dispatch({ type: USER_TYPES_BLOCK.LOADING_USER, payload: true });

    const res = await getDataAPI('users/block', token);

    dispatch({
      type: USER_TYPES_BLOCK.GET_USERS_BLOCK,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || "Error al obtener usuarios bloqueados" }
    });
  } finally {
    dispatch({ type: USER_TYPES_BLOCK.LOADING_USER, payload: false });
  }
};
