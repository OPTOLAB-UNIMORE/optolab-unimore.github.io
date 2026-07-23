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
- `index.qmd`: homepage
- `research.qmd`, `facilities.qmd`, `team.qmd`, `contact.qmd`: primary pages
- `projects/index.qmd`: filterable project listing
- `projects/items/`: one Quarto file per project or research demonstrator
- `software.qmd`: verified public repositories and resources
- `publications.qmd` and `publications.bib`: publication index and bibliography
- `assets/`: brand, image and icon assets
- `styles.scss`: visual system and responsive rules
- `.github/workflows/publish.yml`: automated GitHub Pages deployment

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

1. Obtain a verified BibTeX record from the publisher or DOI metadata.
2. Check authors, title, venue, year and DOI.
3. Add the record to `publications.bib`.
4. Cite its key from `publications.qmd` or enable an intentionally reviewed bibliography listing.
5. Render the site and check capitalization, links and author order.

Do not infer OptoLAB authorship or affiliations.

## Replacing images

Place reviewed images in `assets/images/`, optimize them for the web and add meaningful alternative text at every use. Record copyright, licence or written authorization. Do not replace the provisional abstract mark with a UNIMORE or departmental logo until its use is authorized.

## Updating team members

Replace placeholder cards in `team.qmd` only after collecting the fields listed in `CONTENT-TODO.md`: name, academic role, short bio, research interests, institutional profile, ORCID, Google Scholar, GitHub and an authorized photo.

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

