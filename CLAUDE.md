# Working on this repo

This is the Quarto source for the OptoLAB website (optolab-unimore.github.io). `README.md`
documents the file structure and the content-editing workflows (adding a publication, a news
item, a thesis, replacing an image, …) — read it first for "where does X live". This file is
about *how* to operate: the parts of the workflow that aren't written down anywhere else.

## The image inbox

`assets/inbox/` is where the lab owner drops raw photos, PDFs and logos for you to use — it's
untracked (see `.gitignore`) and never committed as-is. When asked to use something from it:
read/view the file, process it (resize, crop, convert, extract from a PDF with PyMuPDF — `pip
install pymupdf` if missing), and save the finished version under `assets/images/`,
`assets/brand/` or `assets/files/` with a descriptive filename matching the existing convention
(`news-<slug>.jpg`, etc.). Record the source/authorization in the relevant `README.md`
(`assets/images/README.md` for photos; there's an equivalent note pattern in `assets/brand/`).

## Render and verify before pushing

Quarto isn't always on PATH as expected — check with `quarto --version` first. For any
non-trivial change:

1. `quarto render` (or render just the changed `.qmd` while iterating, full render before the
   final commit).
2. Check for broken internal links — walk `_site/`, regex out `href`/`src` attributes, verify
   the target exists on disk. There's no built-in linkchecker here, so do this manually.
3. Serve `_site/` locally (`python -m http.server 8899 --directory _site`) and take a headless
   screenshot to actually look at layout changes — a Chrome/Edge binary is normally present
   under `C:\Program Files\...\Application\{chrome,msedge}.exe`; use `--headless=new
   --screenshot=<absolute path>`. Check at least one narrow viewport (~390px) for anything
   touching layout, not just the desktop width. Don't claim a visual change works without having
   looked at it this way.
4. For JS (e.g. `assets/js/publications-filter.js`), load the rendered page in a headless
   browser and actually exercise the interactive behaviour (set filter values, dispatch
   `change`, assert the DOM reacts) rather than just checking the script parses.

## Git workflow

- The user pushes from this machine and sometimes from GitHub Desktop on others — always
  `git fetch` and check `git status`/`git diff` before assuming you know the working tree state.
- **If you find local changes you didn't make**, that's the lab owner's own edit (from this
  session or another device/app). Read the diff, treat it as intentional, and carry it along in
  your commit rather than reverting or asking permission to keep it — just don't silently fold
  it into unrelated prose in your commit message; call out briefly in the summary what was
  theirs vs. yours.
- Only push to `main` when asked to — but on this project "pusha le modifiche" / "push" is a
  standing instruction each time real edits exist, not a one-off approval; you don't need to
  re-confirm before pushing content changes like news items, page copy or images.
- After pushing, the GitHub Actions workflow (`Publish Quarto website` → `pages build and
  deployment`) has to finish before the live site updates — this routinely takes 2–6 minutes,
  longer if a run is queued behind another. Poll
  `https://api.github.com/repos/OPTOLAB-UNIMORE/optolab-unimore.github.io/actions/runs` rather
  than guessing, and tell the user to hard-refresh if they check before it's done.
- Write commit messages that explain *why*, not a line-by-line diff restatement. Always include
  `Co-Authored-By: Claude <noreply@anthropic.com>` (adjust name to the model in use).

## Content rules specific to this site

- **Never publish student names or thesis supervisors** — `students.qmd` carries thesis titles
  and summaries only. This was an explicit instruction; don't add names even if a source file
  (e.g. a thesis list) includes them.
- **Don't invent factual details** (dates, venues, degree levels, DOIs, affiliations). If the
  lab owner's input is missing or ambiguous on something that will be publicly and durably
  wrong if guessed, ask — this project has used `AskUserQuestion` for exactly that (e.g. a
  thesis's degree level and session). Don't ask about style/wording choices, just facts that
  can't be inferred or safely left generic.
- Verify conference dates, DOIs and similar external facts with a web search/fetch before
  writing them into a news item or publication entry rather than relying on memory.
- `publications.qmd` is a hand-maintained flat Markdown list in a specific IEEE-ish shape that
  `assets/js/publications-filter.js` parses structurally (author list before the quoted title,
  `*venue*` in italics, `in ` before the venue marks a conference paper, "Workshop"/"Zenodo" etc.
  in the venue name drive the other type buckets). Keep new entries in that exact shape or the
  filters silently misclassify them — re-render and spot check the filter counts after adding
  entries.
- When a page is restructured (merged, renamed, removed), add a Quarto `aliases:` redirect from
  the old URL and grep the whole repo for other pages/anchors that pointed at it before calling
  the change done.
- Update `README.md` and `CONTENT-TODO.md` when the structural edit you just made changes what
  they describe — they've been kept in sync with every restructuring so far; don't let them
  drift.

## Don't

- Don't use `git add -A`/`.` without reviewing `git status` first — the inbox is gitignored but
  double-check nothing else unexpected got staged.
- Don't amend or force-push; don't skip hooks.
- Don't add features/sections nobody asked for (e.g. don't reintroduce the equipment list the
  lab owner deliberately removed from `research.qmd`).
