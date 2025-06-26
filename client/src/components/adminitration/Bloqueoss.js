import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Bloqueoss = () => {
  const { auth, userBlockReducer } = useSelector(state => state);
  const user = auth.user;

  // Obtenemos el objeto de bloqueo completo (si existe)
  const userBlockedInfo = userBlockReducer.blockedUsers.find(
    blockedUser => blockedUser.user._id === user._id
  );

  const isBlocked = userBlockedInfo?.user?._id === user._id;

  useEffect(() => {
    if (!auth.token) {
      console.log("No estás autenticado");
    }
  }, [auth.token]);

  return (
    <div className="bloqueo-container">
      {isBlocked ? (
        <div className="bloqueo-card">
          <h2>Système de blocage ART TASSILI  </h2>
          <div className="bloqueo-info">
            <div className="bloqueo-item">
              <span className="label">Nom d'utilisateur: </span>
              <span className="value">{user.username}</span>
            </div>
            <div className="bloqueo-item">
              <span className="label">Raison: </span>
              <span className="value">{userBlockedInfo.motivo || 'No disponible'}</span>
            </div>
            <div className="bloqueo-item">
              <span className="label">Description </span>
              <span className="value">{userBlockedInfo.content|| 'No disponible'}</span>
            </div>


            <div className="bloqueo-item">
              <span className="label">Date du blocage: </span>
              <span className="value">
                {userBlockedInfo.createdAt
                  ? new Date(userBlockedInfo.createdAt).toLocaleDateString()
                  : 'No disponible'}
              </span>
            </div>
         

            <div className="bloqueo-item">
              <span className="label">Fin du blocage: </span>
              <span className="value">
                {userBlockedInfo.fechaLimite 
                  ? new Date(userBlockedInfo.fechaLimite).toLocaleDateString()
                  : 'No disponible'}
              </span>
            </div>
 

            <div className="bloqueo-item">
              <span className="label">Responsable du blocage: </span>
              <span className="value">
                {userBlockedInfo.userquibloquea?.username || 'Administrateur'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bloqueo-card">
          <h2>Utilisateur débloqué</h2>
        </div>
      )}
    </div>
  );
};

export default Bloqueoss;
