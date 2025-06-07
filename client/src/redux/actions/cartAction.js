// actions/cartAction.js
import { GLOBALTYPES } from './globalTypes'
import { putDataAPI, deleteDataAPI, patchDataAPI,getDataAPI } from '../../utils/fetchData'

 

// En cartAction.js
export const loadCart = (token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.LOADING_CART, payload: true });
    const res = await getDataAPI('cart', token);
    
    dispatch({ 
      type: GLOBALTYPES.LOAD_CART, 
      payload: {
        items: res.data.items || [],
        totalPrice: res.data.totalPrice || 0
      }
    });
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || "Error al cargar carrito" }
    });
  } finally {
    dispatch({ type: GLOBALTYPES.LOADING_CART, payload: false });
  }
};

export const removeFromCart = ({ postId, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.LOADING_CART, payload: true });
    if (!postId || typeof postId !== 'string') {
      throw new Error('ID de producto inválido');
    }

    // Asegúrate de enviar solo el ID como string
    await deleteDataAPI(`cart/remove/${postId}`, auth.token);
    
    // Actualización optimista
    dispatch({
      type: GLOBALTYPES.AUTH, // Usamos AUTH para mantener consistencia
      payload: {
        user: {
          ...auth.user,
          cart: {
            items: auth.user.cart.items.filter(item => item.postId !== postId),
            totalPrice: auth.user.cart.items
              .filter(item => item.postId !== postId)
              .reduce((total, item) => total + (item.price * item.quantity), 0)
          }
        }
      }
    });
    
    return true;
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error al eliminar' }
    });
    return false;
  } finally {
    dispatch({ type: GLOBALTYPES.LOADING_CART, payload: false });
  }
};

export const buyProduct = ({ post, auth }) => async (dispatch) => {
  dispatch({ type: GLOBALTYPES.LOADING_CART, payload: true });

  try {
    await putDataAPI(`cart/add/${post._id}`, null, auth.token);

    const updatedItems = [...auth.user.cart.items, {
      postId: post._id,
      title: post.title,
      images: post.images,
      quantity: 1,
      price: post.price
    }];
    
    const updatedPrice = auth.user.cart.totalPrice + post.price;

    dispatch({
      type: GLOBALTYPES.ADD_TO_CART,
      payload: {
        user: {
          ...auth.user,
          cart: { items: updatedItems, totalPrice: updatedPrice }
        }
      }
    });
    
    return true; // Para manejar el éxito en el componente
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || "Error al agregar al carrito" }
    });
    return false; // Para manejar el error en el componente
  } finally {
    dispatch({ type: GLOBALTYPES.LOADING_CART, payload: false });
  }
};
 
export const updateCartItem = ({ post, auth, quantity }) => async (dispatch) => {
  dispatch({ type: GLOBALTYPES.LOADING_CART, payload: true })

  try {
    await patchDataAPI(`update/${post._id}`, { quantity }, auth.token)

    const items = auth.user.cart.items.map(item => {
      if  (item.postId === post._id)
      {
        const priceDiff = (quantity - item.quantity) * post.price
        return { ...item, quantity }
      }
      return item
    })

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    dispatch({
      type: GLOBALTYPES.UPDATE_CART_ITEM,
      payload: {
        user: {
          ...auth.user,
          cart: { items, totalPrice }
        }
      }
    })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || "Error al actualizar cantidad" }
    })
  } finally {
    dispatch({ type: GLOBALTYPES.LOADING_CART, payload: false })
  }
}
export const getCart = () => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    if (!auth.token) return;
    
    const res = await getDataAPI('cart', auth.token);
    
    dispatch({
      type: GLOBALTYPES.GET_CART,  // Asegúrate que esto está correctamente definido
      payload: {
        items: res.data.items || [],
        totalPrice: res.data.totalPrice || 0
      }
    });
    
  } catch (err) {
    console.error('Error getting cart:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error al obtener el carrito' }
    });
  }
};