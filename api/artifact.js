import { json, secureHeaders } from '../server/http.js'
import { readState } from '../server/session.js'
import { artifactDownload } from '../server/zoowork.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
  const id = typeof req.query?.id === 'string' ? req.query.id : ''
  if (!/^art_[A-Za-z0-9]+$/.test(id)) return json(res, 400, { error: 'Invalid artifact' })
  try {
    const url = await artifactDownload(readState(req).sessionId, id)
    if (!url) return json(res, 404, { error: 'Artifact not found' })
    secureHeaders(res)
    res.statusCode = 302
    res.setHeader('Location', url)
    res.end()
  } catch {
    return json(res, 404, { error: 'Artifact not found' })
  }
}
