# Image inbox

Drop raw, unprocessed photos here (conference pictures, lab/equipment shots, portraits, anything for News, Join Us or other pages) and let Claude know what they're for in the chat. Claude reads this folder directly from your computer, so nothing needs to be uploaded or attached anywhere else.

This folder is **not tracked by git** (see `.gitignore`) — files placed here are never committed or published as-is. Claude picks the relevant image up from here, resizes/optimizes it if needed, and places the final version in `assets/images/` with a descriptive filename (matching the convention already used there, e.g. `news-<slug>.jpg`). Only that final, reviewed copy — placed in `assets/images/` — gets committed and goes live once you push.

Feel free to delete files here after they've been placed in `assets/images/`; they're just a drop zone, not an archive.
