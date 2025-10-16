<<<<<<< HEAD
import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
=======
import React from "react";
// Import các icon từ Font Awesome
import { NavLink } from "react-router-dom";
>>>>>>> origin/main
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faDollarSign, 
    faUserPlus, 
    faCalendarCheck,
    faDumbbell,
    faBoxOpen,
    faChartLine,
    faClock,
    faShoppingCart,
    faExclamationTriangle,
    faTrophy,
    faFire
} from '@fortawesome/free-solid-svg-icons';
import './css/Dashboard.css'; 

import {
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement,
    LineElement, 
    ArcElement,
    Title, 
    Tooltip, 
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement, 
    LineElement, 
    ArcElement,
    Title, 
    Tooltip, 
    Legend
);

const AdminDashboard = () => {
    // Dữ liệu thống kê tổng quan
    const stats = {
        totalMembers: 1250,
        revenue: 150_000_000,
        newMembers: 45,
        activeClasses: 32,
        totalProducts: 156,
        pendingOrders: 12,
        revenueGrowth: 12.5,
        memberGrowth: 8.3
    };

    const revenueData = {
        labels: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'],
        datasets: [{
            label: 'Doanh thu (triệu VND)',
            data: [80, 85, 92, 100, 90, 110, 125, 140, 130, 150, 160, 170],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
        }],
    };

    const newMembersData = {
        labels: ['Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10'],
        datasets: [{
            label: 'Hội viên mới',
            data: [30, 25, 40, 35, 50, 45],
            borderColor: '#10b981',
            tension: 0.4,
            fill: false,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#9ca3af' } } },
        scales: {
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
        },
    };

    // Biểu đồ phân bổ gói tập
    const packageDistribution = {
        labels: ['VIP', 'BASIC', 'PREMIUM'],
        datasets: [{
            data: [200, 320, 280],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',   // VIP - red
                'rgba(59, 130, 246, 0.8)',  // BASIC - blue
                'rgba(245, 158, 11, 0.8)',  // PREMIUM - orange
            ],
            borderWidth: 0,
        }],
    };

    // Hội viên mới gần đây
    const recentMembers = [
        { id: 1, name: 'Trần Văn Hoàng', joinDate: '2025-10-09', plan: 'Gold 12 Tháng', status: 'active' },
        { id: 2, name: 'Lê Thị Mỹ Duyên', joinDate: '2025-10-08', plan: 'Silver 3 Tháng', status: 'active' },
        { id: 3, name: 'Phạm Minh Nhật', joinDate: '2025-10-08', plan: 'PT 10 Buổi', status: 'active' },
        { id: 4, name: 'Nguyễn Thu Hà', joinDate: '2025-10-07', plan: 'Basic 1 Tháng', status: 'active' },
        { id: 5, name: 'Võ Minh Tuấn', joinDate: '2025-10-06', plan: 'Premium 6 Tháng', status: 'active' },
    ];

    // Lớp học sắp diễn ra
    const upcomingClasses = [
        { id: 1, name: 'Yoga Buổi Sáng', time: '06:00', date: '2025-10-12', trainer: 'HLV Mai Anh', participants: 15, maxParticipants: 20 },
        { id: 2, name: 'HIIT Training', time: '08:30', date: '2025-10-12', trainer: 'HLV Tuấn Anh', participants: 18, maxParticipants: 20 },
        { id: 3, name: 'Boxing Cơ Bản', time: '17:00', date: '2025-10-12', trainer: 'HLV Minh Đức', participants: 12, maxParticipants: 15 },
        { id: 4, name: 'Pilates', time: '18:30', date: '2025-10-12', trainer: 'HLV Lan Hương', participants: 10, maxParticipants: 12 },
    ];

    // Sản phẩm bán chạy
    const topProducts = [
        { id: 1, name: 'Whey Protein Gold Standard', sold: 156, revenue: 288600000 },
        { id: 2, name: 'BCAA Xtend', sold: 234, revenue: 152100000 },
        { id: 3, name: 'Găng tay tập gym', sold: 89, revenue: 22250000 },
        { id: 4, name: 'Áo tank top gym', sold: 67, revenue: 23450000 },
    ];

    // Cảnh báo và thông báo
    const alerts = [
        { id: 1, type: 'warning', message: 'Có 12 đơn hàng chưa xử lý', time: '5 phút trước' },
        { id: 2, type: 'info', message: 'Lớp Yoga Buổi Sáng sắp đầy (15/20)', time: '1 giờ trước' },
        { id: 3, type: 'danger', message: 'Sản phẩm Creatine sắp hết hàng', time: '2 giờ trước' },
    ];

    return (
        <div className="db-admin-dashboard-container">
            {/* Header */}
            <div className="db-dashboard-header">
                <div>
                    <h1 className="db-dashboard-title">Dashboard Tổng Quan</h1>
                    <p className="db-dashboard-subtitle">Chào mừng quay trở lại! Đây là tổng quan hệ thống của bạn.</p>
                </div>
                <div className="db-header-actions">
                    <span className="db-last-updated">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</span>
                </div>
            </div>

            {/* Thẻ thống kê chính */}
            <div className="db-stats-grid">
                <div className="db-stat-card db-stat-primary">
                    <div className="db-stat-icon-wrapper">
                        <FontAwesomeIcon icon={faUsers} className="db-stat-icon" />
                    </div>
                    <div className="db-stat-info">
                        <p className="db-stat-label">Tổng Hội Viên</p>
                        <p className="db-stat-value">{stats.totalMembers.toLocaleString()}</p>
                        <span className="db-stat-growth db-positive">
                            <FontAwesomeIcon icon={faChartLine} /> +{stats.memberGrowth}% so với tháng trước
                        </span>
                    </div>
                </div>

                <div className="db-stat-card db-stat-success">
                    <div className="db-stat-icon-wrapper">
                        <FontAwesomeIcon icon={faDollarSign} className="db-stat-icon" />
                    </div>
                    <div className="db-stat-info">
                        <p className="db-stat-label">Doanh Thu Tháng Này</p>
                        <p className="db-stat-value">{(stats.revenue / 1000000).toFixed(0)}M</p>
                        <span className="db-stat-growth db-positive">
                            <FontAwesomeIcon icon={faChartLine} /> +{stats.revenueGrowth}% so với tháng trước
                        </span>
                    </div>
                </div>

                <div className="db-stat-card db-stat-info">
                    <div className="db-stat-icon-wrapper">
                        <FontAwesomeIcon icon={faUserPlus} className="db-stat-icon" />
                    </div>
                    <div className="db-stat-info">
                        <p className="db-stat-label">Hội Viên Mới Tháng Này</p>
                        <p className="db-stat-value">+{stats.newMembers}</p>
                        <span className="db-stat-growth db-neutral">
                            <FontAwesomeIcon icon={faClock} /> 12 người trong tuần này
                        </span>
                    </div>
                </div>

                <div className="db-stat-card db-stat-warning">
                    <div className="db-stat-icon-wrapper">
                        <FontAwesomeIcon icon={faCalendarCheck} className="db-stat-icon" />
                    </div>
                    <div className="db-stat-info">
                        <p className="db-stat-label">Lớp Học Đang Hoạt Động</p>
                        <p className="db-stat-value">{stats.activeClasses}</p>
                        <span className="db-stat-growth db-neutral">
                            <FontAwesomeIcon icon={faDumbbell} /> 8 lớp hôm nay
                        </span>
                    </div>
                </div>

                <div className="db-stat-card db-stat-purple">
                    <div className="db-stat-icon-wrapper">
                        <FontAwesomeIcon icon={faBoxOpen} className="db-stat-icon" />
                    </div>
                    <div className="db-stat-info">
                        <p className="db-stat-label">Sản Phẩm Trong Kho</p>
                        <p className="db-stat-value">{stats.totalProducts}</p>
                        <span className="db-stat-growth db-neutral">
                            <FontAwesomeIcon icon={faShoppingCart} /> 5 sản phẩm sắp hết
                        </span>
                    </div>
                </div>

                <div className="db-stat-card db-stat-danger">
                    <div className="db-stat-icon-wrapper">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="db-stat-icon" />
                    </div>
                    <div className="db-stat-info">
                        <p className="db-stat-label">Đơn Hàng Chờ Xử Lý</p>
                        <p className="db-stat-value">{stats.pendingOrders}</p>
                        <span className="db-stat-growth db-negative">
                            <FontAwesomeIcon icon={faClock} /> Cần xử lý ngay
                        </span>
                    </div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="db-charts-grid">
                <div className="db-chart-card db-chart-large">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faDollarSign} /> Tổng Quan Doanh Thu 12 Tháng
                        </h3>
                    </div>
                    <div className="db-chart-wrapper">
                        <Bar data={revenueData} options={chartOptions} />
                    </div>
                </div>

                <div className="db-chart-card">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faUsers} /> Phân Bổ Gói Tập
                        </h3>
                    </div>
                    <div className="db-chart-wrapper">
                        <Doughnut data={packageDistribution} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { color: '#6b7280', padding: 15 }
                                }
                            }
                        }} />
                    </div>
                </div>

                <div className="db-chart-card">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faUserPlus} /> Tăng Trưởng Hội Viên Mới
                        </h3>
                    </div>
                    <div className="db-chart-wrapper">
                        <Line data={newMembersData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Hàng thông tin chi tiết */}
            <div className="db-details-grid">
                {/* Hội viên mới */}
                <div className="db-list-card">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faUserPlus} /> Hội Viên Mới Gần Đây
                        </h3>
                    </div>
                    <div className="db-table-container">
                        <table className="db-data-table">
                            <thead>
                                <tr>
                                    <th>Tên Hội Viên</th>
                                    <th>Ngày Tham Gia</th>
                                    <th>Gói Tập</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMembers.map(member => (
                                    <tr key={member.id}>
                                        <td className="db-member-name">{member.name}</td>
                                        <td>{member.joinDate}</td>
                                        <td><span className="db-plan-badge">{member.plan}</span></td>
                                        <td><span className="db-status-badge db-status-active">Hoạt động</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Lớp học sắp diễn ra */}
                <div className="db-list-card">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faCalendarCheck} /> Lớp Học Sắp Diễn Ra
                        </h3>
                    </div>
                    <div className="db-class-list">
                        {upcomingClasses.map(classItem => (
                            <div key={classItem.id} className="db-class-item">
                                <div className="db-class-time">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span>{classItem.time}</span>
                                </div>
                                <div className="db-class-info">
                                    <h4 className="db-class-name">{classItem.name}</h4>
                                    <p className="db-class-trainer">{classItem.trainer}</p>
                                </div>
                                <div className="db-class-participants">
                                    <FontAwesomeIcon icon={faUsers} />
                                    <span>{classItem.participants}/{classItem.maxParticipants}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sản phẩm bán chạy */}
                <div className="db-list-card">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faTrophy} /> Sản Phẩm Bán Chạy
                        </h3>
                    </div>
                    <div className="db-product-list">
                        {topProducts.map((product, index) => (
                            <div key={product.id} className="db-product-item">
                                <div className="db-product-rank">
                                    <span className={`db-rank-badge db-rank-${index + 1}`}>#{index + 1}</span>
                                </div>
                                <div className="db-product-info">
                                    <h4 className="db-product-name">{product.name}</h4>
                                    <div className="db-product-stats">
                                        <span className="db-product-sold">
                                            <FontAwesomeIcon icon={faShoppingCart} /> {product.sold} đã bán
                                        </span>
                                        <span className="db-product-revenue">
                                            {(product.revenue / 1000000).toFixed(1)}M VNĐ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cảnh báo */}
                <div className="db-list-card db-alerts-card">
                    <div className="db-card-header">
                        <h3 className="db-card-title">
                            <FontAwesomeIcon icon={faExclamationTriangle} /> Thông Báo & Cảnh Báo
                        </h3>
                    </div>
                    <div className="db-alerts-list">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`db-alert-item db-alert-${alert.type}`}>
                                <div className="db-alert-icon">
                                    <FontAwesomeIcon icon={
                                        alert.type === 'warning' ? faExclamationTriangle :
                                        alert.type === 'danger' ? faFire :
                                        faClock
                                    } />
                                </div>
                                <div className="db-alert-content">
                                    <p className="db-alert-message">{alert.message}</p>
                                    <span className="db-alert-time">{alert.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
