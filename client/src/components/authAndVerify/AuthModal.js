import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AuthModal = ({ show, onClose, closeOnOverlayClick = true }) => {
    const history = useHistory();
    const { t } = useTranslation('authmodal');
    const { languageReducer } = useSelector((state) => state);
    const lang = languageReducer.language || 'en';
    const modalRef = useRef(null);

    // Función para cerrar al hacer clic fuera del modal
    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // Función para cerrar con la tecla Escape
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (show) {
            // Agregar event listeners cuando el modal se muestra
            document.addEventListener('mousedown', handleOverlayClick);
            document.addEventListener('keydown', handleEscapeKey);
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleOverlayClick);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [show, closeOnOverlayClick]);

    if (!show) return null;

    const handleLogin = () => {
        history.push("/login");
        onClose();
    };

    const handleRegister = () => {
        history.push("/register");
        onClose();
    };

    return (
        <div className="modal-overlay" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: closeOnOverlayClick ? 'pointer' : 'default'
        }}>
            <div 
                ref={modalRef}
                className="modal-content" 
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "300px",
                    textAlign: "center",
                    cursor: "default"
                }}
                onClick={(e) => e.stopPropagation()} // Prevenir que el clic se propague al overlay
            >
                <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
                    {t("authenticationRequired", { lng: lang })}
                </h4>
                
                <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                    {t("pleaseLoginToContinue", { lng: lang })}
                </p>
                
                <div className="modal-buttons" style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <button 
                        onClick={handleLogin}
                        style={{
                            padding: "12px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "background-color 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                    >
                        {t("login", { lng: lang })}
                    </button>
                    
                    <button 
                        onClick={handleRegister}
                        style={{
                            padding: "12px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "background-color 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#1e7e34"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
                    >
                        {t("register", { lng: lang })}
                    </button>
                    
                    <button 
                        onClick={onClose}
                        style={{
                            padding: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "background-color 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#545b62"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#6c757d"}
                    >
                        {t("close", { lng: lang })}
                    </button>
                </div>

                {/* Opcional: Botón de cerrar en la esquina superior derecha */}
                {closeOnOverlayClick && (
                    <button 
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "none",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#999",
                            padding: "5px",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onMouseOver={(e) => e.target.style.color = "#333"}
                        onMouseOut={(e) => e.target.style.color = "#999"}
                        title={t("close", { lng: lang })}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthModal;