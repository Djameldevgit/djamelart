import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { logout } from '../redux/actions/authAction';
import { Navbar, Container,   Offcanvas, Button, Badge } from 'react-bootstrap'
const Navbar2Auth = memo(() => {
  const { auth, roleReducer } = useSelector((state) => ({
    auth: state.auth,
    roleReducer: state.roleReducer
  }));
  
  const { t } = useTranslation(['navbar']);
  const dispatch = useDispatch();

  // Calcula el rol actual basado en el estado de Redux
  const currentRole = roleReducer.isAdmin ? 'admin' : 
                     roleReducer.isModerator ? 'Moderateur' : 
                     roleReducer.isSuperUser ? 'Super-utilisateur' : 
                     auth.user?.role || 'user';

  // Debug: Verifica cuando cambia el rol
  useEffect(() => {
    console.log('Rol actualizado en Navbar2Auth:', currentRole);
  }, [currentRole]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const roleMenus = {
    user: [
      { to: "/cart/orders", label: t('orders'), icon: "🛒" },
      { to: "/contact", label: t('contact'), icon: "📩" },
    ],
   
    admin: [
      { to: "/users/userss", label: t('users'), icon: "👥" },
      { to: "/users/usersaction", label: t('userActions'), icon: "🔄" },
      { to: "/users/bloqueos", label: t('blockedUsers'), icon: "⚠️" },
      { to: "/postspendientes", label: t('pendingPosts'), icon: "📭" },
      { to: "/reportesusers", label: t('userReports'), icon: "🚨" },
      { to: "/rolesuser", label: t('roles'), icon: "🛠️" },
      { to: "/form", label: t('forms'), icon: "📝" },
      { to: "/messageadmin", label: t('chatWithAdmins'), icon: "💼" },
      { to: "/users/adminsendemail", label: t('adminSendEmail'), icon: "✉️" },
    ]
  };

  return (
    <div className="dropdown-scroll-wrapper">
      {auth.user ? (
        <>
          <NavDropdown.Header>
            {auth.user.username} <Badge bg={
              currentRole === 'admin' ? 'danger' : 
              currentRole === 'Moderateur' ? 'warning' : 'info'
            }>
              {currentRole}
            </Badge>
          </NavDropdown.Header>

          {roleMenus[currentRole]?.map((item, i) => (
            <NavDropdown.Item key={i} as={Link} to={item.to}>
              {item.icon} {item.label}
            </NavDropdown.Item>
          ))}

          <NavDropdown.Divider />

          <NavDropdown.Item as={Link} to="/settings">
            ⚙️ {t('settings')}
          </NavDropdown.Item>
          <NavDropdown.Item onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> {t('logout')}
          </NavDropdown.Item>
        </>
      ) : (
        <>
          <NavDropdown.Item as={Link} to="/login">
            <FaSignInAlt className="me-1" /> {t('login')}
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/register">
            <FaUserPlus className="me-1" /> {t('register')}
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/bloginfo">
            ℹ️ {t('appInfo')}
          </NavDropdown.Item>
        </>
      )}
    </div>
  );
});

export default Navbar2Auth;