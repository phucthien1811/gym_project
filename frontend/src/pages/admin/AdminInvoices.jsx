import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faSearch, 
    faFilePdf, 
    faExclamationTriangle, 
    faCheck,
    faTimes,
    faEye 
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminInvoices.css'; // File CSS mới

const mockInvoices = [
    { 
        id: "INV-00123", 
        memberName: "Alex Carter", 
        amount: 500000, 
        issueDate: "2025-09-25", 
        status: "Paid",
        itemName: "Gói tập Basic",
        quantity: 1,
        unitPrice: 500000,
        paymentMethod: "banking",
        amountPaid: 500000,
        changeAmount: 0,
        description: "Đăng ký gói tập cơ bản 1 tháng"
    },
    { 
        id: "INV-00124", 
        memberName: "Mia Nguyen", 
        amount: 85000, 
        issueDate: "2025-09-22", 
        status: "Unpaid",
        itemName: "Nước tăng lực + Protein shake",
        quantity: 1,
        unitPrice: 85000,
        paymentMethod: "cash",
        amountPaid: 0,
        changeAmount: 0,
        description: "Mua nước tăng lực và protein shake"
    },
    { 
        id: "INV-00125", 
        memberName: "Kenji Park", 
        amount: 1200000, 
        issueDate: "2025-09-20", 
        status: "Unpaid",
        itemName: "Gói tập Standard",
        quantity: 1,
        unitPrice: 1200000,
        paymentMethod: "card",
        amountPaid: 0,
        changeAmount: 0,
        description: "Đăng ký gói tập tiêu chuẩn 3 tháng có HLV"
    },
    { 
        id: "INV-00126", 
        memberName: "Sophia Rossi", 
        amount: 150000, 
        issueDate: "2025-09-15", 
        status: "Paid",
        itemName: "Gói tập 1 buổi + Thuê tủ đồ",
        quantity: 1,
        unitPrice: 150000,
        paymentMethod: "cash",
        amountPaid: 200000,
        changeAmount: 50000,
        description: "Tập thử 1 buổi và thuê tủ đồ"
    },
];

// Mock data cho danh sách hội viên
const mockMembers = [
    { id: "M001", name: "Alex Carter", email: "alex.c@example.com" },
    { id: "M002", name: "Mia Nguyen", email: "mia.n@example.com" },
    { id: "M003", name: "Kenji Park", email: "kenji.p@example.com" },
    { id: "M004", name: "Sophia Rossi", email: "sophia.r@example.com" },
    { id: "M005", name: "Liam Chen", email: "liam.c@example.com" },
];

// Mock data cho các gói tập
const mockPackages = [
    { id: 1, name: "Gói Basic", price: 500000, description: "Tập luyện cơ bản" },
    { id: 2, name: "Gói Standard", price: 1200000, description: "Tập luyện tiêu chuẩn với HLV" },
    { id: 3, name: "Gói Premium", price: 2000000, description: "Tập luyện cao cấp + dinh dưỡng" },
    { id: 4, name: "Gói VIP", price: 3500000, description: "Toàn diện 1 năm" }
];

// Mock data cho sản phẩm/dịch vụ thường dùng
const commonItems = [
    { name: "Nước suối", price: 10000 },
    { name: "Nước tăng lực", price: 25000 },
    { name: "Khăn tập", price: 50000 },
    { name: "Protein shake", price: 80000 },
    { name: "Gói tập 1 buổi", price: 100000 },
    { name: "Thuê tủ đồ", price: 20000 }
];

export default function AdminInvoices() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [newInvoice, setNewInvoice] = useState({
        selectedMember: null,
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        amountPaid: 0,
        changeAmount: 0,
        paymentMethod: 'cash',
        issueDate: new Date().toISOString().split('T')[0],
        description: ''
    });
    const getStatusClass = (status) => {
        switch (status) {
            case 'Paid': return 'ai-status-paid';
            case 'Unpaid': return 'ai-status-unpaid';
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

    const handleViewInvoice = (invoice) => {
        setViewingInvoice(invoice);
        setShowViewModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvoice(prev => {
            const updated = {
                ...prev,
                [name]: name === 'quantity' || name === 'unitPrice' || name === 'amountPaid' 
                    ? parseFloat(value) || 0 
                    : value
            };
            
            // Auto calculate total amount
            if (name === 'quantity' || name === 'unitPrice') {
                updated.totalAmount = updated.quantity * updated.unitPrice;
                updated.changeAmount = Math.max(0, updated.amountPaid - updated.totalAmount);
            }
            
            // Auto calculate change
            if (name === 'amountPaid') {
                updated.changeAmount = Math.max(0, updated.amountPaid - updated.totalAmount);
            }
            
            return updated;
        });
    };

    const handleMemberSelect = (e) => {
        const selectedMember = mockMembers.find(member => member.id === e.target.value);
        setNewInvoice(prev => ({
            ...prev,
            selectedMember: selectedMember || null
        }));
    };

    const handleCommonItemSelect = (e) => {
        const selectedItem = commonItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setNewInvoice(prev => ({
                ...prev,
                itemName: selectedItem.name,
                unitPrice: selectedItem.price,
                totalAmount: prev.quantity * selectedItem.price,
                changeAmount: Math.max(0, prev.amountPaid - (prev.quantity * selectedItem.price))
            }));
        }
    };

    const handleCreateInvoice = () => {
        // Add validation logic here
        if (!newInvoice.selectedMember || !newInvoice.itemName || !newInvoice.unitPrice) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        
        // Here you would typically send data to API
        console.log('Creating invoice:', newInvoice);
        alert('Tạo hóa đơn thành công!');
        
        // Reset form and close modal
        setNewInvoice({
            selectedMember: null,
            itemName: '',
            quantity: 1,
            unitPrice: 0,
            totalAmount: 0,
            amountPaid: 0,
            changeAmount: 0,
            paymentMethod: 'cash',
            issueDate: new Date().toISOString().split('T')[0],
            description: ''
        });
        setShowCreateModal(false);
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
                    <button className="ai-btn-primary" onClick={() => setShowCreateModal(true)}>
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
                                <td>
                                    <span className={`ai-status-pill ${getStatusClass(invoice.status)}`}>
                                        {invoice.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </td>
                                <td>
                                    <div className="ai-action-buttons">
                                        <button 
                                            className="ai-action-btn ai-btn-view"
                                            onClick={() => handleViewInvoice(invoice)}
                                            title="Xem chi tiết"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
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

            {/* Modal Tạo Hóa Đơn */}
            {showCreateModal && (
                <div className="ai-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ai-modal-header">
                            <h3>Tạo Hóa Đơn Mới</h3>
                            <button 
                                className="ai-modal-close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="ai-modal-body">
                            <div className="ai-form-grid">
                                <div className="ai-form-group">
                                    <label>Chọn hội viên *</label>
                                    <select
                                        value={newInvoice.selectedMember?.id || ''}
                                        onChange={handleMemberSelect}
                                        required
                                    >
                                        <option value="">-- Chọn hội viên --</option>
                                        {mockMembers.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.name} ({member.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="ai-form-group">
                                    <label>Chọn sản phẩm/dịch vụ thường dùng</label>
                                    <select
                                        value=""
                                        onChange={handleCommonItemSelect}
                                    >
                                        <option value="">-- Chọn từ danh sách có sẵn --</option>
                                        {commonItems.map((item, index) => (
                                            <option key={index} value={item.name}>
                                                {item.name} - {item.price.toLocaleString('vi-VN')}đ
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="ai-form-group">
                                    <label>Tên sản phẩm/dịch vụ *</label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={newInvoice.itemName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên sản phẩm/dịch vụ"
                                        required
                                    />
                                </div>

                                <div className="ai-form-group">
                                    <label>Số lượng *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={newInvoice.quantity}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="ai-form-group">
                                    <label>Đơn giá *</label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={newInvoice.unitPrice}
                                        onChange={handleInputChange}
                                        placeholder="Nhập đơn giá"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="ai-form-group">
                                    <label>Tổng tiền</label>
                                    <input
                                        type="text"
                                        value={`${newInvoice.totalAmount.toLocaleString('vi-VN')}đ`}
                                        disabled
                                        className="ai-calculated-field"
                                    />
                                </div>

                                <div className="ai-form-group">
                                    <label>Tiền khách đưa</label>
                                    <input
                                        type="number"
                                        name="amountPaid"
                                        value={newInvoice.amountPaid}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số tiền khách đưa"
                                        min="0"
                                    />
                                </div>

                                <div className="ai-form-group">
                                    <label>Tiền thối</label>
                                    <input
                                        type="text"
                                        value={`${newInvoice.changeAmount.toLocaleString('vi-VN')}đ`}
                                        disabled
                                        className="ai-calculated-field ai-change-amount"
                                    />
                                </div>

                                <div className="ai-form-group">
                                    <label>Phương thức thanh toán</label>
                                    <select
                                        name="paymentMethod"
                                        value={newInvoice.paymentMethod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="cash">Tiền mặt</option>
                                        <option value="banking">Chuyển khoản</option>
                                        <option value="card">Thẻ tín dụng</option>
                                    </select>
                                </div>

                                <div className="ai-form-group">
                                    <label>Ngày xuất hóa đơn</label>
                                    <input
                                        type="date"
                                        name="issueDate"
                                        value={newInvoice.issueDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="ai-form-group">
                                    {/* Empty space for grid alignment */}
                                </div>
                            </div>

                            <div className="ai-form-group">
                                <label>Mô tả (không bắt buộc)</label>
                                <textarea
                                    name="description"
                                    value={newInvoice.description}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mô tả cho hóa đơn..."
                                    rows="3"
                                />
                            </div>

                            {newInvoice.itemName && (
                                <div className="ai-invoice-info">
                                    <h4>Chi tiết hóa đơn:</h4>
                                    <div className="ai-info-row">
                                        <span>Khách hàng:</span>
                                        <span>{newInvoice.selectedMember?.name || 'Chưa chọn'}</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Sản phẩm/Dịch vụ:</span>
                                        <span>{newInvoice.itemName}</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Số lượng:</span>
                                        <span>{newInvoice.quantity}</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Đơn giá:</span>
                                        <span>{newInvoice.unitPrice.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Tổng tiền:</span>
                                        <span className="ai-amount-highlight">{newInvoice.totalAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Tiền khách đưa:</span>
                                        <span>{newInvoice.amountPaid.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Tiền thối:</span>
                                        <span className="ai-change-highlight">{newInvoice.changeAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="ai-info-row">
                                        <span>Phương thức:</span>
                                        <span>{newInvoice.paymentMethod === 'cash' ? 'Tiền mặt' : newInvoice.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Thẻ tín dụng'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ai-modal-footer">
                            <button 
                                className="ai-btn-secondary"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="ai-btn-primary"
                                onClick={handleCreateInvoice}
                            >
                                Tạo Hóa Đơn
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xem Chi Tiết Hóa Đơn */}
            {showViewModal && viewingInvoice && (
                <div className="ai-modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ai-modal-header">
                            <h3>Chi Tiết Hóa Đơn {viewingInvoice.id}</h3>
                            <button 
                                className="ai-modal-close-btn"
                                onClick={() => setShowViewModal(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="ai-modal-body">
                            <div className="ai-invoice-view">
                                <div className="ai-invoice-header">
                                    <h4>Thông tin khách hàng</h4>
                                    <div className="ai-customer-info">
                                        <p><strong>Tên khách hàng:</strong> {viewingInvoice.memberName}</p>
                                        <p><strong>Mã hóa đơn:</strong> {viewingInvoice.id}</p>
                                        <p><strong>Ngày xuất:</strong> {viewingInvoice.issueDate}</p>
                                        <p><strong>Trạng thái:</strong> 
                                            <span className={`ai-status-pill ${getStatusClass(viewingInvoice.status)}`}>
                                                {viewingInvoice.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="ai-invoice-items">
                                    <h4>Chi tiết sản phẩm/dịch vụ</h4>
                                    <div className="ai-item-details">
                                        <div className="ai-item-row">
                                            <span>Tên sản phẩm/dịch vụ:</span>
                                            <span>{viewingInvoice.itemName}</span>
                                        </div>
                                        <div className="ai-item-row">
                                            <span>Số lượng:</span>
                                            <span>{viewingInvoice.quantity}</span>
                                        </div>
                                        <div className="ai-item-row">
                                            <span>Đơn giá:</span>
                                            <span>{viewingInvoice.unitPrice.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <div className="ai-item-row ai-total-row">
                                            <span>Tổng tiền:</span>
                                            <span className="ai-amount-highlight">{viewingInvoice.amount.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ai-payment-info">
                                    <h4>Thông tin thanh toán</h4>
                                    <div className="ai-payment-details">
                                        <div className="ai-payment-row">
                                            <span>Phương thức thanh toán:</span>
                                            <span>
                                                {viewingInvoice.paymentMethod === 'cash' ? 'Tiền mặt' : 
                                                 viewingInvoice.paymentMethod === 'banking' ? 'Chuyển khoản' : 
                                                 'Thẻ tín dụng'}
                                            </span>
                                        </div>
                                        <div className="ai-payment-row">
                                            <span>Tiền khách đưa:</span>
                                            <span>{viewingInvoice.amountPaid.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <div className="ai-payment-row">
                                            <span>Tiền thối:</span>
                                            <span className="ai-change-highlight">{viewingInvoice.changeAmount.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>
                                </div>

                                {viewingInvoice.description && (
                                    <div className="ai-description-info">
                                        <h4>Mô tả</h4>
                                        <p>{viewingInvoice.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="ai-modal-footer">
                            <button 
                                className="ai-btn-secondary"
                                onClick={() => setShowViewModal(false)}
                            >
                                Đóng
                            </button>
                            <button 
                                className="ai-btn-primary"
                                onClick={() => handleExportPDF(viewingInvoice)}
                            >
                                <FontAwesomeIcon icon={faFilePdf} />
                                Xuất PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
