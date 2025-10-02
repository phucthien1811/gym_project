import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { memberProfileService } from '../../services/memberProfileService';
import './css/MemberProfile.css';

const MemberProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        height: '',
        weight: '',
        fitness_goal: ''
    });
    const [errors, setErrors] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await memberProfileService.getProfile();
            if (response.success) {
                setProfile(response.data);
                setFormData({
                    full_name: response.data.full_name || '',
                    phone: response.data.phone || '',
                    date_of_birth: response.data.date_of_birth || '',
                    gender: response.data.gender || '',
                    address: response.data.address || '',
                    height: response.data.height || '',
                    weight: response.data.weight || '',
                    fitness_goal: response.data.fitness_goal || ''
                });
                setAvatarPreview(response.data.avatar_url);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateBMI = () => {
        const height = parseFloat(formData.height);
        const weight = parseFloat(formData.weight);
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            return (weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return null;
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { text: 'Thiếu cân', color: '#17a2b8' };
        if (bmi < 25) return { text: 'Bình thường', color: '#28a745' };
        if (bmi < 30) return { text: 'Thừa cân', color: '#ffc107' };
        return { text: 'Béo phì', color: '#dc3545' };
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Vui lòng nhập họ tên';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (formData.height && (formData.height < 100 || formData.height > 250)) {
            newErrors.height = 'Chiều cao phải từ 100-250cm';
        }

        if (formData.weight && (formData.weight < 30 || formData.weight > 200)) {
            newErrors.weight = 'Cân nặng phải từ 30-200kg';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setLoading(true);
            
            const profileData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    profileData.append(key, formData[key]);
                }
            });
            
            if (avatarFile) {
                profileData.append('avatar', avatarFile);
            }

            const response = await memberProfileService.updateProfile(profileData);
            
            if (response.success) {
                setProfile(response.data);
                setEditing(false);
                setAvatarFile(null);
                alert('Cập nhật hồ sơ thành công!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Có lỗi xảy ra khi cập nhật hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(profile?.avatar_url);
        fetchProfile(); // Reset form data
        setErrors({});
    };

    if (loading && !profile) {
        return (
            <div className="member-profile-container">
                <div className="loading">Đang tải hồ sơ...</div>
            </div>
        );
    }

    const bmi = calculateBMI();
    const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

    return (
        <div className="member-profile-container">
            <div className="profile-header">
                <h2>Hồ Sơ Thành Viên</h2>
                {!editing && (
                    <button 
                        className="edit-btn"
                        onClick={() => setEditing(true)}
                    >
                        Chỉnh sửa hồ sơ
                    </button>
                )}
            </div>

            <div className="profile-content">
                {editing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-grid">
                            {/* Avatar Section */}
                            <div className="avatar-section">
                                <div className="avatar-container">
                                    <img 
                                        src={avatarPreview || '/default-avatar.png'} 
                                        alt="Avatar" 
                                        className="avatar-preview"
                                    />
                                    <input
                                        type="file"
                                        id="avatar"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="avatar" className="avatar-upload-btn">
                                        Thay đổi ảnh
                                    </label>
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="form-section">
                                <h3>Thông tin cá nhân</h3>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Họ và tên *</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            className={errors.full_name ? 'error' : ''}
                                        />
                                        {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={errors.phone ? 'error' : ''}
                                        />
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Ngày sinh</label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Giới tính</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {/* Body Stats */}
                            <div className="form-section">
                                <h3>Chỉ số cơ thể</h3>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Chiều cao (cm)</label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleInputChange}
                                            min="100"
                                            max="250"
                                            className={errors.height ? 'error' : ''}
                                        />
                                        {errors.height && <span className="error-text">{errors.height}</span>}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Cân nặng (kg)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            min="30"
                                            max="200"
                                            step="0.1"
                                            className={errors.weight ? 'error' : ''}
                                        />
                                        {errors.weight && <span className="error-text">{errors.weight}</span>}
                                    </div>
                                </div>

                                {bmi && (
                                    <div className="bmi-display">
                                        <span>BMI: {bmi}</span>
                                        <span 
                                            className="bmi-category"
                                            style={{ color: bmiCategory.color }}
                                        >
                                            ({bmiCategory.text})
                                        </span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Mục tiêu tập luyện</label>
                                    <select
                                        name="fitness_goal"
                                        value={formData.fitness_goal}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Chọn mục tiêu</option>
                                        <option value="weight_loss">Giảm cân</option>
                                        <option value="muscle_gain">Tăng cơ</option>
                                        <option value="endurance">Tăng sức bền</option>
                                        <option value="strength">Tăng sức mạnh</option>
                                        <option value="general_fitness">Tăng cường sức khỏe</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={handleCancel}>
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-view">
                        {/* Avatar */}
                        <div className="avatar-section">
                            <img 
                                src={profile?.avatar_url || '/default-avatar.png'} 
                                alt="Avatar" 
                                className="avatar-display"
                            />
                        </div>

                        {/* Personal Info */}
                        <div className="info-section">
                            <h3>Thông tin cá nhân</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="label">Họ và tên:</span>
                                    <span className="value">{profile?.full_name || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Email:</span>
                                    <span className="value">{user?.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Số điện thoại:</span>
                                    <span className="value">{profile?.phone || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Ngày sinh:</span>
                                    <span className="value">
                                        {profile?.date_of_birth 
                                            ? new Date(profile.date_of_birth).toLocaleDateString('vi-VN')
                                            : 'Chưa cập nhật'
                                        }
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Giới tính:</span>
                                    <span className="value">
                                        {profile?.gender === 'male' ? 'Nam' : 
                                         profile?.gender === 'female' ? 'Nữ' : 
                                         profile?.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="info-item full-width">
                                    <span className="label">Địa chỉ:</span>
                                    <span className="value">{profile?.address || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Body Stats */}
                        <div className="info-section">
                            <h3>Chỉ số cơ thể</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">Chiều cao</span>
                                    <span className="stat-value">
                                        {profile?.height ? `${profile.height} cm` : 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Cân nặng</span>
                                    <span className="stat-value">
                                        {profile?.weight ? `${profile.weight} kg` : 'Chưa cập nhật'}
                                    </span>
                                </div>
                                {profile?.height && profile?.weight && (
                                    <div className="stat-item">
                                        <span className="stat-label">BMI</span>
                                        <span className="stat-value">
                                            {((profile.weight / ((profile.height / 100) ** 2)).toFixed(1))}
                                        </span>
                                    </div>
                                )}
                                <div className="stat-item full-width">
                                    <span className="stat-label">Mục tiêu tập luyện</span>
                                    <span className="stat-value">
                                        {profile?.fitness_goal === 'weight_loss' ? 'Giảm cân' :
                                         profile?.fitness_goal === 'muscle_gain' ? 'Tăng cơ' :
                                         profile?.fitness_goal === 'endurance' ? 'Tăng sức bền' :
                                         profile?.fitness_goal === 'strength' ? 'Tăng sức mạnh' :
                                         profile?.fitness_goal === 'general_fitness' ? 'Tăng cường sức khỏe' :
                                         'Chưa cập nhật'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Membership Info */}
                        <div className="info-section">
                            <h3>Thông tin hội viên</h3>
                            <div className="membership-info">
                                <div className="membership-status">
                                    <span className="status-label">Gói hội viên:</span>
                                    <span className="status-value">
                                        {profile?.membership_plan || 'Chưa đăng ký'}
                                    </span>
                                </div>
                                {profile?.membership_start_date && profile?.membership_end_date && (
                                    <div className="membership-dates">
                                        <span>
                                            {new Date(profile.membership_start_date).toLocaleDateString('vi-VN')} 
                                            {' - '}
                                            {new Date(profile.membership_end_date).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberProfile;