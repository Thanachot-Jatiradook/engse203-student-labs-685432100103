# ENGSE203 Student LAB Portfolio

Repository เดียวสำหรับเก็บผลงาน LAB ตลอดรายวิชา โดยใช้ branch รายสัปดาห์และ GitHub Pages Hub สำหรับตรวจผลลัพธ์

## เริ่มต้น

อ่านและทำตาม [START_HERE_LAB01_TO_LAB03.md](./START_HERE_LAB01_TO_LAB03.md) ทีละขั้น

```bash
nvm use
npm install
npm run setup -- --student-id 6500000000 --name "ชื่อ นามสกุล" --section SEC1 --github github-user
```

## Repository Contract

| รายการ | รูปแบบ |
|---|---|
| Repository | `engse203-student-labs-<student-id>` |
| Weekly branch | `lab/week-NN` |
| Source | `labs/week-NN/source/` |
| Evidence | `labs/week-NN/evidence/` |
| Publish input | `labs/week-NN/publish/` |
| Pages output | `docs/labs/week-NN/` |
| Pages source | `main /docs` |
| Submission | Pages Hub URL + PR URL + Tag/Commit |

## คำสั่งหลัก

```bash
npm run import:source -- week-01 /path/to/old-lab01-repository
npm run import:publish -- week-03 labs/week-03/source
npm run build:pages
npm run verify
```

ห้ามแก้ไฟล์ใน `docs/` ด้วยมือ เพราะ `npm run build:pages` จะสร้างใหม่จาก config, metadata และโฟลเดอร์ `publish/`

## Pages URL

```text
https://<github-username>.github.io/engse203-student-labs-<student-id>/
```

## เพิ่ม LAB ในอนาคต

```bash
npm run add:lab -- week-04 "React Campus Service Request"
```

จากนั้นใช้ workflow เดิมกับ `lab/week-04` และ `labs/week-04/`
