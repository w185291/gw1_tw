# Project Rules

- Latest user override (2026-10-10): do not display verification/incomplete markers in the public UI. Keep provenance and audits internally. Guide/skill completeness audits are opt-in commands and must not block production or static builds; structural validation still applies. Do not turn incomplete records into complete merely to hide badges.

- `docs/REQUIREMENTS.md` is authoritative; conversation-reference.md is background only.
- Use Node.js, real Next.js App Router, React, TypeScript strict mode and CSS Modules.
- Do not author standalone HTML pages or duplicate layouts per mission.
- Mission content belongs in structured data, validated by the shared schema.
- Every mission uses MissionDetailTemplate; routes derive from data ids.
- Traditional Chinese is primary. Preserve English names for search and reference.
- Never invent GW1 facts or translate proper names without Traditional Chinese evidence. Follow docs/REQUIREMENTS_COMPLETENESS.md and docs/REQUIREMENTS_SKILLS.md above older phase rules. Missing verification means contentStatus=incomplete, never complete.
- Campaigns support branched primary quests, dungeons and story entries, not only mission lists.
- Run lint, content validation, typecheck and build before delivery.
- Preserve source attribution, image provenance and licenses.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
