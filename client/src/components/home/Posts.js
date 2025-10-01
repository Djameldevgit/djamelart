// Posts.jsx - Versión actualizada
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../PostCard'

import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'

const Posts = ({ filteredPosts }) => {
    const { homePosts, auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    // Usar filteredPosts si se proporciona, de lo contrario usar homePosts
    const postsToShow = filteredPosts || homePosts.posts
    const hasMorePosts = filteredPosts ? false : homePosts.result >= (homePosts.page * 9)

    const handleLoadMore = async () => {
        if (filteredPosts) return; // No cargar más si estamos mostrando resultados filtrados

        setLoad(true)
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token)

        dispatch({
            type: POST_TYPES.GET_POSTS, 
            payload: {...res.data, page: homePosts.page + 1}
        })

        setLoad(false)
    }

    return (
        <div>
            <div className="post_thumb">
                {postsToShow.length > 0 ? (
                    postsToShow.map(post => (
                        <PostCard key={post._id} post={post} theme={theme} />
                    ))
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No hay posts para mostrar</p>
                    </div>
                )}

                {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
            </div>
            
            {/* Mostrar LoadMoreBtn solo cuando no hay filtros aplicados */}
            {!filteredPosts && (
                <LoadMoreBtn 
                    result={homePosts.result} 
                    page={homePosts.page}
                    load={load} 
                    handleLoadMore={handleLoadMore} 
                />
            )}
        </div>
    )
}

export default Posts