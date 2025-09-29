import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStar, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import './css/MembershipPackages.css'; // Import file CSS mới

const MembershipPackages = () => {

    // Dữ liệu giả lập - sau này bạn sẽ lấy từ API
    // status: 'active' (gói hiện tại), 'expired' (đã hết hạn), 'none' (chưa đăng ký)
    const packages = [
        {
            id: 1,
            name: 'Gói Silver',
            price: 500000,
            duration: '1 Tháng',
            features: [
                'Sử dụng tất cả thiết bị cardio & tạ',
                'Tham gia các lớp nhóm cơ bản',
                'Sử dụng tủ đồ trong ngày',
                'Không bao gồm HLV cá nhân'
            ],
            status: 'expired'
        },
        {
            id: 2,
            name: 'Gói Gold',
            price: 1200000,
            duration: '3 Tháng',
            features: [
                'Tất cả quyền lợi của Gói Silver',
                'Tham gia tất cả các lớp nhóm (Yoga, Boxing)',
                'Miễn phí 01 buổi đo InBody/tháng',
                'Giảm 10% khi mua hàng tại quầy'
            ],
            status: 'active',
            isRecommended: true // Gói phổ biến nhất
        },
        {
            id: 3,
            name: 'Gói Platinum',
            price: 4500000,
            duration: '12 Tháng',
            features: [
                'Tất cả quyền lợi của Gói Gold',
                'Miễn phí 04 buổi tập cùng HLV cá nhân',
                'Sử dụng khu vực xông hơi, bể sục',
                'Miễn phí gửi xe'
            ],
            status: 'none'
        }
    ];

    const renderButton = (pkg) => {
        switch (pkg.status) {
            case 'active':
                return <button className="btn-renew"><FontAwesomeIcon icon={faSyncAlt} /> Gia Hạn</button>;
            case 'expired':
                return <button className="btn-secondary">Đăng Ký Lại</button>;
            default:
                return <button className="btn-primary">Đăng Ký Ngay</button>;
        }
    };

    return (
        <div className="packages-page-container fade-in">
            <h1 className="page-title">Gói Hội Viên</h1>
            <p className="page-subtitle">Chọn gói tập phù hợp nhất với mục tiêu của bạn.</p>

            <div className="packages-grid">
                {packages.map(pkg => (
                    <div 
                        key={pkg.id} 
                        className={`package-card ${pkg.status === 'active' ? 'current-package' : ''} ${pkg.isRecommended ? 'recommended' : ''}`}
                    >
                        {pkg.isRecommended && <div className="recommended-badge"><FontAwesomeIcon icon={faStar} /> Phổ Biến Nhất</div>}
                        
                        <div className="package-header">
                            <h2 className="package-name">{pkg.name}</h2>
                            {pkg.status === 'active' && <span className="status-badge-active">Gói Hiện Tại</span>}
                            {pkg.status === 'expired' && <span className="status-badge-expired">Đã Hết Hạn</span>}
                        </div>

                        <div className="package-price">
                            {pkg.price.toLocaleString('vi-VN')}đ
                            <span className="package-duration">/ {pkg.duration}</span>
                        </div>

                        <ul className="package-features">
                            {pkg.features.map((feature, index) => (
                                <li key={index}>
                                    <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="package-footer">
                            {renderButton(pkg)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembershipPackages;
