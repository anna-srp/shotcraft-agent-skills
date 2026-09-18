import './style.css'
import { buildProductionRequest } from './production-request.js'

const conversation = document.querySelector('#conversation')
const form = document.querySelector('#composer')
const sendButton = document.querySelector('#send')
const newButton = document.querySelector('#newConversation')
const requestInput = document.querySelector('#request')
const evidenceInput = document.querySelector('#evidence')
const statusBox = document.querySelector('#status')
const statusText = document.querySelector('#statusText')
const elapsed = document.querySelector('#elapsed')
const errorBox = document.querySelector('#error')
const artifactsBox = document.querySelector('#artifacts')
const renderedArtifacts = new Set()
let busy = false
let timer
let startedAt = 0
const POLL_INTERVAL_MS = 4_000
const PRODUCTION_WAIT_MS = 20 * 60 * 1000

function setBusy(value, label = 'Preparing the complete production') {
  busy = value
  sendButton.disabled = value
  newButton.disabled = value
  form.querySelectorAll('input, textarea, select').forEach((field) => { field.disabled = value })
  form.setAttribute('aria-busy', String(value))
  sendButton.querySelector('span').textContent = value ? 'Producing video…' : 'Produce video'
  sendButton.querySelector('b').textContent = value ? '●' : '↗'
  statusBox.hidden = !value
  if (value) {
    startedAt = Date.now()
    statusText.textContent = label
    elapsed.textContent = '0s'
    clearInterval(timer)
    timer = setInterval(() => { elapsed.textContent = `${Math.floor((Date.now() - startedAt) / 1000)}s` }, 1000)
  } else {
    clearInterval(timer)
  }
}

function showError(message = '') {
  errorBox.hidden = !message
  errorBox.textContent = message
}

function linkify(container, text) {
  for (const part of text.split(/(https?:\/\/[^\s)]+)/g)) {
    if (/^https?:\/\//.test(part)) {
      const link = document.createElement('a')
      link.href = part
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = part
      container.append(link)
    } else {
      container.append(document.createTextNode(part))
    }
  }
}

function addMessage(role, text) {
  document.querySelector('#emptyState')?.remove()
  const article = document.createElement('article')
  article.className = `message ${role}`
  const label = document.createElement('span')
  label.className = 'message-label'
  label.textContent = role === 'user' ? 'PRODUCTION INPUT' : 'SHOTCRAFT'
  const body = document.createElement('p')
  if (role === 'assistant') linkify(body, text)
  else body.textContent = text
  article.append(label, body)
  conversation.append(article)
  conversation.scrollTop = conversation.scrollHeight
  return article
}

function formatBytes(bytes) {
  if (!bytes) return 'Published file'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function renderArtifacts(artifacts = []) {
  for (const artifact of artifacts) {
    if (!artifact?.id || renderedArtifacts.has(artifact.id)) continue
    renderedArtifacts.add(artifact.id)
    artifactsBox.hidden = false
    const card = document.createElement('article')
    card.className = `artifact-card ${artifact.contentType === 'video/mp4' ? 'video' : ''}`
    const meta = document.createElement('div')
    const state = document.createElement('span')
    state.textContent = artifact.status === 'ready' ? 'REVIEWED ARTIFACT READY' : artifact.status.toUpperCase()
    const title = document.createElement('b')
    title.textContent = artifact.name
    const detail = document.createElement('small')
    detail.textContent = `${artifact.contentType} · ${formatBytes(artifact.size)}`
    meta.append(state, title, detail)
    card.append(meta)
    if (artifact.status === 'ready') {
      const link = document.createElement('a')
      link.href = artifact.downloadUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = artifact.contentType === 'video/mp4' ? 'Open / download MP4 ↗' : 'Open / download ↗'
      card.append(link)
    }
    artifactsBox.append(card)
  }
}

function parseSseBlock(block) {
  const line = block.split('\n').find((item) => item.startsWith('data: '))
  if (!line) return null
  try { return JSON.parse(line.slice(6)) } catch { return null }
}

function composeRequest() {
  const values = {
    evidence: evidenceInput.value.trim(),
    urls: document.querySelector('#assetUrls').value.trim(),
    goal: document.querySelector('#goal').value.trim(),
    audience: document.querySelector('#audience').value.trim(),
    duration: document.querySelector('#duration').value,
    aspect: document.querySelector('#aspect').value,
    tone: document.querySelector('#tone').value.trim(),
    cta: document.querySelector('#cta').value.trim(),
    mode: document.querySelector('#mode').value,
    engine: document.querySelector('#engine').value,
    request: requestInput.value.trim(),
  }
  return buildProductionRequest(values)
}

async function fetchHistory() {
  const response = await fetch('/api/history', { headers: { accept: 'application/json' } })
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Production history is temporarily unavailable.')
  }
  return response.json()
}

async function waitForProduction(label = 'Production is still running — waiting for the reviewed MP4') {
  const deadline = Date.now() + PRODUCTION_WAIT_MS
  let inactiveSnapshots = 0
  statusText.textContent = label
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    let data
    try {
      data = await fetchHistory()
    } catch {
      statusText.textContent = 'Production is still running — reconnecting to durable history'
      continue
    }
    renderHistory(data)
    if (data.active) {
      inactiveSnapshots = 0
      statusText.textContent = 'Production is running on ZooWork — this page can recover after refresh'
      continue
    }
    inactiveSnapshots += 1
    if (inactiveSnapshots >= 2) return data
  }
  throw new Error('Production is still running after 20 minutes. Refresh later to restore the same Session; do not submit it again.')
}

async function send(message) {
  if (busy || !message) return
  if (message.length > 6_000) return showError('The complete brief is over 6,000 characters. Shorten the evidence or production request and try again.')
  showError()
  addMessage('user', message)
  requestInput.value = ''
  setBusy(true)
  if (window.innerWidth <= 980) document.querySelector('.production-panel').scrollIntoView({ behavior: 'smooth', block: 'start' })
  let collected = ''
  let assistantNode
  let finished = false
  let pending = false

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Shotcraft is unavailable right now.')
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() || ''
      for (const block of blocks) {
        const event = parseSseBlock(block)
        if (!event) continue
        if (event.type === 'status') statusText.textContent = event.message
        if (event.type === 'assistant') {
          collected += `${collected ? '\n\n' : ''}${event.text}`
          assistantNode?.remove()
          assistantNode = addMessage('assistant', collected)
        }
        if (event.type === 'artifacts') renderArtifacts(event.artifacts)
        if (event.type === 'done') finished = true
        if (event.type === 'pending') {
          pending = true
          statusText.textContent = event.message
        }
        if (event.type === 'error') throw new Error(event.message)
      }
      if (done) break
    }
    if (pending || !finished) await waitForProduction()
  } catch (error) {
    showError(error.message || 'Something went wrong. Please try again.')
  } finally {
    setBusy(false)
    requestInput.focus()
  }
}

function renderHistory(data) {
  if (data.messages?.length) {
    conversation.replaceChildren()
    for (const message of data.messages) addMessage(message.role, message.text)
  }
  renderArtifacts(data.artifacts)
}

async function loadHistory() {
  let restoring = false
  try {
    const data = await fetchHistory()
    renderHistory(data)
    if (data.active) {
      restoring = true
      setBusy(true, 'Restoring the active production from ZooWork')
      await waitForProduction('Restoring the active production from ZooWork')
    }
  } catch {
    showError('Production history could not be restored. You can still start a new conversation.')
  } finally {
    if (restoring) setBusy(false)
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const message = composeRequest()
  if (!message) {
    evidenceInput.setCustomValidity('Add authorized product evidence, a production goal, or a clear request.')
    evidenceInput.reportValidity()
    evidenceInput.focus()
    return
  }
  evidenceInput.setCustomValidity('')
  void send(message)
})

evidenceInput.addEventListener('input', () => evidenceInput.setCustomValidity(''))

document.querySelectorAll('[data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    requestInput.value = button.dataset.example || ''
    requestInput.focus()
    document.querySelector('#studio').scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

requestInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    form.requestSubmit()
  }
})

newButton.addEventListener('click', async () => {
  if (busy) return
  showError()
  const response = await fetch('/api/conversation', { method: 'DELETE' })
  if (!response.ok) return showError('Could not start a new conversation. Please try again.')
  conversation.innerHTML = '<div id="emptyState" class="empty-state"><div class="slate"><span>SC</span><i></i></div><blockquote>“New cut. Same rule: product truth first.”</blockquote><p>Add evidence or choose a production starting point.</p></div>'
  artifactsBox.replaceChildren()
  artifactsBox.hidden = true
  renderedArtifacts.clear()
  form.reset()
  evidenceInput.focus()
})

void loadHistory()
