import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faCheckCircle, faEye, faEyeSlash, faUsers, faSearch } from '@fortawesome/free-solid-svg-icons';
import './css/AdminPlans.css';

const AdminPlans = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);
    const [packageMembers, setPackageMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration_days: '',
        features: [''],
        is_published: false
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/v1/packages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                // Parse features từ JSON string
                const packagesWithParsedFeatures = data.data.map(pkg => ({
                    ...pkg,
                    features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features
                }));
                setPackages(packagesWithParsedFeatures);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = currentPackage ? 'PUT' : 'POST';
        const url = currentPackage ? `http://localhost:4000/api/v1/packages/${currentPackage.id}` : 'http://localhost:4000/api/v1/packages/test';
        
        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            duration_days: parseInt(formData.duration_days),
            features: formData.features.filter(f => f.trim() !== '').length > 0 
                ? formData.features.filter(f => f.trim() !== '')
                : ['Gói tập cơ bản'] // Default feature nếu không có
        };

        try {
            console.log('Submitting data:', submitData);
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                    // Tạm thời bỏ auth: 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(submitData)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                setShowModal(false);
                setCurrentPackage(null);
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    duration_days: '',
                    features: [''],
                    is_published: false
                });
                fetchPackages();
            }
        } catch (error) {
            console.error('Error saving package:', error);
        }
    };

    const handleEdit = (pkg) => {
        setCurrentPackage(pkg);
        setFormData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price.toString(),
            duration_days: pkg.duration_days.toString(),
            features: Array.isArray(pkg.features) ? pkg.features : [],
            is_published: pkg.is_published
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa gói tập này?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/v1/packages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchPackages();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const togglePublished = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/packages/${id}/toggle-published`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchPackages();
            }
        } catch (error) {
            console.error('Error toggling published status:', error);
        }
    };

    const viewMembers = async (pkg) => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/packages/${pkg.id}/members`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setPackageMembers(data.data);
                setCurrentPackage(pkg);
                setShowMembersModal(true);
            }
        } catch (error) {
            console.error('Error fetching package members:', error);
        }
    };

    const addFeatureField = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeatureField = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index, value) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    if (loading) return <div>Loading...</div>;

    // Filter packages based on search term
    const filteredPackages = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(pkg.features) && pkg.features.some(feature => 
            feature.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản Lý Gói Thành Viên</h2>
            </div>

            {/* Search and Action Bar */}
            <div className="apl-search-action-bar">
                <div className="apl-search-input">
                    <FontAwesomeIcon icon={faSearch} className="apl-search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm gói tập theo tên, mô tả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    className="apl-btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Tạo Gói Mới</span>
                </button>
            </div>

            <div className="apl-plans-grid">
                {filteredPackages.map(pkg => (
                    <div key={pkg.id} className="apl-plan-card">
                        <div className="apl-plan-header">
                            <h3 className="apl-plan-name">{pkg.name}</h3>
                            <div className="apl-plan-actions">
                                <button 
                                    className="apl-action-btn apl-btn-info"
                                    onClick={() => viewMembers(pkg)}
                                    title="Xem thành viên"
                                >
                                    <FontAwesomeIcon icon={faUsers} />
                                    <span className="apl-member-count">{pkg.active_members || 0}</span>
                                </button>
                                <button 
                                    className="apl-action-btn btn-secondary"
                                    onClick={() => togglePublished(pkg.id)}
                                    title={pkg.is_published ? 'Ẩn gói' : 'Hiển thị gói'}
                                >
                                    <FontAwesomeIcon icon={pkg.is_published ? faEyeSlash : faEye} />
                                </button>
                                <button 
                                    className="action-btn btn-edit"
                                    onClick={() => handleEdit(pkg)}
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button 
                                    className="action-btn btn-delete"
                                    onClick={() => handleDelete(pkg.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                        <div className="apl-plan-pricing">
                            <span className="apl-plan-price">{pkg.price.toLocaleString('vi-VN')}đ</span>
                            <span className="apl-plan-duration">/ {Math.floor(pkg.duration_days / 30)} tháng</span>
                        </div>
                        <ul className="apl-plan-features">
                            {(Array.isArray(pkg.features) ? pkg.features : []).map((feature, index) => (
                                <li key={index}>
                                    <FontAwesomeIcon icon={faCheckCircle} /> 
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="apl-plan-footer">
                            <span className={`apl-status-pill ${pkg.is_published ? 'apl-status-active' : 'apl-status-inactive'}`}>
                                {pkg.is_published ? 'Đang hiển thị' : 'Bản nháp'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Tạo/Sửa Package */}
            {showModal && (
                <div className="apl-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="apl-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="apl-modal-header">
                            <h3>{currentPackage ? 'Sửa Gói Tập' : 'Tạo Gói Tập Mới'}</h3>
                            <button 
                                className="apl-modal-close"
                                onClick={() => setShowModal(false)}
                            >×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="apl-form-group">
                                <label>Tên gói:</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="apl-form-group">
                                <label>Mô tả:</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                                    rows="3"
                                />
                            </div>
                            <div className="apl-form-row">
                                <div className="apl-form-group">
                                    <label>Giá (VNĐ):</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData(prev => ({...prev, price: e.target.value}))}
                                        required
                                    />
                                </div>
                                <div className="apl-form-group">
                                    <label>Thời hạn (ngày):</label>
                                    <input
                                        type="number"
                                        value={formData.duration_days}
                                        onChange={e => setFormData(prev => ({...prev, duration_days: e.target.value}))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="apl-form-group">
                                <label>Tính năng:</label>
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="apl-feature-input">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={e => updateFeature(index, e.target.value)}
                                            placeholder="Nhập tính năng"
                                        />
                                        {formData.features.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeatureField(index)}
                                                className="apl-btn-remove-feature"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addFeatureField}
                                    className="apl-btn-add-feature"
                                >
                                    + Thêm tính năng
                                </button>
                            </div>
                            <div className="apl-form-group">
                                <label className="apl-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={e => setFormData(prev => ({...prev, is_published: e.target.checked}))}
                                    />
                                    Hiển thị công khai
                                </label>
                            </div>
                            <div className="apl-modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="apl-btn-secondary">
                                    Hủy
                                </button>
                                <button type="submit" className="apl-btn-primary">
                                    {currentPackage ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xem Members */}
            {showMembersModal && (
                <div className="apl-modal-overlay" onClick={() => setShowMembersModal(false)}>
                    <div className="apl-modal-content apl-modal-large" onClick={e => e.stopPropagation()}>
                        <div className="apl-modal-header">
                            <h3>Thành viên gói {currentPackage?.name}</h3>
                            <button 
                                className="apl-modal-close"
                                onClick={() => setShowMembersModal(false)}
                            >×</button>
                        </div>
                        <div className="apl-members-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên thành viên</th>
                                        <th>Email</th>
                                        <th>SĐT</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                        <th>Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packageMembers.map(member => (
                                        <tr key={member.id}>
                                            <td>{member.full_name}</td>
                                            <td>{member.email}</td>
                                            <td>{member.phone}</td>
                                            <td>{new Date(member.start_date).toLocaleDateString('vi-VN')}</td>
                                            <td>{new Date(member.end_date).toLocaleDateString('vi-VN')}</td>
                                            <td>
                                                <span className={`apl-status-pill apl-status-${member.status}`}>
                                                    {member.status === 'active' ? 'Đang hoạt động' : 
                                                     member.status === 'expired' ? 'Hết hạn' : 'Đã hủy'}
                                                </span>
                                            </td>
                                            <td>{member.paid_amount.toLocaleString('vi-VN')}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlans;
