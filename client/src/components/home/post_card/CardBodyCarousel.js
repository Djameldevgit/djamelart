// components/home/post_card/CardBodyCarousel.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost, deletePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';

// Importar componentes modales separados
import ShareModal from './ShareModal';
import OptionsModal from './OptionsModal';
import ReportModal from './ReportModal';
import ImageOverlay from './ImageOverlay';
import CommentsModal from './CommentsModal'; // ✅ Nuevo modal separado

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { createReport } from '../../../redux/actions/reportUserAction';

// Importar los modales de autenticación
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
  const [showCommentsModal, setShowCommentsModal] = useState(false); // ✅ Estado para el modal separado

  // Estados locales que deben resetearse cuando cambia el post
  const [showInfo, setShowInfo] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const { t, i18n } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();

  const dispatch = useDispatch();

  const location = useLocation();
  const isPostDetailPage = location.pathname === `/post/${post._id}`; // ✅ Ya tienes esto
  const optionsModalRef = useRef(null);
  const cardRef = useRef(null);

  // Resetear estados cuando cambia el post
  useEffect(() => {
    setShowInfo(false);
    setIsTouching(false);
    setShowOptionsModal(false);
    setShowShareModal(false);
    setShowReportModal(false);
    setShowCommentsModal(false); // ✅ Resetear modal de comentarios también
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

  // ========== LÓGICA DE GUARDADO ==========

  // Actualizar estado de guardado
  useEffect(() => {
    if (auth.user?.saved) {
      setSaved(auth.user.saved.includes(post._id));
    } else {
      setSaved(false);
    }
  }, [auth.user?.saved, post._id]);

  // Handler para guardar post
  const handleSavePost = useCallback(async () => {
    if (!canProceed() || saveLoad) return;

    setSaveLoad(true);
    try {
      await dispatch(savePost({ post, auth }));
    } finally {
      setSaveLoad(false);
    }
  }, [canProceed, saveLoad, dispatch, post, auth]);

  // Handler para desguardar post
  const handleUnSavePost = useCallback(async () => {
    if (!canProceed() || saveLoad) return;

    setSaveLoad(true);
    try {
      await dispatch(unSavePost({ post, auth }));
    } finally {
      setSaveLoad(false);
    }
  }, [canProceed, saveLoad, dispatch, post, auth]);

  const handleSaveToggle = useCallback(async () => {
    if (saved) {
      await handleUnSavePost();
    } else {
      await handleSavePost();
    }
  }, [saved, handleSavePost, handleUnSavePost]);

  // ✅ FUNCIÓN MEJORADA: handleCommentClick
  const handleCommentClick = useCallback(() => {
    if (!canProceed()) return;

    const currentPath = window.location.pathname;
    const isOnPostDetail = currentPath === `/post/${post._id}`;

    console.log("📍 Comment Click - Path:", currentPath, "Is Detail:", isOnPostDetail);

    if (isOnPostDetail) {
      // Si YA estás en el detalle, scroll a comentarios en la página
      const commentsSection = document.getElementById('comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Si estás en el HOME, mostrar modal DIRECTAMENTE
      setShowCommentsModal(true);
    }
  }, [canProceed, post._id]);

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

  const handleBuyProduct = useCallback(async () => {
    if (!canProceed() || buyLoad) return;

    setBuyLoad(true);
    try {
      if (inCart) {
        setInCart(false);
        setShowBuyMessage(true);
        setTimeout(() => setShowBuyMessage(false), 3000);
      } else {
        await dispatch(buyProduct({ post, auth }));
        setInCart(true);
        setShowBuyMessage(true);
        setTimeout(() => setShowBuyMessage(false), 3000);
        await dispatch(loadCart(auth.token));
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('purchaseError') }
      });
    } finally {
      setBuyLoad(false);
    }
  }, [canProceed, buyLoad, inCart, dispatch, post, auth, t]);

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
            {!isPostDetailPage && (
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
                  {formatDate(post.createdAt)}
                </div>
              </div>
            )}
            {/* Modal de opciones usando el componente separado */}
            <OptionsModal
              show={showOptionsModal}
              onClose={() => setShowOptionsModal(false)}
              innerRef={optionsModalRef}
              isAdmin={isAdmin}
              isPostOwner={isPostOwner}
              saved={saved}
              saveLoad={saveLoad}
              t={t}
              onOptionClick={handleOptionClick}
              onAprove={handleAprove}
              onChatWithAdmin={handleChatWithAdmin}
            />

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
              {/* ImageOverlay usando el componente separado */}
           
              <ImageOverlay
                showInfo={showInfo}
                post={post}
                t={t}
                formatDate={formatDate}
                isLike={isLike}
                loadLike={loadLike}
                saved={saved}
                saveLoad={saveLoad}
                inCart={inCart}
                buyLoad={buyLoad}
                onLike={handleLike}
                onSaveToggle={handleSaveToggle}
                onShare={handleShare}
                onViewDetails={() => history.push(`/post/${post._id}`)}
                onBuyProduct={handleBuyProduct}
                onCommentClick={handleCommentClick}
                isPostDetailPage={isPostDetailPage} // ✅ Pasar esta prop al ImageOverlay
              />
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
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  animation: "pulse 2s infinite",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span className="material-icons" style={{ fontSize: "16px" }}>
                    info
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

      {/* ✅ CommentsModal separado */}
      <CommentsModal
        show={showCommentsModal}
        onHide={() => setShowCommentsModal(false)}
        post={post}
        t={t}
      />

      {/* Modal para Compartir */}
      <ShareModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        post={post}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        imageUrl={imageUrl}
      />

      {/* Modal de Reporte */}
      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        reportReason={reportReason}
        setReportReason={setReportReason}
        onSubmitReport={handleSubmitReport}
        t={t}
      />

      {/* Mensaje de compra */}
      {showBuyMessage && (
        <div className="buy-message" style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          backgroundColor: inCart ? "#4CAF50" : "#F44336", color: "white", padding: "12px 24px",
          borderRadius: "8px", zIndex: 9999, display: "flex", alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", fontSize: "14px", fontWeight: "500"
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