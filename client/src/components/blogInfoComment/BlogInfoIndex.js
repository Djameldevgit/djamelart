import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
 
const BlogInfoIndex = () => {
  return (
    <div>
      <Container className="my-5 d-flex justify-content-center">
      <Card className="p-4 shadow rounded" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Acerca de la Aplicación</Card.Title>
          <Row className="g-3">
            <Col xs={12}>
              <Link to="/infoaplicacion">
                <Button variant="primary" className="w-100">
                  ℹ️ Información de la Aplicación
                </Button>
              </Link>
            </Col>
            <Col xs={12}>
              <Link to="/blog">
                <Button variant="secondary" className="w-100">
                  ✍️ Blog del Desarrollador/Artista
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </div>
  )
}

export default BlogInfoIndex

