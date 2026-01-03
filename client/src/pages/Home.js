import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <Container>
      <div className="text-center my-5">
        <h1>Welcome to MERN Store</h1>
        <p className="lead">Your one-stop shop for all your needs</p>
        
        <div className="my-4">
          <Button as={Link} to="/products" variant="primary" size="lg" className="me-3">
            Browse Products
          </Button>
          <Button as={Link} to="/register" variant="outline-primary" size="lg">
            Join Now
          </Button>
        </div>
      </div>

      <Row className="my-5">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>🛒 Easy Shopping</Card.Title>
              <Card.Text>
                Browse through our wide selection of products with an intuitive interface.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>🔐 Secure Login</Card.Title>
              <Card.Text>
                Create your account and manage your profile securely.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>⚡ Fast Delivery</Card.Title>
              <Card.Text>
                Quick and reliable delivery to your doorstep.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;