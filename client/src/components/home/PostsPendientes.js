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
    <div 
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '2rem 0'
      }}
      className={isRTL ? 'rtl' : ''}
    >
      <Container>
        {/* Header */}
        <div className="mb-4">
          <h2 
            className="fw-bold d-flex align-items-center"
            style={{
              color: '#2d3748',
              fontSize: '2rem',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          >
            <FaClipboardList 
              className={isRTL ? 'ms-3' : 'me-3'} 
              style={{ color: '#667eea' }} 
            />
            {t('title') || 'Posts Pendientes'}
          </h2>
          <p className="text-muted" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {t('subtitle') || 'Gestiona y revisa los posts pendientes de aprobación'}
          </p>
        </div>

        {/* Alert Messages */}
        {showMessage.show && (
          <Alert 
            variant={showMessage.type}
            dismissible 
            onClose={() => setShowMessage({ show: false, text: '', type: '' })}
            className="mb-4"
            style={{ borderRadius: '12px' }}
          >
            {showMessage.text}
          </Alert>
        )}

        {/* Tarjetas de estadísticas */}
        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Card 
              className="border-0 shadow-sm text-center"
              style={{ 
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Card.Body className="p-4">
                <FaExclamationTriangle style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />
                <h3 className="fw-bold mb-2">{postsPendientes.length}</h3>
                <p className="mb-0">{t('totalPending') || 'Posts Pendientes'}</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={4}>
            <Card 
              className="border-0 shadow-sm text-center"
              style={{ 
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                color: 'white'
              }}
            >
              <Card.Body className="p-4">
                <FaCheckCircle style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />
                <h3 className="fw-bold mb-2">{selectedPosts.length}</h3>
                <p className="mb-0">{t('selected') || 'Seleccionados'}</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={4}>
            <Card 
              className="border-0 shadow-sm text-center"
              style={{ 
                borderRadius: '20px',
                background: selectedPosts.length > 0 
                  ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                  : 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
                color: 'white'
              }}
            >
              <Card.Body className="p-4">
                <FaCheckDouble style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />
                <h3 className="fw-bold mb-2">{selectedPosts.length}</h3>
                <p className="mb-0">{t('readyForAction') || 'Listos para acción'}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Barra de acciones masivas */}
        {selectedPosts.length > 0 && (
          <Card 
            className="border-0 shadow-sm mb-4"
            style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
              border: '2px dashed #cbd5e0'
            }}
          >
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                  <h6 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
                    <FaCheckCircle className="me-2 text-success" />
                    {selectedPosts.length} {t('postsSelected') || 'posts seleccionados'}
                  </h6>
                </Col>
                <Col xs={12} md={6}>
                  <ButtonGroup className="w-100">
                    <Button
                      variant="success"
                      onClick={handleApproveSelected}
                      className="flex-grow-1"
                      style={{
                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600'
                      }}
                    >
                      <FaCheckDouble className="me-2" />
                      {t('approveSelected') || 'Aprobar Seleccionados'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDeleteSelected}
                      className="flex-grow-1"
                      style={{
                        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600'
                      }}
                    >
                      <FaTrashAlt className="me-2" />
                      {t('deleteSelected') || 'Eliminar Seleccionados'}
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Tabla de posts pendientes */}
        <Card 
          className="border-0 shadow-sm"
          style={{ borderRadius: '20px' }}
        >
          <Card.Header 
            className="bg-white border-0 py-4"
            style={{ borderRadius: '20px 20px 0 0' }}
          >
            <Row className="align-items-center">
              <Col xs={12} md={6}>
                <h5 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                  {t('pendingList') || 'Lista de Posts Pendientes'}
                </h5>
              </Col>
              <Col xs={12} md={6} className="text-md-end">
                <Form.Check
                  type="checkbox"
                  label={t('selectAll') || 'Seleccionar Todos'}
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="fw-semibold"
                  style={{ color: '#667eea' }}
                />
              </Col>
            </Row>
          </Card.Header>
          
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <tr>
                  <th className="text-center py-3" style={{ border: 'none', width: '50px' }}>
                    <Form.Check
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-center py-3" style={{ border: 'none', width: '60px' }}>#</th>
                  <th className="py-3" style={{ border: 'none' }}>{t('table.image')}</th>
                  <th className="py-3 d-none d-md-table-cell" style={{ border: 'none' }}>{t('table.content')}</th>
                  <th className="py-3" style={{ border: 'none' }}>{t('table.user')}</th>
                  <th className="py-3" style={{ border: 'none' }}>{t('table.category')}</th>
                  <th className="py-3" style={{ border: 'none' }}>{t('table.title')}</th>
                  <th className="py-3" style={{ border: 'none' }}>{t('table.status')}</th>
                  <th className="py-3 d-none d-md-table-cell" style={{ border: 'none' }}>{t('table.date')}</th>
                  <th className="text-center py-3" style={{ border: 'none' }}>{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {postsPendientes.length > 0 ? (
                  postsPendientes.map((post, index) => (
                    <tr 
                      key={post._id} 
                      className="align-middle"
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease',
                        background: selectedPosts.includes(post._id) ? '#ebf8ff' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = selectedPosts.includes(post._id) 
                          ? '#d6eaf8' 
                          : '#f7fafc'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedPosts.includes(post._id) 
                          ? '#ebf8ff' 
                          : 'transparent'
                      }}
                    >
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={selectedPosts.includes(post._id)}
                          onChange={() => handleSelectPost(post._id)}
                        />
                      </td>
                      
                      <td className="text-center fw-bold" style={{ color: '#667eea' }}>
                        {index + 1}
                      </td>
                      
                      <td>
                        {post.images?.length > 0 ? (
                          <Link to={`/post/${post._id}`}>
                            <div
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer'
                              }}
                            >
                              <img
                                src={post.images[0]?.url || ""}
                                alt="Post"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          </Link>
                        ) : (
                          <Badge 
                            bg="secondary"
                            style={{ 
                              borderRadius: '10px',
                              padding: '0.5rem 0.75rem'
                            }}
                          >
                            {t('noImage')}
                          </Badge>
                        )}
                      </td>

                      <td className="d-none d-md-table-cell">
                        <div 
                          style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#718096'
                          }}
                        >
                          {post.content}
                        </div>
                      </td>
                      
                      <td>
                        <Badge 
                          style={{
                            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          {post.user.username}
                        </Badge>
                      </td>
                      
                      <td>
                        <span style={{ color: '#4a5568', fontWeight: '500' }}>
                          {post.subCategory}
                        </span>
                      </td>
                      
                      <td>
                        <div 
                          style={{
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#2d3748',
                            fontWeight: '500'
                          }}
                        >
                          {post.title}
                        </div>
                      </td>

                      <td>
                        <Badge 
                          style={{
                            background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}
                        >
                          {t(`status.${post.estado}`)}
                        </Badge>
                      </td>

                      <td className="d-none d-md-table-cell" style={{ color: '#718096' }}>
                        {new Date(post.createdAt).toLocaleString()}
                      </td>

                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-primary"
                            size="sm"
                            style={{
                              border: '2px solid #667eea',
                              borderRadius: '10px',
                              color: '#667eea',
                              fontWeight: '600',
                              background: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#667eea'
                              e.target.style.color = 'white'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'transparent'
                              e.target.style.color = '#667eea'
                            }}
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>

                          <Dropdown.Menu style={{ zIndex: 10000, borderRadius: '12px' }}>
                            <Dropdown.Item 
                              onClick={() => handleAprovePost(post)}
                              style={{ 
                                borderRadius: '8px',
                                margin: '2px',
                                fontWeight: '500'
                              }}
                            >
                              <FaCheck className="me-2 text-success" /> 
                              {t('actionss.approve')}
                            </Dropdown.Item>
                            
                            <Dropdown.Item 
                              style={{ 
                                borderRadius: '8px',
                                margin: '2px',
                                fontWeight: '500'
                              }}
                            >
                              <FaEnvelope className="me-2 text-primary" /> 
                              {t('actionss.sendMessage')}
                            </Dropdown.Item>

                            <Dropdown.Item 
                              onClick={() => handleDeletePost(post)}
                              style={{ 
                                borderRadius: '8px',
                                margin: '2px',
                                fontWeight: '500',
                                color: '#e53e3e'
                              }}
                            >
                              <FaTrash className="me-2" /> 
                              {t('actionss.delete')}
                            </Dropdown.Item>
                            
                            <Dropdown.Item 
                              onClick={() => handleBlockUser(post.user)}
                              style={{ 
                                borderRadius: '8px',
                                margin: '2px',
                                fontWeight: '500',
                                color: '#dd6b20'
                              }}
                            >
                              <FaBan className="me-2" /> 
                              {t('actionss.blockUser')}
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
                      className="text-center py-5"
                      style={{ color: '#718096' }}
                    >
                      <FaClipboardList style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
                      <h5 className="fw-bold">{t('noPending')}</h5>
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
              style={{ width: '3rem', height: '3rem' }}
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