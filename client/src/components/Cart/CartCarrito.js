import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, loadCart, getCart } from '../../redux/actions/cartAction';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  ListGroup
} from 'react-bootstrap';
import { FaTrashAlt, FaShoppingCart, FaSignInAlt, FaHome, FaCreditCard } from 'react-icons/fa';

const CartCarrito = () => {
  const dispatch = useDispatch();
  const { auth, cart, languageReducer } = useSelector(state => state);
  const [showMessage, setShowMessage] = useState({ show: false, text: '', type: '' });
  const { t } = useTranslation('cartt');
  const lang = languageReducer.language || 'en';
  const isRTL = lang === 'ar';

  useEffect(() => {
    if (auth.token) {
      dispatch(getCart(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (auth.token) {
      dispatch(loadCart(auth.token));
    }
  }, [auth.token, dispatch]);

  const handleRemove = async (postId) => {
    try {
      const cleanId = String(postId._id || postId).trim();

      if (!cleanId || cleanId.length !== 24) {
        alert(t('invalidProductId', { lng: lang }));
        return;
      }

      const success = await dispatch(removeFromCart({ postId: cleanId, auth }));

      if (success) {
        dispatch(loadCart(auth.token));
        setShowMessage({
          show: true,
          text: t('productRemovedSuccessfully', { lng: lang }),
          type: 'success'
        });
        setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
      }
    } catch (err) {
      console.error('Error completo:', { err, postId });
      setShowMessage({
        show: true,
        text: `${t('removalError', { lng: lang })}: ${err.message}`,
        type: 'danger'
      });
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
    }
  };

  // Usuario no autenticado
  if (!auth.token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 1rem'
        }}
      >
        <Container   >
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card
                className="text-center shadow-lg border-0"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}
              >
                <Card.Body className="p-5">
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem'
                    }}
                  >
                    <FaShoppingCart style={{ fontSize: '3rem', color: 'white' }} />
                  </div>
                  <h3 className="mb-3 fw-bold">{t('yourCartIsEmpty', { lng: lang })}</h3>
                  <p className="text-muted mb-4">{t('pleaseLoginToViewCart', { lng: lang })}</p>
                  <Button
                    as={Link}
                    to="/login"
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 2rem',
                      fontWeight: '600'
                    }}
                  >
                    <FaSignInAlt className="me-2" /> {t('login', { lng: lang })}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '2rem 0'
      }}
      className={isRTL ? 'rtl' : ''}
    >
      <Container>
        {/* Header del carrito */}
        <div className="mb-4">
          <h2
            className="fw-bold d-flex align-items-center"
            style={{
              color: '#2d3748',
              fontSize: '2rem',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          >
            <FaShoppingCart
              className={isRTL ? 'ms-3' : 'me-3'}
              style={{ color: '#667eea' }}
            />
            {t('shoppingCart', { lng: lang }) || 'Carrito de Compras'}
          </h2>
        </div>

        {/* Mensajes de alerta */}
        {showMessage.show && (
          <Alert
            variant={showMessage.type === 'success' ? 'success' : 'danger'}
            dismissible
            onClose={() => setShowMessage({ show: false, text: '', type: '' })}
            className="mb-4"
            style={{ borderRadius: '12px' }}
          >
            {showMessage.text}
          </Alert>
        )}

        {/* Loading */}
        {cart.loading ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              variant="primary"
              style={{ width: '3rem', height: '3rem' }}
            />
            <p className="mt-3 text-muted">{t('loadingYourCart', { lng: lang })}</p>
          </div>
        ) : cart.items?.length === 0 ? (
          // Carrito vacío
          <Row className="justify-content-center" >
            <Col xs={12} md={8} lg={6}>
              <Card
                className="text-center shadow-sm border-0"
                style={{ borderRadius: '20px' }}
              >
                <Card.Body className="p-5">
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem',
                      opacity: 0.9
                    }}
                  >
                    <FaShoppingCart style={{ fontSize: '3.5rem', color: 'white' }} />
                  </div>
                  <h3 className="mb-3 fw-bold">{t('yourCartIsEmpty', { lng: lang })}</h3>
                  <p className="text-muted mb-4">
                    {t('startShoppingMessage', { lng: lang }) || 'Agrega productos para comenzar'}
                  </p>
                  <Button
                    as={Link}
                    to="/"
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 2rem',
                      fontWeight: '600'
                    }}
                  >
                    <FaHome className="me-2" /> {t('continueShopping', { lng: lang })}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          // Carrito con productos
          <Row>
            {/* Lista de productos */}
            <Col xs={12} lg={8} className="mb-4">
              <Card
                className="border-0 shadow-sm"
                style={{ borderRadius: '20px' }}
              >
                <Card.Header
                  className="bg-white border-0 py-3"
                  style={{ borderRadius: '20px 20px 0 0' }}
                >
                  <h5 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                    {t('products', { lng: lang }) || 'Productos'}
                    <Badge
                      bg="primary"
                      className={isRTL ? 'me-2' : 'ms-2'}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      {cart.items?.length || 0}
                    </Badge>
                  </h5>
                </Card.Header>
                <ListGroup variant="flush">
                  {cart.items?.map((item) => {
                    const postId = String(item.postId._id || item.postId);
                    return (
                      <ListGroup.Item
                        key={postId}
                        className="px-4 py-4"
                        style={{ border: 'none', borderBottom: '1px solid #e2e8f0' }}
                      >
                        <Row className="align-items-center">
                          {/* Imagen del producto */}
                          <Col xs={12} sm={3} className="mb-3 mb-sm-0">
                            <Link to={`/post/${postId}`}>
                              <div
                                style={{
                                  width: '100%',
                                  paddingTop: '100%',
                                  position: 'relative',
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                              >
                                <img
                                  src={item.postId?.images?.[0]?.url || 'imagen_por_defecto.jpg'}
                                  alt="producto"
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            </Link>
                          </Col>

                          {/* Detalles del producto */}
                          <Col xs={12} sm={9}>
                            <Row>
                              <Col xs={12} md={7}>
                                <h5
                                  className="fw-bold mb-3"
                                  style={{
                                    color: '#2d3748',
                                    fontSize: '1.1rem'
                                  }}
                                >
                                  {item.postId?.title || t('unnamedProduct', { lng: lang })}
                                </h5>

                                <div className="mb-3">
                                  <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: '#718096' }}>
                                      {t('unitPrice', { lng: lang })}:
                                    </span>
                                    <span className="fw-semibold" style={{ color: '#667eea' }}>
                                      ${item.price?.toFixed(2) || '0.00'}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: '#718096' }}>
                                      {t('quantity', { lng: lang })}:
                                    </span>
                                    <Badge
                                      bg="secondary"
                                      style={{ fontSize: '0.9rem' }}
                                    >
                                      {item.quantity || 1}
                                    </Badge>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="fw-semibold" style={{ color: '#2d3748' }}>
                                      {t('subtotal', { lng: lang })}:
                                    </span>
                                    <span className="fw-bold" style={{ color: '#667eea', fontSize: '1.2rem' }}>
                                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </Col>

                              <Col xs={12} md={5} className="d-flex align-items-center justify-content-md-end">
                                <Button
                                  variant="outline-danger"
                                  onClick={() => handleRemove(postId)}
                                  style={{
                                    borderRadius: '10px',
                                    padding: '0.5rem 1.25rem',
                                    fontWeight: '600',
                                    border: '2px solid #fc8181',
                                    color: '#e53e3e'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = '#e53e3e'
                                    e.target.style.color = 'white'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent'
                                    e.target.style.color = '#e53e3e'
                                  }}
                                >
                                  <FaTrashAlt className="me-2" /> {t('remove', { lng: lang })}
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
            </Col>

            {/* Resumen del pedido */}
            <Col xs={12} lg={4}>
              <Card
                className="border-0 shadow-sm position-sticky"
                style={{
                  borderRadius: '20px',
                  top: '20px'
                }}
              >
                <Card.Header
                  className="text-center py-4 border-0"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px 20px 0 0',
                    color: 'white'
                  }}
                >
                  <FaCreditCard style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                  <h5 className="mb-0 fw-bold" >{t('orderSummary', { lng: lang })}</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-3 pb-3" style={{ borderBottom: '2px dashed #e2e8f0' }}>
                    <div className="d-flex justify-content-between mb-3">
                      <span style={{ color: '#718096' }}>
                        {t('totalProducts', { lng: lang })}:
                      </span>
                      <Badge
                        bg="primary"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '1rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        {(cart.items || []).reduce((acc, item) => acc + (item.quantity || 1), 0)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                        {t('totalToPay', { lng: lang })}:
                      </h4>
                      <h3
                        className="mb-0 fw-bold"
                        style={{
                          color: '#667eea',
                          fontSize: '2rem'
                        }}
                      >
                        ${cart.totalPrice?.toFixed(2) || '0.00'}
                      </h3>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    to="/chekoutt"
                    className="w-100"
                    disabled={cart.items?.length === 0}
                    style={{
                      background: cart.items?.length > 0
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#cbd5e0',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: cart.items?.length > 0
                        ? '0 10px 25px rgba(102, 126, 234, 0.3)'
                        : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (cart.items?.length > 0) {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cart.items?.length > 0) {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                  >
                    <FaCreditCard className="me-2" /> {t('proceedToCheckout', { lng: lang })}
                  </Button>

                  <Button
                    as={Link}
                    to="/"
                    variant="outline-secondary"
                    className="w-100 mt-3"
                    style={{
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontWeight: '600',
                      border: '2px solid #e2e8f0'
                    }}
                  >
                    <FaHome className="me-2" /> {t('continueShopping', { lng: lang })}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CartCarrito;