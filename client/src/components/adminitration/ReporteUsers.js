import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getReports } from "../../redux/actions/reportUserAction";
import {
  Container,
  Table,
  Dropdown,
  Spinner,
  Alert
} from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  LockFill,
  UnlockFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

const ReportedUsers = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('modales');
  const { reports, loading } = useSelector((state) => state.reportReducer);
  const { auth, languageReducer } = useSelector((state) => state);
  const lang = languageReducer.language || 'es';
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await dispatch(getReports(auth.token));
      } catch (err) {
        setError(t('errors.fetchError'));
      }
    };
    fetchReports();
  }, [dispatch, auth.token, t]);

  if (!Array.isArray(reports)) {
    return <Alert variant="danger">{t('errors.invalidData')}</Alert>;
  }
         
  return (
    <Container fluid className="py-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="mb-4">{t('header.title')}</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : reports.length === 0 ? (
        <p>{t('noReports')}</p>
      ) : (
        <div className="table-responsive" style={{overflow: 'visible'}}>
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>{t('tableHeadersss.reporter')}</th>
                <th>{t('tableHeadersss.reportedUser')}</th>
                <th>{t('tableHeadersss.postTitle')}</th>
                <th>{t('tableHeadersss.reason')}</th>
                <th>{t('tableHeadersss.date')}</th>
                <th>{t('tableHeadersss.actionss')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td><UserInfo user={report.reportedBy} /></td>
                  <td><UserInfo user={report.userId} /></td>
                  <td>{report.postId?.title || t('notAvailable')}</td>
                  <td>{report.reason || t('notSpecified')}</td>
                  <td>{new Date(report.createdAt).toLocaleString(lang)}</td>
                  <td>
                    <Dropdown drop={lang === 'ar' ? 'end' : 'start'}>
                      <Dropdown.Toggle 
                        variant="outline-secondary" 
                        size="sm" 
                        id={`dropdown-${report._id}`}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '0.25rem'
                        }}
                      >
                        <ThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{position: 'absolute'}}>
                        <Dropdown.Item disabled>
                          <PencilFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> 
                          {t('actions.edit')}
                        </Dropdown.Item>
                        <Dropdown.Item className="text-warning">
                          <UnlockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> 
                          {t('actions.deactivate')}
                        </Dropdown.Item>
                        <Dropdown.Item className="text-warning">
                          <LockFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> 
                          {t('actions.block')}
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger">
                          <TrashFill className={`me-2 ${lang === 'ar' ? 'ms-2' : ''}`} /> 
                          {t('actions.delete')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

const UserInfo = ({ user }) => {
  const { t } = useTranslation('reports');
  return user ? (
    <div className="d-flex align-items-center">
      <img
        src={user.avatar}
        alt={user.username}
        className="rounded-circle me-2"
        width="30"
        height="30"
      />
      <span>{user.username}</span>
    </div>
  ) : (
    <span>{t('unknownUser')}</span>
  );
};

export default ReportedUsers;