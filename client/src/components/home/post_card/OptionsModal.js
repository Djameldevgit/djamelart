import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Modal, Form, Alert, Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  PinterestIcon
} from 'react-share';

const OptionsModal = ({ 
  show, 
  onClose, 
  isAdmin, 
  isPostOwner, 
  saved, 
  t,
  post,
  auth,
  dispatch,
  history,
  socket,
  homeUsers,
  canProceed,
  handleAddUser
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [copied, setCopied] = useState(false);

  const optionsModalRef = useRef(null);
  const backdropRef = useRef(null);

  // Cerrar modal SOLO al hacer click en el backdrop (fondo)
  useEffect(() => {
    const handleBackdropClick = (event) => {
      // Solo cerrar si se hace click específicamente en el backdrop
      if (backdropRef.current && event.target === backdropRef.current) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleBackdropClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleBackdropClick);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  // URL y texto para compartir
  const shareUrl = `${window.location.origin}/post/${post?._id}`;
  const shareTitle = `${t('artworkBy')} ${post?.user?.username || t('artist')}: "${post?.content?.substring(0, 80)}..." - ${t('seeMoreAt')} Tassili Art`;
  const imageUrl = post?.images?.[0]?.url || post?.user?.avatar;

  // Encontrar admin
  const adminUser = homeUsers?.users?.find(user => user.role === "admin");

  // Handlers específicos para cada opción - SIN PROPAGATION PROBLEM
  const handleEditPost = useCallback(() => {
    if (!canProceed()) return;
    dispatch({ type: 'GLOBALTYPES.STATUS', payload: { ...post, onEdit: true } });
    onClose();
  }, [canProceed, post, dispatch, onClose]);

  const handleDeletePost = useCallback(() => {
    if (!canProceed()) return;

    if (window.confirm(t('confirmDelete'))) {
      dispatch({ type: 'DELETE_POST', payload: { post, auth, socket } });
      onClose();
    }
  }, [canProceed, post, auth, socket, dispatch, t, onClose]);

  const handleContactSeller = useCallback(() => {
    if (!canProceed()) return;
    handleAddUser(post?.user);
    onClose();
  }, [canProceed, post?.user, handleAddUser, onClose]);

  const handleChatWithAdmin = useCallback(() => {
    if (!canProceed()) return;

    if (!adminUser) {
      return dispatch({
        type: 'GLOBALTYPES.ALERT',
        payload: { error: t('noAdminAvailable') }
      });
    }
    handleAddUser(adminUser);
    onClose();
  }, [canProceed, adminUser, dispatch, t, handleAddUser, onClose]);

  const handleAprove = useCallback(() => {
    if (window.confirm(t('confirmApprove'))) {
      dispatch({ type: 'APROVE_POST', payload: { post, auth } });
      history.push("/administration/homepostspendientes");
      onClose();
    }
  }, [post, auth, dispatch, history, t, onClose]);

  const handleSavePostAction = useCallback(async () => {
    if (!canProceed()) return;

    if (saved) {
      await dispatch({ type: 'UNSAVE_POST', payload: { post, auth } });
    } else {
      await dispatch({ type: 'SAVE_POST', payload: { post, auth } });
    }
    onClose();
  }, [canProceed, saved, dispatch, post, auth, onClose]);

  const handleSubmitReport = useCallback(() => {
    if (!canProceed()) return;

    if (!reportReason.trim()) {
      return dispatch({
        type: 'GLOBALTYPES.ALERT',
        payload: { error: 'Por favor selecciona un motivo para el reporte' }
      });
    }

    const reportData = {
      postId: post?._id,
      userId: post?.user?._id,
      reason: reportReason,
    };

    dispatch({ type: 'CREATE_REPORT', payload: { auth, reportData } });
    setShowReportModal(false);
    setReportReason('');
    onClose();
    dispatch({
      type: 'GLOBALTYPES.ALERT',
      payload: { success: 'Reporte enviado exitosamente' }
    });
  }, [canProceed, reportReason, post, auth, dispatch, onClose]);

  const handleCopy = useCallback((message) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    dispatch({
      type: 'GLOBALTYPES.ALERT',
      payload: { success: message }
    });
  }, [dispatch]);

  // Handlers para modales anidados
  const handleShareClick = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleReportClick = useCallback(() => {
    setShowReportModal(true);
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Modal de opciones - ESTRUCTURA SIMPLIFICADA */}
      <div 
        ref={backdropRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}
      >
        <div
          ref={optionsModalRef}
          style={{
            background: 'white',
            width: '100%',
            maxWidth: '500px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '20px 0',
            transform: 'translateY(0)',
            animation: 'slideUp 0.3s ease',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()} // ¡IMPORTANTE! Detener propagación aquí
        >
          {/* Lista de opciones */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Opciones para admin */}
            {isAdmin && (
              <button
                onClick={handleAprove}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '16px',
                  color: '#333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span className="material-icons" style={{ color: '#666' }}>
                  check_circle
                </span>
                {t('approvePublication')}
              </button>
            )}

            {/* Opciones para el dueño del post o admin */}
            {(isPostOwner || isAdmin) && (
              <>
                <button
                  onClick={handleEditPost}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '16px',
                    color: '#333',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="material-icons" style={{ color: '#666' }}>
                    edit
                  </span>
                  {t('editPublication')}
                </button>

                <button
                  onClick={handleDeletePost}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '16px',
                    color: '#e74c3c',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="material-icons" style={{ color: '#e74c3c' }}>
                    delete
                  </span>
                  {t('deletePublication')}
                </button>
              </>
            )}

            {/* Opciones para todos los usuarios */}
            <button
              onClick={handleContactSeller}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span className="material-icons" style={{ color: '#666' }}>
                chat
              </span>
              {t('contactArtist')}
            </button>

            <button
              onClick={handleShareClick}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span className="material-icons" style={{ color: '#666' }}>
                share
              </span>
              {t('sharePublication')}
            </button>

            <button
              onClick={handleSavePostAction}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span className="material-icons" style={{ color: '#666' }}>
                {saved ? 'bookmark' : 'bookmark_border'}
              </span>
              {saved ? t('saved') : t('savePublication')}
            </button>

            {/* Contactar con Admin */}
            <button
              onClick={handleChatWithAdmin}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span className="material-icons" style={{ color: '#666' }}>
                admin_panel_settings
              </span>
              {t('contactAdmin')}
            </button>

            {/* Opción de denuncia (si no es el dueño) */}
            {!isPostOwner && (
              <button
                onClick={handleReportClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '16px',
                  color: '#e74c3c',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background-color 0.2s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span className="material-icons" style={{ color: '#e74c3c' }}>
                  flag
                </span>
                {t('reportPublication')}
              </button>
            )}

            {/* Botón para cerrar */}
            <div style={{ padding: '8px 16px', marginTop: '8px' }}>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  color: '#333',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Compartir */}
      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
        size="lg"
        style={{ zIndex: 10001 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>🎨 {t('shareArt')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {copied && (
            <Alert variant="success" className="py-2" dismissible onClose={() => setCopied(false)}>
              ✅ {t('linkCopied')}
            </Alert>
          )}

          <h6 className="mb-3">{t('shareOnSocial')}</h6>
          <div className="d-flex justify-content-around flex-wrap mb-4">
            <FacebookShareButton url={shareUrl} quote={shareTitle} className="mx-2 my-2">
              <FacebookIcon size={45} round />
              <div className="small mt-1 text-center">Facebook</div>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
              <TwitterIcon size={45} round />
              <div className="small mt-1 text-center">Twitter</div>
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
              <WhatsappIcon size={45} round />
              <div className="small mt-1 text-center">WhatsApp</div>
            </WhatsappShareButton>

            {imageUrl && (
              <PinterestShareButton
                url={shareUrl}
                media={imageUrl}
                description={shareTitle}
                className="mx-2 my-2"
              >
                <PinterestIcon size={45} round />
                <div className="small mt-1 text-center">Pinterest</div>
              </PinterestShareButton>
            )}

            <TelegramShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
              <TelegramIcon size={45} round />
              <div className="small mt-1 text-center">Telegram</div>
            </TelegramShareButton>

            <EmailShareButton url={shareUrl} subject={t('artwork')} body={shareTitle} className="mx-2 my-2">
              <EmailIcon size={45} round />
              <div className="small mt-1 text-center">Email</div>
            </EmailShareButton>
          </div>

          <h6 className="mb-3">{t('manualShare')}</h6>
          <Form.Group className="mb-3">
            <Form.Label>{t('shareText')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={shareTitle}
              readOnly
              className="mb-2"
            />
            <CopyToClipboard
              text={shareTitle}
              onCopy={() => handleCopy(t('textCopied'))}
            >
              <Button variant="outline-primary" size="sm">
                📋 {t('copyText')}
              </Button>
            </CopyToClipboard>
          </Form.Group>

          <Form.Group>
            <Form.Label>{t('postLink')}</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                value={shareUrl}
                readOnly
              />
              <CopyToClipboard
                text={shareUrl}
                onCopy={() => handleCopy(t('linkCopied'))}
              >
                <Button variant="outline-secondary" type="button">
                  📋
                </Button>
              </CopyToClipboard>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShareModal(false)}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Reporte */}
      <Modal 
        show={showReportModal} 
        onHide={() => setShowReportModal(false)} 
        centered
        style={{ zIndex: 10001 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('reportPublication')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="reportReason">
            <Form.Label>{t('reportReason')}</Form.Label>
            <Form.Select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">{t('selectReason')}</option>
              <option value="abuse">{t('harassmentOrAbuse')}</option>
              <option value="spam">{t('spam')}</option>
              <option value="terms">{t('termsViolation')}</option>
              <option value="offensive">{t('offensiveContent')}</option>
              <option value="fraud">{t('fraudOrScam')}</option>
              <option value="impersonation">{t('identityTheft')}</option>
              <option value="inappropriate">{t('inappropriateContent')}</option>
              <option value="privacy">{t('privacyViolation')}</option>
              <option value="disruption">{t('serviceDisruption')}</option>
              <option value="suspicious">{t('suspiciousActivity')}</option>
              <option value="other">{t('other')}</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowReportModal(false);
              setReportReason('');
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            disabled={!reportReason}
            onClick={handleSubmitReport}
          >
            {t('submitReport')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Estilos CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default React.memo(OptionsModal);