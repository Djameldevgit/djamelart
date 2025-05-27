import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CardBodyTitle = ({ post }) => {
  const location = useLocation();
  const isDetailPage = location.pathname === `/post/${post._id}`;

  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('postDetail'); // namespace postDetail

  return (
    <div className="cardtitle">
      <div className="card-header">
        {!isDetailPage && (
          <div className="title-post">
            <div className="title0">
              {t('category', { lng: languageReducer.language })}: {t(post.category, { lng: languageReducer.language })}
            </div>
            <div className="title0">
              {t('subcategory', { lng: languageReducer.language })}: {t(post.subcategory, { lng: languageReducer.language })}
            </div>
          </div>
        )}
      </div>

      {!isDetailPage && (
        <div className="titlelocation">
          <span><i className="fas fa-map-marker-alt"></i></span>
          <div className="title4">
            {t('region', { lng: languageReducer.language })}: {post.wilaya}
          </div>
          <div className="title4">
            {t('city', { lng: languageReducer.language })}: {post.commune}
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


export default CardBodyTitle;



