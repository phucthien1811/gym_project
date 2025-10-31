import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useOrders } from '../../hooks/useOrders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './css/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedItemsArray, selectedSubtotal, clearSelectedItems } = useCart();
  const { createOrder, loading } = useOrders(false);
  const { showSuccess, showError } = useToast();

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    payment_method: 'COD',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch member profile
        const profileResponse = await fetch('http://localhost:4000/api/v1/member-profiles/my-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('📋 Profile data loaded:', profileData);
          
          const profile = profileData.data;
          
          // Auto-fill form with profile data
          // Backend returns: name (from users), phone (from member_profiles), address (from member_profiles)
          setFormData(prev => ({
            ...prev,
            shipping_name: profile.name || user?.full_name || user?.name || '',
            shipping_phone: profile.phone || user?.phone || '',
            shipping_address: profile.address || ''
          }));
          
          console.log('✅ Form auto-filled:', {
            name: profile.name,
            phone: profile.phone,
            address: profile.address
          });
        } else {
          // Fallback to user data if no profile exists
          setFormData(prev => ({
            ...prev,
            shipping_name: user?.full_name || user?.name || '',
            shipping_phone: user?.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to user data on error
        setFormData(prev => ({
          ...prev,
          shipping_name: user?.full_name || '',
          shipping_phone: user?.phone || ''
        }));
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

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
    return selectedSubtotal + calculateShipping() - discount;
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

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã voucher');
      return;
    }

    setVoucherLoading(true);
    setVoucherError('');

    try {
      const token = localStorage.getItem('token');
      const orderValue = selectedSubtotal + calculateShipping();
      
      const response = await fetch('http://localhost:4000/api/v1/vouchers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: voucherCode.toUpperCase(),
          order_value: orderValue
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedVoucher(data.data);
        setDiscount(data.data.discount_amount);
        setVoucherError('');
        showSuccess(`✅ Áp dụng voucher ${data.data.voucher_code} thành công!`);
      } else {
        setVoucherError(data.message);
        setAppliedVoucher(null);
        setDiscount(0);
      }
    } catch (error) {
      setVoucherError('Có lỗi xảy ra khi áp dụng voucher');
      console.error('Error applying voucher:', error);
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setDiscount(0);
    setVoucherError('');
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
          ward: "Phường 1",
          district: "Quận 1",
          province: "TP.HCM",
          postal_code: ""
        },
        payment_method: formData.payment_method, // Keep uppercase
        shipping_fee: calculateShipping(),
        discount_amount: discount,
        voucher_code: appliedVoucher?.voucher_code || null,
        notes: formData.notes || ""
      };

      console.log('📦 Order data to send:', JSON.stringify(orderData, null, 2));
      
      const response = await createOrder(orderData);
      console.log('✅ Create order response:', response);
      console.log('🔍 Payment method selected:', formData.payment_method);
      
      // Nếu có voucher, tăng used_count
      if (appliedVoucher?.voucher_id) {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4000/api/v1/vouchers/${appliedVoucher.voucher_id}/use`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Extract order info from response
      const orderInfo = response?.data || response || {};
      const orderId = orderInfo.id || Math.floor(Math.random() * 1000000);
      const orderNumber = orderInfo.order_number || `ORD-${Date.now()}`;
      
      console.log('📦 Order info extracted:', { orderId, orderNumber, total: orderInfo.total_amount });
      
      // Nếu chọn chuyển khoản ngân hàng, chuyển sang trang thanh toán
      if (formData.payment_method === 'BANK_TRANSFER') {
        console.log('🏦 Redirecting to banking payment page...');
        
        // Navigate to banking payment FIRST (don't clear cart yet)
        navigate('/shop/banking-payment', {
          state: {
            orderData: orderData,
            orderInfo: {
              id: orderId,
              order_number: orderNumber,
              total_amount: orderInfo.total_amount || calculateTotal()
            }
          },
          replace: true
        });
        return;
      }
      
      // COD: Clear cart and show success
      clearSelectedItems();
      showSuccess('🎉 Đặt hàng thành công!');
      
      // Small delay then navigate to success page
      setTimeout(() => {
        navigate('/order-success', { 
          state: { 
            orderId: orderId,
            orderNumber: orderNumber,
            totalAmount: orderInfo.total_amount || calculateTotal(),
            paymentMethod: orderInfo.payment_method || formData.payment_method
          } 
        });
      }, 100);

    } catch (error) {
      console.error('❌ Create order error:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMessage = error.response?.data?.errors?.[0] || error.response?.data?.message || error.message;
      showError(`Lỗi đặt hàng: ${errorMessage}`);
    }
  };

  if (!user || selectedItemsArray.length === 0) {
    return (
      <div className="checkout-page">
        <div className="loading">Đang chuyển hướng...</div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="checkout-page">
        <div className="loading">Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Thanh toán đơn hàng</h1>
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

            {/* Voucher Section */}
            <div className="voucher-section">
              <h3>🎟️ Mã giảm giá</h3>
              
              {!appliedVoucher ? (
                <>
                  <div className="voucher-input-group">
                    <input
                      type="text"
                      placeholder="Nhập mã voucher (9 ký tự)"
                      value={voucherCode}
                      onChange={(e) => {
                        setVoucherCode(e.target.value.toUpperCase());
                        setVoucherError('');
                      }}
                      maxLength={9}
                      className={voucherError ? 'error' : ''}
                    />
                    <button 
                      type="button"
                      className="btn-apply-voucher"
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading || !voucherCode.trim()}
                    >
                      {voucherLoading ? 'Đang xử lý...' : 'Áp dụng'}
                    </button>
                  </div>
                  {voucherError && (
                    <div className="voucher-error">
                      <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />
                      {voucherError}
                    </div>
                  )}
                </>
              ) : (
                <div className="voucher-applied">
                  <div className="voucher-success">
                    <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                    <div>
                      <div className="voucher-code">{appliedVoucher.voucher_code}</div>
                      <div className="voucher-discount">Giảm {discount.toLocaleString('vi-VN')}đ</div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="btn-remove-voucher"
                    onClick={handleRemoveVoucher}
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="voucher-hint">
                💡 Mã voucher có thể giảm giá lên đến 100% (miễn phí)
              </div>
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
              {appliedVoucher && (
                <div className="total-row discount-row">
                  <span>Giảm giá ({appliedVoucher.voucher_code}):</span>
                  <span className="discount-value">-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
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
                  <option value="COD">💵 Thanh toán khi nhận hàng (COD)</option>
                  <option value="BANK_TRANSFER">🏦 Chuyển khoản ngân hàng</option>
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
