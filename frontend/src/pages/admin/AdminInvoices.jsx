import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faSearch, 
    faFilePdf, 
    faExclamationTriangle, 
    faCheck 
} from '@fortawesome/free-solid-svg-icons';
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
            case 'Paid': return 'ai-status-paid';
            case 'Unpaid': return 'ai-status-unpaid';
            case 'Overdue': return 'ai-status-overdue';
            default: return '';
        }
    };

    const handleExportPDF = (invoice) => {
        console.log('Xuất PDF cho hóa đơn:', invoice.id);
        // Logic xuất PDF
    };

    const handleWarning = (invoice) => {
        alert(`Gửi cảnh báo cho hội viên: ${invoice.memberName} về hóa đơn ${invoice.id}`);
        // Logic gửi cảnh báo
    };

    const handleConfirmPayment = (invoice) => {
        if (invoice.status === 'Paid') {
            alert('Hóa đơn đã được thanh toán rồi!');
            return;
        }
        console.log('Xác nhận thanh toán cho hóa đơn:', invoice.id);
        // Logic xác nhận thanh toán
    };

    return (
        <div className="ai-admin-page-container">
            <div className="ai-admin-page-header">
                <h2 className="ai-admin-page-title">Hóa Đơn & Thanh Toán</h2>
                <div className="ai-admin-page-actions">
                    <div className="ai-search-bar">
                        <FontAwesomeIcon icon={faSearch} className="ai-search-icon" />
                        <input type="text" placeholder="Tìm kiếm hóa đơn..." />
                    </div>
                    <button className="ai-btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Tạo Hóa Đơn</span>
                    </button>
                </div>
            </div>

            <div className="ai-admin-table-container">
                <table className="ai-admin-table">
                    <thead>
                        <tr>
                            <th>Mã Hóa Đơn</th>
                            <th>Hội Viên</th>
                            <th>Số Tiền</th>
                            <th>Ngày Xuất</th>
                            <th>Ngày Hết Hạn</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInvoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td><span className="ai-invoice-id">{invoice.id}</span></td>
                                <td>{invoice.memberName}</td>
                                <td className="ai-amount">{invoice.amount.toLocaleString('vi-VN')}đ</td>
                                <td>{invoice.issueDate}</td>
                                <td>{invoice.dueDate}</td>
                                <td>
                                    <span className={`ai-status-pill ${getStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="ai-action-buttons">
                                        <button 
                                            className="ai-action-btn ai-btn-pdf"
                                            onClick={() => handleExportPDF(invoice)}
                                            title="Xuất PDF"
                                        >
                                            <FontAwesomeIcon icon={faFilePdf} />
                                        </button>
                                        <button 
                                            className="ai-action-btn ai-btn-warning"
                                            onClick={() => handleWarning(invoice)}
                                            title="Gửi cảnh báo"
                                        >
                                            <FontAwesomeIcon icon={faExclamationTriangle} />
                                        </button>
                                        <button 
                                            className={`ai-action-btn ai-btn-confirm ${invoice.status === 'Paid' ? 'ai-disabled' : ''}`}
                                            onClick={() => handleConfirmPayment(invoice)}
                                            title={invoice.status === 'Paid' ? 'Đã thanh toán' : 'Xác nhận thanh toán'}
                                            disabled={invoice.status === 'Paid'}
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
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
