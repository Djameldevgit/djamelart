import React, { useState, useEffect } from "react";
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
  const { t } = useTranslation('modales');
  const lang = languageReducer.language || 'es';
  
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

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`users?limit=${usersActionReducer.page * 9}`, auth.token);
    dispatch({
      type: USERS_TYPES_ACTION.GET_USERS_ACTION,
      payload: { ...res.data, page: usersActionReducer.page + 1 },
    });
    setLoad(false);
  };

  useEffect(() => {
    setFilteredUsers(usersActionReducer.users || []);
  }, [usersActionReducer.users]);

  const filteredResults = filteredUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = (user) => {
    if (window.confirm(t('deleteConfirmation'))) {
      dispatch(deleteUser({ user, auth }));
    }
  };

  const handleFilter = (criteria) => {
    let sortedUsers = [...usersActionReducer.users];

    switch (criteria) {
      case "mostFollowing":
        sortedUsers.sort((a, b) => b.following.length - a.following.length);
        break;
      case "mostFollowers":
        sortedUsers.sort((a, b) => b.followers.length - a.followers.length);
        break;
      case "mostLikesReceived":
        sortedUsers.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
        break;
      case "mostLikesGiven":
        sortedUsers.sort((a, b) => b.likesGiven - a.likesGiven);
        break;
      case "mostCommentsMade":
        sortedUsers.sort((a, b) => b.commentsMade - a.commentsMade);
        break;
      case "lastLogin":
        sortedUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
        break;
      default:
        sortedUsers = usersActionReducer.users;
    }

    setFilteredUsers(sortedUsers);
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="dropdown mb-3">
        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          {t('filterUsers')}
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={() => handleFilter("mostFollowing")}>{t('filters.mostFollowing')}</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostFollowers")}>{t('filters.mostFollowers')}</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostLikesReceived")}>{t('filters.mostLikesReceived')}</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostLikesGiven")}>{t('filters.mostLikesGiven')}</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("mostCommentsMade")}>{t('filters.mostCommentsMade')}</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("lastLogin")}>{t('filters.lastLogin')}</button></li>
          <li><button className="dropdown-item" onClick={() => handleFilter("reset")}>{t('filters.reset')}</button></li>
        </ul>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('tableHead.user')}</th>
            <th>{t('tableHead.registration')}</th>
            <th>{t('tableHead.login')}</th>
            <th>{t('tableHead.posts')}</th>
            <th>{t('tableHead.reports')}</th>
            <th>{t('tableHead.likesGiven')}</th>
            <th>{t('tableHead.likesReceived')}</th>
            <th>{t('tableHead.commentsMade')}</th>
            <th>{t('tableHead.commentsReceived')}</th>
            <th>{t('tableHead.following')}</th>
            <th>{t('tableHead.followers')}</th>
            <th>{t('tableHead.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <th><UserCard user={user} /></th>
              <td>
              {new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'en-US' : lang, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                numberingSystem: 'latn'
              })}
            </td>
          <td>
  {user.lastLogin ? 
    new Date(user.lastLogin).toLocaleDateString(lang === 'ar' ? 'en-US' : lang, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      numberingSystem: 'latn'
    }) 
    : 
    t('neverLoggedIn') /* "Nunca" o "لم يسجل دخول أبدًا" */
  }
</td>
              <td>{user.postCount || 0}</td>
              <td>{user.likesGiven || 0}</td>
              <td>{user.totalLikesReceived || 0}</td>
              <td>{user.commentsMade || 0}</td>
              <td>{user.totalCommentsReceived || 0}</td>
              <td>{user.totalFollowing || 0}</td>
              <td>{user.totalFollowers || 0}</td>
              <td>
                <div className="action-dropdown" style={{ position: "relative" }}>
                  <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    {t('actio.title')}
                  </button>
                  <div className="dropdown-menu" data-bs-autoClose="false">
                    <button className="dropdown-item">{t('actio.edit')}</button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteUser(user);
                      }}
                    >
                      {t('actio.delete')}
                    </button>
                    <button className="dropdown-item text-warning">{t('actio.block')}</button>
                    <button className="dropdown-item text-warning">{t('actio.mute')}</button>
                    <button className="dropdown-item">{t('actio.sendMessage')}</button>
                    <button className="dropdown-item">{t('actio.viewProfile')}</button>
                    <button className="dropdown-item">{t('actio.viewReports')}</button>
                    <button className="dropdown-item text-info">{t('actio.loginAsUser')}</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {load && <img src={LoadIcon} alt="loading" className="loading-icon" />}
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