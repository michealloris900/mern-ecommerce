import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    // Implement cart functionality here
    alert(`Added ${product.name} to cart`);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        {user?.role === 'admin' && (
          <Button as={Link} to="/admin" variant="success">
            Manage Products
          </Button>
        )}
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Select>
        </div>
      </div>

      <Row>
        {filteredProducts.map(product => (
          <Col key={product._id} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={product.image} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="text-muted">
                  {product.description.substring(0, 60)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 mb-0">${product.price}</span>
                  <div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      as={Link}
                      to={`/products/${product._id}`}
                    >
                      View
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="ms-2"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    Category: {product.category} | Stock: {product.stock}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <h4>No products found</h4>
          <p>Try different search terms or categories</p>
        </div>
      )}
    </div>
  );
};

export default Products;