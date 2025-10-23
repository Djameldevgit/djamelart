import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CountrySelect from './CountrySelect';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Badge,
  Alert
} from 'react-bootstrap';
import { FaCreditCard, FaMapMarkerAlt, FaUniversity, FaCheckCircle, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Chekout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cart, languageReducer, auth } = useSelector(state => state);

  const [countryCode, setCountryCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CCP');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const { t } = useTranslation('chekout');
  const lang = languageReducer.language || 'es';
  const isRTL = lang === 'ar';
  const isAlgeria = countryCode === 'DZ';
  const currency = isAlgeria ? 'DA' : '€';
  const token = auth.token;

  const total = cart.items?.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0) || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOrderConfirm = async () => {
    const orderData = {
      orderItems: cart.items,
      country: countryCode,
      paymentMethod,
      total,
    };

    try {
      const res = await axios.post('/api/orders', orderData, {
        headers: { Authorization: token }
      });

      setOrderConfirmed(true);
      dispatch({ type: 'CLEAR_CART' });
      history.push('/orders');

    } catch (err) {
      console.error(err.response?.data?.msg || 'Error al crear la orden');
    }
  };

  return (
    <div 
      className={isRTL ? 'rtl' : ''}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '3rem 0'
      }}
    >
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}
              >
                <FaCreditCard style={{ fontSize: '2.5rem', color: 'white' }} />
              </div>
              <h2 
                className="fw-bold mb-2"
                style={{ 
                  color: '#2d3748',
                  fontSize: '2.5rem'
                }}
              >
                {t('paymentForm', { lng: lang })}
              </h2>
              <p style={{ color: '#718096', fontSize: '1.1rem' }}>
                {t('completeYourOrder', { lng: lang }) || 'Completa tu pedido de forma segura'}
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Formulario de Pago */}
          <Col xs={12} lg={8} className="mb-2">
            <Card 
              className="border-0 shadow-sm mb-1"
              style={{ borderRadius: '20px' }}
            >
              <Card.Header 
                className="bg-white border-0 py-3"
                style={{ borderRadius: '20px 20px 0 0' }}
              >
                <h5 className="mb-0 fw-bold d-flex align-items-center" style={{ color: '#2d3748' }}>
                  <FaMapMarkerAlt className="me-2" style={{ color: '#667eea' }} />
                  {t('selectCountryLabel', { lng: lang })}
                </h5>
              </Card.Header>
              
            </Card>
<Card.Body className="p-4"  >
                <Form.Group  >
                  <CountrySelect onChange={setCountryCode} />
                </Form.Group>
              </Card.Body>
            {/* Métodos de Pago - Argelia */}
            {isAlgeria && (
              <Card 
                className="border-0 shadow-sm"
                style={{ borderRadius: '20px' }}
              >
                <Card.Header 
                  className="border-0 py-4"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px 20px 0 0',
                    color: 'white'
                  }}
                >
                  <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <FaCreditCard className="me-2" />
                    {t('paymentMethod', { lng: lang })}
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form.Group className="mb-4">
                    <Form.Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="CCP">🏛️ CCP (Compte Courant Postal)</option>
                      <option value="D17PAY">💳 D17PAY</option>
                    </Form.Select>
                  </Form.Group>

                  {/* CCP Details */}
                  {paymentMethod === 'CCP' && (
                    <div>
                      <Alert 
                        variant="info" 
                        className="mb-4"
                        style={{ 
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)'
                        }}
                      >
                        <h5 className="fw-bold mb-3 d-flex align-items-center">
                          <FaUniversity className="me-2" />
                          {t('algeriaPostTitle', { lng: lang })}
                        </h5>
                        
                        <div 
                          className="p-4 mb-3"
                          style={{
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                          }}
                        >
                          <Row className="mb-3">
                            <Col xs={12} sm={6}>
                              <p className="mb-2">
                                <strong style={{ color: '#667eea' }}>
                                  {t('accountName', { lng: lang })}:
                                </strong>
                              </p>
                              <p className="mb-0" style={{ fontSize: '1.1rem' }}>Djamel Baouali</p>
                            </Col>
                            <Col xs={12} sm={6}>
                              <p className="mb-2">
                                <strong style={{ color: '#667eea' }}>
                                  {t('accountNumberCCP', { lng: lang })}:
                                </strong>
                              </p>
                              <p className="mb-0" style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
                              in private for chat
                              </p>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col xs={12} sm={6}>
                              <p className="mb-2">
                                <strong style={{ color: '#667eea' }}>
                                  {t('postalCode', { lng: lang })}:
                                </strong>
                              </p>
                              <p className="mb-0">16000 (Algiers)</p>
                            </Col>
                            <Col xs={12} sm={6}>
                              <p className="mb-2">
                                <strong style={{ color: '#667eea' }}>
                                  {t('ccpKey', { lng: lang })}:in private for chat
                                </strong>
                              </p>
                              <p className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>95</p>
                            </Col>
                          </Row>
                        </div>

                        <div 
                          className="p-3"
                          style={{
                            background: '#fef3c7',
                            borderRadius: '10px',
                            borderLeft: '4px solid #f59e0b'
                          }}
                        >
                          <p className="mb-2">📌 {t('ccpInstruction1', { lng: lang })}</p>
                          <p className="mb-0">📌 {t('ccpInstruction2', { lng: lang })}</p>
                        </div>
                      </Alert>
                    </div>
                  )}

                  {/* D17PAY */}
                  {paymentMethod === 'D17PAY' && (
                    <Alert 
                      variant="success"
                      className="text-center"
                      style={{ 
                        borderRadius: '12px',
                        border: 'none'
                      }}
                    >
                      <p className="mb-3">{t('d17payInstruction', { lng: lang })}</p>
                      <Button
                        size="lg"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.75rem 2rem',
                          fontWeight: '600'
                        }}
                      >
                        💳 {t('payWithD17PAY', { lng: lang })}
                      </Button>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Métodos de Pago - Internacional */}
            {!isAlgeria && countryCode && (
              <Card 
                className="border-0 shadow-sm"
                style={{ borderRadius: '20px' }}
              >
                <Card.Header 
                  className="border-0 py-4"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px 20px 0 0',
                    color: 'white'
                  }}
                >
                  <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <FaUniversity className="me-2" />
                    {t('internationalBankTitle', { lng: lang })}
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div 
                    className="p-4 mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      borderRadius: '12px',
                      border: '2px solid #86efac'
                    }}
                  >
                    <Row className="mb-3">
                      <Col xs={12} md={6}>
                        <p className="mb-2">
                          <strong style={{ color: '#667eea' }}>
                            {t('beneficiary', { lng: lang })}:
                          </strong>
                        </p>
                        <p className="mb-3" style={{ fontSize: '1.1rem' }}>Djamel Baouali</p>
                      </Col>
                      <Col xs={12} md={6}>
                        <p className="mb-2">
                          <strong style={{ color: '#667eea' }}>
                            {t('bankName', { lng: lang })}:
                          </strong>
                        </p>
                        <p className="mb-3" style={{ fontSize: '1.1rem' }}>Société Générale</p>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={12}>
                        <p className="mb-2">
                          <strong style={{ color: '#667eea' }}>IBAN:</strong>
                        </p>
                        <p 
                          className="mb-3" 
                          style={{ 
                            fontSize: '1.1rem', 
                            fontFamily: 'monospace',
                            background: 'white',
                            padding: '0.5rem',
                            borderRadius: '8px'
                          }}
                        >
                        in private for chat
                        </p>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={12} md={6}>
                        <p className="mb-2">
                          <strong style={{ color: '#667eea' }}>SWIFT/BNC:</strong>
                        </p>
                        <p className="mb-3" style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
                          SOGEFRPP
                        </p>
                      </Col>
                      <Col xs={12} md={6}>
                        <p className="mb-2">
                          <strong style={{ color: '#667eea' }}>
                            {t('bankAddress', { lng: lang })}:
                          </strong>
                        </p>
                        <p className="mb-0">{t('direccionartista', { lng: lang })}</p>
                      </Col>
                    </Row>
                  </div>

                  <Alert 
                    variant="warning"
                    style={{ borderRadius: '12px' }}
                  >
                    <p className="mb-2">⚠️ {t('internationalNotice1', { lng: lang })}</p>
                    <p className="mb-0">⚠️ {t('internationalNotice2', { lng: lang })}</p>
                  </Alert>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Resumen del Pedido */}
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
                <FaCheckCircle style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                <h5 className="mb-0 fw-bold">{t('orderSummary', { lng: lang }) || 'Resumen del Pedido'}</h5>
              </Card.Header>
              
              <Card.Body className="p-4">
                <div className="mb-3 pb-3" style={{ borderBottom: '2px dashed #e2e8f0' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: '#718096' }}>
                      {t('products', { lng: lang }) || 'Productos'}:
                    </span>
                    <Badge 
                      bg="primary"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {cart.items?.length || 0}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#718096' }}>
                      {t('country', { lng: lang }) || 'País'}:
                    </span>
                    <span className="fw-semibold">
                      {countryCode || t('notSelected', { lng: lang }) || 'No seleccionado'}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                    {t('totalartista', { lng: lang })}:
                    </h4>
                    <h3 
                      className="mb-0 fw-bold"
                      style={{ 
                        color: '#667eea',
                        fontSize: '2rem'
                      }}
                    >
                      {currency} {total.toFixed(2)}
                    </h3>
                  </div>
                </div>

                <Button
                  onClick={handleOrderConfirm}
                  className="w-100 mb-3"
                  disabled={!countryCode}
                  style={{
                    background: countryCode 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#cbd5e0',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: countryCode 
                      ? '0 10px 25px rgba(102, 126, 234, 0.3)'
                      : 'none'
                  }}
                >
                  <FaCheckCircle className="me-2" /> {t('confirmOrder', { lng: lang })}
                </Button>

                <div 
                  className="p-3 text-center"
                  style={{
                    background: '#f7fafc',
                    borderRadius: '12px'
                  }}
                >
                  <p className="mb-2 fw-semibold" style={{ color: '#2d3748' }}>
                    {t('needHelp', { lng: lang })}
                  </p>
                  <p className="mb-1" style={{ fontSize: '0.9rem' }}>
                    <FaEnvelope className="me-2" style={{ color: '#667eea' }} />
                    {t('contactartista', { lng: lang })}
                  </p>
                  <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                    <FaPhoneAlt className="me-2" style={{ color: '#667eea' }} />
                    {t('telefonoartista', { lng: lang })}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chekout;