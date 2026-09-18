import { json } from '../server/http.js'
import { newConversationState, sameOrigin, setState } from '../server/session.js'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return json(res, 405, { error: 'Method not allowed' })
  if (!sameOrigin(req)) return json(res, 403, { error: 'Cross-origin request rejected' })
  setState(res, newConversationState(req))
  return json(res, 200, { ok: true })
}
