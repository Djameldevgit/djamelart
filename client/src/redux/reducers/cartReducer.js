import { GLOBALTYPES } from '../actions/globalTypes'

const initialState = {
  items: [],
  totalPrice: 0,
  loading: false
}

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.LOADING_CART:
      return { ...state, loading: action.payload }
      case GLOBALTYPES.LOAD_CART:
        return {
          ...state,
          items: action.payload.items,
          totalPrice: action.payload.totalPrice
        }
    case GLOBALTYPES.GET_CART:
      return {
        ...state,
        items: action.payload.items,
        totalPrice: action.payload.totalPrice
      }

    case GLOBALTYPES.ADD_TO_CART:
    case GLOBALTYPES.REMOVE_FROM_CART:
    case GLOBALTYPES.UPDATE_CART_ITEM:
      return {
        ...state,
        items: action.payload.user.cart.items,
        totalPrice: action.payload.user.cart.totalPrice
      }
    
    
    default:
      return state
  }
}

export default cartReducer

