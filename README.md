# Shotcraft Agent Skills

A portable, English-language skill pack distilled from the core Shotcraft product-video workflow for products serving the United States market. It does not reproduce the protected console UI. It provides the capability layer that Codex, Claude Code, or another coding agent can install on ZooWork Runtime and later connect to any interface.

## Quick start

1. Clone this repository and open it in Codex or Claude Code.
2. Copy the complete contents of [PROMPT.md](PROMPT.md) into a new conversation.
3. Sign in to ZooWork, create an API key under `Settings → API Keys`, and save it yourself in a local `.env` file. The API key is the only value you enter manually; never paste it into the chat.
4. Let the coding agent create the Agent, automatically save its returned `agent_id`, upload and attach the four skills, start it on ZooWork Runtime, and run a bounded smoke test.
5. Receive the running Agent status directly in the chat. The coding agent will then ask whether you want a UI.

## Expected outcome

The default deliverable is a persistent Shotcraft Agent running on ZooWork Runtime with all four skills attached. The setup assistant reports the Agent ID, skill status, and smoke-test result directly in the conversation. It must not replace the Agent with an acceptance-report Markdown file.

ZooWork Runtime hosts the Agent and its skills; it does not automatically create a public video-production website. A render console or customer-facing UI is optional and should be built only after the Runtime Agent is ready and the user approves that next step.

## Included skills

| User intent | Runtime skill | Purpose |
|---|---|---|
| Turn a product into a production-ready video brief | `product-video-brief` | Identifies the audience, message, real product evidence, brand system, format, and collaboration mode |
| Design a cinematic storyboard | `cinematic-shot-planning` | Maps one product idea to each shot, controls pacing and energy, and plans real UI capture, motion, transitions, and sound |
| Build and render the video | `remotion-video-production` | Uses Remotion by default, optionally generates a required shot with the cheapest available Seedance Fast model, and publishes the actual MP4 |
| Review and correct the finished cut | `product-video-review` | Checks narrative, product truth, visual quality, timing, audio, and sensitive-data safety before delivery |

These four skills cover the complete product-video path without bundling a console, gallery, template library, or large media collection.

## Repository structure

```text
.
├── PROMPT.md
├── agent/
│   └── AGENTS.md
└── skills/
    ├── product-video-brief/
    ├── cinematic-shot-planning/
    ├── remotion-video-production/
    └── product-video-review/
```

Every skill directory name matches the `name` in its `SKILL.md` frontmatter so it can be packaged, uploaded, and attached using ZooWork's skill zip rules.

## Two different kinds of skill

- `zoowork-managed-agents` is installed into a development assistant such as Codex or Claude Code. It teaches the assistant how to use the ZooWork SDK correctly.
- The video skills under this repository's `skills/` directory are uploaded and attached to the Shotcraft Agent running on ZooWork Runtime.

Install the official development skill first:

```bash
npx skills add SerendipityOneInc/zoowork-sdk-skills
```

Then load `zoowork-managed-agents` before working with ZooWork. Do not guess SDK calls from another Agent platform.

## Important boundaries

- Keep `ZOOWORK_API_KEY` only in a server-side environment variable or ignored local `.env` file. It must never enter a prompt, log, frontend bundle, or Git history.
- Users enter only `ZOOWORK_API_KEY`. They must never be asked to find, copy, or configure an Agent ID.
- All user-facing conversation, captions, voiceover, and UI copy must be in English.
- The default audience and market context is the United States.
- Remotion is the default production engine. Do not use an AI video model for ordinary UI animation, typography, transitions, or shots that can be made from real authorized product assets.
- When a storyboard genuinely requires generated footage, select the lowest-priced eligible Seedance Fast variant from the current ZooWork model catalog. Do not hard-code a stale model ID or silently switch to a more expensive model.
- Show real product behavior with real authorized screenshots or recordings. Never invent a feature or recreate a misleading fake interface.
- Remove or replace customer, employee, account, financial, health, credential, and other sensitive data before capture.
- Use only assets the user owns, licenses, or is authorized to use. Do not silently scrape protected media or bypass authentication.
- A render is complete only when the final MP4 exists, has been reviewed, and is delivered as an accessible artifact. A progress message is not a video.
- Verify the applicable Remotion license for the intended commercial or organizational use.

## References

- [Reference console](https://shotcraft-console.vercel.app/)
- [Video Shotcraft, Apache-2.0](https://github.com/Vincentwei1021/video-shotcraft)
- [ZooWork Agent creation and public-release guide](https://starquest.feishu.cn/docx/AxJAd0dPDoWYIVxWQ9Xc2AjFndh)
- [ZooWork SDK skills](https://github.com/SerendipityOneInc/zoowork-sdk-skills)

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution.
