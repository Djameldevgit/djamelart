import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Shield, Save, ArrowLeft } from 'react-bootstrap-icons';
import { getPrivacySettings, updatePrivacySettings } from '../../redux/actions/privacyAction';
import { useHistory } from 'react-router-dom';

const privacysettings = () => {
    const { auth, privacy, languageReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation('privacy');
    const lang = languageReducer?.language || 'es';

    // Estado inicial seguro
    const initialSettings = {
        profile: 'public',
        posts: 'public',
        followers: 'public',
        following: 'public',
        likes: 'public',
        email: 'private',
        address: 'private',
        mobile: 'private'
    };

    const [settings, setSettings] = useState(initialSettings);
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (auth.token) {
            dispatch(getPrivacySettings(auth.token));
        }
    }, [dispatch, auth.token]);

    useEffect(() => {
        // Esperar a que privacy.privacySettings esté disponible
        if (privacy && privacy.privacySettings && !initialized) {
            setSettings(privacy.privacySettings);
            setInitialized(true);
        }
    }, [privacy, initialized]);

    // Función segura para obtener settings
    const getCurrentSettings = () => {
        return privacy?.privacySettings || initialSettings;
    };

    const handleSettingChange = (category, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        if (auth.token) {
            await dispatch(updatePrivacySettings(settings, auth.token));
        }
        setSaving(false);
    };

    const handleReset = () => {
        setSettings(getCurrentSettings());
    };

    if (!auth.user || !auth.token) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">
                    {t('loginRequired')}
                </Alert>
                <Button variant="primary" onClick={() => history.push('/login')}>
                    Ir al Login
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ 
            direction: lang === 'ar' ? 'rtl' : 'ltr',
            textAlign: lang === 'ar' ? 'right' : 'left'
        }}>
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => history.goBack()}
                        className="d-flex align-items-center mb-3"
                    >
                        <ArrowLeft className={lang === 'ar' ? 'ms-2' : 'me-2'} />
                        {t('back')}
                    </Button>
                    
                    <div className="d-flex align-items-center">
                        <Shield size={32} className="text-primary me-3" />
                        <div>
                            <h1 className="h3 mb-1">{t('privacySettings')}</h1>
                            <p className="text-muted mb-0">{t('privacyDescription')}</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Formulario de Configuración */}
            <Row className="justify-content-center">
                <Col lg={10}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            {privacy?.loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">{t('loading')}</p>
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    {/* Perfil */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">
                                            <i className="fas fa-user me-2 text-primary"></i>
                                            {t('profileVisibility')}
                                        </Form.Label>
                                        <Form.Text className="d-block text-muted mb-2">
                                            {t('profileVisibilityDesc')}
                                        </Form.Text>
                                        <Form.Select 
                                            value={settings.profile || 'public'}
                                            onChange={(e) => handleSettingChange('profile', e.target.value)}
                                        >
                                            <option value="public">{t('public')}</option>
                                            <option value="followers">{t('followersOnly')}</option>
                                            <option value="private">{t('onlyMe')}</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Publicaciones */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">
                                            <i className="fas fa-file-alt me-2 text-info"></i>
                                            {t('postsVisibility')}
                                        </Form.Label>
                                        <Form.Text className="d-block text-muted mb-2">
                                            {t('postsVisibilityDesc')}
                                        </Form.Text>
                                        <Form.Select 
                                            value={settings.posts || 'public'}
                                            onChange={(e) => handleSettingChange('posts', e.target.value)}
                                        >
                                            <option value="public">{t('public')}</option>
                                            <option value="followers">{t('followersOnly')}</option>
                                            <option value="private">{t('onlyMe')}</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Seguidores */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">
                                            <i className="fas fa-users me-2 text-success"></i>
                                            {t('followersVisibility')}
                                        </Form.Label>
                                        <Form.Text className="d-block text-muted mb-2">
                                            {t('followersVisibilityDesc')}
                                        </Form.Text>
                                        <Form.Select 
                                            value={settings.followers || 'public'}
                                            onChange={(e) => handleSettingChange('followers', e.target.value)}
                                        >
                                            <option value="public">{t('public')}</option>
                                            <option value="followers">{t('followersOnly')}</option>
                                            <option value="private">{t('onlyMe')}</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Siguiendo */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">
                                            <i className="fas fa-user-check me-2 text-warning"></i>
                                            {t('followingVisibility')}
                                        </Form.Label>
                                        <Form.Text className="d-block text-muted mb-2">
                                            {t('followingVisibilityDesc')}
                                        </Form.Text>
                                        <Form.Select 
                                            value={settings.following || 'public'}
                                            onChange={(e) => handleSettingChange('following', e.target.value)}
                                        >
                                            <option value="public">{t('public')}</option>
                                            <option value="followers">{t('followersOnly')}</option>
                                            <option value="private">{t('onlyMe')}</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Likes */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">
                                            <i className="fas fa-heart me-2 text-danger"></i>
                                            {t('likesVisibility')}
                                        </Form.Label>
                                        <Form.Text className="d-block text-muted mb-2">
                                            {t('likesVisibilityDesc')}
                                        </Form.Text>
                                        <Form.Select 
                                            value={settings.likes || 'public'}
                                            onChange={(e) => handleSettingChange('likes', e.target.value)}
                                        >
                                            <option value="public">{t('public')}</option>
                                            <option value="followers">{t('followersOnly')}</option>
                                            <option value="private">{t('onlyMe')}</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Información de Contacto */}
                                    <Card className="bg-light border-0 mb-4">
                                        <Card.Header className="bg-transparent border-0">
                                            <h6 className="mb-0 fw-bold">
                                                <i className="fas fa-address-book me-2 text-secondary"></i>
                                                {t('contactInfo')}
                                            </h6>
                                        </Card.Header>
                                        <Card.Body>
                                            {/* Email */}
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    {t('emailVisibility')}
                                                </Form.Label>
                                                <Form.Select 
                                                    value={settings.email || 'private'}
                                                    onChange={(e) => handleSettingChange('email', e.target.value)}
                                                >
                                                    <option value="private">{t('onlyMe')}</option>
                                                    <option value="followers">{t('followersOnly')}</option>
                                                    <option value="public">{t('public')}</option>
                                                </Form.Select>
                                            </Form.Group>

                                            {/* Teléfono */}
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    {t('mobileVisibility')}
                                                </Form.Label>
                                                <Form.Select 
                                                    value={settings.mobile || 'private'}
                                                    onChange={(e) => handleSettingChange('mobile', e.target.value)}
                                                >
                                                    <option value="private">{t('onlyMe')}</option>
                                                    <option value="followers">{t('followersOnly')}</option>
                                                    <option value="public">{t('public')}</option>
                                                </Form.Select>
                                            </Form.Group>

                                            {/* Dirección */}
                                            <Form.Group>
                                                <Form.Label className="fw-bold">
                                                    {t('addressVisibility')}
                                                </Form.Label>
                                                <Form.Select 
                                                    value={settings.address || 'private'}
                                                    onChange={(e) => handleSettingChange('address', e.target.value)}
                                                >
                                                    <option value="private">{t('onlyMe')}</option>
                                                    <option value="followers">{t('followersOnly')}</option>
                                                    <option value="public">{t('public')}</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Card.Body>
                                    </Card>

                                    {/* Botones de Acción */}
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={handleReset}
                                            disabled={saving}
                                        >
                                            {t('reset')}
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={saving}
                                            className="d-flex align-items-center"
                                        >
                                            {saving ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    {t('saving')}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="me-2" />
                                                    {t('saveChanges')}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default privacysettings;