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

**Files:** `plaza.js` (viewer + the PLAZA config block), `plaza.css`, `assets/plaza-6516.webp`, `assets/plaza-3258.webp`, `assets/plaza-clouds.png`, `assets/plaza-sky-6516.webp`, `assets/plaza-sky-3258.webp`, `assets/gia-fountain.mp4`, `assets/gia-fountain-poster.jpg`; `index.html` and `mobile/index.html` carry the plaza markup and load `digital-banker/atrium/vendor/three.min.js` + `plaza.js` (`data-base` = path to the root). Fonts are the atrium's. Device gates: Stage 14. Intro video: Stage 22 (`assets/plaza-intro*`). These are the only files of the two pages; nothing else in the repo root or `mobile/` is loaded. `tools/make-sky-mask.py` makes the two sky masks from `assets/plaza-6516.webp` (Pillow + numpy; rerun whenever the panorama changes); the pages do not load it.

**Geometry (measured on the picture):** spanDeg 210, horizonY 1000 (accepted by the user: at 1275 the side facades tilt; at 1000 they stay straight, only the floor rings bend at the edges). Building outlines (`PLAZA.buildings[].outline`) are simple architectural shapes, base y ≈ 1300; every corner is rounded with `PLAZA.cornerRadius` 25 panorama px, and a point may carry its own radius as a third number — the apex of the Digital Banker pediment has 12. Rooftop plants are outside the outlines, trees are inside. 9 facade bands as perspective quads (see PLAZA.buildings). Video: centre x 3186, bottom 1825, height 672 (from the user's template).

**Behaviour:** names engraved by code into the bands (Cinzel 600, ≤ 80% band width, one or two lines — whichever is larger); hover/focus = everything else dimmed 50% + the zone's own outline highlighted (`plaza.css` `.glow`: line #f1cf8c 2 px, fill rgba(255,214,150,.10), glow drop-shadow 6 px and 22 px, `mix-blend-mode: screen`); Gia and the globe are separate zones on the video plane, outlined in the video frame's pixels with the same on-screen corner rounding: Gia — her silhouette in the video's mask (`PLAZA.gia.outline`), the globe — a circle (`PLAZA.fountain`, id `fountain`, label "Glonari"); the fountain bowl is not a zone; the Gia and globe outlines do not overlap (Gia is above the globe in the DOM); when a building is active, Gia and the globe in front of it stay dimmed and cut its outline; click only on a move ≤ 6 px; camera turn + zoom 1.15 s, veil 0.38 s, then href or the placeholder room screen (name, placeholder text, "Back to the plaza"); Back/Esc restores the view; busy flag released by every finished/interrupted animation and by a 4 s safety timer; focus restore after Back does not start a camera move; the building bar at the bottom (below) on both pages; clouds drifting across the sky (below); ‹ › on phones/coarse pointers; keyboard Tab/Enter/Esc/arrows/+− (arrows and +− ignored while the intro video is up, Stage 22); opening turn −29° → 0° over 2.4 s only when the plaza opens without the intro video (Stage 22) — under the intro it opens straight on 0°, the intro's last frame, and under reduced motion there is no turn; reduced motion → poster only, no video request, clouds still; no WebGL → message. `gia-fountain.mp4` loops all the time the page is open (paused only while the tab is hidden).

**Click targets:** Digital Banker → `digital-banker/gia/index.html` (Stage 10), Gia → `meet-gia/index.html`; Glonari Journey, Glonari Pulse, Glonari News, Global Connections, Global Dream, Glonari Commercial, Glonari Homes, Signature Personas, the globe (`PLAZA.fountain`) → placeholder room screen.

### Building bar and hint

On both `index.html` and `mobile/index.html`: `<div id="bar">` at the bottom centre above the safe area (`min(100vw − 32px, 760px)` wide), filled by `plaza.js` from `PLAZA.buildings`.

- **Icons:** 9 identical gold line icons (classical building: pediment + columns, inline SVG `BAR_ICON` in `plaza.js`), one per building left to right; Gia and the globe are not in the bar.
- **Line and dots:** a thin gold line through the centres of 9 dots, one under each icon.
- **Active icon:** the building whose centre is nearest `view.yaw` (the screen centre), recomputed together with the zone outlines (`updateOverlay()`) on every frame in which the camera moves or a highlight changes (`updateBar()` in `tick()`), so it follows drag, inertia, zoom, ‹ ›, keyboard and animations; frames in which only the clouds or Gia's video change skip both. Exception (`barPin`): after a click on an icon or ‹ › onto a building, that building's icon stays active until the visitor moves the camera (drag > 6 px, pinch, wheel, arrow/+− keys, Tab focus on a zone, entering a zone) — at the picture's edges the camera cannot centre Journey / Personas. Active = icon 1.45× and brighter with a glow, its dot 1.7× with a glow.
- **Click on an icon:** `setActive` + `lookAt` — the camera turns to the building and highlights it (50% dim + gold outline), exactly like ‹ ›; it never enters (entering is a click on the building itself). Ignored in a room or during an animation.
- **Hint (`.bar-hint`, Cinzel, spaced capitals, thin gold lines left and right):** `PLAZA.hint` "Drag to see more" / `PLAZA.hintTouch` "Swipe to see more" (coarse pointer); while a zone is hovered or focused it shows the zone's label ("Enter …", "Meet Gia", "Glonari") (instruction §9). `aria-live="polite"`.
- **Visibility:** fades in with `body.ready` (buttons not clickable before it); hidden and not clickable during `body.entering` and `body.in-room`. Reduced motion: no transitions.
- **Keyboard:** the icons are `tabindex="-1"` and the icon row is `aria-hidden`; keyboard access stays on the `#rooms-nav` buttons, so the Tab order is unchanged.
- **Phones:** the bar and ‹ › (vertical centre, instruction §10) do not overlap and drive the same camera.

### Clouds

On both `index.html` and `mobile/index.html`, drawn by `plaza.js` from `PLAZA.clouds` — code, not a video.

- **Layers:** three bands of the same 210° cylinder covering the sky rows y 0…1040 (`bottom`), drawn over the panorama and under Gia (`renderOrder` 1–1.2, Gia 3), without depth test, in the order high → middle → low. Shader: cloud colour (`assets/plaza-clouds.png`, premultiplied) × sky mask × opacity.
- **Sky mask:** `assets/plaza-sky-6516.webp` (6516×1040, computers) or `assets/plaza-sky-3258.webp` (3258×520, phones / small GPUs — chosen by the same check as the panorama); white = sky. Made by `tools/make-sky-mask.py`: pixels close to a smooth model of the sky colour and connected to the picture's top edge; soft edge pulled inside by 1 px (2 px before halving); sampled without mipmaps. So clouds never cover buildings, trees or rooftop plants and show in the gaps between them; sky seen through glass railings and pergola slats is excluded.
- **Placement (`layers`):** each layer cuts the sky into slots of 1050 panorama px (`slot`) and every slot holds one cloud (`density` 1). The clouds are the six clouds of the PNG (`pieces`) in turn, each layer starting at a different one (`seed` 0, 2, 4), so all six appear; each cloud sits at a random place in its slot, every other one mirrored, at scale 1 (larger turns the PNG soft). The whole cloud stays within its layer's band: high y 0…230, middle y 150…380, low y 300…500 (`band`; above y 0 a cloud is cut by the picture's top edge). The layers start a third of a slot apart. A layer's pattern repeats every 18 slots (18 900 px, wider than the picture), so the loop is seamless.
- **Motion:** left to right, high 34, middle 36, low 38 panorama px/s (the slight difference gives a gentle parallax). At 1600×900 the screen is ≈ 3830 panorama px wide, so a cloud crosses it in ≈ 1¾ min (measured ≈ 15 screen px/s). Opacity 0.35 for every layer.
- **Opening view:** about 8 clouds at 1600×900 (6–8 as they move), about 3 at 390×844, spread over the whole sky. The screen's top edge is y ≈ 0 at the centre; on 1600×900 the cylinder lifts it to y ≈ 121 at ±400 px, 225 at ±600 px and 323 at the sides (on 390×844: 0…38), so high clouds towards the sides of a computer screen are partly cut by the top edge. The lowest cloud pixel is ≈ 186 screen px from the top (174 on the phone), the Digital Banker pediment apex at 251 (235 on the phone): clouds stay clear of the roofs (y ≥ ≈ 540).
- **Loading:** after the plaza is shown, without delaying it; fade-in 0.6 s. If either the PNG or the mask fails to load, there are no clouds at all.
- **Frames:** frames in which only the picture changes (clouds, Gia's video) are drawn at most 30 times a second (`fps`); camera moves and highlights are drawn on every frame. The clouds stand still while a room is open. Nothing is drawn while the tab is hidden, and the clouds do not jump on return. Reduced motion: the clouds are shown but stand still, with no continuous redraw.
- The clouds are inside the WebGL canvas, under the SVG overlay: they do not affect hover, clicks, the building bar or the cursor.

### Custom cursor (copy of glonari.com)

On both `index.html` and `mobile/index.html`; shown only under `(hover: hover) and (pointer: fine)`, so phones and tablets have none (a mouse in a narrow window, sent to `mobile/`, still gets it).

- **Markup:** `<div class="gg-dot">` then `<div class="gg-ring">` (both `aria-hidden`) at the end of `<body>`; order matters for `.gg-dot.is-hot ~ .gg-ring`.
- **CSS (`plaza.css`):** glonari.com's `.gg-dot`/`.gg-ring` rules as is — 8 px gold dot with navy edge and glow, 30 px navy ring 1.5 px, `.is-hot` dot 52 px translucent with gold border and the ring faded, `.is-away` hides both. The native cursor is `none` over `#stage` (also while dragging) and over the intro layer `#intro` (Stage 22), and `pointer` over a zone (`#stage.pointing`) and over the intro's "Enter the plaza" button. Reduced motion: no dot size transition.
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
- [x] Clouds, 1600×900 and 390×844: only over the sky — behind buildings, trees and rooftop plants, also in the gaps; translucent; all six clouds of the PNG in three height bands; about 8 clouds on the opening view at 1600×900, about 3 at 390×844; drifting left to right in a seamless loop, crossing a 1600 px screen in ≈ 1¾ min; on the opening view clear of the roofs and the Digital Banker pediment; phones load the small mask.
- [x] Frames with only clouds / video: ≤ 30 a second. Zone outlines and the bar are not recomputed while the camera stands still. Outlines match the buildings after a window resize, after browser Back from Digital Banker and after leaving a room. Hover dim + gold outline unchanged while the clouds move.
- [x] Clouds stand still while a room is open. Reduced motion: clouds still, 0 redraws while idle.
- [x] Mouse/trackpad, Chrome 1600×900: over the sky — dot + trailing 30 px ring, no native cursor; over a building / Gia / the globe — native hand inside the 52 px circle, ring hidden; leaving the zone — smooth return. Zone highlight, clicks and drag work as before.
- [x] Phone 390×844: no cursor elements shown.
- [ ] Manual check of the video in real Chrome / Safari (automated: Playwright Chromium with SwiftShader).
- [ ] Manual check on a real iPhone / Android phone.

**Status:** implemented — pending manual approval.

---

## Stage 22 — Intro video before the plaza (desktop and mobile)

**Objective:** on the first visit in a browser tab, a short video intro over the plaza that dissolves into the plaza's opening view. Only the idea is taken from glonari.com; none of its files or video.

**Files:** `assets/plaza-intro.mp4` (1280×720) + `assets/plaza-intro-poster.webp` on `index.html`; `assets/plaza-intro-mobile.mp4` (720×1280) + `assets/plaza-intro-mobile-poster.webp` on `mobile/index.html`. H.264, 24 fps, 6.5 s, no audio track; the last 0.5 s is a still frame that matches the plaza's opening view (yaw 0). Code: an inline `<head>` script and the `#intro` markup in both pages, the intro block at the top of `plaza.js` (before the plaza's own code, independent of three.js), the `#intro` rules in `plaza.css`.

**Behaviour:**
- **Whether to show:** the inline `<head>` script, right after the device gate, puts `.intro` on `<html>` only when `prefers-reduced-motion: reduce` is off and `sessionStorage['plaza-intro-seen']` is not set (a sessionStorage error → no intro). Decided before the first paint, so a skipped intro never flashes. Without `.intro` the layer is `display: none`, `plaza.js` removes it and none of the intro's files is requested.
- **Layer:** `<div id="intro">` first in `<body>`, `position: fixed; inset: 0; z-index: 80` — over everything of the plaza (at most 5), under the custom cursor (90). The poster is the layer's background image (inline style, `cover`), so it is fetched only when the layer is shown. `<video muted autoplay playsinline preload="auto">` covers the screen (`object-fit: cover`), plays once, not looped; `plaza.js` sets its `src` from the layer's `data-video`.
- **The plaza underneath:** loads and starts as usual (picture, Gia's video, clouds), so it is working by the end of the dissolve. Under the intro it opens straight on the opening view (yaw 0, the intro's last frame) without the opening turn. While the intro is up, everything behind it is `inert` (Tab reaches only the button) and the plaza ignores the arrow and +− keys.
- **Button "Enter the plaza →" (`#intro-enter`):** visible from the start, works as "Skip". Cinzel 600, spaced capitals, always one line; gold #f1cf8c text and 1 px border on a dark translucent blurred backing; hover/focus — the glow of the zone outlines, the arrow moves 4 px right; focus-visible outline. Bottom right on a computer; in the windows `mobile/index.html` is shown in (`max-width: 767px` or narrower than 3:2, the device gate's condition) bottom centre, below the fountain and Gia; both above the safe area. With a mouse the native cursor is hidden over the layer and the custom dot is shown; over the button — the hand inside the 52 px dot.
- **End:** when the video ends or on the button — `sessionStorage['plaza-intro-seen'] = '1'`, the layer dissolves (`opacity`, 1.1 s) and is then removed from the page (the video's `src` dropped); `.intro` comes off `<html>` and `inert` off the plaza.
- **Failure:** `play()` rejected (autoplay blocked), a video `error`, or no `playing` within 3 s → the layer is removed at once, without the dissolve and without setting the flag; the plaza opens as usual (with the opening turn if it is shown after that).
- **Once per tab:** the flag is shared by both pages, so a gate redirect desktop ↔ mobile and coming back to the plaza from a sub-site in the same tab show no intro. A reload during the intro, or a gate redirect before it has ended, shows it again (the flag is not set yet). A new tab shows it again.
- **Reduced motion:** no intro, none of its files requested; the plaza opens at once (no opening turn).

**Acceptance criteria:**
- [x] 1920×1080: video → dissolve 1.1 s → layer removed, flag set; the last frame matches the plaza's opening view; the plaza and Gia are working underneath; the building bar fades in during the dissolve.
- [x] 1920×1080: the button at the bottom right, one line, from the first second; a click starts the dissolve and sets the flag; Tab reaches only the button; arrow keys do not move the camera under the intro.
- [x] 390×844 and 540×960 (touch emulation): the full path; the last frame matches the opening view; the button at the bottom centre, one line, below the fountain and Gia; a tap starts the dissolve.
- [x] Reload in the same tab: no intro, the opening turn runs. Gate desktop → mobile and mobile → desktop after the intro: no intro.
- [x] Reduced motion: no intro, no request for its files. Video load fails / autoplay blocked: the layer removed at once, flag not set, the plaza works.
- [ ] Manual check on a real iPhone / Android phone (including the safe area) and in real Chrome / Safari.

**Status:** implemented — pending manual check.
