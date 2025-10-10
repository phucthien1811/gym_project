import React, { useState } from 'react';
import '../css/SimpleClassForm.css';

const SimpleClassForm = ({ isOpen, onClose, onSuccess, editingClass, trainers = [] }) => {
  const [formData, setFormData] = useState({
    class_name: editingClass?.class_name || '',
    description: editingClass?.description || '',
    trainer_id: editingClass?.trainer_id || '',
    max_participants: editingClass?.max_participants || 20,
    start_time: editingClass?.start_time?.substring(0,5) || '',
    end_time: editingClass?.end_time?.substring(0,5) || '',
    class_date: editingClass?.class_date?.split('T')[0] || '',
    status: editingClass?.status || 'scheduled',
    difficulty_level: editingClass?.difficulty_level || 'beginner',
    floor: editingClass?.floor || 1, 
    room: editingClass?.room || '',
    location: editingClass?.location || '' 
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingClass 
        ? `/api/v1/schedules/${editingClass.id}`
        : '/api/v1/schedules';
      
      const method = editingClass ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          max_participants: parseInt(formData.max_participants) || 20,
          trainer_id: formData.trainer_id || null,
          floor: parseInt(formData.floor) || 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save class');
      }

      alert(editingClass ? 'Cập nhật lớp học thành công!' : 'Tạo lớp học thành công!');
      onSuccess();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="simple-modal-overlay" onClick={onClose}>
      <div className="simple-modal-content" onClick={e => e.stopPropagation()}>
        <div className="simple-modal-header">
          <h3>{editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}</h3>
          <button className="simple-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="simple-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="simple-form-grid">
              <div className="simple-form-group">
                <label>Tên lớp học *</label>
                <input
                  type="text"
                  value={formData.class_name}
                  onChange={(e) => setFormData(prev => ({...prev, class_name: e.target.value}))}
                  required
                  placeholder="Ví dụ: Yoga Flow, Boxing..."
                />
              </div>

              <div className="simple-form-group">
                <label>Số học viên tối đa</label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({...prev, max_participants: e.target.value}))}
                  min="1"
                  max="100"
                />
              </div>

              <div className="simple-form-group">
                <label>Huấn luyện viên</label>
                <select
                  value={formData.trainer_id}
                  onChange={(e) => setFormData(prev => ({...prev, trainer_id: e.target.value}))}
                >
                  <option value="">Chọn HLV</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.full_name || trainer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="simple-form-group">
                <label>Ngày học *</label>
                <input
                  type="date"
                  value={formData.class_date}
                  onChange={(e) => setFormData(prev => ({...prev, class_date: e.target.value}))}
                  required
                />
              </div>

              <div className="simple-form-group">
                <label>Giờ bắt đầu *</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({...prev, start_time: e.target.value}))}
                  required
                />
              </div>

              <div className="simple-form-group">
                <label>Giờ kết thúc *</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({...prev, end_time: e.target.value}))}
                  required
                />
              </div>

              <div className="simple-form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                >
                  <option value="scheduled">Đã lên lịch</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="simple-form-group">
                <label>Độ khó</label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData(prev => ({...prev, difficulty_level: e.target.value}))}
                >
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              <div className="simple-form-group">
                <label>Tầng *</label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData(prev => ({...prev, floor: e.target.value}))}
                  required
                >
                  <option value={1}>Tầng 1</option>
                  <option value={2}>Tầng 2</option>
                  <option value={3}>Tầng 3</option>
                  <option value={4}>Tầng 4</option>
                </select>
              </div>

              <div className="simple-form-group">
                <label>Phòng tập *</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({...prev, room: e.target.value}))}
                  placeholder="VD: Phòng A1, Studio Yoga, Phòng Cardio..."
                  required
                />
              </div>

              <div className="simple-form-group">
                <label>Vị trí chi tiết</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                  placeholder="VD: Gần thang máy, cuối hành lang..."
                />
              </div>

              <div className="simple-form-group simple-form-description">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  rows="3"
                  placeholder="Mô tả về lớp học..."
                />
              </div>
            </div>

            <div className="simple-form-actions">
              <button type="button" className="simple-btn simple-btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="simple-btn simple-btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner">⟳</span>
                    Đang lưu...
                  </>
                ) : (
                  editingClass ? 'Cập nhật' : 'Tạo mới'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleClassForm;