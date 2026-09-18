# Build, Verify, and Publicly Deploy Shotcraft

Copy everything below this line into a new Codex or Claude Code conversation.

---

Build and publicly deploy Shotcraft, an English-language product-video Agent for the United States market, using this repository:

<https://github.com/anna-srp/shotcraft-agent-skills>

The required outcome is:

1. one persistent ZooWork Runtime Agent with all four repository Skills attached;
2. one lightweight no-render Runtime verification;
3. an original Shotcraft web UI connected through a secure backend; and
4. a working publicly accessible URL.

Do not stop after Runtime setup and do not ask whether I want a UI. Build and deploy the UI immediately after the quick verification passes. Do not generate sample media during installation.

## Fixed product scope

- Product: Shotcraft
- Language: English only
- Market: United States only
- Workflow: product evidence → brief → storyboard → deterministic Remotion production → actual-render review → MP4 delivery
- Default renderer: Remotion
- Optional AI footage: use only when an approved shot cannot reasonably use real product capture, licensed media, or Remotion graphics; choose the lowest-priced eligible Seedance Fast variant in the current ZooWork catalog
- Product truth: never invent product behavior, interfaces, metrics, testimonials, or customer data
- UI: required, original, and product-specific; do not copy the reference console's protected design
- Additional requirements I provide after this prompt take precedence

## 1. Open the repository

Use the existing local repository when present. Otherwise clone it once and work from its root. Read `README.md`, `agent/AGENTS.md`, and all four `skills/*/SKILL.md` entrypoints.

## 2. Load the official ZooWork development guidance

Before making ZooWork calls, use the official `zoowork-managed-agents` Skill from:

<https://github.com/SerendipityOneInc/zoowork-sdk-skills>

If it is already installed, read that copy. Do not reinstall it only to check for updates. Also read the current `app-kit/README.md` in:

<https://github.com/SerendipityOneInc/zoowork-quickstarts>

The development Skill teaches the coding assistant how to use ZooWork. The four product-video Skills in this repository are what run on the deployed Agent.

## 3. Ask me for only the ZooWork API key

Check whether `ZOOWORK_API_KEY` exists in the process environment or this repository's ignored `.env` file. Never print its value.

If it is missing, ask me to sign in at <https://zoowork.ai/claw-settings?tab=account-api-keys>, create a `zct_...` API key, save it myself as `ZOOWORK_API_KEY` in `.env`, and tell you when it is ready without pasting it into chat.

The API key is the only ZooWork value I enter manually. Never ask me for an Agent ID or Skill ID. The checked-in automation creates or discovers the setup Agent and stores identifiers in ignored `.zoowork/` state. Keep the key out of prompts, source files, logs, artifacts, browser bundles, and Git history.

## 4. Run the fast incremental setup

Run:

```bash
npm ci
npm run setup
```

Use the checked-in automation. Do not browse package registries, inspect the entire SDK declaration file, or replace the provisioning scripts unless this command fails with a concrete compatibility error.

The setup must validate the key, create or reuse one persistent Agent, upload only changed Skill versions, attach only missing Skills, verify that all four Skills are enabled and eligible, start the Agent when needed, wait for `desired_state === 'running'`, and run one English brief-only turn that proves `product-video-brief` was consulted.

The Runtime verification has a two-minute budget. It must not create a storyboard, install render dependencies, render media, inspect artifacts, or use Seedance. If it fails, diagnose that failure only; do not escalate into repeated sessions or a full render.

## 5. Build the public UI immediately

After the quick Runtime verification passes, continue without asking for another approval.

Use ZooWork App Kit as the backend and streaming foundation unless this repository already contains a stronger compatible frontend. Preserve its authentication, D1 ownership records, Durable Object turn execution, refresh-safe streaming, and server-only ZooWork credential boundary. Replace the generic presentation with an original Shotcraft experience.

Build at least:

- a product evidence and authorized-facts form;
- video goal, audience, aspect ratio, duration, tone, and call-to-action controls;
- a conversation and production-progress view that survives refresh;
- brief and storyboard review states;
- clear Remotion-default and optional Seedance Fast labeling;
- final artifact status and direct MP4 download when a real render is requested; and
- explicit empty, loading, error, reconnect, and quota states.

For the public deployment:

- set `AGENT_PICKER=off`;
- keep `ZOOWORK_API_KEY` only in the Worker or hosting provider's server-side secret store;
- do not put `ZOOWORK_AGENT_ID`, Agent IDs, or Skill IDs in browser code;
- default to App Kit's per-user Agent mode, store the user-to-Agent mapping in D1, and attach the four org Skill IDs from generated server-side deployment state to each user Agent;
- never share one agent-scope `/workspace` across unrelated public users;
- put Cloudflare Access or an equivalent real authentication layer in front of the app and never use `DEV_EMAIL` in production;
- enforce session ownership, rate limits, usage limits, and bounded retries; and
- treat input media as authorized, temporary task data. App Kit's native attachments are not production-wired, so do not claim private uploads work unless a signed, expiring object-storage bridge has passed an end-to-end test. A text-and-authorized-URL MVP is acceptable for the first public release.

Preview locally, run one text-only UI smoke test, then deploy. Use an already authenticated hosting provider when available; otherwise use App Kit's Cloudflare Workers path. This prompt already authorizes public deployment, so do not ask whether to deploy. If the provider requires interactive login, ask me only to complete that authorization, then continue automatically.

Verify that the public URL loads, authentication is active, a new conversation can stream a response, refresh restores it, and the ZooWork key is absent from client assets and network responses.

## 6. Keep full media testing opt-in

Do not run a Remotion acceptance render during installation or UI deployment. Run the complete brief → storyboard → render → review → MP4 flow only when I explicitly request a full acceptance test or provide a real authorized product-video task.

For an explicitly requested acceptance test, keep it Remotion-only, use one three-to-five-second low-resolution clip, use no network media or AI-video credits, make at most one corrective render, inspect the actual MP4, and publish the actual artifact. Explain beforehand that a first render can take 10–20 minutes because Runtime may need rendering dependencies and browser binaries.

## 7. Finish directly in chat

Return:

- the running setup Agent ID;
- all four attached Skill names and enabled/eligible status;
- the quick verification result and elapsed time;
- confirmation that setup spent no image or video generation credits;
- the deployed public URL and authentication mode;
- the UI smoke-test result; and
- any verified first-release limitation, especially media upload status.

Do not create an acceptance report, retry assessment, evidence bundle, or Markdown deliverable instead of the product. The running Agent and public URL are the deliverables.

The intended flow is: API key → fast incremental setup → one no-render verification → secure product UI → public URL.
