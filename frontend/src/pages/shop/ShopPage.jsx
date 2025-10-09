import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { gymProducts, categories, sortOptions } from '../../data/gymProducts';
import '../../styles/ShopPage.css';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product, 1);
    // Show success message or animation here
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

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery, priceRange]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="shop-page">
      <Header />
      
      <div className="shop-container">
        <div className="shop-main">
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="filter-section">
              <h3>🔍 Tìm kiếm</h3>
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <h3>📂 Danh mục</h3>
              <div className="category-list">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            
          </aside>

          {/* Main Content */}
          <main className="shop-content">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <div className="results-info">
                <span>{filteredProducts.length} sản phẩm</span>
              </div>
              <div className="sort-controls">
                <label>Sắp xếp:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {!product.inStock && <div className="out-of-stock">Hết hàng</div>}
                    {product.originalPrice > product.price && (
                      <div className="discount-badge">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">
                        {product.rating} ({product.reviews} đánh giá)
                      </span>
                    </div>

                    <div className="product-tags">
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>

                    <div className="product-price">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>

                    <div className="product-actions">
                      <button 
                        className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        {product.inStock ? '🛒 Thêm vào giỏ' : '❌ Hết hàng'}
                      </button>
                      <Link to={`/shop/product/${product.id}`} className="view-details-btn">
                        👁️ Chi tiết
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
