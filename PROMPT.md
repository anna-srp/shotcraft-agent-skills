# Complete Prompt for Codex / Claude Code

Copy everything below this line into a new conversation.

---

Build an English-language cinematic product-video Agent for products serving the United States market on ZooWork in the current project. Reproduce the core capabilities of Shotcraft, not its protected console UI.

The required default outcome is:

1. install and read the official ZooWork development skill;
2. ask me to configure only my ZooWork API key;
3. create or reuse one ZooWork Agent;
4. upload and attach the four product-video skills in this repository;
5. start the Agent and confirm that it is running on ZooWork Runtime;
6. run a small bounded smoke test;
7. report the usable Agent directly in the chat and ask whether I want a UI.

Do not turn this task into a documentation or QA project. Do not create an acceptance report, retry assessment, evidence bundle, Markdown deliverable, or other report file unless I explicitly request one. The Agent running successfully on ZooWork Runtime is the primary deliverable. A UI is an optional next step.

Default product definition:

- Agent name: Shotcraft
- Language: English only
- Market and audience context: United States only
- Core flow: product evidence → concise brief → complete storyboard → deterministic Remotion production → final video review → direct MP4 delivery
- Product-truth boundary: use real authorized product states and never invent features, claims, metrics, or customer data
- Delivery boundary: a progress message, source project, or review document is not the final video
- UI preference: do not copy the reference console; offer ZooWork App Kit or a custom UI only after the Runtime Agent is ready
- My additional requirements: none; requirements I add after this prompt take precedence

Treat English and the United States market as fixed product scope, not onboarding questions. Keep all user-facing Agent and UI copy, captions, voiceover, and calls to action in English.

Treat these files as the source of truth:

- `agent/AGENTS.md`
- `skills/product-video-brief/SKILL.md`
- `skills/cinematic-shot-planning/SKILL.md`
- `skills/remotion-video-production/SKILL.md`
- `skills/product-video-review/SKILL.md`

Follow this workflow in order.

## 0. Install and read the official ZooWork development skill

Before writing any ZooWork SDK call, run:

```bash
npx skills add SerendipityOneInc/zoowork-sdk-skills
```

Then read the complete `SKILL.md` for `zoowork-managed-agents`, its deployment reference, and any SDK, artifact, sandbox, or event-streaming reference needed for this implementation. If the official repository already exists locally, read it instead of installing again.

The official skill is for the development assistant. The four skills in this repository are uploaded and attached to the Agent running on ZooWork Runtime. Do not confuse these layers.

## 1. Ask for only the ZooWork API key

Check only whether `ZOOWORK_API_KEY` is configured. Do not print its value.

The API key is the only value I enter manually. Never ask me to find, copy, paste, or configure an Agent ID. ZooWork returns the Agent ID after creation; save and reuse it automatically.

If the key is missing, pause and ask me to:

1. sign in at <https://zoowork.ai/claw-settings?tab=account-api-keys>;
2. open `Settings → API Keys → Create API Key`;
3. create and immediately copy the one-time `zct_...` secret;
4. save it myself as `ZOOWORK_API_KEY` in a local `.env` file;
5. tell you when it is saved without pasting the key into the chat.

Ensure `.env` is ignored by Git. The key must never enter a prompt, source file, frontend bundle, log, artifact, or Git history. Do not create, rotate, or delete the key on my behalf.

After I confirm it is saved, call `listModels()` as the smallest read-only validation. Report only whether validation succeeded and how many models are available.

## 2. Read the product definition and proceed

Read `agent/AGENTS.md` and all four skill entrypoints. Do not require a separate design-approval document when the repository already answers the implementation questions. Briefly state what you will provision, then proceed.

## 3. Create or reuse one Agent

Follow `zoowork-managed-agents` exactly:

- Use `@zoowork-ai/sdk`; do not guess package names or API shapes.
- Select a model from the actual `listModels()` response.
- Use `agent/AGENTS.md` as the Persona document.
- Check ignored local state and stable labels for an existing Agent. Never ask me for its ID.
- Call `createAgent()` only when the Agent genuinely does not exist, using a stable idempotency key.
- Save the returned `agent_id` in ignored server-side state such as `.zoowork/shotcraft-agent.json`.
- If a backend later expects `ZOOWORK_AGENT_ID`, populate it automatically from saved state.
- Never create an Agent inside a per-message request path.

## 4. Package, upload, and attach the four skills

Process:

- `product-video-brief`
- `cinematic-shot-planning`
- `remotion-video-production`
- `product-video-review`

For each skill:

1. verify that the directory name matches the `name` in `SKILL.md` frontmatter;
2. preserve that directory as the zip's top-level directory;
3. upload a new owned skill or add a version when the same owned skill already exists and changed;
4. attach it with the documented SDK method;
5. verify that it is attached, enabled, and eligible;
6. persist skill IDs and versions without storing secrets.

Do not re-upload global ZooWork catalog skills that a new Agent already receives automatically.

## 5. Publish the Agent to ZooWork Runtime

After the Persona and skills are attached, call the documented start method and `waitUntilRunning(agentId)`. Do not use `actual_state` as the API-readiness signal.

For this task, “published to ZooWork Runtime” means the persistent Agent exists, all four skills are attached, and `waitUntilRunning()` confirms `desired_state === 'running'`. This does not automatically create a public website or render console.

## 6. Run a bounded smoke test

Run the smoke test in English with a fictional United States software product. Do not access a private product or real customer data.

1. Verify that a short product description triggers `product-video-brief`.
2. Verify that an approved brief routes to `cinematic-shot-planning` and returns a complete short storyboard.
3. Verify that an approved storyboard routes to `remotion-video-production` and a render routes to `product-video-review`.
4. When the Runtime has the necessary rendering dependencies, render at most one three-to-five-second low-resolution test clip and confirm the actual MP4 artifact is delivered.

Make at most one corrective retry for a trigger or implementation defect. Do not repeatedly render a full production during setup. Treat a missing optional renderer, insufficient credits, or temporary provider failure as a clearly labeled external limitation unless it prevents all meaningful Agent use. Keep results in the final chat response and do not generate report files.

A fatal Runtime blocker is an invalid key, an Agent that cannot reach `running`, a skill that cannot be attached or is ineligible, or a broken session path that prevents any conversation.

## 7. Finish with the Agent, not a Markdown file

When the Agent is running, respond directly with:

- a clear statement that Shotcraft is running on ZooWork Runtime;
- the automatically generated `agent_id`;
- the four attached skill names and status;
- a short smoke-test summary;
- any external limitation, without presenting it as the main deliverable;
- the exact next-step question: “Would you like me to build a UI for this Agent now? I can use ZooWork App Kit or adapt your existing frontend.”

Do not create or return an acceptance report unless I explicitly ask for one. If I do not want a UI, stop after delivering the running Agent status.

## 8. Build and deploy a UI only if I want one

If I ask for a UI:

- recommend ZooWork App Kit when I have no existing frontend or stack preference;
- otherwise adapt my existing frontend and keep ZooWork sessions and event handling on the backend;
- pin the UI to the automatically saved Agent ID and set `AGENT_PICKER=off`;
- keep `ZOOWORK_API_KEY` server-side only;
- keep every label, message, error, and empty state in English;
- support project intake, storyboard approval, long-running background renders, progress recovery, and direct MP4 delivery;
- never expose private product assets or render paths to another user;
- add authentication, user isolation, usage limits, rate limiting, and abuse controls before public release because rendering consumes compute;
- use an appropriate persistent job and rendering backend instead of assuming a single long serverless request will finish;
- let the layout and brand be customized instead of copying the protected console.

Preview and verify the UI locally. Before making it public or changing production access, ask for my explicit approval. After approval, deploy it and return the actual URL rather than a report file.

The final product flow is: skills attached → Agent running on ZooWork Runtime → direct usable-status response → optional UI choice → optional UI deployment.

---
