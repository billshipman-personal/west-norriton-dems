const SUPABASE_URL = 'https://edjtiftrsepkpxosdpwn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkanRpZnRyc2Vwa3B4b3NkcHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzODg2MjYsImV4cCI6MjEwMDk2NDYyNn0.x390dDUZQDRoTh5FAwPINtsCE7DE7ZDXxWdZDWukuy0';

async function supabaseInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Insert failed: ${res.status}`);
}

// Nav shrink + frosted glass on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile hamburger toggle
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Nav active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// Newsletter signup form
document.querySelector('.signup-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Signing up…';
  btn.disabled = true;
  try {
    const data = new FormData(form);
    await supabaseInsert('wnd_signups', {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
    });
    btn.textContent = "✓ You're on the list!";
    form.reset();
    setTimeout(() => { btn.textContent = 'Keep Me Updated'; btn.disabled = false; }, 4000);
  } catch {
    btn.textContent = 'Something went wrong — try again';
    btn.disabled = false;
  }
});

// Volunteer form
document.querySelector('.volunteer-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Submitting…';
  btn.disabled = true;
  try {
    const data = new FormData(form);
    const interests = form.querySelectorAll('input[name="interests"]:checked');
    const interestList = Array.from(interests).map(cb => cb.value).join(', ') || 'Not specified';
    await supabaseInsert('wnd_messages', {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      message: `VOLUNTEER: ${interestList}`,
    });
    btn.textContent = "✓ We'll be in touch!";
    form.reset();
    setTimeout(() => { btn.textContent = 'I Want to Help'; btn.disabled = false; }, 4000);
  } catch {
    btn.textContent = 'Something went wrong — try again';
    btn.disabled = false;
  }
});

// Contact form
document.querySelector('.contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const data = new FormData(form);
    await supabaseInsert('wnd_messages', {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      message: data.get('message').trim(),
    });
    btn.textContent = '✓ Message sent!';
    form.reset();
    setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 4000);
  } catch {
    btn.textContent = 'Something went wrong — try again';
    btn.disabled = false;
  }
});
