// Sticky nav shrink
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('shrink', window.scrollY > 30);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Cursor glow
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  glow.style.opacity = '1';
});
window.addEventListener('mouseleave', () => glow.style.opacity = '0');

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.getAttribute('data-count');
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target; }
      else { el.textContent = cur; requestAnimationFrame(tick); }
    };
    tick();
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

// Contact form (Formspree) — endpoint configured in index.html action
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  if (!name) return;
  const endpoint = form.getAttribute('action');
  if (endpoint.includes('YOUR_FORM_ID')) {
    note.textContent = 'Form henüz yapılandırılmadı (Formspree ID eksik).';
    return;
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      note.textContent = `Teşekkürler ${name}! Talebiniz alındı, en kısa sürede döneceğiz. ✅`;
      form.reset();
    } else {
      note.textContent = 'Gönderimde sorun oldu, lütfen tekrar deneyin.';
    }
  } catch {
    note.textContent = 'Bağlantı hatası, lütfen tekrar deneyin.';
  }
});
