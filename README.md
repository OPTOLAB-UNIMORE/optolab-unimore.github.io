# OptoLAB institutional website

Quarto source for the public website of OptoLAB at the University of Modena and Reggio Emilia.

> The laboratory's extended title and institutional content are provisional. Review `CONTENT-TODO.md` before treating the site as final.

## Prerequisites

- Git
- GitHub CLI (`gh`) for repository administration
- Quarto CLI

Check the tools:

```powershell
git --version
gh --version
quarto --version
gh auth status
```

## Repository structure

- `_quarto.yml`: website, navigation, SEO and output configuration
- `index.qmd`: homepage; the hero carries a "Latest news" panel with the 3 most recent entries from `news/items/`, rendered through `assets/listings/news-compact.ejs`
- `research.qmd`: five research areas, each with a hand-picked "Selected work" list linking to DOIs already present in `publications.qmd`, followed by facilities and capabilities (no separate `facilities.qmd`)
- `about-us.qmd`: team roster followed by contact information (no separate `team.qmd` or `contact.qmd`; `/team.html` redirects here through the `aliases` front matter, and the contact block keeps the `#contact` anchor other pages link to)
- `students.qmd`: recently completed theses followed by the "Join us" opportunities (theses, internships, PhD positions, research fellowships); `/join-us.html` redirects here
- `publications.qmd`: publication and dataset index, hand-maintained as a flat, year-grouped Markdown list in IEEE style (there is no `publications.bib` — entries are added directly as Markdown); `assets/js/publications-filter.js` reads that rendered list and builds the year / author / type filters from it. Public datasets live in the same list and are told apart by their type, so there is no separate `datasets.qmd`; `/datasets.html` redirects here
- `news/index.qmd`: full news archive (filterable listing)
- `news/items/`: one Quarto file per news entry (conference participations, awards, updates), named `YYYY-MM-DD-short-slug.qmd`; `_template.qmd` is the starting point and is skipped by Quarto
- `software.qmd`: verified public repositories and resources — **not linked from the site navigation**, kept as a direct-URL page pending a content review
- `projects/index.qmd` and `projects/items/`: filterable project listing — **not linked from the site navigation**, kept as a direct-URL page pending a content review
- `assets/`: brand, image and icon assets (`assets/brand/README.md` documents the logo and favicon)
- `assets/js/`: page scripts (currently the Publications filter)
- `assets/files/`: downloadable documents linked from the site (seminar announcements and similar)
- `assets/inbox/`: untracked drop zone for raw photos awaiting placement in `assets/images/`
- `assets/listings/`: EJS templates for custom Quarto listings
- `styles.scss`: visual system and responsive rules
- `.github/workflows/publish.yml`: automated GitHub Pages deployment

`software.qmd` and `projects/` are intentionally excluded from the navbar in `_quarto.yml` — this is a deliberate editorial choice (pending a content pass), not an oversight. Re-add them to the `navbar.left`/`navbar.right` lists in `_quarto.yml` once their content is ready to publish.

The navigation is deliberately short: Home, Research, Publications, News, Students, About Us.

## Local preview and rendering

```powershell
quarto preview
quarto render
```

Rendered output is written to `_site/` and is intentionally excluded from Git.

## Adding a project

1. Copy one file from `projects/items/`.
2. Give it a short lowercase filename.
3. Replace the title, description, date and categories in the YAML front matter.
4. Use only reviewed claims and authorized media.
5. Remove the demonstrative-content warning only after approval.
6. Run `quarto render` and inspect the Projects listing and project page.

## Adding a publication

1. Obtain a verified record from the publisher or DOI metadata.
2. Check authors, title, venue, year and DOI.
3. Add a new Markdown list item under the correct year heading in `publications.qmd`, formatted in IEEE style with a DOI link, matching the existing entries.
4. Update the summary counts at the top of `publications.qmd` (`pub-stats`) if the new entry changes the totals.
5. Render the site and check capitalization, links and author order.

The filters on that page are derived from the list itself, so no separate metadata is needed — but they only work while entries keep the established shape:

```
- AUTHORS, "TITLE," *JOURNAL*, vol. X, no. Y, pp. A–B, YEAR, doi: [DOI](URL).
- AUTHORS, "TITLE," in *PROCEEDINGS*, pp. A–B, YEAR, doi: [DOI](URL).
```

The leading `in ` before the italic venue is what marks an entry as a conference paper; a venue whose name contains "Workshop" is counted as a workshop paper, and one naming a data repository (`Zenodo`, `figshare`, `dataset`, …) as a dataset — which is how datasets sit in the same list without extra metadata. Authors are read from the text before the quoted title, so an entry abbreviated with `et al.` is only matched on the names it actually lists.

Do not infer OptoLAB authorship or affiliations.

## Adding a news item

1. Copy `news/items/_template.qmd` to `news/items/YYYY-MM-DD-short-slug.qmd`, using the date of the event so entries stay in chronological order.
2. Replace the title, description, date and `canonical-url` in the YAML front matter, and set `categories` (e.g. `Conference`, `Award`, `Publication`, `Seminar`).
3. A photo is optional. To add one, place the file in `assets/images/` as `news-<slug>.jpg`, then uncomment the `image:` and `image-alt:` fields. Entries without a photo render as text-only cards on the Home page and get a spectral panel in place of the thumbnail in the archive. Keep image paths root-relative (`/assets/images/...`) so they resolve on both pages.
4. Replace the body with a short paragraph (2–4 sentences), linking to a related record where relevant.
5. Record the photo's origin and authorization in `assets/images/README.md`.
6. Run `quarto render` and check the "Latest news" panel on the Home page and the full archive at `news/index.qmd`.

Both listings sort by `date` descending. The Home page shows the 3 most recent entries; older entries remain available in the archive.

## Replacing images

Drop raw photos in `assets/inbox/` (untracked). Place the reviewed, optimized copy in `assets/images/` with a descriptive filename, add meaningful alternative text at every use, and record copyright, licence or written authorization in `assets/images/README.md`. The navbar and favicon use the laboratory's own OptoLab logo (see `assets/brand/README.md`); do not add a UNIMORE or departmental logo until its use is authorized.

## Adding a completed thesis

1. Open the "Recent theses" section of `students.qmd`.
2. Copy one `.thesis-card` block and fill in three fields: the `.thesis-tag` (degree, course and session), the `###` heading (thesis title, in the language it was written in) and a paragraph summarising the work in two to four sentences.
3. Keep the most recent theses first; the grid fits up to three per row and stretches to fill the space when there are fewer.
4. Do not publish student or supervisor names — the section deliberately carries titles and summaries only.

## Updating team members

Replace placeholder cards in the Team section of `about-us.qmd` only after collecting the fields listed in `CONTENT-TODO.md`: name, academic role, short bio, research interests, institutional profile, ORCID, Google Scholar, GitHub and an authorized photo.

## Publishing

The standard automated path is:

1. Push reviewed source changes to `main`.
2. The GitHub Actions workflow renders the site.
3. The workflow publishes the rendered output to the `gh-pages` branch.
4. GitHub Pages serves the root of `gh-pages`.

Manual publishing is also available:

```powershell
quarto publish gh-pages --no-browser
```

The repository's Pages source must be `gh-pages` at `/`.

## Future UNIMORE domain

After institutional approval:

1. Obtain the final hostname and DNS instructions from UNIMORE IT.
2. Add a `CNAME` file containing only the approved hostname.
3. Configure the custom domain in Repository Settings → Pages.
4. Enable HTTPS after DNS verification.
5. Update `site-url`, the canonical URL and Open Graph URLs in `_quarto.yml`.
6. Test old and new URLs, then document ownership and renewal responsibilities.

## Rollback

For a source rollback, identify the last known-good commit and create a new reverting commit:

```powershell
git log --oneline
git revert <commit-sha>
git push origin main
```

The workflow will redeploy the reverted source. For an urgent Pages-only rollback, redeploy a known-good source commit with Quarto, then reconcile `main` immediately. Avoid force-pushing shared branches.

