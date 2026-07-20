# Weekly LAB Workspace

แต่ละ LAB ใช้โครงสร้างเดียวกัน:

```text
week-NN/
├── README.md
├── lab-metadata.json
├── source/      # source code ที่ตรวจ
├── evidence/    # screenshots/test/reflection
└── publish/     # build/static output ที่ต้องมี index.html
```

- แก้ source ใน `source/`
- ห้ามใส่ `.git`, `node_modules`, secret หรือ `.env`
- ใช้ `npm run import:source` และ `npm run import:publish` เพื่อลดความผิดพลาดจากการ copy
- `publish/` เป็น input ของ Pages ส่วน `docs/` เป็น generated output
