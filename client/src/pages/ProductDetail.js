import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <div>Product not found</div>;

  return (
    <Container>
      <Button as={Link} to="/products" variant="outline-secondary" className="mb-4">
        ← Back to Products
      </Button>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Img 
              variant="top" 
              src={product.image} 
              style={{ height: '400px', objectFit: 'contain' }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="h2">{product.name}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Category: {product.category}
              </Card.Subtitle>
              <Card.Text className="h4 text-primary mb-4">
                ${product.price}
              </Card.Text>
              <Card.Text>
                {product.description}
              </Card.Text>
              
              <div className="mb-3">
                <strong>Stock: </strong>
                <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
                {user?.role === 'admin' && (
                  <Button 
                    as={Link}
                    to="/admin"
                    variant="outline-warning"
                  >
                    Edit Product (Admin)
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;