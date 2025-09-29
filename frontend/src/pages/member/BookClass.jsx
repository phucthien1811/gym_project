import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faUsers, faDumbbell, faPersonRunning, faFire, faTimes } from '@fortawesome/free-solid-svg-icons';
import './css/BookClass.css'; // Import file CSS mới

const BookClass = () => {
    // State để quản lý modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    // Dữ liệu giả lập cho các lớp học có sẵn
    const availableClasses = [
        { id: 1, day: 1, startTime: '08:00', endTime: '09:00', name: "Yoga Chào Buổi Sáng", trainer: "Anna", spots: 5, maxSpots: 15, color: "green" },
        { id: 2, day: 2, startTime: '17:30', endTime: '18:30', name: "Zumba Dance", trainer: "Sarah", spots: 10, maxSpots: 20, color: "purple" },
        { id: 3, day: 3, startTime: '09:00', endTime: '10:30', name: "Yoga Flow Nâng Cao", trainer: "Anna", spots: 2, maxSpots: 15, color: "green" },
        { id: 4, day: 4, startTime: '19:00', endTime: '20:30', name: "Strength Training", trainer: "John", spots: 8, maxSpots: 12, color: "blue" },
        { id: 5, day: 5, startTime: '18:00', endTime: '19:00', name: "HIIT Cardio", trainer: "Mike", spots: 0, maxSpots: 10, color: "orange" },
        { id: 6, day: 1, startTime: '17:30', endTime: '19:00', name: "Boxing Cơ Bản", trainer: "Dũng Võ", spots: 3, maxSpots: 10, color: "red" },
    ];

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`); // 7:00 -> 21:00

    const calculateGridPosition = (item) => {
        const startHour = parseInt(item.startTime.split(':')[0]);
        const startMinute = parseInt(item.startTime.split(':')[1]);
        const endHour = parseInt(item.endTime.split(':')[0]);
        const endMinute = parseInt(item.endTime.split(':')[1]);

        const gridStartRow = ((startHour - 7) * 2) + (startMinute / 30) + 1;
        const gridEndRow = ((endHour - 7) * 2) + (endMinute / 30) + 1;

        return {
            gridColumn: item.day + 1,
            gridRow: `${gridStartRow} / ${gridEndRow}`
        };
    };

    // Hàm xử lý khi nhấn nút đặt chỗ
    const handleBookClick = (classItem) => {
        setSelectedClass(classItem);
        setIsModalOpen(true);
    };

    // Hàm xác nhận đặt chỗ
    const confirmBooking = () => {
        alert(`Xác nhận đặt chỗ thành công cho lớp: ${selectedClass.name}`);
        setIsModalOpen(false);
        setSelectedClass(null);
    };

    return (
        <div className="book-class-page-container fade-in">
            {/* Header */}
            <div className="schedule-header">
                <h1 className="page-title">Đặt Lịch Tập</h1>
                <div className="week-navigation">
                    <button className="nav-btn"><FontAwesomeIcon icon={faChevronLeft} /></button>
                    <span>22/09 - 28/09/2025</span>
                    <button className="nav-btn"><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <button className="filter-btn active">Tất cả</button>
                <button className="filter-btn">Yoga</button>
                <button className="filter-btn">Cardio</button>
                <button className="filter-btn">Sức mạnh</button>
                <button className="filter-btn">Boxing</button>
            </div>

            {/* Lịch tập */}
            <div className="schedule-grid-container">
                <div className="grid-header"></div>
                {daysOfWeek.map(day => <div key={day} className="day-header">{day}</div>)}
                <div className="time-column">
                    {timeSlots.map(time => <div key={time} className="time-slot-label">{time}</div>)}
                </div>
                <div className="schedule-main-grid">
                    {Array.from({ length: 30 }).map((_, i) => <div key={i} className="grid-line"></div>)}
                    {availableClasses.map(item => {
                        const style = calculateGridPosition(item);
                        const isFull = item.spots === 0;
                        return (
                            <div key={item.id} className={`bookable-item event-${item.color} ${isFull ? 'full' : ''}`} style={style}>
                                <p className="event-name">{item.name}</p>
                                <p className="event-details">HLV: {item.trainer}</p>
                                <div className="event-footer">
                                    <span className="spots-info">
                                        <FontAwesomeIcon icon={faUsers} /> {item.spots}/{item.maxSpots}
                                    </span>
                                    <button 
                                        className="book-now-btn" 
                                        onClick={() => handleBookClick(item)}
                                        disabled={isFull}
                                    >
                                        {isFull ? 'Hết chỗ' : 'Đặt ngay'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal xác nhận */}
            {isModalOpen && selectedClass && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2>Xác nhận đặt chỗ</h2>
                        <p className="modal-class-name">{selectedClass.name}</p>
                        <div className="modal-class-details">
                            <span><strong>Thời gian:</strong> {selectedClass.startTime} - {selectedClass.endTime}</span>
                            <span><strong>HLV:</strong> {selectedClass.trainer}</span>
                        </div>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                            <button className="modal-btn confirm" onClick={confirmBooking}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookClass;
