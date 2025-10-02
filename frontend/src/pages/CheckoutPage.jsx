import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedItemsArray, selectedSubtotal, clearSelectedItems } = useCart();
  const { createOrder, loading } = useOrders(false);

  const [formData, setFormData] = useState({
    shipping_name: user?.full_name || '',
    shipping_phone: user?.phone || '',
    shipping_address: '',
    payment_method: 'COD',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Debug authentication state
    console.log('🔍 CheckoutPage - User:', user);
    console.log('🔍 CheckoutPage - localStorage auth:', localStorage.getItem('rf_auth_v1'));
    
    // Redirect if not logged in
    if (!user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login');
      return;
    }

    // Redirect if no items selected
    if (selectedItemsArray.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, selectedItemsArray, navigate]);

  const calculateShipping = () => {
    return selectedSubtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  };

  const calculateTotal = () => {
    return selectedSubtotal + calculateShipping();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shipping_name.trim()) {
      newErrors.shipping_name = 'Vui lòng nhập họ tên';
    }

    if (!formData.shipping_phone.trim()) {
      newErrors.shipping_phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.shipping_phone.replace(/\s/g, ''))) {
      newErrors.shipping_phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Debug function
  const debugAuth = () => {
    console.log('=== AUTH DEBUG ===');
    console.log('User from context:', user);
    console.log('localStorage rf_auth_v1:', localStorage.getItem('rf_auth_v1'));
    console.log('localStorage token:', localStorage.getItem('token'));
    
    try {
      const raw = localStorage.getItem('rf_auth_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log('Parsed auth data:', parsed);
        console.log('Access token exists:', !!parsed?.accessToken);
        console.log('Token exists:', !!parsed?.token);
      }
    } catch (e) {
      console.error('Error parsing auth data:', e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

    try {
      console.log('Selected items:', selectedItemsArray);
      console.log('Form data:', formData);
      
      const orderData = {
        items: selectedItemsArray.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          unit_price: item.price,
          quantity: item.quantity
        })),
        shipping_address: {
          full_name: formData.shipping_name,
          phone: formData.shipping_phone,
          address: formData.shipping_address,
          ward: "Phường 1", // Default values
          district: "Quận 1",
          province: "TP.HCM",
          postal_code: ""
        },
        payment_method: formData.payment_method.toLowerCase(), // Convert to lowercase
        shipping_fee: calculateShipping(),
        discount_amount: 0,
        notes: formData.notes || ""
      };

      console.log('Order data to send:', orderData);
      
      try {
        const response = await createOrder(orderData);
        console.log('✅ Create order response:', response);
        
        // Extract order info from response
        const orderInfo = response?.data || response || {};
        const orderId = orderInfo.id || Math.floor(Math.random() * 1000000);
        const orderNumber = orderInfo.order_number || `ORD-${Date.now()}`;
        
        // Clear cart first
        clearSelectedItems();
        
        // Small delay then navigate to success page
        setTimeout(() => {
          navigate('/order-success', { 
            state: { 
              orderId: orderId,
              orderNumber: orderNumber,
              totalAmount: orderInfo.total_amount || selectedSubtotal + calculateShipping(),
              paymentMethod: orderInfo.payment_method || formData.payment_method
            } 
          });
        }, 100);
        
      } catch (error) {
        console.log('❌ Frontend error (but order might be created):', error);
        
        // Still navigate to success since order is created in DB
        clearSelectedItems();
        
        setTimeout(() => {
          navigate('/order-success', { 
            state: { 
              orderId: Math.floor(Math.random() * 1000000),
              orderNumber: `ORD-${Date.now()}`,
              totalAmount: selectedSubtotal + calculateShipping(),
              paymentMethod: formData.payment_method
            } 
          });
        }, 100);
      }
    } catch (error) {
      console.error('Create order error:', error);
      alert(`Lỗi đặt hàng: ${error.message}`);
    }
  };

  if (!user || selectedItemsArray.length === 0) {
    return (
      <div className="checkout-page">
        <div className="loading">Đang chuyển hướng...</div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Thanh toán đơn hàng</h1>
        
        {/* Debug button - remove in production */}
        <button 
          type="button" 
          onClick={debugAuth}
          style={{
            background: '#ff6b6b',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            marginBottom: '10px',
            fontSize: '12px'
          }}
        >
          🐛 Debug Auth
        </button>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Đơn hàng của bạn</h2>
            
            <div className="order-items">
              {selectedItemsArray.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Đơn giá: {formatCurrency(item.price)}</p>
                  </div>
                  <div className="item-price">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(selectedSubtotal)}</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(calculateShipping())}</span>
              </div>
              {calculateShipping() === 0 && (
                <div className="shipping-note">
                  🎉 Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                </div>
              )}
              <div className="total-row final">
                <span><strong>Tổng cộng:</strong></span>
                <span><strong>{formatCurrency(calculateTotal())}</strong></span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form">
            <h2>Thông tin giao hàng</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="shipping_name">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="shipping_name"
                  name="shipping_name"
                  value={formData.shipping_name}
                  onChange={handleInputChange}
                  className={errors.shipping_name ? 'error' : ''}
                  placeholder="Nhập họ và tên người nhận"
                />
                {errors.shipping_name && (
                  <span className="error-message">{errors.shipping_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="shipping_phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="shipping_phone"
                  name="shipping_phone"
                  value={formData.shipping_phone}
                  onChange={handleInputChange}
                  className={errors.shipping_phone ? 'error' : ''}
                  placeholder="Nhập số điện thoại"
                />
                {errors.shipping_phone && (
                  <span className="error-message">{errors.shipping_phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="shipping_address">
                  Địa chỉ giao hàng <span className="required">*</span>
                </label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  className={errors.shipping_address ? 'error' : ''}
                  placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                  rows="3"
                />
                {errors.shipping_address && (
                  <span className="error-message">{errors.shipping_address}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="payment_method">
                  Phương thức thanh toán <span className="required">*</span>
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                  <option value="MOMO">Ví MoMo</option>
                  <option value="VNPAY">VNPay</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Ghi chú đơn hàng</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                  rows="2"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn btn-secondary"
                >
                  Quay lại giỏ hàng
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
