import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faReceipt } from '@fortawesome/free-solid-svg-icons';
import './css/MyOrders.css'; // Import file CSS mới

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState('Tất cả');

    // Dữ liệu giả lập chi tiết hơn
    const allOrders = [
        {
            id: '#ORD001', date: '2025-09-20', status: 'Hoàn thành',
            items: [
                { id: 1, name: 'Whey Protein Gold Standard 5Lbs', image: 'https://placehold.co/100x100/333333/FFFFFF?text=Whey', quantity: 1, price: 1850000 },
                { id: 2, name: 'BCAA Xtend 30 Servings', image: 'https://placehold.co/100x100/333333/FFFFFF?text=BCAA', quantity: 2, price: 650000 }
            ]
        },
        {
            id: '#ORD002', date: '2025-09-25', status: 'Đang xử lý',
            items: [
                { id: 3, name: 'Creatine Monohydrate 300g', image: 'https://placehold.co/100x100/333333/FFFFFF?text=Creatine', quantity: 1, price: 450000 }
            ]
        },
        {
            id: '#ORD003', date: '2025-09-15', status: 'Đã hủy',
            items: [
                { id: 4, name: 'Găng tay tập gym', image: 'https://placehold.co/100x100/333333/FFFFFF?text=Glove', quantity: 1, price: 250000 }
            ]
        }
    ];
    
    // Lọc đơn hàng dựa trên tab đang hoạt động
    const filteredOrders = activeTab === 'Tất cả'
        ? allOrders
        : allOrders.filter(order => order.status === activeTab);

    // Tính tổng tiền cho mỗi đơn hàng
    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const tabs = ['Tất cả', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'];

    return (
        <div className="orders-page-container fade-in">
            <h1 className="page-title">Đơn Hàng Của Tôi</h1>

            {/* Thanh điều hướng và tìm kiếm */}
            <div className="orders-header">
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="text" placeholder="Tìm đơn hàng theo ID, tên sản phẩm..." />
                </div>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="orders-list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <span>Mã đơn hàng: <strong>{order.id}</strong></span>
                                <span className={`order-status status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-items-list">
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <img src={item.image} alt={item.name} className="item-image" />
                                        <div className="item-details">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-quantity">x{item.quantity}</p>
                                        </div>
                                        <span className="item-price">{item.price.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-card-footer">
                                <span className="order-date">Ngày đặt: {order.date}</span>
                                <div className="order-total">
                                    <FontAwesomeIcon icon={faReceipt} />
                                    <span>Thành tiền:</span>
                                    <strong>{calculateTotal(order.items).toLocaleString('vi-VN')}đ</strong>
                                </div>
                            </div>
                             <div className="order-card-actions">
                                <button className="btn-secondary">Xem chi tiết</button>
                                {order.status === 'Hoàn thành' && <button className="btn-primary">Đánh giá</button>}
                                {order.status === 'Đang xử lý' && <button className="btn-danger">Hủy đơn</button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-orders-found">
                        <p>Không có đơn hàng nào trong mục này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
