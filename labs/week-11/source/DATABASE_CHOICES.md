# บันทึกการวิเคราะห์ทางเลือกฐานข้อมูล (DATABASE_CHOICES.md)
**ENGSE203 Week 11 — Checkpoint 41 (CP41)**

เอกสารนี้สรุปเหตุผลและบทวิเคราะห์เกี่ยวกับการเลือกใช้ฐานข้อมูล สถาปัตยกรรมระบบ และผลกระทบต่อชั้นต่างๆ ของระบบ Full-Stack Application

---

### 1. ทำไมโปรเจกต์นี้เลือก SQLite แทน MongoDB (NoSQL)?

1. **โครงสร้างข้อมูลชัดเจนและแน่นอน (Structured Schema)**: ข้อมูลคำร้องแจ้งซ่อมและบริการ (Campus Service Requests) มีฟิลด์ข้อมูลตายตัวและสม่ำเสมอ เช่น `id`, `title`, `description`, `category`, `status`, `created_at` ซึ่งเหมาะกับ Relational Database (SQL) ที่มีการบังคับ Schema และ Data Types ชัดเจน ไม่จำเป็นต้องใช้โครงสร้างแบบ Schema-less / Flexible Document ของ MongoDB
2. **ความสมบูรณ์และถูกต้องของข้อมูล (ACID & Constraints)**: SQLite รองรับ Transaction และ Constraints (เช่น `NOT NULL`, `CHECK`, `DEFAULT`) ช่วยป้องกันข้อมูลผิดพลาดได้ในระดับฐานข้อมูล
3. **ความเรียบง่ายและเป็น Embedded Database (Zero Config)**: SQLite เป็นไฟล์เดี่ยว (`campus.db`) ที่ทำงานใน Process เดียวกันกับ Node.js ผ่าน Built-in module (`node:sqlite`) โดยไม่ต้องติดตั้งหรือเปิด Database Server Daemon แยกอย่าง MongoDB ทำให้การพัฒนา การทดสอบ (Testing) และการ Deploy ไม่ซับซ้อน เหมาะสมกับขนาดและความต้องการของโปรเจกต์นี้

---

### 2. ถ้าวันหนึ่งต้องเปลี่ยนไปใช้ MongoDB จะกระทบชั้นไหนบ้าง?

หากระบบเปลี่ยนไปใช้ MongoDB (หรือ NoSQL Database อื่นๆ) จะกระทบหลักๆ **2 ชั้น** คือ **ชั้น Service** และ **ชั้น Controller**:

1. **กระทบชั้น Service (`api/src/services/requestService.js`)**:
   - ต้องเปลี่ยนไวยากรณ์การดึงข้อมูลจากภาษา SQL (เช่น `SELECT * FROM requests`) ไปเป็น MongoDB Query API หรือ Mongoose Model (เช่น `Request.find()`)
   - ฟังก์ชันทั้งหมดใน service ต้องเปลี่ยนเป็น `async function` และใช้ `await` ในการติดต่อฐานข้อมูล เพราะ MongoDB ทำงานผ่าน Network I/O แบบ Asynchronous เสมอ
2. **กระทบชั้น Controller (`api/src/controllers/requestController.js`)**:
   - เนื่องจากปัจจุบันโค้ด SQLite เดิมทำงานแบบ Synchronous ทำให้ฟังก์ชันใน Controller เรียกใช้ Service ได้โดยตรงโดยไม่ต้องมี `await`
   - เมื่อชั้น Service เปลี่ยนไปเป็น Asynchronous (`Promise/async`) ฟังก์ชันใน Controller จะต้องปรับเป็น `async` ด้วย และต้องใส่ `await` หน้าคำสั่งที่เรียก Service ทุกจุด รวมถึงต้องจัดการ Error ด้วย `try...catch` เพื่อส่งต่อไปยัง `next(err)` ของ Express Error Handler
3. **ส่วนที่ไม่กระทบ**:
   - **Frontend** ไม่ได้รับผลกระทบ เพราะ API Endpoint, Request URL และ JSON Response Payload (API Contract) ยังคงเหมือนเดิม
   - **Routes** ไม่ได้รับผลกระทบ เพราะเพียงแค่จับคู่ path กับ controller function เหมือนเดิม

---

### 3. Asynchronous (`async/await`) จำเป็นเมื่อไร และไม่จำเป็นเมื่อไร?

ความจำเป็นของการใช้ `async/await` ขึ้นอยู่กับตำแหน่งที่ตั้งของฐานข้อมูลและลักษณะของ I/O Operation:

1. **จำเป็นเมื่อ (Asynchronous I/O)**:
   - **ฐานข้อมูลอยู่คนละเครื่อง (Remote Database / Network I/O)** เช่น MongoDB, PostgreSQL, MySQL หรือ Cloud Database ทั่วไป
   - การติดต่อสื่อสารต้องผ่าน Network ซึ่งมีความหน่วง (Latency) สูงและคาดเดาเวลาไม่ได้ Node.js จึงต้องใช้การทำงานแบบ Non-blocking (Asynchronous) เพื่อให้ Event Loop สามารถประมวลผล Request อื่นๆ ของผู้ใช้พร้อมกันได้ โดยไม่ต้องหยุดรอ (Block) การตอบกลับจาก Database Server
2. **ไม่จำเป็นเมื่อ (Synchronous I/O)**:
   - **ฐานข้อมูลเป็น Embedded หรือ In-Memory อยู่ในเครื่องเดียวกัน (Local Process)** เช่น SQLite ผ่าน `node:sqlite` หรือการอ่านเขียนไฟล์ขนาดเล็กในเครื่อง
   - การอ่านข้อมูลจาก SQLite เป็นการเข้าถึงไฟล์ใน Disk / Memory ภายในกระบวนการเดียวกัน ซึ่งทำงานเสร็จสิ้นในระดับเศษเสี้ยวของมิลลิวินาที (Microseconds) การใช้คำสั่ง Synchronous จึงมีประสิทธิภาพสูง เข้าใจง่าย และไม่มี Overhead จาก Promise Lifecycle ในสเกลการทำงานแบบ In-process
