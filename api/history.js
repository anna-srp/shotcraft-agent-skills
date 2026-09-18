import { json } from '../server/http.js'
import { readState } from '../server/session.js'
import { conversationHistory } from '../server/zoowork.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
  try {
    const state = readState(req)
    return json(res, 200, await conversationHistory(state.sessionId))
  } catch {
    return json(res, 503, { error: 'Production history is temporarily unavailable.' })
  }
}
