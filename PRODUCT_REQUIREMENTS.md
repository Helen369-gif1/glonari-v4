# Glonari Global Scene — Product Requirements Document

Companion document: [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)

This document describes the project as it is now. Section numbers are kept as they were assigned; sections that no longer describe anything in the project have been removed, so the numbering has gaps. History lives in git.

---

## 1. Product overview

Glonari Global Scene is the Glonari first screen: the Glonari Plaza, a 210° panorama of nine buildings in an arc with Gia on the fountain in front of them, built on the Digital Banker atrium technology. The visitor looks around, hovers or taps a building, and enters it. Digital Banker and Gia lead into the connected sub-sites (Digital Banker → GIA → Atrium → Global Reserve / Global Dream; Meet Gia); the other buildings and the fountain open a placeholder room screen.

## 2. Product goals

- One first screen for desktop and phones (§31), with the same zones and click targets.
- A smooth path from the plaza into the connected sub-sites and back (§14).

## 3. Current state of the project

Static site, no build step. Entry points: `index.html` (desktop) and `mobile/index.html` (phones and narrow windows, §19), both showing the plaza (`plaza.js`, `plaza.css`, `assets/plaza-*.webp`, `assets/gia-fountain.*`, three.js from `digital-banker/atrium/vendor/`). Sub-sites in their own folders: `digital-banker/` (GIA, Atrium), `global-reserve/`, `global-dream/`, `meet-gia/` — each governed by its own project files.

## 4. Existing technical structure

Plain HTML/CSS and vanilla JavaScript; no framework, bundler or package manifest. `plaza.js` renders the 210° cylindrical panorama with three.js r128 (the atrium's local `vendor/three.min.js`), engraves the building names, plays Gia on the fountain and draws the 11 zones as an SVG overlay. The PLAZA config block in `plaza.js` holds the picture, geometry, zones and click targets.

## 6. Main user experience

The page opens on the plaza with a short opening turn. The visitor drags (or uses ‹ › on touch, arrows on the keyboard) to look around; hovering or focusing a zone dims the rest and outlines it in gold; a click or tap turns the camera to the zone and enters it.

## 7. Functional requirements

- FR-1: Show the plaza on desktop and on phones (§31).
- FR-2: 11 interactive zones — 9 buildings, Gia, the fountain — with hover/focus highlight and keyboard access.
- FR-3: Digital Banker and Gia navigate to their sub-sites; the other zones open a placeholder room screen with "Back to the plaza".
- FR-4: Reduced-motion support (§21).
- FR-5: Phones and narrow windows are routed to `mobile/` and back (§19).

## 14. Click behavior: the Digital Banker chain

- Plaza → Digital Banker → `digital-banker/gia/index.html`; Plaza → Gia → `meet-gia/index.html`.
- GIA: scroll-scrubbed video, played from an in-memory copy so seeking is local; shorter scroll on touch devices (4 screens). It hands off to the Atrium at the bottom of the scroll or 2.5 s after the final frame is shown, through a short dark veil; the Atrium's assets are prefetched during the scroll. Back link → the plaza.
- Atrium (`digital-banker/atrium/`): dark entry veil lifted once the hall is ready; the Global Reserve and Global Dream doorways navigate to `global-reserve/` and `global-dream/`; the other four doorways open placeholder rooms. Back link → GIA.
- Global Reserve and Global Dream: dark entry veil on arrival; header back arrow → the Atrium.
- Meet Gia: hero frames load coarse to fine (fewer frames on phones); back link "← Glonari" → the plaza.
- Every back link is an explicit URL, not `history.back()`. The browser Back button always returns to a working page (no veil left on).

See DEVELOPMENT_PLAN.md Stage 10 for values.

## 15. Copy

All user-facing text — zone names, captions, room screens, labels — is in English, regardless of the language a request or code comment is written in.

## 16. Animation and transition requirements

Motion is smooth, soft and eased — never abrupt.

## 19. Mobile/touch considerations

- Phones get the same plaza as desktop (§31), on `mobile/index.html`, with swipe and ‹ › buttons and the half-size picture.
- Device gates: the root page sends a window under 768 px wide or narrower than 3:2 to `mobile/` (on load and live on resize/rotation); `mobile/` sends it back only when the window is at least 768 px and 3:2 **and** has a mouse/trackpad (`(hover: hover) and (pointer: fine)`), so a phone in landscape stays on `mobile/`. See DEVELOPMENT_PLAN.md Stage 14.

## 21. Reduced-motion requirements

Every animation respects `prefers-reduced-motion: reduce`. On the plaza: poster only, no video request, no cursor size transition, the cursor ring follows without lag.

## 22. Technical constraints

- Vanilla JavaScript; no framework or build tooling.
- The sub-site folders (`digital-banker/`, `global-dream/`, `global-reserve/`, `meet-gia/`) have their own rules and specs.

## 23. Confirmed requirements

- First screen (desktop and mobile) is the Glonari Plaza 210° (§31): atrium technology, 9 buildings + Gia + fountain as zones, placeholder room screen for the buildings without a target.
- Chain: Plaza → GIA → Atrium → Global Reserve or Global Dream; Gia → Meet Gia; explicit back links (§14).
- All user-facing copy in English (§15).
- Vanilla JavaScript, no build step (§22).

## 24. Open questions

1. Manual check in real Chrome / Safari and on a real iPhone / Android phone.
2. Real copy for the placeholder room screens.

## 31. Glonari Plaza 210° — first screen, desktop and mobile

Source: DEVELOPMENT_PLAN.md Stage 21.

- **Technology:** the Digital Banker atrium (210° cylindrical panorama, three.js r128), per "Технологическая инструкция Атриум 210". One script `plaza.js` for desktop (`index.html`) and phones (`mobile/index.html`).
- **Picture:** 6516×2172, 9 buildings left to right: Glonari Journey, Glonari Pulse, Glonari News, Global Connections, Digital Banker (centre), Global Dream, Glonari Commercial, Glonari Homes, Signature Personas. horizonY 1000, span 210° (both confirmed by the user).
- **Names:** engraved by code into the blank facade bands (Cinzel, atrium engraving).
- **Zones:** 9 buildings + Gia + the fountain; hover = 50% dim + gold outline along the zone's own outline; click ≤ 6 px.
- **Click targets:** Digital Banker → `digital-banker/gia/index.html`; Gia → `meet-gia/index.html`; all other buildings and the fountain → placeholder room screen with "Back to the plaza". No new links.
- **Gia on the fountain:** `assets/gia-fountain.mp4` (double colour/alpha video) at the floor circle below the steps, placed by the user's template (centre x 3186, bottom 1825, height 672); loops all the time the visitor is on the page.
- **Phones:** same plaza, swipe, ‹ › buttons, half-size picture.
- **Open:** manual check in real browsers and on real phones.

### Custom cursor

- With a mouse/trackpad (on `index.html`, and on `mobile/index.html` when a narrow desktop window is sent there) the plaza uses an exact copy of the glonari.com cursor: a small gold dot on the mouse and a 30 px navy ring that trails it.
- Over the panorama the system cursor is hidden ("circle in a circle"); over a building, Gia or the fountain the dot opens into a 52 px gold circle around the system hand and the ring fades ("hand in a circle").
- Leaving the page hides both; reduced motion — the ring follows without lag, no size animation.
- Phones and other touch devices: no cursor.
