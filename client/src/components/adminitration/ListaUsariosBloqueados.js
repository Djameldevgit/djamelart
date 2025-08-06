import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import UserCard from "../UserCard";
import moment from "moment";
import { unBlockUser } from "../../redux/actions/userAction";
import { useTranslation } from 'react-i18next';

const ListaUsuariosBloqueados = () => {
  const dispatch = useDispatch();
  const { userBlockReducer, auth, languageReducer } = useSelector((state) => state);
  const { t } = useTranslation('aplicacion');
  const lang = languageReducer.language || 'en';
  
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    setBlockedUsers(userBlockReducer.blockedUsers || []);
  }, [userBlockReducer.blockedUsers]);
  const formatDate = (date) => moment(date).locale('en').format("DD/MM/YYYY HH:mm");


  const handleDesbloqueo = (user) => {
    const datosDesbloqueo = {
      motivo: t('motivoDesbloqueoManual', { lng: lang }),
      fechaBloqueo: new Date().toISOString(),
      fechaLimite: null
    };

    dispatch(unBlockUser({ auth, datosDesbloqueo, user }));
    setBlockedUsers((prev) => prev.filter((block) => block.user._id !== user._id));
  };

  return (
    <div className="modalusersearchlist">
      <div className="headersearchlist">
        <h5 className="titlesearchlist">{t('usuariosBloqueados', { lng: lang })}</h5>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('usuario', { lng: lang })}</th>
              <th>{t('email', { lng: lang })}</th>
              <th>{t('motivoBloqueo', { lng: lang })}</th>
              <th>{t('fechaBloqueo', { lng: lang })}</th>
              <th>{t('fechaLimite', { lng: lang })}</th>
              <th>{t('administrador', { lng: lang })}</th>
              <th>{t('duracion', { lng: lang })}</th>
              <th>{t('tipoBloqueo', { lng: lang })}</th>
              <th>{t('acciones', { lng: lang })}</th>
            </tr>
          </thead>
          <tbody>
            {blockedUsers.length > 0 ? (
              blockedUsers.map((block, index) => (
                <tr key={block.user._id}>
                  <td>{index + 1}</td>
                  <td><UserCard user={block.user} /></td>
                  <td>{block.user?.email}</td>
                  <td>{block.motivo || t('noEspecificado', { lng: lang })}</td>
                  <td>{formatDate(block.fechaBloqueo)}</td>
                  <td>{formatDate(block.fechaLimite)}</td>
                  <td>{block.userquibloquea?.username || t('desconocido', { lng: lang })}</td>
                  <td>{block.duracion || t('noEspecificado', { lng: lang })}</td>
                  <td>{block.tipoBloqueo || t('noDisponible', { lng: lang })}</td>
                  <td>
                    <div className="action-dropdown">
                      <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        {t('accion', { lng: lang })}
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={() => handleDesbloqueo(block.user)}>
                          {t('desbloquear', { lng: lang })}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">{t('noUsuariosBloqueados', { lng: lang })}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaUsuariosBloqueados;