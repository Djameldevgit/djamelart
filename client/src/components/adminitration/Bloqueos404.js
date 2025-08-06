import React, { useEffect, useState } from 'react';
import { 
  Container,
  Card,
  Alert,
  ListGroup,
  Badge,
  Row,
  Col,
  Button,
  Modal,
  Form
} from 'react-bootstrap';
import { ClockHistory, ExclamationTriangle, PersonLock, CalendarEvent, Envelope, Telephone } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Bloqueos404 = () => {
    const { auth, userBlockReducer, languageReducer } = useSelector(state => state);
    const { t } = useTranslation('aplicacion');
    const lang = languageReducer.language || 'en';
    const user = auth.user;
    
    const isRTL = lang === 'ar';
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactMessage, setContactMessage] = useState('');
    const [userEmail, setUserEmail] = useState(user.email || '');
    useEffect(() => {
        setUserEmail(user.email || '');
      }, [user]);
      
    useEffect(() => {
        document.body.dir = isRTL ? 'rtl' : 'ltr';
        return () => { document.body.dir = 'ltr'; };
    }, [isRTL]);

    const esBloqueado = userBlockReducer.blockedUsers.some(
        blockedUser => blockedUser.user._id === user._id && blockedUser.esBloqueado
    );
    
    const blockedUserData = userBlockReducer.blockedUsers.find(
        blockedUser => blockedUser.user._id === user._id
    );

    const handleContactSupport = () => {
        setShowContactModal(true);
    };

    const handleCloseContactModal = () => {
        setShowContactModal(false);
        setContactMessage('');
    };

    const yourContactInfo = {
        email: "artealger2020argelia@gmail.com",
        phone: "+213 658 556 296"
    };
    
    const handleSubmitContact = async (e) => {
        e.preventDefault();
        
        if (!contactMessage.trim()) {
            alert(t('messageRequired', { lng: lang }));
            return;
        }
    
        try {
            // Aquí iría la llamada a tu API para enviar el mensaje
            await fetch('/api/contact-support-block', {

                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: auth.token  // si es necesario
                },
                body: JSON.stringify({
                    email: user.email,
                   
                    username: user.username,
                    _id: user._id,
                    blockDate: blockedUserData?.createdAt,
                    blockReason: blockedUserData?.motivo,
                    message: contactMessage,
                    lang: lang
                })
                
                  
              });
              
            
            alert(t('messageSentSuccess', { lng: lang }));
            setContactMessage('');
            handleCloseContactModal();
        } catch (error) {
            console.error("Error al enviar:", error);
            alert(t('messageSentError', { lng: lang }));
        }
    };

    if (!esBloqueado) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Card className="text-center shadow" style={{ width: '100%', maxWidth: '600px' }}>
                    <Card.Header className="bg-primary text-white">
                        <h4 className="mb-0">{t('accountStatus', { lng: lang })}</h4>
                    </Card.Header>
                    <Card.Body>
                        <PersonLock size={48} className="text-success mb-3" />
                        <Card.Title>{t('activeAccount', { lng: lang })}</Card.Title>
                        <Card.Text>
                            {t('noRestrictions', { lng: lang })}
                        </Card.Text>
                        <Button variant="outline-primary" href="/">
                            {t('backToHome', { lng: lang })}
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <>
            <Container className={`py-5 ${isRTL ? 'rtl-container' : ''}`} style={{ maxWidth: '800px' }}>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Card className="shadow-lg border-danger">
                            <Card.Header className={`bg-danger text-white d-flex justify-content-between align-items-center ${isRTL ? 'rtl-header' : ''}`}>
                                <div className="d-flex align-items-center">
                                    <ExclamationTriangle className={isRTL ? 'ms-2' : 'me-2'} />
                                    <strong>{t('blockedAccount', { lng: lang })}</strong>
                                </div>
                                <Badge bg="light" text="dark">
                                    {t('blockSystem', { lng: lang })}
                                </Badge>
                            </Card.Header>
                            
                            <Card.Body className={isRTL ? 'rtl-body' : ''}>
                                <Alert variant="danger" className="d-flex align-items-center">
                                    <ExclamationTriangle size={24} className={isRTL ? 'ms-3' : 'me-3'} />
                                    <div>
                                        {t('accountSuspended', { lng: lang })}
                                    </div>
                                </Alert>
                                
                                <ListGroup variant="flush" className="mb-4">
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold d-flex align-items-center">
                                            <PersonLock className={isRTL ? 'ms-2' : 'me-2'} />
                                            {t('username', { lng: lang })}:
                                        </span>
                                        <span className={isRTL ? 'text-start' : 'text-end'} style={{ minWidth: '50%' }}>
                                            {user.username}
                                        </span>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold d-flex align-items-center">
                                            <ExclamationTriangle className={isRTL ? 'ms-2' : 'me-2'} />
                                            {t('blockReason', { lng: lang })}:
                                        </span>
                                        <span className={isRTL ? 'text-start' : 'text-end'} style={{ minWidth: '50%' }}>
                                            {blockedUserData?.motivo || t('notSpecifiedd', { lng: lang })}
                                        </span>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>
                                        <div className="fw-bold mb-2 d-flex align-items-center">
                                            <ExclamationTriangle className={isRTL ? 'ms-2' : 'me-2'} />
                                            {t('details', { lng: lang })}:
                                        </div>
                                        <div className="text-muted">
                                            {blockedUserData?.content || t('noAdditionalDetails', { lng: lang })}
                                        </div>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold d-flex align-items-center">
                                            <ClockHistory className={isRTL ? 'ms-2' : 'me-2'} />
                                            {t('blockDate', { lng: lang })}:
                                        </span>
                                        <span className={isRTL ? 'text-start' : 'text-end'} style={{ minWidth: '50%' }}>
                                            {new Date(blockedUserData?.createdAt).toLocaleString(lang)}
                                        </span>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold d-flex align-items-center">
                                            <CalendarEvent className={isRTL ? 'ms-2' : 'me-2'} />
                                            {t('expectedUnblock', { lng: lang })}:
                                        </span>
                                        <span className={`${!blockedUserData?.fechaLimite ? 'text-warning' : ''} ${isRTL ? 'text-start' : 'text-end'}`} style={{ minWidth: '50%' }}>
                                            {blockedUserData?.fechaLimite 
                                                ? new Date(blockedUserData.fechaLimite).toLocaleString(lang)
                                                : t('indeterminate', { lng: lang })}
                                        </span>
                                    </ListGroup.Item>
                                </ListGroup>
                                
                                <div className="d-grid gap-2">
                                     
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleContactSupport}
                                        className="position-relative"
                                    >
                                        {t('contactSupport', { lng: lang })}
                                    </Button>
                                </div>
                            </Card.Body>
                            
                            <Card.Footer className="text-muted small d-flex justify-content-between">
                                <span>{t('blockSystemReghaia', { lng: lang })}</span>
                                <span>ID: {user._id.substring(0, 8)}</span>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal de Contacto con Soporte */}
            <Modal 
                show={showContactModal} 
                onHide={handleCloseContactModal}
                centered
            >
                <Modal.Header closeButton className={isRTL ? 'text-right' : ''}>
                    <Modal.Title>
                        <ExclamationTriangle className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('contactSupport', { lng: lang })}
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
  <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
    <h5>{t('ourContactInfo', { lng: lang })}</h5>

    <div className="contact-method">
      <Envelope className={isRTL ? 'ms-2' : 'me-2'} />
      <span>{yourContactInfo.email}</span>
    </div>

    <div className="contact-method mt-2">
      <Telephone className={isRTL ? 'ms-2' : 'me-2'} />
      <span>{yourContactInfo.phone}</span>
    </div>
  </div>

  <Form onSubmit={handleSubmitContact}>
    <Form.Group className="mb-3">
      <Form.Label>{t('adminEmail', { lng: lang })}</Form.Label>
      <Form.Control
        type="email"
        value={yourContactInfo.email}
        readOnly
        plaintext
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>{t('yourEmail', { lng: lang })}</Form.Label>
      <Form.Control
        type="email"
        value={userEmail}
        readOnly
      
        required
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>{t('yourMessage', { lng: lang })}</Form.Label>
      <Form.Control
        as="textarea"
        rows={5}
        value={contactMessage}
        onChange={(e) => setContactMessage(e.target.value)}
        placeholder={t('messagePlaceholder', { lng: lang })}
        required
      />
    </Form.Group>

    <div className={`d-flex justify-content-end gap-2 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button variant="secondary" onClick={handleCloseContactModal}>
        {t('cancel', { lng: lang })}
      </Button>
      <Button type="submit" variant="primary" disabled={!contactMessage.trim()}>
        {t('sendMessage', { lng: lang })}
      </Button>
    </div>
  </Form>
</Modal.Body>

            </Modal>
        </>
    );
};

export default Bloqueos404;