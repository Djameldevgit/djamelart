import React, { useState, useEffect } from 'react';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const CardBodyCarousel = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [buyLoad, setBuyLoad] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBuyMessage, setShowBuyMessage] = useState(false);

  const { languageReducer, auth, socket } = useSelector((state) => state);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.token) dispatch(loadCart(auth.token));
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (auth.user && post.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.user]);

  useEffect(() => {
    if (auth.user && auth.user.saved.includes(post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post._id]);

  // Sincronizar carrito con estado global
  useEffect(() => {
    const cartItems = auth.user?.cart?.items || [];
    setInCart(cartItems.some(item => item.postId === post._id));
  }, [auth.user?.cart, post._id]); // Observa auth.user.cart completo, no solo items
  
  const handleLike = async () => {
    if (!auth.token) return setShowModal(true);
    if (loadLike) return;
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket, t, languageReducer }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (!auth.token) return setShowModal(true);
    if (loadLike) return;
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
    if (!auth.token) return setShowModal(true);
    if (saveLoad) return;
    setSaveLoad(true);
    await dispatch(savePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (!auth.token) return setShowModal(true);
    if (saveLoad) return;
    setSaveLoad(true);
    await dispatch(unSavePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleBuyProduct = async () => {
    if (!auth.token) return setShowModal(true);
    if (buyLoad) return;
    setBuyLoad(true);
    try {
      await dispatch(buyProduct({ post, auth }));
      // Actualiza el estado local inmediatamente
      setInCart(prev => !prev);
      // Luego recarga el carrito para sincronizar
      await dispatch(loadCart(auth.token));
      setShowBuyMessage(true);
      setTimeout(() => setShowBuyMessage(false), 3000);
    } catch (error) {
      console.error("Error al comprar:", error);
    } finally {
      setBuyLoad(false);
    }
  };

  return (
    <div>
      <div className="card_body">
        {post.images.length > 0 && (
          <div className="carousel-container" style={{ position: "relative" }}>
            {/* Guardar */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 1,
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: "50%",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={saved ? handleUnSavePost : handleSavePost}
            >
              <span
                className="material-icons"
                style={{
                  fontSize: "24px",
                  color: saved ? "#ff8c00" : "#000",
                  opacity: saveLoad ? 0.5 : 1
                }}
              >
                {saveLoad ? "hourglass_empty" : "bookmark"}
              </span>
            </div>

            {/* Likes */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "red",
                  marginRight: "5px",
                }}
              >
                {post.likes.length}
              </span>
              <div
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "50%",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loadLike ? 0.7 : 1
                }}
                onClick={isLike ? handleUnLike : handleLike}
              >
                <span
                  className="material-icons"
                  style={{
                    fontSize: "24px",
                    color: isLike ? "red" : "green",
                  }}
                >
                  {loadLike ? "hourglass_empty" : "favorite"}
                </span>
              </div>
            </div>

            {/* Comprar */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                zIndex: 1,
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: "50%",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${inCart ? "#F44336" : "#4CAF50"}`,
                opacity: buyLoad ? 0.7 : 1
              }}
              onClick={handleBuyProduct}
              title={inCart ? "Quitar del carrito" : "Añadir al carrito"}
            >
              <span 
                className="material-icons" 
                style={{ 
                  fontSize: "24px",
                  color: inCart ? "#F44336" : "#4CAF50"
                }}
              >
                {buyLoad ? "hourglass_empty" : "shopping_cart"}
              </span>
            </div>

            {/* Carousel */}
            <div className="card">
              <div
                className="card__image"
                onClick={() => history.push(`/post/${post._id}`)}
              >
                <Carousel images={post.images} id={post._id} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Login/Register */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{t("title", { lng: languageReducer.language })}</h4>
            <p>{t("message", { lng: languageReducer.language })}</p>
            <div className="modal-buttons">
              <button onClick={() => history.push("/login")}>
                {t("login", { lng: languageReducer.language })}
              </button>
              <button onClick={() => history.push("/register")}>
                {t("register", { lng: languageReducer.language })}
              </button>
              <button onClick={() => setShowModal(false)}>
                {t("close", { lng: languageReducer.language })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje compra */}
      {showBuyMessage && (
        <div
          className="buy-message"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: inCart ? "#4CAF50" : "#F44336",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          <span className="material-icons" style={{ marginRight: "8px" }}>
            {inCart ? "check_circle" : "shopping_cart"}
          </span>
          {inCart ? "Producto añadido al carrito" : "¡Gracias por tu compra!"}
        </div>
      )}
    </div>
  );
};

export default React.memo(CardBodyCarousel);

