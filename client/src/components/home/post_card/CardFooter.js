import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
        <Card.Title>  {t(post.title, { lng: lang })}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>  {t(post.category, { lng: lang })}</ListGroup.Item>
        <ListGroup.Item>  {t(post.subcategory, { lng: lang })}</ListGroup.Item>
        <ListGroup.Item>  {t(post.support, { lng: lang })}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card>
  )}
</dib>
  );
}

export default CardFooter;