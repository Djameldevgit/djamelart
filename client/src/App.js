import { useEffect, useState,useRef } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import i18n from './i18n';

import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import ActivatePage from './auth/ActivatePage';
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



import LanguageSelectorandroid from './components/LanguageSelectorandroid'


import { getCart } from './redux/actions/cartAction';


import { getOrders } from './redux/actions/orderAction';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

import { io } from 'socket.io-client';

import { getUsers } from './redux/actions/userAction';
import { getBlockedUsers } from './redux/actions/userBlockAction';


import Navbar2 from './components/header/Navbar2'
import Accordionn from './pages/Accordionn'
import Bloqueos from './pages/bloqueos'
import { getSettings } from './redux/actions/settingsAction';



function App() {
  const { auth, status, modal, languageReducer,notify } = useSelector(state => state)
  const dispatch = useDispatch()
  const language = languageReducer?.language || localStorage.getItem("lang") || "en";
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
  useEffect(() => {
dispatch(getSettings( ));
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
 
  const lastNotifyId = useRef(null);

  useEffect(() => {
    if (notify.data.length > 0) {
      const ultima = notify.data[0];
  
      // Solo ejecutar si es realmente una nueva notificación
      if (ultima._id !== lastNotifyId.current) {
        lastNotifyId.current = ultima._id;
  
        // 🔔 Sonido
        try {
          const audio = new Audio("/sounds/notify.mp3");
          audio.play().catch(err => {
            console.log("⚠️ El sonido requiere interacción del usuario", err);
          });
        } catch (error) {
          console.warn("Sonido no soportado", error);
        }
  
        // 📳 Vibración
        if ("vibrate" in navigator) {
          navigator.vibrate([300, 100, 300, 100, 600]);
        }
      }
    }
  }, [notify.data]);
  

/*
  if (auth.token && auth.user?.esBloqueado) {
    return (
      <Router>
        <Route exact path="/bloqueos" component={Bloqueos} />
        <Route path="*" component={Bloqueos} />
      </Router>
    )
  }
*/


  return (
    <Router>
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
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/bloginfo" component={Accordionn} />

            <Route exact path="/forgot_password" component={ForgotPassword} />
            <Route path="/user/reset/:token" component={ResetPassword} exact />

            <Route path="/user/activate/:activation_token" component={auth.token ? ActivatePage : Login} exact />*/

            <PrivateRouter exact path="/:page" component={PageRender} />
            <PrivateRouter exact path="/:page/:id" component={PageRender} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
