(() => {
  'use strict';

  // ===================================================================
  // Mobile page script.
  //
  // 2026-10-24: the mobile Campus (opening video, loop, swipe/pan, 11 tap
  // zones, name tag, edge plates, black exit fade) was removed —
  // DEVELOPMENT_PLAN.md Stage 20 / PRODUCT_REQUIREMENTS.md §30 are marked
  // SUPERSEDED.
  //
  // What stays: the shared section modal (../section-modal.js) and its
  // mobile-only corner ×.
  // ===================================================================

  if (!window.SectionModal) return;

  const sectionModal = window.SectionModal.create({
    overlay: document.getElementById('modal-overlay'),
    card: document.getElementById('modal-card'),
    title: document.getElementById('modal-title'),
    desc: document.getElementById('modal-desc'),
    closeBtn: document.getElementById('modal-close'),
    onOpen: () => {
      document.body.classList.add('modal-active');
      document.getElementById('modal-card').scrollTop = 0;
    },
    onClose: () => {
      document.body.classList.remove('modal-active');
    },
  });

  const modalX = document.querySelector('#modal-card .modal-x');
  if (modalX && sectionModal) modalX.addEventListener('click', () => sectionModal.close());
})();
