import React, { useState, useCallback } from 'react';
import Carousel from '../../Carousel';
import { useHistory,Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import LikeButton from './../../LikeButton';

const ImagesPost = ({ 
  post, 
  showInfo, 
  onImageClick, 
  onTouchStart, 
  onTouchEnd,
  onLike,
  onShare,
  isLike,
  formatDate 
}) => {
  const { t } = useTranslation('cardbodycarousel');
  const history = useHistory();

  const handleDetailsClick = useCallback((e) => {
    e.stopPropagation();
    history.push(`/post/${post._id}`);
  }, [history, post._id]);

  const handleCommentClick = useCallback((e) => {
    e.stopPropagation();
    history.push(`/post/${post._id}#comments`);
  }, [history, post._id]);

  const handleLikeClick = useCallback((e) => {
    e.stopPropagation();
    onLike();
  }, [onLike]);

  const handleShareClick = useCallback((e) => {
    e.stopPropagation();
    onShare();
  }, [onShare]);

  return (
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
      onClick={onImageClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Info Overlay */}
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
        {post.user?.username && (
          <div style={{
            fontSize: "clamp(16px, 2.5vh, 20px)",
            lineHeight: "1.4",
            fontWeight: "600",
            opacity: showInfo ? 0.95 : 0,
            transition: 'all 0.3s ease 0.1s'
          }}>
            {post.user.username}
          </div>
        )}
        <div style={{
          fontSize: "clamp(10px, 2vh, 20px)",
          lineHeight: "1.4",
          fontWeight: "400",
          opacity: showInfo ? 0.95 : 0,
          transition: 'all 0.3s ease 0.1s'
        }}>
          {post.title}
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#888"
        }}>
          <span className="material-icons" style={{ fontSize: "14px", color: "#999" }}>
            schedule
          </span>
          <span>{formatDate(post.createdAt)} • {moment(post.createdAt).fromNow()}</span>
        </div>
        {post.content && (
          <div style={{
            fontSize: "clamp(14px, 2vh, 16px)",
            lineHeight: "1.4",
            opacity: showInfo ? 0.8 : 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: 'all 0.3s ease 0.2s'
          }}>
            {post.content}
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "8px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          opacity: showInfo ? 1 : 0,
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
              onClick={handleLikeClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)"
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
              <span style={{ fontSize: "13px", fontWeight: "500" }}>
                {post.likes?.length || 0}
              </span>
            </div>

            {/* Comment */}
            <div
              onClick={handleCommentClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)"
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
              onClick={handleShareClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)"
              }}
            >
              <span className="material-icons" style={{ fontSize: "18px" }}>share</span>
            </div>
          </div>

         
        
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
            <button
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
                backdropFilter: "blur(10px)",
                opacity: showInfo ? 1 : 0,
                transition: 'all 0.3s ease'
              }}
            >
              <span>{t('details')}</span>
              <span className="material-icons" style={{ fontSize: "16px" }}>
                arrow_forward
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Tap Indicator */}
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

      {/* Carousel */}
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
  );
};

export default React.memo(ImagesPost);