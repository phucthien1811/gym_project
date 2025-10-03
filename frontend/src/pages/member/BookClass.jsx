import React, { useState, useEffect } from 'react';
import './css/MemberBookClass.css';

const BookClass = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Load danh sách lớp học từ API
    const loadAvailableClasses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('/api/v1/schedules?status=scheduled', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                // Data nằm trong result.data
                const classesData = result.data || result || [];
                setClasses(Array.isArray(classesData) ? classesData : []);
            } else {
                throw new Error('Không thể tải danh sách lớp học');
            }
        } catch (err) {
            console.error('Error loading classes:', err);
            setError(err.message);
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    // Đăng ký lớp học
    const enrollInClass = async (classId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`/api/v1/schedules/${classId}/enroll`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Đăng ký lớp học thành công!');
                loadAvailableClasses(); // Reload để cập nhật số lượng
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Có lỗi xảy ra khi đăng ký');
            }
        } catch (err) {
            console.error('Error enrolling:', err);
            alert('Có lỗi xảy ra khi đăng ký');
        }
    };

    // Hủy đăng ký lớp học
    const unenrollFromClass = async (classId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`/api/v1/schedules/${classId}/unenroll`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Hủy đăng ký thành công!');
                loadAvailableClasses(); // Reload để cập nhật số lượng
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Có lỗi xảy ra khi hủy đăng ký');
            }
        } catch (err) {
            console.error('Error unenrolling:', err);
            alert('Có lỗi xảy ra khi hủy đăng ký');
        }
    };

    // Format thời gian
    const formatDateTime = (classDate, startTime, endTime) => {
        try {
            // Sử dụng class_date thực tế từ database
            let dateObj;
            
            if (classDate) {
                // Parse class_date (YYYY-MM-DD format)
                dateObj = new Date(classDate);
            } else {
                // Fallback nếu không có class_date
                dateObj = new Date();
            }
            
            // Format ngày
            const formattedDate = dateObj.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            
            // Format thời gian
            let formattedTime = 'Chưa xác định';
            if (startTime) {
                formattedTime = startTime.substring(0, 5);
                if (endTime) {
                    formattedTime += ` - ${endTime.substring(0, 5)}`;
                }
            }
            
            return {
                date: formattedDate,
                time: formattedTime
            };
        } catch (error) {
            console.error('Error formatting date:', error, classDate, startTime);
            return {
                date: 'Chưa xác định',
                time: 'Chưa xác định'
            };
        }
    };

    // Filter classes
    const filteredClasses = classes.filter(classItem => {
        const matchesSearch = classItem.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            classItem.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'available') return matchesSearch && classItem.current_participants < classItem.max_participants;
        if (filter === 'full') return matchesSearch && classItem.current_participants >= classItem.max_participants;
        
        return matchesSearch;
    });

    useEffect(() => {
        loadAvailableClasses();
    }, []);

    if (loading) {
        return (
            <div className="book-class-container">
                <div className="loading-message">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Đang tải danh sách lớp học...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="book-class-container">
            <div className="book-class-header">
                <h1>
                    <i className="fas fa-calendar-plus"></i>
                    Đặt Lớp Học
                </h1>
                <p>Chọn và đăng ký các lớp học phù hợp với bạn</p>
            </div>

            {/* Filter và Search */}
            <div className="book-class-controls">
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Tìm kiếm lớp học hoặc huấn luyện viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        <i className="fas fa-list"></i>
                        Tất cả
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                        onClick={() => setFilter('available')}
                    >
                        <i className="fas fa-check-circle"></i>
                        Còn chỗ
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'full' ? 'active' : ''}`}
                        onClick={() => setFilter('full')}
                    >
                        <i className="fas fa-times-circle"></i>
                        Đã đầy
                    </button>
                </div>
            </div>

            {/* Danh sách lớp học */}
            {error ? (
                <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{error}</p>
                    <button onClick={loadAvailableClasses} className="retry-btn">
                        <i className="fas fa-redo"></i>
                        Thử lại
                    </button>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="empty-message">
                    <i className="fas fa-calendar-times"></i>
                    <h3>Không có lớp học nào</h3>
                    <p>
                        {searchTerm ? 'Không tìm thấy lớp học phù hợp với từ khóa tìm kiếm' : 
                         'Hiện tại chưa có lớp học nào được mở'}
                    </p>
                </div>
            ) : (
                <div className="classes-grid">
                    {filteredClasses.map(classItem => {
                        const { date, time } = formatDateTime(classItem.class_date, classItem.start_time, classItem.end_time);
                        const isAvailable = classItem.current_participants < classItem.max_participants;
                        const isEnrolled = classItem.is_enrolled || false;
                        
                        console.log(`Class ${classItem.class_name} - isEnrolled:`, isEnrolled, 'Raw value:', classItem.is_enrolled);
                        
                        return (
                            <div key={classItem.id} className={`class-card ${!isAvailable ? 'full' : ''} ${isEnrolled ? 'enrolled' : ''}`}>
                                <div className="class-header">
                                    <h3 className="class-name">
                                        <i className="fas fa-dumbbell"></i>
                                        {classItem.class_name}
                                    </h3>
                                    <span className={`status-badge ${isEnrolled ? 'enrolled' : isAvailable ? 'available' : 'full'}`}>
                                        {isEnrolled ? 'Đã đăng ký' : isAvailable ? 'Còn chỗ' : 'Đã đầy'}
                                    </span>
                                </div>

                                <div className="class-info">
                                    <div className="info-row">
                                        <i className="fas fa-user-tie"></i>
                                        <span>HLV: {classItem.trainer_name || 'Chưa có'}</span>
                                    </div>
                                    
                                    <div className="info-row">
                                        <i className="fas fa-calendar-alt"></i>
                                        <span>{date}</span>
                                    </div>
                                    
                                    <div className="info-row">
                                        <i className="fas fa-clock"></i>
                                        <span>{time}</span>
                                    </div>
                                    
                                    <div className="info-row">
                                        <i className="fas fa-users"></i>
                                        <span>
                                            {classItem.current_participants || 0}/{classItem.max_participants} người
                                        </span>
                                    </div>
                                    
                                    {classItem.price && classItem.price > 0 ? (
                                        <div className="info-row">
                                            <i className="fas fa-tag"></i>
                                            <span className="price">
                                                {parseInt(classItem.price).toLocaleString('vi-VN')} VNĐ
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="info-row">
                                            <i className="fas fa-gift"></i>
                                            <span className="price free">
                                                Miễn phí
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {classItem.description && (
                                    <div className="class-description">
                                        <p>{classItem.description}</p>
                                    </div>
                                )}

                                <div className="class-actions">
                                    {isEnrolled ? (
                                        <button 
                                            className="unenroll-btn"
                                            onClick={() => {
                                                console.log('Clicking unenroll for class:', classItem.id);
                                                unenrollFromClass(classItem.id);
                                            }}
                                        >
                                            <i className="fas fa-minus"></i>
                                            Hủy đăng ký
                                        </button>
                                    ) : (
                                        <button 
                                            className={`enroll-btn ${!isAvailable ? 'disabled' : ''}`}
                                            onClick={() => {
                                                console.log('Clicking enroll for class:', classItem.id);
                                                enrollInClass(classItem.id);
                                            }}
                                            disabled={!isAvailable}
                                        >
                                            <i className={`fas ${isAvailable ? 'fa-plus' : 'fa-times'}`}></i>
                                            {isAvailable ? 'Đăng ký' : 'Đã đầy'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookClass;
