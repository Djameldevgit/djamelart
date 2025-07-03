import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../../../utils/fetchData';
import { Card, ListGroup, Spinner } from 'react-bootstrap';
import { setActiveChat } from '../../../../redux/actions/chatAction'; // ✅ SOLO AQUÍ

const ConversationsList = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await getDataAPI(`conversations/${auth.user._id}`, auth.token);
        setConversations(res.data);
      } catch (err) {
        console.error('❌ Error al obtener conversaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.user?._id) fetchConversations();
  }, [auth.user, auth.token]);

  const getPartner = (members = []) => {
    if (!Array.isArray(members)) return null;
    return members.find(member => member._id !== auth.user._id) || members[0];
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <Card className="mt-4">
      <Card.Header>📨 Conversaciones</Card.Header>
      <ListGroup variant="flush">
        {conversations.length === 0 && (
          <ListGroup.Item>No tienes conversaciones aún.</ListGroup.Item>
        )}
        {conversations.map((conv) => {
          const partner = getPartner(conv.members);
          return (
            <ListGroup.Item
              key={conv._id}
              className="d-flex align-items-center"
              action
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(setActiveChat(partner))} // ✅ Al hacer click
            >
              <img
                src={partner.avatar || '/default-avatar.png'}
                alt="avatar"
                width="40"
                height="40"
                className="rounded-circle me-3"
              />
              <div>
                <strong>{partner.username || 'Usuario'}</strong>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
};

export default ConversationsList;
