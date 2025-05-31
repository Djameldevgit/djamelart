import { putDataAPI } from "../../utils/fetchData";

// Constantes de tipos de acción
export const CHANGE_LANGUAGE = {
  EN: 'EN',
  FR: 'FR',
  AR: 'AR',
  ES: 'ES',
  RU: 'RU',
  KAB: 'KAB',
  KAB: 'CHINO',
  SYNC: 'SYNC'
};

// Acción para inglés
export const inglishLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/ingles', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.EN,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

// Acción para francés
export const franchLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/frances', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.FR,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

// Acción para árabe
export const arabLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/arabe', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.AR,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

// Acción para español
export const spanishLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/espanol', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.ES,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

// Acción para ruso
export const russianLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/ruso', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.RU,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

// Acción para cabilio (Kabyle)
export const kabyleLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/kabyle', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.KAB,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

// Acción de sincronización general (fallback)
 
export const chinoLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/chino', { language }, auth.token);
    dispatch({
      type: CHANGE_LANGUAGE.CHINO,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);
  }
};

export const synchronizeLanguage = (language, auth) => async dispatch => {
  try {
    await axios.patch('language', { language }, {
      headers: { Authorization: auth.token }
    });

    dispatch({ type: 'SET_LANGUAGE', payload: language });
  } catch (err) {
    console.error('Error updating language:', err);
  }
};