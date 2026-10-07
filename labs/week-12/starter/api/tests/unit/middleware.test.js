import { describe, test, expect, vi } from 'vitest';
import { AppError, errorHandler, asyncHandler, notFound } from '../../src/middleware/errorHandler.js';
import { logger } from '../../src/middleware/logger.js';

describe('errorHandler middleware', () => {
  test('AppError sets message and status', () => {
    const err = new AppError('ข้อผิดพลาด', 400);
    expect(err.message).toBe('ข้อผิดพลาด');
    expect(err.status).toBe(400);
  });

  test('asyncHandler forwards error to next', async () => {
    const failFn = async () => { throw new Error('boom'); };
    const next = vi.fn();
    const handler = asyncHandler(failFn);
    await handler({}, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('notFound sends 404 json', () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    notFound({ method: 'GET', originalUrl: '/test' }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });

  test('errorHandler handles 500 error', () => {
    const err = new Error('server crash');
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    errorHandler(err, {}, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }));
    spy.mockRestore();
  });

  test('errorHandler handles 400 AppError', () => {
    const err = new AppError('bad input', 400);
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    errorHandler(err, {}, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'bad input' }));
  });
});

describe('logger middleware', () => {
  test('calls next and logs on finish', () => {
    let finishCb;
    const req = { method: 'GET', originalUrl: '/api/test' };
    const res = {
      statusCode: 200,
      on: (event, cb) => {
        if (event === 'finish') finishCb = cb;
      },
    };
    const next = vi.fn();
    logger(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(typeof finishCb).toBe('function');
    finishCb();
  });
});
