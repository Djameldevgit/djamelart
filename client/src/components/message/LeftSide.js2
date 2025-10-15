import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useHistory, useParams, Link } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'
import { getDataAPI } from '../../utils/fetchData'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import { Card, Form, InputGroup, Button, Badge, ListGroup, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FaSearch, FaCircle, FaInbox, FaClock, FaRegClock } from 'react-icons/fa'

const LeftSide = () => {
  const { auth, message, online, languageReducer, theme, socket } = useSelector(state => state) // 🔹 Agregar socket
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [searchUsers, setSearchUsers] = useState([])
  const [isSearching, setIsSearching] = useState(false)

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

  // 🔹 ESCUCHAR EVENTOS DE SOCKET PARA ACTUALIZAR ESTADO EN TIEMPO REAL
  useEffect(() => {
    if (!socket) return;

    // Escuchar cuando un usuario se conecta
    socket.on('userOnline', (data) => {
      console.log('🟢 Usuario online:', data.userId);
      dispatch({ 
        type: MESS_TYPES.UPDATE_USER_STATUS, 
        payload: {
          userId: data.userId,
          isOnline: true,
          lastOnline: data.lastOnline
        }
      });
    });

    // Escuchar cuando un usuario se desconecta
    socket.on('userOffline', (data) => {
      console.log('🔴 Usuario offline:', data.userId);
      dispatch({ 
        type: MESS_TYPES.UPDATE_USER_STATUS, 
        payload: {
          userId: data.userId,
          isOnline: false,
          lastOnline: data.lastOnline,
          lastDisconnectedAt: data.lastDisconnectedAt
        }
      });
    });

    // Escuchar evento de compatibilidad del sistema antiguo
    socket.on('CheckUserOffline', (userId) => {
      console.log('🔴 Usuario offline (sistema antiguo):', userId);
      dispatch({ 
        type: MESS_TYPES.UPDATE_USER_STATUS, 
        payload: {
          userId: userId,
          isOnline: false,
          lastOnline: new Date()
        }
      });
    });

    // Limpieza de event listeners
    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('CheckUserOffline');
    };
  }, [socket, dispatch]);

  // 🔹 FUNCIÓN CORREGIDA: Calcular tiempo desde última conexión
  const getLastSeenTime = (user) => {
    // Crear array de todas las posibles fechas de conexión
    const possibleDates = [
      user.lastDisconnectedAt,
      user.lastOnline, 
      user.lastActivity,
      user.lastLogin,
      user.lastConnectedAt
    ].filter(date => date && !isNaN(new Date(date).getTime()));

    // Si no hay fechas válidas
    if (possibleDates.length === 0) {
      return t('neverConnected', { lng: lang }) || 'Nunca conectado';
    }

    // Encontrar la fecha más reciente
    const latestDate = possibleDates.reduce((latest, current) => {
      const currentDate = new Date(current);
      const latestDate = new Date(latest);
      return currentDate > latestDate ? current : latest;
    });

    const now = new Date();
    const lastSeen = new Date(latestDate);
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // 🔹 CORRECCIÓN: Usar valores por defecto si la traducción falla
    if (diffInMinutes < 1) return t('justNow', { lng: lang }) || 'Ahora mismo';
    if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes, lng: lang }) || `hace ${diffInMinutes} min`;
    if (diffInHours < 24) return t('hoursAgo', { hours: diffInHours, lng: lang }) || `hace ${diffInHours} h`;
    if (diffInDays === 1) return t('yesterday', { lng: lang }) || 'Ayer';
    if (diffInDays < 7) return t('daysAgo', { days: diffInDays, lng: lang }) || `hace ${diffInDays} días`;
    
    // Para más de una semana, mostrar fecha completa
    return lastSeen.toLocaleDateString(lang, { 
      day: 'numeric', 
      month: 'short'
    });
  }

  // 🔹 FUNCIÓN MEJORADA: Determinar estado del usuario
  const getUserStatus = (user) => {
    // 🔹 CORRECCIÓN: Verificar tanto en 'online' como en el array global 'online'
    const isUserOnline = user.online || online.includes(user._id);
    
    if (isUserOnline) {
      return {
        status: 'online',
        text: t('online', { lng: lang }),
        color: '#28a745',
        icon: <FaCircle size={8} className="status-online" />
      }
    }

    // Para usuarios seguidos, mostrar última conexión detallada
    if (auth.user.following.find(item => item._id === user._id)) {
      const lastSeen = getLastSeenTime(user)
      return {
        status: 'offline',
        text: lastSeen,
        color: theme ? '#6c757d' : '#adb5bd',
        icon: <FaRegClock size={8} />
      }
    }

    // Para usuarios no seguidos, mostrar genérico
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

  // 🔹 FUNCIÓN: Solo el avatar va al perfil
  const handleAvatarClick = (e, user) => {
    e.stopPropagation()
    history.push(`/profile/${user._id}`)
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

  // 🔹 COMPONENTE MEJORADO: Indicador de estado con última conexión
  const StatusIndicator = ({ user, compact = false }) => {
    const status = getUserStatus(user)
    const lastSeenTime = getLastSeenTime(user)
    
    if (compact) {
      return (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              <div>
                <strong>{status.text}</strong>
                <br />
                {!user.online && `${t('lastSeen', { lng: lang }) || 'Última vez'}: ${lastSeenTime}`}
              </div>
            </Tooltip>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {status.icon}
          </div>
        </OverlayTrigger>
      )
    }

    return (
      <div className="d-flex flex-column align-items-end">
        {/* Indicador principal de estado */}
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
            border: status.status === 'online' ? '1px solid rgba(255,255,255,0.2)' : 'none',
            marginBottom: '2px'
          }}
        >
          {status.icon}
          {status.text}
        </Badge>
        
        {/* 🔹 NUEVO: Fecha de última conexión debajo del estado */}
        {!user.online && auth.user.following.find(item => item._id === user._id) && (
          <small 
            style={{ 
              fontSize: '0.6rem',
              color: theme ? '#6c757d' : '#868e96',
              textAlign: 'right',
              lineHeight: '1.2',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {t('lastSeen', { lng: lang }) || 'Visto'}: {lastSeenTime}
          </small>
        )}
      </div>
    )
  }

  // 🔹 COMPONENTE MEJORADO: UserCard con información mejorada
  const UserCardWithAvatarLink = ({ user, msg = false }) => {
    // 🔹 CORRECCIÓN: Verificar estado online de manera consistente
    const isUserOnline = user.online || online.includes(user._id);
    
    return (
      <div className="d-flex align-items-center" style={{ flex: 1 }}>
        {/* Avatar clickeable */}
        <div 
          className="me-3"
          style={{ cursor: 'pointer' }}
          onClick={(e) => handleAvatarClick(e, user)}
        >
          <img 
            src={user.avatar} 
            alt={user.username}
            className="rounded-circle"
            style={{
              width: '45px',
              height: '45px',
              objectFit: 'cover',
              border: isUserOnline ? '2px solid #28a745' : '2px solid transparent', // 🔹 Usar isUserOnline
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)'
              e.target.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.borderColor = isUserOnline ? '#28a745' : 'transparent' // 🔹 Usar isUserOnline
            }}
          />
        </div>
        
        {/* Información del usuario */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center">
            <h6 className="mb-0 me-2" style={{ 
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: theme ? '#fff' : '#333'
            }}>
              {user.username}
            </h6>
            
            {/* Indicador online pequeño junto al nombre */}
            {isUserOnline && ( // 🔹 Usar isUserOnline
              <FaCircle 
                size={6} 
                className="status-online" 
                style={{ color: '#28a745' }}
              />
            )}
          </div>
          
          {msg && user.text && (
            <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
              {user.text.length > 35 ? user.text.substring(0, 35) + '...' : user.text}
            </p>
          )}
          
          {/* 🔹 NUEVO: Información de última actividad para usuarios seguidos */}
          {!isUserOnline && auth.user.following.find(item => item._id === user._id) && ( // 🔹 Usar isUserOnline
            <small 
              style={{ 
                fontSize: '0.65rem',
                color: theme ? '#6c757d' : '#868e96',
                display: 'block',
                marginTop: '2px'
              }}
            >
              {getLastSeenTime(user)}
            </small>
          )}
        </div>
      </div>
    )
  }

  // 🔹 CONTADOR CORREGIDO de usuarios online
  const onlineUsersCount = message.users.filter(user => 
    user.online || online.includes(user._id) // 🔹 Verificar ambos estados
  ).length;

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
      {/* HEADER CON BÚSQUEDA */}
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

            <div className="d-flex justify-content-between align-items-center mt-2 px-1">
              <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                {t('online', { lng: lang })}: {onlineUsersCount} {/* 🔹 Usar el contador corregido */}
              </small>
              <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                {t('total', { lng: lang })}: {message.users.length}
              </small>
            </div>
          </Card.Body>
        </Card>
      )}

    
 

      {/* LISTA DE CONVERSACIONES */}
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
                    <UserCardWithAvatarLink user={user} />
                    <StatusIndicator user={user} compact={true} />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          <>
            {message.users.length === 0 ? (
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
                        <UserCardWithAvatarLink user={user} msg={true} />
                        <StatusIndicator user={user} compact={false} />
                      </div>

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