import React, { useEffect, useState } from 'react'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import Saved from '../../components/profile/Saved'
import { useSelector, useDispatch } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import { getProfileUsers } from '../../redux/actions/profileAction'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap'
import { 
  Person, 
  Envelope, 
  People, 
  PersonCheck, 
  
  PatchCheck, 
  PatchQuestion,
  Heart,
  FilePost,
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle,
  InfoCircle
} from 'react-bootstrap-icons'

const Profile = () => {
    const { profile, auth, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const { t } = useTranslation('profile')
    const lang = languageReducer?.language || 'en'

    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('posts') // 'posts', 'saved' or 'info'
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [userStats, setUserStats] = useState(null)

    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUsers({id, auth}))
        }
    },[id, auth, dispatch, profile.ids])

    // Función para calcular estadísticas del usuario
    const calculateUserStats = () => {
        if (!profile.users.length) return null;
        
        const user = profile.users.find(u => u._id === id) || auth.user;
        const userPosts = profile.posts.find(p => p._id === id);
        
        let totalLikes = 0;
        let totalPosts = 0;

        if (userPosts) {
            totalPosts = userPosts.posts.length;
            totalLikes = userPosts.posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
        }

        return {
            username: user.username,
            email: user.email,
            followers: user.followers?.length || 0,
            following: user.following?.length || 0,
            role: user.role || 'user',
            userId: user._id,
            totalPosts,
            totalLikes,
            isVerified: user.isVerified || false,
            isActive: user.isActive !== false,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        };
    }

    const handleShowInfo = () => {
        const stats = calculateUserStats();
        setUserStats(stats);
        setShowInfoModal(true);
    }

    const getVerificationStatus = (isVerified) => {
        return isVerified ? 
            { variant: 'success', icon: <PatchCheck className="me-1" />, text: t('verified', { lng: lang }) } :
            { variant: 'warning', icon: <PatchQuestion className="me-1" />, text: t('pending', { lng: lang }) };
    }

    const getAccountStatus = (isActive) => {
        return isActive ?
            { variant: 'success', icon: <CheckCircle className="me-1" />, text: t('active', { lng: lang }) } :
            { variant: 'danger', icon: <XCircle className="me-1" />, text: t('inactive', { lng: lang }) };
    }

    return (
        <div className="profile">
            
            <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

            {
                auth.user._id === id && (
                    <div className="profile_tab mb-4">
                        <div className="btn-group" role="group">
                            <button 
                                className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                {t('posts', { lng: lang })}
                            </button>
                            <button 
                                className={`btn ${activeTab === 'saved' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setActiveTab('saved')}
                            >
                                {t('saved', { lng: lang })}
                            </button>
                            <button 
                                className={`btn ${activeTab === 'info' ? 'btn-info' : 'btn-outline-info'}`}
                                onClick={() => {
                                    setActiveTab('info');
                                    handleShowInfo();
                                }}
                            >
                                <InfoCircle className="me-1" />
                                {t('info', { lng: lang })}
                            </button>
                        </div>
                    </div>
                )
            }

            {
                profile.loading ? (
                    <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
                ) : (
                    <div className="profile-content">
                        {/* Mostrar ambos tabs en columnas paralelas */}
                        {auth.user._id === id ? (
                            <div className="row">
                                {/* Columna de Posts */}
                                <div className={`col-md-6 ${activeTab !== 'posts' ? 'd-none d-md-block' : ''}`}>
                                    <div className="tab-content-section">
                                        <h5 className="mb-3">{t('posts', { lng: lang })}</h5>
                                        <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                                    </div>
                                </div>
                                
                                {/* Columna de Saved */}
                                <div className={`col-md-6 ${activeTab !== 'saved' ? 'd-none d-md-block' : ''}`}>
                                    <div className="tab-content-section">
                                        <h5 className="mb-3">{t('saved', { lng: lang })}</h5>
                                        <Saved auth={auth} dispatch={dispatch} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Para otros usuarios, solo mostrar posts
                            <div className="row">
                                <div className="col-12">
                                    <div className="tab-content-section">
                                        <h5 className="mb-3">{t('posts', { lng: lang })}</h5>
                                        <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Modal de Información del Usuario */}
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Person className="me-2" />
                        {t('userInfo', { lng: lang })}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userStats && (
                        <div className="user-info-modal">
                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><Person className="me-2" />{t('username', { lng: lang })}:</strong>
                                        <span>{userStats.username}</span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><Envelope className="me-2" />{t('email', { lng: lang })}:</strong>
                                        <span>{userStats.email}</span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><People className="me-2" />{t('followers', { lng: lang })}:</strong>
                                        <Badge bg="secondary">{userStats.followers}</Badge>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><PersonCheck className="me-2" />{t('following', { lng: lang })}:</strong>
                                        <Badge bg="secondary">{userStats.following}</Badge>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><FilePost className="me-2" />{t('totalPosts', { lng: lang })}:</strong>
                                        <Badge bg="info">{userStats.totalPosts}</Badge>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><Heart className="me-2" />{t('totalLikes', { lng: lang })}:</strong>
                                        <Badge bg="danger">{userStats.totalLikes}</Badge>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><ShieldCheck className="me-2" />{t('role', { lng: lang })}:</strong>
                                        <Badge bg="dark">{userStats.role}</Badge>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong>ID:</strong>
                                        <small className="text-muted d-block">{userStats.userId}</small>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong>{t('verification', { lng: lang })}:</strong>
                                        {(() => {
                                            const status = getVerificationStatus(userStats.isVerified);
                                            return (
                                                <Badge bg={status.variant}>
                                                    {status.icon}
                                                    {status.text}
                                                </Badge>
                                            );
                                        })()}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong>{t('accountStatus', { lng: lang })}:</strong>
                                        {(() => {
                                            const status = getAccountStatus(userStats.isActive);
                                            return (
                                                <Badge bg={status.variant}>
                                                    {status.icon}
                                                    {status.text}
                                                </Badge>
                                            );
                                        })()}
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <div className="info-item">
                                        <strong><Clock className="me-2" />{t('memberSince', { lng: lang })}:</strong>
                                        <span>{new Date(userStats.createdAt).toLocaleDateString(lang)}</span>
                                    </div>
                                </Col>
                                {userStats.lastLogin && (
                                    <Col md={6}>
                                        <div className="info-item">
                                            <strong><PersonCheck className="me-2" />{t('lastLogin', { lng: lang })}:</strong>
                                            <span>{new Date(userStats.lastLogin).toLocaleDateString(lang)}</span>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
                        {t('close', { lng: lang })}
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )
}

export default Profile