import React,{useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NoNotice from '../images/notice.png'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import moment from 'moment'
import { isReadNotify, NOTIFY_TYPES, deleteAllNotifies, getNotifies } from '../redux/actions/notifyAction'
import { useTranslation } from 'react-i18next'

const NotifyModal = ({ onClose }) => {
  const { auth, notify, languageReducer } = useSelector(state => state)
  const dispatch = useDispatch()
  const { t } = useTranslation('notify')   // 🔑 namespace de traducción
  const lang = languageReducer.language || 'en'

  useEffect(() => {
    if (auth.token) {
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, auth }))
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

  return (
    <div style={{ minWidth: '300px' }}  >
      <div className="d-flex justify-content-between align-items-center px-3">
        <h3>{t('title', { lng: lang })}</h3>
        {
          notify.sound
            ? <i className="fas fa-bell text-danger"
              style={{ fontSize: '1.2rem', cursor: 'pointer' }}
              onClick={handleSound} />
            : <i className="fas fa-bell-slash text-danger"
              style={{ fontSize: '1.2rem', cursor: 'pointer' }}
              onClick={handleSound} />
        }
      </div>
      <hr className="mt-0" />

      {
        notify.data.length === 0 &&
        <div className="text-center">
          <img src={NoNotice} alt="NoNotice" className="w-50" />
          <p className="text-muted">{t('noNotifications', { lng: lang })}</p>
        </div>
      }

      <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        {
          notify.data.map((msg, index) => (
            <div key={index} className="px-2 mb-3" >
              <Link
                to={msg.url}
                className="d-flex text-dark align-items-center"
                onClick={() => {
                  handleIsRead(msg);
                  onClose && onClose(); // 👈 cerrar dropdown si se pasó como prop
                }}
              >
                <Avatar src={msg.user.avatar} size="big-avatar" />

                <div className="mx-1 flex-fill">
                  <div>
                    <strong className="mr-1">{msg.user.username}</strong>
                    <span>
                      {msg.text
                        ? t(msg.text, { ns: msg.textNs || 'notify', lng: lang })
                        : ''}
                    </span>
                  </div>
                  {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
                </div>

                {
                  msg.image &&
                  <div style={{ width: '30px' }}>
                    {
                      msg.image.match(/video/i)
                        ? <video src={msg.image} width="100%" />
                        : <Avatar src={msg.image} size="medium-avatar" />
                    }
                  </div>
                }

              </Link>
              <small className="text-muted d-flex justify-content-between px-2">
                {moment(msg.createdAt).fromNow()}
                {
                  !msg.isRead && <i className="fas fa-circle text-primary" />
                }
              </small>
            </div>
          ))
        }
      </div>

      <hr className="my-1" />
      <div className="text-right text-danger mr-2" style={{ cursor: 'pointer' }}
        onClick={handleDeleteAll}>
        {t('deleteAll', { lng: lang })}
      </div>
    </div>
  )
}

export default NotifyModal
