import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getReports } from "../../redux/actions/reportUserAction";
import {
  Container,
  Table,
  Dropdown,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  PencilFill,
  TrashFill,

  UnlockFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

import { deleteUser } from "../../redux/actions/userAction"; // ✅ importa tu función de eliminación

const ReportedUsers = () => {
  const { auth, languageReducer } = useSelector((state) => state);
  const { reports, loading } = useSelector((state) => state.reportReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation("aplicacion");

  const lang = languageReducer.language || "es";
  const isArabic = lang === "ar";
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await dispatch(getReports(auth.token));
      } catch (err) {
        setError(t("errors.fetchError"));
      }
    };
    fetchReports();
  }, [dispatch, auth.token, t]);

  if (!Array.isArray(reports)) {
    return <Alert variant="danger">{t("errors.invalidData")}</Alert>;
  }



  const handleDelete = (userId) => {
    dispatch(deleteUser(userId, auth.token));
  };

  return (
    <Container fluid className="py-4"  >
      <h2 className="mb-4">{t("headerrr.title")}</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : reports.length === 0 ? (
        <p>{t("noReports")}</p>
      ) : (
        <div className="table-responsive" style={{ overflow: "visible" }}>
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr >
                <th>{t("tableHeadersss.reporter")}</th>
                <th>{t("tableHeadersss.reportedUser")}</th>
                <th>{t("tableHeadersss.postTitle")}</th>
                <th>{t("tableHeadersss.reason")}</th>
                <th>{t("tableHeadersss.date")}</th>
                <th>{t("tableHeadersss.actionss")}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td><UserInfo user={report.reportedBy} lang={lang} /></td>
                  <td><UserInfo user={report.userId} lang={lang} /></td>
                  <td>{report.postId?.title || t("notAvailable")}</td>
                  <td>{report.reason || t("notSpecified")}</td>
                  <td lang="en">{new Date(report.createdAt).toLocaleString()}</td>

                  <td>
                    <Dropdown drop={isArabic ? "end" : "start"}>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id={`dropdown-${report._id}`}
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: "0.25rem",
                        }}
                      >
                        <ThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ position: "absolute" }}>
                        <Dropdown.Item disabled>
                          <PencilFill className={`me-2 ${isArabic ? "ms-2" : ""}`} />
                          {t("actions.edit")}
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-warning"
                          onClick={() => handleDeactivate(report.userId._id)}
                        >
                          <UnlockFill className={`me-2 ${isArabic ? "ms-2" : ""}`} />
                          {t("actions.deactivate")}
                        </Dropdown.Item>


                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => handleDelete(report.userId._id)}
                        >
                          <TrashFill className={`me-2 ${isArabic ? "ms-2" : ""}`} />
                          {t("actions.delete")}
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

const UserInfo = ({ user, lang }) => {
  const { t } = useTranslation("reports");
  return user ? (
    <div className="d-flex align-items-center" lang={lang === "ar" ? "ar" : "es"}>
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
    <span>{t("unknownUser")}</span>
  );
};

export default ReportedUsers;
