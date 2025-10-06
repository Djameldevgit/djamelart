import React, { useState, useEffect, useRef, useCallback } from 'react';
import { likePost, unLikePost, savePost, unSavePost, deletePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import moment from 'moment';

// Importar componentes
import CardUser from './CardUser'; // ✅ Nuevo componente
import ImagesPost from './ImagesPost';
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';
import AuthModal from '../../authAndVerify/AuthModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { createReport } from '../../../redux/actions/reportUserAction';
import OptionsModal from './OptionsModal'; // ✅ Nuevo componente
const CardBodyCarousel = ({ post }) => {
  const { languageReducer, auth, socket, homeUsers, profile } = useSelector((state) => state);
  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();

  // Estados de interacción con el post
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [buyLoad, setBuyLoad] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showBuyMessage, setShowBuyMessage] = useState(false);


  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Estados de UI
  const [showInfo, setShowInfo] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Refs
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
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptionsModal]);

  // Sincronizar estado de likes
  useEffect(() => {
    if (auth.user && post.likes?.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.user]);

  // Sincronizar estado de guardados
  useEffect(() => {
    if (auth.user?.saved?.includes(post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post._id]);

  // Sincronizar estado del carrito
  useEffect(() => {
    const cartItems = auth.user?.cart?.items || [];
    setInCart(cartItems.some(item => item.postId === post._id));
  }, [auth.user?.cart, post._id]);

  // Cargar carrito al iniciar
  useEffect(() => {
    if (auth.token) dispatch(loadCart(auth.token));
  }, [auth.token, dispatch]);

  // Función para verificar permisos
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

  // Encontrar información completa del usuario
  const findCompleteUser = useCallback(() => {
    const completeUser = profile.users?.find(u => u._id === post.user?._id);
    return completeUser || post.user;
  }, [post.user, profile.users]);

  const user = findCompleteUser();
  const isPostOwner = auth.user && post.user && auth.user._id === post.user._id;
  const isAdmin = auth.user && auth.user.role === "admin";
  const adminUser = homeUsers.users?.find(user => user.role === "admin");

  // Handlers de UI para ImagesPost
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

  // Handlers de acciones principales
  const handleLike = useCallback(async () => {
    if (!canProceed() || loadLike) return;
    setLoadLike(true);
    if (isLike) {
      await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
    } else {
      await dispatch(likePost({ post, auth, socket, t, languageReducer }));
    }
    setLoadLike(false);
  }, [canProceed, loadLike, isLike, dispatch, post, auth, socket, t, languageReducer]);

  const handleSavePost = useCallback(async () => {
    if (!canProceed() || saveLoad) return;
    setSaveLoad(true);
    if (saved) {
      await dispatch(unSavePost({ post, auth }));
    } else {
      await dispatch(savePost({ post, auth }));
    }
    setSaveLoad(false);
  }, [canProceed, saveLoad, saved, dispatch, post, auth]);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
    setShowOptionsModal(false);
  }, []);

  // Handlers del menú de opciones (se mantienen igual)
  const handleAprove = useCallback(() => {
    if (window.confirm(t('confirmApprove'))) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
    }
  }, [post, auth, dispatch, history, t]);

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

  const handleContactSeller = useCallback(() => {
    if (!canProceed()) return;
    // Lógica de contacto
    setShowOptionsModal(false);
  }, [canProceed]);

  const handleChatWithAdmin = useCallback(() => {
    if (!canProceed()) return;
    if (!adminUser) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('noAdminAvailable') }
      });
    }
    // Lógica de chat con admin
  }, [canProceed, adminUser, dispatch, t]);

  const handleSavePostAction = useCallback(async () => {
    if (!canProceed() || saveLoad) return;
    setSaveLoad(true);
    if (saved) {
      await dispatch(unSavePost({ post, auth }));
    } else {
      await dispatch(savePost({ post, auth }));
    }
    setSaveLoad(false);
    setShowOptionsModal(false);
  }, [canProceed, saveLoad, saved, dispatch, post, auth]);

  const handleSubmitReport = useCallback((reason) => {
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
  }, [canProceed, post, auth, dispatch, t]);

  const handleOptionClick = useCallback((option) => {
    switch (option) {
      case 'approve':
        handleAprove();
        setShowOptionsModal(false);
        break;
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
        setShowOptionsModal(false);
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
  }, [handleAprove, handleEditPost, handleDeletePost, handleContactSeller, handleShare, handleSavePostAction]);

  const formatDate = useCallback((dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(
      lang === 'es' ? 'es-ES' : lang === 'ar' ? 'ar-AR' : 'en-US',
      options
    );
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

            <CardUser
              user={user}
              post={post}
              onOptionsClick={() => setShowOptionsModal(true)}
              formatDate={formatDate}
              t={t}
            />

 
<OptionsModal
  show={showOptionsModal}
  onClose={() => setShowOptionsModal(false)}
  isAdmin={isAdmin}
  isPostOwner={isPostOwner}
  saved={saved}
  t={t}
  post={post}
  auth={auth}
  dispatch={dispatch}
  history={history}
  socket={socket}
  homeUsers={homeUsers}
  canProceed={canProceed}
  
/>
              

         
            {/* Options Modal (se mantiene igual) */}
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
                    animation: 'slideUp 0.3s ease',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {/* ... (contenido del modal igual) ... */}
                </div>
              </div>
            )}

            {/* Componente ImagesPost */}
            <ImagesPost
              post={post}
              showInfo={showInfo}
              onImageClick={handleImageClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onLike={handleLike}
              onShare={handleShare}
              isLike={isLike}
              formatDate={formatDate}
            />
          </>
        )}
      </div>

      {/* Resto del código (modales, mensajes, etc.) se mantiene igual */}
      <ShareModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        post={post}
        t={t}
      />
      {/* Report Modal */}
      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
        t={t}
        initialReason=""
      />

      {/* Buy Message */}
      {showBuyMessage && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: inCart ? "#4CAF50" : "#F44336",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
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

      {/* Auth Modals */}
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