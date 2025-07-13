import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CountrySelect from './CountrySelect';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Chekout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cart, languageReducer, auth } = useSelector(state => state);

  const [countryCode, setCountryCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CCP');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const { t } = useTranslation('cart');
  const lang = languageReducer.language || 'es';
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
      dispatch({ type: 'CLEAR_CART' }); // si tienes esta acción en Redux
      history.push('/orders'); // o redirigir a una página de confirmación

    } catch (err) {
      console.error(err.response?.data?.msg || 'Error al crear la orden');
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">{t('paymentForm', { lng: lang })}</h2>

      {/* Selector de País */}
      <div className="form-group">
        <label>{t('selectCountryLabel', { lng: lang })}</label>
        <CountrySelect onChange={setCountryCode} />
      </div>

      {/* Bloque de Pago Dinámico */}
      {isAlgeria ? (
        <div className="payment-method-algeria">
          <div className="form-group">
            <label>{t('paymentMethod', { lng: lang })}</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CCP">CCP (Compte Courant Postal)</option>
              <option value="D17PAY">D17PAY</option>
            </select>
          </div>

          {paymentMethod === 'CCP' && (
            <div className="ccp-details">
              <h4>{t('algeriaPostTitle', { lng: lang })}</h4>
              <div className="bank-info-box">
                <p><strong>{t('accountName', { lng: lang })}:</strong> Mohamed Benali</p>
                <p><strong>{t('accountNumberCCP', { lng: lang })}:</strong> 123 456 78 90</p>
                <p><strong>{t('postalCode', { lng: lang })}:</strong> 16000 (Algiers)</p>
                <p><strong>{t('ccpKey', { lng: lang })}:</strong> 95</p>
              </div>
              <div className="payment-instructions">
                <p>{t('ccpInstruction1', { lng: lang })}</p>
                <p>{t('ccpInstruction2', { lng: lang })}</p>
              </div>
            </div>
          )}

          {paymentMethod === 'D17PAY' && (
            <div className="d17pay-info">
              <p>{t('d17payInstruction', { lng: lang })}</p>
              <button className="d17pay-button">
                {t('payWithD17PAY', { lng: lang })}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="payment-method-international">
          <div className="bank-info-box">
            <h4>{t('internationalBankTitle', { lng: lang })}</h4>
            <p><strong>{t('beneficiary', { lng: lang })}:</strong> Mohamed Benali</p>
            <p><strong>{t('bankName', { lng: lang })}:</strong> Société Générale</p>
            <p><strong>IBAN:</strong> FR76 3000 3036 2000 0500 0001 234</p>
            <p><strong>SWIFT/BIC:</strong> SOGEFRPP</p>
            <p><strong>{t('bankAddress', { lng: lang })}:</strong> 29 Blvd Haussmann, 75009 Paris, France</p>
          </div>
          <div className="payment-notice">
            <p>{t('internationalNotice1', { lng: lang })}</p>
            <p>{t('internationalNotice2', { lng: lang })}</p>
          </div>
        </div>
      )}

      {/* Botón de Confirmación */}
      <button 
        className="confirm-button"
        onClick={handleOrderConfirm}
      >
        {t('confirmOrder', { lng: lang })}
      </button>

      {/* Contacto */}
      <div className="contact-section">
        <p>{t('needHelp', { lng: lang })}</p>
        <p>📧 contact@artista.com | 📱 +213 123 456 789</p>
      </div>
    </div>
  );
};

export default Chekout;
