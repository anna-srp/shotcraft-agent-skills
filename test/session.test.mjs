import assert from 'node:assert/strict'
import test from 'node:test'
import { consumeTurn, seal, TURN_LIMIT, unseal } from '../server/session.js'

process.env.SESSION_COOKIE_SECRET = 'test-secret-that-is-long-enough-123456'

test('signed visitor state round-trips and rejects tampering', () => {
  const token = seal({ visitorId: 'visitor_test', sessionId: 'session_test', expiresAt: Date.now() + 10_000 })
  assert.equal(unseal(token)?.sessionId, 'session_test')
  assert.equal(unseal(`${token}x`), null)
})

test('hourly usage limit is enforced', () => {
  let state = { visitorId: 'v', windowStartedAt: Date.now(), used: 0, expiresAt: Date.now() + 10_000 }
  for (let index = 0; index < TURN_LIMIT; index += 1) {
    const result = consumeTurn(state)
    assert.equal(result.ok, true)
    state = result.state
  }
  assert.equal(consumeTurn(state).ok, false)
})
