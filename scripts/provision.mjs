import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import {
  ZooworkError,
  createZooworkClient,
} from '@zoowork-ai/sdk'

const root = process.cwd()
const stateDir = path.join(root, '.zoowork')
const statePath = path.join(stateDir, 'shotcraft-agent.json')
const packageDir = path.join(stateDir, 'packages')
const skillNames = [
  'product-video-brief',
  'cinematic-shot-planning',
  'remotion-video-production',
  'product-video-review',
]
const labels = {
  app: 'shotcraft',
  role: 'product-video-builder',
  deployment: 'persistent',
}

async function loadEnv() {
  if (process.env.ZOOWORK_API_KEY?.startsWith('zct_')) return

  const raw = await readFile(path.join(root, '.env'), 'utf8')
  const line = raw.split(/\r?\n/).find((entry) => entry.startsWith('ZOOWORK_API_KEY='))
  if (!line) throw new Error('ZOOWORK_API_KEY is missing from .env')
  let value = line.slice('ZOOWORK_API_KEY='.length).trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  if (!value.startsWith('zct_')) throw new Error('ZOOWORK_API_KEY in .env is not a zct_ key')
  process.env.ZOOWORK_API_KEY = value
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') return {}
    throw error
  }
}

async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir)
  const files = []
  for (const entry of entries.sort()) {
    const absolute = path.join(dir, entry)
    const relative = path.join(prefix, entry)
    const info = await stat(absolute)
    if (info.isDirectory()) files.push(...await listFiles(absolute, relative))
    else if (info.isFile()) files.push(relative)
  }
  return files
}

async function hashDirectory(dir) {
  const hash = createHash('sha256')
  for (const file of await listFiles(dir)) {
    hash.update(file)
    hash.update('\0')
    hash.update(await readFile(path.join(dir, file)))
    hash.update('\0')
  }
  return hash.digest('hex')
}

async function packageSkill(name) {
  const dir = path.join(root, 'skills', name)
  const entrypoint = await readFile(path.join(dir, 'SKILL.md'), 'utf8')
  const frontmatter = entrypoint.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const declaredName = frontmatter?.[1].match(/^name:\s*([^\s#]+)\s*$/m)?.[1]
  const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim()
  if (declaredName !== name) {
    throw new Error(`Skill directory ${name} does not match frontmatter name ${declaredName ?? '(missing)'}`)
  }
  if (!description) throw new Error(`Skill ${name} has no frontmatter description`)

  await mkdir(packageDir, { recursive: true })
  const zipPath = path.join(packageDir, `${name}.zip`)
  await rm(zipPath, { force: true })
  execFileSync('zip', ['-q', '-r', '-X', zipPath, name], {
    cwd: path.join(root, 'skills'),
    stdio: 'inherit',
  })
  return {
    name,
    hash: await hashDirectory(dir),
    zipPath,
  }
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

async function findAgent(zc, state) {
  if (state.agentId) {
    try {
      return { agent: await zc.getAgent(state.agentId), source: 'saved-state' }
    } catch (error) {
      if (!(error instanceof ZooworkError) || error.status !== 404) throw error
    }
  }

  const page = await zc.listAgents({ labels })
  if (page.data.length) return { agent: page.data[0], source: 'stable-labels' }
  return { agent: undefined, source: 'new' }
}

async function waitForOwnedSkill(zc, name, skillId, minVersion, timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const rows = await zc.listSkills({ q: name })
    const row = rows.find((candidate) => candidate.skill_id === skillId)
    if (row && Number(row.latest_version ?? 0) >= minVersion && row.status !== 'failed') return row
    await new Promise((resolve) => setTimeout(resolve, 1_500))
  }
  throw new Error(`Timed out waiting for skill ${name} version ${minVersion}`)
}

await loadEnv()
await mkdir(stateDir, { recursive: true })
const state = await readJson(statePath)
state.skills ??= {}
const zc = createZooworkClient()

const models = await zc.listModels()
if (!models.length) throw new Error('ZooWork returned no models')
const preferred = [
  'litellm/gpt-5.6-terra',
  'litellm/gpt-5.6-sol',
  'litellm/gpt-5.5',
]
const model = preferred.find((candidate) => models.some((entry) => entry.model === candidate)) ?? models[0].model

const persona = await readFile(path.join(root, 'agent', 'AGENTS.md'), 'utf8')
let { agent, source } = await findAgent(zc, state)

if (!agent) {
  agent = await zc.createAgent({
    resource: {
      name: 'Product Video Builder',
      model: { primary: model },
      persona: { docs: [{ name: 'AGENTS.md', content: persona }] },
      labels,
      sandbox: { scope: 'agent' },
    },
  }, 'shotcraft-product-video-builder-v1')
  source = 'created'
  agent = await zc.getAgent(agent.agent_id)
} else {
  const declared = agent.declared ?? {}
  const updates = {}
  if (declared.name !== 'Product Video Builder') updates.name = 'Product Video Builder'
  if (declared.model?.primary !== model) updates.model = { primary: model }
  const desiredPersona = { docs: [{ name: 'AGENTS.md', content: persona }] }
  if (!sameJson(declared.persona, desiredPersona)) updates.persona = desiredPersona
  if (!Object.entries(labels).every(([key, value]) => declared.labels?.[key] === value)) updates.labels = labels
  if (declared.sandbox?.scope !== 'agent') updates.sandbox = { scope: 'agent' }
  if (Object.keys(updates).length) agent = await zc.updateAgent(agent.agent_id, updates)
}

state.agentId = agent.agent_id
state.agentName = 'Product Video Builder'
state.model = model
state.labels = labels
state.updatedAt = new Date().toISOString()
await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })

const before = await zc.listAgentSkills(agent.agent_id, { verbose: true })
for (const local of await Promise.all(skillNames.map(packageSkill))) {
  const candidates = (await zc.listSkills({ q: local.name }))
    .filter((row) => row.name === local.name && (row.scope === 'org' || row.scope === 'personal'))
  let skill = candidates.find((row) => row.skill_id === state.skills[local.name]?.skillId)
    ?? candidates.find((row) => row.scope === 'org')
    ?? candidates[0]
  let version
  let uploaded = false

  if (!skill) {
    skill = await zc.uploadSkill(await readFile(local.zipPath), {
      scope: 'org',
      fileName: `${local.name}.zip`,
      idempotencyKey: `shotcraft-${local.name}-v1`,
    })
    version = Number(skill.latest_version ?? 1)
    uploaded = true
  } else if (state.skills[local.name]?.hash !== local.hash || state.skills[local.name]?.skillId !== skill.skill_id) {
    const createdVersion = await zc.uploadSkillVersion(skill.skill_id, await readFile(local.zipPath), {
      fileName: `${local.name}.zip`,
      idempotencyKey: `shotcraft-${local.name}-${local.hash.slice(0, 16)}`,
    })
    version = Number(createdVersion.version)
    uploaded = true
  } else {
    version = Number(skill.latest_version ?? state.skills[local.name]?.version ?? 1)
  }

  skill = await waitForOwnedSkill(zc, local.name, skill.skill_id, version)
  version = Number(skill.latest_version ?? version)

  const attachedBefore = before.find((row) => row.skill_id === skill.skill_id)
  const attachmentTracked = state.skills[local.name]?.skillId === skill.skill_id
  if (!attachedBefore || !attachmentTracked) {
    await zc.putAgentSkill(agent.agent_id, skill.skill_id, { enabled: true, versionPin: null })
  }

  state.skills[local.name] = {
    skillId: skill.skill_id,
    scope: skill.scope,
    version,
    hash: local.hash,
    uploaded,
  }
  state.updatedAt = new Date().toISOString()
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })
}

const attached = await zc.listAgentSkills(agent.agent_id, { verbose: true })
const verifiedSkills = skillNames.map((name) => {
  const expected = state.skills[name]
  const row = attached.find((candidate) => candidate.skill_id === expected.skillId)
  if (!row) throw new Error(`Skill ${name} did not resolve onto the Agent`)
  if (row.eligible === false) throw new Error(`Skill ${name} is attached but ineligible`)
  if (row.enabled === false) throw new Error(`Skill ${name} is attached but disabled`)
  return {
    name,
    skillId: expected.skillId,
    version: row.version ?? expected.version,
    enabled: row.enabled !== false,
    eligible: row.eligible !== false,
  }
})

const current = await zc.getAgent(agent.agent_id)
if (current.status?.desired_state !== 'running') await zc.startAgent(agent.agent_id)
const running = await zc.waitUntilRunning(agent.agent_id, { timeoutMs: 90_000 })
if (running.status?.desired_state !== 'running') throw new Error('Agent did not reach desired_state=running')

state.desiredState = 'running'
state.updatedAt = new Date().toISOString()
await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })

console.log(JSON.stringify({
  status: 'running',
  source,
  agentId: agent.agent_id,
  model,
  skills: verifiedSkills,
}, null, 2))
