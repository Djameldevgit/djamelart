import { useSelector, useDispatch } from 'react-redux'; 
import { useTranslation } from 'react-i18next';
import UserCard from '../UserCard';
import { roleuserautenticado, rolemoderador, rolesuperuser, roleadmin } from '../../redux/actions/roleAction';
import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Table,
  Form,
  Card,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  Button
} from 'react-bootstrap';

import { getDataAPI } from '../../utils/fetchData';
import { USER_TYPES } from '../../redux/actions/userAction';
import LoadMoreBtn from "../LoadMoreBtn";
import { debounce } from 'lodash';

const Roless = () => {
  const { homeUsers, auth, alert, languageReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const { t } = useTranslation('roles');
  const lang = languageReducer.language || 'es';

  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Estados para paginación y búsqueda
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);

  // 🔹 Función para buscar usuarios en el servidor
  const searchUsers = useCallback(
    debounce(async (searchTerm, page = 1) => {
      if (!auth.token) return;
      
      try {
        setIsSearching(true);
        const query = `users/search?username=${encodeURIComponent(searchTerm)}&page=${page}&limit=9`;
        const res = await getDataAPI(query, auth.token);
        
        if (page === 1) {
          setSearchResults(res.data.users || []);
        } else {
          setSearchResults(prev => [...prev, ...(res.data.users || [])]);
        }
        
        setSearchPage(page);
        setHasMoreSearch(res.data.users && res.data.users.length === 9);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [auth.token]
  );

  // 🔹 Efecto para realizar búsqueda cuando el término cambia
  useEffect(() => {
    if (search.trim() !== "") {
      searchUsers(search, 1);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [search, searchUsers]);

  // 🔹 Handler para cargar más resultados de búsqueda
  const handleLoadMoreSearch = async () => {
    if (!auth.token || search.trim() === "") return;
    
    try {
      setLoad(true);
      await searchUsers(search, searchPage + 1);
    } catch (err) {
      console.error("Error loading more search results:", err);
    } finally {
      setLoad(false);
    }
  };

  // Fetch inicial de usuarios con paginación
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI(`users?limit=9`, auth.token);
        dispatch({
          type: USER_TYPES.GET_USERS,
          payload: { ...res.data, page: 1 },
        });
      } catch (err) {
        console.error("Error fetching users for roles:", err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && auth.token) {
      fetchUsers();
    }
  }, [auth.token, dispatch, initialLoad]);

  // Handler para cargar más usuarios (cuando no hay búsqueda)
  const handleLoadMore = async () => {
    setLoad(true);
    try {
      const res = await getDataAPI(
        `users?limit=9&page=${homeUsers.page + 1}`,
        auth.token
      );
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

  const handleChangeRole = async (user, selectedRole) => {
    setLoading(true);
    try {
      switch (selectedRole) {
        case 'user':
          await dispatch(roleuserautenticado(user, auth));
          break;
        case 'Super-utilisateur':
          await dispatch(rolesuperuser(user, auth));
          break;
        case 'Moderateur':
          await dispatch(rolemoderador(user, auth));
          break;
        case 'admin':
          await dispatch(roleadmin(user, auth));
          break;
        default:
          break;
      }
      
      // Actualizar resultados de búsqueda si estamos en modo búsqueda
      if (search.trim() !== "") {
        setSearchResults(prev => 
          prev.map(u => u._id === user._id ? {...u, role: selectedRole} : u)
        );
      }
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, selectedRole) => {
    setSelectedRoles(prev => ({ ...prev, [user._id]: selectedRole }));
    await handleChangeRole(user, selectedRole);

    // 🔹 Si el usuario editado es el autenticado => actualiza Redux auth
    if (auth.user && auth.user._id === user._id) {
      dispatch({
        type: "AUTH_UPDATE_ROLE",
        payload: selectedRole
      });
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'admin': 'danger',
      'Moderateur': 'warning',
      'Super-utilisateur': 'info',
      'user': 'secondary'
    };

    return (
      <Badge bg={variants[role] || 'light'} className="text-capitalize">
        {t(`roles.${role}`, { lng: lang })}
      </Badge>
    );
  };

  // Determinar qué usuarios mostrar
  const usersToShow = search.trim() !== "" ? searchResults : homeUsers.users;
  const hasMore = search.trim() !== "" ? hasMoreSearch : homeUsers.result >= 9;

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4" dir={lang === 'ar' ? 'rtl' : 'ltr'} >
      {/* 🔹 Barra de búsqueda */}
      <Row className="justify-content-between align-items-center mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder={t("searchUsers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-pill"
            />
          </Form.Group>
        </Col>
        {search.trim() !== "" && (
          <Col md="auto">
            <Button 
              variant="outline-secondary" 
              onClick={() => setSearch("")}
              size="sm"
            >
              {t('clearSearch')}
            </Button>
          </Col>
        )}
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white" style={{
          direction: lang === 'ar' ? 'rtl' : 'ltr',
          textAlign: lang === 'ar' ? 'right' : 'left',
        }}>
          <h5 className="mb-0">
            <i className="fas fa-user-shield me-2"></i>
            {t('headers.title')}
          </h5>
        </Card.Header>
        <Card.Header>
          <strong>
            {search.trim() !== "" 
              ? t('headers.searchResults', { count: searchResults.length, term: search })
              : t('headers.totalUsers', { count: homeUsers.users.length })
            }
          </strong>   
        </Card.Header>

        <Card.Body>
          {alert.error && (
            <Alert variant="danger" dismissible>
              {alert.error}
            </Alert>
          )}

          {isSearching && search.trim() !== "" && (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">{t('searching')}</p>
            </div>
          )}

          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="bg-light" style={{
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: lang === 'ar' ? 'right' : 'left',
              }}>
                <tr>
                  <th style={{ width: '40%' }}>{t('tableHeadersss.user')}</th>
                  <th style={{ width: '20%' }}>{t('tableHeadersss.currentRole')}</th>
                  <th style={{ width: '40%' }}>{t('tableHeadersss.changeRole')}</th>
                </tr>
              </thead>
              <tbody>
                {usersToShow.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      {search ? t('noUsersFoundSearch') : t('noUsersAvailable')}
                    </td>
                  </tr>
                ) : (
                  usersToShow.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>
                        <UserCard user={user} />
                      </td>
                      <td>
                        {getRoleBadge(selectedRoles[user._id] || user.role)}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {loading && selectedRoles[user._id] ? (
                            <Spinner animation="border" size="sm" className="me-2" />
                          ) : null}
                          <Form.Select
                            size="sm"
                            onChange={(e) => handleRoleChange(user, e.target.value)}
                            value={selectedRoles[user._id] || user.role}
                            disabled={loading}
                            className="w-75"
                          >
                            <option value="user">{t('roles.user')}</option>
                            <option value="Super-utilisateur">{t('roles.Super-utilisateur')}</option>
                            <option value="Moderateur">{t('roles.Moderateur')}</option>
                            <option value="admin">{t('roles.admin')}</option>
                          </Form.Select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* 🔹 Spinner mientras carga más */}
      {load && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* 🔹 Botón para cargar más */}
      {hasMore && usersToShow.length > 0 && (
        <div className="d-flex justify-content-center my-3">
          <LoadMoreBtn
            result={9} // Siempre mostramos el botón si hay más resultados
            page={search.trim() !== "" ? searchPage : homeUsers.page}
            load={load}
            handleLoadMore={search.trim() !== "" ? handleLoadMoreSearch : handleLoadMore}
          />
        </div>
      )}
    </Container>
  );
};

export default Roless;