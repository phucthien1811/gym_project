import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { gymProducts, categories } from '../../data/gymProducts';
import './css/ShopPage.css';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  const handleAddToCart = (product) => {
    addItem(product, 1);
    showSuccess(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = gymProducts.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      return true;
    });

    return filtered;
  }, [selectedCategory, searchQuery, priceRange]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="shop-page">
      <Header />
      
      {/* Hero Banner */}
      <div className="shop-hero">
        <div className="hero-content">
          <h1>Cửa Hàng Thể Thao</h1>
          <p>Khám phá các sản phẩm gym chất lượng cao</p>
        </div>
      </div>
      
      <div className="shop-container">
        <div className="shop-main">
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="filter-section">
              <h3>TÌM KIẾM</h3>
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <h3>DANH MỤC</h3>
              <div className="category-list">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            
          </aside>

          {/* Main Content */}
          <main className="shop-content">
            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>

                    <div className="product-price">
                      <span className="current-price">{formatPrice(product.price)}</span>
                    </div>

                    <div className="product-actions">
                      <button 
                        className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                        title={product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </button>
                      <Link 
                        to={`/shop/product/${product.id}`} 
                        className="view-details-btn"
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-products">
                <h3>😞 Không tìm thấy sản phẩm nào</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Royal <span className="text-brand">Fitness</span> Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ShopPage;
