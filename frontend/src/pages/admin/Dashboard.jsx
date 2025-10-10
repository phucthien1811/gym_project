import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faDollarSign, faUserPlus, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './css/Dashboard.css'; 


import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend
);

const AdminDashboard = () => {
    // Dữ liệu giả lập - sau này sẽ lấy từ API
    const stats = {
        totalMembers: 1250,
        revenue: 150_000_000,
        newMembers: 45,
        activeNow: 78
    };

    const revenueData = {
        labels: ['Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10'],
        datasets: [{
            label: 'Doanh thu (triệu VND)',
            data: [90, 110, 125, 140, 130, 150],
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

    const recentMembers = [
        { id: 1, name: 'Trần Văn Hoàng', joinDate: '2025-09-29', plan: 'Gold 12 Tháng' },
        { id: 2, name: 'Lê Thị Mỹ Duyên', joinDate: '2025-09-28', plan: 'Silver 3 Tháng' },
        { id: 3, name: 'Phạm Minh Nhật', joinDate: '2025-09-28', plan: 'PT 10 Buổi' },
    ];

    return (
        <div className="admin-dashboard-container">
            {/* Hàng thẻ thống kê */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Tổng Hội Viên</p>
                        <p className="stat-value">{stats.totalMembers.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                        <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Doanh Thu Tháng Này</p>
                        <p className="stat-value">{stats.revenue.toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Hội Viên Mới</p>
                        <p className="stat-value">+{stats.newMembers}</p>
                    </div>
                </div>
                <div className="stat-card">
                     <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                        <FontAwesomeIcon icon={faArrowUp} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Đang Hoạt Động</p>
                        <p className="stat-value">{stats.activeNow}</p>
                    </div>
                </div>
            </div>

            {/* Hàng biểu đồ */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3 className="card-title">Tổng Quan Doanh Thu 6 Tháng</h3>
                    <div className="chart-wrapper">
                        <Bar data={revenueData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-card">
                    <h3 className="card-title">Tăng Trưởng Hội Viên Mới</h3>
                     <div className="chart-wrapper">
                        <Line data={newMembersData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Hàng danh sách */}
            <div className="list-grid">
                <div className="list-card">
                    <h3 className="card-title">Hội Viên Mới Gần Đây</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Tên Hội Viên</th>
                                <th>Ngày Tham Gia</th>
                                <th>Gói Tập</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMembers.map(member => (
                                <tr key={member.id}>
                                    <td className="member-name">{member.name}</td>
                                    <td>{member.joinDate}</td>
                                    <td><span className="plan-badge">{member.plan}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
