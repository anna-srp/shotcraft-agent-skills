# Fast Setup Prompt for Codex / Claude Code

Copy everything below this line into a new conversation.

---

Build and deploy Shotcraft, an English-language product-video Agent for the United States market, on ZooWork Runtime using this repository:

<https://github.com/anna-srp/shotcraft-agent-skills>

The default mode is **fast setup**, not full media acceptance testing. The required outcome is one persistent ZooWork Agent with the repository's four Skills attached, running, and verified by one lightweight no-render Runtime turn. Do not generate a sample image or video during setup. Do not build a UI unless I ask after the Runtime Agent is ready.

## Fixed product scope

- Agent name: Shotcraft
- Language: English only
- Market: United States only
- Workflow: product evidence → brief → storyboard → deterministic Remotion production → actual-render review → MP4 delivery
- Default renderer: Remotion
- Optional AI footage: only when an approved shot cannot reasonably use real product capture, licensed media, or Remotion graphics; automatically choose the lowest-priced eligible Seedance Fast variant in the current ZooWork catalog
- Product truth: never invent features, interfaces, metrics, testimonials, or customer data
- UI: optional and separate from Runtime deployment; never copy the reference console's protected design
- Additional requirements I give after this prompt take precedence

## 1. Open the repository

Use the existing local repository when present. Otherwise clone the repository once and work from its root. Read `README.md`, `agent/AGENTS.md`, and the four `skills/*/SKILL.md` entrypoints.

## 2. Load the official ZooWork development Skill

Before making ZooWork calls, use the official `zoowork-managed-agents` development Skill from:

<https://github.com/SerendipityOneInc/zoowork-sdk-skills>

If it is already installed, read and use the installed copy. Do not clone or reinstall it merely to check for updates. If it is missing, install it once, then follow its required deployment guidance. This development Skill teaches Codex or Claude how to deploy; the four product-video Skills in this repository are what run on the ZooWork Agent.

## 3. Ask me for only the ZooWork API key

Check whether `ZOOWORK_API_KEY` is available in the process environment or a local `.env` file. Never print its value.

If it is missing, ask me to:

1. sign in at <https://zoowork.ai/claw-settings?tab=account-api-keys>;
2. choose `Settings → API Keys → Create API Key`;
3. copy the one-time `zct_...` secret;
4. save it myself as `ZOOWORK_API_KEY` in this repository's ignored `.env` file;
5. tell you when it is saved without pasting it into chat.

The API key is the only value I enter manually. Never ask me for an Agent ID. The setup script creates or discovers one persistent Agent and stores its ID in the ignored `.zoowork/` directory. Keep the key out of prompts, source files, logs, artifacts, frontend bundles, and Git history.

## 4. Run the repository's fast setup

After the key is available, use the checked-in automation instead of writing a new deployment harness:

```bash
npm ci
npm run setup
```

Do not run `npm view`, browse package registries, inspect the entire SDK declaration file, or create replacement provisioning scripts unless the checked-in command fails with a concrete compatibility error.

`npm run setup` must:

1. validate the key with the read-only model catalog;
2. create or reuse one persistent Agent using stable state, labels, and an idempotency key;
3. package all four Skills with the correct top-level directory;
4. upload only new or changed Skill versions;
5. attach only missing Skills and verify that all four are enabled and eligible;
6. start the Agent only when needed and wait for `desired_state === 'running'` through the documented helper;
7. run one English, United States, brief-only Runtime turn that confirms `product-video-brief` triggers;
8. stop without storyboarding, installing render dependencies, rendering media, inspecting artifacts, or using Seedance.

The quick verification has a two-minute Runtime budget. If it fails, diagnose that one failure. Do not silently escalate into a full render or repeatedly create sessions.

## 5. Finish directly in chat

When fast setup succeeds, respond directly with:

- confirmation that Shotcraft is running on ZooWork Runtime;
- the automatically generated Agent ID;
- the four attached Skill names and their enabled/eligible status;
- the quick verification result and elapsed time;
- a clear statement that no media was rendered and no image/video generation credits were spent during setup;
- this exact question: “Would you like to make a real product video now, customize the workflow, or build a UI for this Agent?”

Do not create an acceptance report, retry assessment, evidence bundle, or Markdown deliverable. The running Agent is the deliverable.

## 6. Full video testing is opt-in

Do not run a Remotion acceptance render during installation. Run the complete brief → storyboard → render → review → MP4 publication flow only when I explicitly request a full acceptance test or provide a real authorized product-video task.

For an explicitly requested acceptance test, keep it Remotion-only, use one three-to-five-second low-resolution clip, use no network media or AI-video credits, make at most one corrective render, inspect the actual MP4 with existing media tools, and publish the actual artifact. Explain beforehand that a first render can take 10–20 minutes because Runtime may need rendering dependencies and browser binaries.

## 7. UI is opt-in

If I ask for a UI after the Runtime Agent is ready, recommend ZooWork App Kit when I have no existing frontend preference; otherwise adapt my frontend. Keep the API key server-side, pin the saved Agent ID automatically, set `AGENT_PICKER=off`, and keep all copy in English for the United States market. Support long-running renders, refresh recovery, authentication, user isolation, usage limits, and direct MP4 delivery. Preview locally first and ask for approval before public deployment.

The intended flow is: API key → fast incremental setup → running Runtime Agent → one no-render verification → optional real video, workflow customization, or UI.
