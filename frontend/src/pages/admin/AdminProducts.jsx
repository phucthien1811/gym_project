import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './css/AdminProducts.css'; // File CSS mới

const mockProducts = [
    { id: 1, name: "Whey Protein Gold Standard", category: "Protein", price: 1850000, stock: 50, image: "https://placehold.co/300x300/374151/FFFFFF?text=Whey" },
    { id: 2, name: "BCAA Xtend", category: "Phục hồi", price: 650000, stock: 120, image: "https://placehold.co/300x300/374151/FFFFFF?text=BCAA" },
    { id: 3, name: "Găng tay tập gym", category: "Phụ kiện", price: 250000, stock: 85, image: "https://placehold.co/300x300/374151/FFFFFF?text=Glove" },
    { id: 4, name: "Creatine Monohydrate", category: "Tăng sức mạnh", price: 450000, stock: 0, image: "https://placehold.co/300x300/374151/FFFFFF?text=Creatine" },
];

export default function AdminProducts() {
    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản Lý Sản Phẩm</h2>
                <div className="admin-page-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input type="text" placeholder="Tìm sản phẩm..." />
                    </div>
                    <button className="btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm Sản Phẩm</span>
                    </button>
                </div>
            </div>

            <div className="products-grid">
                {mockProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-wrapper">
                            <img src={product.image} alt={product.name} />
                            {product.stock === 0 && <div className="out-of-stock-badge">Hết Hàng</div>}
                        </div>
                        <div className="product-info">
                            <span className="product-category">{product.category}</span>
                            <h3 className="product-name">{product.name}</h3>
                            <div className="product-footer">
                                <span className="product-price">{product.price.toLocaleString('vi-VN')}đ</span>
                                <span className="product-stock">Tồn kho: {product.stock}</span>
                            </div>
                        </div>
                        <div className="product-actions">
                            <button className="action-btn btn-edit"><FontAwesomeIcon icon={faPen} /></button>
                            <button className="action-btn btn-delete"><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
