/* Enhance navigation only: all links remain available without JavaScript. */
(() => {
  const header = document.querySelector('.site-header');
  const button = header?.querySelector('.menu-toggle');
  const nav = header?.querySelector('nav');
  if (!button || !nav) return;
  const mobile = matchMedia('(max-width: 760px)');
  function close(returnFocus = false) {
    header.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Menu';
    if (returnFocus) button.focus();
  }
  function sync() {
    button.hidden = !mobile.matches;
    header.classList.toggle('has-menu', mobile.matches);
    close();
  }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') close(true);
  });
  mobile.addEventListener('change', sync);
  sync();
})();
