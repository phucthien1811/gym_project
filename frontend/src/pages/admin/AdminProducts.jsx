import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faPen, 
    faTrash, 
    faSearch, 
    faEye, 
    faEyeSlash,
    faInfo,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminProducts.css';

const mockProducts = [
    { 
        id: 1, 
        name: "Whey Protein Gold Standard", 
        category: "Thực phẩm bổ sung", 
        description: "Protein whey cao cấp từ Optimum Nutrition, hỗ trợ tăng cơ hiệu quả",
        price: 1850000, 
        stock: 50, 
        image_url: "https://placehold.co/300x300/374151/FFFFFF?text=Whey",
        status: "Còn hàng",
        visibility: "Hiển thị"
    },
    { 
        id: 2, 
        name: "BCAA Xtend", 
        category: "Thực phẩm bổ sung", 
        description: "Axit amin thiết yếu hỗ trợ phục hồi cơ bắp sau tập luyện",
        price: 650000, 
        stock: 120, 
        image_url: "https://placehold.co/300x300/374151/FFFFFF?text=BCAA",
        status: "Còn hàng",
        visibility: "Hiển thị"
    },
    { 
        id: 3, 
        name: "Găng tay tập gym", 
        category: "Phụ kiện", 
        description: "Găng tay chống trượt, bảo vệ bàn tay khi tập luyện với tạ",
        price: 250000, 
        stock: 5, 
        image_url: "https://placehold.co/300x300/374151/FFFFFF?text=Glove",
        status: "Sắp hết",
        visibility: "Hiển thị"
    },
    { 
        id: 4, 
        name: "Creatine Monohydrate", 
        category: "Thực phẩm bổ sung", 
        description: "Tăng sức mạnh và độ bền trong tập luyện cường độ cao",
        price: 450000, 
        stock: 0, 
        image_url: "https://placehold.co/300x300/374151/FFFFFF?text=Creatine",
        status: "Hết hàng",
        visibility: "Ẩn"
    },
    { 
        id: 5, 
        name: "Áo tank top gym", 
        category: "Trang phục", 
        description: "Áo tank top thoáng khí, co giãn tốt cho việc tập luyện",
        price: 350000, 
        stock: 30, 
        image_url: "https://placehold.co/300x300/374151/FFFFFF?text=Tank",
        status: "Còn hàng",
        visibility: "Hiển thị"
    },
    { 
        id: 6, 
        name: "Máy tập tay kéo", 
        category: "Thiết bị", 
        description: "Thiết bị tập luyện cơ tay và vai tại nhà",
        price: 1200000, 
        stock: 8, 
        image_url: "https://placehold.co/300x300/374151/FFFFFF?text=Pull",
        status: "Còn hàng",
        visibility: "Hiển thị"
    },
];

export default function AdminProducts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Thực phẩm bổ sung',
        description: '',
        price: 0,
        stock: 0,
        image_url: '',
        status: 'Còn hàng',
        visibility: 'Hiển thị'
    });

    const getCategoryClass = (category) => {
        switch(category) {
            case 'Thực phẩm bổ sung': return 'ap-category-supplement';
            case 'Thiết bị': return 'ap-category-equipment';
            case 'Trang phục': return 'ap-category-clothing';
            case 'Phụ kiện': return 'ap-category-accessories';
            default: return 'ap-category-supplement';
        }
    };

    const getStockClass = (stock) => {
        if (stock === 0) return 'ap-stock-out';
        if (stock < 10) return 'ap-stock-low';
        return 'ap-stock-in';
    };

    const getStockText = (stock) => {
        if (stock === 0) return 'Hết hàng';
        if (stock < 10) return `${stock} (Sắp hết)`;
        return stock.toString();
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Còn hàng': return 'ap-status-available';
            case 'Hết hàng': return 'ap-status-out-of-stock';
            case 'Sắp hết': return 'ap-status-low';
            default: return 'ap-status-available';
        }
    };

    const getVisibilityClass = (visibility) => {
        return visibility === 'Hiển thị' ? 'ap-status-visible' : 'ap-status-hidden';
    };

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditingProduct(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
            }));
        } else {
            setNewProduct(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
            }));
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        console.log('Adding product:', newProduct);
        alert('Thêm sản phẩm thành công!');
        setNewProduct({
            name: '',
            category: 'Thực phẩm bổ sung',
            description: '',
            price: 0,
            stock: 0,
            image_url: '',
            status: 'Còn hàng',
            visibility: 'Hiển thị'
        });
        setShowAddModal(false);
    };

    const handleEditClick = (product) => {
        setEditingProduct({ ...product });
        setShowEditModal(true);
    };

    const handleUpdateProduct = () => {
        if (!editingProduct.name || !editingProduct.price) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        console.log('Updating product:', editingProduct);
        alert('Cập nhật sản phẩm thành công!');
        setShowEditModal(false);
        setEditingProduct(null);
    };

    const handleViewClick = (product) => {
        setViewingProduct(product);
        setShowViewModal(true);
    };

    return (
        <div className="ap-admin-page-container">
            <div className="ap-admin-page-header">
                <h2 className="ap-admin-page-title">Quản Lý Sản Phẩm</h2>
                <div className="ap-admin-page-actions">
                    <div className="ap-search-bar">
                        <FontAwesomeIcon icon={faSearch} className="ap-search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm sản phẩm..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="ap-btn-primary" onClick={() => setShowAddModal(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm Sản Phẩm</span>
                    </button>
                </div>
            </div>

            <div className="ap-products-table-container">
                <table className="ap-products-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Danh Mục</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Số Lượng</th>
                            <th>Trạng Thái</th>
                            <th>Hiển Thị</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td className="ap-product-image-cell">
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name}
                                        className="ap-product-image-preview"
                                    />
                                </td>
                                <td className="ap-product-name-cell" title={product.name}>
                                    {product.name}
                                </td>
                                <td>
                                    <span className={`ap-category-badge ${getCategoryClass(product.category)}`}>
                                        {product.category}
                                    </span>
                                </td>
                                <td className="ap-product-description" title={product.description}>
                                    {product.description}
                                </td>
                                <td className="ap-product-price-cell">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="ap-stock-cell">
                                    <span className={`ap-stock-badge ${getStockClass(product.stock)}`}>
                                        {getStockText(product.stock)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`ap-status-badge ${getStatusClass(product.status)}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`ap-status-badge ${getVisibilityClass(product.visibility)}`}>
                                        {product.visibility}
                                    </span>
                                </td>
                                <td className="ap-actions-cell">
                                    <div className="ap-action-buttons">
                                        <button className="ap-action-btn ap-btn-view" title="Xem chi tiết" onClick={() => handleViewClick(product)}>
                                            <FontAwesomeIcon icon={faInfo} />
                                        </button>
                                        <button className="ap-action-btn ap-btn-edit" title="Chỉnh sửa" onClick={() => handleEditClick(product)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button className="ap-action-btn ap-btn-toggle" title="Ẩn/Hiện">
                                            <FontAwesomeIcon icon={product.visibility === 'Hiển thị' ? faEyeSlash : faEye} />
                                        </button>
                                        <button className="ap-action-btn ap-btn-delete" title="Xóa">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Thêm Sản Phẩm */}
            {showAddModal && (
                <div className="ap-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="ap-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h3>Thêm Sản Phẩm Mới</h3>
                            <button className="ap-modal-close-btn" onClick={() => setShowAddModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="ap-modal-body">
                            <div className="ap-form-grid">
                                <div className="ap-form-group">
                                    <label>Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={(e) => handleInputChange(e, false)}
                                        placeholder="Nhập tên sản phẩm"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Danh mục *</label>
                                    <select
                                        name="category"
                                        value={newProduct.category}
                                        onChange={(e) => handleInputChange(e, false)}
                                    >
                                        <option value="Thực phẩm bổ sung">Thực phẩm bổ sung</option>
                                        <option value="Thiết bị">Thiết bị</option>
                                        <option value="Trang phục">Trang phục</option>
                                        <option value="Phụ kiện">Phụ kiện</option>
                                    </select>
                                </div>

                                <div className="ap-form-group">
                                    <label>Giá (VNĐ) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={(e) => handleInputChange(e, false)}
                                        placeholder="Nhập giá"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Số lượng *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={newProduct.stock}
                                        onChange={(e) => handleInputChange(e, false)}
                                        placeholder="Nhập số lượng"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Trạng thái</label>
                                    <select
                                        name="status"
                                        value={newProduct.status}
                                        onChange={(e) => handleInputChange(e, false)}
                                    >
                                        <option value="Còn hàng">Còn hàng</option>
                                        <option value="Sắp hết">Sắp hết</option>
                                        <option value="Hết hàng">Hết hàng</option>
                                    </select>
                                </div>

                                <div className="ap-form-group">
                                    <label>Hiển thị</label>
                                    <select
                                        name="visibility"
                                        value={newProduct.visibility}
                                        onChange={(e) => handleInputChange(e, false)}
                                    >
                                        <option value="Hiển thị">Hiển thị</option>
                                        <option value="Ẩn">Ẩn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="ap-form-group">
                                <label>URL hình ảnh</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={newProduct.image_url}
                                    onChange={(e) => handleInputChange(e, false)}
                                    placeholder="Nhập URL hình ảnh"
                                />
                            </div>

                            <div className="ap-form-group">
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={(e) => handleInputChange(e, false)}
                                    placeholder="Nhập mô tả sản phẩm..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="ap-modal-footer">
                            <button className="ap-btn-secondary" onClick={() => setShowAddModal(false)}>
                                Hủy
                            </button>
                            <button className="ap-btn-primary" onClick={handleAddProduct}>
                                Thêm Sản Phẩm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chỉnh Sửa Sản Phẩm */}
            {showEditModal && editingProduct && (
                <div className="ap-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="ap-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h3>Chỉnh Sửa Sản Phẩm</h3>
                            <button className="ap-modal-close-btn" onClick={() => setShowEditModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="ap-modal-body">
                            <div className="ap-form-grid">
                                <div className="ap-form-group">
                                    <label>Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingProduct.name}
                                        onChange={(e) => handleInputChange(e, true)}
                                        placeholder="Nhập tên sản phẩm"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Danh mục *</label>
                                    <select
                                        name="category"
                                        value={editingProduct.category}
                                        onChange={(e) => handleInputChange(e, true)}
                                    >
                                        <option value="Thực phẩm bổ sung">Thực phẩm bổ sung</option>
                                        <option value="Thiết bị">Thiết bị</option>
                                        <option value="Trang phục">Trang phục</option>
                                        <option value="Phụ kiện">Phụ kiện</option>
                                    </select>
                                </div>

                                <div className="ap-form-group">
                                    <label>Giá (VNĐ) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editingProduct.price}
                                        onChange={(e) => handleInputChange(e, true)}
                                        placeholder="Nhập giá"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Số lượng *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={editingProduct.stock}
                                        onChange={(e) => handleInputChange(e, true)}
                                        placeholder="Nhập số lượng"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Trạng thái</label>
                                    <select
                                        name="status"
                                        value={editingProduct.status}
                                        onChange={(e) => handleInputChange(e, true)}
                                    >
                                        <option value="Còn hàng">Còn hàng</option>
                                        <option value="Sắp hết">Sắp hết</option>
                                        <option value="Hết hàng">Hết hàng</option>
                                    </select>
                                </div>

                                <div className="ap-form-group">
                                    <label>Hiển thị</label>
                                    <select
                                        name="visibility"
                                        value={editingProduct.visibility}
                                        onChange={(e) => handleInputChange(e, true)}
                                    >
                                        <option value="Hiển thị">Hiển thị</option>
                                        <option value="Ẩn">Ẩn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="ap-form-group">
                                <label>URL hình ảnh</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={editingProduct.image_url}
                                    onChange={(e) => handleInputChange(e, true)}
                                    placeholder="Nhập URL hình ảnh"
                                />
                            </div>

                            <div className="ap-form-group">
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    value={editingProduct.description}
                                    onChange={(e) => handleInputChange(e, true)}
                                    placeholder="Nhập mô tả sản phẩm..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="ap-modal-footer">
                            <button className="ap-btn-secondary" onClick={() => setShowEditModal(false)}>
                                Hủy
                            </button>
                            <button className="ap-btn-primary" onClick={handleUpdateProduct}>
                                Cập Nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xem Chi Tiết Sản Phẩm */}
            {showViewModal && viewingProduct && (
                <div className="ap-modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="ap-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h3>Chi Tiết Sản Phẩm</h3>
                            <button className="ap-modal-close-btn" onClick={() => setShowViewModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="ap-modal-body">
                            <div className="ap-product-view">
                                <div className="ap-product-image-section">
                                    <img src={viewingProduct.image_url} alt={viewingProduct.name} className="ap-product-full-image" />
                                </div>

                                <div className="ap-product-details-section">
                                    <h4>Thông tin cơ bản</h4>
                                    <div className="ap-detail-row">
                                        <span className="ap-detail-label">Tên sản phẩm:</span>
                                        <span className="ap-detail-value">{viewingProduct.name}</span>
                                    </div>
                                    <div className="ap-detail-row">
                                        <span className="ap-detail-label">Danh mục:</span>
                                        <span className={`ap-category-badge ${getCategoryClass(viewingProduct.category)}`}>
                                            {viewingProduct.category}
                                        </span>
                                    </div>
                                    <div className="ap-detail-row">
                                        <span className="ap-detail-label">Giá bán:</span>
                                        <span className="ap-detail-price">{viewingProduct.price.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="ap-detail-row">
                                        <span className="ap-detail-label">Số lượng:</span>
                                        <span className={`ap-stock-badge ${getStockClass(viewingProduct.stock)}`}>
                                            {getStockText(viewingProduct.stock)}
                                        </span>
                                    </div>
                                    <div className="ap-detail-row">
                                        <span className="ap-detail-label">Trạng thái:</span>
                                        <span className={`ap-status-badge ${getStatusClass(viewingProduct.status)}`}>
                                            {viewingProduct.status}
                                        </span>
                                    </div>
                                    <div className="ap-detail-row">
                                        <span className="ap-detail-label">Hiển thị:</span>
                                        <span className={`ap-status-badge ${getVisibilityClass(viewingProduct.visibility)}`}>
                                            {viewingProduct.visibility}
                                        </span>
                                    </div>
                                </div>

                                <div className="ap-product-description-section">
                                    <h4>Mô tả sản phẩm</h4>
                                    <p>{viewingProduct.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="ap-modal-footer">
                            <button className="ap-btn-secondary" onClick={() => setShowViewModal(false)}>
                                Đóng
                            </button>
                            <button className="ap-btn-primary" onClick={() => {
                                setShowViewModal(false);
                                handleEditClick(viewingProduct);
                            }}>
                                <FontAwesomeIcon icon={faPen} />
                                Chỉnh Sửa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
