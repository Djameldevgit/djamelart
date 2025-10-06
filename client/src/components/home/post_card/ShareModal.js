import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon
} from 'react-share';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const ShareModal = ({ show, onHide, post, t }) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();

  if (!show) return null;

  const shareUrl = `${window.location.origin}/post/${post._id}`;
  const shareTitle = `${t('artworkBy')} ${post.user?.username || t('artist')}: "${post.content?.substring(0, 80)}..." - ${t('seeMoreAt')} Tassili Art`;
  const imageUrl = post.images?.[0]?.url || post.user?.avatar;

  const handleCopy = (message) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: message }
    });
  };

  const socialButtons = [
    { 
      Component: FacebookShareButton, 
      Icon: FacebookIcon, 
      name: 'Facebook', 
      props: { url: shareUrl, quote: shareTitle } 
    },
    { 
      Component: TwitterShareButton, 
      Icon: TwitterIcon, 
      name: 'Twitter', 
      props: { url: shareUrl, title: shareTitle } 
    },
    { 
      Component: WhatsappShareButton, 
      Icon: WhatsappIcon, 
      name: 'WhatsApp', 
      props: { url: shareUrl, title: shareTitle } 
    },
    { 
      Component: TelegramShareButton, 
      Icon: TelegramIcon, 
      name: 'Telegram', 
      props: { url: shareUrl, title: shareTitle } 
    },
    { 
      Component: EmailShareButton, 
      Icon: EmailIcon, 
      name: 'Email', 
      props: { url: shareUrl, subject: t('artwork'), body: shareTitle } 
    }
  ];

  if (imageUrl) {
    socialButtons.splice(3, 0, {
      Component: PinterestShareButton,
      Icon: PinterestIcon,
      name: 'Pinterest',
      props: { url: shareUrl, media: imageUrl, description: shareTitle }
    });
  }

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease',
          padding: '20px'
        }}
        onClick={onHide}
      >
        {/* Modal */}
        <div 
          style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            animation: 'slideUp 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span className="material-icons" style={{ color: '#0095f6', fontSize: '28px' }}>
                share
              </span>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#333'
              }}>
                {t('shareArt')}
              </h3>
            </div>
            <button
              onClick={onHide}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-icons" style={{ fontSize: '24px', color: '#666' }}>
                close
              </span>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            {/* Alert de copiado */}
            {copied && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'slideDown 0.3s ease'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>
                  check_circle
                </span>
                <span>{t('linkCopied')}</span>
              </div>
            )}

            {/* Redes Sociales */}
            <div style={{ marginBottom: '30px' }}>
              <h6 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '16px'
              }}>
                {t('shareOnSocial')}
              </h6>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                {socialButtons.map(({ Component, Icon, name, props }, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}>
                    <Component {...props}>
                      <div style={{
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Icon size={50} round />
                      </div>
                    </Component>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#666',
                      marginTop: '8px'
                    }}>
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compartir Manualmente */}
            <div style={{
              borderTop: '1px solid #e0e0e0',
              paddingTop: '20px'
            }}>
              <h6 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '16px'
              }}>
                {t('manualShare')}
              </h6>

              {/* Texto para compartir */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  {t('shareText')}
                </label>
                <textarea
                  value={shareTitle}
                  readOnly
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    resize: 'none',
                    fontFamily: 'inherit',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
                <CopyToClipboard
                  text={shareTitle}
                  onCopy={() => handleCopy(t('textCopied'))}
                >
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#0095f6',
                    border: '1px solid #0095f6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0095f6';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#0095f6';
                  }}
                  >
                    <span className="material-icons" style={{ fontSize: '18px' }}>
                      content_copy
                    </span>
                    {t('copyText')}
                  </button>
                </CopyToClipboard>
              </div>

              {/* Link del post */}
              <div>
                <label style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  {t('postLink')}
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f8f9fa',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <CopyToClipboard
                    text={shareUrl}
                    onCopy={() => handleCopy(t('linkCopied'))}
                  >
                    <button style={{
                      padding: '12px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <span className="material-icons" style={{ fontSize: '20px', color: '#666' }}>
                        content_copy
                      </span>
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onHide}
              style={{
                padding: '10px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px); 
            }
            to { 
              opacity: 1;
              transform: translateY(0); 
            }
          }
          
          @keyframes slideDown {
            from { 
              opacity: 0;
              transform: translateY(-10px); 
            }
            to { 
              opacity: 1;
              transform: translateY(0); 
            }
          }
        `}
      </style>
    </>
  );
};

export default ShareModal;