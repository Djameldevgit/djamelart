import React from 'react'
import CardHeader from './home/post_card/CardHeader'
 
import Comments from './home/Comments'
import InputComment from './home/InputComment'
import { useLocation } from "react-router-dom";
import DescriptionPost from './home/post_card/DescriptionPost'
import { useSelector } from 'react-redux';
import Location from './home/post_card/Location'

 
import CardBodyCarousel from './home/post_card/CardBodyCarousel';
 
const PostCard = ({ post, isDetail = false  }) => {
    const location = useLocation();
    const isPostDetailPage = location.pathname === `/post/${post._id}`;
    const { auth, settings } = useSelector(state => state);
    const isAuthenticated = auth.token ? true : false;

  /*  // Determinar qué componente de cuerpo de tarjeta mostrar según el rol del usuario
    const renderCardBody = () => {    {renderCardBody()}
        // Si el usuario está autenticado y tiene el rol "Super-utilisateur"
        if (isAuthenticated && auth.user && auth.user.role === "Super-utilisateur") {
            return <CardBodyCarouselimmo post={post} theme={theme} />;
        }
        // Para todos los demás casos (no autenticado o rol diferente)
        return <CardBodyCarousel post={post} theme={theme} />;
    };*/

    return (
        <div className="">
            <CardHeader post={post} />

       
                 < CardBodyCarousel post={post} />
           
            {isPostDetailPage && <DescriptionPost post={post} />}
            {isPostDetailPage && <Location post={post} />}

            {isAuthenticated && isPostDetailPage && (
                <> 
                {isPostDetailPage && <InputComment post={post} />}
                    {isPostDetailPage && <Comments post={post} />}
                   
                </>
            )}
        </div>
    );
};

export default PostCard;

 