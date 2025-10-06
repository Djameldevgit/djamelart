import React, { useState, useEffect, useRef, useCallback } from 'react';
import { likePost, unLikePost, savePost, unSavePost, deletePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import moment from 'moment';

// Importar componentes
import CardUser from './CardUser';
import ImagesPost from './ImagesPost';
import OptionsModal from './OptionsModal'; // ✅ Nuevo componente
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';
import AuthModal from '../../authAndVerify/AuthModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { createReport } from '../../../redux/actions/reportUserAction';

const CardBodyCarousel = ({ post }) => {
  const { languageReducer, auth, socket, homeUsers, profile } = useSelector((state) => state);
  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();

  // Estados
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
  const [showInfo, setShowInfo] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Refs
  const cardRef = useRef(null);

  // Efectos (se mantienen igual)
  useEffect(() => {
    setShowInfo(false);
    setIsTouching(false);
    setShowOptionsModal(false);
    setShowShareModal(false);
    setShowReportModal(false);
  }, [post._id]);

  // ... (otros useEffect se mantienen igual)

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

  // Handlers de UI
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

  const handleAddUser = useCallback((user) => {
    if (!canProceed()) return;
    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    history.push(`/message/${user._id}`);
  }, [canProceed, dispatch, history]);

  // Handlers del menú de opciones
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
    handleAddUser(post.user);
    setShowOptionsModal(false);
  }, [canProceed, post.user, handleAddUser]);

  const handleChatWithAdmin = useCallback(() => {
    if (!canProceed()) return;
    if (!adminUser) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('noAdminAvailable') }
      });
    }
    handleAddUser(adminUser);
  }, [canProceed, adminUser, dispatch, t, handleAddUser]);

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
      case 'adminChat':
        handleChatWithAdmin();
        break;
      default:
        break;
    }
  }, [
    handleAprove, handleEditPost, handleDeletePost, 
    handleContactSeller, handleShare, handleSavePostAction,
    handleChatWithAdmin
  ]);

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
            {/* CardUser */}
            <CardUser
              user={user}
              post={post}
              onOptionsClick={() => setShowOptionsModal(true)}
              formatDate={formatDate}
              t={t}
            />

            {/* ✅ OptionsModal separado */}
            <OptionsModal
              show={showOptionsModal}
              onClose={() => setShowOptionsModal(false)}
              onOptionClick={handleOptionClick}
              isAdmin={isAdmin}
              isPostOwner={isPostOwner}
              saved={saved}
              t={t}
            />

            {/* ImagesPost */}
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

      {/* Otros modales */}
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

      {/* ... (resto de modales y mensajes) ... */}
    </div>
  );
};

export default React.memo(CardBodyCarousel);