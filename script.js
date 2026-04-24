/* =========================================================
   CODE CRYPT — script.js
   Vanilla JS · No dependencies
   ========================================================= */

'use strict';

// =========================================================
// 1. LOADER
// =========================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initCounters();
  }, 2200);
});

// =========================================================
// 2. PARTICLE CANVAS
// =========================================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.4 + 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() < 0.6 ? 260 : (Math.random() < 0.5 ? 200 : 160);
      this.twinkle = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speed;
      this.twinkle += 0.03;
      this.alpha = (Math.sin(this.twinkle) * 0.2 + 0.3);
      if (this.y < -5) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw faint lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 80)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

// =========================================================
// 3. SCROLL PROGRESS BAR
// =========================================================
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / totalHeight) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
}, { passive: true });

// =========================================================
// 4. NAVBAR — scrolled state & active link
// =========================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section.id) link.classList.add('active');
      });
    }
  });
}

// Nav link smooth scroll
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu
      document.getElementById('nav-links').classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
});

// =========================================================
// 5. HAMBURGER MENU
// =========================================================
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  document.getElementById('nav-links').classList.toggle('open');
});

// =========================================================
// 6. TYPEWRITER EFFECT
// =========================================================
const phrases = [
  'Where Logic Meets Legend.',
  'Hack. Build. Conquer.',
  'Encrypting the Future.',
  'Code is our Cipher.',
  'Debug the World.',
];

let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    charIdx--;
    typeEl.textContent = current.slice(0, charIdx);
  } else {
    charIdx++;
    typeEl.textContent = current.slice(0, charIdx);
  }

  let delay = isDeleting ? 50 : 80;

  if (!isDeleting && charIdx === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typewrite, delay);
}

setTimeout(typewrite, 2500); // start after loader

// =========================================================
// 7. SCROLL REVEAL (Intersection Observer)
// =========================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if parent is a grid
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

// Stagger card children
function setupReveal() {
  // Simple reveal elements
  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger cards within grids
    revealObserver.observe(el);
  });

  // Stagger member cards individually
  document.querySelectorAll('.member-card').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  // Stagger event cards
  document.querySelectorAll('.event-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 100}ms`;
  });

  // Stagger value chips
  document.querySelectorAll('.value-chip').forEach((chip, i) => {
    chip.style.transitionDelay = `${i * 60}ms`;
  });

  // Stagger timeline items
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 120}ms`;
  });
}

setupReveal();

// =========================================================
// 8. COUNTER ANIMATION (hero stats)
// =========================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + '+';
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 30);
  });
}

// =========================================================
// 9. BACK TO TOP
// =========================================================
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// 10. HEX GRID INTERACTION (mouse parallax)
// =========================================================
document.addEventListener('mousemove', (e) => {
  const hexes = document.querySelectorAll('.hex');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  hexes.forEach((hex, i) => {
    const factor = (i % 3 + 1) * 3;
    hex.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

// =========================================================
// 11. CARD TILT EFFECT
// =========================================================
document.querySelectorAll('.member-card, .event-card, .vm-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// =========================================================
// 12. LOGO CLICK — scroll to top
// =========================================================
document.querySelectorAll('.nav-logo').forEach(logo => {
  logo.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// =========================================================
// 13. DYNAMIC SECTION CORNER DECORATION COLOR
// =========================================================
const accentColors = {
  home: 'var(--purple)',
  members: 'var(--cyan)',
  events: 'var(--green)',
  vision: 'var(--blue)',
  gallery: 'var(--pink)',
  contact: 'var(--purple)',
};

sections.forEach(section => {
  const color = accentColors[section.id];
  if (color) section.style.setProperty('--accent-line', color);
});

// =========================================================
// 14. KEYBOARD SHORTCUT: press '/' to jump to top
// =========================================================
document.addEventListener('keydown', e => {
  if (e.key === '/' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// =========================================================
// 15. GALLERY ITEMS — lightbox placeholder
// =========================================================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('span').textContent;
    // Placeholder — replace with real lightbox when images are ready
    const msg = document.createElement('div');
    msg.className = 'gallery-toast';
    msg.innerHTML = `<i class="fa-solid fa-image"></i> ${label} — Add your image here!`;
    Object.assign(msg.style, {
      position: 'fixed', bottom: '5rem', left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(124,58,237,0.95)',
      color: '#fff', padding: '0.75rem 1.5rem',
      borderRadius: '10px', fontSize: '0.85rem',
      zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      animation: 'fadeInUp 0.3s ease',
      fontFamily: 'Syne, sans-serif',
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2500);
  });
});

// Add fadeInUp keyframe for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform: translateX(-50%) translateY(20px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);

// =========================================================
// 16. CTA BUTTONS — ripple effect
// =========================================================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Object.assign(ripple.style, {
      position: 'absolute',
      width: '6px', height: '6px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.4)',
      left: x + 'px', top: y + 'px',
      transform: 'translate(-50%,-50%) scale(0)',
      animation: 'ripple-out 0.6s ease forwards',
      pointerEvents: 'none',
    });
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-out {
    to { transform: translate(-50%,-50%) scale(40); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

console.log('%c{ CodeCrypt }', 'font-size:2rem;color:#a78bfa;font-family:monospace;font-weight:900;');
console.log('%cWelcome, hacker. 👾', 'color:#60a5fa;font-size:1rem;font-family:monospace;');
