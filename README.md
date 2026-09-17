# Shotcraft Agent Skills

A portable, English-language Skill pack for building product videos for the United States market. It preserves Shotcraft's core capability layer without copying the reference console UI.

## Fast start

1. Clone this repository and open it in Codex or Claude Code.
2. Copy the complete contents of [PROMPT.md](PROMPT.md) into a new conversation.
3. Create a ZooWork API key under `Settings → API Keys`, save it in a local ignored `.env` file, and tell the assistant when it is ready. Never paste the key into chat.
4. The assistant runs the repository's checked-in setup and returns the running Agent status directly in chat.
5. Choose whether to make a real video, customize the workflow, or build a UI.

The API key is the only value entered manually. The Agent ID is created, stored, and reused automatically.

## Why setup does not render a video

Fast setup proves the parts required for immediate use: authentication, one persistent Agent, all four attached Skills, Runtime readiness, and one real no-render Skill-routing turn. It intentionally does not install rendering dependencies or create a sample MP4.

| Mode | What it does | Expected use |
|---|---|---|
| Fast setup | Incremental deployment plus one brief-only Runtime verification | Default installation path |
| Real product task | Brief, storyboard, Remotion production, review, and MP4 delivery | First actual use |
| Full acceptance test | One short synthetic Remotion render and artifact verification | Only when explicitly requested |

The quick Runtime verification has a two-minute hard budget. A first full Remotion render can take 10–20 minutes because the Runtime may need browser and rendering dependencies. That work is deferred until it produces something the user actually wants.

## Included automation

After saving `ZOOWORK_API_KEY` in `.env`, the complete fast path is:

```bash
npm ci
npm run setup
```

The commands are also available separately:

```bash
npm run deploy  # create/reuse the Agent and reconcile only changed Skills
npm run verify  # one brief-only Runtime turn; never renders media
```

Ignored `.zoowork/` state stores the generated Agent ID, Skill IDs, content hashes, versions, and last verification result. It stores no API key. Repeated deployment reuses the same Agent and skips unchanged Skill uploads.

## Expected outcome

The default deliverable is a persistent Shotcraft Agent running on ZooWork Runtime with all four Skills attached and eligible. Setup reports its status directly in the conversation; it does not replace the Agent with a Markdown test report.

ZooWork Runtime hosts the Agent and Skills. It does not automatically create a public video-production website. A render console or customer-facing UI is a separate, optional step.

## Included Skills

| User intent | Runtime Skill | Purpose |
|---|---|---|
| Turn product evidence into a production-ready brief | `product-video-brief` | Defines audience, message, evidence, brand, format, and collaboration mode |
| Design a cinematic storyboard | `cinematic-shot-planning` | Plans shot timing, real product states, motion, transitions, captions, and sound |
| Build and render the video | `remotion-video-production` | Uses Remotion by default and optional Seedance Fast only for justified generated footage |
| Review and deliver the finished cut | `product-video-review` | Checks truth, narrative, visuals, timing, audio, privacy, and the actual MP4 |

## Two different kinds of Skill

- `zoowork-managed-agents` is installed into the development assistant. It teaches Codex or Claude how to use ZooWork correctly.
- The four Skills in this repository's `skills/` directory are uploaded and attached to the Shotcraft Agent on ZooWork Runtime.

Do not upload the development Skill to the Runtime Agent or install the four product Skills into Codex as a substitute for Runtime deployment.

## Product boundaries

- All user-facing conversation, captions, voiceover, and UI copy are English only.
- The market and audience context is the United States only.
- Remotion is the default production engine.
- AI video is optional per shot. When justified, use the lowest-priced eligible Seedance Fast variant from the current ZooWork catalog; never hard-code a stale model ID or silently choose a more expensive family.
- Use real authorized product evidence. Never invent product behavior, interfaces, metrics, testimonials, or customer data.
- Remove sensitive data before capture and use only owned, licensed, or authorized assets.
- A video is complete only when the actual MP4 has been reviewed and delivered as an accessible artifact.
- Verify the applicable Remotion license before commercial publication.

## Repository structure

```text
.
├── PROMPT.md
├── package.json
├── scripts/
│   ├── provision.mjs
│   └── verify.mjs
├── agent/
│   └── AGENTS.md
└── skills/
    ├── product-video-brief/
    ├── cinematic-shot-planning/
    ├── remotion-video-production/
    └── product-video-review/
```

## References

- [Reference console](https://shotcraft-console.vercel.app/)
- [Video Shotcraft, Apache-2.0](https://github.com/Vincentwei1021/video-shotcraft)
- [ZooWork Agent creation and public-release guide](https://starquest.feishu.cn/docx/AxJAd0dPDoWYIVxWQ9Xc2AjFndh)
- [ZooWork SDK Skills](https://github.com/SerendipityOneInc/zoowork-sdk-skills)

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution.
