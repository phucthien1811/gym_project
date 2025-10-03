import React, { useState, useEffect } from 'react';
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
  faDumbbell,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminClasses.css';
import ClassFormModal from './components/ClassFormModal';
import ClassDetailsModal from './components/ClassDetailsModal';
import EnrollmentModal from './components/EnrollmentModal';

const AdminClasses = () => {
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

  useEffect(() => {
    loadClasses();
    loadTrainers();
  }, [pagination.page, filters]);

  const loadClasses = async () => {
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
  };

  const loadTrainers = async () => {
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
  };

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
      alert('Xóa lớp học thành công!');
    } catch (err) {
      alert(err.message || 'Không thể xóa lớp học');
    }
  };

  const handleViewDetails = (classItem) => {
    setSelectedClass(classItem);
    setShowClassDetails(true);
  };

  const handleManageEnrollment = (classItem) => {
    setSelectedClass(classItem);
    setShowEnrollment(true);
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
      case 'scheduled': return 'badge-scheduled';
      case 'ongoing': return 'badge-ongoing';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-scheduled';
    }
  };

  const getDifficultyBadgeClass = (level) => {
    switch (level) {
      case 'beginner': return 'badge-beginner';
      case 'intermediate': return 'badge-intermediate';
      case 'advanced': return 'badge-advanced';
      default: return 'badge-beginner';
    }
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading && classes.length === 0) {
    return (
      <div className="admin-page-container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Quản Lý Lớp Học & Lịch Tập</h2>
        <button className="btn-primary" onClick={handleCreateClass}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Thêm Lớp Học Mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-item">
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
          
          <div className="filter-item">
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
                  {trainer.trainer_name || trainer.full_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
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
          
          <div className="filter-item">
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
          
          <div className="filter-item">
            <label>Từ ngày</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
            />
          </div>
          
          <div className="filter-item">
            <label>Đến ngày</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange('to', e.target.value)}
            />
          </div>
        </div>
        
        <button className="btn-secondary" onClick={clearFilters}>
          <FontAwesomeIcon icon={faFilter} />
          Xóa bộ lọc
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Classes Grid */}
      <div className="classes-grid">
        {classes.map(classItem => (
          <div key={classItem.id} className="class-card">
            <div className="class-card-header">
              <h4 className="class-name">{classItem.class_name}</h4>
              <div className="class-badges">
                <span className={`badge ${getStatusBadgeClass(classItem.status)}`}>
                  {classItem.status === 'scheduled' && 'Đã lên lịch'}
                  {classItem.status === 'ongoing' && 'Đang diễn ra'}
                  {classItem.status === 'completed' && 'Hoàn thành'}
                  {classItem.status === 'cancelled' && 'Đã hủy'}
                </span>
                <span className={`badge ${getDifficultyBadgeClass(classItem.difficulty_level)}`}>
                  {classItem.difficulty_level === 'beginner' && 'Cơ bản'}
                  {classItem.difficulty_level === 'intermediate' && 'Trung cấp'}
                  {classItem.difficulty_level === 'advanced' && 'Nâng cao'}
                </span>
              </div>
            </div>

            <div className="class-info">
              {classItem.trainer_name && (
                <p className="class-trainer">
                  <FontAwesomeIcon icon={faUsers} />
                  HLV: {classItem.trainer_name}
                </p>
              )}
              
              <p className="class-time">
                <FontAwesomeIcon icon={faClock} />
                {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
              </p>
              
              <p className="class-date">
                <FontAwesomeIcon icon={faCalendar} />
                {formatDate(classItem.class_date)}
              </p>
              
              {classItem.location && (
                <p className="class-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  {classItem.location}
                </p>
              )}
              
              <div className="class-participants">
                <FontAwesomeIcon icon={faUsers} />
                <span className="participants-count">
                  {classItem.current_participants || 0}/{classItem.max_participants || 0}
                </span>
                <div className="participants-bar">
                  <div 
                    className="participants-fill"
                    style={{
                      width: `${((classItem.current_participants || 0) / (classItem.max_participants || 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              
              {classItem.price > 0 && (
                <p className="class-price">
                  <FontAwesomeIcon icon={faDumbbell} />
                  {classItem.price.toLocaleString('vi-VN')} VNĐ
                </p>
              )}
            </div>

            <div className="class-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => handleViewDetails(classItem)}
                title="Xem chi tiết"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              
              <button 
                className="action-btn edit-btn"
                onClick={() => handleEditClass(classItem)}
                title="Chỉnh sửa"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              
              <button 
                className="action-btn enroll-btn"
                onClick={() => handleManageEnrollment(classItem)}
                title="Quản lý học viên"
              >
                <FontAwesomeIcon icon={faUsers} />
              </button>
              
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeleteClass(classItem.id)}
                title="Xóa"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Trước
          </button>
          
          <span className="pagination-info">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          
          <button
            className="pagination-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modals */}
      {showClassForm && (
        <ClassFormModal
          isOpen={showClassForm}
          onClose={() => setShowClassForm(false)}
          classData={editingClass}
          trainers={trainers}
          onSuccess={() => {
            loadClasses();
            setShowClassForm(false);
          }}
        />
      )}

      {showClassDetails && (
        <ClassDetailsModal
          isOpen={showClassDetails}
          onClose={() => setShowClassDetails(false)}
          classData={selectedClass}
        />
      )}

      {showEnrollment && (
        <EnrollmentModal
          isOpen={showEnrollment}
          onClose={() => setShowEnrollment(false)}
          classData={selectedClass}
          onSuccess={() => {
            loadClasses();
            setShowEnrollment(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminClasses;