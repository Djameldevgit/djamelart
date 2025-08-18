import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import homePosts from './postReducer'
import modal from './modalReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestions from './suggestionsReducer'
import socket from './socketReducer'
import notify from './notifyReducer'
import message from './messageReducer'
import online from './onlineReducer'
import call from './callReducer'
 
import homePostsAprove from './posAprovetReducer'
import cart from './cartReducer'
import languageReducer from './languageReducer';
import homeUsers from './userReducer';
import orders from './orderReducer'
import userBlockReducer from './userBlcokReducer'
import usersActionReducer from './usersActionReducer'
import blog  from './blogReducer'
import ProvaReducer from './provaReducer'
import reportReducer from './reportReducer'
import publiBlogReducer from './publiBlogReducer'
 
import form  from './formReducer';
import { roleReducer } from './roleReducer'
 
 
 
export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    homePosts,
    modal,
    detailPost,
    discover,
    suggestions,
    socket,
    notify,
    message,
    online,
    call,
   homePostsAprove ,cart,languageReducer,
   roleReducer,homeUsers,orders,userBlockReducer,
   usersActionReducer  ,ProvaReducer,
   reportReducer ,publiBlogReducer ,blog,form 

}) 