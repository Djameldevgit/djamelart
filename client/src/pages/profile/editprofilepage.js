import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { checkImage } from '../../utils/imageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser, getProfileUsers } from '../../redux/actions/profileAction'
import { Button, Container, Row, Col, Card, Form } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'

const EditProfilePage = () => {
    const initState = {
        presentacion: '',  mobile: '', address: '', website: '', story: '' 
    }
    const [userData, setUserData] = useState(initState)
    const {presentacion, mobile, address, website, story  } = userData

    const [avatar, setAvatar] = useState('')
    const [loading, setLoading] = useState(false)

    const { auth, theme, profile, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const { t } = useTranslation('profileedit')
    const lang = languageReducer?.language || 'es'

    // Verificar que el usuario solo pueda editar su propio perfil
    useEffect(() => {
        if (auth.user._id !== id) {
            history.push(`/profile/${auth.user._id}/edit`)
        }
    }, [auth.user._id, id, history])

    useEffect(() => {
        if (auth.user) {
            setUserData(auth.user)
        }
    }, [auth.user])

    useEffect(() => {
        if (profile.ids.every(item => item !== id)) {
            dispatch(getProfileUsers({ id, auth }))
        }
    }, [id, auth, dispatch, profile.ids])

    const changeAvatar = (e) => {
        const file = e.target.files[0]

        const err = checkImage(file)
        if (err) return dispatch({
            type: GLOBALTYPES.ALERT, payload: { error: err }
        })

        setAvatar(file)
    }

    const handleInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)

        await dispatch(updateProfileUser({ userData, avatar, auth }))

        setLoading(false)
        // Redirigir al perfil después de guardar
        history.push(`/profile/${id}`)
    }

    const handleBack = () => {
        history.push(`/profile/${id}`)
    }

    // Estilos para RTL (árabe)
    const isRTL = lang === 'ar'
    const containerStyle = {
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left'
    }

    if (auth.user._id !== id) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '60vh', ...containerStyle }}
            >
                <div className="text-center">
                    <h4>{t('accessDenied')}</h4>
                    <Button variant="primary" onClick={handleBack}>
                        {t('backToProfile')}
                    </Button>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-5" style={containerStyle}>
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={handleBack}
                        className="d-flex align-items-center"
                    >
                        <ArrowLeft className={isRTL ? "ms-2" : "me-2"} />
                        {t('backToProfile')}
                    </Button>
                    <h1 className="h3 mt-3">{t('editProfile')}</h1>
                    <p className="text-muted">{t('updatePersonalInfo')}</p>
                </Col>
            </Row>

            {/* Formulario */}
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Avatar */}
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                filter: theme ? 'invert(1)' : 'invert(0)'
                                            }}
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="fas fa-camera" />
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            onChange={changeAvatar}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <small className="text-muted">{t('changeAvatarHint')}</small>
                                    </div>
                                </div>


                                <Form.Group className="mb-3">
                                    <Form.Label>{t('presentacion')}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="presentacion"
                                        value={presentacion || ''}
                                        onChange={handleInput}
                                        placeholder={t('presentacion')}
                                        maxLength={200}
                                        dir={isRTL ? "rtl" : "ltr"}
                                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                                    />
                                    <Form.Text className="text-muted">
                                        {presentacion?.length || 0}/150 {t('characters')}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('address')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={address || ''}
                                        onChange={handleInput}
                                        placeholder={t('addressPlaceholder')}
                                        dir={isRTL ? "rtl" : "ltr"}
                                    />
                                </Form.Group>
                                {/* Campos del formulario */}
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('mobile')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mobile"
                                        value={mobile || ''}
                                        onChange={handleInput}
                                        placeholder={t('mobilePlaceholder')}
                                        dir={isRTL ? "rtl" : "ltr"}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('website')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="website"
                                        value={website || ''}
                                        onChange={handleInput}
                                        placeholder={t('websitePlaceholder')}
                                        dir="ltr" // Siempre LTR para URLs
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('bio')}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="story"
                                        value={story || ''}
                                        onChange={handleInput}
                                        placeholder={t('bioPlaceholder')}
                                        maxLength={200}
                                        dir={isRTL ? "rtl" : "ltr"}
                                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                                    />
                                    <Form.Text className="text-muted">
                                        {story?.length || 0}/200 {t('characters')}
                                    </Form.Text>
                                </Form.Group>


                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? t('saving') : t('saveChanges')}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleBack}
                                    >
                                        {t('cancel')}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default EditProfilePage