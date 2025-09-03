import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function DescriptionInput({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('categorias');  
  const lang = languageReducer.language || 'en';
  
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [localValue, setLocalValue] = useState(postData.description || '');

  // Sincronizar con el valor del padre
  useEffect(() => {
    setLocalValue(postData.description || '');
    setCharCount(postData.description?.length || 0);
  }, [postData.description]);

  // Validación en tiempo real
  useEffect(() => {
    if (!isTouched) return;
    
    const validateDescription = () => {
      const description = localValue || '';
      setCharCount(description.length);
      
      // 1. Validar longitud
      if (description.length < 10) {
        return t('descriptionMinLength', { lng: lang }) || 'Mínimo 10 caracteres para una descripción significativa';
      }
      
      if (description.length > 1000) {
        return t('descriptionMaxLength', { lng: lang }) || 'Máximo 1000 caracteres';
      }
      
      // 2. Validar caracteres permitidos (más flexible que el título)
      const allowedRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,!?()'"@#$%&*+=:;/\\\n\r\t¿¡€£¥©®—–•§¶\p{Emoji}]*$/u;
      if (description && !allowedRegex.test(description)) {
        return t('descriptionInvalidChars', { lng: lang }) || 'Caracteres no permitidos detectados';
      }
      
      // 3. Validar que no sea solo espacios o saltos de línea
      if (/^[\s\n\r\t]*$/.test(description)) {
        return t('descriptionNotEmpty', { lng: lang }) || 'La descripción no puede estar vacía';
      }
      
      // 4. Validar proporción de caracteres especiales (opcional)
      const specialCharsCount = (description.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?€£¥©®—–•§¶]/g) || []).length;
      if (specialCharsCount > description.length * 0.3) {
        return t('descriptionTooManySpecialChars', { lng: lang }) || 'Demasiados caracteres especiales';
      }
      
      return '';
    };
    
    setError(validateDescription());
  }, [localValue, isTouched, lang, t]);

  const handleBlur = () => {
    setIsTouched(true);
    
    // 🔥 Enviar el valor final al padre al perder foco
    if (localValue !== postData.description) {
      const sanitizedValue = sanitizeText(localValue);
      handleChangeInput({
        target: {
          name: 'description',
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
      .replace(/(\b)(on\w+)=([^>]*)/gi, '')
      .slice(0, 1000);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    
    // Sanitización básica en tiempo real
    const sanitizedValue = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/(\b)(on\w+)=([^>]*)/gi, '')
      .slice(0, 1000);
    
    // 🔥 ACTUALIZAR ESTADO LOCAL primero para respuesta inmediata
    setLocalValue(sanitizedValue);
    setCharCount(sanitizedValue.length);
    
    // 🔥 ENVIAR AL PADRE en tiempo real
    handleChangeInput({
      target: {
        name: 'description',
        value: sanitizedValue
      }
    });
  };

  // Estilo de contador de caracteres (cambia color según el límite)
  const getCharCountStyle = () => {
    if (charCount > 950) return { color: '#dc3545', fontWeight: 'bold' };
    if (charCount > 800) return { color: '#fd7e14' };
    return { color: '#6c757d' };
  };

  return (
    <div className='form-group'>
      <Form.Group controlId="descriptionInput" className="mb-3">
        <label>{t('description1', { lng: lang })}</label>
        
        <Form.Control
          as="textarea"
          name="description"
          value={localValue} // 🔥 Usar el estado local
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('placeholdersss.description', { lng: lang })}
          rows={5}
          style={{ resize: 'vertical', minHeight: '120px' }}
          isInvalid={isTouched && error}
          isValid={isTouched && !error && localValue.length > 0}
          maxLength={1000}
        />
        
        {/* Contador de caracteres con progreso */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="small" style={getCharCountStyle()}>
            {charCount}/1000 {t('caracteres', { lng: lang }) || 'caracteres'}
          </div>
          
          {charCount > 0 && (
            <div className="small text-muted">
              {Math.round((charCount / 1000) * 100)}% {t('delLimite', { lng: lang }) || 'del límite'}
            </div>
          )}
        </div>
        
        {/* Barra de progreso visual */}
        <div className="progress mt-1" style={{ height: '4px' }}>
          <div 
            className={`progress-bar ${
              charCount > 950 ? 'bg-danger' : 
              charCount > 800 ? 'bg-warning' : 'bg-success'
            }`} 
            style={{ width: `${(charCount / 1000) * 100}%` }}
          />
        </div>
        
        {/* Mensaje de error */}
        {isTouched && error && (
          <Alert variant="danger" className="mt-2 small p-2">
            ⚠️ {error}
          </Alert>
        )}
        
        {/* Sugerencias para una buena descripción */}
        {!localValue && (
          <div className="text-muted small mt-3">
            <strong>💡 {t('sugerencias', { lng: lang }) || 'Sugerencias:'}</strong>
            <ul className="mb-0 ps-3">
              <li>{t('sugerencia1', { lng: lang }) || 'Describe los materiales utilizados'}</li>
              <li>{t('sugerencia2', { lng: lang }) || 'Menciona la técnica artística'}</li>
              <li>{t('sugerencia3', { lng: lang }) || 'Explica la inspiración o significado'}</li>
              <li>{t('sugerencia4', { lng: lang }) || 'Incluye dimensiones y peso si aplica'}</li>
            </ul>
          </div>
        )}
      </Form.Group>
    </div>
  );
}