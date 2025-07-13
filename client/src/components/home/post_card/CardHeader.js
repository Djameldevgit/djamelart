import React, { useState } from 'react';
import { Card, Dropdown, Modal, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Avatar from '../../Avatar';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES  } from '../../../redux/actions/messageAction'

import { deletePost } from '../../../redux/actions/postAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
 
import { createReport } from '../../../redux/actions/reportUserAction'; // ✅ Importar acción

const CardHeader = ({ post }) => {
  const { auth, socket   } = useSelector((state) => state);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const handleAprove = () => {
    if (window.confirm("¿Vous voulez aprouve ce post?")) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
    }
  };

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure want to delete this post?")) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/");
    }
  };

  // ✅ Enviar reporte
  const handleSubmitReport = () => {
    if (!reportReason.trim()) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Debe proporcionar una razón para el reporte." }
      });
    }

    const reportData = {
      postId: post._id,
      userId: post.user._id,
      reason: reportReason,
    };

    dispatch(createReport({ auth, reportData }));
    setShowReportModal(false);
    setReportReason('');
  };
  const handleAddUser = (user) => {
    
    dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: []}})
  
    return history.push(`/message/${user._id}`)
}
  
  return (
    <Card.Header className="d-flex justify-content-between align-items-center p-3">
      {auth.user?.role === "superuser" && (
        <div className="d-flex align-items-center">
          <Avatar src={post.user.avatar} size="big-avatar" />
          <div className="ml-3">
            <Card.Title className="m-0">
              <Link to={`/profile/${post.user._id}`} className="text-dark">
                {post.user.username}
              </Link>
            </Card.Title>
            <Card.Text className="text-muted small">
              {moment(post.createdAt).fromNow()}
            </Card.Text>
          </div>
        </div>
      )}

      {auth.user && (
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-actions" className="p-0 border-0">
            <span className="material-icons">more_horiz</span>
          </Dropdown.Toggle>

          <Dropdown.Menu align="right">
            {auth.user.role === "admin" && (
              <>
                <Dropdown.Item onClick={handleAprove}>
                  <span className="material-icons mr-2">check_circle</span>
                  Approuver le post
                </Dropdown.Item>
                <Dropdown.Item onClick={handleEditPost}>
                  <span className="material-icons mr-2">create</span>
                  Modifier le post
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  <span className="material-icons mr-2">delete_outline</span>
                  Supprimer le post
                </Dropdown.Item>
              </>
            )}

            {auth.user._id === post.user._id && (
              <>
                <Dropdown.Item onClick={handleEditPost}>
                  <span className="material-icons mr-2">create</span>
                  Modifier le post
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  <span className="material-icons mr-2">delete_outline</span>
                  Supprimer le post
                </Dropdown.Item>
              </>
            )}

<Dropdown.Item onClick={() => handleAddUser(post.user)}>
  <span className="material-icons mr-2">chat</span>
  Contactar vendedor
</Dropdown.Item>
            <Dropdown.Item>
              <span className="material-icons mr-2">person_add</span>
              Suivre l'auteur
            </Dropdown.Item>

            {/* ✅ Botón para abrir el modal */}
            <Dropdown.Item onClick={() => setShowReportModal(true)}>
              <span className="material-icons mr-2">report</span>
              Signaler le post
            </Dropdown.Item>

            <Dropdown.Item>
              <span className="material-icons mr-2">bookmark</span>
              Sauvegarder le post
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* ✅ Modal de Reporte */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Signaler le post</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form.Group controlId="reportReason">
      <Form.Label>Choisissez le motif du signalement</Form.Label>
      <Form.Control
        as="select"
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
      >
        <option value="">Sélectionner le motif</option>
        <option value="Comportement abusif">Comportement abusif</option>
        <option value="Spam">Spam</option>
        <option value="Violation des conditions d'utilisation">Violation des conditions d'utilisation</option>
        <option value="Langage offensant">Langage offensant</option>
        <option value="Fraude">Fraude</option>
        <option value="Usurpation d'identité">Usurpation d'identité</option>
        <option value="Contenu inapproprié">Contenu inapproprié</option>
        <option value="Violation de la vie privée">Violation de la vie privée</option>
        <option value="Interruption du service">Interruption du service</option>
        <option value="Activité suspecte">Activité suspecte</option>
        <option value="Autre">Autre</option>
      </Form.Control>
    </Form.Group>
  </Modal.Body>

  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
      Annuler
    </button>
    <button
      className="btn btn-danger"
      disabled={!reportReason}
      onClick={handleSubmitReport}
    >
      Signaler
    </button>
  </Modal.Footer>
</Modal>

    </Card.Header>
  );
};

export default CardHeader;

