import { CHANGE_LANGUAGE } from "../actions/languageAction";

const initialState = {
  language: 'fr' // idioma por defecto
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE.EN:
    case CHANGE_LANGUAGE.FR:
    case CHANGE_LANGUAGE.AR:
    case CHANGE_LANGUAGE.ES:
    case CHANGE_LANGUAGE.RU:
    case CHANGE_LANGUAGE.KAB:
    case CHANGE_LANGUAGE.CHINO:
      return {
        ...state,
        language: action.payload.language
      };
    
    case CHANGE_LANGUAGE.SYNC:
      return {
        ...state,
        language: action.payload.language
      };

    default:
      return state;
  }
};

export default languageReducer;

