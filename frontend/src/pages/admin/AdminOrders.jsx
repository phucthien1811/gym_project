import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faEye, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { orderService } from '../../services/orderService';
import '../../styles/AdminOrders.css';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Get status text in Vietnamese
    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Chờ xác nhận',
            'confirmed': 'Đã xác nhận',
            'processing': 'Đang xử lý',
            'shipped': 'Đang giao hàng',
            'delivered': 'Đã giao hàng',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    // Get status color
    const getStatusColor = (status) => {
        const colorMap = {
            'pending': '#ffc107',
            'confirmed': '#17a2b8',
            'processing': '#007bff',
            'shipped': '#fd7e14',
            'delivered': '#28a745',
            'cancelled': '#dc3545'
        };
        return colorMap[status] || '#6c757d';
    };

    // Fetch admin orders
    const fetchAdminOrders = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = JSON.parse(localStorage.getItem('rf_auth_v1'))?.accessToken;
            console.log('🔐 Admin token:', token ? 'Present' : 'Missing');
            
            const queryString = new URLSearchParams(params).toString();
            
            // Try admin endpoint first, fallback to user endpoint for testing
            let url = `http://localhost:4000/api/v1/orders/admin/all?${queryString}`;
            console.log('📡 Fetching admin orders from:', url);
            
            let response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📥 Admin Response status:', response.status);
            
            // If admin endpoint fails, try user endpoint for debugging
            if (!response.ok) {
                console.log('❌ Admin endpoint failed, trying user endpoint...');
                url = `http://localhost:4000/api/v1/orders/my-orders?${queryString}`;
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('📥 User Response status:', response.status);
            }
            
            const data = await response.json();
            console.log('📥 Response data:', data);
            
            if (data.success) {
                setOrders(data.data.orders || data.data || []);
                setPagination(data.data.pagination || { page: 1, limit: 10, total: 0 });
            } else {
                setError(data.message || 'Không thể tải đơn hàng');
            }
        } catch (error) {
            console.error('❌ Error fetching admin orders:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // View order details
    const viewOrderDetails = async (order) => {
        try {
            console.log('🔍 Viewing order details for:', order.id);
            const token = JSON.parse(localStorage.getItem('rf_auth_v1'))?.accessToken;
            
            // Try admin endpoint first, fallback to user endpoint
            let response = await fetch(`http://localhost:4000/api/v1/orders/admin/${order.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📡 Admin endpoint response status:', response.status);
            
            // If admin endpoint fails, try user endpoint
            if (!response.ok) {
                console.log('❌ Admin endpoint failed, trying user endpoint...');
                response = await fetch(`http://localhost:4000/api/v1/orders/my-orders/${order.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('📡 User endpoint response status:', response.status);
            }
            
            if (response.ok) {
                const data = await response.json();
                console.log('📥 Order details response:', data);
                console.log('📋 Selected order data:', data.data);
                console.log('🔍 Shipping name:', data.data?.shipping_name);
                console.log('🔍 Shipping phone:', data.data?.shipping_phone);
                console.log('🔍 Shipping address:', data.data?.shipping_address);
                setSelectedOrder(data.data);
                setShowOrderDetails(true);
            } else {
                const errorText = await response.text();
                console.log('❌ Error response:', errorText);
                alert('Không thể tải chi tiết đơn hàng: ' + response.status);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            alert('Lỗi tải chi tiết đơn hàng');
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/orders/admin/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('rf_auth_v1'))?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, notes: `Status updated by admin to ${status}` })
            });
            
            if (response.ok) {
                alert('Cập nhật trạng thái thành công!');
                fetchAdminOrders(); // Refresh list
            } else {
                alert('Lỗi cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Lỗi cập nhật trạng thái');
        }
    };

    useEffect(() => {
        // Check if user is admin
        const authData = JSON.parse(localStorage.getItem('rf_auth_v1'));
        const user = authData?.user;
        console.log('👤 Current user:', user);
        console.log('🔑 User role:', user?.role);
        
        if (user?.role !== 'admin') {
            setError('Bạn không có quyền truy cập trang này');
            return;
        }
        
        const params = {
            page: currentPage,
            limit: 10
        };
        
        if (statusFilter) params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        
        fetchAdminOrders(params);
    }, [currentPage, statusFilter, searchTerm]);

    if (loading) {
        return (
            <div className="admin-page-container">
                <div className="loading">Đang tải đơn hàng...</div>
            </div>
        );
    }

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản Lý Đơn Hàng</h2>
                <div className="admin-page-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm đơn hàng..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipped">Đang giao hàng</option>
                            <option value="delivered">Đã giao hàng</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn Hàng</th>
                            <th>Khách Hàng</th>
                            <th>Ngày Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((order) => (
                            <tr key={order.id}>
                                <td><span className="order-id">{order.order_number}</span></td>
                                <td>{order.shipping_name || 'N/A'}</td>
                                <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                                <td className="total-amount">{formatCurrency(order.total_amount)}</td>
                                <td>
                                    <span 
                                        className="status-pill" 
                                        style={{ 
                                            backgroundColor: getStatusColor(order.status),
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="action-btn view-btn"
                                            onClick={() => viewOrderDetails(order)}
                                            title="Xem chi tiết đơn hàng"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        {order.status === 'pending' && (
                                            <button 
                                                className="action-btn confirm-btn"
                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                title="Xác nhận đơn hàng"
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button 
                                                className="action-btn processing-btn"
                                                onClick={() => updateOrderStatus(order.id, 'processing')}
                                                title="Chuyển sang xử lý"
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        )}
                                        {order.status === 'processing' && (
                                            <button 
                                                className="action-btn ship-btn"
                                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                title="Giao hàng"
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        )}
                                        {(order.status === 'pending' || order.status === 'confirmed') && (
                                            <button 
                                                className="action-btn cancel-btn"
                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                title="Hủy đơn hàng"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    {error ? `Lỗi: ${error}` : 'Không có đơn hàng nào'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi Tiết Đơn Hàng {selectedOrder.order_number}</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowOrderDetails(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="order-info-grid">
                                <div className="info-section">
                                    <h4>Thông Tin Khách Hàng</h4>
                                    <p><strong>Tên:</strong> {selectedOrder.shipping_address?.full_name || 'Không có thông tin'}</p>
                                    <p><strong>Điện thoại:</strong> {selectedOrder.shipping_address?.phone || 'Không có thông tin'}</p>
                                    <p><strong>Địa chỉ:</strong> 
                                        {selectedOrder.shipping_address?.address || 'Không có thông tin'}
                                        {selectedOrder.shipping_address?.ward && `, ${selectedOrder.shipping_address.ward}`}
                                        {selectedOrder.shipping_address?.district && `, ${selectedOrder.shipping_address.district}`}
                                        {selectedOrder.shipping_address?.province && `, ${selectedOrder.shipping_address.province}`}
                                    </p>
                                </div>
                                
                                <div className="info-section">
                                    <h4>Thông Tin Đơn Hàng</h4>
                                    <p><strong>Trạng thái:</strong> 
                                        <span 
                                            className="status-pill" 
                                            style={{ 
                                                backgroundColor: getStatusColor(selectedOrder.status),
                                                color: 'white',
                                                marginLeft: '8px'
                                            }}
                                        >
                                            {getStatusText(selectedOrder.status)}
                                        </span>
                                    </p>
                                    <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method}</p>
                                    <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                            
                            <div className="order-items-section">
                                <h4>Sản Phẩm</h4>
                                <div className="items-list">
                                    {selectedOrder.items?.map(item => (
                                        <div key={item.id} className="item-row">
                                            <span className="item-name">{item.product_name}</span>
                                            <span className="item-quantity">SL: {item.quantity}</span>
                                            <span className="item-price">{formatCurrency(item.total_price)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="order-total-section">
                                    <div className="total-row">
                                        <span>Phí vận chuyển:</span>
                                        <span>{formatCurrency(selectedOrder.shipping_fee || 0)}</span>
                                    </div>
                                    <div className="total-row final-total">
                                        <span><strong>Tổng cộng:</strong></span>
                                        <span><strong>{formatCurrency(selectedOrder.total_amount)}</strong></span>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedOrder.notes && (
                                <div className="notes-section">
                                    <h4>Ghi Chú</h4>
                                    <p>{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
