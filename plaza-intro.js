/* ======================================================================
   INTRO VIDEO before the plaza (DEVELOPMENT_PLAN.md Stage 22 /
   PRODUCT_REQUIREMENTS.md §32), and the loader of the plaza itself.
   Shared by index.html and mobile/index.html; the <script> tag's data-base
   is the path prefix to the repo root. Loaded right after the #intro layer,
   so the video starts while the rest of the page is still being parsed.

   The inline script in the page's <head> puts .intro on <html> only once per
   tab and never under reduced motion. Under the intro, three.js and plaza.js
   are requested only once the video plays (or 1.5 s after its src is set, or
   at once if the intro ends early), so they do not share the network with the
   video's first seconds; without the intro, as soon as the page is parsed.
   The layer dissolves in 1.1 s when the video ends or on "Enter the plaza" —
   only then is the tab marked as having seen it — but not before the plaza is
   ready (the video holds its last frame meanwhile; a pressed button fades out
   and stops reacting); it is then removed. A video that does not start is
   skipped at once. 'plaza-intro-over' on document tells plaza.js when the
   dissolve starts or the intro is skipped: Gia's video and the clouds wait
   for it.
   ====================================================================== */
(() => {
  'use strict';
  const BASE = (document.currentScript && document.currentScript.dataset.base) || '';
  const root = document.documentElement, intro = document.getElementById('intro');

  /* ---------- the plaza: three.js, then plaza.js, after the page is parsed ---------- */
  let release;
  const gate = new Promise((r) => { release = r; });
  const parsed = new Promise((r) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', r, { once: true });
    else r();
  });
  Promise.all([gate, parsed]).then(() => {
    ['digital-banker/atrium/vendor/three.min.js', 'plaza.js'].forEach((p) => {
      const s = document.createElement('script');
      s.src = BASE + p; s.async = false;   // run in this order, like the parser would
      s.dataset.base = BASE;
      s.onerror = () => { document.getElementById('status').textContent = 'The plaza did not load. Check your connection, then reload the page.'; };
      document.body.appendChild(s);
    });
  });

  if (!intro || !root.classList.contains('intro')) { if (intro) intro.remove(); release(); return; }

  /* ---------- the intro ---------- */
  const FADE = 1100, START_LIMIT = 3000, PLAZA_DELAY = 1500;
  const video = intro.querySelector('video'), enter = document.getElementById('intro-enter');
  // the rest of the page is parsed after this script: it is shut once it is there
  let behind = [];
  parsed.then(() => {
    if (!intro.isConnected) return;
    behind = [...document.body.children].filter((el) => el !== intro && el.tagName !== 'SCRIPT');
    behind.forEach((el) => { el.inert = true; });
  });
  // the plaza is ready, or has shown why it cannot be (#status)
  const settled = () => document.body.classList.contains('ready') || !!document.getElementById('status').textContent;
  function whenPlazaSettled(fn) {
    parsed.then(() => {
      if (settled()) { fn(); return; }
      const watch = new MutationObserver(() => { if (settled()) { watch.disconnect(); fn(); } });
      watch.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true, characterData: true });
    });
  }
  let done = false;
  const over = () => document.dispatchEvent(new Event('plaza-intro-over'));
  function remove() {
    video.removeAttribute('src'); video.load();
    intro.remove();
    root.classList.remove('intro');
    behind.forEach((el) => { el.inert = false; });
  }
  function finish(seen) {
    if (done) return;
    done = true; clearTimeout(startTimer);
    release();
    const dot = document.querySelector('.gg-dot');
    if (dot) dot.classList.remove('is-hot');
    if (!seen) { remove(); over(); return; }
    try { sessionStorage.setItem('plaza-intro-seen', '1'); } catch (e) {}
    whenPlazaSettled(() => {
      over();
      intro.classList.add('out');
      setTimeout(remove, FADE);
    });
  }
  const startTimer = setTimeout(() => finish(false), START_LIMIT);
  setTimeout(release, PLAZA_DELAY);
  video.addEventListener('playing', () => { clearTimeout(startTimer); release(); }, { once: true });
  video.addEventListener('ended', () => finish(true));
  video.addEventListener('error', () => finish(false));
  // the press is taken at once: the button fades out, even while the plaza is still loading
  enter.addEventListener('click', () => { enter.classList.add('pressed'); enter.disabled = true; finish(true); });
  // the custom cursor's dot comes later in the page
  enter.addEventListener('pointerenter', () => { const dot = document.querySelector('.gg-dot'); if (dot) dot.classList.add('is-hot'); });
  enter.addEventListener('pointerleave', () => { const dot = document.querySelector('.gg-dot'); if (dot) dot.classList.remove('is-hot'); });
  video.src = intro.dataset.video;
  video.play().catch(() => finish(false));
})();
