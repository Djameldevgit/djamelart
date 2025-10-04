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
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const shareModalRef = useRef(null);
  const optionsModalRef = useRef(null);

  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();
  
  // Estados locales que deben resetearse cuando cambia el post
  const [showInfo, setShowInfo] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Resetear estados cuando cambia el post
  useEffect(() => {
    setShowInfo(false);
    setIsTouching(false);
    setShowOptionsModal(false);
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

  // Handlers para mostrar/ocultar información
  const handleImageClick = () => {
    setShowInfo(prev => !prev);
  };

  const handleTouchStart = () => {
    setIsTouching(true);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    setTimeout(() => setShowInfo(prev => !prev), 100);
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
    
    if (isLike) {
      setLoadLike(true);
      await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
      setLoadLike(false);
    } else {
      setLoadLike(true);
      await dispatch(likePost({ post, auth, socket, t, languageReducer }));
      setLoadLike(false);
    }
  };

  const handleUnLike = async () => {
    if (!canProceed() || loadLike) return;
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
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

  // Handler para las opciones del modal
  const handleOptionClick = (option) => {
    setShowOptionsModal(false);
    
    switch (option) {
      case 'edit':
        // Lógica para editar post
        console.log('Editar post:', post._id);
        break;
      case 'delete':
        // Lógica para eliminar post
        console.log('Eliminar post:', post._id);
        break;
      case 'contact':
        // Lógica para contactar al artista
        console.log('Contactar artista:', post.user?._id);
        break;
      case 'report':
        // Lógica para denunciar publicación
        console.log('Denunciar publicación:', post._id);
        break;
      case 'share':
        handleShare();
        break;
      case 'save':
        handleSavePost();
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
  };

  // Verificar si el usuario actual es el dueño del post
  const isPostOwner = auth.user && post.user && auth.user._id === post.user._id;

  return (
    <div>
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
                      background: post.user?.avatar 
                        ? `url(${post.user.avatar}) center/cover`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "2px solid #f0f0f0",
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`/profile/${post.user?._id}`);
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
                        {post.user?.username || "Artista"}
                      </span>
                      {post.user?.isVerified && (
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
                      {post.user?.followers?.length || 0} seguidores
                    </div>
                  </div>
                </div>
                
                {/* Contenedor de botones de la derecha */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  {/* Botón Seguir */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para seguir al usuario
                      console.log("Seguir usuario:", post.user?._id);
                    }}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.3s ease",
                      minWidth: "100px",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: "16px" }}>
                      person_add
                    </span>
                    <span>Seguir</span>
                  </button>

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
                      padding: "8px",
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
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#888",
                paddingLeft: "56px" // Para alinear con el avatar
              }}>
                <span className="material-icons" style={{ 
                  fontSize: "14px",
                  color: "#999"
                }}>
                  schedule
                </span>
                <span>{formatDate(post.createdAt)} • {moment(post.createdAt).fromNow()}</span>
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
                    {/* Opciones para el dueño del post */}
                    {isPostOwner && (
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
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span className="material-icons" style={{ color: '#666' }}>
                            edit
                          </span>
                          Editar publicación
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
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span className="material-icons" style={{ color: '#e74c3c' }}>
                            delete
                          </span>
                          Eliminar publicación
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
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span className="material-icons" style={{ color: '#666' }}>
                        chat
                      </span>
                      Contactar con el artista
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
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span className="material-icons" style={{ color: '#666' }}>
                        share
                      </span>
                      Compartir publicación
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
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span className="material-icons" style={{ color: '#666' }}>
                        {saved ? 'bookmark' : 'bookmark_border'}
                      </span>
                      {saved ? 'Guardado' : 'Guardar publicación'}
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
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span className="material-icons" style={{ color: '#e74c3c' }}>
                          flag
                        </span>
                        Denunciar publicación
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
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        Cancelar
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
                borderRadius: "0 0 12px 12px"
              }}
              onClick={handleImageClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* ... (el resto del código del carousel se mantiene igual) */}
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
                {/* ... (contenido del card footer) */}
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
                  <span className="material-icons" style={{ 
                    fontSize: "14px",
                    marginRight: "4px"
                  }}>
                    touch_app
                  </span>
                  Toca para ver info
                </div>
              )}

              {/* Carousel */}
              <div className="card" style={{ height: "100%" }}>
                <div 
                  className="card__image" 
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(``);
                  }}
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
          </>
        )}
      </div>

      {/* Agregar estilos CSS para las animaciones */}
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
        `}
      </style>

      {/* Resto de los modales... */}
      {showShareOptions && (
        <ShareModal 
          show={showShareOptions} 
          onClose={() => setShowShareOptions(false)}
          post={post}
        />
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