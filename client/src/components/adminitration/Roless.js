import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import UserCard from '../UserCard';
import { roleuserautenticado, rolemoderador, rolesuperuser, roleadmin } from '../../redux/actions/roleAction';
import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Form,
  Card,
  Badge,
  Spinner,
  Alert
} from 'react-bootstrap';

const Roless = () => {
  const { homeUsers, auth, alert, languageReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const { t } = useTranslation('modales');
  const lang = languageReducer.language || 'es';

  const [selectedRoles, setSelectedRoles] = useState({});
  const [usersList, setUsersList] = useState(homeUsers?.users || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (homeUsers?.users) {
      setUsersList(homeUsers.users);
    }
  }, [homeUsers]);

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
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, selectedRole) => {
    setSelectedRoles(prev => ({ ...prev, [user._id]: selectedRole }));
    await handleChangeRole(user, selectedRole);
  
    setUsersList(prevUsers =>
      prevUsers.map(u => (u._id === user._id ? { ...u, role: selectedRole } : u))
    );
  
    // 🔹 Si el usuario editado es el autenticado => actualiza Redux auth
    if (auth.user && auth.user._id === user._id) {
      dispatch({
        type: "AUTH_UPDATE_ROLE", // crea este type en tu reducer
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

  return (
    <Container className="py-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
        <Card.Header className="text-muted small">
          {t('headers.totalUsers', { count: usersList.length })}
        </Card.Header>

        <Card.Body>
          {alert.error && (
            <Alert variant="danger" dismissible>
              {alert.error}
            </Alert>
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
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      {loading ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        t('noUsersAvailable')
                      )}
                    </td>
                  </tr>
                ) : (
                  usersList.map((user, index) => (
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
    </Container>
  );
};

export default Roless;