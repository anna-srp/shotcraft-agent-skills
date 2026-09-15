---
name: remotion-video-production
description: Build and render an approved product-video storyboard as a deterministic Remotion project using authorized screenshots, recordings, graphics, captions, music, and sound effects. Use when the user wants the actual MP4 or a production revision. Do not use before the brief and storyboard are sufficiently resolved.
---

# Remotion Video Production

Produce the real video, not a plan for one.

Keep all visible text, captions, voiceover, file-facing labels, and final user communication in English. Optimize the story for the approved United States audience.

## Prepare the project and assets

Use an existing Remotion project when supplied; otherwise create the smallest project required by the approved storyboard. Check the installed Remotion version and its current APIs before coding. Verify the applicable Remotion license for the intended use.

Capture real authorized product states at a consistent viewport and pixel density. Use fictional or redacted data when a screen might expose customer, employee, account, financial, health, credential, or internal information. Do not recreate an interface by hand when the shot claims to show the real product.

Store approved assets locally in the production project. Preserve original aspect ratios, use lossless stills where text clarity matters, and document the source of licensed media. Never fetch or embed a secret at render time.

## Implement deterministically

- Drive motion from Remotion's frame and timing primitives rather than CSS wall-clock animation.
- Organize the timeline into explicit sequences with stable durations and named shot boundaries.
- Use interpolation and spring motion deliberately; clamp ranges when overshoot would reveal empty canvas or invalid values.
- Seed every pseudo-random choice. Do not use `Date.now()`, unseeded `Math.random()`, or network-dependent visual state.
- Keep composition dimensions, frame rate, duration, and input properties explicit and validated.
- Preserve readable holds after important transitions and product states.
- Use camera moves, depth, light, transitions, and effects sparingly enough that the interface remains understandable.
- Pin sound effects to named shot-relative events rather than fragile global frame numbers.

When rhythmic music is used, derive timing from the approved beat analysis. Keep source timing truth separate from any measured render-pipeline audio offset.

## Render and publish

Render representative stills during implementation, then render the complete MP4. Inspect the actual frames instead of trusting a successful command. If music is included, provide a music version and a no-music version when the user requests editing flexibility or licensing uncertainty makes that useful.

Send the completed render to `product-video-review`. After it passes or completes one bounded corrective cycle, publish the actual MP4 artifact and deliver it directly. Never claim completion when only source code, a preview server, render progress, or a plan exists.
