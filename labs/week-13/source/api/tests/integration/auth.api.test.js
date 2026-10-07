import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';

/**
 * Week 13 — เข้าสู่ระบบและสิทธิ์
 * test 3 ข้อแรกให้มาแล้ว — จะ fail จนกว่าจะทำ CP50–CP51 เสร็จ (เขียน test ก่อน แล้วทำให้ผ่าน)
 */
const app = createApp();
beforeEach(async () => { await loadSeed(); });

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });
  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });
  test('รหัสผ่านผิด กับ อีเมลที่ไม่มี → 401 ข้อความเดียวกัน', async () => {
    const wrong = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    const unknown = await request(app).post('/api/auth/login').send({ email: 'ghost@rmutl.ac.th', password: 'nope1234' });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.body.error).toBe(unknown.body.error);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('PUT ไม่มี token → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r.status).toBe(401);
  });
  test('DELETE ไม่มี token → 401', async () => {
    const r = await request(app).delete('/api/requests/REQ-001');
    expect(r.status).toBe(401);
  });
  test('token ปลอม (secret อื่น) → 401', async () => {
    const fakeToken = tokenFor('staff', 'not-the-real-secret');
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ status: 'completed' });
    expect(r.status).toBe(401);
  });
  test('token ที่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const requesterToken = tokenFor('requester');
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ status: 'completed' });
    expect(r.status).toBe(403);
  });
  test('เจ้าหน้าที่ → PUT 200 และ DELETE 204', async () => {
    const staffToken = await loginAsStaff(app);
    const rPut = await request(app)
      .put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'completed' });
    expect(rPut.status).toBe(200);

    const rDelete = await request(app)
      .delete('/api/requests/REQ-003')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(rDelete.status).toBe(204);
  });
});
