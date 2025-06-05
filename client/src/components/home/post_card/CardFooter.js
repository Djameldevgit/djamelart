import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import 'moment/locale/ar'; // Importa el idioma francés

const CardFooter = ({ post }) => {
  const location = useLocation();
  const isDetailPage = location.pathname === `/post/${post._id}`;

  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('cardbodytitle');
  const lang = languageReducer.language || 'en';
  return (
    <dib>

      {!isDetailPage && (
        <Card  >

          <Card.Body>
            <Card.Title> {t('title', { lng: lang })} : {t(post.title, { lng: lang })}</Card.Title>

          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>{t('category', { lng: lang })} :  {t(post.category, { lng: lang })}</ListGroup.Item>
            <ListGroup.Item>{t('subcategory', { lng: lang })} :   {t(post.subcategory, { lng: lang })}   </ListGroup.Item>
 
            <ListGroup.Item> {t('support', { lng: lang })} :{t(post.support, { lng: lang })}</ListGroup.Item>
          </ListGroup>
          <Card.Footer>
            <i className='far fa-clock'></i>   <small className="text-muted">  {moment(post.createdAt).fromNow()}</small>
          </Card.Footer>

        </Card>
      )}
    </dib>
  );
}

export default CardFooter;