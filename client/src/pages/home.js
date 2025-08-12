// Home.js
import React from 'react';
import { useSelector } from 'react-redux';
import Posts from '../components/home/Posts';
import LoadIcon from '../images/loading.gif';
import { useTranslation } from 'react-i18next';
//import PostsPubliBlog from '../components/home/PostsPubliBlog';
  
const Home = ({ filters }) => {
  const { homePosts, languageReducer  } = useSelector(state => state);
  const { t } = useTranslation('search');
  const lang = languageReducer.language || 'en';

  // Función para aplicar filtros
  const applyFilters = (posts) => {
    if (!filters) return posts;

    return posts.filter(post => {
      // Búsqueda general por palabras clave (search en título, categoría, tema, estilo)
      if (filters.search) {
        const keywords = filters.search
          .toLowerCase()
          .split(' ')
          .filter(word => word.trim() !== '');

        const content = `
              ${post.title || ''} 
              ${post.category || ''} 
              ${post.theme || ''} 
              ${post.style || ''}
          `.toLowerCase();

        const allMatch = keywords.every(keyword => content.includes(keyword));

        if (!allMatch) return false;
      }


      // Filtro por categoría
      if (filters.category && post.category !== filters.category) return false;

      // Filtro por tema
      if (filters.theme && !post.theme?.toLowerCase().includes(filters.theme.toLowerCase())) return false;

      // Filtro por estilo
      if (filters.style && !post.style?.toLowerCase().includes(filters.style.toLowerCase())) return false;

      // Filtro por precio
      if (filters.minPrice || filters.maxPrice) {
        const price = post.price || 0;
        const min = filters.minPrice ? Number(filters.minPrice) : 0;
        const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
        if (price < min || price > max) return false;
      }

      return true;
    });
  };

  // Posts filtrados
  const filteredPosts = applyFilters(homePosts.posts || []);

  return (
    <div >
  
      {homePosts.loading ? (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
      ) : filteredPosts.length === 0 ? (
        <h2 className="text-center">{t('No_Post', { lng: lang })}</h2>
      ) : (
        <Posts posts={filteredPosts} />




      )}
    </div>
  );
};
export default Home;