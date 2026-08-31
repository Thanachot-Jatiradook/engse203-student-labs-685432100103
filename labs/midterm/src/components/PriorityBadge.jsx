import React from 'react';

function PriorityBadge({ priority }) {
  // เช็กค่า priority เพื่อเลือกข้อความและคลาสที่จะแสดง
  if (priority === 'urgent') {
    return <span className="priority-urgent">เร่งด่วน</span>;
  }
  
  if (priority === 'normal') {
    return <span className="priority-normal">ปกติ</span>;
  }

  // CP-B4.2: จัดการ edge case ถ้าค่าเป็นอย่างอื่น หรือไม่มีค่าส่งมา
  return <span className="priority-unknown">ไม่ระบุ</span>;
}

export default PriorityBadge;