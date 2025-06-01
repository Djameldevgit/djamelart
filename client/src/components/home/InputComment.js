import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentAction'
import Icons from '../Icons'
import { useTranslation } from 'react-i18next'

const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('')
    const { auth, socket, theme, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const { t } = useTranslation('home')
    const lang = languageReducer?.language || 'en'

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!content.trim()){
            if(setOnReply) return setOnReply(false);
            return;
        }

        setContent('')
        
        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        
        dispatch(createComment({post, newComment, auth, socket}))

        if(setOnReply) return setOnReply(false);
    }

    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit} >
            {children}
            <input 
                type="text" 
                placeholder={t('addYourComment', { lng: lang })}
                value={content} 
                onChange={e => setContent(e.target.value)}
                style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    color: theme ? 'white' : '#111',
                    background: theme ? 'rgba(0,0,0,.03)' : '',
                }} 
            />

            <Icons setContent={setContent} content={content} theme={theme} />

            <button type="submit" className="postBtn">
                {t('post', { lng: lang })}
            </button>
        </form>
    )
}

export default InputComment