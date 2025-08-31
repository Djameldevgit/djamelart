import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'

const LeftSide = () => {
  const { auth, message, online } = useSelector(state => state)
  const dispatch = useDispatch()

  const [searchUsers, setSearchUsers] = useState([])
  const history = useHistory()
  const { id } = useParams()

  const pageEnd = useRef()
  const [page, setPage] = useState(0)

  const handleAddUser = (user) => {
    setSearchUsers([])
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: '', media: [] }
    })
    dispatch({
      type: MESS_TYPES.CHECK_ONLINE_OFFLINE,
      payload: online
    })
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

  // Load more logic
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

    return () => observer.disconnect()
  }, [setPage])

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }))
    }
  }, [message.resultUsers, page, auth, dispatch])

  // Actualizar estado online/offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({
        type: MESS_TYPES.CHECK_ONLINE_OFFLINE,
        payload: online
      })
    }
  }, [online, message.firstLoad, dispatch])

  return (
    <>
      <div className="message_chat_list">
        {
          searchUsers.length !== 0
            ? <>
              {
                searchUsers.map(user => (
                  <div key={user._id} className={`message_user ${isActive(user)}`}
                    onClick={() => handleAddUser(user)}>
                    <UserCard user={user} />
                  </div>
                ))
              }
            </>
            : <>
              {
                message.users.map(user => (
                  <div key={user._id} className={`message_user ${isActive(user)}`}
                    onClick={() => handleAddUser(user)}>
                    <UserCard user={user} msg={true}>
                      {
                        user.isOnline
                          ? <i className="fas fa-circle text-success" />
                          : <i className="fas fa-circle text-secondary" />
                      }
                    </UserCard>
                  </div>
                ))
              }
            </>
        }

        <button ref={pageEnd} style={{ opacity: 0 }}>Load More</button>
      </div>
    </>
  )
}

export default LeftSide
