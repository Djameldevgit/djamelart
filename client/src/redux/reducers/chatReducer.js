import React from 'react'

const initialState = {
    receiver: null,
    showDrawer: false,
  };
  
  const chatReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_ACTIVE_CHAT':
        return {
          ...state,
          receiver: action.payload,
          showDrawer: true,
        };
      case 'CLOSE_CHAT_DRAWER':
        return {
          ...state,
          receiver: null,
          showDrawer: false,
        };
      default:
        return state;
    }
  };
  
  export default chatReducer;
  
 