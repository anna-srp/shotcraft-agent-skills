import { randomUUID } from 'node:crypto'
import { assistantText, createZooworkClient, isRunFinished, messageText, runOutcome, toolCall } from '@zoowork-ai/sdk'

export function runtime() {
  const apiKey = process.env.ZOOWORK_API_KEY
  const agentId = process.env.ZOOWORK_AGENT_ID
  if (!apiKey?.startsWith('zct_')) throw new Error('ZooWork API key is not configured')
  if (!agentId?.startsWith('agt_')) throw new Error('Product Video Builder Agent is not configured')
  return { client: createZooworkClient({ apiKey }), agentId }
}

export async function openTurn(message, state) {
  const { client, agentId } = runtime()
  if (!state.sessionId) {
    const session = await client.createSession(agentId, {
      initial_events: [{ type: 'user.message', content: message, actor: { ref: state.visitorId }, idempotency_key: `msg_${randomUUID()}` }],
      metadata: { origin: 'shotcraft-public-ui' },
    }, `conversation_${randomUUID()}`)
    return { client, agentId, sessionId: session.session_id, skipThrough: 0 }
  }

  const receipt = await client.postEvents(agentId, state.sessionId, [{
    type: 'user.message',
    content: message,
    actor: { ref: state.visitorId },
    idempotency_key: `msg_${randomUUID()}`,
  }])
  const accepted = receipt.events[0]
  if (accepted?.accepted === false) throw new Error('The message was not accepted')
  return { client, agentId, sessionId: state.sessionId, skipThrough: Number(accepted?.seq ?? 0) }
}

function toolProgress(call) {
  if (!call || call.phase !== 'start') return null
  const name = call.toolName.toLowerCase()
  const input = JSON.stringify(call.args ?? {}).toLowerCase()
  if (input.includes('product-video-review')) return 'Reviewing the actual rendered MP4'
  if (input.includes('remotion-video-production')) return 'Building the approved cut in Remotion'
  if (input.includes('cinematic-shot-planning')) return 'Turning the brief into a production storyboard'
  if (input.includes('product-video-brief')) return 'Resolving product truth and the production brief'
  if (name.includes('render') || name.includes('remotion')) return 'Rendering the approved cut with Remotion'
  if (name.includes('video') || name.includes('image')) return 'Producing an approved media shot'
  if (name.includes('web')) return 'Checking authorized public product evidence'
  if (name.includes('read')) return 'Applying the right production method'
  return 'Advancing the product-video workflow'
}

function publicArtifact(row) {
  return {
    id: row.artifact_id,
    name: row.file_name || 'Published video artifact',
    contentType: row.content_type || 'application/octet-stream',
    size: Number(row.size || 0),
    status: row.status || 'pending',
    downloadUrl: `/api/artifact?id=${encodeURIComponent(row.artifact_id)}`,
  }
}

export async function artifactsFor(client, agentId, sessionId) {
  try {
    const page = await client.listArtifacts(agentId, { sessionId, limit: 50 })
    return (page.artifacts || []).filter((row) => row.status !== 'deleted').map(publicArtifact)
  } catch {
    return []
  }
}

export async function streamTurn(turn, onEvent, signal) {
  const deadline = Date.now() + 105_000
  let cursor
  let attempts = 0
  while (!signal.aborted && Date.now() < deadline && attempts < 5) {
    attempts += 1
    try {
      for await (const event of turn.client.streamEvents(turn.agentId, turn.sessionId, {
        ...(cursor ? { cursor } : {}),
        signal,
      })) {
        cursor = event.cursor ?? cursor
        if (event.seq > 0 && event.seq <= turn.skipThrough) continue
        const progress = toolProgress(toolCall(event))
        if (progress) onEvent({ type: 'status', message: progress })
        const text = assistantText(event).trim()
        if (text) onEvent({ type: 'assistant', text })
        if (isRunFinished(event)) {
          const outcome = runOutcome(event)
          if (outcome === 'succeeded') {
            const artifacts = await artifactsFor(turn.client, turn.agentId, turn.sessionId)
            if (artifacts.length) onEvent({ type: 'artifacts', artifacts })
            onEvent({ type: 'done' })
          } else {
            onEvent({ type: 'error', message: 'Shotcraft could not finish this turn. Please try again.' })
          }
          return outcome
        }
      }
    } catch (error) {
      if (error?.status >= 400 && error?.status < 500) throw error
    }
    if (!signal.aborted && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, Math.min(800 * 2 ** attempts, 5_000)))
  }
  if (!signal.aborted) {
    onEvent({
      type: 'pending',
      message: 'Production is still running on ZooWork. Keeping watch through durable Session history and artifacts.',
    })
  }
  return 'pending'
}

export async function conversationHistory(sessionId) {
  if (!sessionId) return { messages: [], artifacts: [], active: false }
  const { client, agentId } = runtime()
  const [events, session, artifacts] = await Promise.all([
    client.listAllEvents(agentId, sessionId, { types: ['user.message', 'agent.assistant'] }),
    client.getSession(agentId, sessionId),
    artifactsFor(client, agentId, sessionId),
  ])
  const messages = []
  for (const event of events) {
    if (event.eventType === 'user.message') {
      const text = messageText({ role: 'user', content: event.payload.content }).trim()
      if (text) messages.push({ role: 'user', text })
    } else if (event.eventType === 'agent.assistant') {
      const text = assistantText(event).trim()
      if (text) messages.push({ role: 'assistant', text })
    }
  }
  const status = session.run_status ?? session.status
  const active = !!status && !['idle', 'succeeded', 'failed', 'error', 'aborted', 'canceled', 'cancelled', 'archived'].includes(status)
  return { messages, artifacts, active, status: status || 'unknown' }
}

export async function artifactDownload(sessionId, artifactId) {
  if (!sessionId) return null
  const { client, agentId } = runtime()
  const artifact = await client.getArtifact(agentId, artifactId)
  if (artifact.session_id !== sessionId || artifact.status !== 'ready') return null
  const download = await client.downloadArtifact(agentId, artifactId)
  return download.url || null
}
