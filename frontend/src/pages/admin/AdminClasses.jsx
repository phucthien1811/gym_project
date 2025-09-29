import React from 'react';

export default function AdminClasses() {
  return (
    <>
      {/* (SỬA LỖI) Bọc tiêu đề và nút bấm trong div này */}
     <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Classes</h2>
        <button className="btn btn--primary btn-md">+ Add Classes</button>
      </div>

      <div className="admin__table-wrap">
        <p style={{ padding: '20px', color: 'var(--text-normal)' }}>
          This is where you'll manage group classes like Yoga, Zumba, Boxing, etc.
          You can create a schedule, assign trainers, and set class capacity.
        </p>
        {/* Bảng lịch tập sẽ được thêm ở đây */}
      </div>
      </div>
    </>
  );
}

