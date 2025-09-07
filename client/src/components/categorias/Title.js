import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export function TitleInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');   
  const lang = languageReducer.language || 'en';
  
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [localValue, setLocalValue] = useState(postData.title || '');

  // Sincronizar con el valor del padre
  useEffect(() => {
    setLocalValue(postData.title || '');
  }, [postData.title]);

  // Validación en tiempo real
  useEffect(() => {
    if (!isTouched) return;
    
    const validateTitle = () => {
      const title = localValue || '';
      
      // 1. Validar longitud
      if (title.length < 3) {
        return t('titleMinLength', { lng: lang }) || 'Mínimo 3 caracteres';
      }
      
      if (title.length > 100) {
        return t('titleMaxLength', { lng: lang }) || 'Máximo 100 caracteres';
      }
      
      // 2. Validar caracteres permitidos
      const allowedRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,!?()'"@#$%&*+=:;/]+$/;
      if (title && !allowedRegex.test(title)) {
        return t('titleInvalidChars', { lng: lang }) || 'Caracteres no permitidos';
      }
      
      // 3. Validar que no sea solo espacios
      if (/^\s*$/.test(title)) {
        return t('titleNotEmpty', { lng: lang }) || 'El título no puede estar vacío';
      }
      
      return '';
    };
    
    setError(validateTitle());
  }, [localValue, isTouched, lang, t]);

  const handleBlur = () => {
    setIsTouched(true);
    
    // 🔥 Enviar el valor final al padre al perder foco
    if (localValue !== postData.title) {
      const sanitizedValue = sanitizeText(localValue);
      handleChangeInput({
        target: {
          name: 'title',
          value: sanitizedValue
        }
      });
    }
  };

  // Función de sanitización separada
  const sanitizeText = (value) => {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    
    // Sanitización básica en tiempo real
    const sanitizedValue = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100);
    
    // 🔥 ACTUALIZAR ESTADO LOCAL primero para respuesta inmediata
    setLocalValue(sanitizedValue);
    
    // 🔥 ENVIAR AL PADRE en tiempo real (opcional, puedes quitarlo si quieres solo al blur)
    handleChangeInput({
      target: {
        name: 'title',
        value: sanitizedValue
      }
    });
  };

  return (
    <div className='form-group'>
      <label>{t('titleDeLaObra', { lng: lang })}</label>
      
      <Form.Control
        type="text"
        name="title"
        value={localValue} // 🔥 Usar el estado local
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={t('introduceUnTituloParaLaObra', { lng: lang })}
        isInvalid={isTouched && error}
        isValid={isTouched && !error && localValue.length > 0}
        maxLength={100}
      />
      
      {/* Contador de caracteres */}
      <div className="text-muted small mt-1">
        {localValue.length}/100 {t('caracteres', { lng: lang }) || 'caracteres'}
      </div>
      
      {/* Mensaje de error */}
      {isTouched && error && (
        <Alert variant="danger" className="mt-2 small p-2">
          ⚠️ {error}
        </Alert>
      )}
      
      {/* Ejemplos de títulos válidos */}
      {!localValue && (
        <div className="text-muted small mt-2">
             </div>
      )}
    </div>
  );
}