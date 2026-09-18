export function buildProductionRequest(values) {
  const hasInput = [values.evidence, values.urls, values.goal, values.audience, values.tone, values.cta, values.request].some(Boolean)
  if (!hasInput) return ''

  const completeVideo = values.mode.startsWith('Autonomous') || values.mode.startsWith('Template-led')
  const guidedVideo = values.mode.startsWith('Guided')

  return [
    'Shotcraft product-video request for the United States market.',
    values.evidence ? `Authorized product evidence and facts:\n${values.evidence}` : 'Authorized product evidence: Not yet supplied. Ask for it before making any product claim.',
    values.urls && `Authorized public asset URLs:\n${values.urls}`,
    values.goal && `Video goal: ${values.goal}`,
    values.audience && `Audience: ${values.audience}`,
    `Duration: ${values.duration}`,
    `Aspect ratio: ${values.aspect}`,
    values.tone && `Tone: ${values.tone}`,
    values.cta && `Call to action: ${values.cta}`,
    `Collaboration mode: ${values.mode}`,
    `Production engine preference: ${values.engine}`,
    values.request ? `Request:\n${values.request}` : completeVideo
      ? 'Request: Produce the complete product video and deliver the reviewed MP4.'
      : guidedVideo
        ? 'Request: Prepare the brief and storyboard, then pause once for storyboard approval before rendering.'
        : 'Request: Return only the explicitly selected planning deliverable.',
    'Never invent product behavior, interfaces, metrics, testimonials, or outcomes. Use only authorized evidence.',
    completeVideo
      ? 'Completion contract: this is an explicit complete-video request. Resolve the brief and storyboard as internal milestones, then continue automatically through deterministic Remotion production, actual-render review, artifact publication, and direct MP4 delivery. Do not stop at the brief or storyboard and do not ask whether to continue. Ask at most one question only for a concrete product-truth, rights, essential-format, or terminal technical blocker.'
      : guidedVideo
        ? 'Completion contract: continue from the brief through a complete storyboard, then pause once for the requested storyboard approval. After approval, render, review, publish, and deliver the MP4 without another ceremonial checkpoint.'
        : 'Completion contract: stop at the explicitly selected planning stage and do not render.',
  ].filter(Boolean).join('\n\n')
}
