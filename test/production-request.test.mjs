import assert from 'node:assert/strict'
import test from 'node:test'
import { buildProductionRequest } from '../src/production-request.js'

const base = {
  evidence: 'The product can compare an entered draft with an approved tone guide.',
  urls: '',
  goal: 'Drive a trial',
  audience: 'US customer-success leaders',
  duration: '15 seconds',
  aspect: '16:9 landscape',
  tone: 'Precise',
  cta: 'Start a trial',
  engine: 'Remotion default',
  request: '',
}

test('autonomous mode explicitly requires a reviewed MP4 instead of stopping at the brief', () => {
  const result = buildProductionRequest({ ...base, mode: 'Autonomous — produce the complete video' })
  assert.match(result, /Produce the complete product video and deliver the reviewed MP4/)
  assert.match(result, /continue automatically through deterministic Remotion production/)
  assert.match(result, /Do not stop at the brief or storyboard/)
})

test('brief-only mode remains an explicit no-render path', () => {
  const result = buildProductionRequest({ ...base, mode: 'Brief only — do not storyboard or render' })
  assert.match(result, /stop at the explicitly selected planning stage and do not render/)
  assert.doesNotMatch(result, /continue automatically through deterministic Remotion production/)
})
