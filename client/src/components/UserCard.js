import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserCard = ({ children, user, border, handleClose, setShowFollowers, setShowFollowing, msg }) => {
  const { theme, auth } = useSelector(state => state) // Asegúrate de tener auth en tu estado

  if (!user) {
    return null
  }

  const handleCloseAll = () => {
    if (handleClose) handleClose()
    if (setShowFollowers) setShowFollowers(false)
    if (setShowFollowing) setShowFollowing(false)
  }

  const showMsg = (user) => {
    return (
      <>
        <div style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
          {user.text}
        </div>
        {user.media?.length > 0 &&
          <div>
            {user.media.length} <i className="fas fa-image" />
          </div>
        }
        {user.call &&
          <span className="material-icons">
            {
              user.call.times === 0
                ? user.call.video ? 'videocam_off' : 'phone_disabled'
                : user.call.video ? 'video_camera_front' : 'call'
            }
          </span>
        }
      </>
    )
  }

  // Determinar si el usuario actual es administrador
  const isAdmin = auth.user?.role === "admin"
  // Determinar si es el propio perfil del usuario
  const isOwnProfile = auth.user?._id === user._id

  return (
    <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
      <div>
        {/* Mostrar Link solo para admins o para el propio perfil */}
        {(isAdmin || isOwnProfile) ? (
          <Link
            to={`/profile/${user._id}`}
            onClick={handleCloseAll}
            className="d-flex align-items-center"
          >
            <Avatar src={user.avatar || "/default-avatar.png"} size="big-avatar" />
            <div className="ml-1" style={{ transform: 'translateY(-2px)' }}>
              <span className="d-block">{user.username || "Usuario desconocido"}</span>
              <small style={{ opacity: 0.7 }}>
                {msg ? showMsg(user) : user.fullname || ""}
              </small>



              
            </div>
          </Link>
        ) : (
          // Para usuarios normales que no son admins y no es su propio perfil
          <div className="d-flex align-items-center">
            <Avatar src={user.avatar || "/default-avatar.png"} size="big-avatar" />
            <div className="ml-1" style={{ transform: 'translateY(-2px)' }}>
              <span className="d-block">{user.username || "Usuario desconocido"}</span>
              <small style={{ opacity: 0.7 }}>
                {msg ? showMsg(user) : user.fullname || ""}
              </small>
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

export default UserCard
/*
 <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <Link 
                  to={`/profile/${user._id || ""}`} 
                  onClick={handleCloseAll}
                  className="d-flex align-items-center"
                >
                    <Avatar src={user.avatar || "/default-avatar.png"} size="big-avatar" />
                    <div className="ml-1" style={{transform: 'translateY(-2px)'}}>
                        <span className="d-block">{user.username || "Usuario desconocido"}</span>
                        <small style={{opacity: 0.7}}>
                            { msg ? showMsg(user) : (user.username || "") }
                        </small>
                    </div>
                </Link>
            </div>
            {children}
        </div>
        */