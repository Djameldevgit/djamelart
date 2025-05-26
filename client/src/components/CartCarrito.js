import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, getCart } from '../redux/actions/cartAction';

const CartCarrito = () => {
  const dispatch = useDispatch();
  const { auth, cart } = useSelector(state => state);
  
  // Obtener el carrito al cargar el componente
  useEffect(() => {
    if (auth.token) {
      dispatch(getCart());
    }
  }, [auth.token, dispatch]);

  const handleRemove = async (post) => {
    await dispatch(removeFromCart({ 
        post: {
            _id: post.postId || post._id,
            price: post.price,
            quantity: post.quantity
        },
        auth 
    }));
};

// En el botón eliminar:
 
  
  // En el botón:
  
  
  // En el botón:
  
  
  // En el botón eliminar:
 
  if (!auth.token) {
    return <p>Inicia sesión para ver tu carrito</p>;
  }

  return (
    <div className="cart_container">
      <h2>Tu Carrito</h2>

      {cart.items?.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        cart.items?.map((item, index) => (
          <div key={`${item.postId}-${index}`} className="cart_item">
           <img 
  src={item.images?.length > 0 ? item.images[0] : 'default-image.jpg'} 
  alt={item.title || 'Producto sin título'} 
/>
            <h4>{item.title}</h4>
            <p>${(item.price * (item.quantity || 1)).toFixed(2)}</p>
          

            <button onClick={() => handleRemove(item)}>
    Eliminar
</button>
          </div>
        ))
      )}

      <div className="cart_total">
        Total: ${parseFloat(cart.totalPrice || 0).toFixed(2)}
      </div>
    </div>
  );
};

export default CartCarrito;