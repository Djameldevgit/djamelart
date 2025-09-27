import React, { useEffect, useState } from 'react'
import Info from '../../components/profile/Info'

import Posts from '../../components/profile/Posts'
import Saved from '../../components/profile/Saved'
import { useSelector, useDispatch } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import { getProfileUsers } from '../../redux/actions/profileAction'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap'
import {
    Grid3x3Gap,
    Bookmark,Gear,
    PersonLinesFill
} from 'react-bootstrap-icons'

const Profile = () => {
    const { profile, auth, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const { t } = useTranslation('profile')
    const history = useHistory()
    const lang = languageReducer?.language || 'en'

    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('posts')

    useEffect(() => {
        if (profile.ids.every(item => item !== id)) {
            dispatch(getProfileUsers({ id, auth }))
        }
    }, [id, auth, dispatch, profile.ids])

    const isCurrentUser = auth.user._id === id;

    // Función para redirigir a la página de edición
    const handleEditProfile = () => {
        history.push(`/profile/${id}/privacysettings`)
    }

    // Función para redirigir a la página de información
    const handleProfileInfo = () => {
        history.push(`/profile/${id}/infouser`)
    }

    return (
        <div className="profile">

            <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

            {/* Barra de pestañas */}
            <div className="profile_tab mb-2">
                <div className="d-flex justify-content-center">
                    <ButtonGroup className="flex-nowrap overflow-auto py-1" role="group" style={{ maxWidth: '100vw' }}>
                        {/* Posts */}
                        <Button
                            variant={activeTab === 'posts' ? 'dark' : 'outline-dark'}
                            onClick={() => setActiveTab('posts')}
                            className="d-flex flex-column align-items-center px-3 px-sm-4"
                            size="sm"
                        >
                            <Grid3x3Gap size={22} className="mb-1" />
                            <span className="d-none d-lg-block small fw-medium">{t('posts', { lng: lang })}</span>
                        </Button>

                        {/* Saved Posts - Solo usuario actual */}
                        {isCurrentUser && (
                            <Button
                                variant={activeTab === 'saved' ? 'dark' : 'outline-dark'}
                                onClick={() => setActiveTab('saved')}
                                className="d-flex flex-column align-items-center px-3 px-sm-4"
                                size="sm"
                            >
                                <Bookmark size={20} className="mb-1" />
                                <span className="d-none d-lg-block small fw-medium">{t('saved', { lng: lang })}</span>
                            </Button>
                        )}

                        {/* Edit Profile - Solo usuario actual - REDIRIGE A PÁGINA */}
                        {isCurrentUser && (
                            <Button
                                variant={activeTab === 'edit' ? 'dark' : 'outline-dark'}
                                onClick={() => {
                                    setActiveTab('edit')
                                    handleEditProfile() // Redirige a la página de edición
                                }}
                                className="d-flex flex-column align-items-center px-3 px-sm-4"
                                size="sm"
                            >
                                <Gear size={20} className="mb-1" />
                                <span className="d-none d-lg-block small fw-medium">
                                    {t('privacy_settings', { lng: lang })}
                                </span>
                            </Button>
                        )}


                        {/* Profile Info - Solo usuario actual - REDIRIGE A PÁGINA */}
                        {isCurrentUser && (
                            <Button
                                variant={activeTab === 'profile_info' ? 'dark' : 'outline-dark'}
                                onClick={() => {
                                    setActiveTab('profile_info')
                                    handleProfileInfo() // Redirige a la página de información
                                }}
                                className="d-flex flex-column align-items-center px-3 px-sm-4"
                                size="sm"
                            >
                                <PersonLinesFill size={20} className="mb-1" />
                                <span className="d-none d-lg-block small fw-medium">{t('profile_info', { lng: lang })}</span>
                            </Button>
                        )}
                    </ButtonGroup>
                </div>
            </div>

            {profile.loading ? (
                <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
            ) : (
                <div className="profile-content">
                    {isCurrentUser ? (
                        <Row>
                            {/* Posts - Solo se muestra en la página de perfil */}
                            <Col xs={12} className={activeTab !== 'posts' ? 'd-none' : ''}>
                                <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                            </Col>

                            {/* Saved Posts - Solo se muestra en la página de perfil */}
                            <Col xs={12} className={activeTab !== 'saved' ? 'd-none' : ''}>
                                <Saved auth={auth} dispatch={dispatch} />
                            </Col>

                            {/* NOTA: ProfileInfo ya no se muestra aquí, se redirige a página separada */}
                            {/* Solo mostramos un mensaje si por alguna razón no se redirige */}
                            <Col xs={12} className={activeTab !== 'profile_info' ? 'd-none' : ''}>
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Redirigiendo a la información del perfil...</p>
                                    <Button
                                        variant="primary"
                                        onClick={handleProfileInfo}
                                    >
                                        Ir a Información del Perfil
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        // Para otros usuarios - Solo pueden ver posts
                        <Row>
                            <Col xs={12}>
                                <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                            </Col>
                        </Row>
                    )}
                </div>
            )}
        </div>
    )
}

export default Profile