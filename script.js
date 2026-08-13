// Nav active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav nav a[href^="#"]');

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
  { threshold: 0.45 }
);

sections.forEach(s => sectionObserver.observe(s));

// Form submission via fetch (Formspree)
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        btn.textContent = '✓ Done!';
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 3500);
      } else {
        throw new Error('server');
      }
    } catch {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
    }
  });
});
