import React from 'react';
import ActionButton from './ActionButton'; // Asegúrate de tener este archivo
 
// Definir GRADIENTS en este archivo
const GRADIENTS = {
  cartAdd: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cartRemove: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
  saved: 'linear-gradient(135deg, rgba(255, 140, 0, 0.9) 0%, rgba(255, 165, 0, 0.9) 100%)'
};

const ImageOverlay = ({ 
  showInfo, 
  post, 
  t, 
  formatDate, 
  isLike, 
  loadLike, 
  saved, 
  saveLoad, 
  inCart, 
  buyLoad,
  onLike,
  onSaveToggle,
  onShare,
  onViewDetails,
  onBuyProduct,
  onCommentClick
}) => {
  return (
    <div style={{
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      zIndex: 2,
      color: "white",
      background: showInfo
        ? "linear-gradient(transparent 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.8) 100%)"
        : "transparent",
      padding: showInfo ? "20px 16px 16px 16px" : "0px 16px",
      backdropFilter: showInfo ? "blur(10px)" : "none",
      borderTop: showInfo ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
      height: showInfo ? "auto" : "0px",
      opacity: showInfo ? 1 : 0,
      transform: showInfo ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      
      {/* FILA 1: Username */}
      {post.user.username && (
        <div style={{
          fontSize: "clamp(16px, 2.5vh, 20px)",
          opacity: showInfo ? 0.95 : 0,
          lineHeight: "1.4",
          fontWeight: "600",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.1s'
        }}>
          {post.user.username}
        </div>
      )}

      {/* FILA 2: Title */}
      <div style={{
        fontSize: "clamp(14px, 2vh, 18px)",
        opacity: showInfo ? 0.95 : 0,
        lineHeight: "1.4",
        fontWeight: "500",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease 0.15s'
      }} >
        {post.title}
      </div>

      {/* FILA 3: Fecha */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "rgba(255, 255, 255, 0.8)",
        opacity: showInfo ? 1 : 0,
        transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease 0.2s'
      }}>
        <span className="material-icons" style={{
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.7)"
        }}>
          schedule
        </span>
        <span>{formatDate(post.createdAt)}  </span>
      </div>

      {/* FILA 4: Contenido (si existe) */}
      {post.content && (
        <div style={{
          fontSize: "clamp(13px, 1.8vh, 15px)",
          opacity: showInfo ? 0.8 : 0,
          lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.25s'
        }}>
          {post.content}
        </div>
      )}

      {/* FILA 5: Iconos de interacción - SOLO ICONOS */}
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
          gap: "12px", // Reducido el gap para iconos más compactos
          flexWrap: "wrap"
        }}>
          {/* Like - Solo icono */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              position: 'relative'
            }}
            onClick={onLike}
          >
            <span
              className="material-icons"
              style={{
                fontSize: "20px",
                color: isLike ? "#ff3040" : "white"
              }}
            >
              {isLike ? "favorite" : "favorite_border"}
            </span>
            {/* Contador de likes - pequeño y superpuesto */}
            {post.likes?.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                fontSize: "10px",
                color: "white",
                fontWeight: "600",
                background: 'rgba(255, 48, 64, 0.9)',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {post.likes?.length > 99 ? '99+' : post.likes?.length}
              </span>
            )}
          </div>

          {/* Comment - Solo icono */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              position: 'relative'
            }}
            onClick={onCommentClick}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              chat_bubble_outline
            </span>
            {/* Contador de comentarios - pequeño y superpuesto */}
            {post.comments?.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                fontSize: "10px",
                color: "white",
                fontWeight: "600",
                background: 'rgba(0, 150, 255, 0.9)',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {post.comments?.length > 99 ? '99+' : post.comments?.length}
              </span>
            )}
          </div>

          {/* SAVE - Solo icono */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: saveLoad ? "wait" : "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: saved 
                ? "rgba(255, 140, 0, 0.3)" 
                : "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              opacity: saveLoad ? 0.6 : 1
            }}
            onClick={onSaveToggle}
          >
            <span
              className="material-icons"
              style={{
                fontSize: "20px",
                color: saved ? "#FF8C00" : "white"
              }}
            >
              {saveLoad ? "hourglass_empty" : (saved ? "bookmark" : "bookmark_border")}
            </span>
          </div>

          {/* Share - Solo icono */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease"
            }}
            onClick={onShare}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              share
            </span>
          </div>
        </div>

        {/* BOTÓN ADD TO CART - Solo icono */}
        <ActionButton
          icon="shopping_cart"
          gradient={inCart ? GRADIENTS.cartRemove : GRADIENTS.cartAdd}
          onClick={onBuyProduct}
          isActive={true}
          isLoading={buyLoad}
          tooltip={inCart ? t("removeFromCart") : t("addToCart")}
        />
      </div>

      {/* FILA 6: Botón Detalles */}
      <div style={{
        opacity: showInfo ? 1 : 0,
        transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease 0.35s',
        marginTop: '8px'
      }}>
        <button
          onClick={onViewDetails}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            width: "100%",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.25)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.15)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <span>{t('viewDetails')}</span>
          <span className="material-icons" style={{ fontSize: "18px" }}>
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};

export default ImageOverlay;