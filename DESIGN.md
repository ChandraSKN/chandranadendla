---
name: Chandra SK Nadendla portfolio
description: An exhibition catalogue for product, engineering, and creative work.
colors:
  canvas: "#f4f5f8"
  ink: "#1d2330"
  secondary-text: "#586174"
  rule: "#d2d7e1"
  cobalt: "#2946df"
  surface: "#e7ebf4"
  white: "#ffffff"
  cobalt-hover: "#2038b8"
typography:
  display:
    fontFamily: "Exhibit, Arial, sans-serif"
    fontSize: "clamp(42px, 6.5vw, 94px)"
    fontWeight: 580
    lineHeight: 1
    letterSpacing: "-.055em"
  headline:
    fontFamily: "Exhibit, Arial, sans-serif"
    fontSize: "clamp(38px, 4.3vw, 62px)"
    fontWeight: 520
    lineHeight: 1.08
    letterSpacing: "-.035em"
  intro:
    fontFamily: "Exhibit, Arial, sans-serif"
    fontSize: "17px"
    lineHeight: 1.7
  story-prose:
    fontFamily: "Georgia, serif"
    fontSize: "20px"
    lineHeight: 1.85
rounded:
  control: "4px"
  collection-media: "10px"
  media: "12px"
spacing:
  mobile-gutter: "20px"
  desktop-gutter: "48px"
  section-mobile: "48px"
  section-desktop: "80px"
components:
  collection-button:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "16px 22px"
  contact-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  filter:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  project-tag:
    textColor: "{colors.cobalt}"
  story-card:
    backgroundColor: "transparent"
---

# Design System: Chandra SK Nadendla portfolio

## Overview

**Creative North Star: "The Design Exhibition Catalogue"**

The design exhibition catalogue places generous proportional typography, quiet ruled surfaces, and real project imagery around Chandra’s work. The owner’s name is the masthead; writing settles into a calm reading surface. The user delegated this visual direction; implementation is code-first for this session, without implying a persistent workflow preference.

**Key Characteristics:**

- Large proportional mastheads and compact supporting labels.
- Cool off-white canvas, ink text, and a single cobalt accent.
- Flat editorial surfaces with lightly rounded media.

## Colors

Cobalt directs attention across cool paper and ink neutrals. Primary actions, selected filters, reader progress, and emphasized words share the accent. Canvas is the page background; surface defines grouped panels; secondary text supports hierarchy; rule separates content. White provides a clean story reading surface.

Article night mode switches the shared CSS variables to a dark canvas with light text and a lighter blue. Treat this as an existing reader preference, not a site-wide default.

## Typography

Exhibit is the CSS name for the locally hosted Geist variable font, with Arial and sans-serif fallbacks. It is proportional, including the masthead and compact labels. Georgia remains in long-form prose. The frontmatter display role describes the desktop identity masthead; headline describes the homepage hero, while collections use larger fluid headlines. Headings use tight tracking; paragraphs have generous leading. Story prose becomes 18px on narrow screens.

## Layout

Shared containers reach 1280px with 48px desktop gutters and 20px gutters at 760px and below. Major sections use 80px vertical spacing, reduced to 48px on mobile. Homepage project rows pair media and text in a 1.4:1 grid with a 64px gap; narrow screens stack them. Story collections use two columns and become one on mobile. Reader and task surfaces retain their route-specific layout rules. Shared spacing tightens at 1100px; the mobile layout and menu switch at 760px. The orbit’s independent static fallback switches at 700px.

## Elevation & Depth

Tonal surfaces, whitespace, and thin rules provide most depth. Cards are flat rather than universally shadowed. The Common Ground preview alone uses a soft image shadow (`0 12px 30px #27355720`); the learning diagram core uses an accent shadow (`0 18px 35px #2946df22`). Preserve these local roles rather than turning them into a card-wide effect.

## Shapes

Controls have small corners; media and interactive panels are more rounded. Collection images use their intermediate radius. Project tags remain unboxed text. Section dividers are straight thin rules; the existing orbit and avatar retain their distinctive shapes.

## Components

Primary collection actions use cobalt with white text and a 48px minimum height. The homepage primary action darkens and rises slightly on hover. Filters are outlined with cobalt selected states. Project tags are small, tracked cobalt labels. Story cards place the artwork above unboxed copy and rise slightly on hover.

Navigation uses a compact brand, plain text links, an active underline, and an outlined contact link. At the mobile breakpoint, `site.js` enables a menu button with expanded state and Escape-to-close focus return. All links remain available without JavaScript. Focus uses a visible 3px cobalt outline with a 5px offset. Shared navigation and orbit controls use at least 44px targets; some route-specific reader controls retain their own sizing.

Desktop masthead introduction motion lasts 0.7 seconds; image hover motion lasts 0.4 seconds with `cubic-bezier(.22,1,.36,1)`. Reduced motion disables CSS animation and transitions. Reader focus, larger type, night mode, filters, learning games, and Three.js controls remain owned by their route scripts.

## Do's and Don'ts

- Do load shared styling after route styling.
- Do retain authored writing, local artwork, accessible controls, and static fallbacks.
- Do use real project previews and identify fictional demonstrations accurately.
- Don’t apply the portfolio theme inside the independently styled Common Ground demo.
- Don’t rely on motion or JavaScript to reveal essential navigation or content.
