# Glonari Global Scene — Development Plan

Companion document: [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md)

This plan describes the project as it is now. Stage numbers are kept as they were assigned; stages that no longer describe anything in the project have been removed, so the numbering has gaps. History lives in git.

---

## Stage 10 — Click interactions: the Digital Banker chain

**Objective:** the first screen's Digital Banker and Gia zones lead into the connected sub-sites; each sub-site can lead back.

**Chain:** Plaza (`index.html` / `mobile/index.html`, Stage 21) → Digital Banker → `digital-banker/gia/index.html` → `digital-banker/atrium/index.html` → Global Reserve (`global-reserve/index.html`) or Global Dream (`global-dream/index.html`). Gia on the plaza → `meet-gia/index.html`. Every back link is an explicit URL, never `history.back()`.

**GIA (`digital-banker/gia/index.html`):**
- Scroll-scrubbed video. The script fetches the whole clip and plays it from an in-memory blob URL (falls back to the plain file URL without fetch/Blob or on a fetch error); a 2px gold `#loading` line shows progress; until the clip has loaded the poster stays and the text timeline still follows the scroll. `tick()` issues one seek at a time.
- Scroll length: mouse/trackpad `PX_PER_SECOND` 620, `HOLD_SHARE` 0.15; touch (`(pointer: coarse)`) `TOUCH_SCROLL_SCREENS` 4 viewport heights, `TOUCH_HOLD_SHARE` 0.05. The base height is re-read only when the viewport width changes.
- Hand-off to the atrium: at the bottom of the scroll (`ADVANCE_AT` 0.999, then `ADVANCE_DELAY_MS` 250), or `FINAL_FRAME_ADVANCE_MS` (2500) after the final frame is actually displayed (scrolling back cancels; returning restarts the full 2.5 s; never in `#t=` review mode). Both go through `#exit-veil` (solid `#1c1005`, `EXIT_VEIL_MS` 200); `navigating` prevents a double navigation.
- Atrium assets are prefetched at `ATRIUM_PREFETCH_AT` (0.2) of the scroll.
- bfcache restore (`pageshow`, `persisted`): veil lifted, timers cleared, final-frame advance disarmed until the visitor scrolls off the final frame.
- `.back-link` → `../../index.html`.

**Atrium (`digital-banker/atrium/`):** 210° three.js panorama, six doorways. `#gia-entry-veil` (solid `#1c1005`, opaque on first paint) fades out over `VEIL_OUT_MS` 250 once `atrium.js` sets `body.ready`, or after `MAX_HOLD_MS` 1200 / an error in `#status`. Global Reserve doorway → `../../global-reserve/index.html`, Global Dream doorway → `../../global-dream/index.html` (camera push-in, then the atrium's dark `#veil`, then navigation); the other four doorways open placeholder rooms. A `pageshow` handler resets the atrium after a bfcache restore. `.back-link` → `../gia/index.html`, shown after `body.ready`, hidden during `body.entering` / `body.in-room`.

**Global Reserve / Global Dream:** each has `#entry-veil` (solid `#1c1005`, opaque on first paint, held 90 ms, faded over 300 ms, then removed) and a header back arrow to the atrium (`.site-header__back` / `.gd-header__back` → `../digital-banker/atrium/index.html`). Global Reserve's Screen 1 scroll hint (`#scroll-cue`) fades with the screen's own scroll progress. `global-dream/` is the standalone project's current version.

**Meet Gia (`meet-gia/`):** hero frames load coarse to fine with at most 6 requests at once; on phones (`max-width: 900px` or `pointer: coarse`) every 2nd frame, every 4th with Save-Data; the section 03 video is `preload="none"` and starts buffering one screen before it is visible. Back link "← Glonari" → `../index.html`.

**Acceptance criteria:**
- [x] Plaza → Digital Banker → GIA → Atrium → Global Reserve / Global Dream, and every back link, land on the right page (Playwright).
- [x] Browser Back from any step shows a working page (no veil left on).
- [ ] Manual check on a real iPhone.

**Status:** implemented — pending real-device check.

---

## Stage 14 — Mobile / touch behavior: device gates

**Objective:** phones and narrow windows get `mobile/index.html`, everything else the root page. Both pages show the same plaza (Stage 21).

**Forward gate (`index.html`, inline `<head>` script right after `<meta viewport>`, before any stylesheet):** `matchMedia('(max-width: 767px), not all and (min-aspect-ratio: 3/2)')` — checked once on load and live via the same `MediaQueryList`'s `'change'` event, debounced 300 ms; redirects with `location.replace('mobile/index.html')` (no back-button entry).

**Reverse gate (`mobile/index.html`):** `(min-width: 768px) and (min-aspect-ratio: 3/2) and (hover: hover) and (pointer: fine)` — the width/aspect part is the exact negation of the forward gate, so there is no ping-pong at the boundary; the hover/pointer part keeps touch devices (e.g. a phone in landscape) on `mobile/`. Checked on load and live, same 300 ms debounce; redirects to `../index.html`.

**Known:** a phone in landscape wider than 3:2 and ≥ 768 px stays on the root page (same plaza). With JavaScript off, the root page is shown.

**Acceptance criteria:**
- [x] 390×844 → `mobile/`; 1600×900 stays on the root page; resizing a desktop window narrow redirects; a mouse window widened on `mobile/` returns to the root page; a touch device rotated to landscape stays on `mobile/`.
- [ ] Manual check on a real iPhone / Android phone.

**Status:** implemented — pending real-device check.

---

## Stage 21 — Glonari Plaza 210° (first screen, desktop and mobile)

**Objective:** the first screen is the plaza picture (6516×2172, 9 buildings in an arc) on the Digital Banker atrium technology ("Технологическая инструкция Атриум 210", `digital-banker/atrium/atrium.js`). Phones get the same plaza.

**Files:** `plaza.js` (viewer + the PLAZA config block), `plaza.css`, `assets/plaza-6516.webp`, `assets/plaza-3258.webp`, `assets/gia-fountain.mp4`, `assets/gia-fountain-poster.jpg`; `index.html` and `mobile/index.html` carry the plaza markup and load `digital-banker/atrium/vendor/three.min.js` + `plaza.js` (`data-base` = path to the root). Fonts are the atrium's. Device gates: Stage 14. These are the only files of the two pages; nothing else in the repo root or `mobile/` is loaded.

**Geometry (measured on the picture):** spanDeg 210, horizonY 1000 (accepted by the user: at 1275 the side facades tilt; at 1000 they stay straight, only the floor rings bend at the edges). Building outlines (`PLAZA.buildings[].outline`) are simple architectural shapes, base y ≈ 1300; every corner is rounded with `PLAZA.cornerRadius` 25 panorama px, and a point may carry its own radius as a third number — the apex of the Digital Banker pediment has 12. Rooftop plants are outside the outlines, trees are inside. 9 facade bands as perspective quads (see PLAZA.buildings). Video: centre x 3186, bottom 1825, height 672 (from the user's template).

**Behaviour:** names engraved by code into the bands (Cinzel 600, ≤ 80% band width, one or two lines — whichever is larger); hover/focus = everything else dimmed 50% + the zone's own outline highlighted (`plaza.css` `.glow`: line #f1cf8c 2 px, fill rgba(255,214,150,.10), glow drop-shadow 6 px and 22 px, `mix-blend-mode: screen`); Gia and the globe are separate zones on the video plane, outlined in the video frame's pixels with the same on-screen corner rounding: Gia — her silhouette in the video's mask (`PLAZA.gia.outline`), the globe — a circle (`PLAZA.fountain`, id `fountain`, label "Glonari"); the fountain bowl is not a zone; the Gia and globe outlines do not overlap (Gia is above the globe in the DOM); when a building is active, Gia and the globe in front of it stay dimmed and cut its outline; click only on a move ≤ 6 px; camera turn + zoom 1.15 s, veil 0.38 s, then href or the placeholder room screen (name, placeholder text, "Back to the plaza"); Back/Esc restores the view; busy flag released by every finished/interrupted animation and by a 4 s safety timer; focus restore after Back does not start a camera move; the building bar at the bottom (below) on both pages; ‹ › on phones/coarse pointers; keyboard Tab/Enter/Esc/arrows/+−; opening turn −29° → 0° over 2.4 s; reduced motion → poster only, no video request; no WebGL → message. `gia-fountain.mp4` loops all the time the page is open (paused only while the tab is hidden).

**Click targets:** Digital Banker → `digital-banker/gia/index.html` (Stage 10), Gia → `meet-gia/index.html`; Glonari Journey, Glonari Pulse, Glonari News, Global Connections, Global Dream, Glonari Commercial, Glonari Homes, Signature Personas, the globe (`PLAZA.fountain`) → placeholder room screen.

### Building bar and hint

On both `index.html` and `mobile/index.html`: `<div id="bar">` at the bottom centre above the safe area (`min(100vw − 32px, 760px)` wide), filled by `plaza.js` from `PLAZA.buildings`.

- **Icons:** 9 identical gold line icons (classical building: pediment + columns, inline SVG `BAR_ICON` in `plaza.js`), one per building left to right; Gia and the globe are not in the bar.
- **Line and dots:** a thin gold line through the centres of 9 dots, one under each icon.
- **Active icon:** the building whose centre is nearest `view.yaw` (the screen centre), recomputed after every rendered frame (`updateBar()` in `tick()`), so it follows drag, inertia, zoom, ‹ ›, keyboard and animations. Exception (`barPin`): after a click on an icon or ‹ › onto a building, that building's icon stays active until the visitor moves the camera (drag > 6 px, pinch, wheel, arrow/+− keys, Tab focus on a zone, entering a zone) — at the picture's edges the camera cannot centre Journey / Personas. Active = icon 1.45× and brighter with a glow, its dot 1.7× with a glow.
- **Click on an icon:** `setActive` + `lookAt` — the camera turns to the building and highlights it (50% dim + gold outline), exactly like ‹ ›; it never enters (entering is a click on the building itself). Ignored in a room or during an animation.
- **Hint (`.bar-hint`, Cinzel, spaced capitals, thin gold lines left and right):** `PLAZA.hint` "Drag to see more" / `PLAZA.hintTouch` "Swipe to see more" (coarse pointer); while a zone is hovered or focused it shows the zone's label ("Enter …", "Meet Gia", "Glonari") (instruction §9). `aria-live="polite"`.
- **Visibility:** fades in with `body.ready` (buttons not clickable before it); hidden and not clickable during `body.entering` and `body.in-room`. Reduced motion: no transitions.
- **Keyboard:** the icons are `tabindex="-1"` and the icon row is `aria-hidden`; keyboard access stays on the `#rooms-nav` buttons, so the Tab order is unchanged.
- **Phones:** the bar and ‹ › (vertical centre, instruction §10) do not overlap and drive the same camera.

### Custom cursor (copy of glonari.com)

On both `index.html` and `mobile/index.html`; shown only under `(hover: hover) and (pointer: fine)`, so phones and tablets have none (a mouse in a narrow window, sent to `mobile/`, still gets it).

- **Markup:** `<div class="gg-dot">` then `<div class="gg-ring">` (both `aria-hidden`) at the end of `<body>`; order matters for `.gg-dot.is-hot ~ .gg-ring`.
- **CSS (`plaza.css`):** glonari.com's `.gg-dot`/`.gg-ring` rules as is — 8 px gold dot with navy edge and glow, 30 px navy ring 1.5 px, `.is-hot` dot 52 px translucent with gold border and the ring faded, `.is-away` hides both. The native cursor is `none` over `#stage` (also while dragging) and `pointer` over a zone (`#stage.pointing`). Reduced motion: no dot size transition.
- **JS (`plaza.js`, runs only when both divs exist and the pointer is fine):** `requestAnimationFrame` loop; the dot at the mouse (`translate(x, y) translate(-50%, -50%)`), the ring trailing by 0.18 per frame (1 under reduced motion); `.is-hot` set by the same mouse check over `path[data-room]` that turns the zone highlight on, cleared when the highlight goes off and on entering a zone (keyboard focus does not set it); `.is-away` on `pointerleave` / `pointerenter` of the page.

**Acceptance criteria:**
- [x] 1600×900: loads, no console errors, no 404; all 11 zones present.
- [x] Building bar, 1600×900 and 390×844: 9 icons, line through the dots, hint "Drag to see more" / "Swipe to see more"; on hover/focus the hint shows "Enter …" / "Meet Gia" / "Glonari".
- [x] The active icon follows drag, inertia, zoom and ‹ ›; a click on an icon turns to and highlights its building without entering, and its icon (Journey and Personas included) stays active until the visitor moves the camera; the bar hides on entering and in a room and returns after Back/Esc; Tab order unchanged; on 390×844 the bar and ‹ › do not overlap.
- [x] 10 cycles enter → Back/Esc → drag → next enter without a lock-up.
- [x] A 10 px move on a zone does not enter it.
- [x] Left and right edges: Journey and Signature Personas reachable and enterable.
- [x] Digital Banker / Gia navigate to their targets; browser Back returns to a working plaza (no veil left on).
- [x] Phone 390×844 (root redirects to `mobile/`): small WebP, ‹ › step through zones, tap enters, Back works.
- [x] Reduced motion: no video request. No WebGL: readable message.
- [x] Mouse/trackpad, Chrome 1600×900: over the sky — dot + trailing 30 px ring, no native cursor; over a building / Gia / the globe — native hand inside the 52 px circle, ring hidden; leaving the zone — smooth return. Zone highlight, clicks and drag work as before.
- [x] Phone 390×844: no cursor elements shown.
- [ ] Manual check of the video in real Chrome / Safari (automated: Playwright Chromium with SwiftShader).
- [ ] Manual check on a real iPhone / Android phone.

**Status:** implemented — pending manual approval.
