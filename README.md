# Chandra's portfolio

The repository contains a static export of the previous Next.js website. The updated portfolio is plain HTML and CSS and does not require a build. The optional hero orbit uses Three.js; the content and static diagram remain available without JavaScript.

## Preview

From this directory, run `python3 -m http.server 3000` and visit `http://localhost:3000`.

## Edit

- `index.html`: main portfolio content.
- `professional.html`: matching page for the existing professional route. Keep it in sync with `index.html`.
- `portfolio.css`: responsive layout, typography, and colors.
- The existing images, résumé, writing pages, and Next.js assets are retained.

Common Ground links to the supplied live project URL. Its quote artwork is an illustration, not an application screenshot. Spinodoid Structures uses the existing project image. Add verified roles, methods, results, and a project link when available; no project metrics have been invented.

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

`stories.html` and the five pages under `stories/` now use `storyboard.css` and `storyboard.js`. The collection has genre filtering and a random story link; readers have chapter anchors, reading progress, and focus mode. No build is required.

Original story section markup is preserved in `stories/story-content.json`. MAD and Game Changer retain their authored text. Maya was empty, while LOVE and Yamaduta contained Markdown placeholders; these pages now show an in-development message. The old exported comment widgets are not included in the new readers. Edit the reader HTML to publish story updates and keep the collection cards in sync.

## Field Notes / articles

`blogs.html` and the two readers in `blogs/` use `journal.css` and `journal.js`. The collection includes the supplied LinkedIn article link. Readers provide night/day reading, larger type, focus mode, section navigation, and reading progress. Controls work with keyboard and touch; reduced-motion preferences disable smooth scrolling.

Original article markup is archived in `blogs/article-content.json`. Existing article text and source links are preserved; this redesign is not a factual update of the essays. The previous exported comment widgets are not included. Edit the reader HTML for future content updates.

## Curiosity Lab / learning

`learn.html` uses `learning.css` and `learning.js`. It replaces the former in-progress screen with three learning tracks linked to existing essays and the supplied LinkedIn article. Dedicated lessons are explicitly marked coming soon.

The playground includes local two-player tic-tac-toe and an opt-in ball-bounce game with keyboard/pointer controls, restart, and pause/resume. Ball bounce pauses when hidden or offscreen. No account, backend, or build step is required.
