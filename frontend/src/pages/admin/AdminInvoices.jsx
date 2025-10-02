import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import './css/AdminInvoices.css'; // File CSS mới

const mockInvoices = [
    { id: "INV-00123", memberName: "Alex Carter", amount: 4000000, issueDate: "2025-09-25", dueDate: "2025-10-01", status: "Paid" },
    { id: "INV-00124", memberName: "Mia Nguyen", amount: 450000, issueDate: "2025-09-22", dueDate: "2025-09-29", status: "Unpaid" },
    { id: "INV-00125", memberName: "Kenji Park", amount: 1200000, issueDate: "2025-09-20", dueDate: "2025-09-27", status: "Unpaid" },
    { id: "INV-00126", memberName: "Sophia Rossi", amount: 500000, issueDate: "2025-09-15", dueDate: "2025-09-22", status: "Overdue" },
];

export default function AdminInvoices() {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Paid': return 'status-paid';
            case 'Unpaid': return 'status-unpaid';
            case 'Overdue': return 'status-overdue';
            default: return '';
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Hóa Đơn & Thanh Toán</h2>
                <div className="admin-page-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm hóa đơn..." />
                    </div>
                    <button className="btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Tạo Hóa Đơn</span>
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã Hóa Đơn</th>
                            <th>Hội Viên</th>
                            <th>Số Tiền</th>
                            <th>Ngày Xuất</th>
                            <th>Ngày Hết Hạn</th>
                            <th>Trạng Thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInvoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td><span className="invoice-id">{invoice.id}</span></td>
                                <td>{invoice.memberName}</td>
                                <td className="amount">{invoice.amount.toLocaleString('vi-VN')}đ</td>
                                <td>{invoice.issueDate}</td>
                                <td>{invoice.dueDate}</td>
                                <td>
                                    <span className={`status-pill ${getStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <FontAwesomeIcon icon={faFilePdf} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
