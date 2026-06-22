# Ember Coffee Roasters

A design-led brand and marketing site for a small-batch coffee roaster. Built as
a fast, content-first static site with smooth scrolling and scroll-triggered
motion — full-bleed photography, editorial typography and stacked, alternating
sections that tell the brand story top to bottom.

No backend, no database — it's a marketing site, so it ships as static HTML/CSS
with a touch of JavaScript for the motion. Deploys free anywhere.

## Built with

- **Astro** — content-first framework, near-zero JavaScript by default
- **GSAP + ScrollTrigger** — scroll-triggered reveals and image parallax
- **Lenis** — smooth inertial scrolling
- **SCSS** — bespoke, hand-written styles (no utility framework)
- Real photography, optimised and served locally

## Highlights

- Full-bleed hero with a parallax image and an animated "drip" scroll cue
- Sections reveal and stagger into view as you scroll
- A sticky header that condenses once you leave the hero
- Fully responsive, and it respects `prefers-reduced-motion`

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:4321.

## Build

```bash
npm run build      # outputs static files to ./dist
npm run preview    # preview the production build
```

## Deploy

Push to GitHub and import at [vercel.com/new](https://vercel.com/new) (or Netlify
/ Cloudflare Pages). It's a static Astro site — no environment variables, no
server. The build command is `npm run build` and the output directory is `dist`.

## Photography

The images in `public/images` are royalty-free photos used as brand placeholders.
Swap them for real product and lifestyle shots before going live.
