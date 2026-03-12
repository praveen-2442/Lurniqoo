(function () {
  'use strict';

  /* ─── HELPERS ─────────────────────────────── */
  const el  = id => document.getElementById(id);
  const qs  = sel => document.querySelector(sel);

  function scrollToTop() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ─── STATE ───────────────────────────────── */
  const state = { dept: null, year: null, sem: null };

  /* ─── VIEW IDs ────────────────────────────── */
  const ALL_VIEWS = [
    'view-home',
    'view-anu',
    'view-btech',
    'view-dept-year',
    'view-dept-sem',
    'view-dept-subjects',
    'view-about',
    'view-notifications'
  ];

  /* ─── ACTIVE SIDE LINK ────────────────────── */
  function updateSideLink(route) {
    document.querySelectorAll('.side-link').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
  }

  /* ─── SET ACTIVE VIEW ─────────────────────── */
  function setActiveView(viewId, sideRoute) {
    ALL_VIEWS.forEach(id => {
      const v = el(id);
      if (v) {
        v.classList.toggle('active', id === viewId);
      }
    });

    const isHome = viewId === 'view-home';
    document.body.classList.toggle('mode-anu', !isHome);

    updateSideLink(sideRoute || null);
    scrollToTop();
  }

  /* ─── NAV ACTIONS ─────────────────────────── */
  function goHome() {
    setActiveView('view-home', 'home');
  }

  function goAbout() {
    setActiveView('view-about', 'about');
    initReveal();
  }

  function goNotifications() {
    setActiveView('view-notifications', 'notifications');
    initReveal();
  }

  function goANU() {
    setActiveView('view-anu', 'syllabus');
  }

  function goBTech() {
    setActiveView('view-btech', 'syllabus');
  }

  function goDept(dept) {
    state.dept = dept;
    el('dept-year-heading').textContent = dept + ' — Select Year';
    // reset radios
    document.querySelectorAll('input[name="year"]').forEach(r => r.checked = false);
    setActiveView('view-dept-year', 'syllabus');
  }

  function goSem() {
    el('dept-sem-heading').textContent = state.dept;
    el('dept-year-label').textContent = state.year + ' Year';
    // reset radios
    document.querySelectorAll('input[name="semester"]').forEach(r => r.checked = false);
    setActiveView('view-dept-sem', 'syllabus');
  }

  function goSubjects() {
    el('subjects-title').textContent =
      `${state.dept} — ${state.year} Year — Sem ${state.sem}`;
    setActiveView('view-dept-subjects', 'syllabus');
    renderSubjects();
  }

  /* ─── SUBJECT DATA ────────────────────────── */
  const SUBJECT_URLS = {
    'AIML|1st|1': {
      'Mathematics – I':       '',
      'Physics':               '',
      'Basic Electrical Engg': '',
      'Engineering Graphics':  '',
      'C Programming':         ''
    },
    'AIML|1st|2': {
      'Mathematics – II': '',
      'Chemistry':        '',
      'English':          '',
      'Digital Electronics': '',
      'Python':           '',
      'Environmental Science': ''
    },
    'CSE|1st|1': {
      'Mathematics – I':       '',
      'Physics':               '',
      'Basic Electrical Engg': '',
      'Engineering Graphics':  '',
      'C Programming':         ''
    },
    'CSE|1st|2': {
      'Mathematics – II': '',
      'Chemistry':        '',
      'English':          '',
      'Digital Electronics': '',
      'Python':           '',
      'Environmental Science': ''
    }
  };

  function renderSubjects() {
    const grid = el('subjects-grid');
    grid.innerHTML = '';

    const key      = `${state.dept}|${state.year}|${state.sem}`;
    const subjects = SUBJECT_URLS[key];

    if (!subjects || Object.keys(subjects).length === 0) {
      grid.innerHTML =
        '<p class="no-subjects">No subjects available yet for this selection.</p>';
      return;
    }

    Object.entries(subjects).forEach(([name, url]) => {
      const btn = document.createElement('button');
      btn.className   = 'subject-card';
      btn.textContent = name;
      btn.dataset.url = url;
      grid.appendChild(btn);
    });
  }

  /* ─── SUBJECT VIEWER ──────────────────────── */
  function openSubjectViewer(name, url) {
    const viewer = el('subject-viewer');
    el('subject-viewer-title').textContent = name;
    el('subject-viewer-frame').src = url || 'about:blank';
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSubjectViewer() {
    const viewer = el('subject-viewer');
    viewer.setAttribute('aria-hidden', 'true');
    el('subject-viewer-frame').src = 'about:blank';
    document.body.style.overflow = '';
  }

  /* ─── CLICK ROUTER ────────────────────────── */
  document.addEventListener('click', e => {
    const t = e.target;

    /* — data-route links (topbar & sidebar) — */
    const routeEl = t.closest('[data-route]');
    if (routeEl) {
      const r = routeEl.dataset.route;
      if (r === 'home')          { e.preventDefault(); goHome();          return; }
      if (r === 'about')         { e.preventDefault(); goAbout();         return; }
      if (r === 'notifications') { e.preventDefault(); goNotifications(); return; }
      if (r === 'syllabus')      { e.preventDefault(); goANU();           return; }
    }

    /* — Portal buttons — */
    if (t.closest('#btn-anu'))    { e.preventDefault(); goANU();    return; }
    if (t.closest('#open-btech')) { e.preventDefault(); goBTech();  return; }

    /* — Department buttons — */
    const deptBtn = t.closest('.dep-btn');
    if (deptBtn) {
      e.preventDefault();
      goDept(deptBtn.dataset.dept || deptBtn.textContent.trim());
      return;
    }

    /* — Subject cards — */
    const subCard = t.closest('.subject-card');
    if (subCard) {
      openSubjectViewer(subCard.textContent.trim(), subCard.dataset.url);
      return;
    }

    /* — Back buttons — */
    if (t.closest('#back-anu'))       { e.preventDefault(); goANU();       return; }
    if (t.closest('#back-btech'))     { e.preventDefault(); goBTech();     return; }
    if (t.closest('#back-dept-year')) { e.preventDefault(); setActiveView('view-dept-year', 'syllabus'); return; }
    if (t.closest('#back-dept-sem'))  { e.preventDefault(); setActiveView('view-dept-sem', 'syllabus');  return; }

    /* — Close subject viewer — */
    if (t.closest('#close-subject-viewer')) { closeSubjectViewer(); return; }
  });

  /* Close viewer with Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSubjectViewer();
  });

  /* ─── FORMS ───────────────────────────────── */
  el('dept-year-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = qs('input[name="year"]:checked');
    if (!v) { showFormError('Please select a year to continue.'); return; }
    state.year = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }[v.value];
    goSem();
  });

  el('dept-sem-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = qs('input[name="semester"]:checked');
    if (!v) { showFormError('Please select a semester to continue.'); return; }
    state.sem = v.value;
    goSubjects();
  });

  function showFormError(msg) {
    // non-blocking toast instead of alert()
    const existing = document.querySelector('.form-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'form-toast';
    toast.textContent = msg;
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '24px',
      left:         '50%',
      transform:    'translateX(-50%)',
      background:   'rgba(20,30,55,.95)',
      border:       '1px solid rgba(91,142,240,.35)',
      color:        '#e4e9f5',
      padding:      '.65rem 1.2rem',
      borderRadius: '10px',
      fontSize:     '.88rem',
      fontWeight:   '600',
      zIndex:       '9999',
      backdropFilter: 'blur(14px)',
      boxShadow:    '0 8px 24px rgba(0,0,0,.4)',
      pointerEvents: 'none'
    });

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* ─── SCROLL REVEAL ───────────────────────── */
  let revealObserver = null;

  function initReveal() {
    if (revealObserver) revealObserver.disconnect();

    const targets = document.querySelectorAll('.reveal');

    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(el => revealObserver.observe(el));
  }

  /* ─── INIT ────────────────────────────────── */
  el('year').textContent = new Date().getFullYear();
  setActiveView('view-home', 'home');

})();