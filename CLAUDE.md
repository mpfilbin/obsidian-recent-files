# CLAUDE.md — Agent Instructions for Recent Files

This file defines mandatory development practices for AI agents working on this Obsidian plugin.
These rules are non-negotiable.

## Project Commands

Read the `justfile` for the full list. Key commands:

- `just setup` — Install dependencies
- `just dev` — Compile in watch mode
- `just build` — Production build
- `just test` — Run tests
- `just test-watch` — Run tests in watch mode
- `just lint` — Run ESLint
- `just check` — Full validation (lint + test + build)
- `just install` — Install plugin to vault (set OBSIDIAN_VAULT in .env)

## Test-Driven Development (mandatory)

Every code change must follow the red-green-refactor cycle:

1. **Red** — Write a minimal failing test that describes the next behavior
2. **Green** — Write only enough implementation code to make that test pass
3. **Refactor** — Clean up while keeping tests green

Never write implementation code without a failing test first. Never skip ahead and write
multiple features before testing them.

## Test Structure (mandatory)

Use vitest with `describe`, `it`, and `expect` exclusively. Never use `assert`.

### Rule: One assertion per test

Every `it` block makes exactly one `expect` call. If you need to verify multiple things,
write multiple `it` blocks.

### Rule: Describe blocks mirror code branches

Every conditional branch (`if`, `switch`, ternary) in the code under test gets its own
`describe` block. Nested conditions use nested `describe` blocks.

### Rule: Describe blocks use "when" language

Use `describe('when ...')` to express preconditions. Use `it('does something')` to express
the expected outcome.

## Code Organization

- `src/main.ts` — plugin lifecycle only (`onload`, `onunload`); delegates to modules below
- `src/settings.ts` — settings interface, defaults, and the `PluginSettingTab`
- `src/recent-files-tracker.ts` — pure recency-tracking logic (no Obsidian API dependency)
- `src/recent-files-modal.ts` — the `FuzzySuggestModal` UI for picking a recent file

## Obsidian Plugin Rules

- Register all events with `this.registerEvent()` — never bare `.on()`
- Register all intervals with `this.registerInterval()` — never bare `setInterval()`
- Use `Vault.process()` for background file modifications
- Use the `Editor` API for modifications to the active editor
- Use `normalizePath()` for user-provided file paths
- Use `requestUrl()` instead of `fetch()`
- No `console.log` in `onload()` or `onunload()`
- Never create `<link>` or `<style>` elements — use `styles.css`
- Scope all CSS to plugin-specific classes

## Version Management

Never edit `manifest.json` version directly. Use:

```bash
just version-bump         # patch bump (0.1.0 → 0.1.1)
just version-bump minor   # minor bump (0.1.0 → 0.2.0)
just version-bump major   # major bump (0.1.0 → 1.0.0)
```
