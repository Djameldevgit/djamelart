// Navbar2Auth.js
import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavDropdown, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { logout } from '../../redux/actions/authAction';

const Navbar2Auth = memo(() => {
  const { auth, roleReducer } = useSelector((state) => ({
    auth: state.auth,
    roleReducer: state.roleReducer
  }));

  const { t } = useTranslation(['navbar']);
  const dispatch = useDispatch();

  // Determinar el rol actual
  const currentRole = roleReducer.isAdmin
    ? 'admin'
    : roleReducer.isModerator
    ? 'Moderateur'
    : roleReducer.isSuperUser
    ? 'Super-utilisateur'
    : auth.user?.role || 'user';

  // Debug para ver si cambia el rol en tiempo real
  useEffect(() => {
    console.log('Rol actualizado en Navbar2Auth:', currentRole);
  }, [currentRole]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Menús por rol
  const roleMenus = {
    user: [
      { to: null, action: "openStatusModal", label: t('navbar:addPost'), icon: "➕" },
      { to: "/contact", label: t('navbar:contact'), icon: "📩" },
      { to: "/bloginfo", label: t('navbar:appInfo'), icon: "ℹ️" },
      { to: `/profile/${auth.user._id}`, label: t('navbar:profile'), icon: "👤" }, // Reemplazado por emoji
      { to: "/message", label: t('navbar:conversations'), icon: "💬" },
      { to: "/rolesuser", label: t('navbar:roles'), icon: "🛠️" },
      { to: "/cart/orders", label: t('orders'), icon: "🛒" }
    ],
    admin: [
      { to: "/blog", label: "blog", icon: null },
      { to: "/messageadmin", label: t('navbar:chatear con los administradores'), icon: "💼" },
      { to: "/users/adminsendemail", label: t('navbar:adminSendEmail'), icon: "✉️" },
      { to: "/users/userss", label: t('navbar:users'), icon: "👥" },
      { to: "/postspendientes", label: t('navbar:pendingPosts'), icon: "📭" },
      { to: "/users/usersaction", label: t('navbar:userActions'), icon: "🔄" },
      { to: "/reportesusers", label: t('navbar:userReports'), icon: "🚨" },
      { to: "/users/bloqueos", label: t('navbar:blockedUsers'), icon: "⚠️" },
      { to: "/cart/orderss", label: t('navbar:orders'), icon: null },
      { to: "/rolesuser", label: t('roles'), icon: "🛠️" },
      { to: "/form", label: t('forms'), icon: "📝" }
    ]  };

  return (
    <>
      {auth.user ? (
        <NavDropdown title={
          <>
            {auth.user.username}{" "}
            <Badge bg={
              currentRole === 'admin'
                ? 'danger'
                : currentRole === 'Moderateur'
                ? 'warning'
                : currentRole === 'Super-utilisateur'
                ? 'primary'
                : 'info'
            }>
              {currentRole}
            </Badge>
          </>
        } id="nav-dropdown-auth">
          
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
        </NavDropdown>
      ) : (
        <NavDropdown title={t('account')} id="nav-dropdown-guest">
          <NavDropdown.Item as={Link} to="/login">
            <FaSignInAlt className="me-1" /> {t('login')}
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/register">
            <FaUserPlus className="me-1" /> {t('register')}
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/bloginfo">
            ℹ️ {t('appInfo')}
          </NavDropdown.Item>
        </NavDropdown>
      )}
    </>
  );
});

export default Navbar2Auth;

