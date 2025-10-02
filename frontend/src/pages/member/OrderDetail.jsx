import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrderDetails } from '../../hooks/useOrders';
import '../../styles/OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { 
    order, 
    loading, 
    error, 
    fetchOrderDetail, 
    cancelOrder,
    formatCurrency,
    getStatusText,
    getStatusColor 
  } = useOrderDetails();

  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId, fetchOrderDetail]);

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        setCancelling(true);
        await cancelOrder(orderId);
        alert('Hủy đơn hàng thành công!');
        navigate('/member/orders');
      } catch (error) {
        alert(`Lỗi: ${error.message}`);
      } finally {
        setCancelling(false);
      }
    }
  };

  const canCancelOrder = (order) => {
    return order && order.status === 'pending' && order.payment_status !== 'paid';
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'processing': return '🔄';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="loading">Đang tải chi tiết đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <div className="error-message">
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <Link to="/member/orders" className="btn btn-secondary">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="not-found">
          <h3>Không tìm thấy đơn hàng</h3>
          <p>Đơn hàng #{orderId} không tồn tại hoặc bạn không có quyền xem.</p>
          <Link to="/member/orders" className="btn btn-secondary">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="page-header">
        <Link to="/member/orders" className="back-button">
          ← Quay lại
        </Link>
        <h1>Chi tiết đơn hàng #{order.order_number}</h1>
      </div>

      <div className="order-detail-content">
        {/* Order Status */}
        <div className="order-status-section">
          <div className="status-header">
            <span className="status-icon">{getStatusIcon(order.status)}</span>
            <div className="status-info">
              <h2 className="status-title">{getStatusText(order.status)}</h2>
              <p className="order-date">
                Đặt hàng: {new Date(order.created_at).toLocaleString('vi-VN')}
              </p>
            </div>
            <span 
              className="status-badge large"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {getStatusText(order.status)}
            </span>
          </div>

          {/* Order Timeline */}
          <div className="order-timeline">
            <div className={`timeline-item ${order.status !== 'cancelled' ? 'completed' : ''}`}>
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <h4>Đơn hàng đã được tạo</h4>
                <p>{new Date(order.created_at).toLocaleString('vi-VN')}</p>
              </div>
            </div>
            
            {order.status !== 'cancelled' && (
              <>
                <div className={`timeline-item ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <div className="timeline-content">
                    <h4>Đơn hàng được xác nhận</h4>
                    {order.confirmed_at && (
                      <p>{new Date(order.confirmed_at).toLocaleString('vi-VN')}</p>
                    )}
                  </div>
                </div>

                <div className={`timeline-item ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <div className="timeline-content">
                    <h4>Đang chuẩn bị hàng</h4>
                    {order.processing_at && (
                      <p>{new Date(order.processing_at).toLocaleString('vi-VN')}</p>
                    )}
                  </div>
                </div>

                <div className={`timeline-item ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <div className="timeline-content">
                    <h4>Đang giao hàng</h4>
                    {order.shipped_at && (
                      <p>{new Date(order.shipped_at).toLocaleString('vi-VN')}</p>
                    )}
                  </div>
                </div>

                <div className={`timeline-item ${order.status === 'delivered' ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <div className="timeline-content">
                    <h4>Đã giao hàng</h4>
                    {order.delivered_at && (
                      <p>{new Date(order.delivered_at).toLocaleString('vi-VN')}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h3>Sản phẩm đã đặt</h3>
          <div className="order-items-list">
            {order.items && order.items.map(item => (
              <div key={item.id} className="order-item-detail">
                <img 
                  src={item.product_image} 
                  alt={item.product_name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="item-info">
                  <h4>{item.product_name}</h4>
                  <p className="item-description">{item.product_description}</p>
                  <div className="item-meta">
                    <span>Đơn giá: {formatCurrency(item.unit_price)}</span>
                    <span>Số lượng: {item.quantity}</span>
                  </div>
                </div>
                <div className="item-total">
                  <strong>{formatCurrency(item.total_price)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <div className="summary-grid">
            {/* Shipping Address */}
            <div className="shipping-info">
              <h3>Thông tin giao hàng</h3>
              <div className="address-card">
                <p><strong>{order.shipping_name}</strong></p>
                <p>{order.shipping_phone}</p>
                <p>{order.shipping_address}</p>
                {order.notes && (
                  <div className="order-notes">
                    <strong>Ghi chú:</strong>
                    <p>{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="payment-info">
              <h3>Thông tin thanh toán</h3>
              <div className="payment-card">
                <div className="payment-method">
                  <span>Phương thức: </span>
                  <strong>{order.payment_method === 'COD' ? 'Thanh toán khi nhận hàng' : order.payment_method}</strong>
                </div>
                <div className="payment-status">
                  <span>Trạng thái: </span>
                  <span className={`payment-status-badge ${order.payment_status}`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="order-total-section">
            <h3>Tổng cộng</h3>
            <div className="total-breakdown">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.subtotal || order.total_amount)}</span>
              </div>
              {order.shipping_fee > 0 && (
                <div className="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatCurrency(order.shipping_fee)}</span>
                </div>
              )}
              {order.discount_amount > 0 && (
                <div className="total-row discount">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="total-row final">
                <span><strong>Tổng tiền:</strong></span>
                <span><strong>{formatCurrency(order.total_amount)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Actions */}
        <div className="order-actions-section">
          {canCancelOrder(order) && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="btn btn-danger"
            >
              {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </button>
          )}

          {order.status === 'delivered' && (
            <button className="btn btn-primary">
              Đánh giá đơn hàng
            </button>
          )}

          <button 
            onClick={() => window.print()} 
            className="btn btn-secondary"
          >
            In hóa đơn
          </button>

          <Link to="/shop" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;