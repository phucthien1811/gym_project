import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFilter, 
    faPlus, 
    faPen, 
    faTrash, 
    faChevronLeft, 
    faChevronRight,
    faExclamationTriangle,
    faToggleOn,
    faToggleOff,
    faTimes,
    faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminMembers.css'; // Import file CSS mới

// Mock data cho các gói tập
const mockPackages = [
    { id: 1, name: "Gói Basic", duration: 30, price: 500000, description: "Tập luyện cơ bản" },
    { id: 2, name: "Gói Standard", duration: 90, price: 1200000, description: "Tập luyện tiêu chuẩn với HLV" },
    { id: 3, name: "Gói Premium", duration: 180, price: 2000000, description: "Tập luyện cao cấp + dinh dưỡng" },
    { id: 4, name: "Gói VIP", duration: 365, price: 3500000, description: "Toàn diện 1 năm" }
];

const mockMembers = [
    { id: "M001", name: "Nguyễn Văn Hùng", email: "hungnv@example.com", plan: "Pro", startDate: "2025-08-10", endDate: "2025-09-10", status: "Có", avatar: "https://placehold.co/40x40/60a5fa/FFFFFF?text=H" },
    { id: "M002", name: "Trần Thị Mai", email: "maitt@example.com", plan: "Basic", startDate: "2025-08-01", endDate: "2025-08-31", status: "Không", avatar: "https://placehold.co/40x40/f87171/FFFFFF?text=M" },
    { id: "M003", name: "Lê Minh Tuấn", email: "tuanlm@example.com", plan: "Premium", startDate: "2025-08-20", endDate: "2026-08-20", status: "Có", avatar: "https://placehold.co/40x40/34d399/FFFFFF?text=T" },
    { id: "M004", name: "Phạm Thu Hương", email: "huongpt@example.com", plan: "Pro", startDate: "2025-09-01", endDate: "2025-10-01", status: "Có", avatar: "https://placehold.co/40x40/fbbf24/FFFFFF?text=H" },
    { id: "M005", name: "Hoàng Đức Anh", email: "anhhd@example.com", plan: "Basic", startDate: "2025-07-15", endDate: "2025-08-15", status: "Không", avatar: "https://placehold.co/40x40/a78bfa/FFFFFF?text=A" },
];

export default function AdminMembers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        password: '',
        selectedPackage: null,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    const handlePackageSelect = (packageData) => {
        setNewMember(prev => ({
            ...prev,
            selectedPackage: packageData
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddMember = () => {
        // Add validation logic here
        if (!newMember.name || !newMember.email || !newMember.password || !newMember.selectedPackage) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        // Here you would typically send data to API
        console.log('Adding member:', newMember);
        alert('Thêm thành viên thành công!');
        
        // Reset form and close modal
        setNewMember({
            name: '',
            email: '',
            password: '',
            selectedPackage: null,
            startDate: new Date().toISOString().split('T')[0],
            endDate: ''
        });
        setShowAddModal(false);
    };

    const handleEditClick = (member) => {
        // Find the package that matches the member's plan
        const memberPackage = mockPackages.find(pkg => pkg.name === member.plan);
        
        setEditingMember({
            ...member,
            name: member.name,
            email: member.email,
            password: '', // Don't show existing password
            selectedPackage: memberPackage || null,
            startDate: member.startDate,
            endDate: member.endDate
        });
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingMember(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditPackageSelect = (packageData) => {
        setEditingMember(prev => ({
            ...prev,
            selectedPackage: packageData
        }));
    };

    const handleUpdateMember = () => {
        // Add validation logic here
        if (!editingMember.name || !editingMember.email || !editingMember.selectedPackage) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        // Here you would typically send data to API
        console.log('Updating member:', editingMember);
        alert('Cập nhật thành viên thành công!');
        
        // Close modal and reset
        setShowEditModal(false);
        setEditingMember(null);
    };

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
            case 'Có': return 'am-status-active';
            case 'Không': return 'am-status-expired';
            default: return 'am-status-inactive';
        }
    };

    const handleWarning = (member) => {
        alert(`Cảnh báo cho hội viên: ${member.name}`);
    };

    const handleToggleStatus = (member) => {
        // Logic để toggle trạng thái hội viên
        console.log(`Toggle status for member: ${member.name}, current status: ${member.status}`);
    };

    const handleExportExcel = () => {
        // Logic để xuất file Excel
        console.log('Exporting to Excel...');
        alert('Xuất file Excel thành công!');
    };

    return (
        <div className="am-admin-page-container">
            {/* Header của trang */}
            <div className="am-admin-page-header">
                <h3 className="am-admin-page-title">Quản Lý Hội Viên</h3>
                <div className="am-admin-page-actions">
                    <div className="am-search-bar">
                        <FontAwesomeIcon icon={faSearch} className="am-search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tên, email, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="am-filter-group">
                        <FontAwesomeIcon icon={faFilter} className="am-filter-icon" />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Active">Đang hoạt động</option>
                            <option value="Expired">Đã hết hạn</option>
                        </select>
                    </div>
                    <button className="am-btn-primary" onClick={() => setShowAddModal(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm Hội Viên</span>
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="am-admin-table-container">
                <table className="am-admin-table">
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
                                    <div className="am-user-info-cell">
                                        <img src={member.avatar} alt={member.name} className="am-user-avatar" />
                                        <div className="am-user-details">
                                            <span className="am-user-name">{member.name}</span>
                                            <span className="am-user-email">{member.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{member.plan}</td>
                                <td>{member.startDate}</td>
                                <td>{member.endDate}</td>
                                <td>
                                    <span className={`am-status-pill ${getStatusClass(member.status)}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="am-action-buttons">
                                        <button 
                                            className="am-action-btn am-btn-warning"
                                            title="Cảnh báo"
                                            onClick={() => handleWarning(member)}
                                        >
                                            <FontAwesomeIcon icon={faExclamationTriangle} />
                                        </button>
                                        <button 
                                            className={`am-action-btn am-btn-toggle ${member.status === 'Không' ? 'am-disabled' : ''}`}
                                            title={member.status === 'Có' ? 'Tắt trạng thái' : 'Bật trạng thái'}
                                            onClick={() => handleToggleStatus(member)}
                                        >
                                            <FontAwesomeIcon icon={member.status === 'Có' ? faToggleOn : faToggleOff} />
                                        </button>
                                        <button className="am-action-btn am-btn-edit" title="Chỉnh sửa" onClick={() => handleEditClick(member)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button className="am-action-btn am-btn-delete" title="Xóa">
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
            <div className="am-pagination-container">
                <button className="am-btn-export-excel" onClick={handleExportExcel}>
                    <FontAwesomeIcon icon={faFileExcel} />
                    <span>Xuất Excel</span>
                </button>
                <div className="am-pagination-controls">
                    <button className="am-pagination-btn" disabled><FontAwesomeIcon icon={faChevronLeft} /></button>
                    <span className="am-page-number am-active">1</span>
                    <span className="am-page-number">2</span>
                    <span className="am-page-number">3</span>
                    <button className="am-pagination-btn"><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            </div>

            {/* Modal Thêm Hội Viên */}
            {showAddModal && (
                <div className="am-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="am-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="am-modal-header">
                            <h3>Thêm Hội Viên Mới</h3>
                            <button 
                                className="am-modal-close-btn"
                                onClick={() => setShowAddModal(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="am-modal-body">
                            <div className="am-form-grid">
                                <div className="am-form-group">
                                    <label>Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newMember.name}
                                        onChange={handleInputChange}
                                        placeholder="Nhập họ và tên"
                                        required
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newMember.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập email"
                                        required
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Mật khẩu *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newMember.password}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mật khẩu"
                                        required
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={newMember.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="am-form-group">
                                <label>Chọn gói tập *</label>
                                <select
                                    value={newMember.selectedPackage?.id || ''}
                                    onChange={(e) => {
                                        const selectedPkg = mockPackages.find(pkg => pkg.id === parseInt(e.target.value));
                                        handlePackageSelect(selectedPkg || null);
                                    }}
                                    required
                                >
                                    <option value="">-- Chọn gói tập --</option>
                                    {mockPackages.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="am-form-group">
                                <label>Ngày kết thúc</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={newMember.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="am-modal-footer">
                            <button 
                                className="am-btn-secondary"
                                onClick={() => setShowAddModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="am-btn-primary"
                                onClick={handleAddMember}
                            >
                                Thêm Hội Viên
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chỉnh Sửa Hội Viên */}
            {showEditModal && editingMember && (
                <div className="am-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="am-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="am-modal-header">
                            <h3>Chỉnh Sửa Hội Viên</h3>
                            <button 
                                className="am-modal-close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="am-modal-body">
                            <div className="am-form-grid">
                                <div className="am-form-group">
                                    <label>Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingMember.name}
                                        onChange={handleEditInputChange}
                                        placeholder="Nhập họ và tên"
                                        required
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editingMember.email}
                                        onChange={handleEditInputChange}
                                        placeholder="Nhập email"
                                        required
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={editingMember.password}
                                        onChange={handleEditInputChange}
                                        placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={editingMember.startDate}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                            </div>

                            <div className="am-form-group">
                                <label>Chọn gói tập *</label>
                                <select
                                    value={editingMember.selectedPackage?.id || ''}
                                    onChange={(e) => {
                                        const selectedPkg = mockPackages.find(pkg => pkg.id === parseInt(e.target.value));
                                        handleEditPackageSelect(selectedPkg || null);
                                    }}
                                    required
                                >
                                    <option value="">-- Chọn gói tập --</option>
                                    {mockPackages.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="am-form-group">
                                <label>Ngày kết thúc</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={editingMember.endDate}
                                    onChange={handleEditInputChange}
                                />
                            </div>
                        </div>

                        <div className="am-modal-footer">
                            <button 
                                className="am-btn-secondary"
                                onClick={() => setShowEditModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="am-btn-primary"
                                onClick={handleUpdateMember}
                            >
                                Cập Nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
