import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Card, Row, Col, Button, Spinner, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Person, Link45deg, Journal, Pencil, GeoAlt, Envelope, Telephone, Eye, EyeSlash, People, Shield } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

const Info = ({ id, auth, profile, dispatch }) => {
    const [userData, setUserData] = useState(null)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    const { theme, privacy } = useSelector(state => state)
    const { t, i18n } = useTranslation('profileinfo')
    const lang = i18n.language || 'es'
 

    // Detectar si es móvil
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

    // Cargar userData (propio o desde profile.users)
    useEffect(() => {
        setLoading(true)

        if (id === auth.user._id) {
            setUserData(auth.user)
            setLoading(false)
        }
        else if (profile.users && profile.users.length > 0) {
            const user = profile.users.find(user => user._id === id)
            if (user) {
                setUserData(user)
            }
            setLoading(false)
        }
        else if (profile.loading) {
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    }, [id, auth.user, profile.users, profile.loading])

    // Control del modal cuando se muestran listas
    useEffect(() => {
        if (showFollowers || showFollowing) {
            dispatch({ type: GLOBALTYPES.MODAL, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.MODAL, payload: false })
        }
    }, [showFollowers, showFollowing, dispatch])

    // ----------------------------
    // Helpers de privacidad & utils
    // ----------------------------

    // Normaliza niveles: acepta 'friends' o 'followers' como sinónimos
    const normalizeLevel = (level) => {
        if (!level) return level
        if (level === 'friends') return 'followers'
        return level
    }

    // Maneja arrays de followers que pueden contener ids (string) o objetos {_id}
    const isFollowerOf = (user, authId) => {
        if (!user || !user.followers) return false
        return user.followers.some(f => {
            if (!f) return false
            if (typeof f === 'object') return String(f._id) === String(authId)
            return String(f) === String(authId)
        })
    }

    const getPrivacyColor = (level) => {
        const l = normalizeLevel(level)
        switch (l) {
            case 'public':
                return '#28a745'; // Verde
            case 'followers':
                return '#ffc107'; // Amarillo
            case 'private':
                return '#dc3545'; // Rojo
            default:
                return '#6c757d'; // Gris
        }
    };

    const getPrivacyIcon = (level, size = 14) => {
        const l = normalizeLevel(level)
        switch (l) {
            case 'public':
                return <Eye size={size} />;
            case 'followers':
                return <People size={size} />;
            case 'private':
                return <EyeSlash size={size} />;
            default:
                return <Shield size={size} />;
        }
    };

    const getPrivacyText = (level) => {
        const l = normalizeLevel(level)
        switch (l) {
            case 'public':
                return t('public') || 'Público';
            case 'followers':
                return t('followersOnly') || 'Solo seguidores';
            case 'private':
                return t('onlyMe') || 'Solo yo';
            default:
                return level;
        }
    };

    // Obtener configuración actual de privacidad (del perfil visitado si existe)
    const getCurrentPrivacySettings = () => {
        // Si el perfil trae sus propios settings (recomendado)
        if (userData && userData.privacySettings) {
            return userData.privacySettings
        }
        // Fallback al estado global privacy (usualmente propio)
        return privacy?.privacySettings || {
            profile: 'public',
            posts: 'public',
            followers: 'public',
            following: 'public',
            likes: 'public',
            email: 'private',
            address: 'private',
            mobile: 'private'
        };
    };

    // ----------------------------
    // Funciones de verificación por campo (usando la configuración del perfil)
    // ----------------------------
    const canViewProfile = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const profilePrivacy = normalizeLevel(getCurrentPrivacySettings().profile || 'public')

        if (profilePrivacy === 'public') return true
        if (profilePrivacy === 'private') return false
        if (profilePrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return true
    }

    const canViewPosts = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const postsPrivacy = normalizeLevel(getCurrentPrivacySettings().posts || 'public')

        if (postsPrivacy === 'public') return true
        if (postsPrivacy === 'private') return false
        if (postsPrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return true
    }

    const canViewFollowers = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const followersPrivacy = normalizeLevel(getCurrentPrivacySettings().followers || 'public')

        if (followersPrivacy === 'public') return true
        if (followersPrivacy === 'private') return false
        if (followersPrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return true
    }

    const canViewFollowing = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const followingPrivacy = normalizeLevel(getCurrentPrivacySettings().following || 'public')

        if (followingPrivacy === 'public') return true
        if (followingPrivacy === 'private') return false
        if (followingPrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return true
    }

    const canViewLikes = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const likesPrivacy = normalizeLevel(getCurrentPrivacySettings().likes || 'public')

        if (likesPrivacy === 'public') return true
        if (likesPrivacy === 'private') return false
        if (likesPrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return true
    }

    const canViewEmail = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const emailPrivacy = normalizeLevel(getCurrentPrivacySettings().email || 'private')

        if (emailPrivacy === 'public') return true
        if (emailPrivacy === 'private') return false
        if (emailPrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return false
    }

    const canViewMobile = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const mobilePrivacy = normalizeLevel(getCurrentPrivacySettings().mobile || 'private')

        if (mobilePrivacy === 'public') return true
        if (mobilePrivacy === 'private') return false
        if (mobilePrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return false
    }

    const canViewAddress = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true

        const addressPrivacy = normalizeLevel(getCurrentPrivacySettings().address || 'private')

        if (addressPrivacy === 'public') return true
        if (addressPrivacy === 'private') return false
        if (addressPrivacy === 'followers') {
            return isFollowerOf(userData, auth.user._id)
        }
        return false
    }

    // Componente de Icono de Privacidad con Tooltip
    const PrivacyIcon = ({ level, category, size = 14, className = "" }) => {
        const privacyText = getPrivacyText(level);

        return (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip>
                        <strong>{category}:</strong> {privacyText}
                    </Tooltip>
                }
            >
                <span
                    className={`privacy-icon ${className}`}
                    style={{
                        color: getPrivacyColor(level),
                        cursor: 'help'
                    }}
                >
                    {getPrivacyIcon(level, size)}
                </span>
            </OverlayTrigger>
        );
    };

    // Handlers seguros para abrir modals
    const handleShowFollowers = (e) => {
        if (!canViewFollowers()) return

        if (e) {
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent?.stopImmediatePropagation()
        }

        if (isMobile) {
            setTimeout(() => {
                setShowFollowers(true)
            }, 50)
        } else {
            setShowFollowers(true)
        }
    }

    const handleShowFollowing = (e) => {
        if (!canViewFollowing()) return

        if (e) {
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent?.stopImmediatePropagation()
        }

        if (isMobile) {
            setTimeout(() => {
                setShowFollowing(true)
            }, 50)
        } else {
            setShowFollowing(true)
        }
    }

    // Estadísticas (igual que antes)
    const calculateStats = (user) => {
        if (!user) return { followers: 0, following: 0, totalPosts: 0, totalLikes: 0 }

        const userPosts = profile.posts?.find(p => p._id === id)
        const totalPosts = userPosts ? userPosts.posts?.length || 0 : 0
        const totalLikes = userPosts ? userPosts.posts?.reduce((sum, post) => sum + (post.likes?.length || 0), 0) : 0

        return {
            followers: user.followers?.length || 0,
            following: user.following?.length || 0,
            totalPosts,
            totalLikes
        }
    }

    if (loading) {
        return (
            <Card className="info-component border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">{t('loadingProfile')}</p>
                </Card.Body>
            </Card>
        )
    }

    if (!userData || !canViewProfile()) {
        return (
            <Card className="info-component border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-5">
                    <EyeSlash size={48} className="text-muted mb-3" />
                    <h5>{t('profilePrivate')}</h5>
                    <p className="text-muted">{t('profileNotAccessible')}</p>
                    {!auth.user && (
                        <Button variant="primary" onClick={() => window.location.href = '/login'}>
                            {t('loginToView')}
                        </Button>
                    )}
                </Card.Body>
            </Card>
        )
    }

    const stats = calculateStats(userData)
    const isCurrentUser = userData._id === auth.user._id
    const currentPrivacy = getCurrentPrivacySettings()

    return (
        <Card className="info-component border-0 shadow-sm mb-2"
            style={{
                background: theme ? '#2d3748' : 'white',
                color: theme ? 'white' : 'inherit',
                fontFamily: lang === 'ar' ? 'Tahoma, Arial, sans-serif' : 'inherit'
            }}>


{auth.user._id !== userData._id && (
  <div>
    <h2>Prueba de privacidad</h2>
    {console.log("DEBUG privacidad email:", privacy.privacySettings?.email)}

    {privacy.privacySettings?.email === "public" && (
      <div style={{ padding: "10px", background: "#d1e7dd" }}>
        <p>{userData.email}</p>
      </div>
    )}

    {privacy.privacySettings?.email === "friends" && (
      <div style={{ padding: "10px", background: "#cff4fc" }}>
        <p>{userData.email} (solo amigos)</p>
      </div>
    )}

    {privacy.privacySettings?.email === "private" && (
      <div style={{ padding: "10px", background: "#f8d7da" }}>
        <p>📧 Email oculto por privacidad</p>
      </div>
    )}
  </div>
)}



           








            <Card.Body className="p-4">
                {/* Primera Fila: Avatar y información básica */}
                <Row className="text-center mb-2">
                    <Col>
                        <div className="position-relative d-inline-block">
                            <Avatar
                                src={userData.avatar}
                                size="supper-avatar"
                                className="border-4 border-white shadow"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    border: '4px solid white',
                                    boxShadow: theme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            {isCurrentUser && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="position-absolute bottom-0 end-0 rounded-circle shadow"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none'
                                    }}
                                    onClick={() => window.location.href = `/profile/${id}/editprofilepage`}
                                    title={t('editProfile')}
                                >
                                    <Pencil size={16} />
                                </Button>
                            )}
                        </div>

                        <div className="mt-3">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <h3 className="fw-bold mb-0 me-2" style={{
                                    color: theme ? '#f7fafc' : '#2d3748',
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                                }}>
                                    {userData.username}
                                </h3>
                                {/* Icono de privacidad del perfil */}
                                <PrivacyIcon
                                    level={currentPrivacy.profile}
                                    category="Perfil"
                                    size={16}
                                />
                            </div>

                            {userData.fullname && (
                                <p className="text-muted fw-medium" style={{
                                    fontSize: '1.1rem',
                                    color: theme ? '#cbd5e0' : '#6c757d'
                                }}>
                                    {userData.fullname}
                                </p>
                            )}

                            {userData.presentacion && (
                                <div className="bio-section p-3 rounded-3 mt-2" style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.profile)}`
                                }}>
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <strong className="text-break fst-italic" style={{
                                            color: theme ? '#e2e8f0' : '#4a5568',
                                            fontSize: '0.95rem',
                                            lineHeight: '1.4'
                                        }}>
                                            "{userData.presentacion}"
                                        </strong>
                                        <PrivacyIcon
                                            level={currentPrivacy.profile}
                                            category="Presentación"
                                            size={12}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isCurrentUser && (
                            <div className="mt-3">
                                <FollowBtn user={userData} />
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Segunda Fila: Estadísticas COMPACTAS con iconos de privacidad */}
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex flex-nowrap overflow-auto justify-content-center gap-2 gap-sm-3 py-2"
                            style={{ maxWidth: '100vw', scrollbarWidth: 'none' }}>

                            {/* Seguidores */}
                            <div
                                className={`text-center px-3 py-3 rounded border shadow-sm position-relative ${canViewFollowers() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                    }`}
                                onClick={canViewFollowers() ? handleShowFollowers : undefined}
                                style={{
                                    minWidth: '85px',
                                    background: 'transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: canViewFollowers() ? 'pointer' : 'not-allowed',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.followers)} !important`,
                                    paddingTop: '2rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (canViewFollowers()) {
                                        e.target.style.background = theme ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent'
                                }}
                            >
                                {/* Icono de privacidad en la esquina superior derecha */}
                                <div className="position-absolute top-0 end-0 m-1">
                                    <PrivacyIcon
                                        level={currentPrivacy.followers}
                                        category="Seguidores"
                                        size={12}
                                    />
                                </div>

                                <div className="fw-bold" style={{
                                    fontSize: '1.2rem',
                                    color: canViewFollowers()
                                        ? (theme ? '#feb2b12' : '#dc2626') // slight correction: keep visual contrast
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewFollowers() ? stats.followers : <EyeSlash size={16} />}
                                </div>
                                <div className="small" style={{
                                    color: canViewFollowers()
                                        ? (theme ? '#cbd5e0' : '#6c757d')
                                        : (theme ? '#718096' : '#a0aec0')
                                }}>
                                    {t('followers')}
                                </div>
                            </div>

                            {/* Siguiendo */}
                            <div
                                className={`text-center px-3 py-3 rounded border shadow-sm position-relative ${canViewFollowing() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                    }`}
                                onClick={canViewFollowing() ? handleShowFollowing : undefined}
                                style={{
                                    minWidth: '85px',
                                    background: 'transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: canViewFollowing() ? 'pointer' : 'not-allowed',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.following)} !important`,
                                    paddingTop: '2rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (canViewFollowing()) {
                                        e.target.style.background = theme ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent'
                                }}
                            >
                                <div className="position-absolute top-0 end-0 m-1">
                                    <PrivacyIcon
                                        level={currentPrivacy.following}
                                        category="Siguiendo"
                                        size={12}
                                    />
                                </div>

                                <div className="fw-bold" style={{
                                    fontSize: '1.2rem',
                                    color: canViewFollowing()
                                        ? (theme ? '#9ae6b4' : '#16a34a')
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewFollowing() ? stats.following : <EyeSlash size={16} />}
                                </div>
                                <div className="small" style={{
                                    color: canViewFollowing()
                                        ? (theme ? '#cbd5e0' : '#6c757d')
                                        : (theme ? '#718096' : '#a0aec0')
                                }}>
                                    {t('following')}
                                </div>
                            </div>

                            {/* Publicaciones */}
                            <div
                                className={`text-center px-3 py-3 rounded border shadow-sm position-relative ${canViewPosts() ? '' : 'opacity-50'
                                    }`}
                                style={{
                                    minWidth: '85px',
                                    background: 'transparent',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.posts)} !important`,
                                    paddingTop: '2rem'
                                }}
                            >
                                <div className="position-absolute top-0 end-0 m-1">
                                    <PrivacyIcon
                                        level={currentPrivacy.posts}
                                        category="Publicaciones"
                                        size={12}
                                    />
                                </div>

                                <div className="fw-bold" style={{
                                    fontSize: '1.2rem',
                                    color: canViewPosts()
                                        ? (theme ? '#90cdf4' : '#2563eb')
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewPosts() ? stats.totalPosts : <EyeSlash size={16} />}
                                </div>
                                <div className="small" style={{
                                    color: canViewPosts()
                                        ? (theme ? '#cbd5e0' : '#6c757d')
                                        : (theme ? '#718096' : '#a0aec0')
                                }}>
                                    {t('posts')}
                                </div>
                            </div>

                            {/* Likes */}
                            <div
                                className={`text-center px-3 py-3 rounded border shadow-sm position-relative ${canViewLikes() ? '' : 'opacity-50'
                                    }`}
                                style={{
                                    minWidth: '85px',
                                    background: 'transparent',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.likes)} !important`,
                                    paddingTop: '2rem'
                                }}
                            >
                                <div className="position-absolute top-0 end-0 m-1">
                                    <PrivacyIcon
                                        level={currentPrivacy.likes}
                                        category="Likes"
                                        size={12}
                                    />
                                </div>

                                <div className="fw-bold" style={{
                                    fontSize: '1.2rem',
                                    color: canViewLikes()
                                        ? (theme ? '#fbb6ce' : '#db2777')
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewLikes() ? stats.totalLikes : <EyeSlash size={16} />}
                                </div>
                                <div className="small" style={{
                                    color: canViewLikes()
                                        ? (theme ? '#cbd5e0' : '#6c757d')
                                        : (theme ? '#718096' : '#a0aec0')
                                }}>
                                    {t('likes')}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Tercera Fila: Biografía con icono de privacidad */}
                {userData.story && canViewProfile() && (
                    <Row className="mb-3">
                        <Col>
                            <div className="bio-section p-3 rounded-3 shadow-sm position-relative"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.profile)}`,
                                    backgroundImage: theme
                                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
                                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.02) 100%)'
                                }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <Journal className="me-2" style={{ color: theme ? '#f6ad55' : '#d97706' }} />
                                        <h6 className="mb-0 fw-bold" style={{
                                            color: theme ? '#f6ad55' : '#d97706',
                                            fontSize: '0.9rem'
                                        }}>
                                            {t('biography')}
                                        </h6>
                                    </div>
                                    <PrivacyIcon
                                        level={currentPrivacy.profile}
                                        category="Biografía"
                                        size={14}
                                    />
                                </div>
                                <p className="mb-0 text-break" style={{
                                    color: theme ? '#e2e8f0' : '#4a5568',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}>
                                    {userData.story}
                                </p>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Cuarta Fila: Información de contacto y redes con iconos de privacidad */}
                <Row>
                    <Col md={6}>
                        {(userData.email || userData.address || userData.mobile) && (
                            <div className="contact-info p-3 rounded-3 shadow-sm"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                    border: `2px dashed ${getPrivacyColor(currentPrivacy.profile)}`,
                                    backgroundImage: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.05) 100%)'
                                }}>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h6 className="mb-0 fw-bold d-flex align-items-center" style={{
                                        color: theme ? '#68d391' : '#16a34a',
                                        fontSize: '0.9rem'
                                    }}>
                                        <Person className="me-1" />
                                        {t('contactInfo')}
                                    </h6>
                                    <PrivacyIcon
                                        level={currentPrivacy.profile}
                                        category="Información de Contacto"
                                        size={14}
                                    />
                                </div>

                                {/* Email con control de privacidad */}
                                {/* Email con control de privacidad */}
                                {userData.email && (
                                    <div className="mb-3 d-flex align-items-center justify-content-between p-2 rounded"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                                        }}>
                                        <div className="d-flex align-items-center">
                                            <Envelope className="me-2" style={{
                                                color: theme ? '#90cdf4' : '#2563eb',
                                                width: '16px'
                                            }} />
                                            <div>
                                                <div style={{
                                                    color: theme ? '#e2e8f0' : '#4a5568',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {auth.user._id === userData._id ? (
                                                        // 👤 Si es el dueño → siempre ve su email
                                                        userData.email
                                                    ) : (
                                                        privacy.privacySettings.email === "public" ? (
                                                            userData.email
                                                        ) : privacy.privacySettings.email === "followers" ? (
                                                            isFollowerOf(userData, auth.user._id)
                                                                ? userData.email
                                                                : "📧 Email solo visible para seguidores"
                                                        ) : (
                                                            "📧 Email oculto por privacidad"
                                                        )
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <PrivacyIcon
                                            level={currentPrivacy.email}
                                            category="Email"
                                            size={12}
                                        />
                                    </div>
                                )}


                                {/* Dirección con control de privacidad */}
                                {userData.address && (
                                    <div className="mb-3 d-flex align-items-center justify-content-between p-2 rounded"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                                        }}>
                                        <div className="d-flex align-items-center">
                                            <GeoAlt className="me-2" style={{
                                                color: theme ? '#f6ad55' : '#d97706',
                                                width: '16px'
                                            }} />
                                            <div>
                                                <div style={{
                                                    color: theme ? '#e2e8f0' : '#4a5568',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {canViewAddress() ? userData.address : '••••••••••••••••••'}
                                                </div>
                                            </div>
                                        </div>
                                        <PrivacyIcon
                                            level={currentPrivacy.address}
                                            category="Dirección"
                                            size={12}
                                        />
                                    </div>
                                )}

                                {/* Teléfono con control de privacidad */}
                                {userData.mobile && (
                                    <div className="d-flex align-items-center justify-content-between p-2 rounded"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                                        }}>
                                        <div className="d-flex align-items-center">
                                            <Telephone className="me-2" style={{
                                                color: theme ? '#fc8181' : '#dc2626',
                                                width: '16px'
                                            }} />
                                            <div>
                                                <div style={{
                                                    color: theme ? '#e2e8f0' : '#4a5568',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {canViewMobile() ? userData.mobile : '•••••••••'}
                                                </div>
                                            </div>
                                        </div>
                                        <PrivacyIcon
                                            level={currentPrivacy.mobile}
                                            category="Teléfono"
                                            size={12}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </Col>

                    <Col md={6}>
                        {userData.website && canViewProfile() && (
                            <div className="links-section p-3 rounded-3 shadow-sm"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                    border: `2px solid ${getPrivacyColor(currentPrivacy.profile)}`,
                                    backgroundImage: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)'
                                }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0 fw-bold" style={{
                                        color: theme ? '#a78bfa' : '#7c3aed',
                                        fontSize: '0.9rem'
                                    }}>
                                        <Link45deg className="me-1" />
                                        {t('links')}
                                    </h6>
                                    <PrivacyIcon
                                        level={currentPrivacy.profile}
                                        category="Enlaces"
                                        size={14}
                                    />
                                </div>
                                <a
                                    href={userData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-block text-decoration-none mb-1 mt-1 p-2 rounded"
                                    style={{
                                        wordBreak: 'break-all',
                                        color: theme ? '#90cdf4' : '#2563eb',
                                        fontSize: '0.85rem',
                                        transition: 'all 0.3s ease',
                                        background: theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = theme ? '#63b3ed' : '#1d4ed8';
                                        e.target.style.background = theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = theme ? '#90cdf4' : '#2563eb';
                                        e.target.style.background = theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
                                    }}
                                >
                                    {userData.website}
                                </a>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Modals */}
                {showFollowers && (
                    <div style={{ position: 'fixed', zIndex: 1050, top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Followers
                            users={userData.followers}
                            setShowFollowers={setShowFollowers}
                        />
                    </div>
                )}

                {showFollowing && (
                    <div style={{ position: 'fixed', zIndex: 1050, top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Following
                            users={userData.following}
                            setShowFollowing={setShowFollowing}
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default Info
