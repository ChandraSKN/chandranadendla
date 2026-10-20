/* Floor plan of the work: choosing a room shows its wall label, and Buddy walks
   along the hall to the doorway. Without JavaScript the rooms are plain links
   to the labels, which all stay visible. */
(() => {
  const gallery = document.querySelector('.gallery');
  const plan = gallery?.querySelector('.plan');
  const guide = plan?.querySelector('.guide');
  if (!plan || !guide) return;

  const rooms = [...plan.querySelectorAll('.room')];
  const order = rooms.map(room => room.dataset.room);
  const doors = { '01': 25, '02': 75, '03': 53.75, '04': 83.25 };      // doorway x, in % of the plan
  const HALL = 58;                                         // where he walks, in % of the plan height
  const SPEED = 150;                                       // px per second
  const ROW = { left: 0, right: 1, front: 2, wave: 3, idle: 4 };
  const greetings = { '01': 'Room 01, come in!', '02': 'Room 02, mind the struts!', '03': 'Room 03, that’s me!', '04': 'Room 04, my office!' };
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const bubble = guide.querySelector('.guide-bubble');

  let pos = { x: 14, y: 93 };                              // starts in the entrance
  let active = null;
  let walkId = 0;
  let toured = false;

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function place(x, y) {
    guide.style.setProperty('--x', `${x}%`);
    guide.style.setProperty('--y', `${y}%`);
    pos = { x, y };
  }

  // glide to (x, y) over `seconds`; resolves false if a newer walk took over
  function glide(x, y, seconds, id) {
    const from = { ...pos };
    const start = performance.now();
    return new Promise(resolve => {
      function frame(now) {
        if (id !== walkId) return resolve(false);
        const t = Math.min((now - start) / (seconds * 1000), 1);
        place(from.x + (x - from.x) * t, from.y + (y - from.y) * t);
        if (t < 1) requestAnimationFrame(frame); else resolve(true);
      }
      requestAnimationFrame(frame);
    });
  }

  function row(name) { guide.style.setProperty('--row', ROW[name]); }

  async function walkTo(room) {
    const id = ++walkId;
    const target = { x: doors[room], y: HALL };
    guide.classList.toggle('bubble-left', target.x > 55);   // keep the bubble inside the plan
    guide.classList.remove('speaking', 'waving');
    if (still.matches) {
      place(target.x, target.y);
      row('idle');
      bubble.textContent = greetings[room];
      guide.classList.add('speaking');
      return;
    }
    const legs = [];
    if (pos.y !== HALL) legs.push({ x: pos.x, y: HALL });
    legs.push(target);
    const box = plan.getBoundingClientRect();
    guide.classList.add('walking');
    for (const leg of legs) {
      const dx = (leg.x - pos.x) / 100 * box.width;
      const dy = (leg.y - pos.y) / 100 * box.height;
      const distance = Math.hypot(dx, dy);
      if (distance < 1) continue;
      row(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : 'front');
      if (!await glide(leg.x, leg.y, Math.max(distance / SPEED, 0.25), id)) return;
    }
    guide.classList.remove('walking');
    row('wave');
    bubble.textContent = greetings[room];
    guide.classList.add('waving', 'speaking');
    await wait(2200);
    if (id !== walkId) return;
    guide.classList.remove('waving');
    row('idle');
    await wait(1800);
    if (id === walkId) guide.classList.remove('speaking');
  }

  function select(room, { walk = true, updateHash = true } = {}) {
    if (!doors[room]) return;
    active = room;
    rooms.forEach(r => {
      const on = r.dataset.room === room;
      r.classList.toggle('is-active', on);
      if (on) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current');
    });
    gallery.querySelectorAll('.placard').forEach(p => p.classList.toggle('is-active', p.id === `room-${room}`));
    if (updateHash) history.replaceState(null, '', `#room-${room}`);
    if (walk) walkTo(room);
  }

  function step(delta) {
    const i = order.indexOf(active);
    select(order[(i + delta + order.length) % order.length]);
  }

  rooms.forEach(room => room.addEventListener('click', event => {
    event.preventDefault();
    select(room.dataset.room);
  }));
  plan.addEventListener('keydown', event => {
    if (!event.target.closest('.room')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
    plan.querySelector(`.room[data-room="${active}"]`).focus();
  });
  const nav = gallery.querySelector('.plan-nav');
  nav.hidden = false;
  nav.addEventListener('click', event => {
    const button = event.target.closest('button[data-step]');
    if (button) step(Number(button.dataset.step));
  });

  // start from a link such as #room-03 (or the old #tech), otherwise Room 01
  const fromHash = { '#tech': '03', '#room-01': '01', '#room-02': '02', '#room-03': '03', '#room-04': '04' }[location.hash];
  gallery.classList.add('is-ready');
  select(fromHash || '01', { walk: false, updateHash: false });
  row('idle');
  if (fromHash) gallery.scrollIntoView();

  // the first time the plan comes into view, Buddy walks from the entrance to the room
  const observer = new IntersectionObserver(entries => {
    if (toured || !entries.some(entry => entry.isIntersecting)) return;
    toured = true;
    observer.disconnect();
    setTimeout(() => walkTo(active), 350);
  }, { threshold: 0.45 });
  observer.observe(plan);
})();
