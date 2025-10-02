import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faUsers, faClock } from '@fortawesome/free-solid-svg-icons';
import './css/AdminClasses.css'; // File CSS mới

const mockClasses = [
    { id: 1, name: "Yoga Flow", trainer: "Anna Trần", day: "Thứ 2", time: "18:00 - 19:00", enrolled: 12, max: 20, type: "yoga" },
    { id: 2, name: "Boxing", trainer: "Mike Phạm", day: "Thứ 3", time: "19:00 - 20:00", enrolled: 8, max: 15, type: "boxing" },
    { id: 3, name: "Zumba Dance", trainer: "Lan Ngô", day: "Thứ 4", time: "17:30 - 18:30", enrolled: 18, max: 25, type: "dance" },
    { id: 4, name: "Yoga Flow", trainer: "Anna Trần", day: "Thứ 5", time: "18:00 - 19:00", enrolled: 15, max: 20, type: "yoga" },
    { id: 5, name: "HIIT Cardio", trainer: "Dũng Nguyễn", day: "Thứ 6", time: "07:00 - 08:00", enrolled: 10, max: 15, type: "hiit" },
];

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

export default function AdminClasses() {
    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản Lý Lớp Học & Lịch Tập</h2>
                <button className="btn-primary">
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Thêm Lớp Học Mới</span>
                </button>
            </div>

            <div className="schedule-grid-container">
                {/* Tiêu đề các ngày trong tuần */}
                <div className="schedule-header">
                    {daysOfWeek.map(day => (
                        <div key={day} className="day-header">{day}</div>
                    ))}
                </div>

                {/* Lưới chứa các lớp học */}
                <div className="schedule-body">
                    {daysOfWeek.map(day => (
                        <div key={day} className="day-column">
                            {mockClasses.filter(c => c.day === day).map(classItem => (
                                <div key={classItem.id} className={`class-card-item type-${classItem.type}`}>
                                    <div className="class-card-header">
                                        <h4 className="class-name">{classItem.name}</h4>
                                        <div className="class-actions">
                                            <button className="action-btn-mini"><FontAwesomeIcon icon={faPen} /></button>
                                            <button className="action-btn-mini"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    </div>
                                    <p className="class-trainer">HLV: {classItem.trainer}</p>
                                    <div className="class-details">
                                        <span><FontAwesomeIcon icon={faClock} /> {classItem.time}</span>
                                        <span><FontAwesomeIcon icon={faUsers} /> {classItem.enrolled}/{classItem.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
