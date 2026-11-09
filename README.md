# Chef Who Drinks Whiskey: static site

Plain HTML, CSS and a small JavaScript file. No React.

## Editing content (the client's job)
1. Open `site.config.js`. Text, links, prices, and booked dates all live there.
2. Put new photos or videos in `public/` and change the filename in the config.
3. Commit the change to GitHub. The site rebuilds and publishes itself.

### Greying out booked dates
Add a line to `blockedDates` in `site.config.js`:

    blockedDates: [
      "Smith Wedding 1/27/2027",
    ],

Only the `M/D/YYYY` part is used. The note ("Smith Wedding") is dropped during the build,
so it never appears on the public website.

## Building locally
    npm ci
    npm run build        # output goes to dist/
    SITE_URL=https://your-domain.com npm run build   # sets canonical/OG/sitemap URLs

Open `dist/index.html` through any static server (for example `npx serve dist`).

## Files
- `site.config.js`: all editable content
- `build.js`: turns the config into `dist/index.html`
- `src/client.js`: the browser script (menu, quote form, date picker, video, lightbox)
- `src/input.css` + `tailwind.config.js`: styling (Tailwind, compiled at build time)
- `public/`: images, videos, robots.txt, sitemap.xml (copied as-is into dist/)

## Publishing flow
- Work on the `staging` branch. Every push publishes a preview to GitHub Pages (noindex).
- When the preview looks right, merge `staging` into `main` (open a pull request).
- Cloudflare Pages builds `main` and publishes the live site.
