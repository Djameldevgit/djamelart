import React, { useState, useEffect } from 'react';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';
import moment from 'moment';
import obrasData from '../../encargosss/obrasData.json';

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
  const [videoAvailable, setVideoAvailable] = useState(false);

  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();

  // Función mejorada para buscar video
  const findVideoForPost = () => {
    if (!post || !obrasData.works) {
      console.log('No post or obrasData found');
      return null;
    }

    // DEBUG: Ver qué contiene el post
    console.log('Post data:', {
      theme: post.theme,
      title: post.title,
      content: post.content
    });

    // Estrategia 1: Buscar por tema exacto del post
    const postTheme = post.theme?.toLowerCase().trim();
    console.log('Buscando tema:', postTheme);

    if (postTheme && obrasData.works[postTheme]) {
      console.log('Tema encontrado en obrasData:', postTheme);
      // Tomar el primer video disponible de ese tema
      const videoKeys = Object.keys(obrasData.works[postTheme]);
      const firstVideoKey = videoKeys[0];
      
      if (firstVideoKey) {
        const video = obrasData.works[postTheme][firstVideoKey];
        console.log('Video encontrado:', video);
        return {
          videoUrl: video.videoUrl,
          videoId: `${postTheme}-${firstVideoKey}`
        };
      }
    }

    // Estrategia 2: Buscar por coincidencias parciales en el tema
    const themes = Object.keys(obrasData.works);
    console.log('Todos los temas disponibles:', themes);
    
    for (const theme of themes) {
      // Buscar coincidencias parciales (ej: "retrato" en "retratos")
      if (postTheme && postTheme.includes(theme)) {
        console.log('Coincidencia parcial encontrada:', theme);
        const videoKeys = Object.keys(obrasData.works[theme]);
        const firstVideoKey = videoKeys[0];
        if (firstVideoKey) {
          const video = obrasData.works[theme][firstVideoKey];
          return {
            videoUrl: video.videoUrl,
            videoId: `${theme}-${firstVideoKey}`
          };
        }
      }
    }

    // Estrategia 3: Buscar por palabras clave en el título
    const title = post.title?.toLowerCase() || '';
    const content = post.content?.toLowerCase() || '';
    
    const searchText = title + ' ' + content;
    console.log('Buscando en texto:', searchText);

    for (const theme of themes) {
      if (searchText.includes(theme)) {
        console.log('Palabra clave encontrada en título/contenido:', theme);
        const videoKeys = Object.keys(obrasData.works[theme]);
        const firstVideoKey = videoKeys[0];
        if (firstVideoKey) {
          const video = obrasData.works[theme][firstVideoKey];
          return {
            videoUrl: video.videoUrl,
            videoId: `${theme}-${firstVideoKey}`
          };
        }
      }
    }

    console.log('No se encontró video para este post');
    return null;
  };

  // Función mejorada para verificar si el video existe
  const checkVideoExists = async (videoUrl) => {
    if (!videoUrl) return false;
    
    try {
      // Para rutas relativas, construir la URL completa
      const fullUrl = videoUrl.startsWith('http') ? videoUrl : `${window.location.origin}${videoUrl}`;
      console.log('Verificando video en:', fullUrl);
      
      const response = await fetch(fullUrl, { method: 'HEAD' });
      const exists = response.ok;
      console.log('Video existe:', exists);
      return exists;
    } catch (error) {
      console.log('Error verificando video:', error);
      return false;
    }
  };

  // Efecto mejorado para verificar disponibilidad de video
  useEffect(() => {
    const verifyVideo = async () => {
      console.log('=== VERIFICANDO VIDEO PARA POST ===');
      const videoInfo = findVideoForPost();
      
      if (videoInfo && videoInfo.videoUrl) {
        console.log('Video info encontrada:', videoInfo);
        const exists = await checkVideoExists(videoInfo.videoUrl);
        
        if (exists) {
          setVideoAvailable(true);
          console.log('Video marcado como disponible');
        } else {
          setVideoAvailable(false);
          console.log('Video no existe en el servidor');
        }
      } else {
        setVideoAvailable(false);
        console.log('No se encontró información de video');
      }
    };

    verifyVideo();
  }, [post]);

  // Función para manejar clic en botón de video
  const handleVideoClick = () => {
    const videoInfo = findVideoForPost();
    
    if (videoInfo && videoInfo.videoId) {
      history.push(`/videos/${videoInfo.videoId}`);
    } else {
      history.push('/djamelartgaleria');
    }
  };

  // Función para mostrar mensaje si no hay video
  const showNoVideoMessage = () => {
    alert(t('noVideoAvailable', { lng: lang }));
  };

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
      }).catch((error) => console.log('Error sharing', error));
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div>
      <div className="card_body">
        {post.images.length > 0 && (
          <div className="carousel-container" style={{ position: "relative" }}>
            {/* Fecha de publicación */}
            <div style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "500"
            }}>
              <small className="textmuted">
                <span className="mr-1"><i className='far fa-clock'></i>  </span>
                {moment(post.createdAt).fromNow()}
              </small>
            </div>

            {/* Información del artista */}
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              zIndex: 2,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "4px",
              backdropFilter: "blur(5px)",
            }}>
              <div className='card-title' style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {post.user?.username || "Artista"}
              </div>
              {post.theme && (
                <div style={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {post.theme}
                  {videoAvailable && (
                    <span style={{ 
                      marginLeft: "8px", 
                      fontSize: "12px", 
                      color: "#FFD700",
                      fontWeight: "bold"
                    }}>
                      🎬 Video disponible
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Iconos laterales */}
            <div style={{
              position: "absolute",
              right: "10px",
              bottom: "60px",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px"
            }}>
              {/* Botón de Video */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: videoAvailable ? "rgba(255, 215, 0, 0.3)" : "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    border: videoAvailable ? "2px solid #FFD700" : "2px solid #666",
                    opacity: videoAvailable ? 1 : 0.7
                  }}
                  onClick={videoAvailable ? handleVideoClick : showNoVideoMessage}
                  title={videoAvailable ? t('watchVideo', { lng: lang }) : t('noVideoAvailable', { lng: lang })}
                >
                  <span className="material-icons" style={{
                    fontSize: "24px",
                    color: videoAvailable ? "#FFD700" : "#999"
                  }}>
                    {videoAvailable ? "play_arrow" : "videocam_off"}
                  </span>
                </div>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: videoAvailable ? "#FFD700" : "#999",
                  marginTop: "2px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}>
                  {videoAvailable ? t('video', { lng: lang }) : t('noVideo', { lng: lang })}
                </span>
              </div>

              {/* Like */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                    width: "40px",
                    height: "40px"
                  }}
                  onClick={isLike ? handleUnLike : handleLike}
                >
                  <span className="material-icons" style={{
                    fontSize: "24px",
                    color: isLike ? "#F91880" : "white"
                  }}>
                    {loadLike ? "hourglass_empty" : "favorite"}
                  </span>
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "white",
                  marginTop: "4px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}>
                  {post.likes.length}
                </span>
              </div>

              {/* Guardar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px"
                  }}
                  onClick={saved ? handleUnSavePost : handleSavePost}
                >
                  <span className="material-icons" style={{
                    fontSize: "24px",
                    color: saved ? "#ff8c00" : "white",
                    opacity: saveLoad ? 0.5 : 1
                  }}>
                    {saveLoad ? "hourglass_empty" : "bookmark"}
                  </span>
                </div>
              </div>

              {/* Comprar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                    width: "40px",
                    height: "40px"
                  }}
                  onClick={handleBuyProduct}
                  title={inCart ? t("removeFromCart", { lng: lang }) : t("addToCart", { lng: lang })}
                >
                  <span className="material-icons" style={{
                    fontSize: "24px",
                    color: inCart ? "#F44336" : "#4CAF50"
                  }}>
                    {buyLoad ? "hourglass_empty" : "shopping_cart"}
                  </span>
                </div>
              </div>

              {/* Vistas */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px"
                }}>
                  <span className="material-icons" style={{ fontSize: "24px", color: "white" }}>
                    visibility
                  </span>
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "white",
                  marginTop: "4px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}>
                  {post.views || 0}
                </span>
              </div>

              {/* Compartir */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px"
                  }}
                  onClick={handleShare}
                >
                  <span className="material-icons" style={{ fontSize: "24px", color: "white" }}>
                    share
                  </span>
                </div>
              </div>
            </div>

            {/* Carousel */}
            <div className="card">
              <div className="card__image" onClick={() => history.push(`/post/${post._id}`)}>
                <Carousel images={post.images} id={post._id} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
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
              <button onClick={() => setShowShareOptions(false)} style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.8rem', color: '#333', cursor: 'pointer', fontWeight: 'bold', lineHeight: '1' }} aria-label="Cerrar">
              ×
            </button>
            <h4>{t("title2", { lng: languageReducer.language })}</h4>
            <p>{t("message2", { lng: languageReducer.language })}</p>
            <div className="modal-buttons">
              <button onClick={() => history.push("/login")}>{t("login2", { lng: languageReducer.language })}</button>
              <button onClick={() => history.push("/register")}>{t("register2", { lng: languageReducer.language })}</button>
              <button onClick={() => setShowModal(false)}>{t("close2", { lng: languageReducer.language })}</button>
            </div>
          </div>
        </div>
      )}

      {showBuyMessage && (
        <div className="buy-message" style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: inCart ? "#4CAF50" : "#F44336", color: "white", padding: "10px 20px", borderRadius: "5px", zIndex: 9999, display: "flex", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
          <span className="material-icons" style={{ marginRight: "8px" }}>{inCart ? "check_circle" : "shopping_cart"}</span>
          {inCart ? t("productAddedToCart", { lng: lang }) : t("thanksForPurchase", { lng: lang })}
        </div>
      )}

      {showVerifyModal && <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />}
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />
    </div>
  );
};

export default React.memo(CardBodyCarousel);