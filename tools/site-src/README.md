# Website source

The pages at the site root (`index.html`, `pulsehmis/`, `edupulse/`, `lwasa-ludo/`, `404.html`) are generated from this folder.

- `pages/*.html` – the body of each page.
- `build.py` – adds the shared head, navigation bar, footer and mobile tab bar, then writes the pages.

After editing, run from the repository root:

    python tools/site-src/build.py

Styles and behaviour live in `site/site.css` and `site/site.js`. After changing either, bump the `?v=` number in `build.py` so visitors get the new file.

Downloads and video tutorials do not need a rebuild: edit `content.json` and the site picks the change up on the next page load.
