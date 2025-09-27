import React from 'react';
import "../../../styles/admin.css"; // Thêm file CSS để định dạng

const Card4 = () => {
    const member = {
    name: "Vinay D",
    phone: "+91-6295085613",
    nextBillDate: "31-10-2024",
    imageUrl: "https://www.bing.com/th/id/OIP.NZAQ_AZjXcUI4nFRQoE3DwHaE8?w=295&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", // Thay thế bằng URL hình ảnh thật
    };
    return (
     <div className="card2-container">
      <h2 className="card-title">3 Expring In 4-7 Days Members</h2> {/* Tiêu đề bên ngoài card */}
      <div className="card2-row">

      <div className="card2 ">
        <div className="member-image">
          <img src={member.imageUrl} alt={member.name} />
          <div className="status-indicator"></div>
        </div>
        <h3>{member.name}</h3>
        <p>{member.phone}</p>
        <p>Next Bill Date: {member.nextBillDate}</p>
      </div>
      <div className="card2 ">
        <div className="member-image">
          <img src={member.imageUrl} alt={member.name} />
          <div className="status-indicator"></div>
        </div>
        <h3>{member.name}</h3>
        <p>{member.phone}</p>
        <p>Next Bill Date: {member.nextBillDate}</p>
      </div>
        <div className="card2 ">
            <div className="member-image">
            <img src={member.imageUrl} alt={member.name} />
            <div className="status-indicator"></div>
            </div>
            <h3>{member.name}</h3>
            <p>{member.phone}</p>
            <p>Next Bill Date: {member.nextBillDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Card4;