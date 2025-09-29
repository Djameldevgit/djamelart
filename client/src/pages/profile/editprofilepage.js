import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { checkImage } from '../../utils/imageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser, getProfileUsers } from '../../redux/actions/profileAction'
import { Button, Container, Row, Col, Card, Form, Alert } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'

const EditProfilePage = () => {
    const initState = {
        presentacion: '', 
        fullname: '', 
        mobile: '', 
        address: '', 
        email: '', 
        website: '', 
        story: '' 
    }
    const [userData, setUserData] = useState(initState)
    const { presentacion, mobile, email, fullname, address, website, story } = userData

    const [avatar, setAvatar] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const { auth, theme, profile, languageReducer, alert } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const { t } = useTranslation('profileedit')
    const lang = languageReducer?.language || 'es'

    // Verificar que el usuario solo pueda editar su propio perfil
    useEffect(() => {
        if (auth.user?._id && auth.user?._id !== id) {
            history.push(`/profile/${auth.user?._id}/edit`)
        }
    }, [auth.user?._id, id, history])

    useEffect(() => {
        if (auth.user) {
            setUserData(prevState => ({
                ...initState,
                ...auth.user
            }))
        }
    }, [auth.user])

    useEffect(() => {
        if (id && profile.ids?.every(item => item !== id)) {
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
        
        // Limpiar errores cuando el usuario escribe
        if (name === 'email') {
            setEmailError('')
        }
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Validación del formulario
    const validateForm = () => {
        const errors = {}
        
        // Validar email
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            errors.email = t('invalidEmail')
        }
        
        // Validar fullname (requerido)
        if (!fullname?.trim()) {
            errors.fullname = t('fullnameRequired')
        }
        
        // Validar website si existe
        if (website && !/^https?:\/\/.+\..+/.test(website)) {
            errors.website = t('invalidWebsite')
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setEmailError('')
        setFormErrors({})

        // Validar formulario
        if (!validateForm()) {
            setLoading(false)
            return
        }

        try {
            const result = await dispatch(updateProfileUser({ 
                userData: {
                    ...userData,
                    // Asegurar que los campos vacíos se envíen como string vacío
                    presentacion: presentacion || '',
                    mobile: mobile || '',
                    address: address || '',
                    website: website || '',
                    story: story || ''
                }, 
                avatar, 
                auth 
            }))

            // Verificar si la acción fue exitosa
            if (result && result.type === GLOBALTYPES.ALERT) {
                // Si hay un error de email duplicado
                if (result.payload?.error?.toLowerCase().includes('email')) {
                    setEmailError(t('emailAlreadyExists'))
                    setLoading(false)
                    return
                }
            }

            // Si todo sale bien, redirigir después de un breve delay
            setTimeout(() => {
                history.push(`/profile/${id}`)
            }, 1000)

        } catch (error) {
            console.error('Error updating profile:', error)
            
            // Manejar errores específicos
            if (error?.response?.data?.error?.toLowerCase().includes('email')) {
                setEmailError(t('emailAlreadyExists'))
            } else {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: t('updateError') }
                })
            }
            setLoading(false)
        }
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

    // Verificación segura del usuario
    if (!auth.user || !auth.user._id || auth.user._id !== id) {
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

    // Funciones seguras para obtener la longitud
    const getPresentacionLength = () => {
        return presentacion ? presentacion.length : 0
    }

    const getStoryLength = () => {
        return story ? story.length : 0
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
                    {/* Mostrar alertas globales */}
                    {alert.error && (
                        <Alert variant="danger" className="mb-3">
                            {alert.error}
                        </Alert>
                    )}
                    
                    {alert.success && (
                        <Alert variant="success" className="mb-3">
                            {alert.success}
                        </Alert>
                    )}

                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Avatar */}
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar || ''}
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
                                        maxLength={150}
                                        dir={isRTL ? "rtl" : "ltr"}
                                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                                        isInvalid={!!formErrors.presentacion}
                                    />
                                    <Form.Text className="text-muted">
                                        {getPresentacionLength()}/150 {t('characters')}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('fullname')} *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullname"
                                        value={fullname || ''}
                                        onChange={handleInput}
                                        placeholder={t('fullnamePlaceholder')}
                                        dir={isRTL ? "rtl" : "ltr"}
                                        isInvalid={!!formErrors.fullname}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.fullname}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('email')}</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={email || ''}
                                        onChange={handleInput}
                                        placeholder={t('emailPlaceholder')}
                                        dir={isRTL ? "rtl" : "ltr"}
                                        isInvalid={!!emailError || !!formErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {emailError || formErrors.email}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!formErrors.address}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('mobile')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mobile"
                                        value={mobile || ''}
                                        onChange={handleInput}
                                        placeholder={t('mobilePlaceholder')}
                                        dir={isRTL ? "rtl" : "ltr"}
                                        isInvalid={!!formErrors.mobile}
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
                                        dir="ltr"
                                        isInvalid={!!formErrors.website}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.website}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!formErrors.story}
                                    />
                                    <Form.Text className="text-muted">
                                        {getStoryLength()}/200 {t('characters')}
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                {t('saving')}
                                            </>
                                        ) : (
                                            t('saveChanges')
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleBack}
                                        disabled={loading}
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