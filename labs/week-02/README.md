# Week 02 — Modern JavaScript Learning Dashboard

## Source

```bash
npm run import:source -- week-02 /path/to/old-lab02
npm --prefix labs/week-02/source install
npm --prefix labs/week-02/source run check
npm --prefix labs/week-02/source run build
```

แก้ Vite `base` ให้ตรงกับ subpath ก่อน build:

```text
/engse203-student-labs-<student-id>/labs/week-02/
```

นำ build output เข้า publish:

```bash
npm run import:publish -- week-02 labs/week-02/source/docs
```

หากโครงงานเดิม build ไป `dist/` ให้เปลี่ยน path ท้ายคำสั่งเป็น `labs/week-02/source/dist`
