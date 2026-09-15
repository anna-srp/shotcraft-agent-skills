---
name: product-video-review
description: Review an actual rendered product video for narrative accuracy, feature truth, visual quality, timing, audio, data safety, and delivery readiness, then request at most one bounded corrective render. Use before final MP4 publication or when the user asks for a critique. Do not approve from source code alone.
---

# Product Video Review

Inspect the final output independently from the production intent.

Keep all findings and user-facing text in English. Review against the approved United States audience, brief, storyboard, and product evidence.

## Review the actual render

Open the MP4 and inspect representative frames from every shot, all transitions, the opening, and the final call to action. Listen to the rendered audio track when one exists. Check:

- the video communicates the approved promise and feature hierarchy;
- every depicted screen, feature, metric, quote, and result is supported by product evidence;
- every AI-generated clip is limited to the approved atmospheric or B-roll role, is not presented as real product evidence, and has no visible generation defect that weakens the cut;
- captions and calls to action are accurate, readable, and inside safe areas;
- screenshots remain sharp, correctly framed, and free of sensitive data;
- motion is smooth, deterministic, and subordinate to comprehension;
- important states have enough hold time;
- transitions do not flash, clip, expose empty canvas, or repeat without purpose;
- music, voiceover, and effects are balanced and synchronized;
- the render has the expected aspect ratio, frame rate, duration, codec, and audible track;
- all assets are authorized for the intended use.

Confirm that Remotion remained the final composition and rendering engine. When AI footage was used, verify that the recorded model was the lowest-priced eligible Seedance Fast variant available at generation time, or that the user explicitly approved a different model.

Do not infer a pass from successful rendering. Name concrete evidence and exact timestamps for material defects.

## Correct and deliver

When a defect blocks delivery, send a focused correction to `remotion-video-production` and render once more. Do not redesign the entire approved concept during QA. If the bounded correction still fails, deliver the best valid artifact only when the limitation is clear and does not misrepresent the product; otherwise report the terminal blocker.

Publish and deliver the final MP4 directly with a one-paragraph summary of what was verified and any remaining external limitation. Do not substitute a Markdown review file for the video. Further creative revisions occur only when the user asks.
