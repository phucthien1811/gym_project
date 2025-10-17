import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFilter, 
    faPlus, 
    faPen, 
    faTrash, 
    faChevronLeft, 
    faChevronRight,
    faToggleOn,
    faToggleOff,
    faTimes,
    faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import './css/AdminMembers.css';
import { useToast } from '../../context/ToastContext';

export default function AdminMembers() {
    const { showSuccess, showError } = useToast();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'member'
    });

    // Fetch members từ API
    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                status: statusFilter
            });

            const response = await fetch(`/api/v1/users?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            if (data.success) {
                setMembers(data.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination?.total || 0,
                    totalPages: data.pagination?.totalPages || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching members:', error);
            showError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, searchTerm, statusFilter, showError]);

    // Fetch stats từ API
    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/users/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch stats');

            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
        fetchStats();
    }, [fetchMembers, fetchStats]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddMember = async () => {
        if (!newMember.name || !newMember.email || !newMember.password) {
            showError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMember)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to create user');
            }

            showSuccess('Thêm người dùng thành công!');
            setNewMember({
                name: '',
                email: '',
                password: '',
                phone: '',
                role: 'member'
            });
            setShowAddModal(false);
            fetchMembers();
            fetchStats();
        } catch (error) {
            showError(error.message || 'Có lỗi xảy ra khi thêm người dùng');
        }
    };

    const handleEditClick = (member) => {
        setEditingMember({
            id: member.id,
            name: member.name,
            email: member.email,
            phone: member.phone || '',
            role: member.role,
            password: ''
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

    const handleUpdateMember = async () => {
        if (!editingMember.name || !editingMember.email) {
            showError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                name: editingMember.name,
                email: editingMember.email,
                phone: editingMember.phone,
                role: editingMember.role
            };

            // Chỉ gửi password nếu có nhập
            if (editingMember.password && editingMember.password.trim()) {
                updateData.password = editingMember.password;
            }

            const response = await fetch(`/api/v1/users/${editingMember.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to update user');
            }

            showSuccess('Cập nhật người dùng thành công!');
            setShowEditModal(false);
            setEditingMember(null);
            fetchMembers();
        } catch (error) {
            showError(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
        }
    };

    const handleDeleteUser = async (member) => {
        if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${member.name}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/users/${member.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to delete user');
            }

            showSuccess('Xóa người dùng thành công!');
            fetchMembers();
            fetchStats();
        } catch (error) {
            showError(error.message || 'Không thể xóa người dùng');
        }
    };

    const handleToggleStatus = async (member) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/users/${member.id}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to toggle status');
            }

            showSuccess(data.data.is_active ? 'Đã kích hoạt người dùng' : 'Đã tắt người dùng');
            fetchMembers();
            fetchStats();
        } catch (error) {
            showError(error.message || 'Không thể thay đổi trạng thái');
        }
    };

    // Helper functions - Định nghĩa trước để sử dụng trong handleExportExcel
    const getRoleName = (role) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'trainer': return 'Huấn luyện viên';
            case 'member': return 'Hội viên';
            default: return role;
        }
    };

    const getStatusClass = (isActive) => {
        return isActive ? 'am-status-active' : 'am-status-expired';
    };

    const getAvatarPlaceholder = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Lấy tất cả users (không phân trang) để xuất
            const response = await fetch(`/api/v1/users?page=1&limit=9999&search=${searchTerm}&status=${statusFilter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            if (!data.success || !data.data || data.data.length === 0) {
                showError('Không có dữ liệu để xuất');
                return;
            }

            // Chuẩn bị dữ liệu cho Excel
            const excelData = data.data.map(user => ({
                'Họ và Tên': user.name || '',
                'Email': user.email || '',
                'Số Điện Thoại': user.phone || '',
                'Vai Trò': getRoleName(user.role),
                'Trạng Thái': user.is_active ? 'Hoạt động' : 'Không hoạt động'
            }));

            // Tạo workbook và worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Tự động điều chỉnh độ rộng cột
            const colWidths = [
                { wch: 25 }, // Họ và Tên
                { wch: 30 }, // Email
                { wch: 15 }, // Số Điện Thoại
                { wch: 20 }, // Vai Trò
                { wch: 20 }  // Trạng Thái
            ];
            ws['!cols'] = colWidths;

            // Thêm worksheet vào workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Danh sách người dùng');

            // Tạo tên file với thời gian hiện tại
            const now = new Date();
            const fileName = `DanhSachNguoiDung_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.xlsx`;

            // Xuất file
            XLSX.writeFile(wb, fileName);
            
            showSuccess(`Đã xuất ${excelData.length} người dùng ra file Excel`);
        } catch (error) {
            console.error('Error exporting Excel:', error);
            showError('Không thể xuất file Excel');
        } finally {
            setLoading(false);
        }
    };

    if (loading && members.length === 0) {
        return (
            <div className="am-admin-page-container">
                <div className="loading-spinner">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="am-admin-page-container">
            {/* Header */}
            <div className="am-admin-page-header">
                <h3 className="am-admin-page-title">Quản Lý Người Dùng</h3>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                    <div>
                        <span style={{ color: '#6b7280' }}>Tổng: </span>
                        <strong>{stats.total || 0}</strong>
                    </div>
                    <div>
                        <span style={{ color: '#6b7280' }}>Hoạt động: </span>
                        <strong style={{ color: '#10b981' }}>{stats.active || 0}</strong>
                    </div>
                    <div>
                        <span style={{ color: '#6b7280' }}>Tắt: </span>
                        <strong style={{ color: '#ef4444' }}>{stats.inactive || 0}</strong>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="am-admin-page-actions">
                <div className="am-search-bar">
                    <FontAwesomeIcon icon={faSearch} className="am-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                    />
                </div>
                <div className="am-filter-group">
                    <FontAwesomeIcon icon={faFilter} className="am-filter-icon" />
                    <select 
                        value={statusFilter} 
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Đã tắt</option>
                    </select>
                </div>
                <button className="am-btn-primary" onClick={() => setShowAddModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Thêm Người Dùng</span>
                </button>
            </div>

            {/* Table */}
            <div className="am-admin-table-container">
                <table className="am-admin-table">
                    <thead>
                        <tr>
                            <th>Người Dùng</th>
                            <th>Vai Trò</th>
                            <th>Số Điện Thoại</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="am-user-info-cell">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt={member.name} className="am-user-avatar" />
                                            ) : (
                                                <div className="am-user-avatar" style={{ 
                                                    background: '#43a047', 
                                                    color: 'white', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontWeight: 600
                                                }}>
                                                    {getAvatarPlaceholder(member.name)}
                                                </div>
                                            )}
                                            <div className="am-user-details">
                                                <span className="am-user-name">{member.name}</span>
                                                <span className="am-user-email">{member.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{getRoleName(member.role)}</td>
                                    <td>{member.phone || '-'}</td>
                                    <td>
                                        <span className={`am-status-pill ${getStatusClass(member.is_active)}`}>
                                            {member.is_active ? 'Có' : 'Không'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="am-action-buttons">
                                            <button 
                                                className={`am-action-btn am-btn-toggle ${!member.is_active ? 'am-disabled' : ''}`}
                                                title={member.is_active ? 'Tắt trạng thái' : 'Bật trạng thái'}
                                                onClick={() => handleToggleStatus(member)}
                                            >
                                                <FontAwesomeIcon icon={member.is_active ? faToggleOn : faToggleOff} />
                                            </button>
                                            <button 
                                                className="am-action-btn am-btn-edit" 
                                                title="Chỉnh sửa" 
                                                onClick={() => handleEditClick(member)}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                            <button 
                                                className="am-action-btn am-btn-delete" 
                                                title="Xóa"
                                                onClick={() => handleDeleteUser(member)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="am-pagination-container">
                <button className="am-btn-export-excel" onClick={handleExportExcel}>
                    <FontAwesomeIcon icon={faFileExcel} />
                    <span>Xuất Excel</span>
                </button>
                <div className="am-pagination-controls">
                    <button 
                        className="am-pagination-btn" 
                        disabled={pagination.page === 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <span className="am-page-number am-active">{pagination.page}</span>
                    <button 
                        className="am-pagination-btn"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>

            {/* Modal Thêm Người Dùng */}
            {showAddModal && (
                <div className="am-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="am-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="am-modal-header">
                            <h3>Thêm Người Dùng Mới</h3>
                            <button 
                                className="am-modal-close"
                                onClick={() => setShowAddModal(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="am-modal-body">
                            <div className="am-form-group">
                                <label>Họ và tên <span className="am-required">*</span></label>
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
                                <label>Email <span className="am-required">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newMember.email}
                                    onChange={handleInputChange}
                                    placeholder="Nhập email"
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            <div className="am-form-group">
                                <label>Mật khẩu <span className="am-required">*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newMember.password}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="am-form-row">
                                <div className="am-form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={newMember.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Vai trò</label>
                                    <select
                                        name="role"
                                        value={newMember.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="member">Hội viên</option>
                                        <option value="trainer">Huấn luyện viên</option>
                                    </select>
                                </div>
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
                                className="am-btn-submit"
                                onClick={handleAddMember}
                            >
                                Thêm Người Dùng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chỉnh Sửa Người Dùng */}
            {showEditModal && editingMember && (
                <div className="am-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="am-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="am-modal-header">
                            <h3>Chỉnh Sửa Người Dùng</h3>
                            <button 
                                className="am-modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="am-modal-body">
                            <div className="am-form-group">
                                <label>Họ và tên <span className="am-required">*</span></label>
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
                                <label>Email <span className="am-required">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editingMember.email}
                                    onChange={handleEditInputChange}
                                    placeholder="Nhập email"
                                    autoComplete="off"
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
                                    placeholder="Để trống nếu không đổi mật khẩu"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="am-form-row">
                                <div className="am-form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editingMember.phone}
                                        onChange={handleEditInputChange}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="am-form-group">
                                    <label>Vai trò</label>
                                    <select
                                        name="role"
                                        value={editingMember.role}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="member">Hội viên</option>
                                        <option value="trainer">Huấn luyện viên</option>
                                    </select>
                                </div>
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
                                className="am-btn-submit"
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
