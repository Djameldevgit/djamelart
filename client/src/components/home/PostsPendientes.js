import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { aprovarPostPendiente, POST_TYPES_APROVE } from '../../redux/actions/postAproveAction';
import { deletePost } from '../../redux/actions/postAction';
import { useHistory, Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PostsPendientes = () => {
  const { homePostsAprove, auth, socket, languageReducer } = useSelector((state) => state);
  const { t } = useTranslation('aplicacion');
  const lang = languageReducer.language || 'es';

  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [postsPendientes, setPostsPendientes] = useState([]);

  useEffect(() => {
    if (homePostsAprove && homePostsAprove.posts) {
      const postspedientes = homePostsAprove.posts.filter((p) => p.estado === 'pendiente');
      setPostsPendientes(postspedientes);
    }
  }, [homePostsAprove]);

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
      dispatch(aprovarPostPendiente({ post, auth,socket }));
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
    <div className="container mt-4"  >
      <h5 className="mb-3 text-center">
        {t('totalPending', { count: postsPendientes.length })}
      </h5>

      <div className="table-responsive">
        <table className="table table-bordered table-hover" >
          <thead className="thead-dark text-center" >
            <tr   >
              <th>#</th>
              <th>{t('table.image')}</th>
              <th className="d-none d-md-table-cell">{t('table.totalPosts')}</th>
              <th>{t('table.user')}</th>
              <th>{t('table.category')}</th>
              <th>{t('table.title')}</th>
              <th>{t('table.status')}</th>
              <th className="d-none d-md-table-cell">{t('table.date')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {postsPendientes.length > 0 ? (
              postsPendientes.map((post, index) => (
                <tr key={post._id} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td>
                    {post.images?.length > 0 ? (
                      <Link to={`/post/${post._id}`}>
                        <img
                          src={post.images[0]?.url || ""}
                          alt="Post"
                          className="img-thumbnail"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            cursor: "pointer"
                          }}
                        />
                      </Link>
                    ) : (
                      <span>{t('noImage')}</span>
                    )}
                  </td>

                  <td className="text-truncate" style={{ maxWidth: "150px" }}>{post.content}</td>
                  <td>{post.user.username}</td>
                  <td>{post.subCategory}</td>
                  <td>{post.title}</td>

                  <td>
                    <span className={`badge ${post.estado === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {t(`status.${post.estado}`)}
                    </span>
                  </td>

                  <td className="d-none d-md-table-cell">
                    {new Date(post.createdAt).toLocaleString()}
                  </td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" size="sm">
                        {t('actionss.title')}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleAprovePost(post)}>{t('actionss.approve')}</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeletePost(post)}>{t('actionss.delete')}</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleBlockUser(post.user)}>{t('actionss.blockUser')}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">{t('noPending')}</td>
              </tr>
            )}
          </tbody>
        </table>

        {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

        <LoadMoreBtn
          result={homePostsAprove.result}
          page={homePostsAprove.page}
          load={load}
          handleLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default PostsPendientes;
