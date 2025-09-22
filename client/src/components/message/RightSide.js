import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'
import Icons from '../Icons'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { imageUpload } from '../../utils/imageUpload'
import { addMessage, getMessages, loadMoreMessages, deleteConversation } from '../../redux/actions/messageAction'
import LoadIcon from '../../images/loading.gif'
import { useTranslation } from 'react-i18next'
import Avatar from '../Avatar'

const RightSide = () => {
    const { auth, message, theme, socket, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('chat')

    const { id } = useParams()
    const [user, setUser] = useState([])
    const [text, setText] = useState('')
    const [media, setMedia] = useState([])
    const [loadMedia, setLoadMedia] = useState(false)
    const [textError, setTextError] = useState('')

    const refDisplay = useRef()
    const pageEnd = useRef()

    const [data, setData] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [isLoadMore, setIsLoadMore] = useState(0)

    const history = useHistory()
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeout = useRef()

    // 🔥 Efecto para detectar typing
    useEffect(() => {
        const handleTyping = () => {
            if (!isTyping) {
                setIsTyping(true)
                socket.emit('typing-start', {
                    sender: auth.user._id,
                    recipient: id,
                    chatId: id
                })
            }

            clearTimeout(typingTimeout.current)
            typingTimeout.current = setTimeout(() => {
                setIsTyping(false)
                socket.emit('typing-stop', {
                    sender: auth.user._id,
                    recipient: id,
                    chatId: id
                })
            }, 1000)
        }

        const input = document.querySelector('.chat_input input')
        if (input) {
            input.addEventListener('input', handleTyping)
        }

        return () => {
            if (input) {
                input.removeEventListener('input', handleTyping)
            }
            clearTimeout(typingTimeout.current)
        }
    }, [id, auth.user._id, socket, isTyping])

    // 🔥 Cambiar idioma activamente
    const lang = languageReducer.language || 'es'
    useEffect(() => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang)
        }
    }, [lang, i18n])

    // 🔥 Validación en tiempo real del texto (internacionalizada)
    useEffect(() => {
        const validateText = () => {
            if (text.length > 1000) {
                return t('chat.maxChars')
            }
            
            const allowedRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,!?()'"@#$%&*+=:;/\\\n\r\t¿¡€£¥©®—–•§¶\p{Emoji}]*$/u;
            if (text && !allowedRegex.test(text)) {
                return t('chat.invalidChars')
            }
            
            const specialCharsCount = (text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?€£¥©®—–•§¶]/g) || []).length;
            if (specialCharsCount > text.length * 0.4) {
                return t('chat.tooManySpecial')
            }
            
            return ""
        }
        
        setTextError(validateText())
    }, [text, t])

    // 🔥 Función de sanitización de texto
    const sanitizeText = (input) => {
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '')
            .replace(/(\b)(on\w+)=([^>]*)/gi, '')
            .slice(0, 1000);
    };

    useEffect(() => {
        const newData = message.data.find(item => item._id === id)
        if (newData) {
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
        }
    }, [message.data, id])

    useEffect(() => {
        if (id && message.users.length > 0) {
            setTimeout(() => {
                if (refDisplay.current) {
                    refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
                }
            }, 50)

            const newUser = message.users.find(user => user._id === id)
            if (newUser) setUser(newUser)
        }
    }, [message.users, id])

    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err = ""
        let newMedia = []
    
        const isSuperUser = auth.user?.role === "Super-utilisateur"
        const isAdmin = auth.user?.role === "admin"
        
        const maxMedia = (isSuperUser || isAdmin) ? 4 : 0
        const totalAfterUpload = media.length + files.length
    
        if (totalAfterUpload > maxMedia) {
            err = t('chat.maxFiles', { 
                max: maxMedia,
                extraInfo: maxMedia === 4 ? t('chat.superAdminInfo') : ""
            })
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
            return
        }
    
        files.forEach(file => {
            if (!file) {
                err = t('chat.fileNotFound')
                return
            }
    
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
            if (!allowedTypes.includes(file.type)) {
                err = t('chat.onlyImages')
                return
            }
    
            if (file.size > 1024 * 1024 * 5) {
                err = t('chat.fileTooLarge')
                return
            }

            const isValidFileName = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-_.]+$/.test(file.name)
            if (!isValidFileName) {
                err = t('chat.invalidFileName', { fileName: file.name })
                return
            }
    
            newMedia.push(file)
        })
    
        if (err) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        } else {
            setMedia([...media, ...newMedia])
        }
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media]
        newArr.splice(index, 1)
        setMedia(newArr)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // 🔥 Validación final antes de enviar
        if (!text.trim() && media.length === 0) return;
        if (textError) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: textError } })
            return;
        }

        const sanitizedText = sanitizeText(text);
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArr = [];
        if (media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text: sanitizedText,
            media: newArr,
            createdAt: new Date().toISOString()
        }

        setLoadMedia(false)
        await dispatch(addMessage({ msg, auth, socket }))
        if (refDisplay.current) {
            refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }

    useEffect(() => {
        const getMessagesData = async () => {
            if (message.data.every(item => item._id !== id)) {
                await dispatch(getMessages({ auth, id }))
                setTimeout(() => {
                    if (refDisplay.current) {
                        refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
                    }
                }, 50)
            }
        }
        getMessagesData()
    }, [id, dispatch, auth, message.data])

    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setIsLoadMore])

    useEffect(() => {
        if (isLoadMore > 1) {
            if (result >= page * 9) {
                dispatch(loadMoreMessages({ auth, id, page: page + 1 }))
                setIsLoadMore(1)
            }
        }
    }, [isLoadMore, result, page, dispatch, auth, id])

    const handleDeleteConversation = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
            dispatch(deleteConversation({ auth, id }))
            return history.push('/message')
        }
    }

    const handleGoBack = () => {
        history.push('/message');
    };

    const handleTextChange = (e) => {
        const value = e.target.value;
        setText(value.slice(0, 1000));
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 170px)',
        }}>
            <div className="message_header" style={{ cursor: 'pointer' }} >
                {user.length !== 0 &&
                    <div className="d-flex p-2 align-items-center justify-content-between w-100">
                        <div className="d-flex align-items-center">
                            <Avatar src={user.avatar || "/default-avatar.png"} size="big-avatar" />
                            <div className="ml-1" style={{ transform: 'translateY(-2px)' }}>
                                <span className="d-block">{user.username || "Usuario desconocido"}</span>
                                <small style={{ opacity: 0.7 }}>
                                    {user.fullname || user.username || ""}
                                    
                                    {/* 🔥 INDICADOR DE TYPING */}
                                    {message.typing && Array.isArray(message.typing) && 
                                     message.typing.some(item => item.sender === id && item.chatId === id) && (
                                        <span className="typing-indicator" style={{
                                            marginLeft: '5px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            color: theme ? '#aaa' : '#666',
                                            fontSize: '12px',
                                            fontStyle: 'italic'
                                        }}>
                                            <span className="typing-dots">
                                                <span>.</span>
                                                <span>.</span>
                                                <span>.</span>
                                            </span>
                                            {t('chat.typing')}
                                        </span>
                                    )}
                                </small>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-arrow-left mr-4" onClick={handleGoBack} />
                            <i className="fas fa-trash text-danger" onClick={handleDeleteConversation} />
                        </div>
                    </div>
                }
            </div>

            <div className="chat_container" style={{ flex: 1, overflowY: 'auto' }}>
                <div className="chat_display" ref={refDisplay}>
                    <button style={{ marginTop: '-25px', opacity: 0 }} ref={pageEnd}>
                        {t('chat.loadMore')}
                    </button>

                    {data.map((msg, index) => (
                        <div key={index}>
                            {msg.sender !== auth.user._id &&
                                <div className="chat_row other_message">
                                    <MsgDisplay user={user} msg={msg} theme={theme} />
                                </div>
                            }
                            {msg.sender === auth.user._id &&
                                <div className="chat_row you_message">
                                    <MsgDisplay user={auth.user} msg={msg} theme={theme} data={data} />
                                </div>
                            }
                        </div>
                    ))}

                    {loadMedia &&
                        <div className="chat_row you_message">
                            <img src={LoadIcon} alt={t('chat.loading')} />
                        </div>
                    }
                </div>
            </div>

            <div className="show_media" style={{ display: media.length > 0 ? 'grid' : 'none' }}>
                {media.map((item, index) => (
                    <div key={index} id="file_media">
                        {item.type.match(/video/i)
                            ? videoShow(URL.createObjectURL(item), theme)
                            : imageShow(URL.createObjectURL(item), theme)
                        }
                        <span onClick={() => handleDeleteMedia(index)}>&times;</span>
                    </div>
                ))}
            </div>

            <form className="chat_input" onSubmit={handleSubmit} style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px'
            }}>
                <input
                    type="text"
                    placeholder={t('chat.placeholder')}
                    value={text}
                    onChange={handleTextChange}
                    style={{
                        filter: theme ? 'invert(1)' : 'invert(0)',
                        background: theme ? '#040404' : '',
                        color: theme ? 'white' : '',
                        border: textError ? '1px solid #dc3545' : '',
                        direction: lang === 'ar' ? 'rtl' : 'ltr'
                    }}
                />

                {text.length > 0 && (
                    <div className="small text-muted" style={{
                        position: 'absolute',
                        bottom: '-20px',
                        right: lang === 'ar' ? 'auto' : '10px',
                        left: lang === 'ar' ? '10px' : 'auto',
                        fontSize: '10px',
                        color: text.length > 900 ? '#dc3545' : '#6c757d'
                    }}>
                        {t('chat.charCount', { count: text.length })}
                    </div>
                )}

                <Icons setContent={setText} content={text} theme={theme} />

                {(auth.user?.role === "Super-utilisateur" || auth.user?.role === "admin") && (
                    <div className="file_upload">
                        <i className="fas fa-image text-danger" />
                        <input
                            type="file"
                            name="file"
                            id="file"
                            multiple
                            accept="image/*"
                            onChange={handleChangeMedia}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="material-icons"
                    disabled={(text.trim() || media.length > 0) && !textError ? false : true}
                    style={{ opacity: (text.trim() || media.length > 0) && !textError ? 1 : 0.5 }}
                    title={t('chat.send')}
                >
                    near_me
                </button>
            </form>

            {textError && (
                <div className="small text-danger mt-1" style={{ padding: '0 10px' }}>
                    {t('chat.validationError', { error: textError })}
                </div>
            )}

            {/* 🔥 Estilos para la animación de typing */}
            <style>
                {`
                    .typing-dots {
                        display: inline-flex;
                        margin-right: 5px;
                    }
    
                    .typing-dots span {
                        animation: typing-dot 1.5s infinite;
                        margin: 0 1px;
                        font-size: 16px;
                        font-weight: bold;
                    }
    
                    .typing-dots span:nth-child(2) {
                        animation-delay: 0.2s;
                    }
    
                    .typing-dots span:nth-child(3) {
                        animation-delay: 0.4s;
                    }
    
                    @keyframes typing-dot {
                        0%, 60%, 100% {
                            transform: translateY(0);
                            opacity: 0.6;
                        }
                        30% {
                            transform: translateY(-3px);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    )
}

export default RightSide