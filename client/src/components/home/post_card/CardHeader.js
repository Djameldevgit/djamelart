import React, { useState } from 'react';
import { Card, Dropdown, Modal, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Avatar from '../../Avatar';

import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { deletePost } from '../../../redux/actions/postAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { createReport } from '../../../redux/actions/reportUserAction';

const CardHeader = ({ post }) => {
  const { auth, socket,languageReducer } = useSelector((state) => state);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n } = useTranslation('aplicacion');

  // Cambiar el idioma activamente si es diferente
  const lang = languageReducer.language || 'es';
  if (i18n.language !== lang) i18n.changeLanguage(lang);
  const handleAprove = () => {
    if (window.confirm(t('confirmApprove'))) {
      dispatch(aprovarPostPendiente(post, 'aprovado', auth));
      history.push("/administration/homepostspendientes");
    }
  };

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    if (window.confirm(t('confirmDelete'))) {
      dispatch(deletePost({ post, auth, socket }));
      history.push("/");
    }
  };

  const handleSubmitReport = () => {
    if (!reportReason.trim()) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('reportRequired') }
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
    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    return history.push(`/message/${user._id}`);
  };

  return (
    <Card.Header className="d-flex justify-content-between align-items-center p-3" >
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

      {auth.user && (
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-actions" className="p-0 border-0">
            <span className="material-icons">more_horiz</span>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end"style={{
      direction: lang === 'ar' ? 'rtl' : 'ltr',
        textAlign: lang === 'ar' ? 'right' : 'left',
      }}>
            {auth.user.role === 'admin' && (
              <>
                <Dropdown.Item onClick={handleAprove}>
                  ✅ {t('approve')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleEditPost}>
                  ✏️ {t('edit')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  🗑️ {t('delete')}
                </Dropdown.Item>
              </>
            )}

            {auth.user._id === post.user._id && (
              <>
                <Dropdown.Item onClick={handleEditPost}>
                  ✏️ {t('edit')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  🗑️ {t('delete')}
                </Dropdown.Item>
              </>
            )}

            <Dropdown.Item onClick={() => handleAddUser(post.user)}style={{
      direction: lang === 'ar' ? 'rtl' : 'ltr',
        textAlign: lang === 'ar' ? 'right' : 'left',
      }}>
              💬 {t('contactSeller')}
            </Dropdown.Item>
            <Dropdown.Item>
              👤 {t('followAuthor')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowReportModal(true)}>
              🚩 {t('report')}
            </Dropdown.Item>
            <Dropdown.Item>
              🔖 {t('save')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* Modal de reporte */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('reportTitle')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="reportReason">
            <Form.Label>{t('reportLabel')}</Form.Label>
            <Form.Control
              as="select"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}style={{
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                  textAlign: lang === 'ar' ? 'right' : 'left',
                }}
            >
              <option value="">{t('selectReason')}</option>
              <option value="abuse">{t('reasons.abuse')}</option>
              <option value="spam">{t('reasons.spam')}</option>
              <option value="terms">{t('reasons.terms')}</option>
              <option value="offensive">{t('reasons.offensive')}</option>
              <option value="fraud">{t('reasons.fraud')}</option>
              <option value="impersonation">{t('reasons.impersonation')}</option>
              <option value="inappropriate">{t('reasons.inappropriate')}</option>
              <option value="privacy">{t('reasons.privacy')}</option>
              <option value="disruption">{t('reasons.disruption')}</option>
              <option value="suspicious">{t('reasons.suspicious')}</option>
              <option value="other">{t('reasons.other')}</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
            {t('common:cancel')}
          </button>
          <button
            className="btn btn-danger"
            disabled={!reportReason}
            onClick={handleSubmitReport}
          >
            {t('submitReport')}
          </button>
        </Modal.Footer>
      </Modal>
    </Card.Header>
  );
};

export default CardHeader;

