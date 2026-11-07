/* ============================================================
   Priyanshi Srivastava — Portfolio JS
   Stars · Typewriter · Scroll Reveal · Counter · Projects · Form
   ============================================================ */

const API_BASE = 'http://localhost:8000/api';

/* ════════════════════════════════════════════════════════════
   1. STAR CANVAS
════════════════════════════════════════════════════════════ */
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], mouseX = 0, mouseY = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      ox: 0, oy: 0,        // original offsets
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.85
        ? `rgba(168,85,247,` // purple stars
        : Math.random() > 0.7
          ? `rgba(6,182,212,`  // cyan stars
          : `rgba(255,255,255,`,
    };
  }

  function buildStars() {
    const count = Math.floor((W * H) / 4000);
    stars = Array.from({ length: count }, randomStar);
  }

  function drawConnections() {
    const DIST = 120;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - d / DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();

    stars.forEach(s => {
      // Twinkle
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.9 || s.alpha < 0.1) s.twinkleDir *= -1;

      // Drift
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      // Mouse parallax (subtle)
      const mxRatio = (mouseX / W - 0.5) * 0.5;
      const myRatio = (mouseY / H - 0.5) * 0.5;
      const px = s.x + mxRatio * s.r * 8;
      const py = s.y + myRatio * s.r * 8;

      // Draw star
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color}${s.alpha})`;
      ctx.fill();

      // Glow for bigger stars
      if (s.r > 1) {
        ctx.beginPath();
        ctx.arc(px, py, s.r * 2.5, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 2.5);
        g.addColorStop(0, `${s.color}${s.alpha * 0.4})`);
        g.addColorStop(1, `${s.color}0)`);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); buildStars(); });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  resize();
  buildStars();
  animate();
})();

/* ════════════════════════════════════════════════════════════
   2. CURSOR GLOW
════════════════════════════════════════════════════════════ */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  function loop() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ════════════════════════════════════════════════════════════
   3. NAVBAR
════════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

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

/* ════════════════════════════════════════════════════════════
   4. TYPEWRITER
════════════════════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const words = [
    'beautiful websites.',
    'responsive UIs.',
    'cool experiences.',
    'things I love.',
  ];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    const current = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    el.textContent = current;

    let delay = deleting ? 60 : 100;

    if (!deleting && ci > word.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      wi = (wi + 1) % words.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

/* ════════════════════════════════════════════════════════════
   5. SCROLL REVEAL
════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ════════════════════════════════════════════════════════════
   6. COUNTER ANIMATION
════════════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1500) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(pct * target);
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target, 10);
      animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num')
  .forEach(el => counterObserver.observe(el));

/* ════════════════════════════════════════════════════════════
   7. PROJECTS
════════════════════════════════════════════════════════════ */

// Static fallback projects (aapke real projects)
const STATIC_PROJECTS = [
  {
    id: 1,
    num: '01',
    title: 'Personal Portfolio',
    description: 'A modern animated portfolio website showcasing my skills, projects, and journey as a BCA student. Features star animation, typewriter effect, and smooth scroll reveal.',
    techStack: 'HTML, CSS, JavaScript, Python, FastAPI',
    liveUrl: 'https://p34-wev.github.io/internship-task/',
    githubUrl: 'https://github.com/p34-wev/internship-task',
    featured: true,
  },
  {
    id: 2,
    num: '02',
    title: 'Flavor House — Food Website',
    description: 'A responsive food ordering website for a vegetarian restaurant. Features a full menu, customer reviews, gallery, and a WhatsApp-based order system. Built during internship.',
    techStack: 'HTML, CSS, JavaScript, Responsive Design',
    liveUrl: 'https://p34-wev.github.io/silver-pixie-c33751/',
    githubUrl: 'https://github.com/p34-wev/silver-pixie-c33751',
    featured: true,
  },
];

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!projects.length) {
    grid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1">No projects yet.</p>`;
    return;
  }

  grid.innerHTML = projects.map((p, i) => {
    const tags = (p.techStack || p.tech_stack || '')
      .split(',')
      .map(t => `<span class="p-tag">${esc(t.trim())}</span>`)
      .join('');

    const liveBtn = (p.liveUrl || p.live_url)
      ? `<a href="${esc(p.liveUrl || p.live_url)}" class="p-link" target="_blank" rel="noopener">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           Live Demo
         </a>` : '';

    const ghBtn = (p.githubUrl || p.github_url)
      ? `<a href="${esc(p.githubUrl || p.github_url)}" class="p-link" target="_blank" rel="noopener">
           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
           GitHub
         </a>` : '';

    const featured = p.featured
      ? `<span class="project-featured">★ Featured</span>` : '';

    return `
      <div class="project-card" style="transition-delay:${i * 0.12}s">
        ${featured}
        <div class="project-num">Project ${p.num || String(i + 1).padStart(2, '0')}</div>
        <h3 class="project-title">${esc(p.title)}</h3>
        <p class="project-desc">${esc(p.description)}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-links">${liveBtn}${ghBtn}</div>
      </div>`;
  }).join('');

  // Observe newly created cards
  document.querySelectorAll('.project-card').forEach(card => {
    revealObserver.observe(card);
  });
}

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const body = await res.json();
    const data = body.data ?? [];
    // Use API data if available, else fallback to static
    renderProjects(data.length ? data : STATIC_PROJECTS);
  } catch {
    // Backend not running — use static projects
    renderProjects(STATIC_PROJECTS);
  }
}

/* ════════════════════════════════════════════════════════════
   8. CONTACT FORM
════════════════════════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';
  status.className = 'form-status';

  const payload = {
    name: document.getElementById('fname').value.trim(),
    email: document.getElementById('femail').value.trim(),
    subject: document.getElementById('fsubject').value.trim(),
    message: document.getElementById('fmessage').value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json();

    if (res.ok && body.success) {
      status.className = 'form-status success';
      status.textContent = '✓ Message sent! I\'ll get back to you soon.';
      e.target.reset();
    } else if (res.status === 429) {
      status.className = 'form-status error';
      status.textContent = 'Too many requests. Please wait a few minutes.';
    } else {
      throw new Error(body.message);
    }
  } catch (err) {
    status.className = 'form-status error';
    status.textContent = err.message || 'Could not send. Please email directly.';
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
  }
});

/* ════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════ */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

/* ════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', loadProjects);
