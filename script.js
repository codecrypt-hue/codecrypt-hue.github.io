// Code Crypt — site interactions

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 350);
    });
    // fallback in case load already fired
    setTimeout(() => loader.classList.add('hidden'), 1800);
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (navbar) navbar.classList.toggle('scrolled', doc.scrollTop > 20);

    const backBtn = document.getElementById('back-to-top');
    if (backBtn) backBtn.classList.toggle('visible', doc.scrollTop > 480);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link[data-section]');
  if (sections.length && navItems.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(a => a.classList.toggle('active', a.dataset.section === entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Typewriter tagline ---------- */
  const tw = document.getElementById('typewriter');
  if (tw) {
    const phrases = [
      'Where Logic Meets Legend.',
      'Decoding the future, one commit at a time.',
      'Hack. Learn. Build. Repeat.'
    ];
    let p = 0, c = 0, deleting = false;

    function tick() {
      const current = phrases[p];
      if (!deleting) {
        c++;
        tw.textContent = current.slice(0, c);
        if (c === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        c--;
        tw.textContent = current.slice(0, c);
        if (c === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    }
    tick();
  }

  /* ---------- Back to top ---------- */
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
