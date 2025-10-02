import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import '../../styles/OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  return (
    <div>
      <Header />
      <div className="order-success-page">
        <div className="container">
          <div className="success-content">
            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1>Đặt hàng thành công!</h1>
            <p className="success-message">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </p>

            <div className="order-info">
              <div className="order-number">
                <strong>Mã đơn hàng: {orderNumber}</strong>
              </div>

              {order && (
                <div className="order-details">
                  <div className="detail-row">
                    <span>Tổng tiền:</span>
                    <span className="amount">
                      {new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                      }).format(order.total_amount)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Phương thức thanh toán:</span>
                    <span>{order.payment_method === 'COD' ? 'Thanh toán khi nhận hàng' : order.payment_method}</span>
                  </div>
                  <div className="detail-row">
                    <span>Trạng thái:</span>
                    <span className="status pending">Chờ xác nhận</span>
                  </div>
                  
                  {order.shipping_address && (
                    <div className="shipping-info">
                      <h4>Địa chỉ giao hàng:</h4>
                      <p>
                        {order.shipping_address.full_name && `${order.shipping_address.full_name}`}
                        {order.shipping_address.full_name && <br/>}
                        {order.shipping_address.phone && `${order.shipping_address.phone}`}
                        {order.shipping_address.phone && <br/>}
                        {order.shipping_address.address && `${order.shipping_address.address}`}
                        {order.shipping_address.ward && `, ${order.shipping_address.ward}`}
                        {(order.shipping_address.address || order.shipping_address.ward) && <br/>}
                        {order.shipping_address.district && `${order.shipping_address.district}`}
                        {order.shipping_address.province && `, ${order.shipping_address.province}`}
                        {order.shipping_address.postal_code && ` ${order.shipping_address.postal_code}`}
                      </p>
                    </div>
                  )}

                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>Sản phẩm đã đặt:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.product_image} alt={item.product_name} />
                          <div className="item-info">
                            <h5>{item.product_name}</h5>
                            <div className="item-details">
                              <span>Số lượng: {item.quantity}</span>
                              <span>
                                Giá: {new Intl.NumberFormat('vi-VN', { 
                                  style: 'currency', 
                                  currency: 'VND' 
                                }).format(item.unit_price)}
                              </span>
                            </div>
                          </div>
                          <div className="item-total">
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(item.total_price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="next-steps">
              <h3>Bước tiếp theo:</h3>
              <ul>
                <li>Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 2-4 giờ</li>
                <li>Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc</li>
                <li>Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản của mình</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/shop')}
              >
                Tiếp tục mua sắm
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/member/orders')}
              >
                Xem đơn hàng của tôi
              </button>
            </div>

            <div className="contact-info">
              <p>
                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:
              </p>
              <div className="contact-details">
                <span>📞 Hotline: 0123 456 789</span>
                <span>📧 Email: support@royalfitness.vn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;