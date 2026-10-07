# Campus Service — Full-Stack (Week 11)

ระบบบริการคำร้องสำหรับมหาวิทยาลัย (Campus Service Request) ในรูปแบบ Full-Stack Web Application ที่เชื่อมต่อครบทั้ง 3 ชั้น และพร้อมสำหรับการนำไปใช้งานจริง (Production-ready)

---

## 1. ภาพรวมของระบบ (Overview)
ระบบช่วยให้ผู้ใช้สามารถจัดการคำร้องแจ้งซ่อมและบริการต่างๆ ในมหาวิทยาลัยได้ โดยมีความสามารถหลักดังนี้:
- แสดงรายการคำร้องทั้งหมด พร้อมสถานะและหมวดหมู่
- สร้างคำร้องบริการใหม่
- อัปเดตสถานะของคำร้อง
- ลบรายการคำร้อง
- ตรวจสอบสถานะการทำงานของระบบ (Health Check API)

### เทคโนโลยีที่ใช้ (Tech Stack)
- **Frontend**: React 19, Vite, React Router, CSS
- **Backend (API)**: Node.js (v22+), Express 5, Morgan, CORS
- **Database**: SQLite (`node:sqlite` built-in module)

---

## 2. สถาปัตยกรรม 3 ชั้น (Three-Tier Architecture)

ระบบถูกออกแบบตามสถาปัตยกรรม 3 ชั้น เพื่อแยกหน้าที่ความรับผิดชอบอย่างชัดเจน (Separation of Concerns):

```
┌──────────────┐     HTTP / JSON      ┌──────────────┐      SQL Query      ┌──────────────┐
│  Frontend    │  ─────────────────►  │  API Server  │  ────────────────►  │   Database   │
│   (React)    │  ◄─────────────────  │  (Express)   │  ◄────────────────  │   (SQLite)   │
└──────────────┘                      └──────────────┘      Row Data       └──────────────┘
```

| ชั้น (Tier) | หน้าที่และความรับผิดชอบ | โฟลเดอร์ |
|---|---|---|
| **Frontend** | ส่วนติดต่อผู้ใช้ (UI/UX), รับคำสั่งจากผู้ใช้, แสดงผลข้อมูล และเรียกใช้งาน API ผ่าน HTTP Request | `frontend/` |
| **API** | ควบคุม Business Logic, จัดการ Routing, ตรวจสอบความถูกต้องของข้อมูล (Validation), Error Handling และเชื่อมต่อฐานข้อมูล | `api/src/` |
| **Database** | จัดเก็บข้อมูลแบบถาวร (Persistence) ในรูปแบบ Relational Database ตาม Schema ที่กำหนด | `api/data/` |

---

## 3. วิธีการติดตั้งและรันระบบ (How to Run)

### ติดตั้ง Dependencies
รันคำสั่งติดตั้งที่ Root หรือแยกตามโฟลเดอร์:
```bash
# ติดตั้ง root dependencies
npm install

# ติดตั้ง dependencies สำหรับ API
npm --prefix api install

# ติดตั้ง dependencies สำหรับ Frontend
npm --prefix frontend install
```

---

### โหมดพัฒนา (Development Mode — 2 Terminals)
ในระหว่างพัฒนา ให้เปิด 2 Terminal เพื่อแยกการทำงานของ Frontend (HMR) และ API (Watch mode):

1. **Terminal 1: รัน API Server (Port 3001)**
   ```bash
   cd api
   npm run dev
   ```
   API จะทำงานที่ `http://localhost:3001` พร้อม auto-reload เมื่อแก้ไขโค้ด

2. **Terminal 2: รัน Frontend Dev Server (Port 5173)**
   ```bash
   cd frontend
   npm run dev
   ```
   เข้าใช้งานเว็บได้ที่ `http://localhost:5173` (Frontend จะยิง API ไปที่ `http://localhost:3001`)

---

### โหมด Production (Single Port Mode — รันพอร์ตเดียว)
เมื่อต้องการใช้งานจริง ระบบจะ build หน้าเว็บและให้ Express ทำหน้าที่เสิร์ฟทั้ง Static Files และ API บนพอร์ต 3001 พอร์ตเดียว:

1. **Build โครงการทั้งหมด:**
   ```bash
   npm run build
   ```
   คำสั่งนี้จะ build bundle ของ Frontend ไว้ในโฟลเดอร์ `frontend/dist/` โดยใช้ path สัมพัทธ์สำหรับ API

2. **เริ่มระบบในโหมด Production:**
   - **Linux / macOS:**
     ```bash
     NODE_ENV=production npm start
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:NODE_ENV="production"; npm start
     ```
   - หรือรันผ่านสคริปต์ที่ตั้งค่าไว้:
     ```bash
     npm start
     ```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3001` จะแสดงหน้าเว็บ React และสามารถเรียก API ผ่าน `/api/...` ได้ทันที

---

## 4. ตัวแปรสภาพแวดล้อม (Environment Variables)

ระบบมีการรวมศูนย์การอ่านค่า Config ไว้ที่ [api/src/config.js](file:///d:/vscodeworkhere/engse203/engse203-student-labs-685432100103/labs/week-11/source/api/src/config.js) โดยมีตัวแปรสภาพแวดล้อมดังนี้:

| ตัวแปร | ค่าเริ่มต้น | รายละเอียด | ใช้งานที่ |
|---|---|---|---|
| `NODE_ENV` | `development` | โหมดการทำงาน (`development` หรือ `production`) | Backend |
| `PORT` | `3001` | พอร์ตที่ Express เซิร์ฟเวอร์เปิดรับฟัง | Backend |
| `CORS_ORIGIN` | `http://localhost:5173` | โดเมนที่อนุญาตให้เรียก API (CORS) | Backend |
| `DB_FILE` | `api/data/campus.db` | ที่อยู่ของไฟล์ฐานข้อมูล SQLite | Backend |
| `STATIC_DIR` | `frontend/dist` | โฟลเดอร์สำหรับเสิร์ฟไฟล์ Static ตอน Production | Backend |
| `VITE_API_BASE_URL` | `http://localhost:3001` (dev) / `""` (prod) | Base URL สำหรับเรียก API | Frontend |

---

## 5. การตัดสินใจออกแบบ (Design Decisions)

### ทำไมต้องแยกสถาปัตยกรรม 3 ชั้น (Three-Tier Architecture)?
1. **Separation of Concerns**: แบ่งแยกบทบาทชัดเจนระหว่างการแสดงผล (Frontend), กฎทางธุรกิจ (API Business Logic), และการจัดเก็บข้อมูล (Database) ทำให้โค้ดเป็นระเบียบ อ่านเข้าใจง่าย และง่ายต่อการทดสอบ
2. **Maintainability & Modularity**: หากต้องการปรับเปลี่ยน UI (เช่น เปลี่ยน UI Library) หรือเปลี่ยนฐานข้อมูลในอนาคต จะกระทบเฉพาะชั้นนั้นๆ โดยไม่กระทบส่วนอื่น
3. **Security**: Browser หรือ Client ไม่มีสิทธิ์เข้าถึงฐานข้อมูลโดยตรง ต้องผ่านชั้น API ที่มีการตรวจสอบสิทธิ์และ validate ข้อมูลก่อนเสมอ

### ทำไมจึงเลือกใช้ SQLite?
1. **Zero Configuration & Serverless**: SQLite จัดเก็บข้อมูลทั้งหมดในไฟล์เดียว (`campus.db`) ใช้งานง่ายโดยไม่ต้องติดตั้งและดูแล Database Server แยกต่างหาก
2. **Relational Data Structure**: ข้อมูลคำร้อง (Requests) มีโครงสร้างฟิลด์ที่ชัดเจนและแน่นอน จึงเหมาะกับ Relational Database (SQL)
3. **Native Support**: Node.js เวอร์ชัน 22 ขึ้นไปมี built-in module `node:sqlite` ทำให้ไม่ต้องติดตั้ง native binary เพิ่มเติม และพร้อมย้ายไประบบ Cloud Database เช่น Turso (LibSQL) ได้ง่าย

---

## 6. API Endpoints

- `GET /api/health` — ตรวจสอบสถานะความพร้อมของเซิร์ฟเวอร์และฐานข้อมูล
- `GET /api/requests` — ดึงรายการคำร้องทั้งหมด
- `POST /api/requests` — บันทึกคำร้องใหม่
- `PATCH /api/requests/:id` — แก้ไขสถานะคำร้อง
- `DELETE /api/requests/:id` — ลบรายการคำร้อง
