# Repo rules

Everything in this repo is in English.

## Layout

Skills live in bucket folders under `skills/`:

- `engineering/`: daily code work
- `productivity/`: daily workflow that is not tied to code
- `in-progress/`: beta, public on purpose, not shipped in the plugin
- `deprecated/`: no longer used, not shipped

`engineering/` and `productivity/` are the **promoted** buckets. Every promoted skill has an entry in `.claude-plugin/plugin.json`'s `skills` array and a link to its `SKILL.md` in the top-level `README.md`; skills in the other buckets appear in neither. Each bucket's `README.md` links every skill in it with a one-line description. Promoted bucket READMEs and the top-level README group entries into **User-invoked** and **Model-invoked**.

`npm run check` enforces these rules in CI. Run it, and `claude plugin validate . --strict` after touching either manifest, before you push.

## Invocation

Every skill folder holds `SKILL.md` and `agents/openai.yaml`. The yaml carries the Codex picker metadata: `interface.display_name` and `interface.short_description`.

- **User-invoked**: only the human typing its name reaches it. `disable-model-invocation: true` in `SKILL.md` and `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, always both. The `description` is a one-line summary for a person browsing commands, without trigger lists.
- **Model-invoked**: the default. Neither field is set. The `description` is model-facing and keeps the trigger phrasing ("Use when the user ...") that makes auto-invocation fire.

A skill that needs another model-invoked skill says so as an instruction: `Call the Skill tool with "<name>"`, one call per skill. A user-invoked skill cannot be reached that way: tell the user to run it.

## Agnostic

Every skill works for any user, in any project, on any OS and in any harness that reads Agent Skills:

- No machine paths, usernames, private repos or tools only the author has.
- No harness-specific tool names in steps beyond the Skill tool; no `/name` trigger syntax in operative instructions.
- No shell scripts that assume one OS; when a skill must run code, prefer Node.
- A subagent is started with a fresh context window, since some harnesses fork the parent conversation by default.

## Prose

No em-dashes anywhere. Where a sentence reaches for one, rewrite it with a comma, colon, period, parentheses or a conjunction, whichever it wants.

## Releases

Every change to a skill's behavior ships with a changeset: `npx changeset`, bump `minor` for a new skill or a behavior change, `patch` for a fix or wording. The Release workflow keeps a "chore: version skills" pull request open; merging it bumps `package.json`, syncs `plugin.json` through `scripts/sync-plugin-version.mjs`, writes `CHANGELOG.md`, tags and publishes a GitHub release. The weekly workflow merges that pull request every Monday when CI on main is green. Plugin installs update only when the `plugin.json` version changes.
