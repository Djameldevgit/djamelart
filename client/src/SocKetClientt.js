// socket.js
import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production'
  ? 'https://djamelart.onrender.com'
  : 'http://localhost:5000';

const socket = io(URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
