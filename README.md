# Skills

My agent skills, the ones that earned a place in my daily work. Each one is small, composable and harness-agnostic: plain prose that works with any model, on any OS, in Claude Code, Codex, Cursor and other Agent Skills harnesses. Adapt them freely.

## Install

The plugin is a managed bundle that updates with each release. skills.sh copies files you own and edit. Pick one per agent: installing both gives you every skill twice.

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add PetukhovArt/skills
claude plugin install petukhovart-skills@petukhovart-skills
```

To get releases automatically, turn on auto-update for the `petukhovart-skills` marketplace in `/plugin`, under Marketplaces. Otherwise run `claude plugin marketplace update petukhovart-skills`.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add PetukhovArt/skills
codex plugin add petukhovart-skills@petukhovart-skills
```

</details>

<details>
<summary><strong>Any other agent, or editable files</strong> (manual updates)</summary>

```bash
npx skills@latest add PetukhovArt/skills -a <agent>  # cursor, opencode, windsurf, ...; omit -a to choose
```

To update, run `npx skills@latest update`, and re-run `add` to pick up new skills.

</details>

## Skills

Skills live in buckets under [`skills/`](./skills), named for the step of the work where you reach for them: measure twice, cut once, then prove it and teach it. A bucket appears with its first skill.

- `measure/`: size the task before touching it
- `cut/`: do the work
- `prove/`: show that it works
- `teach/`: pass the knowledge on

User-invoked skills run only when you type their name; model-invoked ones the agent may also reach for on its own.

### Measure

#### User-invoked

- [`raise-the-bar`](./skills/measure/raise-the-bar/SKILL.md): before any work starts, rewrites a task to the bar a top professional would set: the outcome behind it, a specific hard target, the raw material, the field's instruments and an outside judge.

## License

[MIT](./LICENSE)
