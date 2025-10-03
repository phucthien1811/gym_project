import React, { useState } from 'react';

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
    floor: editingClass?.floor || 1, // Thêm trường tầng
    room: editingClass?.room || '', // Thêm trường phòng
    location: editingClass?.location || '' // Thêm trường vị trí
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content class-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{padding: '1.5rem', background: 'white', color: '#2c3e50'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Tên lớp học *</label>
              <input
                type="text"
                value={formData.class_name}
                onChange={(e) => setFormData(prev => ({...prev, class_name: e.target.value}))}
                required
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Số học viên tối đa</label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData(prev => ({...prev, max_participants: e.target.value}))}
                min="1"
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Huấn luyện viên</label>
              <select
                value={formData.trainer_id}
                onChange={(e) => setFormData(prev => ({...prev, trainer_id: e.target.value}))}
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              >
                <option value="">Chọn HLV</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.full_name || trainer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Ngày học *</label>
              <input
                type="date"
                value={formData.class_date}
                onChange={(e) => setFormData(prev => ({...prev, class_date: e.target.value}))}
                required
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Giờ bắt đầu *</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({...prev, start_time: e.target.value}))}
                required
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Giờ kết thúc *</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({...prev, end_time: e.target.value}))}
                required
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              >
                <option value="scheduled">Đã lên lịch</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Độ khó</label>
              <select
                value={formData.difficulty_level}
                onChange={(e) => setFormData(prev => ({...prev, difficulty_level: e.target.value}))}
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              >
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Tầng *</label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({...prev, floor: e.target.value}))}
                required
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              >
                <option value={1}>Tầng 1</option>
                <option value={2}>Tầng 2</option>
                <option value={3}>Tầng 3</option>
                <option value={4}>Tầng 4</option>
              </select>
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Phòng tập *</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData(prev => ({...prev, room: e.target.value}))}
                placeholder="VD: Phòng A1, Studio Yoga, Phòng Cardio..."
                required
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>

            <div>
              <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Vị trí chi tiết</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                placeholder="VD: Gần thang máy, cuối hành lang..."
                style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
              />
            </div>
          </div>

          <div style={{marginTop: '1rem'}}>
            <label style={{color: '#2c3e50', fontWeight: '500', marginBottom: '0.5rem', display: 'block'}}>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              rows="3"
              style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #dee2e6', borderRadius: '0.5rem', backgroundColor: 'white', color: '#495057'}}
            />
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e9ecef'}}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : (editingClass ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleClassForm;