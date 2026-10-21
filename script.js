(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  document.getElementById('year').textContent = new Date().getFullYear();
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || '').trim();
    const location = String(data.get('location') || '').trim();
    const details = String(data.get('details') || '').trim();
    const subject = `Website enquiry: ${service} — ${name}`;
    const body = [
      'KAIZEN MASTERPIECE PROJECTS — WEBSITE ENQUIRY', '',
      `Name: ${name}`, `Company: ${company || 'Not provided'}`,
      `Email: ${email}`, `Phone: ${phone}`, `Service: ${service}`,
      `Project location: ${location}`, '', 'Project details:', details, '',
      'Sent from the Kaizen Masterpiece Projects website.'
    ].join('\n');
    const mailto = `mailto:kmasterpieceprojects@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email draft is ready. If your email app does not open, use the WhatsApp option below.';
    const existing = document.getElementById('whatsappFallback');
    existing?.remove();
    const actions = document.createElement('div');
    actions.id = 'whatsappFallback';
    actions.className = 'form-fallback';
    const emailLink = document.createElement('a');
    emailLink.className = 'button button-yellow';
    emailLink.href = mailto;
    emailLink.textContent = 'Open email draft ↗';
    const waLink = document.createElement('a');
    waLink.className = 'button wa-button';
    waLink.href = `https://wa.me/27796770693?text=${encodeURIComponent(body)}`;
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.textContent = 'Send via WhatsApp ↗';
    actions.append(emailLink, waLink);
    status.insertAdjacentElement('afterend', actions);
    window.location.href = mailto;
  });
})();
