// Posts.jsx - Versión simplificada para debugging
import React from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { useTranslation } from 'react-i18next';
import { Alert, Row, Col } from 'react-bootstrap';

const Posts = ({ filteredPosts }) => {
  const { homePosts, theme, languageReducer } = useSelector((state) => state);
  const { t } = useTranslation("jsonglobal");
  const lang = languageReducer.language || "en";

  console.log("🔹 Posts component - filteredPosts:", filteredPosts);
  console.log("🔹 Posts component - homePosts:", homePosts.posts);

  // 🔹 DECISIÓN CRÍTICA: Qué posts mostrar
  const displayPosts = filteredPosts !== undefined && filteredPosts !== null 
    ? filteredPosts 
    : homePosts.posts;

  console.log("🔹 Posts component - displayPosts:", displayPosts);

  if (displayPosts.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        {t("No_Post", { lng: lang })}
      </Alert>
    );
  }

  return (
    <Row>
      {displayPosts.map((post) => (
        <Col key={post._id} xs={12} sm={6} lg={4} className="mb-4">
          <PostCard post={post} theme={theme} />
        </Col>
      ))}
    </Row>
  );
};

export default Posts;