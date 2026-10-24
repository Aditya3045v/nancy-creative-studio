# Nancy Creative Studio portfolio

A polished static portfolio site for Nancy Creative Studio. It needs no installation or build step.

## Preview locally

Open `index.html` in a browser, or from this folder run a simple static server (for example, `npx serve .`).

## Customize before publishing

1. Open `settings.js` and replace `whatsappNumber` and `instagramUrl`. The defaults are deliberately non-real placeholders.
2. Choose one form delivery path:
   - **WhatsApp:** leave `formEndpoint` blank. Form submissions open a prefilled WhatsApp message once a real number has been added.
   - **Form endpoint:** paste a Formspree or Web3Forms endpoint into `formEndpoint`. The form will POST submissions there instead.
3. Update package names/prices in `index.html` if your offers change.
4. Replace the four current portfolio images in `assets/` and update their captions/alt text in `index.html` when real commissioned work is ready. The included Clothing, Food, Jewellery, and Salons & Parlours visuals are original self-initiated concepts and are labelled as such in the site.
5. Update the SEO title, meta description, Open Graph fields, and `siteUrl` in `index.html` / `settings.js` for your live domain.

## Publish

Upload the entire folder to any static host such as Netlify, Cloudflare Pages, GitHub Pages, or your web host's `public_html` directory. Keep the `assets` folder beside `index.html`.

## Included features

- Responsive editorial layout with mobile navigation
- Gallery category filters and keyboard-accessible image lightbox
- Clearly marked concept-project labels (no invented clients or results)
- Package picker that pre-fills the enquiry form
- WhatsApp CTA and editable contact settings
- Optional form-endpoint delivery plus local draft-safe fallback
- SEO / Open Graph basics and accessible focus, reduced-motion, and alt-text handling
