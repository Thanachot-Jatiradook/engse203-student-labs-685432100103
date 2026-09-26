-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์
-- 🏠 TODO W09-QUERY (CP22) · เขียนอย่างน้อย 8 ข้อ
--
-- เขียนคำสั่งจริงที่รันได้ ไม่ใช่เขียนบรรยาย
-- ทุกข้อต้องทดสอบแล้วว่าได้ผลลัพธ์ถูกต้อง
-- ═══════════════════════════════════════════════════════════

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT * FROM requests ORDER BY id ASC;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ (status = 'pending')
SELECT * FROM requests WHERE status = 'pending' ORDER BY id ASC;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ — ใช้เงื่อนไข 2 ข้อพร้อมกัน
SELECT * FROM requests WHERE priority = 'urgent' AND status != 'completed' ORDER BY id ASC;

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด  (คำใบ้: LIKE)
SELECT * FROM requests WHERE details LIKE '%ห้องปฏิบัติการ%' ORDER BY id ASC;

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง  ← ต้องใช้ JOIN เพราะชื่ออยู่คนละตาราง
SELECT r.id, u.name AS requesterName, r.request_type, r.location, r.details, r.priority, r.status
FROM requests r
JOIN users u ON u.id = r.requester_id
ORDER BY r.id ASC;

-- ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง  (JOIN + WHERE)
SELECT r.id, u.name, u.department, r.request_type, r.location, r.details, r.status
FROM requests r
JOIN users u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id ASC;

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน  (คำใบ้: DISTINCT)
SELECT DISTINCT u.id, u.name, u.email
FROM users u
JOIN requests r ON r.requester_id = u.id
ORDER BY u.name ASC;

-- ⑧ คำร้อง 3 รายการล่าสุด  (คำใบ้: ORDER BY + LIMIT)
SELECT * FROM requests ORDER BY created_at DESC, id DESC LIMIT 3;

-- ⭐ Challenge ─────────────────────────────────────────────
-- ⑨ นับจำนวนคำร้องแยกตามสถานะ  (GROUP BY + COUNT)
SELECT status, COUNT(*) AS count
FROM requests
GROUP BY status
ORDER BY count DESC;

-- ⑩ ใครแจ้งคำร้องมากที่สุด  (คำใบ้: LEFT JOIN เพื่อให้คนที่ยังไม่เคยแจ้งติดมาด้วย)
SELECT u.name, COUNT(r.id) AS total_requests
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id, u.name
ORDER BY total_requests DESC;

-- ⑪ สร้าง INDEX ให้การค้นด้วย status เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
