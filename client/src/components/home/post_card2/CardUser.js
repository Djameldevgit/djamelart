import React, { useCallback } from 'react';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from 'moment';

const CardUser = ({ 
  user, 
  post, 
  onOptionsClick, 
  formatDate,
  t 
}) => {
  const history = useHistory();

  const handleProfileClick = useCallback((e) => {
    e.stopPropagation();
    if (user?._id) {
      history.push(`/profile/${user._id}`);
    }
  }, [history, user?._id]);

  return (
    <div style={{
      background: "white",
      padding: "16px",
      borderBottom: "1px solid #e0e0e0",
      borderRadius: "12px 12px 0 0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* User Info Section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Avatar */}
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
            onClick={handleProfileClick}
          />

          {/* User Info */}
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
            {/* Date */}
            <div style={{ fontSize: "13px", color: "#888" }}>
              {formatDate(post.createdAt)} • {moment(post.createdAt).fromNow()}
            </div>
          </div>
        </div>

        {/* Options Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOptionsClick();
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
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
            e.currentTarget.style.color = "#333";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#666";
          }}
        >
          <span className="material-icons" style={{ fontSize: "20px" }}>
            more_vert
          </span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(CardUser);