import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Card, Row, Col, Button, Spinner, Badge } from 'react-bootstrap'
import { Person, Link45deg, Journal, Pencil, GeoAlt, Envelope, Telephone, Eye, EyeSlash } from 'react-bootstrap-icons'
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

    useEffect(() => {
        if (showFollowers || showFollowing) {
            dispatch({ type: GLOBALTYPES.MODAL, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.MODAL, payload: false })
        }
    }, [showFollowers, showFollowing, dispatch])

    // 🔐 FUNCIONES DE VERIFICACIÓN DE PRIVACIDAD
    const canViewProfile = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true // El usuario siempre puede verse a sí mismo
        
        const userPrivacy = privacy?.privacySettings || {}
        const profilePrivacy = userPrivacy.profile || 'public'
        
        if (profilePrivacy === 'public') return true
        if (profilePrivacy === 'private') return false
        if (profilePrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return true
    }

    const canViewPosts = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const postsPrivacy = userPrivacy.posts || 'public'
        
        if (postsPrivacy === 'public') return true
        if (postsPrivacy === 'private') return false
        if (postsPrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return true
    }

    const canViewFollowers = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const followersPrivacy = userPrivacy.followers || 'public'
        
        if (followersPrivacy === 'public') return true
        if (followersPrivacy === 'private') return false
        if (followersPrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return true
    }

    const canViewFollowing = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const followingPrivacy = userPrivacy.following || 'public'
        
        if (followingPrivacy === 'public') return true
        if (followingPrivacy === 'private') return false
        if (followingPrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return true
    }

    const canViewLikes = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const likesPrivacy = userPrivacy.likes || 'public'
        
        if (likesPrivacy === 'public') return true
        if (likesPrivacy === 'private') return false
        if (likesPrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return true
    }

    const canViewEmail = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const emailPrivacy = userPrivacy.email || 'private'
        
        if (emailPrivacy === 'public') return true
        if (emailPrivacy === 'private') return false
        if (emailPrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return false
    }

    const canViewMobile = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const mobilePrivacy = userPrivacy.mobile || 'private'
        
        if (mobilePrivacy === 'public') return true
        if (mobilePrivacy === 'private') return false
        if (mobilePrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return false
    }

    const canViewAddress = () => {
        if (!userData) return false
        if (auth.user._id === userData._id) return true
        
        const userPrivacy = privacy?.privacySettings || {}
        const addressPrivacy = userPrivacy.address || 'private'
        
        if (addressPrivacy === 'public') return true
        if (addressPrivacy === 'private') return false
        if (addressPrivacy === 'followers') {
            return userData.followers?.some(follower => follower._id === auth.user._id) || false
        }
        return false
    }

    // Función segura para abrir modals
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

    return (
        <Card className="info-component border-0 shadow-sm mb-2"
            style={{
                background: theme ? '#2d3748' : 'white',
                color: theme ? 'white' : 'inherit',
                fontFamily: lang === 'ar' ? 'Tahoma, Arial, sans-serif' : 'inherit'
            }}>
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

                        <div className="">
                            <h3 className="fw-bold" style={{
                                color: theme ? '#f7fafc' : '#2d3748',
                                textShadow: theme ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                            }}>
                                {userData.username}
                            </h3>
                            {userData.fullname && (
                                <p className="text-muted fw-medium" style={{
                                    fontSize: '1.1rem',
                                    color: theme ? '#cbd5e0' : '#6c757d'
                                }}>
                                    {userData.fullname}
                                </p>
                            )}
                            {userData.presentacion && (
                                <div className="bio-section p-1 rounded-3" style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    border: '1px solid rgba(102, 126, 234, 0.2)'
                                }}>
                                    <strong className="mb-0 text-break fst-italic" style={{ 
                                        color: theme ? '#e2e8f0' : '#4a5568',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4'
                                    }}>
                                        "{userData.presentacion}"
                                    </strong>
                                </div>
                            )}
                        </div>

                        {!isCurrentUser && (
                            <div className="mt-1">
                                <FollowBtn user={userData} />
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Segunda Fila: Estadísticas COMPACTAS en una sola fila */}
                <Row className="mb-1">
                    <Col>
                        <div className="d-flex flex-nowrap overflow-auto justify-content-center gap-1 gap-sm-2 py-1"
                            style={{ maxWidth: '100vw', scrollbarWidth: 'none' }}>

                            {/* Seguidores */}
                            <div
                                className={`text-center px-2 px-sm-3 py-2 rounded border shadow-sm ${
                                    canViewFollowers() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                }`}
                                onClick={canViewFollowers() ? handleShowFollowers : undefined}
                                style={{
                                    minWidth: '70px',
                                    background: 'transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: canViewFollowers() ? 'pointer' : 'not-allowed',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'} !important`
                                }}
                                onMouseEnter={(e) => {
                                    if (canViewFollowers()) {
                                        e.target.style.background = theme ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent'
                                }}
                                title={!canViewFollowers() ? t('followersPrivate') : ''}
                            >
                                <div className="fw-bold" style={{ 
                                    fontSize: '1rem', 
                                    color: canViewFollowers() 
                                        ? (theme ? '#feb2b2' : '#dc2626') 
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewFollowers() ? stats.followers : <EyeSlash size={14} />}
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
                                className={`text-center px-2 px-sm-3 py-2 rounded border shadow-sm ${
                                    canViewFollowing() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                }`}
                                onClick={canViewFollowing() ? handleShowFollowing : undefined}
                                style={{
                                    minWidth: '70px',
                                    background: 'transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: canViewFollowing() ? 'pointer' : 'not-allowed',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'} !important`
                                }}
                                onMouseEnter={(e) => {
                                    if (canViewFollowing()) {
                                        e.target.style.background = theme ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent'
                                }}
                                title={!canViewFollowing() ? t('followingPrivate') : ''}
                            >
                                <div className="fw-bold" style={{ 
                                    fontSize: '1rem', 
                                    color: canViewFollowing() 
                                        ? (theme ? '#9ae6b4' : '#16a34a') 
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewFollowing() ? stats.following : <EyeSlash size={14} />}
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
                                className={`text-center px-2 px-sm-3 py-2 rounded border shadow-sm ${
                                    canViewPosts() ? '' : 'opacity-50'
                                }`}
                                style={{
                                    minWidth: '70px',
                                    background: 'transparent',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'} !important`
                                }}
                                title={!canViewPosts() ? t('postsPrivate') : ''}
                            >
                                <div className="fw-bold" style={{ 
                                    fontSize: '1rem', 
                                    color: canViewPosts() 
                                        ? (theme ? '#90cdf4' : '#2563eb') 
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewPosts() ? stats.totalPosts : <EyeSlash size={14} />}
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
                                className={`text-center px-2 px-sm-3 py-2 rounded border shadow-sm ${
                                    canViewLikes() ? '' : 'opacity-50'
                                }`}
                                style={{
                                    minWidth: '70px',
                                    background: 'transparent',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'} !important`
                                }}
                                title={!canViewLikes() ? t('likesPrivate') : ''}
                            >
                                <div className="fw-bold" style={{ 
                                    fontSize: '1rem', 
                                    color: canViewLikes() 
                                        ? (theme ? '#fbb6ce' : '#db2777') 
                                        : (theme ? '#718096' : '#a0aec0'),
                                    textShadow: theme ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {canViewLikes() ? stats.totalLikes : <EyeSlash size={14} />}
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

                {/* Tercera Fila: Biografía - Solo si está permitido ver el perfil */}
                {userData.story && canViewProfile() && (
                    <Row className="">
                        <Col>
                            <div className="bio-section p-1 rounded-3 shadow-sm"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'}`,
                                    backgroundImage: theme 
                                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
                                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.02) 100%)'
                                }}>
                                <div className="d-flex align-items-center mb-2">
                                    <Journal className="me-2" style={{ color: theme ? '#f6ad55' : '#d97706' }} />
                                    <h6 className="mb-0 fw-bold" style={{ 
                                        color: theme ? '#f6ad55' : '#d97706',
                                        fontSize: '0.9rem'
                                    }}>
                                        {t('biography')}
                                    </h6>
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

                {/* Cuarta Fila: Información de contacto y redes - Con controles de privacidad */}
                <Row>
                    <Col md={6}>
                        {(userData.email || userData.address || userData.mobile) && (
                            <div className="contact-info p-3 rounded-3 shadow-sm"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'}`,
                                    backgroundImage: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.05) 100%)'
                                }}>
                                <h6 className="mb-2 fw-bold" style={{ 
                                    color: theme ? '#68d391' : '#16a34a',
                                    fontSize: '0.9rem'
                                }}>
                                    <Person className="me-1" />
                                    {t('contactInfo')}
                                    {!isCurrentUser && (
                                        <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                            {t('privacyControlled')}
                                        </Badge>
                                    )}
                                </h6>
                                
                                {/* Email con control de privacidad */}
                                {userData.email && (
                                    <div className="mb-2 d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <Envelope className="me-2" style={{ 
                                                color: theme ? '#90cdf4' : '#2563eb',
                                                width: '14px'
                                            }} />
                                            <div>
                                                <div style={{ 
                                                    color: theme ? '#e2e8f0' : '#4a5568',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {canViewEmail() ? userData.email : '••••••••@•••••.com'}
                                                </div>
                                            </div>
                                        </div>
                                        {!canViewEmail() && !isCurrentUser && (
                                            <EyeSlash size={12} className="text-muted" />
                                        )}
                                    </div>
                                )}
                                
                                {/* Dirección con control de privacidad */}
                                {userData.address && (
                                    <div className="mb-2 d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <GeoAlt className="me-2" style={{ 
                                                color: theme ? '#f6ad55' : '#d97706',
                                                width: '14px'
                                            }} />
                                            <div>
                                                <div style={{ 
                                                    color: theme ? '#e2e8f0' : '#4a5568',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {canViewAddress() ? userData.address : '••••••••••••••••••'}
                                                </div>
                                            </div>
                                        </div>
                                        {!canViewAddress() && !isCurrentUser && (
                                            <EyeSlash size={12} className="text-muted" />
                                        )}
                                    </div>
                                )}
                                
                                {/* Teléfono con control de privacidad */}
                                {userData.mobile && (
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <Telephone className="me-2" style={{ 
                                                color: theme ? '#fc8181' : '#dc2626',
                                                width: '14px'
                                            }} />
                                            <div>
                                                <div style={{ 
                                                    color: theme ? '#e2e8f0' : '#4a5568',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {canViewMobile() ? userData.mobile : '•••••••••'}
                                                </div>
                                            </div>
                                        </div>
                                        {!canViewMobile() && !isCurrentUser && (
                                            <EyeSlash size={12} className="text-muted" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </Col>

                    <Col md={6}>
                        {userData.website && canViewProfile() && (
                            <div className="links-section p-3 rounded-3 mt-2 shadow-sm"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                    border: `1px solid ${theme ? '#4a5568' : '#e2e8f0'}`,
                                    backgroundImage: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)'
                                }}>
                                <h6 className="mb-0 fw-bold" style={{ 
                                    color: theme ? '#a78bfa' : '#7c3aed',
                                    fontSize: '0.9rem'
                                }}>
                                    <Link45deg className="me-1" />
                                    {t('links')}
                                </h6>
                                <a
                                    href={userData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-block text-decoration-none mb-1 mt-1"
                                    style={{
                                        wordBreak: 'break-all',
                                        color: theme ? '#90cdf4' : '#2563eb',
                                        fontSize: '0.85rem',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = theme ? '#63b3ed' : '#1d4ed8'}
                                    onMouseLeave={(e) => e.target.style.color = theme ? '#90cdf4' : '#2563eb'}
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