const article = document.querySelector('.essay-prose');
if (article) {
  const reading = document.querySelector('#reading');
  const options = [
    ['.theme-toggle', 'night', 'Night reading', 'Day reading'],
    ['.type-toggle', 'large-type', 'Larger text', 'Standard text'],
    ['.focus-toggle', 'reader-focus', 'Focus mode', 'Exit focus']
  ];
  options.forEach(([selector, className, off, on]) => {
    const button = document.querySelector(selector);
    button.addEventListener('click', () => {
      const active = document.body.classList.toggle(className);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? on : off;
      if (className === 'reader-focus') reading.scrollIntoView();
      schedule();
    });
  });
  const headings = [...article.querySelectorAll('[id]')];
  const links = [...document.querySelectorAll('.essay-toc nav a')];
  const progress = document.querySelector('.reading-progress');
  const percent = document.querySelector('.reading-percent');
  let pending = false;
  function update() {
    pending = false;
    const top = article.getBoundingClientRect().top + scrollY;
    const extent = article.offsetHeight - innerHeight + 100;
    const value = Math.round(Math.max(0, Math.min(1, (scrollY - top + 100) / Math.max(1, extent))) * 100);
    progress.style.width = `${value}%`;
    percent.textContent = `${value}%`;
    percent.setAttribute('aria-label', `${value}% read`);
    let active = headings[0];
    headings.forEach(heading => { if (heading.getBoundingClientRect().top <= 160) active = heading; });
    links.forEach(link => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(article);
  update();
}
