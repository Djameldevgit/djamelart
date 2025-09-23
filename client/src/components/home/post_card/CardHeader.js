import React, { useState } from 'react';
import { Card, Dropdown, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Avatar from '../../Avatar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// React Share imports
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon
} from 'react-share';

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { deletePost } from '../../../redux/actions/postAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { createReport } from '../../../redux/actions/reportUserAction';
import FollowBtn from '../../FollowBtn';

// ✅ Importar los modales
import AuthModal from '../../authAndVerify/AuthModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';

const CardHeader = ({ post }) => {
  const { auth, homeUsers, socket, languageReducer, profile } = useSelector((state) => state);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [copied, setCopied] = useState(false);

  // ✅ Estados para los modales de verificación
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n } = useTranslation('cardheader');

  // ✅ Función canProceed
  const canProceed = () => {
    if (!auth.token || !auth.user) {
      setShowAuthModal(true);
      return false;
    }

    if (!auth.user.isVerified) {
      setShowVerifyModal(true);
      return false;
    }

    if (auth.user.isActive === false) {
      setShowDeactivatedModal(true);
      return false;
    }

    return true;
  };

  const findCompleteUser = () => {
    const completeUser = profile.users.find(u => u._id === post.user._id);
    return completeUser || post.user;
  };

  const user = findCompleteUser();
  const lang = languageReducer.language || 'es';
  if (i18n.language !== lang) i18n.changeLanguage(lang);

  // URL y texto para compartir
  const shareUrl = `${window.location.origin}/post/${post._id}`;
  const shareTitle = `🎨 Obra de arte por ${post.user.username}: "${post.content?.substring(0, 80)}..." - Mira más en Tassili Art`;

  // Texto específico para TikTok/Instagram
  const socialMediaText = `🎨 ¡Mira esta obra de arte en Tassili Art! 
Por: ${post.user.username}
"${post.content?.substring(0, 100)}..."
👉 ${shareUrl}

#Arte #TassiliArt #${post.user.username.replace(/\s/g, '')}`;

  // Para Pinterest
  const imageUrl = post.images?.[0]?.url || post.user.avatar;

  const handleAprove = () => {
    if (window.confirm(t('confirmApprove'))) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
    }
  };

  // Buscar el primer usuario que tenga role === "admin"
  const adminUser = homeUsers.users.find(user => user.role === "admin");

  const handleChatWithAdmin = () => {
    // ✅ Verificar si puede proceder antes de chatear con admin
    if (!canProceed()) return;

    if (!adminUser) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('noAdminAvailable') }
      });
    }
    handleAddUser(adminUser);
  };

  const handleEditPost = () => {
    // ✅ Verificar si puede proceder antes de editar
    if (!canProceed()) return;
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    // ✅ Verificar si puede proceder antes de eliminar
    if (!canProceed()) return;

    if (window.confirm(t('confirmDelete'))) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/");
    }
  };

  const handleSubmitReport = () => {
    // ✅ Verificar si puede proceder antes de reportar
    if (!canProceed()) return;

    if (!reportReason.trim()) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('reportRequired') }
      });
    }

    const reportData = {
      postId: post._id,
      userId: post.user._id,
      reason: reportReason,
    };

    dispatch(createReport({ auth, reportData }));
    setShowReportModal(false);
    setReportReason('');
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: t('reportSubmitted') }
    });
  };

  const handleAddUser = (user) => {
    // ✅ Verificar si puede proceder antes de agregar usuario
    if (!canProceed()) return;

    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    return history.push(`/message/${user._id}`);
  };

  // ✅ Función para manejar compartir (no requiere verificación)
  const handleShare = () => {
    setShowShareModal(true);
  };

  // ✅ Función para manejar contacto con vendedor
  const handleContactSeller = () => {
    if (!canProceed()) return;
    handleAddUser(post.user);
  };

  return (
    <Card.Header className="d-flex justify-content-between align-items-center p-3">
      <div className='mt-0' >

      </div>


      {auth.user && (
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-actions" className="p-0 border-0">
            <span className="material-icons">more_horiz</span>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" style={{
            direction: lang === 'ar' ? 'rtl' : 'ltr',
            textAlign: lang === 'ar' ? 'right' : 'left',
          }}>
            {auth.user.role === 'admin' && (
              <>
                <Dropdown.Item onClick={handleAprove}>
                  ✅ {t('approve')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleEditPost}>
                  ✏️ {t('edit')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  🗑️ {t('delete')}
                </Dropdown.Item>
              </>
            )}

            {auth.user._id === post.user._id && (
              <>
                <Dropdown.Item onClick={handleEditPost}>
                  ✏️ {t('edit')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  🗑️ {t('delete')}
                </Dropdown.Item>
              </>
            )}

            <Dropdown.Item onClick={handleContactSeller} style={{
              direction: lang === 'ar' ? 'rtl' : 'ltr',
              textAlign: lang === 'ar' ? 'right' : 'left',
            }}>
              💬 {t('contactSeller')}
            </Dropdown.Item>

            <Dropdown.Item
              onClick={handleChatWithAdmin}
              style={{
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: lang === 'ar' ? 'right' : 'left',
              }}
            >
              🛡️ {t('contactAdmin')}
            </Dropdown.Item>

            {auth.user._id !== user._id && (
              <Dropdown.Item
                as="div"
                className="p-2"
                style={{ cursor: 'default' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">👤</span>
                  <FollowBtn user={user} />
                </div>
              </Dropdown.Item>
            )}

            {/* ✅ Compartir no requiere verificación */}
            <Dropdown.Item onClick={handleShare}>
              📤 {t('share')}
            </Dropdown.Item>

            <Dropdown.Item onClick={() => {
              // ✅ Verificar antes de abrir modal de reporte
              if (!canProceed()) return;
              setShowReportModal(true);
            }}>
              🚩 {t('report')}
            </Dropdown.Item>

            <Dropdown.Item>
              🔖 {t('save')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* Modal para Compartir */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎨 {t('shareArt')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {copied && (
            <Alert variant="success" className="py-2">
              ✅ {t('copiedToClipboard')}
            </Alert>
          )}

          <h6 className="mb-3">{t('shareOnSocial')}</h6>
          <div className="d-flex justify-content-around flex-wrap mb-4">
            <FacebookShareButton url={shareUrl} quote={shareTitle} className="mx-2 my-2">
              <FacebookIcon size={45} round />
              <div className="small mt-1">Facebook</div>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
              <TwitterIcon size={45} round />
              <div className="small mt-1">Twitter</div>
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
              <WhatsappIcon size={45} round />
              <div className="small mt-1">WhatsApp</div>
            </WhatsappShareButton>

            {imageUrl && (
              <PinterestShareButton
                url={shareUrl}
                media={imageUrl}
                description={shareTitle}
                className="mx-2 my-2"
              >
                <PinterestIcon size={45} round />
                <div className="small mt-1">Pinterest</div>
              </PinterestShareButton>
            )}

            <CopyToClipboard
              text={socialMediaText}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                dispatch({
                  type: GLOBALTYPES.ALERT,
                  payload: { success: t('copiedForTikTok') }
                });
              }}
            >
              <div className="mx-2 my-2 text-center" style={{ cursor: 'pointer' }}>
                <div style={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>TK</span>
                </div>
                <div className="small mt-1">TikTok</div>
              </div>
            </CopyToClipboard>

            <CopyToClipboard
              text={socialMediaText}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                dispatch({
                  type: GLOBALTYPES.ALERT,
                  payload: { success: t('copiedForInstagram') }
                });
              }}
            >
              <div className="mx-2 my-2 text-center" style={{ cursor: 'pointer' }}>
                <div style={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>IG</span>
                </div>
                <div className="small mt-1">Instagram</div>
              </div>
            </CopyToClipboard>

            <TelegramShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
              <TelegramIcon size={45} round />
              <div className="small mt-1">Telegram</div>
            </TelegramShareButton>

            <EmailShareButton url={shareUrl} subject={t('artWork')} body={shareTitle} className="mx-2 my-2">
              <EmailIcon size={45} round />
              <div className="small mt-1">Email</div>
            </EmailShareButton>
          </div>

          <h6 className="mb-3">{t('manualShare')}</h6>
          <Form.Group>
            <Form.Label>{t('copyTextForSocial')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={socialMediaText}
              readOnly
              style={{
                direction: 'ltr',
                textAlign: 'left',
                fontSize: '14px'
              }}
              className="mb-2"
            />
            <CopyToClipboard
              text={socialMediaText}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                dispatch({
                  type: GLOBALTYPES.ALERT,
                  payload: { success: t('textCopied') }
                });
              }}
            >
              <button className="btn btn-outline-primary btn-sm">
                📋 {t('copyText')}
              </button>
            </CopyToClipboard>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>{t('copyLink')}</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                value={shareUrl}
                readOnly
                style={{
                  direction: 'ltr',
                  textAlign: 'left',
                  fontSize: '14px'
                }}
              />
              <CopyToClipboard
                text={shareUrl}
                onCopy={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { success: t('linkCopied') }
                  });
                }}
              >
                <button className="btn btn-outline-secondary" type="button">
                  📋
                </button>
              </CopyToClipboard>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowShareModal(false)}>
            {t('close')}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Reporte */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('reportTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="reportReason">
            <Form.Label>{t('reportLabel')}</Form.Label>
            <Form.Control
              as="select"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: lang === 'ar' ? 'right' : 'left',
              }}
            >
              <option value="">{t('selectReason')}</option>
              <option value="abuse">{t('reasons.abuse')}</option>
              <option value="spam">{t('reasons.spam')}</option>
              <option value="terms">{t('reasons.terms')}</option>
              <option value="offensive">{t('reasons.offensive')}</option>
              <option value="fraud">{t('reasons.fraud')}</option>
              <option value="impersonation">{t('reasons.impersonation')}</option>
              <option value="inappropriate">{t('reasons.inappropriate')}</option>
              <option value="privacy">{t('reasons.privacy')}</option>
              <option value="disruption">{t('reasons.disruption')}</option>
              <option value="suspicious">{t('reasons.suspicious')}</option>
              <option value="other">{t('reasons.other')}</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowReportModal(false);
              setReportReason('');
            }}
          >
            {t('cancel')}
          </button>
          <button
            className="btn btn-danger"
            disabled={!reportReason}
            onClick={handleSubmitReport}
          >
            {t('submitReport')}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Agregar los modales de verificación */}
      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <VerifyModal
        show={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />
      <DesactivateModal
        show={showDeactivatedModal}
        onClose={() => setShowDeactivatedModal(false)}
      />
    </Card.Header>
  );
};

export default CardHeader;