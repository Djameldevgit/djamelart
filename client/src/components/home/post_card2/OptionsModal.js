import React, { useState, useRef, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
  TelegramIcon,
  EmailIcon
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
  // ✅ Nuevas props recibidas
  handleAprove,
  handleEditPost,
  handleDeletePost,
  handleShare,
  handleSavePostAction,
  handleSubmitReport
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef(null);

  // URL de compartir
  const shareUrl = `${window.location.origin}/post/${post?._id}`;
  const shareTitle = `${t('artworkBy')} ${post?.user?.username || t('artist')}: "${post?.content?.substring(0, 80)}..." - ${t('seeMoreAt')} Tassili Art`;
  const imageUrl = post?.images?.[0]?.url || post?.user?.avatar;
  const adminUser = homeUsers?.users?.find(user => user.role === 'admin');

  // ✅ CONTACTAR VENDEDOR
  const handleContactSeller = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!canProceed()) return;
      if (!post?.user) return;

      try {
        // Agregar conversación (mensaje) con el artista
        await dispatch(addUser({ user: post.user, auth, socket }));
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: t('chatStartedWithArtist') }
        });
        onClose();
      } catch (err) {
        console.error('Error handleContactSeller:', err);
      }
    },
    [dispatch, post, auth, socket, canProceed, onClose, t]
  );

  // ✅ CHAT CON ADMIN
  const handleChatWithAdmin = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!canProceed()) return;
      if (!adminUser) {
        return dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: t('noAdminAvailable') }
        });
      }

      try {
        await dispatch(addUser({ user: adminUser, auth, socket }));
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: t('chatStartedWithAdmin') }
        });
        onClose();
      } catch (err) {
        console.error('Error handleChatWithAdmin:', err);
      }
    },
    [dispatch, adminUser, auth, socket, canProceed, onClose, t]
  );

  // ✅ ENVIAR REPORTE (usando la prop del padre)
  const handleSubmitReportInternal = useCallback(() => {
    if (!canProceed()) return;
    if (!reportReason.trim()) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('pleaseSelectReason') }
      });
    }

    handleSubmitReport(reportReason); // ✅ Usar la prop del padre
    setShowReportModal(false);
    setReportReason('');
    onClose();
  }, [reportReason, canProceed, handleSubmitReport, onClose, t, dispatch]);

  // ✅ COMPARTIR INTERNO
  const handleInternalShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  // ✅ CERRAR MODALES INTERNOS
  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  const handleCloseReportModal = useCallback(() => {
    setShowReportModal(false);
    setReportReason('');
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Fondo oscuro */}
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
        onClick={(e) => {
          if (e.target === backdropRef.current) onClose();
        }}
      >
        <div
          style={{
            background: 'white',
            width: '100%',
            maxWidth: '500px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '20px 0',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* ✅ APROBAR (Admin) */}
            {isAdmin && (
              <button onClick={handleAprove} className="option-btn">
                <span className="material-icons">check_circle</span>
                {t('approvePublication')}
              </button>
            )}

            {/* ✅ EDITAR Y ELIMINAR (Propietario o Admin) */}
            {(isPostOwner || isAdmin) && (
              <>
                <button onClick={handleEditPost} className="option-btn">
                  <span className="material-icons">edit</span>
                  {t('editPublication')}
                </button>
                <button onClick={handleDeletePost} className="option-btn danger">
                  <span className="material-icons">delete</span>
                  {t('deletePublication')}
                </button>
              </>
            )}

            {/* ✅ CONTACTAR ARTISTA */}
            <button onClick={handleContactSeller} className="option-btn">
              <span className="material-icons">chat</span>
              {t('contactArtist')}
            </button>

            {/* ✅ COMPARTIR */}
            <button onClick={handleInternalShare} className="option-btn">
              <span className="material-icons">share</span>
              {t('sharePublication')}
            </button>

            {/* ✅ GUARDAR POST */}
            <button onClick={handleSavePostAction} className="option-btn">
              <span className="material-icons">
                {saved ? 'bookmark' : 'bookmark_border'}
              </span>
              {saved ? t('saved') : t('savePublication')}
            </button>

            {/* ✅ CONTACTAR ADMIN */}
            <button onClick={handleChatWithAdmin} className="option-btn">
              <span className="material-icons">admin_panel_settings</span>
              {t('contactAdmin')}
            </button>

            {/* ✅ REPORTAR (Solo si no es el propietario) */}
            {!isPostOwner && (
              <button onClick={() => setShowReportModal(true)} className="option-btn danger">
                <span className="material-icons">flag</span>
                {t('reportPublication')}
              </button>
            )}

            {/* ✅ CANCELAR */}
            <div style={{ padding: '8px 16px', marginTop: '8px' }}>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  width: '100%',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal Compartir */}
      <Modal show={showShareModal} onHide={handleCloseShareModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎨 {t('shareArt')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around flex-wrap mb-4">
            <FacebookShareButton url={shareUrl} quote={shareTitle}><FacebookIcon size={45} round /></FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}><TwitterIcon size={45} round /></TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle}><WhatsappIcon size={45} round /></WhatsappShareButton>
            {imageUrl && <PinterestShareButton url={shareUrl} media={imageUrl} description={shareTitle}><PinterestIcon size={45} round /></PinterestShareButton>}
            <TelegramShareButton url={shareUrl} title={shareTitle}><TelegramIcon size={45} round /></TelegramShareButton>
            <EmailShareButton url={shareUrl} subject={t('artwork')} body={shareTitle}><EmailIcon size={45} round /></EmailShareButton>
          </div>
        </Modal.Body>
      </Modal>

      {/* ✅ Modal Reporte */}
      <Modal show={showReportModal} onHide={handleCloseReportModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('reportPublication')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="reportReason">
            <Form.Label>{t('reportReason')}</Form.Label>
            <Form.Select value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
              <option value="">{t('selectReason')}</option>
              <option value="abuse">{t('harassmentOrAbuse')}</option>
              <option value="spam">{t('spam')}</option>
              <option value="terms">{t('termsViolation')}</option>
              <option value="offensive">{t('offensiveContent')}</option>
              <option value="fraud">{t('fraudOrScam')}</option>
              <option value="other">{t('other')}</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReportModal}>
            {t('cancel')}
          </Button>
          <Button variant="danger" disabled={!reportReason} onClick={handleSubmitReportInternal}>
            {t('submitReport')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Animaciones */}
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .option-btn {
            background: none;
            border: none;
            padding: 16px 24px;
            text-align: left;
            font-size: 16px;
            color: #333;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background-color 0.2s ease;
            width: 100%;
          }
          .option-btn:hover { background-color: rgba(0,0,0,0.03); }
          .option-btn.danger { color: #e74c3c; }
          .option-btn.danger:hover { background-color: rgba(231,76,60,0.05); }
        `}
      </style>
    </>
  );
};

export default React.memo(OptionsModal);