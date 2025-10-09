import React from 'react'
import CardHeader from './home/post_card/CardHeader'
 
import Comments from './home/Comments'
import InputComment from './home/InputComment'
import { useLocation } from "react-router-dom";
import DescriptionPost from './home/post_card/DescriptionPost'
import { useSelector } from 'react-redux';
 
 
import CardBodyCarousel from './home/post_card/CardBodyCarousel';
 
const PostCard = ({ post  }) => {
    const location = useLocation();
    const isPostDetailPage = location.pathname === `/post/${post._id}`;
    const { auth } = useSelector(state => state);
    const isAuthenticated = auth.token ? true : false;
 

    return (
        <div >
          
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

 