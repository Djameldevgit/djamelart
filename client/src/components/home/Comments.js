import React, { useState, useEffect } from 'react'
import CommentDisplay from './comments/CommentDisplay'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const Comments = ({post}) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(2)
    const [replyComments, setReplyComments] = useState([])
    const { languageReducer } = useSelector(state => state)
    const { t } = useTranslation('home')
    const lang = languageReducer?.language || 'en'

    useEffect(() => {
        const newCm = post.comments.filter(cm => !cm.reply)
        setComments(newCm)
        setShowComments(newCm.slice(newCm.length - next))
    },[post.comments, next])

    useEffect(()=> {
        const newRep = post.comments.filter(cm => cm.reply)
        setReplyComments(newRep)
    }, [post.comments])

    return (
        <div className="comments">
            {
                showComments.map((comment, index) => (
                    <CommentDisplay key={index} comment={comment} post={post}
                    replyCm={replyComments.filter(item => item.reply === comment._id)} />
                ))
            }

            {
                comments.length - next > 0
                ? <div className="p-2 border-top"
                style={{cursor: 'pointer', color: 'crimson'}}
                onClick={() => setNext(next + 10)}>
                    {t('seeMoreComments', { lng: lang })}
                </div>

                : comments.length > 2 &&
                <div className="p-2 border-top"
                style={{cursor: 'pointer', color: 'crimson'}}
                onClick={() => setNext(2)}>
                    {t('hideComments', { lng: lang })}
                </div>
            }
        </div>
    )
}

export default Comments