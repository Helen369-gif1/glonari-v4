(() => {
  'use strict';

  // ===================================================================
  // Root page script.
  //
  // 2026-10-24: the old Campus scene (opening video, loop, 11 SVG
  // hotspots, hover label, custom cursor, "Explore" hint, black exit fade)
  // was removed — DEVELOPMENT_PLAN.md Stage 19/20 and
  // PRODUCT_REQUIREMENTS.md §29/§30 are marked SUPERSEDED. Its click
  // targets are recorded there for the new plaza.
  //
  // What stays: the shared section modal (section-modal.js), wired to the
  // #modal-overlay markup in index.html.
  // ===================================================================

  if (!window.SectionModal) return;

  window.SectionModal.create({
    overlay: document.getElementById('modal-overlay'),
    card: document.getElementById('modal-card'),
    title: document.getElementById('modal-title'),
    desc: document.getElementById('modal-desc'),
    closeBtn: document.getElementById('modal-close'),
    onOpen: () => {
      document.body.classList.add('modal-active');
    },
    onClose: () => {
      document.body.classList.remove('modal-active');
    },
  });
})();
