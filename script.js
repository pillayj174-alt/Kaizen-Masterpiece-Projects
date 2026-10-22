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

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  const emailTo = 'kmasterpieceprojects@gmail.com';
  const phone = '27796770693';

  function showFallback(data, message) {
    const body = [
      'KAIZEN MASTERPIECE PROJECTS — WEBSITE ENQUIRY', '',
      `Name: ${data.name}`, `Company: ${data.company || 'Not provided'}`,
      `Email: ${data.email}`, `Phone: ${data.phone}`, `Service: ${data.service}`,
      `Project location: ${data.location}`, '', 'Project details:', data.details, '',
      'Sent from the Kaizen Masterpiece Projects website.'
    ].join('\n');
    const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(`Website enquiry: ${data.service} — ${data.name}`)}&body=${encodeURIComponent(body)}`;
    const actions = document.createElement('div');
    actions.className = 'form-fallback';
    const emailLink = document.createElement('a');
    emailLink.className = 'button button-yellow';
    emailLink.href = mailto;
    emailLink.textContent = 'Open email draft ↗';
    const waLink = document.createElement('a');
    waLink.className = 'button wa-button';
    waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.textContent = 'Send via WhatsApp ↗';
    actions.append(emailLink, waLink);
    status.insertAdjacentElement('afterend', actions);
    status.textContent = message;
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submit = form.querySelector('[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      name: String(data.name || '').trim(),
      company: String(data.company || '').trim() || 'Not provided',
      email: String(data.email || '').trim(),
      phone: String(data.phone || '').trim(),
      service: String(data.service || '').trim(),
      location: String(data.location || '').trim(),
      details: String(data.details || '').trim(),
      _subject: `Website enquiry: ${String(data.service || 'Project enquiry')} — ${String(data.name || 'New contact')}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: String(data.email || '').trim()
    };

    const priorFallback = document.querySelector('.form-fallback');
    priorFallback?.remove();
    status.textContent = 'Sending your enquiry securely…';
    status.setAttribute('aria-busy', 'true');
    if (submit) { submit.disabled = true; submit.innerHTML = 'Sending enquiry…'; }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${emailTo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === 'false' || result.success === false) {
        throw new Error(result.message || 'The email service could not accept the enquiry.');
      }
      status.textContent = 'Thank you — your enquiry has been submitted. The Kaizen team can reply directly to the email address you provided.';
      status.classList.add('success');
      form.reset();
    } catch (error) {
      showFallback(payload, 'We could not confirm automatic delivery. You can still send your enquiry directly by email or WhatsApp using the options below.');
      console.warn('Enquiry delivery fallback:', error);
    } finally {
      status.removeAttribute('aria-busy');
      if (submit) { submit.disabled = false; submit.innerHTML = 'Send project enquiry <span>↗</span>'; }
    }
  });
})();
