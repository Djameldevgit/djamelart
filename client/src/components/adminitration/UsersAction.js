import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { USERS_TYPES_ACTION } from "../../redux/actions/usersActionAction";


import LoadMoreBtn from "../LoadMoreBtn";
import LoadIcon from "../../images/loading.gif";
import UserCard from "../UserCard";


const UsersAction = () => {
  const { usersActionReducer, auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(usersActionReducer.users || []);
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const res = await getDataAPI(`users?limit=9`, auth.token);
        dispatch({
          type: USERS_TYPES_ACTION.GET_USERS_ACTION,
          payload: { ...res.data, page: 2 }, // Comenzamos en página 2 ya que la primera ya se cargó
        });
      } catch (err) {
        console.error(err);
      }
    };
  
    if (auth.token && usersActionReducer.users.length === 0) {
      fetchInitialUsers();
    }
  }, [auth.token, dispatch]);
  
  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`users?limit=${usersActionReducer.page * 9}`, auth.token);
    dispatch({
      type: USERS_TYPES_ACTION.GET_USERS_ACTION,
      payload: { ...res.data, page: usersActionReducer.page + 1 },
    });
    setLoad(false);
  };

  useEffect(() => {
    setFilteredUsers(usersActionReducer.users || []);
  }, [usersActionReducer.users]);

  const filteredResults = filteredUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );


  const handleDeleteUser = (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser({ user, auth }));
      // history.push("/"); // Redirigir si es necesario
    }
  };

  const handleFilter = (criteria) => {
    let sortedUsers = [...usersActionReducer.users];

    switch (criteria) {
      case "mostFollowing":
        sortedUsers.sort((a, b) => b.following.length - a.following.length);
        break;
      case "mostFollowers":
        sortedUsers.sort((a, b) => b.followers.length - a.followers.length);
        break;
      case "mostLikesReceived":
        sortedUsers.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
        break;
      case "mostLikesGiven":
        sortedUsers.sort((a, b) => b.likesGiven - a.likesGiven);
        break;
      case "mostCommentsMade":
        sortedUsers.sort((a, b) => b.commentsMade - a.commentsMade);
        break;
      case "lastLogin":
        sortedUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
        break;
      default:
        sortedUsers = usersActionReducer.users;
    }

    setFilteredUsers(sortedUsers);
  };

  return (
    <div>
      <div className="dropdown mb-3">
        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          Filtrar Usuarios
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={() => handleFilter("mostFollowing")}>📌 Más following</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostFollowers")}>📌 Más followers</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostLikesReceived")}>❤️ Más likes recibidos</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostLikesGiven")}>👍 Más likes dados</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostCommentsMade")}>💬 Más comentarios hechos</button></li>
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
            <th>Login</th>
            <th>Posts</th>

            <th>Reportes</th>
            <th>LikesDados</th>
            <th>Likes Recibidos</th>
            <th>Comentarios Hechos</th>
            <th>Comentarios Recibidos</th>
            <th>Siguiendo</th>
            <th>Seguidores</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <th><UserCard user={user} /></th>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
              <td>{user.postCount || 0}</td>

              <td>{user.likesGiven || 0}</td>
              <td>{user.totalLikesReceived || 0}</td>
              <td>{user.commentsMade || 0}</td>
              <td>{user.totalCommentsReceived || 0}</td>
              <td>{user.totalFollowing || 0}</td>
              <td>{user.totalFollowers || 0}</td>

              <td>
                <div className="action-dropdown" style={{ position: "relative" }}>
                  <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Acción
                  </button>
                  <div className="dropdown-menu" data-bs-autoClose="false">
                    <button className="dropdown-item">✏️ Editar</button>

                    <button
                      className="dropdown-item text-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteUser(user); // Pasar el usuario a la función

                      }}
                    >
                      🗑️ Eliminar
                    </button>


                    <button className="dropdown-item text-warning">🚫 Bloquear</button>
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
      <LoadMoreBtn result={usersActionReducer.result} page={usersActionReducer.page} load={load} handleLoadMore={handleLoadMore} />
    </div>
  );
};

export default UsersAction;