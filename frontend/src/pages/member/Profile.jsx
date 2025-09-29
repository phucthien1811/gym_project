import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCamera } from '@fortawesome/free-solid-svg-icons';
import './css/Profile.css'

// Component con để hiển thị từng dòng thông tin
const InfoRow = ({ label, value }) => (
    <div className="info-row">
        <label>{label}</label>
        <span className="value">{value}</span>
    </div>
);

const Profile = () => {
    // Dữ liệu giả lập, sau này bạn sẽ lấy từ API
    const [userData, setUserData] = useState({
        name: 'Nguyễn Văn A',
        phone: '0987 654 321',
        email: 'nguyenvana@email.com',
        address: '123 Đường ABC, Phường X, Quận Y, TP. HCM',
        height: '175 cm',
        weight: '73 kg',
        membership: {
            planName: 'Gói Gold',
            startDate: '27/08/2025',
            endDate: '27/11/2025',
            daysLeft: 92
        },
        avatar: 'https://via.placeholder.com/150'
    });

    const handleUpdate = () => {
        // Chức năng cập nhật sẽ được xử lý ở đây
        // Ví dụ: Mở một modal/form để chỉnh sửa
        alert('Chức năng cập nhật đang được phát triển!');
    };

    return (
        <div className="profile-container fade-in">
            <h1 className="page-title">Thông Tin Cá Nhân</h1>
            
            <div className="profile-grid">
                {/* Cột Trái: Avatar & Tên */}
                <div className="profile-summary-card">
                    <div className="avatar-container">
                        <img src={userData.avatar} alt="Avatar" className="profile-avatar" />
                        <button className="change-avatar-btn">
                            <FontAwesomeIcon icon={faCamera} />
                        </button>
                    </div>
                    <h2 className="user-name">{userData.name}</h2>
                    <p className="user-email">{userData.email}</p>
                </div>

                {/* Cột Phải: Thông tin chi tiết */}
                <div className="profile-details-card">
                    {/* Phần Gói Hội Viên */}
                    <div className="info-section">
                        <h3 className="info-section-title">Gói Hội Viên</h3>
                        <InfoRow label="Tên gói tập" value={<span className="package-highlight">{userData.membership.planName}</span>} />
                        <InfoRow label="Ngày bắt đầu" value={userData.membership.startDate} />
                        <InfoRow label="Ngày kết thúc" value={userData.membership.endDate} />
                        <InfoRow label="Thời gian còn lại" value={<span className="days-left-highlight">{userData.membership.daysLeft} ngày</span>} />
                    </div>

                    {/* Phần Thông Tin Liên Lạc */}
                    <div className="info-section">
                        <h3 className="info-section-title">Thông Tin Liên Lạc</h3>
                        <InfoRow label="Số điện thoại" value={userData.phone} />
                        <InfoRow label="Địa chỉ" value={userData.address} />
                    </div>

                    {/* Phần Chỉ Số Cơ Thể */}
                    <div className="info-section">
                        <h3 className="info-section-title">Chỉ Số Cơ Thể</h3>
                        <InfoRow label="Chiều cao" value={userData.height} />
                        <InfoRow label="Cân nặng" value={userData.weight} />
                    </div>

                    {/* Nút Cập Nhật */}
                    <div className="update-btn-container">
                        <button className="update-btn" onClick={handleUpdate}>
                            <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: '8px' }} />
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
