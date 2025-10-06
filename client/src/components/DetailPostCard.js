
import React from 'react';
import Comments from './home/Comments';
import InputComment from './home/InputComment';

import DescriptionPost from './home/post_card/DescriptionPost';


const DetailPostCard = ({ post }) => {


    return (
        <div>
            <DescriptionPost post={post} />
          
            <Comments post={post} /> 
            <InputComment post={post} />
        </div>

    );
};

export default DetailPostCard;