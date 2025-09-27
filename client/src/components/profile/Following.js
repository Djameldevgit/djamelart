import React from 'react'
import FollowBtn from '../FollowBtn'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Modal, Card, Button, Row, Col } from 'react-bootstrap'

const Following = ({ users, setShowFollowing }) => {
    const { auth } = useSelector(state => state)
    const { t } = useTranslation('followers')
    const { theme } = useSelector(state => state)

    return (
        <Modal 
            show={true} 
            onHide={() => setShowFollowing(false)}
            centered
            size="lg"
            className="following-modal"
            data-bs-theme={theme ? 'dark' : 'light'}
            style={{ minHeight: '90vh' }}
        >
            <Modal.Header 
                className="border-0 p-0"
                style={{
                    backgroundColor: 'transparent',
                    border: 'none'
                }}
            >
                <div className="d-flex align-items-center justify-content-between w-100 px-1 py-1"
                    style={{
                        backgroundColor: theme ? '#2d3748' : 'white',
                        borderBottom: theme ? '1px solid #4a5568' : '1px solid #e2e8f0'
                    }}>
                    <span className="d-flex align-items-center"
                        style={{
                            color: theme ? 'white' : 'black',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}>
                        <i className="fas fa-user-check me-2" style={{ color: '#48bb78' }}></i>
                        {t('following')}
                    </span>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowFollowing(false)}
                        className="rounded-circle border-0"
                        style={{ 
                            width: '32px', 
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme ? '#4a5568' : '#f8f9fa',
                            color: theme ? 'white' : '#6c757d'
                        }}
                    >
                        <i className="fas fa-times" style={{ fontSize: '0.9rem' }}></i>
                    </Button>
                </div>
            </Modal.Header>

            <Modal.Body 
                className="px-1 py-2"
                style={{
                    backgroundColor: theme ? '#2d3748' : 'white',
                    color: theme ? 'white' : 'black',
                    maxHeight: '70vh',
                    minHeight: '300px',
                    overflowY: 'auto',
                }}
            >
                {users.length === 0 ? (
                    <div className="text-center py-4">
                        <i className="fas fa-user-check text-muted mb-3" style={{ fontSize: '2.5rem' }}></i>
                        <h5 className="text-muted">{t('noFollowing')}</h5>
                        <p className="text-muted mb-0">{t('noFollowingMessage')}</p>
                    </div>
                ) : (
                    <Row className="g-2 mx-0">
                        {users.map(user => (
                            <Col key={user._id} xs={12} className="px-2">
                                <Card 
                                    className="border-0 shadow-sm following-card mb-2"
                                    style={{
                                        backgroundColor: theme ? '#4a5568' : '#f8f9fa',
                                        transition: 'all 0.3s ease',
                                        border: theme ? '1px solid #718096' : '1px solid #e2e8f0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Card.Body className="p-1">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center flex-grow-1">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.username}
                                                    className="rounded-circle me-3"
                                                    style={{
                                                        width: '45px',
                                                        height: '45px',
                                                        objectFit: 'cover',
                                                        minWidth: '45px'
                                                    }}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 fw-bold" style={{ color: theme ? 'white' : 'black' }}>
                                                        {user.username}
                                                    </h6>
                                                    <small className="text-muted">
                                                        {user.fullname || `@${user.username}`}
                                                    </small>
                                                </div>
                                            </div>
                                            
                                            {auth.user._id !== user._id && (
                                                <div className="ms-2">
                                                    <FollowBtn user={user} size="sm" />
                                                </div>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Modal.Body>

            <Modal.Footer 
                className="border-0 py-2 px-3"
                style={{
                    backgroundColor: theme ? '#2d3748' : 'white',
                    color: theme ? 'white' : 'black',
                    borderTop: theme ? '1px solid #4a5568' : '1px solid #e2e8f0'
                }}
            >
                <small className="text-muted">
                    {t('totalFollowing', { count: users.length })}
                </small>
            </Modal.Footer>
        </Modal>
    )
}

export default Following