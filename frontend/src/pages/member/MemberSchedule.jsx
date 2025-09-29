import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './css/MemberSchedule.css'

const MemberSchedule = () => {
    // Dữ liệu giả lập cho lịch tập
    // Chú ý: day: 1 = Thứ 2, 2 = Thứ 3, ...
    const scheduledClasses = [
        {
            id: 1,
            day: 3, // Thứ 4
            startTime: '09:00',
            endTime: '10:30',
            name: "Yoga Flow Buổi Sáng",
            trainer: "Anna",
            studio: "Studio 2",
            color: "green"
        },
        {
            id: 2,
            day: 5, // Thứ 6
            startTime: '18:00',
            endTime: '19:00',
            name: "HIIT Cardio",
            trainer: "Mike",
            studio: "Khu vực Functional",
            color: "orange"
        },
        {
            id: 3,
            day: 1, // Thứ 2
            startTime: '17:30',
            endTime: '19:00',
            name: "Boxing Cơ Bản",
            trainer: "Dũng Võ",
            studio: "Khu vực Boxing",
            color: "red"
        },
    ];

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 7}:00`); // 7:00 -> 21:00

    // Hàm để tính toán vị trí và kích thước của lớp học trên lưới
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

    return (
        <div className="schedule-page-container fade-in">
            <div className="schedule-header">
                <h1 className="page-title">Lịch tập của tôi</h1>
                <div className="week-navigation">
                    <button className="nav-btn"><FontAwesomeIcon icon={faChevronLeft} /></button>
                    <span>22/09 - 28/09/2025</span>
                    <button className="nav-btn"><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            </div>

            <div className="schedule-grid-container">
                {/* Dòng tiêu đề các ngày trong tuần */}
                <div className="grid-header"></div> {/* Ô trống góc trên bên trái */}
                {daysOfWeek.map(day => (
                    <div key={day} className="day-header">
                        {day}
                        <span className="date-label">{21 + daysOfWeek.indexOf(day)}/09</span>
                    </div>
                ))}

                {/* Cột thời gian bên trái */}
                <div className="time-column">
                    {timeSlots.map(time => <div key={time} className="time-slot-label">{time}</div>)}
                </div>

                {/* Lưới lịch tập chính */}
                <div className="schedule-main-grid">
                    {/* Vẽ các đường kẻ ngang cho mỗi 30 phút */}
                    {Array.from({ length: 30 }).map((_, i) => <div key={i} className="grid-line"></div>)}

                    {/* Hiển thị các lớp học đã đặt */}
                    {scheduledClasses.map(item => {
                        const style = calculateGridPosition(item);
                        return (
                            <div key={item.id} className={`scheduled-item event-${item.color}`} style={style}>
                                <p className="event-name">{item.name}</p>
                                <p className="event-details">{item.startTime} - {item.endTime}</p>
                                <p className="event-details">HLV: {item.trainer}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MemberSchedule;
