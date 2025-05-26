import { GLOBALTYPES } from '../actions/globalTypes'

const initialState = {
  loading: false,
  items: [],
  totalPrice: 0
}

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return {
        ...state,
        items: action.payload.user && action.payload.user.cart 
          ? action.payload.user.cart.items 
          : [],
        totalPrice: action.payload.user && action.payload.user.cart 
          ? action.payload.user.cart.totalPrice 
          : 0
      }
      case GLOBALTYPES.GET_CART:
        return {
          ...state,
          items: action.payload.items,
          totalPrice: action.payload.totalPrice
        };
    case GLOBALTYPES.LOADING_CART:
      return {
        ...state,
        loading: action.payload
      }

    case GLOBALTYPES.ADD_TO_CART:
    case GLOBALTYPES.REMOVE_FROM_CART:
    case GLOBALTYPES.UPDATE_CART_ITEM:
      return {
        ...state,
        items: action.payload.user.cart.items,
        totalPrice: action.payload.user.cart.totalPrice
      }
      case GLOBALTYPES.AUTH:
        return {
          ...state,
          items: action.payload.user?.cart?.items || [],
          totalPrice: action.payload.user?.cart?.totalPrice || 0
        }
    default:
      return state
  }
}

export default cartReducer

