import { CHANGE_LANGUAGE } from "../actions/languageAction";

const initialState = {
  language: 'fr' // Idioma por defecto
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE.EN:
      return {
        ...state,
        language: "en",
      };

    case CHANGE_LANGUAGE.FR:
      return {
        ...state,
        language: "fr",
      };

    case CHANGE_LANGUAGE.AR:
      return {
        ...state,
        language: "ar",
      };

    case CHANGE_LANGUAGE.ES:
      return {
        ...state,
        language: "es",
      };

    case CHANGE_LANGUAGE.RU:
      return {
        ...state,
        language: "ru",
      };

    case CHANGE_LANGUAGE.KAB:
      return {
        ...state,
        language: "kab",
      };

    case CHANGE_LANGUAGE.SYNC:
      return {
        ...state,
        language: action.payload.language, // para fallback o sincronización general
      };

    default:
      return state;
  }
};

export default languageReducer;
