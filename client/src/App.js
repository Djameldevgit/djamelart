import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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


import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'

import { getPostsPendientes } from './redux/actions/postAproveAction'
import Postspendientes from './pages/postspendientes'

 

import LanguageSelectorandroid from './components/LanguageSelectorandroid'
import Roles from './pages/roles';


import { getCart } from './redux/actions/cartAction';

import Cart from './pages/carte/cart';
import Chekoutt from './pages/carte/Chekoutt';


import Orderss from './pages/carte/orderss';
import { getOrders } from './redux/actions/orderAction';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

import { io } from 'socket.io-client';
import ActivatePage from './auth/ActivatePage';

import { getUsers } from './redux/actions/userAction';
import { getBlockedUsers } from './redux/actions/userBlockAction';
import Usersblock from './pages/usersblock';
import UsersActionAction from './pages/users/UsersActionAction';

import Userss from './pages/users/userss';
import UsersActionn from './pages/users/UsersActionn';
import ListaUseariosbloqueadoss from './pages/listaUseariosbloqueadoss';
import AdminSendEmails from './pages/users/adminSendEmails';
import Bloqueos from './pages/users/bloqueos';
import Contactt from './pages/contactt';


import Reportess from './pages/users/reportess';

import Post from './pages/post';
import Profile from './pages/profile';
import Message from './pages/message/[id]';
import Messages from './pages/messages';
import Messagesadmin from './pages/messagesadmin';
import Conversationadmin from './pages/messageadmin/[id]';
import InfoAplicacion from './components/blogInfoComment/InfoAplicacion';

 
import Publoblog from './pages/publoblog';
 
import LanguageModalGeneral from './components/LanguageModalGeneral';
import FormCheckBox from './components/FormChekBox';
import Navbar2 from './components/header/Navbar2';
 
import Accordionn from './pages/Accordionn';
import Comment from './pages/Commentss';
 

function App() {
  const { auth, status, modal, languageReducer } = useSelector(state => state)

  const language = languageReducer?.language || localStorage.getItem("lang") || "en";
  const dispatch = useDispatch()
  const [filters, setFilters] = useState({
    category: '',
    title: '',
    theme: '',
    style: '',
    minPrice: '',
    maxPrice: '',
  });


 
     



  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  }, [dispatch])


  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language); // ✅ sincroniza con i18n
      localStorage.setItem('language', language); // ✅ persistencia
    }
  }, [language]);
  // Efecto para manejar el idioma y dirección del texto



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




  if (auth.token && auth.user?.esBloqueado) {
    return (
      <Router>
        <Route exact path="/bloqueos" component={Bloqueos} />
        <Route path="*" component={Bloqueos} />
      </Router>
    )
  }
 
  return (


    <Router>
      <LanguageModalGeneral />
      <Alert />

      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <LanguageSelectorandroid />
        <div className="main">
          <Navbar2 onFiltersChange={setFilters} />

          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          <Switch>

            <Route exact path="/" render={(props) => <Home {...props} filters={filters} />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgot_password" component={ForgotPassword} />
            <Route exact path="/user/reset/:token" component={ResetPassword} />
            <Route exact path="/user/activate/:activation_token" component={ActivatePage} />
            <Route exact path="/post/:id" component={Post} />
            <Route exact path="/message/:id" component={auth.token ? Message : Login} />
            <Route exact path="/message" component={auth.token ? Messages : Login} />

            <Route exact path="/messageadmin/:id" component={auth.token ? Conversationadmin : Login} />
            <Route exact path="/messageadmin" component={auth.token ? Messagesadmin : Login} />

            <Route path="/commentss" component={auth.token ? Comment  : Login} />

            <Route path="/form" component={auth.token ? FormCheckBox: Login} />


            <Route exact path="/reportesusers" component={auth.token ? Reportess : Login} />

            <Route exact path="/profile/:id" component={auth.token ? Profile : Login} />
            <Route exact path="/contact" component={auth.token ? Contactt : Login} />

            <Route exact path="/users/adminsendemail" component={auth.token ? AdminSendEmails : Login} />
            <Route exact path="/cart/chekout" component={auth.token ? Chekoutt : Login} />
            <Route exact path="/cart/cartcarrito" component={auth.token ? Cart : Login} />

            <Route exact path="/rolesuser" component={auth.token ? Roles : Login} />
            <Route exact path="/users/userss" component={auth.token ? Userss : Login} />
            <Route exact path="/users/usersaction" component={auth.token ? UsersActionn : Login} />

            <Route exact path="/users/usersedicion" component={auth.token ? UsersActionAction : Login} />
            <Route exact path="/postspendientes" component={auth.token ? Postspendientes : Login} />

            <Route exact path="/users/bloqueos" component={auth.token ? ListaUseariosbloqueadoss : Login} />

            <Route exact path="/bloginfo" component={Accordionn} />
     
            <Route exact path="/infoaplicacion" component={InfoAplicacion} />

            <Route exact path="/orderss" component={auth.token ? Orderss : Login} />
            <Route exact path="/usersblock" component={auth.token ? Usersblock : Login} />

            <Route exact path="/forgot_password" component={ForgotPassword} />
            <Route path="/user/reset/:token" component={ResetPassword} exact />

            <Route exact path="/publiblog" component={auth.token ? Publoblog : Login} />


            <Route path="/user/activate/:activation_token" component={auth.token ? ActivatePage : Login} exact />*/
          </Switch>
        </div>
      </div>
    </Router>


  );
}

export default App;
