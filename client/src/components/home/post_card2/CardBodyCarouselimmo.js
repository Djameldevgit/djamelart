import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import Carousel from '../../Carousel';
import CardFooterPost from './CardFooterPost';
import ShareModal from '../../ShareModal';
import { BASE_URL } from '../../../utils/config';

import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';
//import AuthModal from '../../AuthModalAddLikesCommentsSave';
import AuthModal from '../../authAndVerify/AuthModal';
import { useTranslation } from "react-i18next";
const CardBodyCarouselimmo = ({ post }) => {
    const history = useHistory();
    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);
    const { auth, socket,languageReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const [saved, setSaved] = useState(false);
    const [saveLoad, setSaveLoad] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isShare, setIsShare] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // Referencia para detectar clics fuera del modal de compartir
    const shareModalRef = useRef(null);
   
    const { t } = useTranslation('cardbodycarousel');
    const lang = languageReducer.language || 'en';
    // Verificar el estado de autenticación y verificación
    const canProceed = (actionName = 'realizar esta acción') => {
        if (!auth.token || !auth.user) {
            setShowModal(true); // ✅ Mostrar “Conéctate o regístrate”
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

    // Efecto para verificar likes
    useEffect(() => {
        if (auth.user && post.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true);
        } else {
            setIsLike(false);
        }
    }, [post.likes, auth.user]);

    // Efecto para verificar posts guardados
    useEffect(() => {
        if (auth.user && auth.user.saved.find(id => id === post._id)) {
            setSaved(true);
        } else {
            setSaved(false);
        }
    }, [auth.user, post._id]);

    // Manejar like
    const handleLike = async () => {
        if (loadLike) return;
        
        if (!canProceed('dar like')) {
            return;
        }
        
        setLoadLike(true);
        await dispatch(likePost({ post, auth, socket }));
        setLoadLike(false);
    };

    // Manejar unlike
    const handleUnLike = async () => {
        if (loadLike) return;
        
        if (!canProceed('quitar like')) {
            return;
        }
        
        setLoadLike(true);
        await dispatch(unLikePost({ post, auth, socket }));
        setLoadLike(false);
    };

    // Guardar post
    const handleSavePost = async () => {
        if (saveLoad) return;
        
        if (!canProceed('guardar este post')) {
            return;
        }
        
        setSaveLoad(true);
        await dispatch(savePost({ post, auth }));
        setSaveLoad(false);
    };

    // Quitar post guardado
    const handleUnSavePost = async () => {
        if (saveLoad) return;
        
        if (!canProceed('quitar de guardados')) {
            return;
        }
        
        setSaveLoad(true);
        await dispatch(unSavePost({ post, auth }));
        setSaveLoad(false);
    };

    // Manejar clic en compartir
    const handleShareClick = () => {
        if (!canProceed('compartir')) {
            return;
        }
        
        setIsShare(!isShare);
    };

    // Manejar clic en comentarios
    const handleCommentClick = () => {
        if (!canProceed('comentar')) {
            return;
        }
        
        history.push(`/post/${post._id}#comments`);
    };

    // Cerrar modal de compartir al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isShare && shareModalRef.current && !shareModalRef.current.contains(e.target)) {
                setIsShare(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isShare]);

    return (
        <>
            <div className="card">
                <div className="card__image" onClick={() => history.push(`/post/${post._id}`)}>
                    <Carousel images={post.images} id={post._id} />
                </div>

                <div className="card__actions">
                    <div className="card__actions-left">
                        <LikeButton
                            isLike={isLike}
                            handleLike={handleLike}
                            handleUnLike={handleUnLike}
                            disabled={!auth.token}
                        />
                        <span className="card__action-count">{post.likes.length}</span>

                        <i 
                            className="far fa-comment card__action-icon" 
                            onClick={handleCommentClick}
                            style={{ cursor: 'pointer' }}
                        />
                        <span className="card__action-count">{post.comments.length}</span>

                        <i 
                            className="fas fa-share card__action-icon" 
                            onClick={handleShareClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <div className="card__actions-right">
                        {saved
                            ? <i 
                                className="fas fa-bookmark card__action-icon" 
                                onClick={handleUnSavePost} 
                                style={{color: '#ffc107', cursor: 'pointer'}}
                              />
                            : <i 
                                className="far fa-bookmark card__action-icon" 
                                onClick={handleSavePost} 
                                style={{ cursor: 'pointer' }}
                              />
                        }
                        <span className="card__action-count">{post.saves || 0}</span>
                    </div>
                </div>

                {isShare && (
                    <div className="share-modal-container" ref={shareModalRef}>
                        <ShareModal 
                            url={`${BASE_URL}/post/${post._id}`} 
                            onClose={() => setIsShare(false)}
                        />
                    </div>
                )}

       
            </div>

            {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ position: 'relative' }}>

            {/* Botón de cierre arriba derecha */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.8rem',
                color: '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '1',
              }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h4>{t("title2", { lng: languageReducer.language })}</h4>
            <p>{t("message2", { lng: languageReducer.language })}</p>
            <div className="modal-buttons">
              <button onClick={() => history.push("/login")}>
                {t("login2", { lng: languageReducer.language })}
              </button>
              <button onClick={() => history.push("/register")}>
                {t("register2", { lng: languageReducer.language })}
              </button>
              <button onClick={() => setShowModal(false)}>
                {t("close2", { lng: languageReducer.language })}
              </button>
            </div>
          </div>
        </div>
      )}

 
            <AuthModal 
            post={post}
                show={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
                onLoginSuccess={() => setShowAuthModal(false)}
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

export default CardBodyCarouselimmo;