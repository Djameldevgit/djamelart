import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../PostCard';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { POST_TYPES } from '../../redux/actions/postAction';

const Posts = ({ posts }) => {
  const { homePosts, theme } = useSelector(state => state);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  // Mostrar los posts recibidos (filtrados o no)
  const displayPosts = posts?.length ? posts : homePosts.posts;

  // Cargar más publicaciones
  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`);
    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: { ...res.data, page: homePosts.page + 1 },
    });
    setLoad(false);
  };

  return (
    <div>
      <div className="post_thumb">
        {displayPosts.length === 0 ? (
          <h2 className="text-center mt-4">No se encontraron publicaciones.</h2>
        ) : (
          displayPosts.map(post => (
            <PostCard key={post._id} post={post} theme={theme} />
          ))
        )}

        {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
      </div>

      {/* Mostrar "Cargar más" solo si no hay filtros activos */}
      {!posts && (
        <LoadMoreBtn
          result={homePosts.result}
          page={homePosts.page}
          load={load}
          handleLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
};

export default Posts;
