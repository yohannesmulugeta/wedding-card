# Christian Wedding Card

Mobile-first Christian wedding invitation built with React, Vite and Framer Motion.

## Edit the wedding

Most wedding-specific content is in:

`src/content.js`

Replace:
- bride and groom names
- monogram
- wedding date/time
- Bible verses
- ceremony and reception locations
- photo URLs
- optional music URL

## Photos

The current design intentionally uses elegant placeholders. Add the real couple photos later in `public/images/` and reference them from `src/content.js`, for example:

`hero: "/wedding-card/images/hero.jpg"`

## RSVP

The RSVP is frontend-only for now. It demonstrates the final flow but does not save data until a backend/database is connected.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Every push to `main` deploys through GitHub Actions to GitHub Pages.

Expected site:

https://yohannesmulugeta.github.io/wedding-card/
