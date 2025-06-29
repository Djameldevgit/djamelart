import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'
import { useTranslation } from 'react-i18next';

const LeftSide = () => {
    const { auth, message, online, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUsers] = useState([])

    const history = useHistory()
    const { id } = useParams()

    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    const { t } = useTranslation('aplicacion')
    const lang = languageReducer.language || 'en'

    const handleSearch = async e => {
        e.preventDefault()
        if (!search) return setSearchUsers([])

        try {
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            setSearchUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.msg }
            })
        }
    }

    const handleAddUser = (user) => {
        setSearch('')
        setSearchUsers([])
        dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
        dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
        return history.push(`/message/${user._id}`)
    }

    const isActive = (user) => id === user._id ? 'active' : ''

    useEffect(() => {
        if (message.firstLoad) return
        dispatch(getConversations({ auth }))
    }, [dispatch, auth, message.firstLoad])

    // Load more conversations with pagination
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

        return () => {
            if (pageEnd.current) observer.unobserve(pageEnd.current)
        }
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

    return (
        <>
            <div className="message_chat_list">
            <form className="message_header" onSubmit={handleSearch} >
                <input type="text" value={search}
                placeholder="Enter to Search..."
                onChange={e => setSearch(e.target.value)} />

                <button type="submit" style={{display: 'none'}}>Search</button>
            </form>


                {
                    message.users.map(user => (
                        <div key={user._id} className={`message_user ${isActive(user)}`}
                            onClick={() => handleAddUser(user)}>
                            <UserCard user={user} msg={true}>
                                {
                                    user.online
                                        ? <i className="fas fa-circle text-success" />
                                        : auth.user.following.find(item =>
                                            item._id === user._id
                                        ) && <i className="fas fa-circle text-secondary" />
                                }

                                {/* Mostrar información de conexión/desconexión */}
                                <div style={{ fontSize: '12px', color: '#777' }}>
                                    {
                                        user.online
                                            ? <span>{t('connected_now', { lng: lang })}</span>
                                            : user.lastDisconnectedAt
                                                ? <span>
                                                    {t('last_connection', { lng: lang })}: {new Date(user.lastDisconnectedAt).toLocaleString(lang)}
                                                  </span>
                                                : <span>{t('never_connected', { lng: lang })}</span>
                                    }
                                </div>
                            </UserCard>
                        </div>
                    ))
                }
                <button ref={pageEnd} style={{ opacity: 0 }}>
                    {t('loadmore', { lng: lang })}
                </button>
            </div>
        </>
    )
}

export default LeftSide
