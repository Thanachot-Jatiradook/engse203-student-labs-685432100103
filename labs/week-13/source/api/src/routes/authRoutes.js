import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();

const failedAttempts = new Map();

export function resetLoginLimiter() {
  failedAttempts.clear();
}

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }

  const email = (req.body.email || '').toLowerCase().trim();
  const attempts = failedAttempts.get(email) || 0;
  if (attempts >= 5) {
    return res.status(429).json({ error: 'ลองผิดเกินกำหนด กรุณารอสักครู่' });
  }

  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    failedAttempts.set(email, attempts + 1);
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  failedAttempts.delete(email);
  res.status(200).json(result);
});

export default router;
