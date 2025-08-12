import { ROLES_TYPES } from "../actions/roleAction";

import {   GLOBALTYPES } from '../actions/globalTypes';
 
const initialState = {
  usersRoles: {}, // Almacena roles por userId
  currentUserRole: null // Rol del usuario logueado
};

export default function roleReducer(state = initialState, action) {
  switch (action.type) {
    case ROLES_TYPES.UPDATE_ROLE:
      return {
        ...state,
        usersRoles: {
          ...state.usersRoles,
          [action.payload.userId]: action.payload.newRole
        },
        currentUserRole: action.payload.updatedUser._id === action.payload.userId 
          ? action.payload.newRole 
          : state.currentUserRole
      };

    case GLOBALTYPES.AUTH:
      return {
        ...state,
        currentUserRole: action.payload.user?.role || state.currentUserRole
      };

    default:
      return state;
  }
}

 
