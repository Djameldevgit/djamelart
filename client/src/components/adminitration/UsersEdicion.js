import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { USER_TYPES } from "../../redux/actions/userAction";
import LoadMoreBtn from "../LoadMoreBtn";
import LoadIcon from "../../images/loading.gif";
import UserCard from "../UserCard";
import BloqueModalUser from "./BloqueModalUser";
 
const UsersEdicion = () => {
  const { homeUsers,reportReducer, auth } = useSelector((state) => state);
    const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(homeUsers.users || []);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (user) => {
    setSelectedUser(user); // Guardamos el usuario que queremos bloquear
    setOpenBlockModal(true); // Abrimos el modal
  };
 /*
  const loadUsers = async () => {
    const res = await getDataAPI(`users?limit=${homeUsers.page * 9}`, auth.token);
    dispatch({
      type: USER_TYPES.GET_USERS,
      payload: { ...res.data, page: homeUsers.page + 1 },
    });
  };*/
  
  const handleCloseModal = () => {
    setOpenBlockModal(false); // Cerramos el modal
    setSelectedUser(null); // Limpiamos el usuario seleccionado
  };
  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`users?limit=${homeUsers.page * 9}`, auth.token);
    dispatch({
      type: USER_TYPES.GET_USERS,
      payload: { ...res.data, page: homeUsers.page + 1 },
    });
    setLoad(false);
  };

  useEffect(() => {
    setFilteredUsers(homeUsers.users || []);
  }, [homeUsers.users]);

  const filteredResults = filteredUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );


  const handleFilter = (criteria) => {
    let sortedUsers = [...homeUsers.users];

    switch (criteria) {
      case "mostReported":
        sortedUsers.sort((a, b) => (b.reportCount || 0) - (a.reportCount || 0));
        break;
      case "lastLogin":
        sortedUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
        break;
      default:
        sortedUsers = homeUsers.users;
    }

    setFilteredUsers(sortedUsers);
  };

  return (
    <div>
  {/* Contenido de la tabla y filtros */}
  <div>
    <div className="dropdown mb-3">
      Edición
      <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Filtrar
      </button>
      <ul className="dropdown-menu">
        <li><button className="dropdown-item" onClick={() => handleFilter("mostReported")}>🚨 Más denunciados</button></li>
        <li><button className="dropdown-item" onClick={() => handleFilter("lastLogin")}>🔄 Últimos en iniciar sesión</button></li>
        <li><button className="dropdown-item" onClick={() => handleFilter("reset")}>🔄 Restablecer</button></li>
      </ul>
    </div>

    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Usuario</th>
          <th>Registro</th>
          <th>Último Login</th>
          <th>Estado</th> {/* Nuevo campo para el estado de bloqueo */}
          <th>Reportes</th>
          <th>Reportado Por</th>
          <th>Última IP</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  {filteredResults.map((user, index) => (
    <tr key={user._id}>
      <td>{index + 1}</td>
      <td><UserCard user={user} /></td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
      <td>
        {user.esBloqueado ? ( // Verifica si el usuario está bloqueado
          <span className="text-danger">🚫 Bloqueado</span> // Ícono y texto para bloqueado
        ) : (
          <span className="text-success">✅ Activo</span> // Ícono y texto para activo
        )}
      </td>
      <td>{user.reportCount || 0}</td>
      <td>{user.reportedBy || "N/A"}</td>
      <td>{user.lastIp || "Desconocida"}</td>
      <td>
        <div className="action-dropdown" style={{ position: "relative" }}>
          <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Acción
          </button>
          <div className="dropdown-menu">
            <button className="dropdown-item text-warning" onClick={() => handleOpenModal(user)}>
              {user.esBloqueado ? "🔓 Desbloquear" : "🚫 Bloquear"} {/* Cambia el texto según el estado */}
            </button>
            <button className="dropdown-item">✏️ Editar</button>
            <button className="dropdown-item text-danger">🗑️ Eliminar</button>
            <button className="dropdown-item text-warning">🔇 Silenciar</button>
            <button className="dropdown-item">📩 Enviar mensaje</button>
            <button className="dropdown-item">👤 Ver perfil</button>
            <button className="dropdown-item">🚨 Ver reportes</button>
            <button className="dropdown-item text-info">🔑 Iniciar sesión como usuario</button>
          </div>
        </div>
      </td>
    </tr>
  ))}
</tbody>
    </table>

    {load && <img src={LoadIcon} alt="loading" className="loading-icon" />}
    <LoadMoreBtn result={homeUsers.result} page={homeUsers.page} load={load} handleLoadMore={handleLoadMore} />
  </div>

  {/* 🟢 Mueve el modal fuera del contenedor de la tabla */}
  {openBlockModal && (
    <BloqueModalUser user={selectedUser} setOpenBlockModal={handleCloseModal} />
  )}
</div>


  )
};

export default UsersEdicion;