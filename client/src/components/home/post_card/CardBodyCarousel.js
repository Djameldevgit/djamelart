import React, { useState, useEffect } from 'react';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import { buyProduct, loadCart } from '../../../redux/actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
  
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';


const CardBodyCarousel = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [buyLoad, setBuyLoad] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBuyMessage, setShowBuyMessage] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const { languageReducer, auth, socket } = useSelector((state) => state);
  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
  const dispatch = useDispatch();

  const canProceed = () => {
    if (!auth.token || !auth.user) {
      setShowModal(true); // ✅ Mostrar “Conéctate o regístrate”
      return false;
    }

    if (!auth.user.isVerified) {
      setShowVerifyModal(true);
      return false;
    }

    if (auth.user.isActive === false) {
      setShowDeactivatedModal(true);
      return false;
    }

    return true;
  };



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
    if (auth.user?.saved?.includes(post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post._id]);

  useEffect(() => {
    const cartItems = auth.user?.cart?.items || [];
    setInCart(cartItems.some(item => item.postId === post._id));
  }, [auth.user?.cart, post._id]);

  const handleLike = async () => {
    if (!canProceed() || loadLike) return;
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket  }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (!canProceed() || loadLike) return;
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
    if (!canProceed() || saveLoad) return;
    setSaveLoad(true);
    await dispatch(savePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (!canProceed() || saveLoad) return;
    setSaveLoad(true);
    await dispatch(unSavePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleBuyProduct = async () => {
    if (!canProceed() || buyLoad) return;
    setBuyLoad(true);
    try {
      await dispatch(buyProduct({ post, auth }));
      setInCart(prev => !prev);
      await dispatch(loadCart(auth.token));
      setShowBuyMessage(true);
      setTimeout(() => setShowBuyMessage(false), 3000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setBuyLoad(false);
    }
  };

  return (
    <div>
        <div className="card-container">
        {post.images.length > 0 && (
          <div className="carousel-wrapper">
            
            <div className="icons-top-container">
            
              <div className="view-counter">
                <div className="view-icon">
                  <span className="material-icons">visibility</span>
                </div>
                <span className="view-count">{post.views || 0}</span>
              </div>
              
        
              <div 
                className={`icon-button save-button ${saveLoad ? 'loading' : ''}`}
                onClick={saved ? handleUnSavePost : handleSavePost}
                title={saved ? t("unsave", { lng: lang }) : t("save", { lng: lang })}
              >
                <span className="material-icons">
                  {saveLoad ? "hourglass_empty" : saved ? "bookmark" : "bookmark_border"}
                </span>
              </div>
            </div>
            
            {/* Contenedor del carrusel */}
            <div className="carousel-card" onClick={() => history.push(`/post/${post._id}`)}>
              <Carousel images={post.images} id={post._id} />
            </div>
            
            {/* Contenedor de iconos inferiores */}
            <div className="icons-bottom-container">
              {/* Botón de like */}
              <div className="like-section">
                <div 
                  className={`icon-button like-button ${loadLike ? 'loading' : ''} ${isLike ? 'liked' : ''}`}
                  onClick={isLike ? handleUnLike : handleLike}
                >
                  <span className="material-icons">
                    {loadLike ? "hourglass_empty" : "favorite"}
                  </span>
                </div>
                <span className="like-count">{post.likes.length}</span>
              </div>
              
              {/* Botón de comprar */}
              <div 
                className={`icon-button cart-button ${buyLoad ? 'loading' : ''} ${inCart ? 'in-cart' : ''}`}
                onClick={handleBuyProduct}
                title={inCart ? t("removeFromCart", { lng: lang }) : t("addToCart", { lng: lang })}
              >
                <span className="material-icons">
                  {buyLoad ? "hourglass_empty" : inCart ? "shopping_cart" : "add_shopping_cart"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de compra */}
      {showBuyMessage && (
        <div className="buy-message" style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          backgroundColor: inCart ? "#4CAF50" : "#F44336", color: "white", padding: "10px 20px",
          borderRadius: "5px", zIndex: 9999, display: "flex", alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}>
          <span className="material-icons" style={{ marginRight: "8px" }}>
            {inCart ? "check_circle" : "shopping_cart"}
          </span>
          {inCart
            ? t("productAddedToCart", { lng: lang })
            : t("thanksForPurchase", { lng: lang })}
        </div>
      )}

      {/* Modal verificación */}
      {showVerifyModal && (
        <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      )}
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />

    </div>


    // En el return:

  );
};

export default React.memo(CardBodyCarousel);
