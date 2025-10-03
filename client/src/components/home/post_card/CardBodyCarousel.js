import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ShareModal from '../../ShareModal';
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';
import moment from 'moment';

const CardBodyCarousel = ({ post }) => {
  const { languageReducer, auth, socket } = useSelector((state) => state);
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [buyLoad, setBuyLoad] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBuyMessage, setShowBuyMessage] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const shareModalRef = useRef(null);

  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();

  const canProceed = () => {
    if (!auth.token || !auth.user) {
      setShowModal(true);
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

  useEffect(() => {
    if (auth.token) dispatch(loadCart(auth.token));
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (auth.user && post.likes.find((like) => like._id === auth.user._id)) {
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

  const handleLike = async () => {
    if (!canProceed() || loadLike) return;
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket, t, languageReducer }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (!canProceed() || loadLike) return;
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
    if (!canProceed() || saveLoad) return;
    setSaveLoad(true);
    await dispatch(savePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (!canProceed() || saveLoad) return;
    setSaveLoad(true);
    await dispatch(unSavePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleBuyProduct = async () => {
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
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title || 'Mira esta publicación',
        text: post.content || 'Echa un vistazo a esta publicación',
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      setShowShareOptions(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
  };

  return (
    <div>
      <div className="card_body">
        {post.images.length > 0 && (
          <div className="carousel-container" style={{ 
            position: "relative",
            height: "400px",
            maxHeight: "80vh",
            overflow:'hidden'
          }}>
            {/* Fecha de publicación (parte superior) */}
            <div style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "clamp(10px, 1.5vh, 12px)",
              fontWeight: "500"
            }}>
              <small className="textmuted">
                <span className="mr-1"><i className='far fa-clock'></i>  </span>
                {moment(post.createdAt).fromNow()}
              </small>
            </div>

            {/* Información del artista y título (parte inferior) */}
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              zIndex: 2,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "12px",
              backdropFilter: "blur(5px)",
            }}>
              <div className='card-title' style={{
                fontSize: "clamp(14px, 2vh, 18px)",
                fontWeight: "bold",
                marginBottom: "4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {post.user?.username || "Artista"}
              </div>
              {post.title && (
                <div style={{
                  fontSize: "clamp(12px, 1.5vh, 14px)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {post.title}
                </div>
              )}
            </div>

            {/* Contenedor de iconos al estilo TikTok (derecha) */}
            <div style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(6px, 2vh, 16px)", // Gap dinámico
              justifyContent: "center", // Centrado vertical
              maxHeight: "calc(100% - 140px)",
              paddingTop: "10px",
              paddingBottom: "10px"
            }}>
              {/* Avatar del usuario */}
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  gap: "2px", // Gap interno optimizado
                  cursor: "pointer"
                }}
                onClick={() => history.push(`/profile/${post.user._id}`)}
              >
                <div style={{
                  width: "clamp(36px, 6vh, 48px)",
                  height: "clamp(36px, 6vh, 48px)",
                  borderRadius: "50%",
                  border: "2px solid white",
                  overflow: "hidden",
                  backgroundColor: "#333",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}>
                  {post.user?.avatar ? (
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.username}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#667eea",
                      color: "white",
                      fontSize: "clamp(14px, 2.5vh, 18px)",
                      fontWeight: "bold"
                    }}>
                      {post.user?.username?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de like */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                gap: "2px" // Gap interno optimizado
              }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: loadLike ? 0.7 : 1,
                    width: "clamp(32px, 5vh, 40px)",
                    height: "clamp(32px, 5vh, 40px)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={isLike ? handleUnLike : handleLike}
                >
                  <span
                    className="material-icons"
                    style={{
                      fontSize: "clamp(18px, 3vh, 24px)",
                      color: isLike ? "#F91880" : "white"
                    }}
                  >
                    {loadLike ? "hourglass_empty" : "favorite"}
                  </span>
                </div>
                <span style={{
                  fontSize: "clamp(10px, 1.5vh, 12px)",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}>
                  {post.likes.length}
                </span>
              </div>

              {/* Botón de guardar */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                gap: "2px" // Gap interno optimizado
              }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "clamp(32px, 5vh, 40px)",
                    height: "clamp(32px, 5vh, 40px)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={saved ? handleUnSavePost : handleSavePost}
                >
                  <span
                    className="material-icons"
                    style={{
                      fontSize: "clamp(18px, 3vh, 24px)",
                      color: saved ? "#ff8c00" : "white",
                      opacity: saveLoad ? 0.5 : 1
                    }}
                  >
                    {saveLoad ? "hourglass_empty" : "bookmark"}
                  </span>
                </div>
              </div>

              {/* Botón de comprar */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                gap: "2px" // Gap interno optimizado
              }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${inCart ? "#F44336" : "#4CAF50"}`,
                    opacity: buyLoad ? 0.7 : 1,
                    width: "clamp(32px, 5vh, 40px)",
                    height: "clamp(32px, 5vh, 40px)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={handleBuyProduct}
                  title={inCart ? t("removeFromCart", { lng: lang }) : t("addToCart", { lng: lang })}
                >
                  <span className="material-icons" style={{
                    fontSize: "clamp(18px, 3vh, 24px)",
                    color: inCart ? "#F44336" : "#4CAF50"
                  }}>
                    {buyLoad ? "hourglass_empty" : "shopping_cart"}
                  </span>
                </div>
              </div>

              {/* Contador de vistas */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                gap: "2px" // Gap interno optimizado
              }}>
                <div style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "clamp(32px, 5vh, 40px)",
                  height: "clamp(32px, 5vh, 40px)"
                }}>
                  <span className="material-icons" style={{ 
                    fontSize: "clamp(18px, 3vh, 24px)", 
                    color: "white" 
                  }}>
                    visibility
                  </span>
                </div>
                <span style={{
                  fontSize: "clamp(10px, 1.5vh, 12px)",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}>
                  {post.views || 0}
                </span>
              </div>

              {isShare && (
                <div className="share-modal-container" ref={shareModalRef}>
                  <ShareModal
                    url={`${process.env.REACT_APP_BASE_URL}/post/${post._id}`}
                    onClose={() => setIsShare(false)}
                  />
                </div>
              )}

              {/* Botón de compartir */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                gap: "2px" // Gap interno optimizado
              }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "clamp(32px, 5vh, 40px)",
                    height: "clamp(32px, 5vh, 40px)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={handleShare}
                >
                  <span className="material-icons" style={{ 
                    fontSize: "clamp(18px, 3vh, 24px)", 
                    color: "white" 
                  }}>
                    share
                  </span>
                </div>
              </div>
            </div>

            {/* Carousel con height fijo */}
            <div className="card" style={{ height: "100%" }}>
              <div 
                className="card__image" 
                onClick={() => history.push(`/post/${post._id}`)}
                style={{
                  height: "100%",
                  cursor: "pointer"
                }}
              >
                <div style={{ height: "100%" }}>
                  <Carousel images={post.images} id={post._id} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resto de los modales... */}
      {showShareOptions && (
        <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ width: '300px', borderRadius: '12px' }}>
            <h3>Compartir publicación</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span className="material-icons" style={{ color: 'white' }}>chat</span>
                </div>
                <p>WhatsApp</p>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span className="material-icons" style={{ color: 'white' }}>facebook</span>
                </div>
                <p>Facebook</p>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#1DA1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span className="material-icons" style={{ color: 'white' }}>flutter_dash</span>
                </div>
                <p>Twitter</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowShareOptions(false)}
                style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ position: 'relative' }}>
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

      {showVerifyModal && (
        <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      )}
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />
    </div>
  );
};

export default React.memo(CardBodyCarousel);