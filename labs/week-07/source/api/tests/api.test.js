import { test, before, beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

beforeEach(async () => {
  await loadSeed();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืนรายการทั้งหมด พร้อม status 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
});

describe('GET /api/requests/:id', () => {
  test('พบคำร้อง คืน status 200 พร้อมข้อมูลคำร้อง', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('ไม่พบคำร้อง คืน status 404 พร้อมข้อความ error', async () => {
    const res = await request(app).get('/api/requests/REQ-999');
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
});

describe('POST /api/requests', () => {
  test('ส่งข้อมูลถูกต้อง คืน status 201 และสถานะเป็น pending', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id.startsWith('REQ-'));
    assert.equal(res.body.requesterName, validRequest.requesterName);
  });

  test('ส่งข้อมูลไม่ครบ คืน status 400 พร้อม details', async () => {
    const res = await request(app).post('/api/requests').send({ requesterName: 'ทดสอบ' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
    assert.ok(Array.isArray(res.body.details));
  });
});

describe('CORS', () => {
  test('CORS header ตอบ origin ที่อนุญาต', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
  });
});

describe('PUT /api/requests/:id', () => {
  test('เปลี่ยนสถานะสำเร็จ คืน status 200', async () => {
    const res = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'in-progress' });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'in-progress');
  });

  test('สถานะไม่ถูกต้อง คืน status 400', async () => {
    const res = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'invalid-status' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
});
