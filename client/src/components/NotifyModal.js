import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap'
import NoNotice from '../images/notice.png'
import Avatar from './Avatar'
import moment from 'moment'
import { isReadNotify, NOTIFY_TYPES, deleteAllNotifies } from '../redux/actions/notifyAction'
import './NotifyModal.css'

const NotifyModal = () => {
    const { auth, notify } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleIsRead = (msg) => {
        dispatch(isReadNotify({msg, auth}))
    }

    const handleSound = () => {
        dispatch({type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound})
    }

    const handleDeleteAll = () => {
        const newArr = notify.data.filter(item => item.isRead === false)
        if(newArr.length === 0) return dispatch(deleteAllNotifies(auth.token))

        if(window.confirm(`You have ${newArr.length} unread notices. Are you sure you want to delete all?`)){
            return dispatch(deleteAllNotifies(auth.token))
        }
    }

    return (
        <Container fluid className="notify-modal-container p-0">
            {/* Header */}
            <Row className="align-items-center notify-modal-header">
                <Col xs={8}>
                    <h6 className="notify-modal-title mb-0">Notification</h6>
                </Col>
                <Col xs={4} className="text-end">
                    {notify.sound 
                        ? <i className="fas fa-bell text-danger" 
                             style={{fontSize: '1.1rem', cursor: 'pointer'}}
                             onClick={handleSound} />
                        : <i className="fas fa-bell-slash text-danger"
                             style={{fontSize: '1.1rem', cursor: 'pointer'}}
                             onClick={handleSound} />
                    }
                </Col>
            </Row>

            {/* Empty State */}
            {notify.data.length === 0 && (
                <div className="notify-modal-empty">
                    <Image src={NoNotice} alt="No notices" fluid />
                    <p>No notifications</p>
                </div>
            )}

            {/* Notifications List */}
            <div className="notify-modal-list">
                {notify.data.map((msg, index) => (
                    <div key={index} className="notify-modal-item">
                        <Link 
                            to={msg.url} 
                            className="text-decoration-none text-dark"
                            onClick={() => handleIsRead(msg)}
                        >
                            <Row className="align-items-center g-2">
                                {/* Avatar */}
                                <Col xs={3}>
                                    <Avatar 
                                        src={msg.user.avatar} 
                                        className="notify-modal-avatar"
                                    />
                                </Col>
                                
                                {/* Content */}
                                <Col xs={6}>
                                    <div className="notify-modal-text">
                                        <span className="notify-modal-username">
                                            {msg.user.username}
                                        </span>
                                        <span>{msg.text}</span>
                                        {msg.content && (
                                            <div className="notify-modal-content">
                                                {msg.content.slice(0,20)}...
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                
                                {/* Image/Media */}
                                <Col xs={3} className="text-end">
                                    {msg.image && (
                                        <div style={{width: '40px', height: '40px'}}>
                                            {msg.image.match(/video/i) ? (
                                                <video 
                                                    src={msg.image} 
                                                    width="100%" 
                                                    height="100%" 
                                                    style={{objectFit: 'cover', borderRadius: '6px'}} 
                                                />
                                            ) : (
                                                <Image 
                                                    src={msg.image} 
                                                    width={40} 
                                                    height={40} 
                                                    style={{objectFit: 'cover', borderRadius: '6px'}}
                                                    className="img-fluid"
                                                />
                                            )}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Link>
                        
                        {/* Timestamp and Read Status */}
                        <Row className="mt-2">
                            <Col>
                                <small className="notify-modal-time">
                                    {moment(msg.createdAt).fromNow()}
                                </small>
                            </Col>
                            <Col className="text-end">
                                {!msg.isRead && (
                                    <span className="notify-modal-unread"></span>
                                )}
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>

            {/* Footer */}
            {notify.data.length > 0 && (
                <div className="notify-modal-footer text-center">
                    <button 
                        className="notify-modal-delete-btn"
                        onClick={handleDeleteAll}
                    >
                        Delete All
                    </button>
                </div>
            )}
        </Container>
    )
}

export default NotifyModal