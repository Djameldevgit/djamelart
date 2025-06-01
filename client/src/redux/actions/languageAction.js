import axios from 'axios'
export const CHANGE_LANGUAGE = {
  EN: 'EN',
  FR: 'FR',
  AR: 'AR',
  ES: 'ES',
  RU: 'RU',
  KAB: 'KAB',
  CHINO: 'CHINO', // Estaba mal duplicado como KAB
  SYNC: 'SYNC'
};

// Función auxiliar para enviar petición sin autenticación
const sendLanguageChange = async (endpoint, language) => {
  const res = await axios.put(`/api/language/${endpoint}`, { language });
  return res.data;
};

// Acción para inglés
export const inglishLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('ingles', language);
    dispatch({ type: CHANGE_LANGUAGE.EN, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

// Acción para francés
export const franchLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('frances', language);
    dispatch({ type: CHANGE_LANGUAGE.FR, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

// Acción para árabe
export const arabLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('arabe', language);
    dispatch({ type: CHANGE_LANGUAGE.AR, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

// Acción para español
export const spanishLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('espanol', language);
    dispatch({ type: CHANGE_LANGUAGE.ES, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

// Acción para ruso
export const russianLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('ruso', language);
    dispatch({ type: CHANGE_LANGUAGE.RU, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

// Acción para cabilio (Kabyle)
export const kabyleLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('kabyle', language);
    dispatch({ type: CHANGE_LANGUAGE.KAB, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

// Acción para chino
export const chinoLanguage = (language) => async (dispatch) => {
  try {
    const res = await sendLanguageChange('chino', language);
    dispatch({ type: CHANGE_LANGUAGE.CHINO, payload: { language, res } });
  } catch (error) {
    console.error(error);
  }
};

export const synchronizeLanguage = (language) => async dispatch => {
  try {
    await axios.patch('language', { language }, {
     
    });

    dispatch({ type: 'SET_LANGUAGE', payload: language });
  } catch (err) {
    console.error('Error updating language:', err);
  }
};