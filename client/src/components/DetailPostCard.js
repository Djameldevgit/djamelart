// components/DetailPostCard.js
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CardHeader from './home/post_card/CardHeader';
import Comments from './home/Comments';
import InputComment from './home/InputComment';
import DescriptionPost from './home/post_card/DescriptionPost';
import Location from './home/post_card/Location';
import CardBodyCarousel from './home/post_card/CardBodyCarousel';
 

const DetailPostCard = ({ post }) => {
    const { auth } = useSelector(state => state);
    const history = useHistory();
    const isAuthenticated = auth.token ? true : false;

    return (
        <div className="detail-post-container">
            <div className="detail-post-card">
                {/* Botón de regreso */}
                <button 
                    className="back-button"
                    onClick={() => history.goBack()}
                >
                    <span className="material-icons">arrow_back</span>
                    Volver
                </button>

                {/* Contenido principal */}
                <div className="detail-post-content">
                    {/* Sección de imagen/carousel */}
                    <div className="image-section">
                        <CardBodyCarousel post={post} />
                    </div>

                    {/* Sección de información */}
                    <div className="info-section">
                        <CardHeader post={post} />
                        
                        <div className="post-details">
                            <DescriptionPost post={post} />
                            <Location post={post} />
                        </div>

                        {/* Comentarios */}
                        <div className="comments-section">
                            {isAuthenticated && <InputComment post={post} />}
                            <Comments post={post} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPostCard;