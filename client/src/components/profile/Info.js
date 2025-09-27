import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap'
import { Person, Link45deg, Journal, Pencil } from 'react-bootstrap-icons'

const Info = ({id, auth, profile, dispatch}) => {
    const [userData, setUserData] = useState(null)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [loading, setLoading] = useState(true)

    const { theme } = useSelector(state => state)

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
                    <p className="mt-3">Cargando información del perfil...</p>
                </Card.Body>
            </Card>
        )
    }

    if (!userData) {
        return (
            <Card className="info-component border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-5">
                    <Person size={48} className="text-muted mb-3" />
                    <h5>Usuario no encontrado</h5>
                    <p className="text-muted">No se pudo cargar la información del perfil</p>
                </Card.Body>
            </Card>
        )
    }

    const stats = calculateStats(userData)
    const isCurrentUser = userData._id === auth.user._id

    return (
        <Card className="info-component border-0 shadow-sm mb-4" 
              style={{ 
                  background: theme ? '#2d3748' : 'white',
                  color: theme ? 'white' : 'inherit'
              }}>
            <Card.Body className="p-4">
                {/* Primera Fila: Avatar y información básica */}
                <Row className="text-center mb-4">
                    <Col>
                        <div className="position-relative d-inline-block">
                            <Avatar 
                                src={userData.avatar} 
                                size="supper-avatar"
                                className="border-4 border-white shadow"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    border: '4px solid white'
                                }}
                            />
                            {isCurrentUser && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="position-absolute bottom-0 end-0 rounded-circle"
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={() => window.location.href = `/profile/${id}/editprofilepage`}
                                    title="Edit Profile"
                                >
                                    <Pencil size={16} />
                                </Button>
                            )}
                        </div>
                        
                        <div className="mt-2">
                            <h3 className="mb-1">{userData.username}</h3>
                            {userData.fullname && (
                                <p className="text-muted mb-2">{userData.fullname}</p>
                            )}
                            {userData.mobile && (
                                <Badge bg="secondary" className="mb-2">
                                    {userData.mobile}
                                </Badge>
                            )}
                        </div>

                        {!isCurrentUser && (
                            <div className="mt-1">
                                <FollowBtn user={userData} />
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Segunda Fila: Estadísticas en una sola fila compacta */}
                <Row className="text-center mb-2 justify-content-center">
                    <Col xs={6} sm={3} className="mb-1">
                        <div 
                            className="stat-item p-2 rounded-3 cursor-pointer"
                            onClick={() => setShowFollowers(true)}
                            style={{
                                background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                minHeight: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.target.style.background = theme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                        >
                            <h5 className="mb-1 fw-bold text-primary">{stats.followers}</h5>
                            <small className="text-muted">Seguidores</small>
                        </div>
                    </Col>
                    
                    <Col xs={6} sm={3} className="mb-1">
                        <div 
                            className="stat-item p-1 rounded-3 cursor-pointer"
                            onClick={() => setShowFollowing(true)}
                            style={{
                                background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                minHeight: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.target.style.background = theme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                        >
                            <h5 className="mb-1 fw-bold text-success">{stats.following}</h5>
                            <small className="text-muted">Siguiendo</small>
                        </div>
                    </Col>
                    
                    <Col xs={6} sm={3} className="mb-1">
                        <div className="stat-item p-2 rounded-3"
                            style={{
                                background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                minHeight: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                            <h5 className="mb-1 fw-bold text-info">{stats.totalPosts}</h5>
                            <small className="text-muted">Publicaciones</small>
                        </div>
                    </Col>
                    
                    <Col xs={6} sm={3} className="mb-1">
                        <div className="stat-item p-2 rounded-3"
                            style={{
                                background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                minHeight: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                            <h5 className="mb-1 fw-bold text-warning">{stats.totalLikes}</h5>
                            <small className="text-muted">Likes</small>
                        </div>
                    </Col>
                </Row>

                {/* Tercera Fila: Biografía */}
                {userData.story && (
                    <Row className="mb-1">
                        <Col>
                            <div className="bio-section p-2 rounded-3"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                }}>
                                <div className="d-flex align-items-center mb-1">
                                    <Journal className="me-2 text-warning" />
                                    <h6 className="mb-0">Biografía</h6>
                                </div>
                                <p className="mb-0 text-break">{userData.story}</p>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Cuarta Fila: Información de contacto y redes */}
                <Row>
                    <Col md={6}>
                        {(userData.email || userData.address) && (
                            <div className="contact-info p-2 rounded-3 mb-2"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                }}>
                                <h6 className="mb-2">
                                    <Person className="me-1" />
                                    Información de Contacto
                                </h6>
                                {userData.email && (
                                    <div className="mb-1">
                                        <strong>Email:</strong>
                                        <div className="text-muted">{userData.email}</div>
                                    </div>
                                )}
                                {userData.address && (
                                    <div>
                                        <strong>Dirección:</strong>
                                        <div className="text-muted">{userData.address}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Col>
                    
                    <Col md={6}>
                        {userData.website && (
                            <div className="links-section p-2 rounded-3"
                                style={{
                                    background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                }}>
                                <h6 className="mb-2">
                                    <Link45deg className="me-1" />
                                    Enlaces
                                </h6>
                                <a 
                                    href={userData.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="d-block text-decoration-none text-primary mb-1"
                                    style={{
                                        wordBreak: 'break-all'
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
                    <Followers 
                        users={userData.followers} 
                        setShowFollowers={setShowFollowers} 
                    />
                )}

                {showFollowing && (
                    <Following 
                        users={userData.following} 
                        setShowFollowing={setShowFollowing} 
                    />
                )}
            </Card.Body>
        </Card>
    )
}

export default Info