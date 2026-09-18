---
name: remotion-video-production
description: Build and render an approved product-video storyboard as a deterministic Remotion project using authorized screenshots, recordings, graphics, captions, music, and sound effects, with optional Seedance Fast footage only when a shot genuinely requires AI video. Use when the user wants the actual MP4 or a production revision. Do not use before the brief and storyboard are sufficiently resolved.
---

# Remotion Video Production

Produce the real video, not a plan for one.

When the user asked to make, create, produce, render, or deliver a video or MP4, that request authorizes rendering. Do not ask again after the brief or storyboard. Stop before rendering only for a concrete product-truth, rights, missing-asset, or technical blocker that cannot be resolved with a conservative default.

Keep all visible text, captions, voiceover, file-facing labels, and final user communication in English. Optimize the story for the approved United States audience.

Remotion is the default production engine. AI video is an optional shot source, not the renderer for the complete product video.

## Prepare the project and assets

Use an existing Remotion project when supplied; otherwise create the smallest project required by the approved storyboard. Check the installed Remotion version and its current APIs before coding. Verify the applicable Remotion license for the intended use.

Capture real authorized product states at a consistent viewport and pixel density. Use fictional or redacted data when a screen might expose customer, employee, account, financial, health, credential, or internal information. Do not recreate an interface by hand when the shot claims to show the real product.

Store approved assets locally in the production project. Preserve original aspect ratios, use lossless stills where text clarity matters, and document the source of licensed media. Never fetch or embed a secret at render time.

## Optional AI-generated footage

Use real product capture, supplied licensed media, and Remotion graphics whenever they can satisfy the storyboard. Do not call an AI video model for interface demonstrations, typography, transitions, camera moves, or decorative motion that Remotion can produce deterministically.

When an approved shot genuinely requires generated cinematic footage or B-roll:

1. read the current ZooWork model or tool catalog instead of relying on a remembered model ID;
2. filter to eligible models whose canonical or display name clearly identifies the `Seedance Fast` family;
3. choose the variant with the lowest currently reported generation price for the required duration and resolution; if comparable price metadata is unavailable, use the catalog's default eligible Seedance Fast entry and state that price ordering could not be verified;
4. do not silently use Seedance Pro, another provider, or a more expensive model when Seedance Fast is unavailable; report the limitation and ask before changing model families;
5. generate only the specific approved shot, at the lowest duration and resolution that still meets the storyboard and final delivery format;
6. wait for the actual completion event when generation is asynchronous and never duplicate a pending request;
7. inspect the returned clip for prompt fidelity, artifacts, unsafe content, rights concerns, and product-truth risk before importing it into Remotion;
8. make at most one targeted generation retry for that shot unless the user explicitly requests more iterations.

Record the selected catalog model name and the reason it was the cheapest eligible Seedance Fast option. Do not expose internal model IDs in public-facing UI. Clearly distinguish generated atmospheric footage from real product evidence.

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

Keep Runtime work bounded:

- Do not enter production during a brief-only, routing-only, or no-render deployment check.
- Do enter production for an autonomous or complete-video request. The brief and storyboard are prerequisites to resolve, not reasons to end the turn.
- Reuse an existing project and installed dependencies when they are compatible. Do not repeat package installation, browser installation, or model discovery during the same production.
- After rendering, inspect the MP4 with `ffprobe` and extract representative frames with `ffmpeg`. Use binaries already on `PATH`; otherwise locate the executable bundled under the installed Remotion packages. Do not open a local `file://` video in a browser or install a second media stack merely for review.
- Inspect extracted PNG frames with the available image-viewing tool. Check the opening, each shot boundary, transitions, and final call to action, then publish promptly.
- If a bounded setup acceptance render is explicitly requested, use local abstract assets, the smallest compatible project, and one short low-resolution clip. Do not search the web or call an AI-video model for that test.

Send the completed render to `product-video-review`. After it passes or completes one bounded corrective cycle, publish the actual MP4 artifact and deliver it directly. Never claim completion when only source code, a preview server, render progress, or a plan exists.
