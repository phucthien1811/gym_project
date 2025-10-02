import React from 'react';
import './css/AdminSettings.css'; // File CSS mới

export default function AdminSettings() {
    return (
        <div className="admin-page-container">
            <h2 className="admin-page-title">Cài Đặt Hệ Thống</h2>

            <div className="settings-grid">
                {/* Cột menu */}
                <div className="settings-nav">
                    <a href="#general" className="settings-nav-item active">Thông tin chung</a>
                    <a href="#billing" className="settings-nav-item">Thanh toán & Hóa đơn</a>
                    <a href="#integrations" className="settings-nav-item">Tích hợp</a>
                    <a href="#notifications" className="settings-nav-item">Thông báo</a>
                </div>

                {/* Cột nội dung */}
                <div className="settings-content">
                    <div className="settings-card">
                        <h3 className="card-title">Thông tin chung về phòng gym</h3>
                        <form className="settings-form">
                            <div className="form-group">
                                <label htmlFor="gymName">Tên phòng gym</label>
                                <input type="text" id="gymName" defaultValue="Royal Fitness" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gymAddress">Địa chỉ</label>
                                <input type="text" id="gymAddress" defaultValue="123 Đường ABC, Phường X, Quận Y, TP. HCM" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gymPhone">Số điện thoại</label>
                                <input type="tel" id="gymPhone" defaultValue="0987 654 321" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gymEmail">Email liên hệ</label>
                                <input type="email" id="gymEmail" defaultValue="contact@royal.fit" />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
