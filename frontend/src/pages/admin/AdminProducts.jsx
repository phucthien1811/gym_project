import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faPen, 
    faTrash, 
    faSearch, 
    faEye, 
    faEyeSlash,
    faInfo
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
                    <button className="ap-btn-primary">
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
                                        <button className="ap-action-btn ap-btn-view" title="Xem chi tiết">
                                            <FontAwesomeIcon icon={faInfo} />
                                        </button>
                                        <button className="ap-action-btn ap-btn-edit" title="Chỉnh sửa">
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
        </div>
    );
}
