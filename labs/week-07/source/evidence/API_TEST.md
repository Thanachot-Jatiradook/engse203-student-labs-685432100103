# รายงานการทดสอบ API (API Testing Report)

**Base URL:** `http://localhost:3001/api`
**เครื่องมือที่ใช้ทดสอบ:** [ระบุเครื่องมือ เช่น Thunder Client / Postman / REST Client]

---

**1. ทดสอบการดึงข้อมูลทั้งหมด (GET Requests)**
* **Endpoint:** `GET /requests`
* **รายละเอียด:** ดึงรายการคำร้องทั้งหมด
* **Request Body:** `(ไม่มี)`
* **Status Code ที่คาดหวัง:** `200 OK`
* **ผลลัพธ์ (Response Body):**
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
    },
    {
        "id": "REQ-002",
        "requesterName": "สุภาวดี รักเรียน",
        "requestType": "บริการบัญชีผู้ใช้",
        "location": "อาคารวิศวกรรมซอฟต์แวร์",
        "details": "เข้าสู่ระบบห้องปฏิบัติการไม่ได้",
        "priority": "normal",
        "status": "in-progress"
    },
    {
        "id": "REQ-003",
        "requesterName": "ธนกฤต ตั้งใจ",
        "requestType": "ขอใช้อุปกรณ์",
        "location": "ห้องประชุม 2",
        "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน",
        "priority": "normal",
        "status": "completed"
    },
    {
        "id": "REQ-MU1DI340-TCL1",
        "requesterName": "สมชาย ใจดี",
        "requestType": "แจ้งซ่อม",
        "location": "ห้องปฏิบัติการ 301",
        "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
        "priority": "urgent",
        "status": "pending"
    }
  ]


**2. ทดสอบการสร้างข้อมูลใหม่ - กรณีข้อมูลถูกต้อง (POST Success)**
* **Endpoint:** POST /requests
* **รายละเอียด:** สร้างคำร้องใหม่โดยส่งข้อมูลครบถ้วนตามเงื่อนไข
* **Status Code ที่คาดหวัง:** 201 Created (หรือ 200 OK)
* **Request Body:**

        "requesterName": "สมชาย ใจดี",
        "requestType": "แจ้งซ่อม",
        "location": "ห้องปฏิบัติการ 301",
        "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
        "priority": "urgent"
    
**3. ทดสอบระบบ Validation - กรณีข้อมูลไม่ครบ (POST Bad Request)**
* **Endpoint:** POST /requests
* **รายละเอียด:** ทดสอบส่งข้อมูลไม่ครบถ้วน (เช่น ขาดฟิลด์ title) เพื่อดูการดักจับ Error
* **Request Body:**

        {
        "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า"
        }

* **Status Code ที่คาดหวัง:** 400 Bad Request
* **ผลลัพธ์ที่ตอบกลับจากเซิร์ฟเวอร์ (Response Body):**

        {
            "error": "ข้อมูลคำร้องไม่ถูกต้อง",
            "details":
            ["ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร",
            "ประเภทคำร้องไม่ถูกต้อง",
            "กรุณาระบุสถานที่",
            "ความเร่งด่วนต้องเป็น normal หรือ urgent"]
        }

**4. ทดสอบระบบ Validation - กรณีข้อมูลผิดรูปแบบ (POST Invalid Data)**
* **Endpoint:** POST /requests
* **รายละเอียด:** ทดสอบส่งประเภทข้อมูลผิด (เช่น priority ไม่ได้อยู่ในค่าที่กำหนด)
* **Request Body:**

        {
            "requesterName": "สมชาย ใจดี",
            "requestType": "แจ้งซ่อม",
            "location": "ห้องปฏิบัติการ 301",
            "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
            "priority": "super-urgent",
            "status": "pending"
        }

* **Status Code ที่คาดหวัง:** 400 Bad Request
* **ผลลัพธ์ที่ตอบกลับจากเซิร์ฟเวอร์ (Response Body):**

        {
            "error": "ข้อมูลคำร้องไม่ถูกต้อง",
            "details": ["ความเร่งด่วนต้องเป็น normal หรือ urgent"]
        }
