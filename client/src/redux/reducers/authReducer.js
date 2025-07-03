import { GLOBALTYPES } from '../actions/globalTypes'

const initialState = {}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case GLOBALTYPES.AUTH:
            return action.payload;
      
            case GLOBALTYPES.SOCKET:
                return {
                  ...state,
                  socket: action.payload
                };
      
      
      
      
      
      
      
            default:



        
            return state;
    }
}


export default authReducer