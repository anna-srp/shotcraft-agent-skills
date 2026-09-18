import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

export const COOKIE_NAME = 'shotcraft_session'
export const TURN_LIMIT = 6
export const WINDOW_MS = 60 * 60 * 1000
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7

function secret() {
  const value = process.env.SESSION_COOKIE_SECRET
  if (!value || value.length < 24) throw new Error('SESSION_COOKIE_SECRET must be at least 24 characters')
  return value
}

function signature(payload) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function seal(value) {
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url')
  return `${payload}.${signature(payload)}`
}

export function unseal(value) {
  if (!value || !value.includes('.')) return null
  const [payload, supplied] = value.split('.', 2)
  const expected = signature(payload)
  const a = Buffer.from(supplied)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || parsed.expiresAt < Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

function cookies(req) {
  return Object.fromEntries(String(req.headers.cookie ?? '').split(';').map((item) => item.trim()).filter(Boolean).map((item) => {
    const index = item.indexOf('=')
    return index < 0 ? [item, ''] : [item.slice(0, index), decodeURIComponent(item.slice(index + 1))]
  }))
}

export function readState(req) {
  const now = Date.now()
  const stored = unseal(cookies(req)[COOKIE_NAME])
  if (stored) return stored
  return {
    visitorId: `visitor_${randomUUID().replaceAll('-', '')}`,
    windowStartedAt: now,
    used: 0,
    expiresAt: now + COOKIE_TTL_SECONDS * 1000,
  }
}

export function setState(res, state) {
  const value = seal({ ...state, expiresAt: Date.now() + COOKIE_TTL_SECONDS * 1000 })
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_TTL_SECONDS}`)
}

export function newConversationState(req) {
  const state = readState(req)
  return { ...state, sessionId: undefined, expiresAt: Date.now() + COOKIE_TTL_SECONDS * 1000 }
}

export function consumeTurn(state) {
  const now = Date.now()
  const current = now - state.windowStartedAt < WINDOW_MS ? state : { ...state, windowStartedAt: now, used: 0 }
  if (current.used >= TURN_LIMIT) {
    return { ok: false, state: current, retryAfter: Math.max(1, Math.ceil((current.windowStartedAt + WINDOW_MS - now) / 1000)) }
  }
  return { ok: true, state: { ...current, used: current.used + 1 } }
}

export function sameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return origin === `${proto}://${host}`
}
