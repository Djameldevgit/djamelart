import React from "react";
import { 
  Container, 
  Card, 
  ListGroup,
  Badge
} from "react-bootstrap";
import { 
  GearFill, 
  LightningFill, 
  Database, 
  ShieldLock, 
  Image, 
  PersonPlus, 
  HouseDoor, 
  Search, 
  ChatDots, 
  PersonCircle 
} from "react-bootstrap-icons";

const InfoAplicacion = () => {
  return (
    <Container className="my-5">
      {/* Titre principal */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">
          À propos de notre application
        </h1>
        <p className="lead text-muted">
          Découvrez les technologies et fonctionnalités qui alimentent notre plateforme
        </p>
      </div>

      {/* Section : Comment est-elle construite ? */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0 d-flex align-items-center">
            <GearFill className="me-2" />
            Comment notre application est-elle construite ?
          </h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Notre plateforme utilise la stack technologique <Badge bg="info">MERN</Badge>, qui associe 
            des technologies modernes pour offrir des performances optimales.
          </Card.Text>
          
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex align-items-start">
              <LightningFill className="text-warning me-3 mt-1" size={20} />
              <div>
                <strong>Frontend - React.js :</strong> Expérience rapide et interactive avec Redux.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <LightningFill className="text-warning me-3 mt-1" size={20} />
              <div>
                <strong>Backend - Node.js et Express.js :</strong> Gestion des requêtes et sécurité.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <Database className="text-success me-3 mt-1" size={20} />
              <div>
                <strong>Base de données - MongoDB :</strong> Stockage efficace des propriétés et utilisateurs.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <ShieldLock className="text-danger me-3 mt-1" size={20} />
              <div>
                <strong>Authentification - JWT :</strong> Protection des données avec des tokens de sécurité.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <Image className="text-info me-3 mt-1" size={20} />
              <div>
                <strong>Cloudinary :</strong> Gestion optimisée des images des propriétés.
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Section : Comment fonctionne-t-elle ? */}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0 d-flex align-items-center">
            <GearFill className="me-2" />
            Comment fonctionne notre application ?
          </h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Notre application est conçue pour être intuitive et efficace pour les acheteurs et les vendeurs.
          </Card.Text>
          
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex align-items-start">
              <PersonPlus className="text-primary me-3 mt-1" size={20} />
              <div>
                <strong>Inscription et Connexion :</strong> Accédez en toute sécurité à votre compte.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <HouseDoor className="text-success me-3 mt-1" size={20} />
              <div>
                <strong>Publication des Propriétés :</strong> Ajoutez vos annonces avec photos et détails.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <Search className="text-info me-3 mt-1" size={20} />
              <div>
                <strong>Recherche et Filtres :</strong> Trouvez des propriétés selon leur emplacement et prix.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <ChatDots className="text-warning me-3 mt-1" size={20} />
              <div>
                <strong>Contact avec les Propriétaires :</strong> Envoyez des messages directement depuis la plateforme.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <PersonCircle className="text-danger me-3 mt-1" size={20} />
              <div>
                <strong>Gestion du Profil :</strong> Modifiez vos informations et administrez vos publications.
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InfoAplicacion;
