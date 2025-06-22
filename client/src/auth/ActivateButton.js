import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendActivationEmail } from '../redux/actions/authAction';
import { useTranslation } from 'react-i18next';

const ActivateButton = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { languageReducer } = useSelector(state => state);

  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'fr';

  const [sent, setSent] = useState(false);

  const hideBlock = !user || !token || user?.isVerified || sent;

  const handleActivate = () => {
    if (user?.isVerified) return;

    dispatch(sendActivationEmail(token));
    setSent(true);

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  if (hideBlock) return null;

  return (
    <div className="text-center mt-4">
      <div className="text-red-600 font-semibold mb-2">
        ❌ {t('noVerificada', { lng: lang })}
      </div>
      <button
        onClick={handleActivate}
        className="mt-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition duration-300"
      >
        {t('activar', { lng: lang })}
      </button>
    </div>
  );
};

export default ActivateButton;



