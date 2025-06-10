import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, loadCart } from '../../redux/actions/cartAction';
import { Link } from 'react-router-dom';

// Importación simple de Font Awesome (sin SVG)
import { FaTrashAlt, FaShoppingCart, FaSignInAlt, FaSpinner, FaHome, FaCreditCard } from 'react-icons/fa';

const CartCarrito = () => {
  const dispatch = useDispatch();
  const { auth, cart } = useSelector(state => state);
  const [showMessage, setShowMessage] = useState({ show: false, text: '', type: '' });

  useEffect(() => {
    if (auth.token) {
      dispatch(loadCart(auth.token));
    }
  }, [auth.token, dispatch]);

  const handleRemove = async (postId) => {
    try {
      const cleanId = String(postId._id || postId).trim();
   
      if (!cleanId || cleanId.length !== 24) {
        alert('El ID del producto no es válido');
        return;
      }

      const success = await dispatch(removeFromCart({ postId: cleanId, auth }));

      if (success) {
        dispatch(loadCart(auth.token));
        setShowMessage({
          show: true,
          text: 'Producto eliminado correctamente',
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Error completo:', { err, postId });
      setShowMessage({
        show: true,
        text: `Error al eliminar: ${err.message}`,
        type: 'danger'
      });
    }
  };

  if (!auth.token) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content">
          <FaShoppingCart className="cart-empty-icon" />
          <h3>Tu carrito está vacío</h3>
          <p>Por favor inicia sesión para ver tu carrito</p>
          <Link to="/login" className="btn-login">
            <FaSignInAlt /> Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">
        <FaShoppingCart /> Tu Carrito de Compras
      </h2>

      {showMessage.show && (
        <div className={`alert-message ${showMessage.type}`}>
          {showMessage.text}
        </div>
      )}

      {cart.loading ? (
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <span>Cargando tu carrito...</span>
        </div>
      ) : cart.items?.length === 0 ? (
        <div className="empty-cart">
          <FaShoppingCart className="empty-cart-icon" />
          <h3>Tu carrito está vacío</h3>
          <Link to="/" className="btn-continue-shopping">
            <FaHome /> ¡Sigue comprando!
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items?.map((item) => {
              const postId = String(item.postId._id || item.postId);
              return (
                <div key={postId} className="cart-item-card">
                  <div className="cart-item-image-container">
                    <Link to={`/post/${postId}`}>
                      <img
                        src={item.postId?.images?.[0]?.url || 'imagen_por_defecto.jpg'}
                        alt="producto"
                        className="cart-item-image"
                      />
                    </Link>
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.postId?.title || 'Producto sin nombre'}</h4>
                    
                    <div className="cart-item-info">
                      <div className="info-row">
                        <span>Precio unitario:</span>
                        <span className="price">${item.price?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="info-row">
                        <span>Cantidad:</span>
                        <span className="quantity">{item.quantity || 1}</span>
                      </div>
                      <div className="info-row total">
                        <span>Subtotal:</span>
                        <span className="subtotal">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemove(postId)}
                      className="btn-remove-item"
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">
                <FaCreditCard /> Resumen del Pedido
              </h3>
              <hr className="summary-divider" />
              <div className="summary-row">
                <span>Total Productos:</span>
                <span>{(cart.items || []).reduce((acc, item) => acc + (item.quantity || 1), 0)}</span>      </div>
              <div className="summary-row total">
                <span>Total a Pagar:</span>
                <span className="total-price">${cart.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <Link
                to="/cart/chekout"
                className="btn-checkout"
                disabled={cart.items.length === 0}
              >
                <FaCreditCard /> Proceder al Pago
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCarrito;