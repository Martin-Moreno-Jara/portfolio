# Constitution — Portoflio

**Version:** 1.1.0 · **Ratified:** 10-10-2026 · **Last amended:** 12-10-2026

## 1. Purpose

A web-based SPA portfolio to display my projects, skills and experience, as well
as showcasing my work for job applications.

## 2. Core principles

### P1. Spec and code

- **Rule:** Spec and code must be synchronized and be coherent with one another.
- **Why:** Both the spec and the code are the source of truth. They must not
  diverge from one another
- **Check:** The specs documentation coincides with the code implementation and
  vice versa.

### P2. Test-backed acceptance

- **Rule:** Every acceptance criterion MUST be covered by at least one automated
  test.
- **Why:** "Done" must be verifiable, not claimed.
- **Check:** Verify test cases pass.

### P3. Simplicity first

- **Rule:** Prefer the simplest solution that satisfies the spec. New
  abstractions, layers, or services MUST be justified in the plan.
- **Why:** Complexity is a cost paid on every future change.
- **Check:** Plan's "Constitution check" lists every added abstraction with its
  reason.

## 3. Technical constraints

| Area               | Constraint         |
| ------------------ | ------------------ |
| Language / runtime | Typescript         |
| Frameworks         | React              |
| Data               | local json files   |
| Infra              | Vercel             |
| Dependencies       | Tailwind CSS, Vite |
| Testing (dev only) | Vitest, jsdom, Testing Library (react, dom, user-event, jest-dom) |

## 4. Quality gates

A change is **done** only when all apply:

- [ ] Spec approved and up to date with what was built
- [ ] All acceptance criteria covered by passing tests
- [ ] docs / changelog updated
- [ ] human review approved

## 5. Development workflow

- **Branching:** trunk-based
- **Commits:** Conventional Commits with task/requirement IDs.
- **Review:** reviewer agent + human

## 6. Deviations

A principle MAY be bypassed only if:

1. The plan records it under "Constitution check" as
   `DEV-{{01}}: principle — reason — scope — expiry`.
2. A human approves it explicitly.
3. A follow-up task is created to remove it, if temporary.

Undocumented deviations are defects.

## 7. Governance

- This constitution **overrides** all other project guidance, including
  AGENTS.md, specs, and plans.
- Agents MAY propose amendments; they MUST NOT apply them without approval.

## 8. Amendment log

| Version | Date       | Change               | Approved by        |
| ------- | ---------- | -------------------- | ------------------ |
| 1.0.0   | 10-10-2026 | Initial ratification | Martin Moreno Jara |
| 1.1.0   | 12-10-2026 | §3: allow Vitest + Testing Library as dev-only dependencies (DEV-01, specs/001-download-cv/plan.md) | Martin Moreno Jara |
