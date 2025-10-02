import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './css/AdminStaff.css'; // File CSS mới

const mockStaff = [
    { id: "S01", name: "Hoàng Anh Tuấn", email: "tuan.ha@royal.fit", role: "Manager", status: "Active", avatar: "https://placehold.co/40x40/60a5fa/FFFFFF?text=T" },
    { id: "S02", name: "Ngô Thị Lan", email: "lan.nt@royal.fit", role: "Receptionist", status: "Active", avatar: "https://placehold.co/40x40/f87171/FFFFFF?text=L" },
];

export default function AdminStaff() {
    const getStatusClass = (status) => (status === 'Active' ? 'status-active' : 'status-inactive');
    const getRoleClass = (role) => (role === 'Manager' ? 'role-manager' : 'role-receptionist');

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Nhân Viên & Quyền Hạn</h2>
                <div className="admin-page-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input type="text" placeholder="Tìm nhân viên..." />
                    </div>
                    <button className="btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm Nhân Viên</span>
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nhân Viên</th>
                            <th>Vai Trò</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockStaff.map((staff) => (
                            <tr key={staff.id}>
                                <td>
                                    <div className="user-info-cell">
                                        <img src={staff.avatar} alt={staff.name} className="user-avatar" />
                                        <div className="user-details">
                                            <span className="user-name">{staff.name}</span>
                                            <span className="user-email">{staff.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`role-badge ${getRoleClass(staff.role)}`}>{staff.role}</span>
                                </td>
                                <td>
                                    <span className={`status-pill ${getStatusClass(staff.status)}`}>{staff.status}</span>
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
