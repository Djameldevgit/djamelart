import React, { useState, useEffect } from "react";
import {Dropdown,DropdownButton} from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getDataAPI } from "../../utils/fetchData";
import { USERS_TYPES_ACTION } from "../../redux/actions/usersActionAction";
import LoadMoreBtn from "../LoadMoreBtn";
import LoadIcon from "../../images/loading.gif";
import UserCard from "../UserCard";

const UsersAction = () => {
  const { usersActionReducer, auth, languageReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation("aplicacion");
  const lang = languageReducer.language || "es";

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(usersActionReducer.users || []);

  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const res = await getDataAPI(`users?limit=9`, auth.token);
        dispatch({
          type: USERS_TYPES_ACTION.GET_USERS_ACTION,
          payload: { ...res.data, page: 2 },
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (auth.token && usersActionReducer.users.length === 0) {
      fetchInitialUsers();
    }
  }, [auth.token, dispatch]);

  useEffect(() => {
    setFilteredUsers(usersActionReducer.users || []);
  }, [usersActionReducer.users]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`users?limit=${usersActionReducer.page * 9}`, auth.token);
    dispatch({
      type: USERS_TYPES_ACTION.GET_USERS_ACTION,
      payload: { ...res.data, page: usersActionReducer.page + 1 },
    });
    setLoad(false);
  };

  const filteredResults = filteredUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = (user) => {
    if (window.confirm(t("deleteConfirmation"))) {
      dispatch(deleteUser({ user, auth }));
    }
  };

  const handleFilter = async (criteria) => {
    try {
      setLoad(true);
      const res = await getDataAPI(`users?limit=9&filter=${criteria}`, auth.token);
      dispatch({
        type: USERS_TYPES_ACTION.GET_USERS_ACTION,
        payload: { ...res.data, page: 2 },
      });
      setLoad(false);
    } catch (err) {
      console.error(err);
      setLoad(false);
    }
  };

  return (
    <div  >
      <div className="dropdown mb-3">
      <DropdownButton
  id="dropdown-filter-button"
  title={t("filterUsers")}
  variant="primary"
  className="mb-3"
>
  <Dropdown.Item onClick={() => handleFilter("latestRegistered")}>
    {t("filter.latestRegistered")}
  </Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilter("lastLogin")}>
    {t("filter.lastLogin")}
  </Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilter("mostLikes")}>
    {t("filter.mostLikes")}
  </Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilter("mostComments")}>
    {t("filter.mostComments")}
  </Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilter("mostFollowers")}>
    {t("filter.mostFollowers")}
  </Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilter("mostPosts")}>
    {t("filter.mostPosts")}
  </Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilter("mostReports")}>
    {t("filter.mostReports")}
  </Dropdown.Item>
</DropdownButton>
 </div>
      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>{t("tableHeadd.user")}</th>
            <th>{t("tableHeadd.registration")}</th>
            <th>{t("tableHeadd.login")}</th>
            <th>{t("tableHeadd.posts")}</th>
            <th>{t("tableHeadd.reports")}</th>
            <th>{t("tableHeadd.reportsReceived")}</th> {/* ✅ NUEVA COLUMNA */}

            <th>{t("tableHeadd.likesGiven")}</th>
            <th>{t("tableHeadd.likesReceived")}</th>
            <th>{t("tableHeadd.commentsMade")}</th>
            <th>{t("tableHeadd.commentsReceived")}</th>
            <th>{t("tableHeadd.following")}</th>
            <th>{t("tableHeadd.followers")}</th>
            <th>{t("tableHeadd.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td><UserCard user={user} /></td>
              <td>{new Date(user.createdAt).toLocaleDateString(lang === "ar" ? "en-US" : lang)}</td>
              <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString(lang === "ar" ? "en-US" : lang) : t("neverLoggedIn")}</td>
              <td>{user.postCount || 0}</td>
              <td className={(user.totalReportsGiven || 0) >= 2 ? "text-danger fw-bold" : "text-warning fw-bold"}>
                {user.totalReportsGiven || 0}
              </td>

              <td className={(user.totalReportsReceived || 0) >= 2 ? "text-danger fw-bold" : "text-warning fw-bold"}>
                {user.totalReportsReceived || 0}
              </td>

              <td>{user.likesGiven || 0}</td>
              <td>{user.totalLikesReceived || 0}</td>
              <td>{user.commentsMade || 0}</td>
              <td>{user.totalCommentsReceived || 0}</td>
              <td>{user.totalFollowing || 0}</td>
              <td>{user.totalFollowers || 0}</td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    {t("actio.title")}
                  </button>
                  <div className="dropdown-menu">
                    <button className="dropdown-item">{t("actio.edit")}</button>
                    <button className="dropdown-item text-danger" onClick={() => handleDeleteUser(user)}>{t("actio.delete")}</button>
                    <button className="dropdown-item text-warning">{t("actio.block")}</button>
                    <button className="dropdown-item text-warning">{t("actio.mute")}</button>
                    <button className="dropdown-item">{t("actio.sendMessage")}</button>
                    <button className="dropdown-item">{t("actio.viewProfile")}</button>
                    <button className="dropdown-item">{t("actio.viewReports")}</button>
                    <button className="dropdown-item text-info">{t("actio.loginAsUser")}</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
      <LoadMoreBtn
        result={usersActionReducer.result}
        page={usersActionReducer.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default UsersAction;