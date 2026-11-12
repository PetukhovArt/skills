---
name: raise-the-bar
description: "Raises a task to the bar a top professional with a strong sense of self-efficacy would set."
disable-model-invocation: true
---

The usual ceiling is a low bar, not a weak model: a request sized to what feels possible, and an "impossible" accepted without proof. Rewrite the task to a higher bar before any work, then hand it back for approval.

## Steps

1. **Outcome.** Ask what should happen once the task is done: the goal behind the goal. When the work recurs, restate it as a state to hold ("the app stays crash-free") instead of one act ("fix this crash"), and name what the agent needs to hold it unattended (data one command away, a machine to reproduce on). Done when the outcome is one sentence the user would sign.
2. **Precedent.** Name what a top professional in this field does here that the request leaves out. Recast the task as verbs (a quarterly review becomes "get busy people to believe a cause-and-effect story and decide in 30 minutes") and list the fields those verbs belong to: each field adds its methods. Write each method as an action the agent performs with that field's instrument (a profiler, a database, a statistical model, a trace). Done when every method names a tool runnable here or a tool to install.
3. **Raw material.** Name the rawest source they would start from: logs, traces, the raw table, the real data, in place of a summary or a dashboard. Take one belief the user holds about the cause and plan to reproduce it from that source.
4. **Hard target.** Set a specific, measurable target well past the comfortable one (200 ms, not 5 s; zero crashes for a week, not fewer), with the measurement that decides it.
5. **Outside judge.** Name what, other than the agent or the user, shows the result is right: a benchmark, a test that goes red on the bug, a profiler number, a held-out dataset, the live app driven as its user. Prefer one the agent runs itself, for a tight loop.
6. **Rewrite.** Output the task rewritten as outcome, target, raw material, methods and judge, plus the bold version to try first and the cheap fallback if it fails. Wait for the user's go.

## While working

- A verdict of "impossible" or "good enough" short of the target carries its proof: the measurement or the hard constraint that blocks it. Without proof the target stands: it is solvable, keep going.
- A missed target is reported with the number reached and what blocks the rest; a bold attempt that made things worse is rolled back to the fallback.
