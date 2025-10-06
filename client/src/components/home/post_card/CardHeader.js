import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Avatar from '../../Avatar';

// Importar los modales personalizados
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';

// Importar los modales de autenticación
import AuthModal from '../../authAndVerify/AuthModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { deletePost } from '../../../redux/actions/postAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import FollowBtn from '../../FollowBtn';

const CardHeader = ({ post }) => {
  const { auth, homeUsers, socket, languageReducer, profile } = useSelector((state) => state);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Estados para los modales de verificación
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n } = useTranslation('cardheader');
  const optionsRef = useRef(null);

  const lang = languageReducer.language || 'es';
  if (i18n.language !== lang) i18n.changeLanguage(lang);

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptionsModal(false);
      }
    };

    if (showOptionsModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptionsModal]);

  // Función canProceed
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
    const completeUser = profile.users?.find(u => u._id === post.user._id);
    return completeUser || post.user;
  };

  const user = findCompleteUser();
  const adminUser = homeUsers.users?.find(user => user.role === "admin");
  const isPostOwner = auth.user && post.user && auth.user._id === post.user._id;
  const isAdmin = auth.user && auth.user.role === "admin";

  // Handlers
  const handleAprove = () => {
    if (window.confirm(t('confirmApprove'))) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
    }
  };

  const handleChatWithAdmin = () => {
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
    if (!canProceed()) return;
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
    setShowOptionsModal(false);
  };

  const handleDeletePost = () => {
    if (!canProceed()) return;
    if (window.confirm(t('confirmDelete'))) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/");
    }
  };

  const handleSubmitReport = (reason) => {
    if (!canProceed()) return;
    const reportData = {
      postId: post._id,
      userId: post.user._id,
      reason: reason,
    };
    dispatch(createReport({ auth, reportData }));
    setShowReportModal(false);
    setShowOptionsModal(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: t('reportSubmitted') }
    });
  };

  const handleAddUser = (user) => {
    if (!canProceed()) return;
    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    history.push(`/message/${user._id}`);
  };

  const handleShare = () => {
    setShowShareModal(true);
    setShowOptionsModal(false);
  };

  const handleContactSeller = () => {
    if (!canProceed()) return;
    handleAddUser(post.user);
    setShowOptionsModal(false);
  };

 

  return (
    <>
      {/* Header Principal */}
      

      {/* Modal de Opciones - Estilo Bottom Sheet para móvil */}
      {showOptionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={() => setShowOptionsModal(false)}
        >
          <div
            ref={optionsRef}
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '500px',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
              boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle visual */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '12px 0 8px'
            }}>
              <div style={{
                width: '40px',
                height: '4px',
                backgroundColor: '#dbdbdb',
                borderRadius: '2px'
              }} />
            </div>

            {/* Opciones */}
            <div style={{ paddingBottom: '8px' }}>
              {/* Admin Options */}
              {isAdmin && (
                <button
                  onClick={handleAprove}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '15px',
                    color: '#262626',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="material-icons" style={{ fontSize: '20px', color: '#0095f6' }}>
                    check_circle
                  </span>
                  <span>{t('approve')}</span>
                </button>
              )}

              {/* Owner/Admin Edit & Delete */}
              {(isPostOwner || isAdmin) && (
                <>
                  <button
                    onClick={handleEditPost}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '15px',
                      color: '#262626',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span className="material-icons" style={{ fontSize: '20px' }}>edit</span>
                    <span>{t('edit')}</span>
                  </button>

                  <button
                    onClick={handleDeletePost}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '15px',
                      color: '#ed4956',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span className="material-icons" style={{ fontSize: '20px' }}>delete</span>
                    <span>{t('delete')}</span>
                  </button>

                  <div style={{
                    height: '1px',
                    backgroundColor: '#efefef',
                    margin: '8px 0'
                  }} />
                </>
              )}

              {/* Follow Button */}
              {auth.user._id !== user._id && (
                <>
                  <div style={{
                    padding: '8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span className="material-icons" style={{ fontSize: '20px', color: '#8e8e8e' }}>
                      person_add
                    </span>
                    <FollowBtn user={user} />
                  </div>
                  <div style={{
                    height: '1px',
                    backgroundColor: '#efefef',
                    margin: '8px 0'
                  }} />
                </>
              )}

              {/* Common Options */}
              <button
                onClick={handleContactSeller}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  color: '#262626',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>chat</span>
                <span>{t('contactSeller')}</span>
              </button>

              <button
                onClick={handleChatWithAdmin}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  color: '#262626',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                <span>{t('contactAdmin')}</span>
              </button>

              <button
                onClick={handleShare}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  color: '#262626',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>share</span>
                <span>{t('share')}</span>
              </button>

              {!isPostOwner && (
                <button
                  onClick={() => {
                    if (!canProceed()) return;
                    setShowReportModal(true);
                    setShowOptionsModal(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '15px',
                    color: '#ed4956',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="material-icons" style={{ fontSize: '20px' }}>flag</span>
                  <span>{t('report')}</span>
                </button>
              )}

              {/* Botón Cancelar */}
              <div style={{ padding: '8px 16px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowOptionsModal(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #dbdbdb',
                    background: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#262626',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
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

          /* Estilos para avatares */
          .medium-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
          }

          /* Optimización para pantallas pequeñas */
          @media (max-width: 480px) {
            .medium-avatar {
              width: 32px;
              height: 32px;
            }
          }
        `}
      </style>

      {/* Modales */}
      <ShareModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        post={post}
        t={t}
      />

      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
        t={t}
        initialReason=""
      />

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
    </>
  );
};

export default CardHeader;