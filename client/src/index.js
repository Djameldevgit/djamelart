import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DataProvider from './redux/store'
import { I18nextProvider } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from './i18n';
import socket from './SocKetClientt';
 
ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <DataProvider>
        <GoogleOAuthProvider clientId="64178724638-m6sv2orc068qna74ah155kdrmd61gj91.apps.googleusercontent.com">
          <App socket={socket}/>
          
        </GoogleOAuthProvider>
      </DataProvider>
    </React.StrictMode>,
  </I18nextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
