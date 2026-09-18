import { bodyOf, json, secureHeaders } from '../server/http.js'
import { consumeTurn, readState, sameOrigin, setState, TURN_LIMIT } from '../server/session.js'
import { openTurn, streamTurn } from '../server/zoowork.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
  if (!sameOrigin(req)) return json(res, 403, { error: 'Cross-origin request rejected' })
  const message = typeof bodyOf(req).message === 'string' ? bodyOf(req).message.trim() : ''
  if (!message || message.length > 6_000) return json(res, 400, { error: 'Enter a product-video brief between 1 and 6,000 characters.' })

  const usage = consumeTurn(readState(req))
  res.setHeader('X-RateLimit-Limit', String(TURN_LIMIT))
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, TURN_LIMIT - usage.state.used)))
  if (!usage.ok) {
    res.setHeader('Retry-After', String(usage.retryAfter))
    setState(res, usage.state)
    return json(res, 429, { error: 'This browser has reached the hourly production limit.', retryAfter: usage.retryAfter })
  }

  try {
    const turn = await openTurn(message, usage.state)
    setState(res, { ...usage.state, sessionId: turn.sessionId })
    secureHeaders(res)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders?.()

    const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)
    send({ type: 'status', message: usage.state.sessionId ? 'Continuing your private production thread' : 'Opening your private production thread' })
    const controller = new AbortController()
    res.on('close', () => { if (!res.writableEnded) controller.abort() })
    await streamTurn(turn, send, controller.signal)
    res.end()
  } catch {
    if (!res.headersSent) return json(res, 503, { error: 'Shotcraft is temporarily unavailable. Please try again.' })
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Shotcraft is temporarily unavailable. Please try again.' })}\n\n`)
    res.end()
  }
}
