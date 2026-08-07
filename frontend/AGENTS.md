<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

Frontend stack:

- Next.js App Router
- TypeScript
- Material UI

Architecture:

- Prefer Server Components by default.
- Use Client Components only when interactivity is required.
- Keep pages thin; business logic belongs in services.
- Reusable UI belongs in components.
- Keep components small and focused on a single responsibility.
- Use Material UI components instead of custom HTML whenever appropriate.
- Use TypeScript strict typing. Avoid `any` unless absolutely necessary.
- Prefer composition over large components.
- Do not introduce Tailwind CSS.
- Do not duplicate logic across components.
- Follow clean architecture and maintainable code over quick solutions.

API communication:

- All backend communication must go through services.
- Components must never call fetch() directly.

Before making changes:

- Explain the implementation plan.
- Keep changes small and focused.
- Run ESLint before finishing.
- Summarize all modified files.
- Do not commit or push unless explicitly requested.

<!-- END:nextjs-agent-rules -->
