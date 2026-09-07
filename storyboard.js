const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.story-card')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'All' && card.dataset.genre !== button.dataset.filter; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('.filter-status').textContent = `${count} ${count === 1 ? 'story' : 'stories'} shown`;
}));
document.querySelector('.shuffle')?.addEventListener('click', () => {
  const choices = cards.filter(card => !card.hidden);
  if (choices.length) location.href = choices[Math.floor(Math.random() * choices.length)].querySelector('a').href;
});
const focus = document.querySelector('.focus-toggle');
focus?.addEventListener('click', () => {
  const active = document.body.classList.toggle('focus-mode');
  focus.setAttribute('aria-pressed', String(active));
  focus.textContent = active ? 'Exit focus mode' : 'Focus mode';
  document.querySelector('#reading').scrollIntoView();
});
const progress = document.querySelector('.read-progress');
if (progress) {
  let pending = false;
  function update() {
    pending = false;
    const article = document.querySelector('.story-prose');
    const start = article.getBoundingClientRect().top + scrollY;
    const distance = article.offsetHeight - innerHeight;
    const fraction = distance > 0 ? (scrollY - start) / distance : (scrollY + innerHeight - start) / article.offsetHeight;
    progress.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
  }
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  new ResizeObserver(update).observe(document.querySelector('.story-prose'));
  update();
}
