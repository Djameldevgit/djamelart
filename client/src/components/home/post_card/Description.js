 
import React, { useState } from 'react';
const Description = ({ post }) => {
    const [readMore, setReadMore] = useState(false)
    return (
        <div className="descriptiones-container">
              {post.description && (
                    <div className="infoitem-description">
                        <i className="fas fa-comments"></i>
                        <span className="infolabel">Description:</span>
                        <span className="infovalue">
                            <div className="cardbodycontent"  >
                                <span>
                                    {
                                        post.description.length < 60
                                            ? post.description
                                            : readMore ? post.description + ' ' : post.description.slice(0, 60) + '.....'
                                    }
                                </span>
                                {
                                    post.description.length > 60 &&
                                    <span className="readMore color-red" onClick={() => setReadMore(!readMore)}>
                                        {readMore ? 'masque lo contenu' : 'Lire plus'}
                                    </span>
                                }
                            </div>
                        </span>
                    </div>
                )}
        </div>
    );
}

export default Description;
