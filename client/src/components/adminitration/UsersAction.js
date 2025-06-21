import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { deleteUser, USER_TYPES } from "../../redux/actions/userAction";
import LoadMoreBtn from "../LoadMoreBtn";
import LoadIcon from "../../images/loading.gif";
import UserCard from "../UserCard";
import { Dropdown } from "react-bootstrap"; // Importamos Dropdown de react-bootstrap

const UsersAction = () => {
  const { homeUsers, auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cargar usuarios iniciales
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI(`users?limit=9`, auth.token);

        if (res.data && res.data.users) {
          dispatch({
            type: USER_TYPES.GET_USERS,
            payload: { ...res.data, page: 1 },
          });
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && auth.token) {
      fetchUsers();
    }
  }, [auth.token, dispatch, initialLoad]);

  const handleLoadMore = async () => {
    setLoad(true);
    try {
      const res = await getDataAPI(`users?limit=${homeUsers.page * 9}`, auth.token);
      dispatch({
        type: USER_TYPES.GET_USERS,
        payload: { ...res.data, page: homeUsers.page + 1 },
      });
    } catch (err) {
      console.error("Error loading more users:", err);
    } finally {
      setLoad(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario permanentemente?")) {
      try {
        await dispatch(deleteUser({ id: userId, auth }));

        // Actualizar la lista de usuarios después de eliminar
        const res = await getDataAPI(`users?limit=${homeUsers.page * 9}`, auth.token);
        dispatch({
          type: USER_TYPES.GET_USERS,
          payload: { ...res.data, page: homeUsers.page },
        });
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <img src={LoadIcon} alt="loading" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th width="5%">#</th>
              <th width="20%">Usuario</th>
              <th width="15%">Email</th>
              <th width="15%">Username</th>
              <th width="15%">Registro</th>
              <th width="15%">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {homeUsers.users.length > 0 ? (
              homeUsers.users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td><UserCard user={user} /></td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.isVerified ? (
                      <span className="badge bg-success">✔ Activado</span>
                    ) : (
                      <span className="badge bg-danger">✘ No activado</span>
                    )}
                  </td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id={`dropdown-actions-${user._id}`}
                      >
                        Acciones
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          as="button"
                          onClick={() => {
                            // Función para editar
                          }}
                        >
                          ✏️ Editar
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          className="text-danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          🗑️ Eliminar
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          className="text-warning"
                          onClick={() => {
                            // Función para bloquear
                          }}
                        >
                          🚫 Bloquear
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          className="text-warning"
                          onClick={() => {
                            // Función para desactivar
                          }}
                        >
                          🔇 Desactivar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto my-3" />}

      {homeUsers.users.length > 0 && (
        <div className="d-flex justify-content-center my-3">
          <LoadMoreBtn
            result={homeUsers.result}
            page={homeUsers.page}
            load={load}
            handleLoadMore={handleLoadMore}
          />
        </div>
      )}
    </div>
  );
};

export default UsersAction;