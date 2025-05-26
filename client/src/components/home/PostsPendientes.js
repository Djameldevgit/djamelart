import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { aprovarPostPendiente, POST_TYPES_APROVE } from '../../redux/actions/postAproveAction';
import { deletePost } from '../../redux/actions/postAction';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';


const PostsPendientes = () => {
    const { homePostsAprove, auth, socket } = useSelector((state) => state);

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
        const page = homePostsAprove.page || 1; // Evitar que sea undefined
        const res = await getDataAPI(`posts/pendientes?limit=${page * 9}`, auth.token);
        dispatch({
            type: POST_TYPES_APROVE.GET_POSTS_PENDIENTES,
            payload: { ...res.data, page: page + 1 },
        });
        setLoad(false);
    };

    const handleAprovePost = (post) => {
        if (window.confirm("¿Deseas aprobar este post?")) {
            dispatch(aprovarPostPendiente({ post, auth }));
            history.push("/postspendientes");
        }
    };

    const handleDeletePost = (post) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este post?")) {
            dispatch(deletePost({ post, auth, socket }));
            history.push("/postspendientes");
        }
    };
    const handleBlockUser = (user) => {
        if (window.confirm(`¿Estás seguro de que quieres bloquear al usuario ${user.username}?`)) {
            // Aquí puedes llamar a una acción de Redux o a una API para bloquear al usuario
            console.log(`Usuario ${user.username} bloqueado.`);
            // dispatch(blockUserAction({ user, auth }));
        }
    };

    return (
        <div className="container mt-4">
            <h5 className="mb-3 text-center">Total de posts pendientes: {postsPendientes.length}</h5>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark text-center">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th className="d-none d-md-table-cell">Total posts</th>
                            <th>Utilizateur</th>
                            <th>Catgories</th>
                            <th>Títre</th>
                            <th>Etat</th>
                            <th className="d-none d-md-table-cell">Date</th>
                            <th>Acction</th>
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
                                                    style={{ width: "60px", height: "60px", objectFit: "cover", cursor: "pointer" }}
                                                />
                                            </Link>


                                        ) : (
                                            <span>Pas des images</span>
                                        )}
                                    </td>

                                    <td className="text-truncate" style={{ maxWidth: "150px" }}>{post.content}</td>
                                    <td>   {post.user.username}  </td>
                                    <td>{post.subCategory}</td>
                                    <td>{post.title}</td>

                                    <td>
                                        <span className={`badge ${post.estado === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                            {post.estado}
                                        </span>
                                    </td>

                                    <td className="d-none d-md-table-cell">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </td>



                                    <Dropdown>
  <Dropdown.Toggle variant="primary" size="sm">
    Opciones
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item onClick={() => handleAprovePost(post)}>Aprobar</Dropdown.Item>
    <Dropdown.Item onClick={() => handleDeletePost(post)}>Eliminar</Dropdown.Item>
    <Dropdown.Item onClick={() => handleBlockUser(post.user)}>Bloquear Usuario</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
                                </tr>


                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No hay posts pendientes</td>
                            </tr>
                        )}


                    </tbody>


                </table>

                {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
                <LoadMoreBtn result={homePostsAprove.result} page={homePostsAprove.page} load={load} handleLoadMore={handleLoadMore} />
            </div>

        </div>
    );
};

export default PostsPendientes;