import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Dropdown, Badge, Button, Image } from 'react-bootstrap'
import Avatar from '../Avatar'
import moment from 'moment'
import NoNotice from '../../images/notice.png'
import { isReadNotify, NOTIFY_TYPES, deleteAllNotifies, getNotifies } from '../../redux/actions/notifyAction'
import { useTranslation } from 'react-i18next'

const NotificationsPage = () => {
  const { auth, notify, languageReducer } = useSelector(state => state)
  const dispatch = useDispatch()
  const { t } = useTranslation('notify')
  const lang = languageReducer.language || 'en'
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => {
    if (auth.token) {
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, auth }))
  }

  const handleMarkAsRead = (msg) => {
    if (!msg.isRead) {
      dispatch(isReadNotify({ msg, auth }))
    }
  }

  const handleMarkAsUnread = (msg) => {
    if (msg.isRead) {
      dispatch(isReadNotify({ msg, auth }))
    }
  }

  const handleSound = () => {
    dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound })
  }

  const handleDeleteAll = () => {
    const newArr = notify.data.filter(item => item.isRead === false)
    if (newArr.length === 0) return dispatch(deleteAllNotifies(auth.token))

    if (window.confirm(
      t('confirmDelete', { count: newArr.length, lng: lang })
    )) {
      return dispatch(deleteAllNotifies(auth.token))
    }
  }

  const handleMarkAllAsRead = () => {
    const unreadNotifications = notify.data.filter(msg => !msg.isRead)
    unreadNotifications.forEach(msg => {
      dispatch(isReadNotify({ msg, auth }))
    })
  }

  // Filtrar notificaciones
  const filteredNotifications = notify.data.filter(msg => {
    if (filter === 'unread') return !msg.isRead
    if (filter === 'read') return msg.isRead
    return true
  })

  const unreadCount = notify.data.filter(msg => !msg.isRead).length

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                {t('title', { lng: lang })}
                {unreadCount > 0 && (
                  <Badge bg="danger" className="ms-2">{unreadCount}</Badge>
                )}
              </h2>
              <p className="text-muted mb-0">
                {notify.data.length} {notify.data.length === 1 ? 'notificación' : 'notificaciones'}
              </p>
            </div>
            
            <div className="d-flex gap-2">
              {/* Botón de sonido */}
              <Button 
                variant={notify.sound ? "danger" : "outline-danger"}
                onClick={handleSound}
                title={notify.sound ? "Desactivar sonido" : "Activar sonido"}
              >
                <i className={`fas fa-bell${notify.sound ? '' : '-slash'}`} />
              </Button>

              {/* Marcar todas como leídas */}
              {unreadCount > 0 && (
                <Button 
                  variant="outline-primary"
                  onClick={handleMarkAllAsRead}
                >
                  Marcar todas como leídas
                </Button>
              )}

              {/* Eliminar todas */}
              {notify.data.length > 0 && (
                <Button 
                  variant="outline-danger"
                  onClick={handleDeleteAll}
                >
                  {t('deleteAll', { lng: lang })}
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      {notify.data.length > 0 && (
        <Row className="mb-3">
          <Col>
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                Todas ({notify.data.length})
              </button>
              <button
                type="button"
                className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('unread')}
              >
                No leídas ({unreadCount})
              </button>
              <button
                type="button"
                className={`btn ${filter === 'read' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('read')}
              >
                Leídas ({notify.data.length - unreadCount})
              </button>
            </div>
          </Col>
        </Row>
      )}

      {/* Lista de notificaciones */}
      <Row>
        <Col>
          {notify.data.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <Image src={NoNotice} alt="NoNotice" style={{ maxWidth: '200px' }} />
                <p className="text-muted mt-3">{t('noNotifications', { lng: lang })}</p>
              </Card.Body>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="text-muted">No hay notificaciones en esta categoría</p>
              </Card.Body>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filteredNotifications.map((msg, index) => (
                <Card 
                  key={index} 
                  className={`${!msg.isRead ? 'border-primary' : ''}`}
                  style={{ 
                    backgroundColor: !msg.isRead ? '#f8f9ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Contenido principal */}
                      <Link
                        to={msg.url}
                        className="d-flex align-items-center text-decoration-none text-dark flex-grow-1"
                        onClick={() => handleIsRead(msg)}
                        style={{ minWidth: 0 }}
                      >
                        <Avatar src={msg.user.avatar} size="big-avatar" />

                        <div className="mx-3 flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="mb-1">
                            <strong className="me-2">{msg.user.username}</strong>
                            <span>
                              {msg.text
                                ? t(msg.text, { ns: msg.textNs || 'notify', lng: lang })
                                : ''}
                            </span>
                          </div>
                          
                          {msg.content && (
                            <small className="text-muted d-block text-truncate">
                              {msg.content.slice(0, 50)}...
                            </small>
                          )}

                          <div className="d-flex align-items-center gap-2 mt-2">
                            <small className="text-muted">
                              {moment(msg.createdAt).fromNow()}
                            </small>
                            {!msg.isRead && (
                              <Badge bg="primary" pill>Nueva</Badge>
                            )}
                          </div>
                        </div>

                        {/* Imagen/Video preview */}
                        {msg.image && (
                          <div style={{ width: '50px', height: '50px' }} className="ms-2 flex-shrink-0">
                            {msg.image.match(/video/i) ? (
                              <video 
                                src={msg.image} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                              />
                            ) : (
                              <Image 
                                src={msg.image} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                rounded
                              />
                            )}
                          </div>
                        )}
                      </Link>

                      {/* Menú de tres puntos */}
                      <Dropdown align="end" className="ms-2">
                        <Dropdown.Toggle 
                          variant="link" 
                          bsPrefix="p-0"
                          className="text-muted"
                          style={{ 
                            border: 'none',
                            boxShadow: 'none',
                            textDecoration: 'none'
                          }}
                        >
                          <i className="fas fa-ellipsis-v" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {!msg.isRead ? (
                            <Dropdown.Item onClick={() => handleMarkAsRead(msg)}>
                              <i className="fas fa-check me-2" />
                              Marcar como leída
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item onClick={() => handleMarkAsUnread(msg)}>
                              <i className="fas fa-envelope me-2" />
                              Marcar como no leída
                            </Dropdown.Item>
                          )}
                          
                          <Dropdown.Item as={Link} to={msg.url}>
                            <i className="fas fa-external-link-alt me-2" />
                            Ver detalles
                          </Dropdown.Item>
                          
                          <Dropdown.Divider />
                          
                          <Dropdown.Item className="text-danger">
                            <i className="fas fa-trash me-2" />
                            Eliminar
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default NotificationsPage