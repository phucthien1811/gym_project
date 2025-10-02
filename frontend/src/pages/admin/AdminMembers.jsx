import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faPlus, faPen, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './css/AdminMembers.css'; // Import file CSS mới

const mockMembers = [
    { id: "M001", name: "Alex Carter", email: "alex.c@example.com", plan: "Pro", startDate: "2025-08-10", endDate: "2025-09-10", status: "Active", avatar: "https://placehold.co/40x40/60a5fa/FFFFFF?text=A" },
    { id: "M002", name: "Mia Nguyen", email: "mia.n@example.com", plan: "Basic", startDate: "2025-08-01", endDate: "2025-08-31", status: "Expired", avatar: "https://placehold.co/40x40/f87171/FFFFFF?text=M" },
    { id: "M003", name: "Kenji Park", email: "kenji.p@example.com", plan: "Premium", startDate: "2025-08-20", endDate: "2026-08-20", status: "Active", avatar: "https://placehold.co/40x40/34d399/FFFFFF?text=K" },
    { id: "M004", name: "Sophia Rossi", email: "sophia.r@example.com", plan: "Pro", startDate: "2025-09-01", endDate: "2025-10-01", status: "Active", avatar: "https://placehold.co/40x40/fbbf24/FFFFFF?text=S" },
    { id: "M005", name: "Liam Chen", email: "liam.c@example.com", plan: "Basic", startDate: "2025-07-15", endDate: "2025-08-15", status: "Expired", avatar: "https://placehold.co/40x40/a78bfa/FFFFFF?text=L" },
];

export default function AdminMembers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredMembers = useMemo(() => {
        return mockMembers
            .filter(member => 
                statusFilter === 'All' || member.status === statusFilter
            )
            .filter(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, statusFilter]);
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Active': return 'status-active';
            case 'Expired': return 'status-expired';
            default: return 'status-inactive';
        }
    };

    return (
        <div className="admin-page-container">
            {/* Header của trang */}
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản Lý Hội Viên</h2>
                <div className="admin-page-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tên, email, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Active">Đang hoạt động</option>
                            <option value="Expired">Đã hết hạn</option>
                        </select>
                    </div>
                    <button className="btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm Hội Viên</span>
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Hội Viên</th>
                            <th>Gói Tập</th>
                            <th>Ngày Bắt Đầu</th>
                            <th>Ngày Kết Thúc</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member) => (
                            <tr key={member.id}>
                                <td>
                                    <div className="user-info-cell">
                                        <img src={member.avatar} alt={member.name} className="user-avatar" />
                                        <div className="user-details">
                                            <span className="user-name">{member.name}</span>
                                            <span className="user-email">{member.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{member.plan}</td>
                                <td>{member.startDate}</td>
                                <td>{member.endDate}</td>
                                <td>
                                    <span className={`status-pill ${getStatusClass(member.status)}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn btn-edit">
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button className="action-btn btn-delete">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="pagination-container">
                <button className="pagination-btn" disabled><FontAwesomeIcon icon={faChevronLeft} /></button>
                <span className="page-number active">1</span>
                <span className="page-number">2</span>
                <span className="page-number">3</span>
                <button className="pagination-btn"><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
        </div>
    );
}
