import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../PostCard'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES_ADMIN } from '../../redux/actions/publiBlogAction.'
 
const PostsPubliBlog = () => {
    const { publiBlogReducer , auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(
            `posts/admin?limit=${publiBlogReducer .page * 9}`,
            auth.token
        )

        dispatch({
            type: POST_TYPES_ADMIN.GET_POSTS,
            payload: { ...res.data, page: publiBlogReducer .page + 1 }
        })

        setLoad(false)
    }

    return (
        <div className="posts">
            {publiBlogReducer.posts.map(post => (
                <PostCard key={post._id} post={post} theme={theme} />
            ))}

            {load && (
                <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            )}

            <LoadMoreBtn
                result={publiBlogReducer.result}
                page={publiBlogReducer.page}
                load={load}
                handleLoadMore={handleLoadMore}
            />
        </div>
    )
}

export default PostsPubliBlog
