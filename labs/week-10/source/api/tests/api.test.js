import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => { await loadSeed(); app = createApp(); });

/**
 * TODO W10-TEST (🏠 CP33) · เขียน test อย่างน้อย 6 เคส ที่ยิงเข้าฐานข้อมูลจริง
 *   1. GET /api/requests → 200 และได้ array
 *   2. คืน requesterName ไม่ใช่ requester_id
 *   3. GET /:id พบ → 200 · ไม่พบ → 404
 *   4. POST ถูกต้อง → 201
 *   5. POST ไม่ครบ → 400
 *   6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
 */
const validRequest = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'อาคารเรียนรวม ห้อง 401',
  details: 'หลอดไฟกระพริบไม่หยุด ใช้งานไม่ได้',
  priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืนรายการทั้งหมด พร้อม status 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
  });

  test('คืน requesterName ไม่ใช่ requester_id', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    const item = res.body[0];
    assert.ok(item && 'requesterName' in item);
    assert.ok(!('requester_id' in item));
  });

  test('ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด (คืน 0 รายการ)', async () => {
    const res = await request(app).get(`/api/requests?status=${encodeURIComponent("x' OR '1'='1")}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 0);
  });
});

describe('GET /api/requests/:id', () => {
  test('GET /:id พบ → คืน status 200 พร้อมข้อมูลคำร้อง', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
    assert.ok(res.body.requesterName);
  });

  test('GET /:id ไม่พบ → คืน status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
});

describe('POST /api/requests', () => {
  test('POST ถูกต้อง → คืน status 201 พร้อมคำร้องใหม่', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.ok(res.body.id.startsWith('REQ-'));
    assert.equal(res.body.requesterName, validRequest.requesterName);
    assert.equal(res.body.status, 'pending');
  });

  test('POST ไม่ครบ → คืน status 400', async () => {
    const res = await request(app).post('/api/requests').send({ requesterName: 'ทดสอบ' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
});
