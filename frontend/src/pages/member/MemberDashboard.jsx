import React from 'react';
import './css/MemberDashboard.css'; // Đường dẫn đến file CSS mới
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faClock, faCalendarCheck, faDumbbell, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const { user } = useAuth();

    // Dữ liệu giả lập chi tiết
    const membership = {
        packageName: 'Gói Gold',
        startDate: '2025-09-01',
        endDate: '2026-08-31',
        daysRemaining: 340,
        totalDays: 365
    };
    const membershipProgress = ((membership.totalDays - membership.daysRemaining) / membership.totalDays) * 100;

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
            {/* --- KHU VỰC CHÀO MỪNG --- */}
            <div className="dash-header">
                <img src={user?.avatar || 'https://placehold.co/100x100/333333/FFFFFF?text=User'} alt="Avatar" className="header-avatar-dash" />
                <div className="header-text">
                    <h1>Chào, {user?.name || 'huhuh'}!</h1>
                    <p>Sẵn sàng cho một buổi tập tuyệt vời nào!</p>
                </div>
            </div>

            {/* --- LƯỚI THÔNG TIN CHÍNH --- */}
            <div className="dash-grid">
                {/* THẺ GÓI TẬP */}
                <div className="dash-card membership-card">
                    <h3><FontAwesomeIcon icon={faCrown} /> Gói tập của bạn</h3>
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
        </div>
    );
};

export default Dashboard;

