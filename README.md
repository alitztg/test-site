# Cast — marketing site

A static, dependency-free landing page for **Cast**, a lighting-simulation
tool for architects and lighting designers. Built with plain HTML, CSS, and
vanilla JavaScript so it can be hosted directly on GitHub Pages with no
build step, backend, or environment variables.

## Structure

```
/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/        (empty — add real photography/renders here if desired)
│   └── icons/
│       └── favicon.svg
└── README.md
```

## Run it locally

No build step is required. Either:

- Open `index.html` directly in a browser, or
- Serve the folder so relative paths behave exactly as they will on GitHub
  Pages, e.g. `python3 -m http.server` from inside this folder, then visit
  `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository (or use an existing one) and push the
   contents of this folder to the root of the default branch:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Cast landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a
   branch**, choose the **main** branch and the **/(root)** folder, then
   save.
4. GitHub will publish the site at:
   - `https://<your-username>.github.io/<your-repo>/` for a project repo, or
   - `https://<your-username>.github.io/` if the repo is named
     `<your-username>.github.io`.

All internal links in this project use relative paths (`style.css`,
`script.js`, `#section-id` anchors), so the site works correctly whether it's
served from a domain root or a project subpath — no configuration changes
needed either way.

## Customizing

- **Colors, type, spacing:** all defined as CSS custom properties at the top
  of `style.css` under `:root`. Change the palette or type scale in one
  place and it propagates everywhere.
- **Copy and structure:** edit `index.html` directly; sections are labeled
  with comments (`<!-- ============ HERO ============ -->`, etc).
- **Waitlist form:** the form in the final CTA section is client-side only
  (see `script.js`, `ctaForm` handler). To actually collect submissions on
  a static host, wire the `<form>` up to a service like Formspree, Netlify
  Forms, or your own API endpoint — the validation and success/error states
  are already in place.
- **Fonts:** Space Grotesk (display) and Inter (body) are loaded from
  Google Fonts in `index.html`. Swap the `<link>` tags and the
  `--font-display` / `--font-body` variables in `style.css` to use different
  typefaces.

## Accessibility & performance notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link are
  in place.
- All interactive elements are keyboard-reachable with visible focus states.
- `prefers-reduced-motion` disables scroll-triggered animation, the cursor
  spotlight, and smooth scrolling.
- The hero's cursor-tracking spotlight only activates on hover-capable
  devices; touch devices get a static glow instead.
- Decorative SVGs and background effects are marked `aria-hidden="true"`.
- No external JS dependencies; the only external request is the Google
  Fonts stylesheet.
