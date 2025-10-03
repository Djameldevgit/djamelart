// components/DetailPostCard.js
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CardHeader from './home/post_card/CardHeader';
import Comments from './home/Comments';
import InputComment from './home/InputComment';
import DescriptionPost from './home/post_card/DescriptionPost';
import Location from './home/post_card/Location';
import CardBodyCarousel from './home/post_card/CardBodyCarousel';
import VerifyModal from './authAndVerify/VerifyModal';
import DesactivateModal from './authAndVerify/DesactivateModal';
import { useTranslation } from "react-i18next";

const DetailPostCard = ({ post }) => {
    const { auth, languageReducer } = useSelector(state => state);
    const history = useHistory();
    const { t } = useTranslation('detailpost');
    const lang = languageReducer.language || 'en';

    const [showModal, setShowModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

    // Usar useCallback para evitar recrear la función en cada render
    const canProceed = useCallback(() => {
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
    }, [auth.token, auth.user]);

    // Función para manejar acciones que requieren autenticación
    const handleProtectedAction = useCallback((action) => {
        if (canProceed()) {
            action();
        }
    }, [canProceed]);

    const isAuthenticated = auth.token ? true : false;

    return (
        <div className="detail-post-container">
            <div className="detail-post-card">
                {/* Botón de regreso */}
                <button 
                    className="back-button"
                    onClick={() => history.goBack()}
                >
                    <span className="material-icons">arrow_back</span>
                    {t("back", { lng: lang })}
                </button>

                {/* Contenido principal */}
                <div className="detail-post-content">
                    {/* Sección de imagen/carousel */}
                    <div className="image-section">
                        <CardBodyCarousel post={post} />
                    </div>

                    {/* Sección de información */}
                    <div className="info-section">
                        <CardHeader post={post} />
                        
                        <div className="post-details">
                            <DescriptionPost post={post} />
                            <Location post={post} />
                        </div>

                        {/* Comentarios */}
                        <div className="comments-section">
                            {isAuthenticated ? (
                                <>
                                    <InputComment 
                                        post={post} 
                                        onCommentAttempt={() => {
                                            if (!canProceed()) {
                                                return false;
                                            }
                                            return true;
                                        }}
                                    />
                                    <Comments post={post} />
                                </>
                            ) : (
                                <div className="login-prompt" style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#666',
                                    border: '2px dashed #ddd',
                                    borderRadius: '10px',
                                    margin: '20px 0'
                                }}>
                                    <span className="material-icons" style={{ fontSize: '48px', color: '#ccc', marginBottom: '10px' }}>
                                        comment
                                    </span>
                                    <h4 style={{ margin: '10px 0', color: '#333' }}>
                                        {t("authenticationRequired", { lng: lang })}
                                    </h4>
                                    <p style={{ marginBottom: '20px' }}>
                                        {t("loginToViewComments", { lng: lang })}
                                    </p>
                                    <button 
                                        onClick={() => setShowModal(true)}
                                        style={{
                                            padding: '10px 20px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '25px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {t("loginToComment", { lng: lang })}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para usuarios no autenticados */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ 
                        position: 'relative', 
                        background: 'white', 
                        padding: '30px', 
                        borderRadius: '15px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
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

                        <h4 style={{ marginBottom: '15px', color: '#333' }}>
                            {t("authenticationRequired", { lng: lang })}
                        </h4>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            {t("loginToInteract", { lng: lang })}
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '10px' 
                        }}>
                            <button 
                                onClick={() => history.push("/login")}
                                style={{
                                    padding: '12px 20px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                }}
                            >
                                {t("login", { lng: lang })}
                            </button>
                            <button 
                                onClick={() => history.push("/register")}
                                style={{
                                    padding: '12px 20px',
                                    background: '#f8f9fa',
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                }}
                            >
                                {t("register", { lng: lang })}
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '12px 20px',
                                    background: 'transparent',
                                    color: '#666',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {t("cancel", { lng: lang })}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para verificación de email */}
            {showVerifyModal && (
                <VerifyModal 
                    show={showVerifyModal} 
                    onClose={() => setShowVerifyModal(false)} 
                />
            )}

            {/* Modal para cuenta desactivada */}
            {showDeactivatedModal && (
                <DesactivateModal 
                    show={showDeactivatedModal} 
                    onClose={() => setShowDeactivatedModal(false)} 
                />
            )}
        </div>
    );
};

export default DetailPostCard;