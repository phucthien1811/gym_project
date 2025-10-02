import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/OrderSuccess.css';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  const [orderInfo, setOrderInfo] = useState({
    orderNumber: '',
    orderId: '',
    totalAmount: 0,
    paymentMethod: ''
  });

  useEffect(() => {
    // Try to get order info from state first (new way)
    if (location.state) {
      const { orderId, orderNumber, totalAmount, paymentMethod } = location.state;
      if (orderNumber && orderId) {
        setOrderInfo({
          orderNumber,
          orderId,
          totalAmount: totalAmount || 0,
          paymentMethod: paymentMethod || 'COD'
        });
        return; // Exit early if we got data from state
      }
    }

    // Fallback to URL params (old way)
    const orderNumber = searchParams.get('orderNumber');
    const orderId = searchParams.get('orderId');
    const totalAmount = searchParams.get('totalAmount');
    const paymentMethod = searchParams.get('paymentMethod');

    if (orderNumber && orderId) {
      setOrderInfo({
        orderNumber,
        orderId,
        totalAmount: parseFloat(totalAmount) || 0,
        paymentMethod: paymentMethod || 'COD'
      });
    } else {
      // If no order info, redirect to orders page after delay
      console.log('No order info found, redirecting to orders page...');
      setTimeout(() => {
        navigate('/member/orders');
      }, 5000); // Tăng thời gian lên 5 giây
    }
  }, [searchParams, location.state, navigate]);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản ngân hàng';
      case 'MOMO':
        return 'Ví MoMo';
      case 'VNPAY':
        return 'VNPay';
      default:
        return method;
    }
  };

  if (!user) {
    return (
      <div className="order-success-page">
        <div className="loading">Đang chuyển hướng...</div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>

        <div className="success-content">
          <h1>Đặt hàng thành công!</h1>
          <p className="success-message">
            Cảm ơn bạn đã đặt hàng tại Royal Fitness. 
            Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>

          {orderInfo.orderNumber && (
            <div className="order-summary">
              <h2>Thông tin đơn hàng</h2>
              <div className="order-details">
                <div className="detail-row">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value order-number">#{orderInfo.orderNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Tổng tiền:</span>
                  <span className="value total-amount">
                    {formatCurrency(orderInfo.totalAmount)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Phương thức thanh toán:</span>
                  <span className="value">
                    {getPaymentMethodText(orderInfo.paymentMethod)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Thời gian đặt:</span>
                  <span className="value">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="next-steps">
            <h3>Bước tiếp theo:</h3>
            <ul>
              <li>📧 Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn</li>
              <li>📱 Bạn sẽ nhận được SMS thông báo khi đơn hàng được xác nhận</li>
              <li>🚚 Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc</li>
              {orderInfo.paymentMethod === 'COD' && (
                <li>💰 Vui lòng chuẩn bị tiền mặt khi nhận hàng</li>
              )}
            </ul>
          </div>

          <div className="action-buttons">
            <Link 
              to={`/member/orders/${orderInfo.orderId}`}
              className="btn btn-primary"
            >
              Xem chi tiết đơn hàng
            </Link>
            
            <Link 
              to="/member/orders"
              className="btn btn-secondary"
            >
              Xem tất cả đơn hàng
            </Link>
            
            <Link 
              to="/shop"
              className="btn btn-outline"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="confetti">
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
        </div>
      </div>

      <div className="support-section">
        <h3>Cần hỗ trợ?</h3>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, 
          vui lòng liên hệ với chúng tôi:
        </p>
        <div className="contact-info">
          <div className="contact-item">
            <span className="icon">📞</span>
            <span>Hotline: 1900-1234</span>
          </div>
          <div className="contact-item">
            <span className="icon">✉️</span>
            <span>Email: support@royalfitness.com</span>
          </div>
          <div className="contact-item">
            <span className="icon">💬</span>
            <span>Chat: Messenger Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;