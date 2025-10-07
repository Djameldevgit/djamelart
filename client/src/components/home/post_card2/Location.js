import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Location = ({ post }) => {
  const location = useLocation();
  const isDetailPage = location.pathname === `/post/${post._id}`;

  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('postDetail');  
  const lang = languageReducer.language || 'en'; 
  return (
    <div className="cardtitle">
     

      {!isDetailPage && (
        <div className="titlelocation">
          <span><i className="fas fa-map-marker-alt"></i></span>
          <div className="title4">
            {t('region', { lng: lang })}: {post.wilaya}
          </div>
          <div className="title4">
            {t('city', { lng: lang })}: {post.commune}
          </div>
          <div>
            <span className="ml-1 mr-1 text-danger">{post.price}</span>{" "}
            <span>{post.unidaddeprecio}</span>
          </div>
        </div>
      )}
    </div>
  );
};


export default Location;

