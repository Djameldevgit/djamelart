import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import i18n from './i18n';

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

import Alert from './components/alert/Alert'

import StatusModal from './components/StatusModal'

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import CallModal from './components/message/CallModal'

import { getPostsPendientes } from './redux/actions/postAproveAction'
import Postspendientes from './pages/postspendientes'

import Post from './pages/post'
import Bloqueoss from './components/Bloqueoss';

import Navbar2 from './components/Navbar2'

import LanguageSelectorandroid from './components/LanguageSelectorandroid'
import Roles from './pages/roles';


import { getCart } from './redux/actions/cartAction';

import Cart from './pages/carte/cart';
import Chekoutt from './pages/carte/Chekoutt';
import Profile from './pages/profile.';
import Message from './pages/message';
import Informacionaplicacion from './pages/informacionaplicacion';
import Orderss from './pages/carte/orderss';
import { getOrders } from './redux/actions/orderAction';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

import NotFound from './components/NotFound';

import ActivatePage from './auth/ActivatePage';
 
import { getUsers } from './redux/actions/userAction';
import { getBlockedUsers } from './redux/actions/userBlockAction';
import Usersblock from './pages/usersblock';
import UsersActionAction from './pages/users/UsersActionAction';
 
import Paginabloqueos from './pages/users/paginabloqueos';
import Userss from './pages/users/userss';
import UsersActionn from './pages/users/UsersActionn';
import ListaUseariosbloqueadoss from './pages/listaUseariosbloqueadoss';
import AdminSendEmails from './pages/users/adminSendEmails';

function App() {
  const { auth, status, modal, call, languageReducer } = useSelector(state => state)
  const { isLogged, isAdmin } = auth
  const dispatch = useDispatch()
  const language = languageReducer?.language || localStorage.getItem("lang") || "en";

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language); // ✅ sincroniza con i18n
      localStorage.setItem('language', language); // ✅ persistencia
    }
  }, [language]);
  // Efecto para manejar el idioma y dirección del texto
  useEffect(() => {
    if (language === "ar") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }

  }, [language]);

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  }, [dispatch])

  useEffect(() => {

    dispatch(getPosts())//EHECUTAR LAS ACCIONES GETUSER Y GETUSERSACTION EN SUS PROPIOS COMPONENTE
    if (auth.token) {
      dispatch(getCart((auth.token)))
      dispatch(getOrders((auth.token)))
      dispatch(getUsers(auth.token))
 
      dispatch(getPostsPendientes(auth.token))
      dispatch(getBlockedUsers(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])


  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") { }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, [])




  return (


    <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <LanguageSelectorandroid />
        <div className="main">
          <Navbar2 />
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Route exact path="/login" component={Login} />

          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/bloqueos" component={Bloqueoss} />
          <Route exact path="/post/:id" component={Post} />
          <Route exact path="/message/:id" component={Message} />
          <Route exact path="/profile/:id" component={auth.token ? Profile : Login} />
          <Route exact path="/profile/:id" component={auth.token ? Profile : Login} />
          <Route exact path="/users/adminsendemail" component={auth.token ? AdminSendEmails : Login} />
          <Route exact path="/chekout" component={auth.token ? Chekoutt : Login} />
          <Route exact path="/rolesuser" component={auth.token ? Roles : Login} />
          <Route exact path="/users/userss" component={auth.token ? Userss : Login} />
          <Route exact path="/users/usersaction" component={auth.token ? UsersActionn : Login} />

          <Route exact path="/users/usersedicion" component={auth.token ? UsersActionAction : Login} />
           <Route exact path="/postspendientes" component={auth.token ? Postspendientes : Login} />

          <Route exact path="/users/bloqueos" component={auth.token ? ListaUseariosbloqueadoss : Login} />

          <Route exact path="/informacionaplicacion" component={Informacionaplicacion} />
          <Route exact path="/orderss" component={auth.token ? Orderss : Login} />
          <Route exact path="/usersblock" component={auth.token ? Usersblock : Login} />

          <Route exact path="/forgot_password" component={ForgotPassword } />
          <Route path="/user/reset/:token" component={ResetPassword} exact />


          <Route exact path="/activatepage" component={auth.token ? ActivatePage : Login} />

          <Route exact path="/activatepage" component={auth.token ? ActivatePage : Login} />
        </div>
      </div>
    </Router>


  );
}

export default App;
