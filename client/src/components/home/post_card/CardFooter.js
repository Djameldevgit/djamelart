import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from 'moment';
// Importa todos los locales necesarios
import 'moment/locale/es'; // Español
import 'moment/locale/en-gb'; // Inglés
import 'moment/locale/fr'; // Francés
import 'moment/locale/ru'; // Ruso
import 'moment/locale/zh-cn'; // Chino
import 'moment/locale/ar'; // Árabe

const CardFooter = ({ post }) => {
  const location = useLocation();
  const isDetailPage = location.pathname === `/post/${post._id}`;
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('cardbodytitle');
  const lang = languageReducer.language || 'en';

  // Efecto para cambiar el idioma de moment dinámicamente
  useEffect(() => {
    const momentLangMap = {
      es: 'es',
      en: 'en-gb',
      fr: 'fr',
      ru: 'ru',
      zh: 'zh-cn',
      ar: 'ar'
    };
    const momentLang = momentLangMap[lang] || 'en-gb'; // Default: inglés
    moment.locale(momentLang);
  }, [lang]);

  return (
    <div>
      {!isDetailPage && (
        <Card style={{
          direction: lang === 'ar' ? 'rtl' : 'ltr',
            textAlign: lang === 'ar' ? 'right' : 'left',
          }}>
          <Card.Body>
            <Card.Title>{t('title', { lng: lang })}: {t(post.title, { lng: lang })}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
         
          <ListGroup.Item> Artist:  {post.user.username} </ListGroup.Item>
     
            <ListGroup.Item>{t('category', { lng: lang })}: {t(post.category, { lng: lang })}</ListGroup.Item>
            <ListGroup.Item>{t('subcategory', { lng: lang })}: {t(post.subcategory, { lng: lang })}</ListGroup.Item>
            <ListGroup.Item>{t('support', { lng: lang })}: {t(post.support, { lng: lang })}</ListGroup.Item>
          </ListGroup>
          <Card.Footer>
            <i className='far fa-clock'></i> 
            <small className="text-muted mr-2 ml-2">{moment(post.createdAt).fromNow()}</small>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default CardFooter;