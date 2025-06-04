import { ROLES_TYPES } from "../actions/roleAction";

const initialState = {
  loading: false,
  role: "",
  user: null,
  users: [] // Lista de usuarios
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ROLES_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ROLES_TYPES.USER_ROLE:
    case ROLES_TYPES.SUPERUSER_ROLE:
    case ROLES_TYPES.MODERADOR_ROLE:
    case ROLES_TYPES.ADMIN_ROLE:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload.user._id
            ? { ...user, role: action.payload.user.role } // Actualiza el rol correctamente
            : user
        ),
        user: { ...action.payload.user, role: action.payload.user.role }, // Asegura que user también se actualiza
        role: action.payload.user.role // Actualiza el estado del rol globalmente
      };

    default:
      return state;
  }
};

export default roleReducer;
