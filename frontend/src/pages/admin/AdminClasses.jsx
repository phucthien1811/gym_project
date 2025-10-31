import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faPen, 
  faTrash, 
  faUsers, 
  faClock, 
  faCalendar,
  faSearch,
  faFilter,
  faEye,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminClasses.css';
import SimpleClassForm from './components/SimpleClassForm';
import { useToast } from '../../context/ToastContext';

const AdminClasses = () => {
  const { showSuccess, showError } = useToast();
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showClassForm, setShowClassForm] = useState(false);
  const [showClassDetails, setShowClassDetails] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    trainer_id: '',
    status: '',
    difficulty_level: '',
    from: '',
    to: ''
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      });

      const response = await fetch(`/api/v1/schedules?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to load classes');
      
      const data = await response.json();
      setClasses(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }));
    } catch (err) {
      setError('Không thể tải danh sách lớp học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const loadTrainers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/trainers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to load trainers');
      
      const data = await response.json();
      setTrainers(data.data || []);
    } catch (err) {
      console.error('Failed to load trainers:', err);
    }
  }, []);

  useEffect(() => {
    loadClasses();
    loadTrainers();
  }, [loadClasses, loadTrainers]);

  const handleCreateClass = () => {
    setEditingClass(null);
    setShowClassForm(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setShowClassForm(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/schedules/${classId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete class');
      }

      await loadClasses();
      showSuccess('Xóa lớp học thành công!');
    } catch (err) {
      showError(err.message || 'Không thể xóa lớp học');
    }
  };

  const handleViewDetails = (classItem) => {
    setSelectedClass(classItem);
    setShowClassDetails(true);
  };

  const handleManageEnrollment = async (classItem) => {
    setSelectedClass(classItem);
    setShowEnrollment(true);
    await loadEnrolledUsers(classItem.id);
  };

  const loadEnrolledUsers = async (scheduleId) => {
    try {
      setLoadingEnrollments(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/schedules/${scheduleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to load enrolled users');
      
      const data = await response.json();
      setEnrolledUsers(data.data?.enrollments || []);
    } catch (err) {
      console.error('Failed to load enrolled users:', err);
      setEnrolledUsers([]);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký của học viên này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/schedules/${selectedClass.id}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove user');
      }

      // Reload enrolled users and classes
      await loadEnrolledUsers(selectedClass.id);
      await loadClasses();
      showSuccess('Đã hủy đăng ký thành công!');
    } catch (err) {
      showError(err.message || 'Không thể hủy đăng ký');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      trainer_id: '',
      status: '',
      difficulty_level: '',
      from: '',
      to: ''
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled': return 'ad-class-badge-scheduled';
      case 'ongoing': return 'ad-class-badge-ongoing';
      case 'completed': return 'ad-class-badge-completed';
      case 'cancelled': return 'ad-class-badge-cancelled';
      default: return 'ad-class-badge-scheduled';
    }
  };

  const getDifficultyBadgeClass = (level) => {
    switch (level) {
      case 'beginner': return 'ad-class-badge-beginner';
      case 'intermediate': return 'ad-class-badge-intermediate';
      case 'advanced': return 'ad-class-badge-advanced';
      default: return 'ad-class-badge-beginner';
    }
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      });

      const response = await fetch(`/api/v1/schedules/export?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to export data');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `classes_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Xuất file Excel thành công!');
    } catch (err) {
      showError('Không thể xuất file Excel');
      console.error(err);
    }
  };

  const handleExportEnrolledUsers = async () => {
    if (!selectedClass) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/schedules/${selectedClass.id}/enrollments/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export enrolled users');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enrolled_users_${selectedClass.class_name}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Xuất danh sách học viên thành công!');
    } catch (err) {
      showError('Không thể xuất danh sách học viên');
      console.error(err);
    }
  };

  if (loading && classes.length === 0) {
    return (
      <div className="ad-class-admin-page-container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="ad-class-admin-page-container">
      <div className="ad-class-admin-page-header">
        <h2 className="ad-class-admin-page-title">Quản Lý Lớp Học & Lịch Tập</h2>
      </div>

      {/* Filters */}
      <div className="ad-class-filters-section">
        <div className="ad-class-filters-grid">
          <div className="ad-class-filter-item">
            <label>
              <FontAwesomeIcon icon={faSearch} />
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên lớp học..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="ad-class-filter-item">
            <label>
              <FontAwesomeIcon icon={faUsers} />
              Huấn luyện viên
            </label>
            <select
              value={filters.trainer_id}
              onChange={(e) => handleFilterChange('trainer_id', e.target.value)}
            >
              <option value="">Tất cả HLV</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.full_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="ad-class-filter-item">
            <label>Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          
          <div className="ad-class-filter-item">
            <label>Độ khó</label>
            <select
              value={filters.difficulty_level}
              onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
          
          <div className="ad-class-filter-item">
            <label>Từ ngày</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
            />
          </div>
          
          <div className="ad-class-filter-item">
            <label>Đến ngày</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange('to', e.target.value)}
            />
          </div>
        </div>
        
        <div className="ad-class-filters-actions">
          <button className="ad-class-btn-success" onClick={handleExportExcel}>
            <FontAwesomeIcon icon={faFileExcel} />
            Xuất Excel
          </button>
          
          <button className="ad-class-btn-secondary" onClick={clearFilters}>
            <FontAwesomeIcon icon={faFilter} />
            Xóa bộ lọc
          </button>
          
          <button className="ad-class-btn-primary" onClick={handleCreateClass}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm Lớp Học Mới</span>
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Classes Table */}
      <div className="ad-class-admin-table-container">
        <table className="ad-class-admin-table">
          <thead>
            <tr>
              <th>Tên Lớp Học</th>
              <th>Huấn Luyện Viên</th>
              <th>Thời Gian</th>
              <th>Ngày Học</th>
              <th>Vị Trí</th>
              <th>Học Viên</th>
              <th>Trạng Thái</th>
              <th>Độ Khó</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              classes.map(classItem => (
                <tr key={classItem.id}>
                  <td>
                    <div className="ad-class-class-name-cell">
                      <strong>{classItem.class_name}</strong>
                      {classItem.description && (
                        <small style={{ display: 'block', color: '#6b7280', marginTop: '4px' }}>
                          {classItem.description.length > 50 
                            ? `${classItem.description.substring(0, 50)}...` 
                            : classItem.description}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    {classItem.trainer_name ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FontAwesomeIcon icon={faUsers} style={{ color: '#6b7280' }} />
                        {classItem.trainer_name}
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Chưa có HLV</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faClock} style={{ color: '#6b7280' }} />
                      <span>{formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faCalendar} style={{ color: '#6b7280' }} />
                      {formatDate(classItem.class_date)}
                    </div>
                  </td>
                  <td>
                    {classItem.floor && classItem.room ? (
                      <div>
                        <div style={{ fontWeight: '500' }}>Tầng {classItem.floor} - {classItem.room}</div>
                        {classItem.location && (
                          <small style={{ color: '#6b7280' }}>{classItem.location}</small>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Chưa có</span>
                    )}
                  </td>
                  <td>
                    <div className="ad-class-participants-cell">
                      <span className="ad-class-participants-count">
                        {classItem.current_participants || 0}/{classItem.max_participants || 0}
                      </span>
                      <div className="ad-class-participants-bar-small">
                        <div 
                          className="ad-class-participants-fill"
                          style={{
                            width: `${((classItem.current_participants || 0) / (classItem.max_participants || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`ad-class-badge ${getStatusBadgeClass(classItem.status)}`}>
                      {classItem.status === 'scheduled' && 'Đã lên lịch'}
                      {classItem.status === 'ongoing' && 'Đang diễn ra'}
                      {classItem.status === 'completed' && 'Hoàn thành'}
                      {classItem.status === 'cancelled' && 'Đã hủy'}
                    </span>
                  </td>
                  <td>
                    <span className={`ad-class-badge ${getDifficultyBadgeClass(classItem.difficulty_level)}`}>
                      {classItem.difficulty_level === 'beginner' && 'Cơ bản'}
                      {classItem.difficulty_level === 'intermediate' && 'Trung cấp'}
                      {classItem.difficulty_level === 'advanced' && 'Nâng cao'}
                    </span>
                  </td>
                  <td>
                    <div className="ad-class-action-buttons">
                      <button 
                        className="ad-class-action-btn ad-class-view-btn"
                        onClick={() => handleViewDetails(classItem)}
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      
                      <button 
                        className="ad-class-action-btn ad-class-edit-btn"
                        onClick={() => handleEditClass(classItem)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      
                      <button 
                        className="ad-class-action-btn ad-class-enroll-btn"
                        onClick={() => handleManageEnrollment(classItem)}
                        title="Quản lý học viên"
                      >
                        <FontAwesomeIcon icon={faUsers} />
                      </button>
                      
                      <button 
                        className="ad-class-action-btn ad-class-delete-btn"
                        onClick={() => handleDeleteClass(classItem.id)}
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="ad-class-pagination-container">
          <button
            className="ad-class-pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Trước
          </button>
          
          <span className="ad-class-pagination-info">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          
          <button
            className="ad-class-pagination-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal với SimpleClassForm */}
      {showClassForm && (
        <SimpleClassForm
          isOpen={showClassForm}
          onClose={() => setShowClassForm(false)}
          editingClass={editingClass}
          trainers={trainers}
          onSuccess={() => {
            loadClasses();
            setShowClassForm(false);
          }}
        />
      )}

      {showClassDetails && (
        <div className="ad-class-modal-overlay" onClick={() => setShowClassDetails(false)}>
          <div className="ad-class-modal-content" onClick={e => e.stopPropagation()}>
            <div className="ad-class-modal-header">
              <h3>Chi tiết lớp học</h3>
              <button onClick={() => setShowClassDetails(false)}>×</button>
            </div>
            <div style={{padding: '2rem', textAlign: 'center'}}>
              <p>Chi tiết lớp học sẽ được hoàn thiện sau</p>
            </div>
          </div>
        </div>
      )}

      {showEnrollment && (
        <div className="ad-class-modal-overlay" onClick={() => setShowEnrollment(false)}>
          <div className="ad-class-modal-content ad-class-large-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-class-modal-header">
              <h3>Quản lý học viên - {selectedClass?.class_name}</h3>
              <button onClick={() => setShowEnrollment(false)}>×</button>
            </div>
            <div className="ad-class-modal-body">
              {loadingEnrollments ? (
                <div className="loading-spinner">Đang tải danh sách học viên...</div>
              ) : (
                <div className="ad-class-enrollments-container">
                  {/* Stats Summary - Compact Version */}
                  <div className="ad-class-enrollment-summary-compact">
                    <div className="ad-class-stat-card">
                      <span className="ad-class-stat-label">Tổng:</span>
                      <strong className="ad-class-stat-value">{selectedClass?.max_participants || 0}</strong>
                    </div>
                    <div className="ad-class-stat-card ad-class-stat-active">
                      <span className="ad-class-stat-label">Đã đăng ký:</span>
                      <strong className="ad-class-stat-value">{enrolledUsers.length}</strong>
                    </div>
                    <div className="ad-class-stat-card ad-class-stat-remaining">
                      <span className="ad-class-stat-label">Còn lại:</span>
                      <strong className="ad-class-stat-value">
                        {(selectedClass?.max_participants || 0) - enrolledUsers.length}
                      </strong>
                    </div>
                    <button 
                      className="ad-class-btn-export-users"
                      onClick={handleExportEnrolledUsers}
                      title="Xuất danh sách học viên"
                    >
                      <FontAwesomeIcon icon={faFileExcel} />
                      Xuất Excel
                    </button>
                  </div>

                  <div className="ad-class-enrolled-users-list">
                    <h4>Danh sách học viên đã đăng ký</h4>
                    {enrolledUsers.length === 0 ? (
                      <div className="ad-class-empty-state">
                        <p>Chưa có học viên nào đăng ký lớp học này</p>
                      </div>
                    ) : (
                      <div className="ad-class-users-table">
                        <div className="ad-class-table-header">
                          <div className="ad-class-col-name">Tên học viên</div>
                          <div className="ad-class-col-email">Email</div>
                          <div className="ad-class-col-enrolled">Ngày đăng ký</div>
                          <div className="ad-class-col-status">Trạng thái</div>
                          <div className="ad-class-col-actions">Thao tác</div>
                        </div>
                        <div className="ad-class-table-body">
                          {enrolledUsers.map(user => (
                            <div key={user.id} className="ad-class-table-row">
                              <div className="ad-class-col-name">
                                <FontAwesomeIcon icon={faUsers} />
                                {user.name || user.full_name || 'N/A'}
                              </div>
                              <div className="ad-class-col-email">{user.email || 'N/A'}</div>
                              <div className="ad-class-col-enrolled">
                                {user.enrolled_at ? 
                                  new Date(user.enrolled_at).toLocaleDateString('vi-VN') : 
                                  'N/A'
                                }
                              </div>
                              <div className="ad-class-col-status">
                                <span className="ad-class-status-badge ad-class-enrolled">
                                  Đã đăng ký
                                </span>
                              </div>
                              <div className="ad-class-col-actions">
                                <button 
                                  className="ad-class-action-btn ad-class-delete-btn"
                                  onClick={() => handleRemoveUser(user.id)}
                                  title="Hủy đăng ký"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;
