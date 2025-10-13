import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../PostCard';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { POST_TYPES } from '../../redux/actions/postAction';

const Posts = ({ filters = [] }) => { // Ahora filters es un array de posts
    const { homePosts, auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    // Si filters tiene datos (búsqueda aplicada), usar filters, sino usar homePosts.posts
    const postsToDisplay = filters && filters.length > 0 ? filters : homePosts.posts;

    // Filtrar los posts según los criterios de búsqueda
    const filteredPosts = postsToDisplay.filter(post => {
        // Si no hay posts, retornar array vacío
        if (!postsToDisplay || postsToDisplay.length === 0) return false;

        // Si filters es un array de posts (resultado de búsqueda), mostrar todos
        if (Array.isArray(filters) && filters.length > 0) {
            return true;
        }

        // Si estamos en homePosts, aplicar filtros individuales
        const searchFilters = typeof filters === 'object' && !Array.isArray(filters) ? filters : {};

        // Filtro por título
        if (searchFilters.title && !post.title?.toLowerCase().includes(searchFilters.title.toLowerCase())) {
            return false;
        }

        // Filtro por tema
        if (searchFilters.theme && post.theme?.toLowerCase() !== searchFilters.theme.toLowerCase()) {
            return false;
        }

        // Filtro por estilo
        if (searchFilters.style && post.style?.toLowerCase() !== searchFilters.style.toLowerCase()) {
            return false;
        }

        // Filtro por wilaya
        if (searchFilters.wilaya && post.wilaya?.toLowerCase() !== searchFilters.wilaya.toLowerCase()) {
            return false;
        }

        // Filtro por precio mínimo
        if (searchFilters.priceMin) {
            const minPrice = Number(searchFilters.priceMin);
            const postPrice = Number(post.price) || 0;
            if (postPrice < minPrice) return false;
        }

        // Filtro por precio máximo
        if (searchFilters.priceMax) {
            const maxPrice = Number(searchFilters.priceMax);
            const postPrice = Number(post.price) || 0;
            if (postPrice > maxPrice) return false;
        }

        // Filtro por categorías (painting, sculpture, photography, etc.)
        if (searchFilters.categories) {
            const categoryFilters = Object.entries(searchFilters.categories)
                .filter(([_, value]) => value === true)
                .map(([key]) => key);

            if (categoryFilters.length > 0) {
                const postCategory = post.category?.toLowerCase();
                if (!categoryFilters.some(cat => postCategory === cat.toLowerCase())) {
                    return false;
                }
            }
        }

        // Filtro por categorías individuales (compatibilidad con búsqueda anterior)
        const categoryFields = [
            'painting', 'sculpture', 'photography', 'drawing', 
            'engraving', 'digital_art', 'collage', 'textile_art'
        ];

        const hasCategoryFilter = categoryFields.some(field => searchFilters[field]);
        
        if (hasCategoryFilter) {
            const postCategory = post.category?.toLowerCase();
            let categoryMatch = false;

            categoryFields.forEach(field => {
                if (searchFilters[field] && postCategory === field.toLowerCase()) {
                    categoryMatch = true;
                }
            });

            if (!categoryMatch) return false;
        }

        return true;
    });

    const handleLoadMore = async () => {
        setLoad(true);
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token);

        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: { ...res.data, page: homePosts.page + 1 },
        });

        setLoad(false);
    };

    return (
        <div>
            <div className="post_thumb">
                {/* Mostrar mensaje si no hay resultados */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-4">
                        <p>No se encontraron posts que coincidan con tu búsqueda.</p>
                    </div>
                )}

                {/* Mostrar los posts filtrados */}
                {filteredPosts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))}

                {/* Mostrar el ícono de carga */}
                {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
            </div>

            {/* Solo mostrar LoadMoreBtn si estamos en home (no en búsqueda) */}
            {(!filters || filters.length === 0) && (
                <LoadMoreBtn
                    result={homePosts.result}
                    page={homePosts.page}
                    load={load}
                    handleLoadMore={handleLoadMore}
                />
            )}
        </div>
    );
};

export default Posts;