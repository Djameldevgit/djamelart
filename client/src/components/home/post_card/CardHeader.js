import React, { useState } from 'react';
import { Card, Dropdown, Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Avatar from '../../Avatar';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from '../../../redux/actions/postAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { setActiveChat } from '../../../redux/actions/chatAction';

const CardHeader = ({ post }) => {
    const { auth, socket } = useSelector(state => state);
    const [showReportModal, setShowReportModal] = useState(false);
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

    return (
        <Card.Header className="d-flex justify-content-between align-items-center p-3">
            {/* Sección del usuario (avatar + nombre) */}
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

            {/* Dropdown de acciones */}
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

<Dropdown.Item onClick={() => dispatch(setActiveChat(post.user))}>
  <span className="material-icons mr-2">chat</span>
  Contactar vendedor
</Dropdown.Item>
                        <Dropdown.Item>
                            <span className="material-icons mr-2">person_add</span>
                            Suivre l'auteur
                        </Dropdown.Item>
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

            {/* Modal para reportar (puedes personalizarlo) */}
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Signaler le post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Contenido del modal aquí */}
                    <p>¿Por qué deseas reportar este post?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                        Annuler
                    </button>
                    <button className="btn btn-danger">Signaler</button>
                </Modal.Footer>
            </Modal>
        </Card.Header>
    );
};

export default CardHeader;

