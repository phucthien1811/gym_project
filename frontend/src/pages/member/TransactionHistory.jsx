import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faCalendarAlt, faReceipt } from '@fortawesome/free-solid-svg-icons';
import './css/TransactionHistory.css'; // Import file CSS mới

const TransactionHistory = () => {
    const [activeFilter, setActiveFilter] = useState('Tất cả');

    // Dữ liệu giả lập chi tiết hơn
    const allTransactions = [
        { id: '#TRX001', date: '2025-09-15', type: 'Gói tập', description: 'Gia hạn Gói Gold 12 tháng', amount: 8500000, status: 'Thành công' },
        { id: '#TRX002', date: '2025-09-20', type: 'Mua hàng', description: 'Whey Protein, BCAA', amount: 1200000, status: 'Thành công' },
        { id: '#TRX003', date: '2025-09-22', type: 'PT', description: 'Buổi tập với HLV John', amount: 500000, status: 'Thành công' },
        { id: '#TRX004', date: '2025-09-24', type: 'Mua hàng', description: 'Nước tăng lực, khăn lau', amount: 85000, status: 'Thất bại' },
        { id: '#TRX005', date: '2025-09-26', type: 'Hoàn tiền', description: 'Hoàn tiền đơn hàng #ORD003', amount: -250000, status: 'Hoàn tất' }
    ];

    // Lọc giao dịch
    const filteredTransactions = activeFilter === 'Tất cả'
        ? allTransactions
        : allTransactions.filter(t => t.type === activeFilter);

    const filters = ['Tất cả', 'Gói tập', 'Mua hàng', 'PT', 'Hoàn tiền'];
    
    // Hàm để lấy class màu cho status
    const getStatusClass = (status) => {
        switch (status) {
            case 'Thành công': return 'status-success';
            case 'Thất bại': return 'status-danger';
            case 'Hoàn tất': return 'status-info';
            default: return '';
        }
    };

    return (
        <div className="transactions-page-container fade-in">
            <h1 className="page-title">Lịch Sử Giao Dịch</h1>

            {/* Thanh công cụ: Filter và Date Range */}
            <div className="toolbar">
                <div className="filters-container">
                    <FontAwesomeIcon icon={faFilter} />
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="date-range-picker">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <input type="date" />
                    <span>-</span>
                    <input type="date" />
                    <button className="btn-secondary">Lọc</button>
                </div>
            </div>

            {/* Bảng giao dịch */}
            <div className="table-container">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Mã GD</th>
                            <th>Ngày</th>
                            <th>Loại</th>
                            <th>Chi tiết</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(trx => (
                                <tr key={trx.id}>
                                    <td><span className="trx-id">{trx.id}</span></td>
                                    <td>{trx.date}</td>
                                    <td>{trx.type}</td>
                                    <td>{trx.description}</td>
                                    <td className={`amount ${trx.amount < 0 ? 'negative' : 'positive'}`}>
                                        {trx.amount.toLocaleString('vi-VN')}đ
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(trx.status)}`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-invoice">
                                            <FontAwesomeIcon icon={faReceipt} />
                                            Hóa đơn
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data-cell">Không có giao dịch nào phù hợp.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
