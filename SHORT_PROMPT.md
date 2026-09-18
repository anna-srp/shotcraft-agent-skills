Build, verify, and publicly deploy the English-language, United States Shotcraft Agent using <https://github.com/anna-srp/shotcraft-agent-skills>.

Open or clone the repository, read its `README.md`, `PROMPT.md`, Agent persona, and four Skills, then follow the official `zoowork-managed-agents` guidance. Ask me only to save `ZOOWORK_API_KEY` in the ignored `.env`; never ask for an Agent ID or Skill ID. Run `npm ci && npm run setup` and keep the verification no-render and under two minutes.

After setup passes, do not stop or ask whether I want a UI. Reuse the same Agent and build a lightweight, original Shotcraft web UI with product-video brief fields, example prompts, a streaming conversation/progress view, loading and error states, and New conversation. Keep the API key and Agent ID server-side, create a separate Session for each visitor or conversation, add a basic usage limit, accept only text or authorized public asset URLs in the MVP, and deploy it to Vercel. Do not add login, an admin panel, billing, or a dashboard unless required, and do not render a sample video unless I explicitly request it. If Vercel needs interactive login, ask only for that authorization and continue.

Finish in chat with the running Agent status, quick-test result, public Vercel URL, UI test result, and any verified upload limitation. Do not substitute a Markdown report for the Agent and deployed app.

My additional requirements: [add changes here, or leave as none].
