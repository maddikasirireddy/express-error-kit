const test = require('node:test');
const assert = require('node:assert/strict');
const { AppError, asyncHandler, errorHandler } = require('../src');

test('AppError carries message, status, and code', () => {
  const err = new AppError('Missing', 404, 'NOT_FOUND');
  assert.equal(err.message, 'Missing');
  assert.equal(err.statusCode, 404);
  assert.equal(err.code, 'NOT_FOUND');
  assert.ok(err instanceof Error);
});

test('asyncHandler forwards rejected promises', async () => {
  const err = new Error('failed');
  await new Promise((resolve, reject) => {
    const next = (received) => { try { assert.equal(received, err); resolve(); } catch (e) { reject(e); } };
    asyncHandler(async () => { throw err; })({}, {}, next);
  });
});

test('asyncHandler forwards synchronous throws', async () => {
  const err = new Error('sync');
  await new Promise((resolve, reject) => {
    asyncHandler(() => { throw err; })({}, {}, received => {
      try { assert.equal(received, err); resolve(); } catch (e) { reject(e); }
    });
  });
});

function mockRes() {
  return { headersSent: false, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}

test('errorHandler formats known client errors', () => {
  const res = mockRes();
  errorHandler(new AppError('Not found', 404, 'NOT_FOUND'), {}, res, () => {});
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { success: false, error: { message: 'Not found', code: 'NOT_FOUND', statusCode: 404 } });
});

test('errorHandler hides server errors in production', () => {
  const old = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const res = mockRes();
    errorHandler(new Error('database secret'), {}, res, () => {});
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.error.message, 'Internal Server Error');
  } finally {
    if (old === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = old;
  }
});

test('errorHandler delegates when headers are already sent', () => {
  const err = new Error('oops');
  const res = { headersSent: true };
  let forwarded;
  errorHandler(err, {}, res, e => { forwarded = e; });
  assert.equal(forwarded, err);
});

test('errorHandler normalizes invalid statuses', () => {
  const res = mockRes();
  errorHandler({ message: 'bad status', statusCode: 200 }, {}, res, () => {});
  assert.equal(res.statusCode, 500);
});
