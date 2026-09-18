---
name: product-video-brief
description: Turn a website, app, repository, screenshots, recording, or written product description into a concise production-ready video brief. Use before storyboarding when the audience, message, product truth, format, brand system, or collaboration mode is unresolved. Do not write video code or invent unsupported product claims.
---

# Product Video Brief

Establish what the video must communicate before deciding how it moves.

Keep all user-facing text in English and define the audience within the United States market.

## Inspect product evidence

Use only authorized, read-only product sources supplied by the user or clearly public pages. Identify:

- the product's one-sentence value proposition;
- the primary United States audience and their problem;
- the one action the video should drive;
- the three to five most important demonstrable features;
- available pages, states, screenshots, recordings, logos, fonts, colors, and design tokens;
- unsupported claims, unavailable states, capture blockers, sensitive data, and asset-rights risks.

Do not log in, enter credentials, access private data, or change the product unless the user separately authorizes that action. Never treat a marketing claim as verified product behavior without observable support.

## Resolve production choices

Capture explicit user requirements for duration, aspect ratio, channel, deadline, voiceover, captions, music, must-show features, prohibited content, and supplied assets. Do not reopen choices the user already made.

Treat Remotion as the default production engine. Identify any shot that truly requires generated footage rather than real product capture, supplied licensed media, or Remotion graphics. Do not add AI video merely for spectacle. When generated footage is necessary, record that requirement explicitly so production can use the lowest-priced available Seedance Fast variant.

When collaboration mode is unspecified, recommend one of these:

- `template-led`: adapt a known structure when speed and predictability matter;
- `autonomous`: proceed from brief through final render when the user delegates creative decisions;
- `guided`: pause for approval of the brief and storyboard when the user wants creative control.

When the user asks to make, create, produce, render, or deliver the actual video and does not request an approval pause, use `autonomous`. The request to make the video is already authorization to proceed through production; do not turn it into a brief-only consultation.

Explain the mode in one sentence. Ask at most one blocking question for an actual production request, and only when the answer materially changes product truth, asset rights, or an essential delivery format. Use conservative defaults for non-blocking omissions and continue.

## Output

Return a concise brief directly in the conversation with:

- audience and problem;
- core promise and proof;
- feature priority;
- call to action;
- duration, aspect ratio, and destination;
- voice, tone, and visual system;
- collaboration mode;
- production engine, with Remotion as the default and any justified AI-video shots called out separately;
- approved evidence and blocked or sensitive assets;
- success criteria.

For a brief-only request, return the brief and stop. For guided production, pause only at the approval point the user requested. For autonomous or complete-video production, hand the brief to `cinematic-shot-planning` and continue in the same run; do not finish the turn with the brief or ask whether the user wants to proceed. Do not create a separate report file unless requested.
