import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Form, Alert, Button } from 'react-bootstrap';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost, deletePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import moment from 'moment';
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
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { createReport } from '../../../redux/actions/reportUserAction';

// Importar los modales
import AuthModal from '../../authAndVerify/AuthModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';

const CardBodyCarousel = ({ post }) => {
  const { languageReducer, auth, socket, homeUsers, profile } = useSelector((state) => state);
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [buyLoad, setBuyLoad] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showBuyMessage, setShowBuyMessage] = useState(false);

  // Estados para modales
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [copied, setCopied] = useState(false);

  // Estados locales que deben resetearse cuando cambia el post
  const [showInfo, setShowInfo] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const { t, i18n } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();

  // Refs para manejar clicks fuera
  const optionsModalRef = useRef(null);
  const cardRef = useRef(null);

  // Resetear estados cuando cambia el post
  useEffect(() => {
    setShowInfo(false);
    setIsTouching(false);
    setShowOptionsModal(false);
    setShowShareModal(false);
    setShowReportModal(false);
  }, [post._id]);

  // Cerrar modal de opciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsModalRef.current && !optionsModalRef.current.contains(event.target)) {
        setShowOptionsModal(false);
      }
    };

    if (showOptionsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsModal]);

  // Función canProceed unificada
  const canProceed = useCallback(() => {
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
  }, [auth]);

  // Handlers para mostrar/ocultar información
  const handleImageClick = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    setTimeout(() => setShowInfo(prev => !prev), 100);
  }, []);

  // URL y texto para compartir
  const shareUrl = `${window.location.origin}/post/${post._id}`;
  const shareTitle = `${t('artworkBy')} ${post.user?.username || t('artist')}: "${post.content?.substring(0, 80)}..." - ${t('seeMoreAt')} Tassili Art`;
  const imageUrl = post.images?.[0]?.url || post.user?.avatar;

  // Encontrar usuario completo
  const findCompleteUser = useCallback(() => {
    const completeUser = profile.users?.find(u => u._id === post.user?._id);
    return completeUser || post.user;
  }, [post.user, profile.users]);

  const user = findCompleteUser();

  // Verificar si el usuario actual es el dueño del post o es admin
  const isPostOwner = auth.user && post.user && auth.user._id === post.user._id;
  const isAdmin = auth.user && auth.user.role === "admin";

  // ========== FUNCIONES DEL COMPONENTE CARDHEADER ==========

  const handleAprove = useCallback(() => {
    if (window.confirm(t('confirmApprove'))) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
    }
  }, [post, auth, dispatch, history, t]);

  const adminUser = homeUsers.users?.find(user => user.role === "admin");

  const handleChatWithAdmin = useCallback(() => {
    if (!canProceed()) return;

    if (!adminUser) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('noAdminAvailable') }
      });
    }
    handleAddUser(adminUser);
  }, [canProceed, adminUser, dispatch, t]);

  const handleEditPost = useCallback(() => {
    if (!canProceed()) return;
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
    setShowOptionsModal(false);
  }, [canProceed, post, dispatch]);

  const handleDeletePost = useCallback(() => {
    if (!canProceed()) return;

    if (window.confirm(t('confirmDelete'))) {
      dispatch(deletePost({ post, auth, socket }));
      setShowOptionsModal(false);
    }
  }, [canProceed, post, auth, socket, dispatch, t]);

  const handleSubmitReport = useCallback(() => {
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
    setShowOptionsModal(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: t('reportSubmitted') }
    });
  }, [canProceed, reportReason, post, auth, dispatch, t]);

  const handleAddUser = useCallback((user) => {
    if (!canProceed()) return;

    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    history.push(`/message/${user._id}`);
  }, [canProceed, dispatch, history]);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
    setShowOptionsModal(false);
  }, []);

  const handleContactSeller = useCallback(() => {
    if (!canProceed()) return;
    handleAddUser(post.user);
    setShowOptionsModal(false);
  }, [canProceed, post.user, handleAddUser]);

  const handleCopy = useCallback((message) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: message }
    });
  }, [dispatch]);

  const handleSavePostAction = useCallback(async () => {
    if (!canProceed() || saveLoad) return;

    if (saved) {
      setSaveLoad(true);
      await dispatch(unSavePost({ post, auth }));
      setSaveLoad(false);
    } else {
      setSaveLoad(true);
      await dispatch(savePost({ post, auth }));
      setSaveLoad(false);
    }
    setShowOptionsModal(false);
  }, [canProceed, saveLoad, saved, dispatch, post, auth]);

  // ========== FUNCIONES ORIGINALES DEL COMPONENTE ==========

  useEffect(() => {
    if (auth.token) dispatch(loadCart(auth.token));
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (auth.user && post.likes?.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.user]);

  useEffect(() => {
    if (auth.user?.saved?.includes(post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post._id]);

  useEffect(() => {
    const cartItems = auth.user?.cart?.items || [];
    setInCart(cartItems.some(item => item.postId === post._id));
  }, [auth.user?.cart, post._id]);

  const handleLike = useCallback(async () => {
    if (!canProceed() || loadLike) return;

    if (isLike) {
      setLoadLike(true);
      await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
      setLoadLike(false);
    } else {
      setLoadLike(true);
      await dispatch(likePost({ post, auth, socket, t, languageReducer }));
      setLoadLike(false);
    }
  }, [canProceed, loadLike, isLike, dispatch, post, auth, socket, t, languageReducer]);

  const handleSavePost = useCallback(async () => {
    if (!canProceed() || saveLoad) return;

    if (saved) {
      setSaveLoad(true);
      await dispatch(unSavePost({ post, auth }));
      setSaveLoad(false);
    } else {
      setSaveLoad(true);
      await dispatch(savePost({ post, auth }));
      setSaveLoad(false);
    }
  }, [canProceed, saveLoad, saved, dispatch, post, auth]);

  const handleBuyProduct = useCallback(async () => {
    if (!canProceed() || buyLoad) return;
    setBuyLoad(true);
    try {
      await dispatch(buyProduct({ post, auth }));
      setInCart(prev => !prev);
      await dispatch(loadCart(auth.token));
      setShowBuyMessage(true);
      setTimeout(() => setShowBuyMessage(false), 3000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setBuyLoad(false);
    }
  }, [canProceed, buyLoad, dispatch, post, auth]);

  // Handler para las opciones del modal
  const handleOptionClick = useCallback((option) => {
    switch (option) {
      case 'edit':
        handleEditPost();
        break;
      case 'delete':
        handleDeletePost();
        break;
      case 'contact':
        handleContactSeller();
        break;
      case 'report':
        setShowReportModal(true);
        break;
      case 'share':
        handleShare();
        break;
      case 'save':
        handleSavePostAction();
        break;
      case 'follow':
        // La lógica de follow está en el botón FollowBtn
        break;
      default:
        break;
    }
  }, [handleEditPost, handleDeletePost, handleContactSeller, handleShare, handleSavePostAction]);

  const formatDate = useCallback((dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'ar' ? 'ar-AR' : 'en-US', options);
  }, [lang]);

  return (
    <div
      ref={cardRef}
      style={{
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: '#ffffff'
      }}
    >
      <div className="card_body">
        {post.images.length > 0 && (
          <>
            {/* Card Header - Separado sobre la imagen */}
            <div style={{
              background: "white",
              padding: "16px",
              borderBottom: "1px solid #e0e0e0",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {/* Primera fila: Avatar y botón Seguir */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  {/* Avatar del usuario */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: user?.avatar
                        ? `url(${user.avatar}) center/cover`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "2px solid #f0f0f0",
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`/profile/${user?._id}`);
                    }}
                  />

                  {/* Información del usuario */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "2px"
                    }}>
                      <span style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {user?.username || t('user')}
                      </span>

                      {user?.isVerified && (
                        <span className="material-icons" style={{
                          fontSize: "16px",
                          color: "#0095f6",
                          flexShrink: 0
                        }}>
                          verified
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "#666"
                    }}>
                      {user?.followers?.length || 0} {t('followers')}
                    </div>
                  </div>
                </div>

                {/* Contenedor de botones de la derecha */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>

                  {/* Icono de tres puntos */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsModal(true);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(0, 0, 0, 0.05)";
                      e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "none";
                      e.target.style.color = "#666";
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: "20px" }}>
                      more_vert
                    </span>
                  </button>
                </div>
              </div>

              {/* Segunda fila: Fecha de publicación */}
              <div style={{
                fontSize: "13px",
                color: "#888",
                paddingLeft: "56px"
              }}>
                {formatDate(post.createdAt)} • {moment(post.createdAt).fromNow()}
              </div>
            </div>

            {/* Modal de opciones - Animación desde el bottom */}
            {showOptionsModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                zIndex: 9999,
                animation: 'fadeIn 0.3s ease'
              }}>
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
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {/* Lista de opciones */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {/* Opciones para admin */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOptionClick('edit')}
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
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <span className="material-icons" style={{ color: '#666' }}>
                            check_circle
                          </span>
                          {t('approvePublication')}
                        </button>
                      </>
                    )}

                    {/* Opciones para el dueño del post o admin */}
                    {(isPostOwner || isAdmin) && (
                      <>
                        <button
                          onClick={() => handleOptionClick('edit')}
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
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <span className="material-icons" style={{ color: '#666' }}>
                            edit
                          </span>
                          {t('editPublication')}
                        </button>

                        <button
                          onClick={() => handleOptionClick('delete')}
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
                            transition: 'background-color 0.2s ease'
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
                      onClick={() => handleOptionClick('contact')}
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
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <span className="material-icons" style={{ color: '#666' }}>
                        chat
                      </span>
                      {t('contactArtist')}
                    </button>

                    <button
                      onClick={() => handleOptionClick('share')}
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
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <span className="material-icons" style={{ color: '#666' }}>
                        share
                      </span>
                      {t('sharePublication')}
                    </button>

                    <button
                      onClick={() => handleOptionClick('save')}
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
                        transition: 'background-color 0.2s ease'
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
                        transition: 'background-color 0.2s ease'
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
                        onClick={() => handleOptionClick('report')}
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
                          transition: 'background-color 0.2s ease'
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
                        onClick={() => setShowOptionsModal(false)}
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
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contenedor de la imagen con carousel */}
            <div
              className="carousel-container"
              style={{
                position: "relative",
                height: "100%",
                minHeight: "400px",
                maxHeight: "80vh",
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: "0 0 12px 12px",
                background: '#f8f9fa'
              }}
              onClick={handleImageClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Información del artista (ocultable con animación) */}
              <div style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                zIndex: 2,
                color: "white",
                background: showInfo
                  ? "linear-gradient(transparent 0%, rgba(0, 0, 0, 0.9) 30%, rgba(0, 0, 0, 0.95) 100%)"
                  : "transparent",
                padding: showInfo ? "20px 16px 16px 16px" : "0px 16px",
                backdropFilter: showInfo ? "blur(15px)" : "none",
                borderTop: showInfo ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
                height: showInfo ? "auto" : "0px",
                opacity: showInfo ? 1 : 0,
                transform: showInfo ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {post.user.username && (
                  <div style={{
                    fontSize: "clamp(16px, 2.5vh, 20px)",
                    opacity: showInfo ? 0.95 : 0,
                    lineHeight: "1.4",
                    fontWeight: "600",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease 0.1s'
                  }}>
                    {post.user.username}
                  </div>
                )}
                <div style={{
                    fontSize: "clamp(10px, 2vh, 20px)",
                    opacity: showInfo ? 0.95 : 0,
                    lineHeight: "1.4",
                    fontWeight: "400",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease 0.1s'
                  }} >
                  {post.title}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#888",
                  paddingLeft: "00px"
                }}>
                  <span className="material-icons" style={{
                    fontSize: "14px",
                    color: "#999"
                  }}>
                    schedule
                  </span>
                  <span>{formatDate(post.createdAt)} • {moment(post.createdAt).fromNow()}</span>
                </div>
                {post.content && (
                  <div style={{
                    fontSize: "clamp(14px, 2vh, 16px)",
                    opacity: showInfo ? 0.8 : 0,
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease 0.2s'
                  }}>
                    {post.content}
                  </div>
                )}

                {/* Estadísticas */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  opacity: showInfo ? 1 : 0,
                  transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.3s ease 0.3s'
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap"
                  }}>
                    {/* Like */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.1)",
                        transition: "all 0.2s ease"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{
                          fontSize: "18px",
                          color: isLike ? "#ff3040" : "white"
                        }}
                      >
                        {isLike ? "favorite" : "favorite_border"}
                      </span>
                      <span style={{
                        fontSize: "13px",
                        color: "white",
                        fontWeight: "500"
                      }}>
                        {post.likes?.length || 0}
                      </span>
                    </div>

                    {/* Comment */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.1)"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/post/${post._id}#comments`);
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: "18px" }}>
                        chat_bubble_outline
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "500" }}>
                        {post.comments?.length || 0}
                      </span>
                    </div>

                    {/* Share */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.1)"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: "18px" }}>
                        share
                      </span>
                    </div>
                  </div>

                  {/* Botón Más Detalles */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`/post/${post._id}`);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "clamp(11px, 1.5vh, 13px)",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)",
                      opacity: showInfo ? 1 : 0,
                      transform: showInfo ? 'translateX(0)' : 'translateX(10px)'
                    }}
                  >
                    <span>{t('details')}</span>
                    <span className="material-icons" style={{ fontSize: "16px" }}>
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Indicador visual cuando la información está oculta */}
              {!showInfo && (
                <div style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1,
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "15px",
                  fontSize: "11px",
                  fontWeight: "500",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  animation: "pulse 2s infinite",
                  cursor: "pointer"
                }}>
                  <span className="material-icons" style={{ fontSize: "14px", marginRight: "4px" }}>
                    touch_app
                  </span>
                  {t('tapToSeeInfo')}
                </div>
              )}

              {/* Carousel con fondo */}
              <div className="card" style={{
                height: "100%",
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="card__image" style={{ height: "100%", width: "100%" }}>
                  <Carousel images={post.images} id={post._id} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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
          
          @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
        `}
      </style>

      {/* Modal para Compartir */}
      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
        size="lg"
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
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
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

      {/* Mensaje de compra */}
      {showBuyMessage && (
        <div className="buy-message" style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          backgroundColor: inCart ? "#4CAF50" : "#F44336", color: "white", padding: "10px 20px",
          borderRadius: "5px", zIndex: 9999, display: "flex", alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}>
          <span className="material-icons" style={{ marginRight: "8px" }}>
            {inCart ? "check_circle" : "shopping_cart"}
          </span>
          {inCart
            ? t("productAddedToCart", { lng: lang })
            : t("thanksForPurchase", { lng: lang })}
        </div>
      )}

      {/* Modales de verificación */}
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
    </div>
  );
};

export default React.memo(CardBodyCarousel);