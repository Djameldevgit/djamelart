import React, { useEffect, useState, useRef } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../../../utils/fetchData';
import socket from '../../../../SocKetClientt';
import axios from 'axios';

const ChatDrawer = () => {
  const auth = useSelector(state => state.auth);
  const chat = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const { receiver, showDrawer } = chat;

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef();

  const senderId = auth.user?._id;
  const receiverId = receiver?._id;
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (!senderId || !receiverId) return;
        const res = await getDataAPI(
          `conversations/find/${senderId}/${receiverId}`,
          auth.token
        );
        setConversationId(res.data._id);
        console.log('🎯 Conversación activa:', res.data);
      } catch (err) {
        console.error('❌ Error al obtener conversación:', err.message);
      }
    };

    if (showDrawer && receiverId) {
      fetchConversation();
    }
  }, [showDrawer, receiverId, senderId, auth.token]);

  // Obtener o crear conversación
  useEffect(() => {
    if (!socket || !senderId || !receiverId || !conversationId) return;
  
    console.log('🟢 Emitiendo joinRoom con conversationId:', conversationId); // AÑADE ESTO
    socket.emit('joinRoom', { conversationId });
  
    const handleReceive = (msg) => {
      console.log('📩 Mensaje recibido en tiempo real:', msg); // AÑADE ESTO
      if (msg.conversation === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    };
  
    socket.on('receiveMessage', handleReceive);
  
    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.emit('leaveRoom', { conversationId });
    };
  }, [socket, conversationId, receiverId]);
  
  

  // Obtener mensajes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!conversationId) return;
        const res = await getDataAPI(`messages/${conversationId}`, auth.token);
        console.log('💬 Mensajes recibidos:', res.data);
        setMessages(res.data);
      } catch (err) {
        console.error('❌ Error al obtener mensajes:', err.message);
      }
    };

    fetchMessages();
  }, [conversationId, auth.token]);

  // Escuchar mensajes en tiempo real
 


  // Enviar mensaje
  const handleSend = async () => {
    if (!message.trim() || !senderId || !receiverId || !conversationId) return;
  
    try {
      const res = await axios.post('/api/messages', {
        sender: senderId,
        receiver: receiverId,
        message,
        conversationId
      }, {
        headers: { Authorization: auth.token }
      });
  
      // Emitir el mensaje a través de socket
      socket.emit('sendMessage', {
        ...res.data,
        room: conversationId // Asegurarnos de incluir la conversación
      });
      
      setMessages(prev => [...prev, res.data]);
      setMessage('');
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err);
    }
  };

  // Scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Offcanvas
      show={showDrawer}
      onHide={() => dispatch({ type: 'CLOSE_CHAT_DRAWER' })}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Chat con {receiver?.username || 'Usuario'}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingBottom: '1rem' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-1 ${msg.sender === senderId ? 'text-end' : 'text-start'}`}
            >
              <span className={`badge bg-${msg.sender === senderId ? 'primary' : 'secondary'}`}>
                {msg.message}
              </span>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        <Form.Group className="mt-3 d-flex">
          <Form.Control
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} className="ms-2">Enviar</Button>
        </Form.Group>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ChatDrawer;
