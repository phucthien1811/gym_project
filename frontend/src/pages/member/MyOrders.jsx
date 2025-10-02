import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import '../../styles/MyOrders.css';

const MyOrders = () => {
  const { 
    orders, 
    loading, 
    error, 
    pagination, 
    fetchOrders, 
    cancelOrder,
    formatCurrency,
    getStatusText,
    getStatusColor 
  } = useOrders();

  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10
    };
    
    if (statusFilter) {
      params.status = statusFilter;
    }
    
    fetchOrders(params);
  }, [currentPage, statusFilter, fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await cancelOrder(orderId);
        alert('Hủy đơn hàng thành công!');
      } catch (error) {
        alert(`Lỗi: ${error.message}`);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const canCancelOrder = (order) => {
    return order.status === 'pending' && order.payment_status !== 'paid';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="orders-container">
          <div className="loading">Đang tải đơn hàng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-container">
        <div className="page-header">
          <h1>Đơn hàng của tôi</h1>
          <div className="order-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {orders.length === 0 && !loading ? (
        <div className="empty-orders">
          <h3>Chưa có đơn hàng nào</h3>
          <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
          <Link to="/shop" className="btn btn-primary">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Đơn hàng #{order.order_number}</h3>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items && order.items.slice(0, 3).map(item => (
                    <div key={item.id} className="order-item">
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                      <div className="item-details">
                        <h4>{item.product_name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                  
                  {order.items && order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} sản phẩm khác
                    </div>
                  )}
                </div>

                <div className="order-summary">
                  <div className="payment-info">
                    <span>Thanh toán: {order.payment_method === 'COD' ? 'COD' : order.payment_method}</span>
                    <span className={`payment-status ${order.payment_status}`}>
                      {order.payment_status === 'pending' ? 'Chờ thanh toán' : 
                       order.payment_status === 'paid' ? 'Đã thanh toán' : 
                       order.payment_status}
                    </span>
                  </div>
                  <div className="total-amount">
                    <strong>Tổng: {formatCurrency(order.total_amount)}</strong>
                  </div>
                </div>

                <div className="order-actions">
                  <Link 
                    to={`/member/orders/${order.id}`}
                    className="btn btn-secondary"
                  >
                    Xem chi tiết
                  </Link>
                  
                  {canCancelOrder(order) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      Hủy đơn hàng
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <button className="btn btn-primary">
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Trước
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="btn btn-secondary"
              >
                Sau
              </button>
            </div>
          )}

          <div className="pagination-info">
            Hiển thị {orders.length} trong tổng số {pagination.total} đơn hàng
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default MyOrders;
