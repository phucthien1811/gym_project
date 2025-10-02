import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCalendarPlus, 
  faBan, 
  faSearch,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import PackageService from '../../services/packageService';
import './css/AdminMemberPackages.css';

const AdminMemberPackages = () => {
  const [memberPackages, setMemberPackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    packageId: '',
    search: ''
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedMemberPackage, setSelectedMemberPackage] = useState(null);
  const [stats, setStats] = useState(null);

  const [registerForm, setRegisterForm] = useState({
    member_id: '',
    package_id: '',
    paid_amount: '',
    notes: ''
  });

  const [extendForm, setExtendForm] = useState({
    days: '',
    additional_amount: ''
  });

  const fetchMemberPackages = async () => {
    try {
      const result = await PackageService.getAllMemberPackages(filters);
      if (result.success) {
        setMemberPackages(result.data);
      }
    } catch (error) {
      console.error('Error fetching member packages:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const result = await PackageService.getAllPackages();
      if (result.success) {
        setPackages(result.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await PackageService.getPackageStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMemberPackages(),
        fetchPackages(),
        fetchStats()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMemberPackages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await PackageService.registerPackage({
        ...registerForm,
        member_id: parseInt(registerForm.member_id),
        package_id: parseInt(registerForm.package_id),
        paid_amount: parseFloat(registerForm.paid_amount)
      });

      if (result.success) {
        alert('Đăng ký gói tập thành công!');
        setShowRegisterModal(false);
        setRegisterForm({
          member_id: '',
          package_id: '',
          paid_amount: '',
          notes: ''
        });
        fetchData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error registering package:', error);
      alert('Có lỗi xảy ra khi đăng ký gói tập');
    }
  };

  const handleExtend = async (e) => {
    e.preventDefault();
    try {
      const result = await PackageService.extendPackage(selectedMemberPackage.id, {
        days: parseInt(extendForm.days),
        additional_amount: parseFloat(extendForm.additional_amount) || 0
      });

      if (result.success) {
        alert('Gia hạn gói tập thành công!');
        setShowExtendModal(false);
        setExtendForm({ days: '', additional_amount: '' });
        setSelectedMemberPackage(null);
        fetchData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error extending package:', error);
      alert('Có lỗi xảy ra khi gia hạn gói tập');
    }
  };

  const handleCancel = async (memberPackage) => {
    const reason = prompt('Nhập lý do hủy gói tập:');
    if (reason === null) return;

    try {
      const result = await PackageService.cancelPackage(memberPackage.id, { reason });
      if (result.success) {
        alert('Hủy gói tập thành công!');
        fetchData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error cancelling package:', error);
      alert('Có lỗi xảy ra khi hủy gói tập');
    }
  };

  const updateExpiredPackages = async () => {
    try {
      const result = await PackageService.updateExpiredPackages();
      if (result.success) {
        alert(result.message);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating expired packages:', error);
    }
  };

  const filteredMemberPackages = memberPackages.filter(mp => {
    const matchesSearch = !filters.search || 
      mp.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      mp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      mp.package_name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'expired': return 'Hết hạn';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản Lý Gói Tập Thành Viên</h2>
          {stats && (
            <div className="stats-summary">
              <span className="stat-item">Tổng: {stats.total}</span>
              <span className="stat-item active">Hoạt động: {stats.active}</span>
              <span className="stat-item expired">Hết hạn: {stats.expired}</span>
              <span className="stat-item cancelled">Đã hủy: {stats.cancelled}</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={updateExpiredPackages}
            title="Cập nhật gói hết hạn"
          >
            <FontAwesomeIcon icon={faRefresh} />
            <span>Cập nhật hết hạn</span>
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowRegisterModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Đăng ký gói</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <div className="search-input">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, gói tập..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="expired">Hết hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select
            value={filters.packageId}
            onChange={(e) => setFilters(prev => ({ ...prev, packageId: e.target.value }))}
          >
            <option value="">Tất cả gói tập</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Packages Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Thành viên</th>
              <th>Gói tập</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Số tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredMemberPackages.map(mp => (
              <tr key={mp.id}>
                <td>
                  <div className="member-info">
                    <div className="member-name">{mp.full_name}</div>
                    <div className="member-email">{mp.email}</div>
                    <div className="member-phone">{mp.phone}</div>
                  </div>
                </td>
                <td>
                  <span className="package-name">{mp.package_name}</span>
                </td>
                <td>{new Date(mp.start_date).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(mp.end_date).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className={`status-pill ${getStatusColor(mp.status)}`}>
                    {getStatusText(mp.status)}
                  </span>
                </td>
                <td>{mp.paid_amount.toLocaleString('vi-VN')}đ</td>
                <td>
                  <div className="action-buttons">
                    {mp.status === 'active' && (
                      <>
                        <button
                          className="action-btn btn-info"
                          onClick={() => {
                            setSelectedMemberPackage(mp);
                            setShowExtendModal(true);
                          }}
                          title="Gia hạn"
                        >
                          <FontAwesomeIcon icon={faCalendarPlus} />
                        </button>
                        <button
                          className="action-btn btn-danger"
                          onClick={() => handleCancel(mp)}
                          title="Hủy gói"
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đăng ký gói tập cho thành viên</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRegisterModal(false)}
              >×</button>
            </div>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Member ID:</label>
                <input
                  type="number"
                  value={registerForm.member_id}
                  onChange={e => setRegisterForm(prev => ({...prev, member_id: e.target.value}))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gói tập:</label>
                <select
                  value={registerForm.package_id}
                  onChange={e => {
                    const packageId = e.target.value;
                    const selectedPackage = packages.find(p => p.id === parseInt(packageId));
                    setRegisterForm(prev => ({
                      ...prev, 
                      package_id: packageId,
                      paid_amount: selectedPackage ? selectedPackage.price : ''
                    }));
                  }}
                  required
                >
                  <option value="">Chọn gói tập</option>
                  {packages.filter(p => p.is_active).map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price.toLocaleString('vi-VN')}đ
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số tiền thanh toán:</label>
                <input
                  type="number"
                  value={registerForm.paid_amount}
                  onChange={e => setRegisterForm(prev => ({...prev, paid_amount: e.target.value}))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  value={registerForm.notes}
                  onChange={e => setRegisterForm(prev => ({...prev, notes: e.target.value}))}
                  rows="3"
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && selectedMemberPackage && (
        <div className="modal-overlay" onClick={() => setShowExtendModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gia hạn gói tập</h3>
              <button 
                className="modal-close"
                onClick={() => setShowExtendModal(false)}
              >×</button>
            </div>
            <div className="extend-info">
              <p><strong>Thành viên:</strong> {selectedMemberPackage.full_name}</p>
              <p><strong>Gói tập:</strong> {selectedMemberPackage.package_name}</p>
              <p><strong>Ngày hết hạn hiện tại:</strong> {new Date(selectedMemberPackage.end_date).toLocaleDateString('vi-VN')}</p>
            </div>
            <form onSubmit={handleExtend}>
              <div className="form-group">
                <label>Số ngày gia hạn:</label>
                <input
                  type="number"
                  value={extendForm.days}
                  onChange={e => setExtendForm(prev => ({...prev, days: e.target.value}))}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Phí gia hạn (VNĐ):</label>
                <input
                  type="number"
                  value={extendForm.additional_amount}
                  onChange={e => setExtendForm(prev => ({...prev, additional_amount: e.target.value}))}
                  min="0"
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowExtendModal(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Gia hạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberPackages;