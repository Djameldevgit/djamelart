import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, loadCart } from '../../redux/actions/cartAction';
import { Link } from 'react-router-dom';

const CartCarrito = () => {
  const dispatch = useDispatch();
  const { auth, cart } = useSelector(state => state);
  
  useEffect(() => {
    if (auth.token) {
      dispatch(loadCart(auth.token));
    }
  }, [auth.token, dispatch]);

  const handleRemove = async (postId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await dispatch(removeFromCart({ postId, auth }));
      dispatch(loadCart(auth.token)); // Recargar carrito después de eliminar
    }
  };

  if (!auth.token) {
    return (
      <div className="container text-center my-5">
        <p>Por favor inicia sesión para ver tu carrito</p>
        <Link to="/login" className="btn btn-primary">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Tu Carrito de Compras</h2>

      {cart.loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : cart.items?.length === 0 ? (
        <div className="alert alert-info">
          Tu carrito está vacío. <Link to="/">¡Sigue comprando!</Link>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-8">
              {cart.items?.map((item) => (
                <div key={item.postId} className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img 
                        src={item.images?.[0] || '/default-product.jpg'} 
                        className="img-fluid rounded-start"
                        alt={item.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link to={`/post/${item.postId}`}>
                            {item.title || 'Producto sin título'}
                          </Link>
                        </h5>
                        <p className="card-text">
                          <strong>Precio unitario:</strong> ${item.price?.toFixed(2) || '0.00'}
                        </p>
                        <p className="card-text">
                          <strong>Cantidad:</strong> {item.quantity || 1}
                        </p>
                        <p className="card-text">
                          <strong>Subtotal:</strong> ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                        <button 
                          onClick={() => handleRemove(item.postId)}
                          className="btn btn-danger"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Resumen del Pedido</h5>
                  <hr />
                  <p>
                    <strong>Total Productos:</strong> {cart.items?.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                  </p>
                  <p>
                    <strong>Total a Pagar:</strong> ${cart.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                  <Link to="/cart/chekout"
                    className="btn btn-success w-100"
                    disabled={cart.items?.length === 0}
                  >
                    Proceder al Pago
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartCarrito;