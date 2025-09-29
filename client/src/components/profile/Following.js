import React from 'react';
import UserCard from '../UserCard';
import FollowBtn from '../FollowBtn';
import { useSelector } from 'react-redux';
import { Modal, Card, Badge, Button } from 'react-bootstrap';
import { XCircle, PersonCheck } from 'react-bootstrap-icons';

const Following = ({ users, setShowFollowing }) => {
    const { auth } = useSelector(state => state);

    return (
        <Modal 
            show={true} 
            onHide={() => setShowFollowing(false)}
            centered
            size="lg"
            backdrop="static"
            keyboard={true}
        >
            <Modal.Header 
                className="border-0 pb-2"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <Modal.Title className="w-100 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <PersonCheck size={24} className="me-2" />
                        <span className="fw-bold">Siguiendo</span>
                        <Badge 
                            bg="light" 
                            text="dark" 
                            className="ms-3"
                            style={{ 
                                fontSize: '0.9rem',
                                padding: '6px 12px',
                                borderRadius: '20px'
                            }}
                        >
                            {users.length}
                        </Badge>
                    </div>
                    <Button
                        variant="light"
                        size="sm"
                        className="rounded-circle ms-2"
                        onClick={() => setShowFollowing(false)}
                        style={{
                            width: '32px',
                            height: '32px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <XCircle size={18} />
                    </Button>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body 
                className="p-0"
                style={{
                    maxHeight: '70vh',
                    minHeight: '400px',
                    overflowY: 'auto'
                }}
            >
                {users.length === 0 ? (
                    <div className="text-center py-5">
                        <PersonCheck size={48} className="text-muted mb-3" style={{ opacity: 0.3 }} />
                        <p className="text-muted mb-0">No sigues a nadie aún</p>
                    </div>
                ) : (
                    <div>
                        {users.map((user, index) => (
                            <div
                                key={user._id}
                                style={{
                                    borderBottom: index !== users.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <UserCard 
                                    user={user} 
                                    setShowFollowing={setShowFollowing}
                                    border=""
                                >
                                    {auth.user._id !== user._id && (
                                        <FollowBtn user={user} />
                                    )}
                                </UserCard>
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer 
                className="border-0 pt-2 pb-3"
                style={{ backgroundColor: '#f8f9fa' }}
            >
                <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowFollowing(false)}
                    style={{
                        borderRadius: '20px',
                        padding: '8px 24px',
                        fontWeight: '500'
                    }}
                >
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Following;