import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { memberProfileService } from '../../services/memberProfileService';
import './css/MemberProfile.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        phone_number: '',
        birth_date: '',
        gender: '',
        address: '',
        height: '',
        weight: '',
        fitness_goal: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.name || profile.full_name || '',
                phone: profile.phone || profile.phone_number || '',
                phone_number: profile.phone || profile.phone_number || '',
                birth_date: profile.birth_date ? profile.birth_date.split('T')[0] : '',
                gender: profile.gender || '',
                address: profile.address || '',
                height: profile.height || '',
                weight: profile.weight || '',
                fitness_goal: profile.fitness_goals || profile.fitness_goal || ''
            });
        }
    }, [profile]);

    // Helper function to format avatar URL
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) {
            // Use a placeholder avatar URL instead of local file
            return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile?.name || profile?.full_name || 'User') + '&size=200&background=4f46e5&color=fff&bold=true';
        }
        if (avatarPath.startsWith('blob:') || avatarPath.startsWith('http')) return avatarPath;
        // Use API endpoint instead of direct static file access
        const filename = avatarPath.replace('/uploads/avatars/', '');
        return `http://localhost:4000/api/v1/uploads/avatars/${filename}`;
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Clear any cached data
            localStorage.removeItem('member_profile');
            
            console.log('🔍 Fetching profile from API...');
            const response = await memberProfileService.getProfile();
            console.log('📥 API Response:', response);
            console.log('📥 Profile data received:', response.data);
            console.log('📞 Phone from response:', response.data?.phone);
            console.log('📞 Phone_number from response:', response.data?.phone_number);
            
            if (response.success) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
            setError('Không thể tải thông tin hồ sơ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { text: 'Thiếu cân', color: '#17a2b8' };
        if (bmi < 25) return { text: 'Bình thường', color: '#28a745' };
        if (bmi < 30) return { text: 'Thừa cân', color: '#ffc107' };
        return { text: 'Béo phì', color: '#dc3545' };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const profileData = new FormData();
            
            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (formData[key] && formData[key] !== '') {
                    // Map phone to phone_number for API
                    if (key === 'phone') {
                        profileData.append('phone_number', formData[key]);
                    } else {
                        profileData.append(key, formData[key]);
                    }
                }
            });
            
            if (avatarFile) {
                profileData.append('avatar', avatarFile);
            }

            console.log('📤 Sending profile update...');
            for (let pair of profileData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await memberProfileService.updateProfile(profileData);
            
            if (response.success) {
                await fetchProfile();
                setIsEditing(false);
                setAvatarFile(null);
                setAvatarPreview(null);
                alert('✅ Cập nhật hồ sơ thành công!');
            }
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            alert('❌ Có lỗi xảy ra khi cập nhật hồ sơ: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        if (profile) {
            setFormData({
                full_name: profile.name || profile.full_name || '',
                phone: profile.phone || profile.phone_number || '',
                phone_number: profile.phone || profile.phone_number || '',
                birth_date: profile.birth_date ? profile.birth_date.split('T')[0] : '',
                gender: profile.gender || '',
                address: profile.address || '',
                height: profile.height || '',
                weight: profile.weight || '',
                fitness_goal: profile.fitness_goals || profile.fitness_goal || ''
            });
        }
    };

    if (loading && !profile) {
        return (
            <div className="mp-container">
                <div className="mp-loading">Đang tải hồ sơ...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mp-container">
                <div className="mp-error-message">
                    <h3>Lỗi tải hồ sơ</h3>
                    <p>{error}</p>
                    <button onClick={fetchProfile} className="mp-retry-btn">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const bmi = profile?.height && profile?.weight 
        ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
        : null;
    const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

    // Calculate days remaining for membership
    const calculateDaysRemaining = () => {
        if (!profile?.membership_end_date) return null;
        const endDate = new Date(profile.membership_end_date);
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = calculateDaysRemaining();

    return (
        <div className="mp-container">
            <div className="mp-header">
                <h2>Hồ Sơ Thành Viên</h2>
                <button 
                    className="mp-edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Hủy chỉnh sửa' : 'Cập nhật thông tin'}
                </button>
            </div>

            <div className="mp-content">
                {/* Column 1: Avatar and Personal Info */}
                <div className="mp-col-1">
                    <div className="mp-avatar-card">
                        <img 
                            src={avatarPreview || getAvatarUrl(profile?.avatar_url)} 
                            alt="Avatar" 
                            className="mp-avatar"
                        />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="avatar-upload" className="mp-avatar-upload-btn">
                                    Thay đổi ảnh
                                </label>
                            </>
                        )}
                        <div className="mp-avatar-name">
                            {profile?.name || profile?.full_name || 'Chưa cập nhật'}
                        </div>
                    </div>

                    <div className="mp-personal-card">
                        <div className="mp-card-header">
                            Thông tin cá nhân
                        </div>
                        <div className="mp-card-content">
                            <div className="mp-info-row">
                                <span className="mp-info-label">Họ và tên</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="mp-input"
                                    />
                                ) : (
                                    <span className="mp-info-value">
                                        {profile?.name || profile?.full_name || 'Chưa cập nhật'}
                                    </span>
                                )}
                            </div>
                            <div className="mp-info-row">
                                <span className="mp-info-label">Email</span>
                                <span className="mp-info-value">{user?.email}</span>
                            </div>
                            <div className="mp-info-row">
                                <span className="mp-info-label">Số điện thoại</span>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mp-input"
                                        placeholder="Nhập số điện thoại"
                                    />
                                ) : (
                                    <span className="mp-info-value">
                                        {profile?.phone || profile?.phone_number || 'Chưa cập nhật'}
                                    </span>
                                )}
                            </div>
                            <div className="mp-info-row">
                                <span className="mp-info-label">Ngày sinh</span>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleInputChange}
                                        className="mp-input"
                                    />
                                ) : (
                                    <span className="mp-info-value">
                                        {profile?.birth_date 
                                            ? new Date(profile.birth_date).toLocaleDateString('vi-VN')
                                            : 'Chưa cập nhật'
                                        }
                                    </span>
                                )}
                            </div>
                            <div className="mp-info-row">
                                <span className="mp-info-label">Giới tính</span>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="mp-input"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                ) : (
                                    <span className="mp-info-value">
                                        {profile?.gender === 'male' ? 'Nam' : 
                                         profile?.gender === 'female' ? 'Nữ' : 
                                         profile?.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                                    </span>
                                )}
                            </div>
                            <div className="mp-info-row">
                                <span className="mp-info-label">Địa chỉ</span>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="mp-input"
                                        rows="2"
                                    />
                                ) : (
                                    <span className="mp-info-value">
                                        {profile?.address || 'Chưa cập nhật'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Body Stats */}
                <div className="mp-col-2">
                    <div className="mp-stats-card">
                        <div className="mp-card-header">
                            Chỉ số hội viên
                        </div>
                        <div className="mp-stats-grid">
                            <div className="mp-stat-item">
                                <span className="mp-stat-label">Chiều cao</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className="mp-input-stat"
                                        placeholder="cm"
                                        min="100"
                                        max="250"
                                    />
                                ) : (
                                    <span className="mp-stat-value">
                                        {profile?.height ? `${profile.height} cm` : 'N/A'}
                                    </span>
                                )}
                            </div>
                            <div className="mp-stat-item">
                                <span className="mp-stat-label">Cân nặng</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="mp-input-stat"
                                        placeholder="kg"
                                        min="30"
                                        max="200"
                                        step="0.1"
                                    />
                                ) : (
                                    <span className="mp-stat-value">
                                        {profile?.weight ? `${profile.weight} kg` : 'N/A'}
                                    </span>
                                )}
                            </div>
                            {bmi && (
                                <div className="mp-stat-item">
                                    <span className="mp-stat-label">BMI</span>
                                    <span className="mp-stat-value">
                                        {bmi}
                                    </span>
                                </div>
                            )}
                            <div className="mp-stat-item">
                                <span className="mp-stat-label">Phân loại</span>
                                <span className="mp-stat-value" style={{ color: bmiCategory?.color || 'rgb(33, 37, 41)', fontSize: '1rem' }}>
                                    {bmiCategory?.text || 'N/A'}
                                </span>
                            </div>
                            <div className="mp-stat-item full-width">
                                <span className="mp-stat-label">Mục tiêu tập luyện</span>
                                {isEditing ? (
                                    <select
                                        name="fitness_goal"
                                        value={formData.fitness_goal}
                                        onChange={handleInputChange}
                                        className="mp-input"
                                    >
                                        <option value="">Chọn mục tiêu</option>
                                        <option value="weight_loss">Giảm cân</option>
                                        <option value="muscle_gain">Tăng cơ</option>
                                        <option value="endurance">Tăng sức bền</option>
                                        <option value="strength">Tăng sức mạnh</option>
                                        <option value="general_fitness">Tăng cường sức khỏe</option>
                                    </select>
                                ) : (
                                    <span className="mp-stat-value" style={{ fontSize: '1rem' }}>
                                        {profile?.fitness_goal === 'weight_loss' ? 'Giảm cân' :
                                         profile?.fitness_goal === 'muscle_gain' ? 'Tăng cơ' :
                                         profile?.fitness_goal === 'endurance' ? 'Tăng sức bền' :
                                         profile?.fitness_goal === 'strength' ? 'Tăng sức mạnh' :
                                         profile?.fitness_goal === 'general_fitness' ? 'Tăng cường sức khỏe' :
                                         'Chưa đặt mục tiêu'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Membership Info */}
                <div className="mp-col-3">
                    <div className="mp-membership-card">
                        <div className="mp-card-header">
                            Thông tin gói hội viên
                        </div>
                        <div className="mp-membership-content">
                            <div className="mp-package-name">
                                {profile?.membership_plan || 'Chưa đăng ký'}
                            </div>
                            
                            {daysRemaining !== null && (
                                <div className="mp-time-remaining">
                                    <span className="mp-time-label">Thời gian còn lại</span>
                                    <span className="mp-time-value">
                                        {daysRemaining} ngày
                                    </span>
                                </div>
                            )}

                            {profile?.membership_start_date && profile?.membership_end_date && (
                                <div className="mp-membership-dates">
                                    <div>Ngày bắt đầu: {new Date(profile.membership_start_date).toLocaleDateString('vi-VN')}</div>
                                    <div>Ngày kết thúc: {new Date(profile.membership_end_date).toLocaleDateString('vi-VN')}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save/Cancel buttons when editing */}
            {isEditing && (
                <div className="mp-form-actions">
                    <button 
                        type="button" 
                        className="mp-save-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button 
                        type="button" 
                        className="mp-cancel-btn"
                        onClick={handleCancel}
                    >
                        Hủy
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;