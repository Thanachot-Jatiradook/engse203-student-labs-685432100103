# API Contract — Campus Service Request API

**เวอร์ชัน:** 2.0.0 · **Base URL:** `http://localhost:3001`
**รูปแบบข้อมูล:** JSON (`Content-Type: application/json`)

> **API Contract คืออะไร** — ข้อตกลงระหว่างคนทำ front-end กับคนทำ back-end
> ว่าจะคุยกันด้วย endpoint อะไร ส่งอะไรไป ได้อะไรกลับ
> มีไว้เพื่อให้สองฝั่ง**ทำงานคู่ขนานกันได้** โดยไม่ต้องรอกัน

---

## โครงสร้างข้อมูล Request

| field | ชนิด | คำอธิบาย | ตัวอย่าง |
|---|---|---|---|
| `id` | string | รหัสคำร้อง · ขึ้นต้นด้วย `REQ-` · เซิร์ฟเวอร์สร้างให้ | `"REQ-001"` |
| `requesterName` | string | ชื่อผู้แจ้ง · อย่างน้อย 2 ตัวอักษร | `"สมชาย ใจดี"` |
| `requestType` | string | ประเภท · 1 ใน 4 ค่าที่กำหนด | `"แจ้งซ่อม"` |
| `location` | string | สถานที่ · ห้ามว่าง | `"ห้องปฏิบัติการ 301"` |
| `details` | string | รายละเอียด · อย่างน้อย 10 ตัวอักษร | `"เครื่องปรับอากาศไม่ทำงาน"` |
| `priority` | string | `"normal"` หรือ `"urgent"` | `"urgent"` |
| `status` | string | `"pending"` · `"in-progress"` · `"completed"` | `"pending"` |

**ค่าที่ยอมรับของ `requestType`** — `แจ้งซ่อม` · `บริการบัญชีผู้ใช้` · `ขอใช้อุปกรณ์` · `อื่น ๆ`

---

## Endpoints

| Method | Endpoint | คำอธิบาย | Request body | สำเร็จ | ผิดพลาด |
|---|---|---|---|---|---|
| `GET` | `/api/requests` | ดูคำร้องทั้งหมด | — | `200` + array | — |
| `GET` | `/api/requests?status=` | กรองตามสถานะ | — | `200` + array | — |
| `GET` | `/api/requests/:id` | ดูคำร้องใบเดียว | — | `200` + object | `404` ไม่พบ |
| `POST` | `/api/requests` | สร้างคำร้องใหม่ | Request (ไม่ต้องมี `id`, `status`) | `201` + object ที่สร้าง | `400` ข้อมูลไม่ถูกต้อง |
| `PUT` | `/api/requests/:id` | เปลี่ยนสถานะ | `{ "status": "..." }` | `200` + object ที่แก้แล้ว | `400` สถานะผิด · `404` ไม่พบ |
| `DELETE` | `/api/requests/:id` | ลบคำร้อง | — | `204` ไม่มี body | `404` ไม่พบ |

---

## ตัวอย่างการเรียกใช้

### GET /api/requests

```http
GET /api/requests HTTP/1.1
Host: localhost:3001
```

```json
[
  {
    "id": "REQ-001",
    "requesterName": "สมชาย ใจดี",
    "requestType": "แจ้งซ่อม",
    "location": "ห้องปฏิบัติการ 301",
    "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
    "priority": "urgent",
    "status": "pending"
  }
]
```

### POST /api/requests

```http
POST /api/requests HTTP/1.1
Content-Type: application/json

{
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal"
}
```

**201 Created**

```json
{
  "id": "REQ-MTYOA3MX-YEX9",
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal",
  "status": "pending"
}
```

**400 Bad Request** — เมื่อข้อมูลไม่ถูกต้อง

```json
{
  "error": "ข้อมูลคำร้องไม่ถูกต้อง",
  "details": [
    "ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร",
    "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร"
  ]
}
```

### PUT /api/requests/:id

```http
PUT /api/requests/REQ-001 HTTP/1.1
Content-Type: application/json

{ "status": "in-progress" }
```

**200 OK** — คืนคำร้องที่อัปเดตแล้ว

### DELETE /api/requests/:id

**204 No Content** — ไม่มี body ส่งกลับ

---

## รูปแบบ Error

ทุก error ตอบเป็น JSON ที่มี field `error` เสมอ

```json
{ "error": "ข้อความที่ผู้ใช้ทั่วไปอ่านเข้าใจ" }
```

กรณี validation จะมี `details` เพิ่มมาเป็น array บอกว่าผิดตรงไหนบ้าง

| Status | เมื่อไหร่ | ฝั่งไหนผิด |
|---|---|---|
| `400` | ข้อมูลที่ส่งมาไม่ถูกต้อง | ผู้ใช้ |
| `404` | ไม่พบทรัพยากรที่ขอ | ผู้ใช้ |
| `500` | โค้ดเซิร์ฟเวอร์ผิดพลาด | เซิร์ฟเวอร์ |

> **ตอน production จะไม่ส่ง stack trace กลับไป** — เปิดเผยโครงสร้างภายในให้คนภายนอกเห็นไม่ได้

---

## CORS

API อนุญาตให้เรียกจาก origin ที่กำหนดใน `CORS_ORIGIN` เท่านั้น

```
Access-Control-Allow-Origin: http://localhost:5173
```

**ถ้าเรียกจาก origin อื่น** เบราว์เซอร์จะบล็อกก่อนที่โค้ดจะได้เห็น response — จะเห็น error ใน Console ว่าถูกบล็อกโดย CORS policy

> ⚠ CORS เป็นกลไกของ **เบราว์เซอร์** เท่านั้น · Postman และ curl ไม่ถูกบล็อก เพราะไม่ใช่เบราว์เซอร์

---

## Environment Variables

### ฝั่ง API (`api/.env`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `PORT` | `3001` | พอร์ตที่ API รับคำขอ |
| `CORS_ORIGIN` | `http://localhost:5173` | origin ที่อนุญาตให้เรียก |
| `NODE_ENV` | `development` | `production` จะเปลี่ยนรูปแบบ log และซ่อน stack trace |

### ฝั่ง Frontend (`frontend/.env.local`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | ที่อยู่ของ API |

> **ต้องขึ้นต้นด้วย `VITE_`** ไม่งั้น Vite จะไม่ส่งค่าไปให้โค้ดฝั่งเบราว์เซอร์
> และ**ห้าม commit ไฟล์ `.env`** — ใช้ `.env.example` เป็นตัวอย่างแทน

---

## การรันทั้งระบบ

ต้องเปิด **2 terminal** พร้อมกัน

```bash
# Terminal 1 — API
cd api && npm run dev          # http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm run dev     # http://localhost:5173
```

**ลำดับสำคัญ** — เปิด API ก่อนเสมอ ไม่งั้น frontend จะขึ้นข้อความว่าติดต่อเซิร์ฟเวอร์ไม่ได้

---

## Data Model & โครงสร้างฐานข้อมูล (Database Schema)

ระบบเปลี่ยนการจัดเก็บข้อมูลจากไฟล์ JSON มาเป็นฐานข้อมูลเชิงสัมพันธ์ **SQLite** (`api/data/campus.db`) โดยเปิดใช้งาน `PRAGMA foreign_keys = ON;` เพื่อรับประกันความถูกต้องสมบูรณ์ของความสัมพันธ์ (Referential Integrity)

### ตารางในฐานข้อมูล (Tables)

#### 1. ตาราง `users` (ผู้ใช้งาน / ผู้แจ้งคำร้อง)

| คอลัมน์ | ชนิดข้อมูล | เงื่อนไข (Constraints) | คำอธิบาย |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | รหัสผู้ใช้ อัตโนมัติ |
| `name` | `TEXT` | `NOT NULL` | ชื่อ-นามสกุล ผู้ใช้ |
| `department` | `TEXT` | `NOT NULL` | หน่วยงาน / สาขาวิชา |
| `email` | `TEXT` | `NOT NULL UNIQUE` | อีเมล (ห้ามซ้ำ) |

#### 2. ตาราง `requests` (คำร้องขอรับบริการ)

| คอลัมน์ | ชนิดข้อมูล | เงื่อนไข (Constraints) | คำอธิบาย |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | รหัสคำร้อง เช่น `REQ-001` |
| `requester_id` | `INTEGER` | `NOT NULL, REFERENCES users(id)` | Foreign Key เชื่อมกับ `users.id` |
| `request_type` | `TEXT` | `NOT NULL, CHECK (request_type IN ('แจ้งซ่อม','บริการบัญชีผู้ใช้','ขอใช้อุปกรณ์','อื่น ๆ'))` | ประเภทของคำร้อง |
| `location` | `TEXT` | `NOT NULL` | สถานที่เกิดเหตุ / ใช้งาน |
| `details` | `TEXT` | `NOT NULL` | รายละเอียดคำร้อง |
| `priority` | `TEXT` | `NOT NULL DEFAULT 'normal', CHECK (priority IN ('normal','urgent'))` | ระดับความสำคัญ |
| `status` | `TEXT` | `NOT NULL DEFAULT 'pending', CHECK (status IN ('pending','in-progress','completed'))` | สถานะการดำเนินงาน |
| `created_at` | `TEXT` | `NOT NULL DEFAULT (datetime('now','localtime'))` | วันเวลาที่บันทึก |

### ความสัมพันธ์ระหว่างตาราง (Entity Relationships)
- ความสัมพันธ์แบบ **One-to-Many (1:N)**: ผู้ใช้งาน 1 คน (`users`) สามารถสร้างคำร้อง (`requests`) ได้หลายรายการ ผ่าน Foreign Key `requests.requester_id -> users.id`
- เมื่อ API ตอบสนองคำสั่ง `GET /api/requests` จะทำ `JOIN users ON users.id = requests.requester_id` เพื่อแปลง `requester_id` เป็น `requesterName` ตาม API Contract

### ดัชนี (Indexes)
เพื่อเพิ่มประสิทธิภาพการค้นหาและการกรองข้อมูล:
- `idx_requests_status` บน `requests(status)` สำหรับเร่งความเร็วการกรอง `?status=`
- `idx_requests_requester_id` บน `requests(requester_id)` สำหรับเร่งความเร็วการ `JOIN` กับตาราง `users`

---

## Users Endpoints (ส่วนต่อขยาย / Challenge)

| Method | Endpoint | คำอธิบาย | Request body | ผลลัพธ์สำเร็จ | ผิดพลาด |
|---|---|---|---|---|---|
| `GET` | `/api/users` | ดึงรายชื่อผู้ใช้ทั้งหมด | — | `200` + array ของ users | — |
| `GET` | `/api/users/:id` | ดึงข้อมูลผู้ใช้รายบุคคล | — | `200` + object ของ user | `404` ไม่พบผู้ใช้ |

