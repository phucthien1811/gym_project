import React, { useState, useEffect } from 'react';
import './css/MemberDashboard.css'; // Đường dẫn đến file CSS mới
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import memberProfileService from '../../services/memberProfileService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faClock, faCalendarCheck, faDumbbell, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log('🔍 Dashboard: Fetching user profile...');
                const response = await memberProfileService.getProfile();
                console.log('📥 Dashboard: Profile response:', response);
                
                if (response.success && response.data) {
                    setUserProfile(response.data);
                    console.log('✅ Dashboard: Profile loaded:', response.data);
                }
            } catch (error) {
                console.error('❌ Dashboard: Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    // Helper function to get full avatar URL
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return 'https://placehold.co/100x100/333333/FFFFFF?text=User';
        if (avatarPath.startsWith('blob:') || avatarPath.startsWith('http')) return avatarPath;
        const filename = avatarPath.replace('/uploads/avatars/', '');
        return `http://localhost:4000/api/v1/uploads/avatars/${filename}`;
    };

    // Lấy thông tin gói tập từ profile
    const getMembershipInfo = () => {
        if (!userProfile?.membership_plan) {
            return {
                packageName: 'Chưa đăng ký',
                startDate: null,
                endDate: null,
                daysRemaining: 0,
                totalDays: 0,
                isActive: false
            };
        }

        const startDate = new Date(userProfile.membership_start_date);
        const endDate = new Date(userProfile.membership_end_date);
        const today = new Date();
        
        const timeDiff = endDate.getTime() - today.getTime();
        const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        
        const totalTimeDiff = endDate.getTime() - startDate.getTime();
        const totalDays = Math.ceil(totalTimeDiff / (1000 * 3600 * 24));

        return {
            packageName: userProfile.membership_plan,
            startDate: startDate.toLocaleDateString('vi-VN'),
            endDate: endDate.toLocaleDateString('vi-VN'),
            daysRemaining,
            totalDays,
            isActive: daysRemaining > 0
        };
    };

    const membership = getMembershipInfo();
    const membershipProgress = membership.totalDays > 0 
        ? ((membership.totalDays - membership.daysRemaining) / membership.totalDays) * 100 
        : 0;

    const todaysClasses = [
        { time: '18:00', name: 'Lớp Yoga Flow', type: 'yoga', trainer: 'HLV Anna' },
        { time: '19:30', name: 'Tập PT 1:1', type: 'pt', trainer: 'HLV Dũng' },
    ];
    // const todaysClasses = []; // Thử trường hợp không có lịch tập

    const getClassIcon = (type) => {
        switch (type) {
            case 'yoga': return faPersonRunning;
            case 'pt': return faDumbbell;
            default: return faCalendarCheck;
        }
    };

    return (
        <div className="dashboard-container fade-in">
            {loading ? (
                <div className="loading-dashboard">
                    <p>Đang tải thông tin...</p>
                </div>
            ) : (
                <>
                    {/* --- KHU VỰC CHÀO MỪNG --- */}
            <div className="dash-header">
                <img 
                    src={getAvatarUrl(userProfile?.avatar_url)} 
                    alt="Avatar" 
                    className="header-avatar-dash"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/100x100/333333/FFFFFF?text=User';
                    }}
                />
                <div className="header-text">
                    <h1>Chào, {userProfile?.name || user?.name || 'bạn'}!</h1>
                    <p>Sẵn sàng cho một buổi tập tuyệt vời nào!</p>
                </div>
            </div>

            {/* --- LƯỚI THÔNG TIN CHÍNH --- */}
            <div className="dash-grid">
                {/* THẺ GÓI TẬP */}
                <div className="dash-card membership-card">
                    <h3><FontAwesomeIcon icon={faCrown} /> Gói tập của bạn</h3>
                    {membership.isActive ? (
                        <>
                            <div className="package-details">
                                <span className="package-name-main">{membership.packageName}</span>
                                <div className="days-remaining">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span>Còn <strong>{membership.daysRemaining}</strong> ngày</span>
                                </div>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${membershipProgress}%` }}></div>
                            </div>
                            <div className="date-range">
                                <span>{membership.startDate}</span>
                                <span>{membership.endDate}</span>
                            </div>
                        </>
                    ) : (
                        <div className="no-membership">
                            <p>Bạn chưa đăng ký gói tập nào</p>
                            <button className="btn-primary" onClick={() => window.location.href = '/member/packages'}>
                                Đăng ký ngay
                            </button>
                        </div>
                    )}
                </div>

                {/* THẺ LỊCH TẬP HÔM NAY */}
                <div className="dash-card schedule-card">
                    <h3><FontAwesomeIcon icon={faCalendarCheck} /> Lịch tập hôm nay</h3>
                    <div className="schedule-list">
                        {todaysClasses.length > 0 ? (
                            todaysClasses.map((item, index) => (
                                <div key={index} className="session-item-mini">
                                    <div className={`session-icon type-${item.type}`}>
                                        <FontAwesomeIcon icon={getClassIcon(item.type)} />
                                    </div>
                                    <div className="session-info">
                                        <span className="session-name-mini">{item.name}</span>
                                        <span className="trainer-name-mini">{item.trainer}</span>
                                    </div>
                                    <span className="session-time-mini">{item.time}</span>
                                </div>
                            ))
                        ) : (
                            <div className="no-schedule">
                                <p>Hôm nay bạn không có lịch tập nào.</p>
                                <button className="btn-secondary">Đặt lịch ngay</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* THẺ MÃ QR */}
                <div className="dash-card qr-card">
                    <h3>Mã Check-in</h3>
                    <div className="qr-code-wrapper">
                        <QRCodeSVG
                            value={user?.id || "member-123456"}
                            size={160} // Tăng kích thước để rõ hơn
                            level="H"
                            bgColor="#ffffff"
                            fgColor="#000000"
                            includeMargin={false}
                        />
                    </div>
                    <p>Sử dụng mã này tại quầy lễ tân</p>
                </div>
            </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;

