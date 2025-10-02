import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './css/AdminTrainers.css'; // File CSS mới

const mockTrainers = [
    { id: "T01", name: "Dũng Nguyễn", email: "dung.nguyen@royal.fit", specialty: "Bodybuilding", phone: "0901234567", status: "Active", avatar: "https://placehold.co/40x40/60a5fa/FFFFFF?text=D" },
    { id: "T02", name: "Anna Trần", email: "anna.tran@royal.fit", specialty: "Yoga & Pilates", phone: "0907654321", status: "Active", avatar: "https://placehold.co/40x40/f87171/FFFFFF?text=A" },
    { id: "T03", name: "Mike Phạm", email: "mike.pham@royal.fit", specialty: "Boxing", phone: "0912345678", status: "Inactive", avatar: "https://placehold.co/40x40/34d399/FFFFFF?text=M" },
];

export default function AdminTrainers() {
    const getStatusClass = (status) => {
        return status === 'Active' ? 'status-active' : 'status-inactive';
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản Lý Huấn Luyện Viên (PT)</h2>
                <div className="admin-page-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm HLV..." />
                    </div>
                    <button className="btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm HLV</span>
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Huấn Luyện Viên</th>
                            <th>Chuyên Môn</th>
                            <th>Số Điện Thoại</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTrainers.map((trainer) => (
                            <tr key={trainer.id}>
                                <td>
                                    <div className="user-info-cell">
                                        <img src={trainer.avatar} alt={trainer.name} className="user-avatar" />
                                        <div className="user-details">
                                            <span className="user-name">{trainer.name}</span>
                                            <span className="user-email">{trainer.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{trainer.specialty}</td>
                                <td>{trainer.phone}</td>
                                <td>
                                    <span className={`status-pill ${getStatusClass(trainer.status)}`}>
                                        {trainer.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn btn-edit"><FontAwesomeIcon icon={faPen} /></button>
                                        <button className="action-btn btn-delete"><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
