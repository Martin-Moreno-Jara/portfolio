# AGENTS.md — Portoflio

<!--
BLUEPRINT — HOW TO ADAPT (delete this block once adapted)
- {{PLACEHOLDER}}   → fill in or delete the line.
- [OPTIONAL]        → delete the whole section if it doesn't apply.
- <!-- variant -->  → keep only one of the alternatives.

- Keep the final file short (~150–250 lines). Move long details to /docs and
  link them.
- Works with Spec Kit, Kiro, OpenSpec, or a custom flow: adjust §3.2 only. -->

## 1. Project context

- **Name:** Portoflio
- **Purpose:** SPA portoflio for a computer science/systems engineering student
  (me) for displaying projects, skills and experience
- **Stack:** Typescript, React with Vite, local json files, deployment in Vercel
- **Package manager:** npm
- **Layout:**
  ```
  src/        application code
  tests/      tests
  specs/      SDD artifacts
  ```

## 2. Source of truth (precedence)

When artifacts conflict, higher wins. Always keeping up the code with the spec:

1. **Constitution / principles** — `specs/constitution.md`
2. **Approved spec** of the active feature
3. **Plan / design**
4. **Tasks**

On conflict: **stop, report the conflict, propose a fix. Never resolve it
silently in code.**

## 3. SDD workflow

### 3.1 Phases, artifacts and gates

| #   | Phase      | Artifact (adjust path)      | Gate              | Agent may…                    |
| --- | ---------- | --------------------------- | ----------------- | ----------------------------- |
| 0   | Principles | `specs/constitution.md`     | Human             | Propose edits only            |
| 1   | Specify    | `specs/<feature>/spec.md`   | Human approves    | Draft WHAT/WHY, no HOW        |
| 2   | Clarify    | same file, "Open questions" | Human answers     | Ask, never assume             |
| 3   | Plan       | `specs/<feature>/plan.md`   | Human approves    | Design HOW                    |
| 4   | Tasks      | `specs/<feature>/tasks.md`  | Human approves    | Break plan into tasks         |
| 5   | Implement  | code + tests                | Per task / per PR | Execute tasks in order        |
| 6   | Verify     | checklist in `tasks.md`     | Human             | Run tests, map to criteria    |
| 7   | Close      | archive                     | Human             | Update specs to match reality |

**Rule:** never start phase N+1 until phase N's gate is passed, unless the human
explicitly says to skip it.

## 4. Spec rules (phase 1–2)

- Describe **what** and **why**. No technology, libraries, or file names.
- Each requirement has an ID: `REQ-001`.
- Format: EARS: "WHEN <trigger>, THE SYSTEM SHALL <response>"
- Every requirement has **testable acceptance criteria**.
- Mark unknowns explicitly: `[NEEDS CLARIFICATION: ...]`. Do not guess.
- Include **Out of scope** and **Non-functional requirements** (performance,
  security, accessibility) when relevant.

## 5. Plan rules (phase 3)

- Check the plan against the constitution; list any deviation and justify it.
- Cover only what applies: architecture, data model, API/contracts, error
  handling, migrations, observability.
- Record non-trivial decisions as
  `DEC-01: decision — rationale — alternatives rejected`
- List risks and how they'll be tested.
- Prefer existing patterns in the codebase over new abstractions.

## 6. Task rules (phase 4)

- Atomic: one task ≈ one reviewable commit ({{≤ ~500 lines}} changed).
- Each task references the requirements it satisfies.
- Explicit order and dependencies; mark parallelizable tasks with `[P]`.
- Format:
  ```
  - [ ] T01 [P] <imperative description> — REQ-001, REQ-003 — files: <paths>
  ```

## 7. Implementation rules (phase 5)

- Work **one task at a time**, in order. Mark `[x]` only when its tests pass.
- Tests first (TDD): each acceptance criterion maps to ≥ 1 test.
- **No scope creep.** Ideas outside the spec go to `specs/backlog.md`, not into
  code.
- If implementation shows the spec/plan is wrong or incomplete: **stop**, write
  a proposed delta, wait for approval.
- Don't touch files unrelated to the current task.

## 8. Commands

```bash
npm install    # install deps
npm run dev         # run locally
{{test}}        # all tests
{{test-one}}    # single test file
npm run build        # build
```

## 9. Code conventions

- Dependencies: ask before adding any new dependency

## 10. Boundaries

**Always**

- Read the constitution and the active spec before acting.
- Ask when a requirement is ambiguous.
- Keep traceability: REQ → task → test → commit.

**Ask first**

- Adding dependencies, changing DB schema, public APIs, CI/CD, or infra.
- Deleting or renaming files outside the current task.
- Skipping a phase or gate.

**Never**

- Implement without an approved spec.
- Edit an approved spec silently.
- Commit secrets, disable tests, or weaken assertions to make them pass.

## 12. Reporting format

At the end of each phase or task, report:

```
Phase/Task: <id>
Done: <1–3 lines>
Artifacts changed: <paths>
Open questions / risks: <list or "none">
Next: <next step + who must act>
```

## Appendix A — Spec skeleton

```markdown
# Spec: {{feature}}

Status: Draft | Approved | Implemented

## Problem / Why

## Users & scenarios

## Requirements

- REQ-001: WHEN …, THE SYSTEM SHALL …
  - AC: …

## Non-functional

## Out of scope

## Open questions

- [NEEDS CLARIFICATION: …]

## Changelog
```

## Appendix B — Plan skeleton

```markdown
# Plan: {{feature}}

Spec: ./spec.md

## Constitution check

## Architecture

## Data model / Contracts

## Decisions (DEC-xx)

## Risks & test strategy
```

## Appendix C — Tasks skeleton

```markdown
# Tasks: {{feature}}

- [ ] T01 … — REQ-001 — files: …
- [ ] T02 [P] … — REQ-002 — files: …

## Verify

- [ ] All AC covered by tests
- [ ] lint / typecheck / tests green
- [ ] Spec updated to match implementation
```
