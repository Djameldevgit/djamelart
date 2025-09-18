 
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentAction'
import Icons from '../Icons'
// ✅ Importar los modales
import AuthModal from '../authAndVerify/AuthModal';
import VerifyModal from '../authAndVerify/VerifyModal';
import DesactivateModal from '../authAndVerify/DesactivateModal';

const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('')
    
    // ✅ Estados para los modales
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);

    const { auth, socket, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    // ✅ Función canProceed
    const canProceed = () => {
        if (!auth.token || !auth.user) {
            setShowAuthModal(true);
            return false;
        }

        if (!auth.user.isVerified) {
            setShowVerifyModal(true);
            return false;
        }

        if (auth.user.isActive === false) {
            setShowDeactivatedModal(true);
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // ✅ Verificar si puede proceder antes de comentar
        if (!canProceed()) return;
        
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
        <>
            <form className="card-footer comment_input" onSubmit={handleSubmit} >
                {children}
                <input type="text" placeholder="Add your comments..."
                value={content} onChange={e => setContent(e.target.value)}
                style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    color: theme ? 'white' : '#111',
                    background: theme ? 'rgba(0,0,0,.03)' : '',
                }} />

                <Icons setContent={setContent} content={content} theme={theme} />

                <button type="submit" className="postBtn">
                    Post
                </button>
            </form>

            {/* ✅ Agregar los modales */}
            <AuthModal 
                show={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
            />
            <VerifyModal 
                show={showVerifyModal} 
                onClose={() => setShowVerifyModal(false)} 
            />
            <DesactivateModal 
                show={showDeactivatedModal} 
                onClose={() => setShowDeactivatedModal(false)} 
            />
        </>
    )
}

export default InputComment
