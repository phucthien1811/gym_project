import React, { useState, useEffect } from 'react';
import './css/MemberPackages.css';
import PackageService from '../../services/packageService';

const MemberPackages = () => {
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packageHistory, setPackageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchPublicPackages();
    fetchCurrentPackage();
    fetchPackageHistory();
  }, []);

  const fetchPublicPackages = async () => {
    try {
      const data = await PackageService.getPublicPackages();
      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchCurrentPackage = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id || 1;
      const data = await PackageService.getCurrentPackage(userId);
      if (data.success && data.data) {
        setCurrentPackage(data.data);
      }
    } catch (error) {
      console.error('Error fetching current package:', error);
    }
  };

  const fetchPackageHistory = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id || 1;
      const data = await PackageService.getMemberPackages(userId);
      if (data.success) {
        setPackageHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching package history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (packageData) => {
    try {
      // Lấy user từ localStorage (được lưu khi đăng nhập)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id || 1; // Fallback to 1 if no user data
      
      console.log('Current user:', userData);
      console.log('Using user ID:', userId);
      
      const result = await PackageService.registerPackage({
        user_id: parseInt(userId), // Changed from member_id to user_id
        package_id: packageData.id,
        paid_amount: packageData.price
      });

      if (result.success) {
        alert('Đăng ký gói tập thành công!');
        setShowRegisterModal(false);
        fetchCurrentPackage();
        fetchPackageHistory();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error registering package:', error);
      alert('Có lỗi xảy ra khi đăng ký gói tập');
    }
  };

  const openRegisterModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowRegisterModal(true);
  };

  const getDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="packages-page-container">
      <h2 className="admin-page-title">Gói tập của tôi</h2>

      {/* Current Package Section */}
      {currentPackage ? (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{currentPackage.package_name}</h3>
              <p className="opacity-90">{currentPackage.description}</p>
              <div className="mt-4">
                <div className="text-sm opacity-90">Thời hạn còn lại</div>
                <div className="text-3xl font-bold">{getDaysLeft(currentPackage.end_date)} ngày</div>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Gia Hạn
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-blue-400">
            <h4 className="font-medium mb-3">Quyền lợi gói tập:</h4>
            <ul className="space-y-2 text-sm">
              {(Array.isArray(currentPackage.features) ? currentPackage.features : []).map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="packages-page-container">
          <p className="page-subtitle">Chọn gói tập phù hợp với nhu cầu của bạn</p>
          
          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className={`package-card ${index === 1 ? 'recommended' : ''}`}
              >
                {index === 1 && <div className="recommended-badge">Phổ biến nhất</div>}
                
                <div className="package-header">
                  <h3 className="package-name">{pkg.name}</h3>
                  {pkg.description && <p className="package-description">{pkg.description}</p>}
                </div>

                <div className="package-price">
                  {pkg.price.toLocaleString('vi-VN')}đ
                  <span className="package-duration">/ {Math.floor(pkg.duration_days / 30)} tháng</span>
                </div>

                <ul className="package-features">
                  {(Array.isArray(pkg.features) ? pkg.features : []).map((feature, index) => (
                    <li key={index}>
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="package-footer">
                  <button 
                    className="btn-primary"
                    onClick={() => openRegisterModal(pkg)}
                  >
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Package History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Lịch sử gói tập</h3>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packageHistory.map((pkg, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.package_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(pkg.start_date).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(pkg.end_date).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pkg.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : pkg.status === 'expired'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pkg.status === 'active' ? 'Đang sử dụng' : 
                       pkg.status === 'expired' ? 'Đã hết hạn' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.paid_amount.toLocaleString('vi-VN')}đ</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && selectedPackage && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận đăng ký gói tập</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRegisterModal(false)}
              >×</button>
            </div>
            
            <div className="register-package-details">
              <h4>{selectedPackage.name}</h4>
              <p className="package-price-large">
                {selectedPackage.price.toLocaleString('vi-VN')}đ
              </p>
              <p>Thời hạn: {Math.floor(selectedPackage.duration_days / 30)} tháng</p>
              
              <div className="package-features-summary">
                <h5>Quyền lợi bao gồm:</h5>
                <ul>
                  {(Array.isArray(selectedPackage.features) ? selectedPackage.features : []).map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                onClick={() => setShowRegisterModal(false)} 
                className="btn-secondary"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={() => handleRegister(selectedPackage)}
                className="btn-primary"
              >
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPackages;