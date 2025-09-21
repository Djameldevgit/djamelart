import React, { useState, useEffect } from 'react'
import Avatar from '../Avatar'
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import AuthModal from '../authAndVerify/AuthModal';
import VerifyModal from '../authAndVerify/VerifyModal';
import DesactivateModal from '../authAndVerify/DesactivateModal';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  Github,
  Pinterest,
  Snapchat,
  
  Whatsapp,
  Telegram
} from 'react-bootstrap-icons';

const Info = ({id, auth, profile, dispatch}) => {
    const [userData, setUserData] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
    
    const { languageReducer } = useSelector(state => state)
    const { t } = useTranslation('profile')
    const lang = languageReducer?.language || 'en'

    useEffect(() => {
        if(id === auth.user._id){
            setUserData([auth.user])
        }else{
            const newData = profile.users.filter(user => user._id === id)
            setUserData(newData)
        }
    }, [id, auth, dispatch, profile.users])

    useEffect(() => {
        if(showFollowers || showFollowing || onEdit){
            dispatch({ type: GLOBALTYPES.MODAL, payload: true})
        }else{
            dispatch({ type: GLOBALTYPES.MODAL, payload: false})
        }
    },[showFollowers, showFollowing, onEdit, dispatch])

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

    const handleEditProfile = () => {
        if (!canProceed()) return;
        setOnEdit(true);
    };

    const handleShowFollowers = () => {
        if (!canProceed()) return;
        setShowFollowers(true);
    };

    const handleShowFollowing = () => {
        if (!canProceed()) return;
        setShowFollowing(true);
    };

    // Función para renderizar iconos de redes sociales
    const renderSocialIcon = (platform, url) => {
        if (!url) return null;
        
        const socialIcons = {
            facebook: <Facebook className="me-1" />,
            instagram: <Instagram className="me-1" />,
            twitter: <Twitter className="me-1" />,
            youtube: <Youtube className="me-1" />,
            linkedin: <Linkedin className="me-1" />,
            github: <Github className="me-1" />,
            pinterest: <Pinterest className="me-1" />,
            snapchat: <Snapchat className="me-1" />,
            tiktok: <TikTok className="me-1" />,
            whatsapp: <Whatsapp className="me-1" />,
            telegram: <Telegram className="me-1" />,
            website: <Globe className="me-1" />
        };

        return socialIcons[platform] || <Globe className="me-1" />;
    };

    // Función para formatear URLs de redes sociales
    const formatSocialUrl = (url, platform) => {
        if (!url) return '';
        
        // Si ya tiene http, devolver tal cual
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        // Agregar https:// si no lo tiene
        return `https://${url}`;
    };

    // Función para obtener nombre de plataforma
    const getPlatformName = (platform) => {
        const platformNames = {
            facebook: 'Facebook',
            instagram: 'Instagram',
            twitter: 'Twitter / X',
            youtube: 'YouTube',
            linkedin: 'LinkedIn',
            github: 'GitHub',
            pinterest: 'Pinterest',
            snapchat: 'Snapchat',
            tiktok: 'TikTok',
            whatsapp: 'WhatsApp',
            telegram: 'Telegram',
            website: 'Sitio web'
        };
        
        return platformNames[platform] || platform;
    };

    return (
        <div className="info">
            {userData.map(user => (
                <div className="info_container" key={user._id}>
                    <Avatar src={user.avatar} size="supper-avatar" />

                    <div className="info_content">
                        <div className="info_content_title">
                            <h2>{user.username}</h2>
                            {
                                user._id === auth.user._id
                                ? <button className="btn btn-outline-info"
                                    onClick={handleEditProfile}>
                                    {t('editProfile', { lng: lang })}
                                </button>
                                : <FollowBtn user={user} />
                            }
                        </div>

                        <div className="follow_btn">
                            <span className="mr-4" onClick={handleShowFollowers}>
                                {user.followers.length} {t('followers', { lng: lang })}
                            </span>
                            <span className="ml-4" onClick={handleShowFollowing}>
                                {user.following.length} {t('following', { lng: lang })}
                            </span>
                        </div>

                        <h6>{user.username} {user.mobile && <span className="text-danger">{user.mobile}</span>}</h6>
                        {user.address && <p className="m-0">{user.address}</p>}
                        {user.email && <h6 className="m-0">{user.email}</h6>}
                        
                        {/* Información de contacto y redes sociales */}
                        <div className="social-info mt-3">
                            {/* Website principal */}
                            {user.website && (
                                <div className="social-item mb-2">
                                    <a 
                                        href={formatSocialUrl(user.website, 'website')} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none text-primary d-flex align-items-center"
                                    >
                                        {renderSocialIcon('website', user.website)}
                                        {getPlatformName('website')}
                                    </a>
                                </div>
                            )}
                            
                            {/* Redes sociales desde user.socialLinks (si existe) */}
                            {user.socialLinks && Object.entries(user.socialLinks).map(([platform, url]) => (
                                url && (
                                    <div className="social-item mb-2" key={platform}>
                                        <a 
                                            href={formatSocialUrl(url, platform)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-none text-primary d-flex align-items-center"
                                        >
                                            {renderSocialIcon(platform, url)}
                                            {getPlatformName(platform)}
                                        </a>
                                    </div>
                                )
                            ))}
                            
                            {/* Redes sociales individuales (backward compatibility) */}
                            {user.facebook && (
                                <div className="social-item mb-2">
                                    <a 
                                        href={formatSocialUrl(user.facebook, 'facebook')} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none text-primary d-flex align-items-center"
                                    >
                                        {renderSocialIcon('facebook', user.facebook)}
                                        Facebook
                                    </a>
                                </div>
                            )}
                            
                            {user.instagram && (
                                <div className="social-item mb-2">
                                    <a 
                                        href={formatSocialUrl(user.instagram, 'instagram')} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none text-primary d-flex align-items-center"
                                    >
                                        {renderSocialIcon('instagram', user.instagram)}
                                        Instagram
                                    </a>
                                </div>
                            )}
                            
                            {user.twitter && (
                                <div className="social-item mb-2">
                                    <a 
                                        href={formatSocialUrl(user.twitter, 'twitter')} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none text-primary d-flex align-items-center"
                                    >
                                        {renderSocialIcon('twitter', user.twitter)}
                                        Twitter / X
                                    </a>
                                </div>
                            )}
                        </div>

                        {user.story && (
                            <div className="mt-3">
                                <h6 className="mb-2">{t('about', { lng: lang })}</h6>
                                <p className="text-muted">{user.story}</p>
                            </div>
                        )}
                    </div>

                    {onEdit && <EditProfile setOnEdit={setOnEdit} user={user} />}
                    {showFollowers && <Followers users={user.followers} setShowFollowers={setShowFollowers} />}
                    {showFollowing && <Following users={user.following} setShowFollowing={setShowFollowing} />}

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
                </div>
            ))}
        </div>
    )
}

export default Info