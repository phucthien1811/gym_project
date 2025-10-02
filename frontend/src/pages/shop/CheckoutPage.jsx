import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import Header from '../../components/common/Header';
import '../../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, loading } = useOrders(false);

  const [shippingInfo, setShippingInfo] = useState({
    full_name: user?.full_name || '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
    postal_code: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const shippingFee = 30000;
  const discount = 0;
  const total = getTotalPrice() + shippingFee - discount;

  const validateForm = () => {
    const newErrors = {};

    if (!shippingInfo.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ tên';
    }

    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!shippingInfo.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập phường/xã';
    }

    if (!shippingInfo.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện';
    }

    if (!shippingInfo.province.trim()) {
      newErrors.province = 'Vui lòng nhập tỉnh/thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          unit_price: item.price,
          quantity: item.quantity
        })),
        shipping_address: shippingInfo,
        payment_method: paymentMethod,
        shipping_fee: shippingFee,
        discount_amount: discount,
        notes: notes.trim()
      };

      const order = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order success page
      navigate(`/order-success/${order.order_number}`, {
        state: { order }
      });

    } catch (error) {
      alert(`Lỗi tạo đơn hàng: ${error.message}`);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <Header />
        <div className="checkout-page">
          <div className="container">
            <div className="empty-cart">
              <h2>Giỏ hàng trống</h2>
              <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/shop')}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="checkout-page">
        <div className="container">
          <h1 className="page-title">Thanh toán</h1>

          <div className="checkout-content">
            {/* Order Summary */}
            <div className="order-summary">
              <h3>Đơn hàng của bạn</h3>
              <div className="order-items">
                {items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <div className="item-details">
                        <span>Số lượng: {item.quantity}</span>
                        <span>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                      </div>
                    </div>
                    <div className="item-total">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Tạm tính:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getTotalPrice())}</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Giảm giá:</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}</span>
                  </div>
                )}
                <div className="total-row final">
                  <span>Tổng cộng:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Form */}
            <div className="shipping-form">
              <h3>Thông tin giao hàng</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={shippingInfo.full_name}
                      onChange={handleInputChange}
                      className={errors.full_name ? 'error' : ''}
                    />
                    {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Địa chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phường/Xã *</label>
                    <input
                      type="text"
                      name="ward"
                      value={shippingInfo.ward}
                      onChange={handleInputChange}
                      className={errors.ward ? 'error' : ''}
                    />
                    {errors.ward && <span className="error-text">{errors.ward}</span>}
                  </div>

                  <div className="form-group">
                    <label>Quận/Huyện *</label>
                    <input
                      type="text"
                      name="district"
                      value={shippingInfo.district}
                      onChange={handleInputChange}
                      className={errors.district ? 'error' : ''}
                    />
                    {errors.district && <span className="error-text">{errors.district}</span>}
                  </div>

                  <div className="form-group">
                    <label>Tỉnh/Thành phố *</label>
                    <input
                      type="text"
                      name="province"
                      value={shippingInfo.province}
                      onChange={handleInputChange}
                      className={errors.province ? 'error' : ''}
                    />
                    {errors.province && <span className="error-text">{errors.province}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Mã bưu điện</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={shippingInfo.postal_code}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phương thức thanh toán</label>
                  <div className="payment-methods">
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="payment_method"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Chuyển khoản ngân hàng</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi chú đơn hàng</label>
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/cart')}
                  >
                    Quay lại giỏ hàng
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;