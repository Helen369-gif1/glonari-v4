# Glonari-Global-Scene — project rules

## Mandatory documentation updates

**Scope: this applies to the entire project, including `mobile/`.** The
first screen has two entry points — `index.html` (desktop) and
`mobile/index.html` (phones and narrow windows) — that share `plaza.js`
and `plaza.css`. A change to `mobile/index.html`, or to `plaza.js` /
`plaza.css` insofar as it affects mobile behavior, is held to exactly the
same rule as a change affecting desktop. Mobile is covered by
DEVELOPMENT_PLAN.md Stage 14 / Stage 21 and PRODUCT_REQUIREMENTS.md
§19 / §31 — the same kind of "confirmed decision" as anything about the
desktop scene.

After EVERY completed task that changes, **on desktop or on mobile**:
- the scene's movement/parallax architecture
- the list of interactive elements (which buildings/tap-zones react to
  hover/click/tap)
- visual behavior (day/night, hover, click, tap, loading screen)
- any decision previously recorded as "confirmed" in PRODUCT_REQUIREMENTS.md,
  or as acceptance criteria / a stage status in DEVELOPMENT_PLAN.md

— both documents below MUST be updated BEFORE the task is considered done:

1. **DEVELOPMENT_PLAN.md** — find the relevant Stage and update:
   - acceptance criteria, if behavior changed
   - stage status
   - when a decision is replaced, rewrite the item so it describes only the
     current decision and delete the old text, including any existing
     SUPERSEDED blocks. The documents describe the project as it is now;
     history lives in git.

2. **PRODUCT_REQUIREMENTS.md** — find the relevant item (and every other
   section that echoes the same decision) and update it the same way:
   keep only the current decision, delete the outdated one.

## Removing obsolete material

Anything the project no longer needs (outdated decisions in the docs,
unused files and code) is deleted, not kept. Before deleting anything,
show the full list and wait for explicit confirmation.

## Reporting on completed work

Do not publish a separate Artifact (HTML page or otherwise) for a
status/QA/test report on this project unless explicitly asked for one.
Report back in plain chat text instead. If screenshots are genuinely
useful to show something visually, attach them as plain image files
(e.g. saved to the scratchpad or referenced by path), not as a hosted
report page.

## Definition of done

A task that changes previously-documented behavior is not done if the code
changed but DEVELOPMENT_PLAN.md and/or PRODUCT_REQUIREMENTS.md did not —
this holds regardless of whether the changed code lives in the repo root
or under `mobile/`. If a task does NOT change a previously-recorded
decision (e.g. a purely visual bugfix with no architecture/scope change),
the documents do not need to be updated.
