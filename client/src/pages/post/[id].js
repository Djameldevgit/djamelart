import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPost, viewPost } from "../../redux/actions/postAction";

const DetailPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const detailPost = useSelector(state => state.detailPost.detailPost); // 👈 array de posts

  const [post, setPost] = useState(null);

  // cargar post
  useEffect(() => {
    if (id) {
      dispatch(getPost({ detailPost, id, auth }));
    }
  }, [dispatch, id, auth, detailPost]);

  // aumentar views (solo una vez por sesión)
 // 🔹 aumentar views cuando se renderiza
 useEffect(() => {
  console.log("🔥 useEffect ejecutado", { id, token: auth?.token });

  if (id && auth?.token) {
    const viewed = localStorage.getItem("viewed_posts") || "[]";
    const viewedPosts = JSON.parse(viewed);

    console.log("👀 viewedPosts:", viewedPosts);

    if (!viewedPosts.includes(id)) {
      console.log("📢 Disparando acción viewPost con id:", id);

      dispatch(viewPost({ id, auth }));

      localStorage.setItem(
        "viewed_posts",
        JSON.stringify([...viewedPosts, id])
      );
    } else {
      console.log("⚠️ Ya está en viewedPosts, no sumo vista");
    }
  } else {
    console.log("❌ Falta id o token, no se dispara viewPost");
  }
}, [dispatch, id, auth]);




  // seleccionar post del array
  useEffect(() => {
    const found = detailPost.find(p => p._id === id);
    if (found) setPost(found);
  }, [detailPost, id]);

  if (!post) return <h2>Cargando...</h2>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>👁️ {post.views}</p>
    </div>
  );
};


export default DetailPost;
