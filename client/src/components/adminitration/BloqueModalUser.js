import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Button,
  Form,
  Alert,
  CloseButton
} from "react-bootstrap";
import {
  ExclamationTriangleFill,
  XCircleFill,
  Calendar2EventFill,
  InfoCircleFill
} from "react-bootstrap-icons";
import { bloquearUsuario } from "../../redux/actions/userAction";

const BloqueModalUser = ({ show, handleClose, user }) => {
  const { auth, languageReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const { t } = useTranslation('modales');
  const lang = languageReducer.language || 'es';
  const [error, setError] = useState(null);

  const [datosBloqueo, setDatosBloqueo] = useState({
    motivo: "",
    content: "",
    fecha: "",
    hora: "",
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDatosBloqueo({ ...datosBloqueo, [name]: value });
  };

  const handleBloqueo = (e) => {
    e.preventDefault();
    setError(null);

    const { motivo, fecha, hora, content } = datosBloqueo;

    if (!motivo || !fecha || !hora || !content) {
      setError(t('errorsss.missingFields'));
      return;
    }

    const fechaLimite = `${fecha}T${hora}`;

    dispatch(bloquearUsuario({
      auth,
      datosBloqueo: { motivo, content, fechaLimite },
      user
    }));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Modal.Header className="bg-danger text-white position-relative">
        <Modal.Title className="d-flex align-items-center">
          <ExclamationTriangleFill className={`${lang === 'ar' ? 'ms-2' : 'me-2'}`} />
          {t('head.title')}
        </Modal.Title>
        <CloseButton
          variant="white"
          onClick={handleClose}
          aria-label={t('actions.close')}
          className="position-absolute"
          style={lang === 'ar' ? { left: '1rem', top: '1rem' } : { right: '1rem', top: '1rem' }}
        />
      </Modal.Header>

      <Form onSubmit={handleBloqueo}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <XCircleFill className={`${lang === 'ar' ? 'ms-2' : 'me-2'}`} />
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              <InfoCircleFill className={`${lang === 'ar' ? 'ms-2' : 'me-2'} text-warning`} />
              {t('formm.reasonLabel')}
            </Form.Label>
            <Form.Select
              name="motivo"
              value={datosBloqueo.motivo}
              onChange={handleChangeInput}
              required
            >
              <option value="">{t('formm.selectReason')}</option>
              <option value="Comportement abusif">{t('reasons.abusiveBehavior')}</option>
              <option value="Spam">{t('reasons.spam')}</option>
              <option value="Violation des conditions d'utilisation">{t('reasons.termsViolation')}</option>
              <option value="Langage offensant">{t('reasons.offensiveLanguage')}</option>
              <option value="Fraude">{t('reasons.fraud')}</option>
              <option value="Usurpation d'identité">{t('reasons.identityTheft')}</option>
              <option value="Contenu inapproprié">{t('reasons.inappropriateContent')}</option>
              <option value="Violation de la vie privée">{t('reasons.privacyViolation')}</option>
              <option value="Interruption du service">{t('reasons.serviceDisruption')}</option>
              <option value="Activité suspecte">{t('reasons.suspiciousActivity')}</option>
              <option value="Autre">{t('reasons.other')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('formm.detailsLabel')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              value={datosBloqueo.content}
              onChange={handleChangeInput}
              placeholder={t('formm.detailsPlaceholder')}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <Calendar2EventFill className={`${lang === 'ar' ? 'ms-2' : 'me-2'} text-primary`} />
              {t('formm.blockDuration')}
            </Form.Label>
            <Form.Group className="mb-2">
              <Form.Label>{t('formm.dateLabel')}</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={datosBloqueo.fecha}
                onChange={handleChangeInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{t('formm.timeLabel')}</Form.Label>
              <Form.Control
                type="time"
                name="hora"
                value={datosBloqueo.hora}
                onChange={handleChangeInput}
                required
              />
            </Form.Group>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('actions.cancel')}
          </Button>
          <Button variant="danger" type="submit">
            {t('actionn.confirmBlock')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BloqueModalUser;