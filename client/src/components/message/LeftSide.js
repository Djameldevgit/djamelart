import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'
import { getDataAPI } from '../../utils/fetchData'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import { Card, Form, InputGroup, Button, Badge, ListGroup, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FaSearch, FaCircle, FaInbox, FaClock, FaRegClock } from 'react-icons/fa'

const LeftSide = () => {
  const { auth, message, online, languageReducer, theme } = useSelector(state => state)
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [searchUsers, setSearchUsers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [userStatus, setUserStatus] = useState({}) // Para almacenar estados de usuarios

  const history = useHistory()
  const { id } = useParams()

  const pageEnd = useRef()
  const [page, setPage] = useState(0)

  const { t } = useTranslation('message')
  const lang = languageReducer.language || 'es'

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  // 🔹 Función para calcular el tiempo desde la última conexión
  const getLastSeenTime = (lastLogin) => {
    if (!lastLogin) return t('offline', { lng: lang })
    
    const now = new Date()
    const lastSeen = new Date(lastLogin)
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return t('justNow', { lng: lang })
    if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes, lng: lang })
    if (diffInHours < 24) return t('hoursAgo', { hours: diffInHours, lng: lang })
    if (diffInDays === 1) return t('yesterday', { lng: lang })
    return `${diffInDays} ${t('daysAgo', { lng: lang })}`
  }

  // 🔹 Determinar el estado del usuario
  const getUserStatus = (user) => {
    // Si está en línea
    if (user.online) {
      return {
        status: 'online',
        text: t('online', { lng: lang }),
        color: '#28a745',
        icon: <FaCircle size={8} />
      }
    }

    // Si no está en línea pero es un usuario seguido
    if (auth.user.following.find(item => item._id === user._id)) {
      const lastSeen = getLastSeenTime(user.lastLogin)
      return {
        status: 'offline',
        text: lastSeen,
        color: theme ? '#6c757d' : '#adb5bd',
        icon: <FaRegClock size={8} />
      }
    }

    // Usuario no seguido
    return {
      status: 'unknown',
      text: t('offline', { lng: lang }),
      color: theme ? '#495057' : '#dee2e6',
      icon: <FaCircle size={8} />
    }
  }

  const handleSearch = async e => {
    e.preventDefault()
    if (!search) return setSearchUsers([])

    try {
      setIsSearching(true)
      const res = await getDataAPI(`search?username=${search}`, auth.token)
      setSearchUsers(res.data.users)
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || t('searchError') }
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddUser = (user) => {
    setSearch('')
    setSearchUsers([])
    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
    dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
    return history.push(`/message/${user._id}`)
  }

  const isActive = (user) => {
    if (id === user._id) return 'active'
    return ''
  }

  useEffect(() => {
    if (message.firstLoad) return
    dispatch(getConversations({ auth }))
  }, [dispatch, auth, message.firstLoad])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1)
      }
    }, {
      threshold: 0.1
    })

    observer.observe(pageEnd.current)
  }, [setPage])

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }))
    }
  }, [message.resultUsers, page, auth, dispatch])

  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
    }
  }, [online, message.firstLoad, dispatch])

  // 🔹 Componente de indicador de estado
  const StatusIndicator = ({ user, compact = false }) => {
    const status = getUserStatus(user)
    
    if (compact) {
      return (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              {status.text}
            </Tooltip>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {status.icon}
            {!compact && (
              <small style={{ 
                fontSize: '0.7rem', 
                color: status.color,
                fontWeight: '500'
              }}>
                {status.text}
              </small>
            )}
          </div>
        </OverlayTrigger>
      )
    }

    return (
      <Badge
        bg={status.status === 'online' ? 'success' : 'secondary'}
        pill
        style={{
          fontSize: '0.65rem',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: status.status === 'online' 
            ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
            : theme ? '#495057' : '#6c757d',
          boxShadow: status.status === 'online' 
            ? '0 2px 8px rgba(40, 167, 69, 0.4)'
            : 'none',
          border: status.status === 'online' ? '1px solid rgba(255,255,255,0.2)' : 'none'
        }}
      >
        {status.icon}
        {status.text}
      </Badge>
    )
  }

  return (
    <div 
      style={{ 
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme ? '#0f0f1e' : '#ffffff'
      }}
    >
      {/* 🎨 HEADER CON BÚSQUEDA MEJORADA */}
      {auth.user?.role === "admin" && (
        <Card 
          className="border-0 shadow-sm"
          style={{
            borderRadius: '0',
            background: theme 
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Card.Body className="p-2">
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={search}
                  placeholder={t('searchPlaceholder', { lng: lang }) || 'Buscar usuarios...'}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    borderRadius: '25px 0 0 25px',
                    border: 'none',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    direction: lang === 'ar' ? 'rtl' : 'ltr',
                    textAlign: lang === 'ar' ? 'right' : 'left',
                    fontSize: '0.95rem'
                  }}
                />
                <Button
                  type="submit"
                  style={{
                    borderRadius: '0 25px 25px 0',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0 20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  {isSearching ? (
                    <Spinner animation="border" size="sm" style={{ color: 'white' }} />
                  ) : (
                    <FaSearch size={16} style={{ color: 'white' }} />
                  )}
                </Button>
              </InputGroup>
            </Form>

            {/* Indicador de estado global */}
            <div className="d-flex justify-content-between align-items-center mt-2 px-1">
              <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                {t('online', { lng: lang })}: {online.filter(userId => 
                  message.users.find(u => u._id === userId)
                ).length}
              </small>
              <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                Total: {message.users.length}
              </small>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 🎨 LISTA DE CONVERSACIONES MEJORADA */}
      <div 
        className="message_chat_list"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          background: theme ? '#0f0f1e' : '#f8f9fa'
        }}
      >
        {searchUsers.length !== 0 ? (
          <>
            {/* Resultados de búsqueda */}
            <div 
              className="mb-2 px-2"
              style={{
                fontSize: '0.85rem',
                color: theme ? '#aaa' : '#666',
                fontWeight: '600'
              }}
            >
              {t('searchResults', { lng: lang }) || 'Resultados de búsqueda'} ({searchUsers.length})
            </div>
            <ListGroup variant="flush">
              {searchUsers.map(user => (
                <ListGroup.Item
                  key={user._id}
                  onClick={() => handleAddUser(user)}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    padding: '12px',
                    background: theme ? '#16213e' : 'white',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme ? '#16213e' : 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <UserCard user={user} />
                    <StatusIndicator user={user} compact={true} />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          <>
            {message.users.length === 0 ? (
              /* Estado vacío mejorado */
              <div 
                className="text-center p-5"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: theme ? '#aaa' : '#999'
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: theme 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}
                >
                  <FaInbox size={35} style={{ color: '#667eea' }} />
                </div>
                <h6 style={{ fontWeight: '600', marginBottom: '8px' }}>
                  {t('noUsersFound', { lng: lang }) || 'No hay conversaciones'}
                </h6>
                <small style={{ opacity: 0.7 }}>
                  {t('searchToStart', { lng: lang }) || 'Busca usuarios para iniciar una conversación'}
                </small>
              </div>
            ) : (
              /* Lista de conversaciones */
              <ListGroup variant="flush">
                {message.users.map(user => (
                  <ListGroup.Item
                    key={user._id}
                    onClick={() => handleAddUser(user)}
                    className={isActive(user)}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      padding: '12px',
                      background: id === user._id
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : theme ? '#16213e' : 'white',
                      transition: 'all 0.2s ease',
                      boxShadow: id === user._id
                        ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                        : '0 2px 8px rgba(0,0,0,0.05)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (id !== user._id) {
                        e.currentTarget.style.background = theme 
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (id !== user._id) {
                        e.currentTarget.style.background = theme ? '#16213e' : 'white';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <UserCard user={user} msg={true} />
                        <StatusIndicator user={user} compact={false} />
                      </div>

                      {/* Indicador de mensaje no leído */}
                      {user.unread > 0 && (
                        <Badge
                          bg="danger"
                          pill
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: lang === 'ar' ? 'auto' : '8px',
                            left: lang === 'ar' ? '8px' : 'auto',
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            minWidth: '24px',
                            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'
                          }}
                        >
                          {user.unread > 9 ? '9+' : user.unread}
                        </Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
        )}

        {/* Botón para cargar más (invisible pero funcional) */}
        <button
          ref={pageEnd}
          style={{ 
            opacity: 0, 
            height: '1px',
            border: 'none',
            background: 'transparent'
          }}
          aria-label={t('loadMore2', { lng: lang })}
        >
          {t('loadMore2', { lng: lang })}
        </button>
      </div>

      {/* 🎨 ESTILOS PERSONALIZADOS */}
      <style>{`
        .message_chat_list::-webkit-scrollbar {
          width: 6px;
        }

        .message_chat_list::-webkit-scrollbar-track {
          background: ${theme ? '#0f0f1e' : '#f1f1f1'};
          border-radius: 10px;
        }

        .message_chat_list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        .message_chat_list::-webkit-scrollbar-thumb:hover {
          background: #667eea;
        }

        .list-group-item.active {
          color: white !important;
        }

        .list-group-item.active * {
          color: white !important;
        }

        /* Animación para el indicador online */
        @keyframes pulse-online {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .status-online {
          animation: pulse-online 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default LeftSide