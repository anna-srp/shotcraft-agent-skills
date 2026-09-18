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

If it is already installed, read that copy. Do not reinstall it only to check for updates.

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

Build the smallest useful full-stack web experience for this Agent. Reuse the setup Agent ID; do not provision another Agent for the UI. Prefer a simple Vercel-compatible framework and deploy to Vercel when the account is already authenticated. Create an original Shotcraft experience.

Build at least:

- a product evidence and authorized-facts form;
- video goal, audience, aspect ratio, duration, tone, and call-to-action controls;
- a streaming conversation and production-progress view that survives refresh;
- brief and storyboard review states;
- clear Remotion-default and optional Seedance Fast labeling;
- final artifact status and direct MP4 download when a real render is requested; and
- explicit empty, loading, error, reconnect, and quota states.

For the lightweight public MVP:

- keep `ZOOWORK_API_KEY`, the Agent ID, and every ZooWork call on the server;
- let the browser call only the app's own server routes;
- create a separate ZooWork Session for each visitor or new conversation, keep its identifier in a signed, HTTP-only cookie or equivalent server-controlled state, and never let one visitor load another visitor's Session;
- stream events until `run.finished`, retain the latest cursor for reconnect, and handle loading, error, timeout, and New conversation states;
- add a basic server-side rate or usage limit so the public page cannot spend credits without bounds;
- do not add login, an admin panel, billing, a dashboard, D1, Durable Objects, or per-user Agent provisioning unless they are genuinely required; and
- accept text and authorized public asset URLs only. Do not enable private media uploads until a signed, expiring object-storage path is verified end to end.

Preview locally, run one text-only UI smoke test without rendering a sample video, then deploy to Vercel. This prompt already authorizes public deployment, so do not ask whether to deploy. If Vercel requires interactive login, ask me only to complete that authorization, then continue automatically.

Verify that the public URL loads, a new conversation streams correctly, refresh restores it, visitors are isolated, rate limiting works, and no ZooWork secret or Agent ID appears in client assets or browser network responses.

## 6. Keep full media testing opt-in

Do not run a Remotion acceptance render during installation or UI deployment. Run the complete brief → storyboard → render → review → MP4 flow only when I explicitly request a full acceptance test or provide a real authorized product-video task.

For an explicitly requested acceptance test, keep it Remotion-only, use one three-to-five-second low-resolution clip, use no network media or AI-video credits, make at most one corrective render, inspect the actual MP4, and publish the actual artifact. Explain beforehand that a first render can take 10–20 minutes because Runtime may need rendering dependencies and browser binaries.

## 7. Finish directly in chat

Return:

- the running setup Agent ID;
- all four attached Skill names and enabled/eligible status;
- the quick verification result and elapsed time;
- confirmation that setup spent no image or video generation credits;
- the deployed public Vercel URL;
- the UI smoke-test result; and
- any verified first-release limitation, especially media upload status.

Do not create an acceptance report, retry assessment, evidence bundle, or Markdown deliverable instead of the product. The running Agent and public URL are the deliverables.

The intended flow is: API key → fast incremental setup → one no-render verification → lightweight product-video UI → public Vercel URL.
