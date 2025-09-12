import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'
import { getDataAPI } from '../../utils/fetchData'

// 🔥 Import para traducción
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

const LeftSide = () => {
  const { auth, message, online, languageReducer } = useSelector(state => state)
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [searchUsers, setSearchUsers] = useState([])

  const history = useHistory()
  const { id } = useParams()

  const pageEnd = useRef()
  const [page, setPage] = useState(0)

  // ✅ Traducción
  const { t } = useTranslation('chat') // namespace
  const lang = languageReducer.language || 'es'

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  const handleSearch = async e => {
    e.preventDefault()
    if (!search) return setSearchUsers([])

    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token)
      setSearchUsers(res.data.users)
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || t('message.searchError') }
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

  const isActive = (user) => {
    if (id === user._id) return 'active'
    return ''
  }

  useEffect(() => {
    if (message.firstLoad) return
    dispatch(getConversations({ auth }))
  }, [dispatch, auth, message.firstLoad])

  // Load More
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

  // Check User Online - Offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
    }
  }, [online, message.firstLoad, dispatch])

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {auth.user?.role === "admin" &&
        <form className="message_header" onSubmit={handleSearch} >
          <input
            type="text"
            value={search}
            placeholder={t('message.searchPlaceholder', { lng: lang })}
            onChange={e => setSearch(e.target.value)}
            style={{
              direction: lang === 'ar' ? 'rtl' : 'ltr',
              textAlign: lang === 'ar' ? 'right' : 'left'
            }}
          />

          <button type="submit" style={{ display: 'none' }}>
            {t('message.searchButton', { lng: lang })}
          </button>
        </form>
      }

      <div className="message_chat_list">
        {searchUsers.length !== 0
          ? <>
            {searchUsers.map(user => (
              <div
                key={user._id}
                className={`message_user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))}
          </>
          : <>
            {message.users.length === 0 ? (
              <div className="text-center p-3 text-muted">
                {t('message.noUsersFound', { lng: lang })}
              </div>
            ) : (
              message.users.map(user => (
                <div
                  key={user._id}
                  className={`message_user ${isActive(user)}`}
                  onClick={() => handleAddUser(user)}
                >
                  <UserCard user={user} msg={true}>
                    {user.online ? (
                      <i
                        className="fas fa-circle text-success"
                        title={t('message.online', { lng: lang })}
                      />
                    ) : (
                      auth.user.following.find(item => item._id === user._id) && (
                        <i
                          className="fas fa-circle"
                          title={t('message.offline', { lng: lang })}
                        />
                      )
                    )}
                  </UserCard>
                </div>
              ))
            )}
          </>
        }

        <button
          ref={pageEnd}
          style={{ opacity: 0 }}
          aria-label={t('message.loadMore2', { lng: lang })}
        >
          {t('message.loadMore2', { lng: lang })}
        </button>
      </div>
    </div>
  )
}

export default LeftSide
