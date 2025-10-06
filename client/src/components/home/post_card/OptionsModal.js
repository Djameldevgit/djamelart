import React, { useState, useEffect, useRef, useCallback } from 'react';
import { likePost, unLikePost, savePost, unSavePost, deletePost } from '../../../redux/actions/postAction';
import { loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import moment from 'moment';

import CardUser from './CardUser';
import ImagesPost from './ImagesPost';
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';
import AuthModal from '../../authAndVerify/AuthModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';
import OptionsModal from './OptionsModal';

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

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const [showInfo, setShowInfo] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const optionsModalRef = useRef(null);
  const cardRef = useRef(null);

  // Reset al cambiar post
  useEffect(() => {
    setShowInfo(false);
    setIsTouching(false);
    setShowOptionsModal(false);
    setShowShareModal(false);
    setShowReportModal(false);
  }, [post._id]);

  // Click fuera del modal
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

  // Like
  useEffect(() => {
    setIsLike(post.likes?.some(like => like._id === auth.user?._id));
  }, [post.likes, auth.user]);

  // Guardado
  useEffect(() => {
    setSaved(auth.user?.saved?.includes(post._id));
  }, [auth.user, post._id]);

  // Verificar permisos
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

  // Información del usuario
  const user = profile.users?.find(u => u._id === post.user?._id) || post.user;
  const isPostOwner = auth.user && post.user && auth.user._id === post.user._id;
  const isAdmin = auth.user && auth.user.role === "admin";
  const adminUser = homeUsers.users?.find(user => user.role === "admin");

  // ✅ HANDLERS ACTUALIZADOS

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

  // ✅ SAVE POST CORREGIDO
  const handleSavePostAction = useCallback(async (e) => {
    if (e) e.stopPropagation();
    if (!canProceed() || saveLoad) return;
    
    setSaveLoad(true);
    try {
      if (saved) {
        await dispatch(unSavePost({ post, auth }));
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: t('postUnsaved') }
        });
      } else {
        await dispatch(savePost({ post, auth }));
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: t('postSaved') }
        });
      }
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('saveError') }
      });
    } finally {
      setSaveLoad(false);
      setShowOptionsModal(false);
    }
  }, [canProceed, saveLoad, saved, dispatch, post, auth, t]);

  // ✅ APROBAR POST
  const handleAprove = useCallback((e) => {
    if (e) e.stopPropagation();
    if (window.confirm(t('confirmApprove'))) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
      setShowOptionsModal(false);
    }
  }, [post, auth, dispatch, history, t]);

  // ✅ EDITAR POST
  const handleEditPost = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!canProceed()) return;
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
    setShowOptionsModal(false);
  }, [canProceed, post, dispatch]);

  // ✅ ELIMINAR POST
  const handleDeletePost = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!canProceed()) return;
    if (window.confirm(t('confirmDelete'))) {
      dispatch(deletePost({ post, auth, socket }));
      setShowOptionsModal(false);
    }
  }, [canProceed, post, auth, socket, dispatch, t]);

  // ✅ COMPARTIR
  const handleShare = useCallback((e) => {
    if (e) e.stopPropagation();
    setShowShareModal(true);
    setShowOptionsModal(false);
  }, []);

  // ✅ REPORTAR
  const handleSubmitReport = useCallback((reason) => {
    if (!canProceed()) return;
    const reportData = {
      postId: post._id,
      userId: post.user._id,
      reason,
    };
    dispatch(createReport({ auth, reportData }));
    setShowReportModal(false);
    setShowOptionsModal(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: t('reportSubmitted') }
    });
  }, [canProceed, post, auth, dispatch, t]);

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

            {/* ✅ OPTIONSMODAL CON TODAS LAS CORRECCIONES */}
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
              handleAprove={handleAprove}
              handleEditPost={handleEditPost}
              handleDeletePost={handleDeletePost}
              handleShare={handleShare}
              handleSavePostAction={handleSavePostAction}
              handleSubmitReport={handleSubmitReport}
            />

            <ImagesPost
              post={post}
              showInfo={showInfo}
              onImageClick={() => setShowInfo(prev => !prev)}
              onTouchStart={() => setIsTouching(true)}
              onTouchEnd={() => {
                setIsTouching(false);
                setTimeout(() => setShowInfo(prev => !prev), 100);
              }}
              onLike={handleLike}
              onShare={handleShare}
              isLike={isLike}
              formatDate={formatDate}
            />
          </>
        )}
      </div>

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

      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />
    </div>
  );
};

export default React.memo(CardBodyCarousel);