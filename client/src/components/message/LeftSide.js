import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'
import { getDataAPI } from '../../utils/fetchData'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import { Card, Form, InputGroup, Button, Badge, ListGroup, Spinner } from 'react-bootstrap'
import { FaSearch, FaCircle, FaInbox } from 'react-icons/fa'

// 🔥 COMPONENTE REUTILIZABLE PARA INDICADOR DE CONEXIÓN
const OnlineIndicator = ({ isOnline, size = 'small', showText = false, theme }) => {
    const indicatorSize = size === 'large' ? '12px' : '8px'
    const textSize = size === 'large' ? '0.75rem' : '0.65rem'
    
    return (
        <div className="d-flex align-items-center gap-1">
            <div
                style={{
                    width: indicatorSize,
                    height: indicatorSize,
                    borderRadius: '50%',
                    background: isOnline ? '#4CAF50' : '#9E9E9E',
                    border: `2px solid ${theme ? '#16213e' : 'white'}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    animation: isOnline ? 'pulse 2s infinite' : 'none'
                }}
                title={isOnline ? 'En línea' : 'Desconectado'}
            />
            {showText && (
                <span 
                    style={{ 
                        fontSize: textSize, 
                        color: isOnline ? '#4CAF50' : (theme ? '#aaa' : '#666'),
                        fontWeight: '500'
                    }}
                >
                    {isOnline ? 'En línea' : 'Desconectado'}
                </span>
            )}
        </div>
    )
}

const LeftSide = () => {
  const { auth, message, online, languageReducer, theme, socket } = useSelector(state => state)
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [searchUsers, setSearchUsers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([]) // 🔥 NUEVO: Estado para usuarios online

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

  // 🔥 NUEVO: Effect para sincronizar estado online con socket
  useEffect(() => {
    if (!socket) return

    // Escuchar cambios de estado online
    socket.on('user-online-status', (data) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(userId => userId !== data.userId)
        if (data.isOnline) {
          return [...filtered, data.userId]
        }
        return filtered
      })
    })

    socket.on('user-connected', (userId) => {
      setOnlineUsers(prev => [...prev, userId])
    })

    socket.on('user-disconnected', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId))
    })

    return () => {
      socket.off('user-online-status')
      socket.off('user-connected')
      socket.off('user-disconnected')
    }
  }, [socket])

  // 🔥 MEJORADO: Función para verificar si usuario está online
  const isUserOnline = (userId) => {
    // Priorizar datos de socket (tiempo real), luego el estado global
    return onlineUsers.includes(userId) || online.includes(userId)
  }

  const handleSearch = async e => {
    e.preventDefault()
    
    const normalizedSearch = search
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    if (!normalizedSearch) return setSearchUsers([])

    try {
      setIsSearching(true)
      const res = await getDataAPI(`search?username=${encodeURIComponent(normalizedSearch)}`, auth.token)
      
      // 🔥 MEJORADO: Agregar estado online a usuarios de búsqueda
      const usersWithOnlineStatus = res.data.users.map(user => ({
        ...user,
        online: isUserOnline(user._id)
      }))
      
      setSearchUsers(usersWithOnlineStatus)
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

    if (pageEnd.current) {
      observer.observe(pageEnd.current)
    }
  }, [setPage])

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }))
    }
  }, [message.resultUsers, page, auth, dispatch])

  // 🔥 MEJORADO: Sincronizar online users con el estado global
  useEffect(() => {
    if (message.firstLoad && online.length > 0) {
      setOnlineUsers(prev => [...new Set([...prev, ...online])])
    }
  }, [online, message.firstLoad])

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
                  placeholder={t('searchPlaceholder')}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    borderRadius: lang === 'ar' ? '0 25px 25px 0' : '25px 0 0 25px',
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
                    borderRadius: lang === 'ar' ? '25px 0 0 25px' : '0 25px 25px 0',
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

            {/* Badge con contador de conversaciones y usuarios online */}
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div className="d-flex gap-2">
                <Badge 
                  bg="light" 
                  text="dark"
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px'
                  }}
                >
                  {t('conversations')}: {message.users.length}
                </Badge>
                <Badge 
                  bg="success" 
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px'
                  }}
                >
                  {t('online')}: {onlineUsers.length}
                </Badge>
              </div>
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
              {t('searchResults')} ({searchUsers.length})
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
                    e.currentTarget.style.transform = lang === 'ar' ? 'translateX(-4px)' : 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme ? '#16213e' : 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <UserCard user={user} />
                    {/* 🔥 INDICADOR DE CONEXIÓN MEJORADO */}
                    <div className="mt-2">
                      <OnlineIndicator 
                        isOnline={user.online} 
                        showText={true}
                        theme={theme}
                      />
                    </div>
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
                  {t('noUsersFound')}
                </h6>
                <small style={{ opacity: 0.7 }}>
                  {t('startConversation')}
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
                        e.currentTarget.style.transform = lang === 'ar' ? 'translateX(-4px)' : 'translateX(4px)';
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
                      <UserCard user={user} msg={true}>
                        {/* 🔥 INDICADOR DE CONEXIÓN MEJORADO Y CONSISTENTE */}
                        <div className="mt-1">
                          <OnlineIndicator 
                            isOnline={isUserOnline(user._id)} 
                            showText={true}
                            theme={theme}
                          />
                        </div>
                      </UserCard>

                      {/* Indicador de mensaje no leído */}
                      {user.unread > 0 && (
                        <Badge
                          bg="danger"
                          pill
                          style={{
                            position: 'absolute',
                            top: '8px',
                            [lang === 'ar' ? 'left' : 'right']: '8px',
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            minWidth: '24px',
                            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'
                          }}
                          title={`${user.unread} ${t('unreadMessages')}`}
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
          aria-label={t('loadMore2')}
        >
          {t('loadMore2')}
        </button>
      </div>

      {/* 🎨 ESTILOS PERSONALIZADOS MEJORADOS */}
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

        /* 🔥 ANIMACIÓN DE PULSO PARA INDICADOR ONLINE */
        @keyframes pulse {
          0% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.7;
          }
          100% { 
            transform: scale(1); 
            opacity: 1;
          }
        }

        /* Asegurar que los textos en items activos sean blancos */
        .list-group-item.active .text-muted,
        .list-group-item.active .text-dark {
          color: white !important;
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

export default LeftSide