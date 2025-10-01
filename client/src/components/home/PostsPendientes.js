import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { aprovarPostPendiente, POST_TYPES_APROVE } from '../../redux/actions/postAproveAction';
import { deletePost } from '../../redux/actions/postAction';
import { useHistory, Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Dropdown,
  Spinner,
  Table,
  Form,
  Alert,
  ButtonGroup
} from 'react-bootstrap';
import { 
  FaCheck, 
  FaTrash, 
  FaBan, 
  FaEnvelope, 
  FaEllipsisV,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckDouble,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PostsPendientes = () => {
  const { homePostsAprove, auth, socket, languageReducer } = useSelector((state) => state);
  const { t } = useTranslation('postspendientes');
  const lang = languageReducer.language || 'es';
  const isRTL = lang === 'ar';

  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [postsPendientes, setPostsPendientes] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showMessage, setShowMessage] = useState({ show: false, text: '', type: '' });

  useEffect(() => {
    if (homePostsAprove && homePostsAprove.posts) {
      const postspedientes = homePostsAprove.posts.filter((p) => p.estado === 'pendiente');
      setPostsPendientes(postspedientes);
    }
  }, [homePostsAprove]);

  // Manejar selección individual
  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Manejar selección masiva
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      const allPostIds = postsPendientes.map(post => post._id);
      setSelectedPosts(allPostIds);
    }
    setSelectAll(!selectAll);
  };

  // Aprobar posts seleccionados
  const handleApproveSelected = () => {
    if (selectedPosts.length === 0) {
      setShowMessage({
        show: true,
        text: t('noPostsSelected') || 'Selecciona al menos un post para aprobar',
        type: 'warning'
      });
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
      return;
    }

    if (window.confirm(t('confirm.approveMultiple', { count: selectedPosts.length }) || `¿Aprobar ${selectedPosts.length} posts seleccionados?`)) {
      selectedPosts.forEach(postId => {
        const post = postsPendientes.find(p => p._id === postId);
        if (post) {
          dispatch(aprovarPostPendiente({ post, auth, socket }));
        }
      });
      
      setShowMessage({
        show: true,
        text: t('postsApprovedSuccessfully', { count: selectedPosts.length }) || `${selectedPosts.length} posts aprobados exitosamente`,
        type: 'success'
      });
      
      setSelectedPosts([]);
      setSelectAll(false);
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
    }
  };

  // Eliminar posts seleccionados
  const handleDeleteSelected = () => {
    if (selectedPosts.length === 0) {
      setShowMessage({
        show: true,
        text: t('noPostsSelected') || 'Selecciona al menos un post para eliminar',
        type: 'warning'
      });
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
      return;
    }

    if (window.confirm(t('confirm.deleteMultiple', { count: selectedPosts.length }) || `¿Eliminar ${selectedPosts.length} posts seleccionados?`)) {
      selectedPosts.forEach(postId => {
        const post = postsPendientes.find(p => p._id === postId);
        if (post) {
          dispatch(deletePost({ post, auth, socket }));
        }
      });
      
      setShowMessage({
        show: true,
        text: t('postsDeletedSuccessfully', { count: selectedPosts.length }) || `${selectedPosts.length} posts eliminados exitosamente`,
        type: 'success'
      });
      
      setSelectedPosts([]);
      setSelectAll(false);
      setTimeout(() => setShowMessage({ show: false, text: '', type: '' }), 3000);
    }
  };

  const handleLoadMore = async () => {
    setLoad(true);
    const page = homePostsAprove.page || 1;
    const res = await getDataAPI(`posts/pendientes?limit=${page * 9}`, auth.token);
    dispatch({
      type: POST_TYPES_APROVE.GET_POSTS_PENDIENTES,
      payload: { ...res.data, page: page + 1 },
    });
    setLoad(false);
  };

  const handleAprovePost = (post) => {
    if (window.confirm(t('confirm.approve'))) {
      dispatch(aprovarPostPendiente({ post, auth, socket }));
      history.push("/postspendientes");
    }
  };

  const handleDeletePost = (post) => {
    if (window.confirm(t('confirm.delete'))) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/postspendientes");
    }
  };

  const handleBlockUser = (user) => {
    if (window.confirm(t('confirm.block', { user: user.username }))) {
      // dispatch(blockUserAction({ user, auth }));
    }
  };

  return (
    <div className={`min-vh-100 bg-light py-4 ${isRTL ? 'rtl' : ''}`}>
      <Container>
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold d-flex align-items-center text-dark">
            <FaClipboardList className={isRTL ? 'ms-3' : 'me-3'} style={{ color: '#667eea' }} />
            {t('title') || 'Posts Pendientes'}
          </h2>
          <p className="text-muted">
            {t('subtitle') || 'Gestiona y revisa los posts pendientes de aprobación'}
          </p>
        </div>

        {/* Alert Messages */}
        {showMessage.show && (
          <Alert 
            variant={showMessage.type}
            dismissible 
            onClose={() => setShowMessage({ show: false, text: '', type: '' })}
            className="mb-4 rounded-3"
          >
            {showMessage.text}
          </Alert>
        )}

        {/* Tarjetas de estadísticas - COMPACTAS */}
        <Row className="mb-4 g-3">
          <Col xs={12} md={4}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="p-3 bg-primary text-white rounded-3">
                <FaExclamationTriangle className="fs-3 mb-2" />
                <h5 className="fw-bold mb-1">{postsPendientes.length}</h5>
                <small>{t('totalPending') || 'Posts Pendientes'}</small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={4}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="p-3 bg-success text-white rounded-3">
                <FaCheckCircle className="fs-3 mb-2" />
                <h5 className="fw-bold mb-1">{selectedPosts.length}</h5>
                <small>{t('selected') || 'Seleccionados'}</small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={4}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className={`p-3 rounded-3 text-white ${
                selectedPosts.length > 0 ? 'bg-warning' : 'bg-secondary'
              }`}>
                <FaCheckDouble className="fs-3 mb-2" />
                <h5 className="fw-bold mb-1">{selectedPosts.length}</h5>
                <small>{t('readyForAction') || 'Listos para acción'}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Barra de acciones masivas */}
        {selectedPosts.length > 0 && (
          <Card className="border-0 shadow-sm mb-4 bg-light border-dashed">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col xs={12} md={6} className="mb-3 mb-md-0">
                  <h6 className="fw-bold mb-0 text-dark text-center text-md-start">
                    <FaCheckCircle className="me-2 text-success" />
                    {selectedPosts.length} {t('postsSelected') || 'posts seleccionados'}
                  </h6>
                </Col>
                <Col xs={12} md={6}>
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Button
                      variant="success"
                      onClick={handleApproveSelected}
                      className="flex-grow-1"
                    >
                      <FaCheckDouble className="me-2" />
                      {t('approveSelected') || 'Aprobar'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDeleteSelected}
                      className="flex-grow-1"
                    >
                      <FaTrashAlt className="me-2" />
                      {t('deleteSelected') || 'Eliminar'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Tabla de posts pendientes */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0 py-3">
            <Row className="align-items-center">
              <Col xs={12} md={6}>
                <h5 className="mb-0 fw-bold text-dark">
                  {t('pendingList') || 'Lista de Posts Pendientes'}
                </h5>
              </Col>
              <Col xs={12} md={6} className="text-md-end">
                <Form.Check
                  type="checkbox"
                  label={t('selectAll') || 'Seleccionar Todos'}
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="fw-semibold text-primary"
                />
              </Col>
            </Row>
          </Card.Header>
          
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="text-white">
                <tr>
                  <th className="text-center py-3" style={{ width: '50px' }}>
                    <Form.Check
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="mx-3"
                    />
                  </th>
                  <th className="text-center py-3" style={{ width: '60px' }}>#</th>
                  <th className="py-3">{t('table.image')}</th>
                  <th className="py-3 d-none d-lg-table-cell">{t('table.content')}</th>
                  <th className="py-3">{t('table.user')}</th>
                  <th className="py-3">{t('table.category')}</th>
                  <th className="py-3">{t('table.title')}</th>
                  <th className="py-3">{t('table.status')}</th>
                  <th className="py-3 d-none d-md-table-cell">{t('table.date')}</th>
                  <th className="text-center py-3">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {postsPendientes.length > 0 ? (
                  postsPendientes.map((post, index) => (
                    <tr 
                      key={post._id} 
                      className={`align-middle ${
                        selectedPosts.includes(post._id) ? 'table-primary' : ''
                      }`}
                    >
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Form.Check
                            type="checkbox"
                            checked={selectedPosts.includes(post._id)}
                            onChange={() => handleSelectPost(post._id)}
                            className="my-1"
                          />
                        </div>
                      </td>
                      
                      <td className="text-center fw-bold text-primary">
                        {index + 1}
                      </td>
                      
                      <td>
                        {post.images?.length > 0 ? (
                          <Link to={`/post/${post._id}`}>
                            <div
                              className="rounded overflow-hidden shadow-sm"
                              style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer'
                              }}
                            >
                              <img
                                src={post.images[0]?.url || ""}
                                alt="Post"
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                          </Link>
                        ) : (
                          <Badge bg="secondary" className="rounded-pill px-3 py-2">
                            {t('noImage') || 'Sin imagen'}
                          </Badge>
                        )}
                      </td>

                      <td className="d-none d-lg-table-cell">
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {post.content}
                        </div>
                      </td>
                      
                      <td>
                        <Badge bg="success" className="rounded-pill px-3 py-2">
                          {post.user.username}
                        </Badge>
                      </td>
                      
                      <td>
                        <span className="text-dark fw-medium">
                          {post.subCategory}
                        </span>
                      </td>
                      
                      <td>
                        <div className="text-truncate text-dark fw-medium" style={{ maxWidth: '150px' }}>
                          {post.title}
                        </div>
                      </td>

                      <td>
                        <Badge bg="warning" className="rounded-pill px-3 py-2 fw-semibold">
                          {t(`status.${post.estado}`) || post.estado}
                        </Badge>
                      </td>

                      <td className="d-none d-md-table-cell text-muted">
                        {new Date(post.createdAt).toLocaleString()}
                      </td>

                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill border-2 fw-semibold"
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="rounded-3 shadow-sm border-0">
                            <Dropdown.Item 
                              onClick={() => handleAprovePost(post)}
                              className="rounded-2 fw-medium"
                            >
                              <FaCheck className="me-2 text-success" /> 
                              {t('actionss.approve') || 'Aprobar'}
                            </Dropdown.Item>
                            
                            <Dropdown.Item 
                              className="rounded-2 fw-medium"
                            >
                              <FaEnvelope className="me-2 text-primary" /> 
                              {t('actionss.sendMessage') || 'Enviar Mensaje'}
                            </Dropdown.Item>

                            <Dropdown.Item 
                              onClick={() => handleDeletePost(post)}
                              className="rounded-2 fw-medium text-danger"
                            >
                              <FaTrash className="me-2" /> 
                              {t('actionss.delete') || 'Eliminar'}
                            </Dropdown.Item>
                            
                            <Dropdown.Item 
                              onClick={() => handleBlockUser(post.user)}
                              className="rounded-2 fw-medium text-warning"
                            >
                              <FaBan className="me-2" /> 
                              {t('actionss.blockUser') || 'Bloquear Usuario'}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan="10" 
                      className="text-center py-5 text-muted"
                    >
                      <FaClipboardList className="fs-1 mb-3 opacity-50" />
                      <h5 className="fw-bold">{t('noPending') || 'No hay posts pendientes'}</h5>
                      <p className="mb-0">No hay posts pendientes de aprobación</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Loading y Load More */}
        {load && (
          <div className="text-center py-4">
            <Spinner 
              animation="border" 
              variant="primary" 
              className="fs-4"
            />
            <p className="mt-3 text-muted">{t('loading') || 'Cargando más posts...'}</p>
          </div>
        )}

        <div className="text-center mt-4">
          <LoadMoreBtn
            result={homePostsAprove.result}
            page={homePostsAprove.page}
            load={load}
            handleLoadMore={handleLoadMore}
          />
        </div>
      </Container>
    </div>
  );
};

export default PostsPendientes;