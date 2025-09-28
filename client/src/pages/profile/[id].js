import React, { useEffect, useState } from 'react'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import Saved from '../../components/profile/Saved'
import { useSelector, useDispatch } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import { getProfileUsers } from '../../redux/actions/profileAction'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap'
import {
    Grid3x3Gap,
    Bookmark,
    Gear,
    PersonLinesFill
} from 'react-bootstrap-icons'

const Profile = () => {
    const { profile, auth, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const { t } = useTranslation('profile')
    const history = useHistory()
    const lang = languageReducer?.language || 'en'

    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('posts')
    const [isMobile, setIsMobile] = useState(false)

    // Detectar si es pantalla pequeña
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    useEffect(() => {
        if (profile.ids.every(item => item !== id)) {
            dispatch(getProfileUsers({ id, auth }))
        }
    }, [id, auth, dispatch, profile.ids])

    const isCurrentUser = auth.user._id === id;

    // Función segura para redirección que previene conflictos
    const handleEditProfile = (e) => {
        if (e) e.stopPropagation()
        // Pequeño delay para asegurar que los eventos se procesen
        setTimeout(() => {
            history.push(`/profile/${id}/privacysettings`)
        }, isMobile ? 100 : 0)
    }

    const handleProfileInfo = (e) => {
        if (e) e.stopPropagation()
        setTimeout(() => {
            history.push(`/profile/${id}/infouser`)
        }, isMobile ? 100 : 0)
    }

    // Manejo seguro de clicks en pestañas
    const handleTabClick = (tabName, e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        
        setActiveTab(tabName)
        
        // En móviles, agregamos un pequeño delay para evitar conflictos
        if (isMobile) {
            setTimeout(() => {
                if (tabName === 'edit') {
                    history.push(`/profile/${id}/privacysettings`)
                } else if (tabName === 'profile_info') {
                    history.push(`/profile/${id}/infouser`)
                }
            }, 150)
        } else {
            if (tabName === 'edit') {
                history.push(`/profile/${id}/privacysettings`)
            } else if (tabName === 'profile_info') {
                history.push(`/profile/${id}/infouser`)
            }
        }
    }

    return (
        <div className="profile" style={{ position: 'relative' }}>

            <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

            {/* Barra de pestañas con protección para móviles */}
            <div 
                className="profile_tab mb-2" 
                style={{ 
                    position: isMobile ? 'relative' : 'static',
                    zIndex: isMobile ? 1 : 'auto'
                }}
            >
                <div className="d-flex justify-content-center">
                    <ButtonGroup 
                        className="flex-nowrap overflow-auto py-1" 
                        role="group" 
                        style={{ 
                            maxWidth: '100vw',
                            position: 'relative',
                            zIndex: isMobile ? 2 : 'auto'
                        }}
                    >
                        {/* Posts */}
                        <Button
                            variant={activeTab === 'posts' ? 'dark' : 'outline-dark'}
                            onClick={(e) => handleTabClick('posts', e)}
                            className="d-flex flex-column align-items-center px-3 px-sm-4"
                            size="sm"
                            style={{ position: 'relative', zIndex: 3 }}
                        >
                            <Grid3x3Gap size={22} className="mb-1" />
                            <span className="d-none d-lg-block small fw-medium">{t('posts', { lng: lang })}</span>
                        </Button>

                        {/* Saved Posts - Solo usuario actual */}
                        {isCurrentUser && (
                            <Button
                                variant={activeTab === 'saved' ? 'dark' : 'outline-dark'}
                                onClick={(e) => handleTabClick('saved', e)}
                                className="d-flex flex-column align-items-center px-3 px-sm-4"
                                size="sm"
                                style={{ position: 'relative', zIndex: 3 }}
                            >
                                <Bookmark size={20} className="mb-1" />
                                <span className="d-none d-lg-block small fw-medium">{t('saved', { lng: lang })}</span>
                            </Button>
                        )}

                        {/* Edit Profile - Solo usuario actual */}
                        {isCurrentUser && (
                            <Button
                                variant={activeTab === 'edit' ? 'dark' : 'outline-dark'}
                                onClick={(e) => handleTabClick('edit', e)}
                                className="d-flex flex-column align-items-center px-3 px-sm-4"
                                size="sm"
                                style={{ position: 'relative', zIndex: 3 }}
                            >
                                <Gear size={20} className="mb-1" />
                                <span className="d-none d-lg-block small fw-medium">
                                    {t('privacysettings', { lng: lang })}
                                </span>
                            </Button>
                        )}

                        {/* Profile Info - Solo usuario actual */}
                        {isCurrentUser && (
                            <Button
                                variant={activeTab === 'profile_info' ? 'dark' : 'outline-dark'}
                                onClick={(e) => handleTabClick('profile_info', e)}
                                className="d-flex flex-column align-items-center px-3 px-sm-4"
                                size="sm"
                                style={{ position: 'relative', zIndex: 3 }}
                            >
                                <PersonLinesFill size={20} className="mb-1" />
                                <span className="d-none d-lg-block small fw-medium">{t('profile_info', { lng: lang })}</span>
                            </Button>
                        )}
                    </ButtonGroup>
                </div>
            </div>

            {profile.loading ? (
                <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
            ) : (
                <div 
                    className="profile-content"
                    style={{
                        position: 'relative',
                        zIndex: isMobile ? 0 : 'auto'
                    }}
                >
                    {isCurrentUser ? (
                        <Row>
                            {/* Posts */}
                            <Col xs={12} className={activeTab !== 'posts' ? 'd-none' : ''}>
                                <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                            </Col>

                            {/* Saved Posts */}
                            <Col xs={12} className={activeTab !== 'saved' ? 'd-none' : ''}>
                                <Saved auth={auth} dispatch={dispatch} />
                            </Col>

                            {/* Mensajes de redirección */}
                            <Col xs={12} className={activeTab !== 'edit' && activeTab !== 'profile_info' ? 'd-none' : ''}>
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p className="mt-3 text-muted">
                                        {activeTab === 'edit' 
                                            ? 'Redirigiendo a configuración de privacidad...' 
                                            : 'Redirigiendo a información del perfil...'
                                        }
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={activeTab === 'edit' ? handleEditProfile : handleProfileInfo}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        // Para otros usuarios - Solo pueden ver posts
                        <Row>
                            <Col xs={12}>
                                <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                            </Col>
                        </Row>
                    )}
                </div>
            )}

            {/* Overlay protector para móviles */}
            {isMobile && (activeTab === 'edit' || activeTab === 'profile_info') && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.01)',
                        zIndex: 9999
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            )}
        </div>
    )
}

export default Profile