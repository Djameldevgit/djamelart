import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LoadIcon from '../../images/loading.gif';
import PostCard from '../../components/PostCard';

import { getPost, viewPost } from "../../redux/actions/postAction";

const DetailPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const detailPost = useSelector(state => state.detailPost.detailPost); // array de posts

  const [post, setPost] = useState(null);

  // cargar post
  useEffect(() => {
    if (id) {
      dispatch(getPost({ detailPost, id, auth }));
    }
  }, [dispatch, id, auth, detailPost]);

  // aumentar views (solo una vez por sesión)
  useEffect(() => {
    if (id && auth?.token) {
      const viewed = localStorage.getItem("viewed_posts") || "[]";
      const viewedPosts = JSON.parse(viewed);

      if (!viewedPosts.includes(id)) {
        dispatch(viewPost({ id, auth }));
        localStorage.setItem(
          "viewed_posts",
          JSON.stringify([...viewedPosts, id])
        );
      }
    }
  }, [dispatch, id, auth]);

  // seleccionar post del array
  useEffect(() => {
    const found = detailPost.find(p => p._id === id);
    if (found) setPost(found);
  }, [detailPost, id]);

  if (!post) return (
    <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
  );

  return (
    <div className="detail-post">
      <PostCard key={post._id} post={post}   />
    </div>
  );
};

export default DetailPost;
