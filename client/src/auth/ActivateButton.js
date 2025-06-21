import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendActivationEmail } from '../redux/actions/authAction';

const ActivateButton = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  // Si no hay usuario o token, no mostrar el botón (pero después de los hooks)
  const shouldHide = !user || !token;

  const handleActivate = () => {
    if (user.isVerified) {
      setMessage("✅ Su cuenta ya está activada. Ahora puedes usar la aplicación.");
      return;
    }

    dispatch(sendActivationEmail(token));
    setSent(true);
    setMessage("📨 Correo enviado");
  };

  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setSent(false);
        setMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [sent]);

  const closeMessage = () => {
    setMessage('');
    setSent(false);
  };

  const baseButtonClass =
    "mt-2 px-4 py-2 text-white rounded transition-opacity duration-300";

  if (shouldHide) return null;

  return (
    <div className="text-center mt-4">
      {!user.isVerified ? (
        <div>
          <div className="text-red-600 font-semibold mb-2">❌ Cuenta no verificada</div>
          <button
            onClick={handleActivate}
            disabled={sent}
            className={`${baseButtonClass} bg-red-600 hover:bg-red-700 disabled:opacity-50`}
          >
            {sent ? "📨 Correo enviado" : "Activar mi cuenta"}
          </button>
        </div>
      ) : (
        <button
          disabled
          className={`${baseButtonClass} bg-green-600 cursor-default`}
        >
          ✅ Cuenta activada
        </button>
      )}

      {message && (
        <div className="mt-3 inline-flex items-center justify-center bg-blue-100 border border-blue-400 text-blue-800 px-4 py-2 rounded relative">
          <span>{message}</span>
          <button
            onClick={closeMessage}
            className="ml-4 text-blue-700 font-bold text-lg hover:text-red-600"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};


export default ActivateButton;
