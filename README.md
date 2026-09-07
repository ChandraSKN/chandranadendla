# Chandra's portfolio

The repository contains a static export of the previous Next.js website. The updated portfolio is plain HTML and CSS and does not require a build. The optional hero orbit uses Three.js; the content and static diagram remain available without JavaScript.

## Preview

From this directory, run `python3 -m http.server 3000` and visit `http://localhost:3000`.

## Edit

- `index.html`: main portfolio content.
- `professional.html`: matching page for the existing professional route. Keep it in sync with `index.html`.
- `portfolio.css`: responsive layout, typography, and colors.
- The existing images, résumé, writing pages, and Next.js assets are retained.

Common Ground links to the interactive negotiation demo at `projects/common-ground/`. Its portfolio artwork is an illustration, not an application screenshot. Spinodoid Structures links to a written project walkthrough at `projects/spinodoid/`, using the existing project image and the supplied MSc report.

The employment details are carried over from the previous portfolio, including the current role's date. Confirm these and the résumé before publishing. Deploy the contents of this directory to the existing static host. No deployment is performed by editing these files.

## Product Thinking orbit

`product-thinking.js` enhances the hero with selectable Three.js spheres. Serve the site over HTTP for ES modules (use the preview command above). Three.js 0.180.0 is vendored in `vendor/three/` with its MIT license, following the [official module installation guidance](https://threejs.org/manual/en/installation.html).

Mobile screens (700px and below), reduced-motion preferences, unavailable WebGL, and module loading failures use the static diagram. Perspective buttons work without WebGL; without JavaScript, the default People description remains visible. The animation has a pause control and stops when hidden or offscreen. To edit the descriptions, update `descriptions` in the script and the default description in both HTML pages.

## About avatar

The About section uses the supplied `person.glb`. The loader fits its size and poses its left arm and fingers toward the copy, pointing downward on mobile. The original GLB file is unchanged. The earlier generated model and its build script are retained as unused assets.

`about-avatar.js` loads it near the viewport, animates on interaction, pauses offscreen, and adjusts the pointing arm downward on mobile. The inline SVG remains available without JavaScript, WebGL, or a successful model download. Three.js GLTFLoader and BufferGeometryUtils are vendored at 0.180.0 with local import paths and the existing MIT license.

The avatar automatically waves and points, with gentle desktop cursor tracking. Reduced-motion mode uses a static pointing pose. Actions run on the website; the supplied `person.glb` remains unchanged.

On the first view of at least 35% of the avatar, it automatically waves for three seconds, then points toward the text. The sequence loops: three seconds waving, then five seconds pointing. It pauses offscreen or in a hidden tab. Reduced-motion users see the pointing pose immediately.

## Creative storyboard

`stories/index.html` and the five readers at `stories/<story>/index.html` now use `storyboard.css` and `storyboard.js`. The collection has genre filtering and a random story link; readers have chapter anchors, reading progress, and focus mode. No build is required.

Original story section markup is preserved in `stories/story-content.json`. MAD and Game Changer retain their authored text. Maya was empty, while LOVE and Yamaduta contained Markdown placeholders; these pages now show an in-development message. The old exported comment widgets are not included in the new readers. Edit the reader HTML to publish story updates and keep the collection cards in sync.

## Field Notes / articles

`blogs/index.html` and the two readers at `blogs/<article>/index.html` use `journal.css` and `journal.js`. The collection includes the supplied LinkedIn article link. Readers provide night/day reading, larger type, focus mode, section navigation, and reading progress. Controls work with keyboard and touch; reduced-motion preferences disable smooth scrolling.

Original article markup is archived in `blogs/article-content.json`. Existing article text and source links are preserved; this redesign is not a factual update of the essays. The previous exported comment widgets are not included. Edit the reader HTML for future content updates.

## Curiosity Lab / learning

`learn.html` uses `learning.css` and `learning.js`. It replaces the former in-progress screen with three learning tracks linked to existing essays and the supplied LinkedIn article. Dedicated lessons are explicitly marked coming soon.

The playground includes local two-player tic-tac-toe and an opt-in ball-bounce game with keyboard/pointer controls, restart, and pause/resume. Ball bounce pauses when hidden or offscreen. No account, backend, or build step is required.

## Clean writing routes

Stories and blogs use directory indexes: `/stories/`, `/blogs/`, `/stories/MAD/`, and `/blogs/theTurk/`, for example. These work with the preview command above and static hosting, including direct visits and refreshes. Edit the corresponding `index.html` files. Previous `.html` URLs redirect to the new routes, preserving query strings and fragments when JavaScript is enabled.

## Spinodoid project

`projects/spinodoid/index.html` is the written project page, with local styles in `projects/spinodoid/spinodoid.css`. Both portfolio pages link to this clean directory route. The content and specimen results are sourced from `2719689N_Nadendla_MSc_Project_final_Report_Back_UP.pdf`, presented as a first-person project walkthrough. The original LinkedIn post is linked; its contents could not be retrieved during authoring. Edit the page directly; no build or JavaScript is required.

The Spinodoid page includes an automatically loaded Three.js viewer backed by `projects/spinodoid/spinodoid.glb` (~10 MB). The model is a representative Gaussian-random-field reconstruction, not an original experimental STL. It uses 1,000 waves, wavenumber 15π, a 75-point grid, [90 0 0] geometry, a nominal 30 mm cube and a 0.48 mm normal-offset shell. The original random seed is unavailable; the reconstruction uses seed 2719689. The source is `scripts/build-spinodoid.py` (requires numpy, scikit-image and trimesh). The viewer renders on interaction, supports touch and keyboard, and displays a helpful message if WebGL is unavailable. Method reference: https://www.gibboncode.org/html/HELP_spinodoid.html


## Common Ground negotiation demo

Preview: `http://127.0.0.1:3017/projects/common-ground/` when serving this directory with `python3 -m http.server 3017 --bind 127.0.0.1`. Both portfolio entry pages link to the clean route.

The demo uses plain HTML, CSS and JavaScript, matching this portfolio. The existing Common Ground application's source is not present in this workspace, so this is a standalone working prototype, not an integration into its quotation backend.

Functional: four clarification branches, explicit confirmation/rejection, three commercial options, recalculated margin and minimum warnings, cost editing, private concession reflection, editable response, customer-facing text export, quotation preview, session-only revision snapshots, scripted reactions, explicit question resolution, and restart. All scenario data and scripted outcomes are fictional. Pilot acceptance thresholds are illustrative proposals requiring agreement.

State lives only in memory. The demo does not read or write localStorage, sessionStorage, databases, or real quotation APIs. Reload/restart clears the demo; it cannot overwrite real quotation revisions. The customer-document projection excludes internal cost estimates, minimum margin, private reflection and concession reasons. A user can deliberately type anything into the customer draft, so customer-facing text still needs their review.

Further development needs the existing app source and integration for costing, scope, quotation persistence, revision history, authentication and collaboration. Scripted replies would need to be replaced with actual customer input for real use. Domain-expert review and outcome tracking are future work; no personality scoring or predictive analysis is implemented.

Browser verification is in `scripts/test-common-ground.cjs`. With Playwright installed outside the static site, run `NODE_PATH=/path/to/node_modules node scripts/test-common-ground.cjs`. Set `COMMON_GROUND_BASE_URL` to another local preview URL if needed; default is `http://127.0.0.1:3017`. The test uses `/usr/bin/google-chrome`, overridable with `CHROME_PATH`. It checks branching, all initial margins, cost changes, customer-draft privacy, edits, revisions, question resolution, restart isolation and responsive widths.

The Common Ground project landing page now matches the Spinodoid presentation: introduction, an automatically loaded interactive iframe, then a first-person project write-up. The full demo lives at `projects/common-ground/demo.html`; its existing controls and isolated session state are preserved. Landing-page styling is in `project.css`, separate from the demo styles.
