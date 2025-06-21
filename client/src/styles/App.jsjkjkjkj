import { useEffect } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Drawerr from './pages/drawerr'
import Alert from './components/alert/Alert'
//import Header from './const { t } = useTranslation();'
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
import Drawer from './components/Drawer';
 
function App() {
  const { auth, status, modal, call,languageReducer } = useSelector(state => state)
  const dispatch = useDispatch()
  const language = languageReducer?.language || localStorage.getItem("lang") || "en";

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
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {   
       dispatch(getPosts(auth.token))
    if(auth.token) {
      dispatch(getPostsPendientes(auth.token))

      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])
 //<Route exact path="/drawer" component={Drawerr} />
 
  
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])

 


  return (
 
  <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
        <Navbar2/>
       {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}
          
          <Route exact path="/login" component={Login} />
        
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
           <Route exact path="/bloqueos" component={Bloqueoss} />
          <Route exact path="/post/:id" component={Post}/> 
        
          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
          
        </div>
      </div>
    </Router>
    

  );
}

export default App;
