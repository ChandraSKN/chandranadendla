(() => {
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const chips = (el, list, empty) => {
    el.innerHTML = list.length ? list.map(s => `<li>${esc(s.label)}</li>`).join('') : `<li class="none">${empty}</li>`;
  };

  // A new JD means a new job: drop company/role typed for the previous one.
  // Pasting re-analyses straight away so the CV/PDF never belong to the previous job.
  $('jd').addEventListener('paste', () => {
    $('company').value = ''; $('title').value = '';
    setTimeout(() => $('jm-form').requestSubmit());
  });
  $('jd').addEventListener('input', () => {
    $('out').hidden = true; // results are stale until re-analysed
    ctx = {};
    const meta = analyse($('jd').value);
    $('company').placeholder = meta.company || 'Company name';
    $('title').placeholder = meta.title || 'Role title';
  });

  $('jm-form').addEventListener('submit', e => {
    e.preventDefault();
    const r = analyse($('jd').value);
    const company = $('company').value.trim() || r.company;
    const title = $('title').value.trim() || r.title;
    const [v, advice] = verdict(r.score);

    $('out').hidden = false;
    $('verdict').textContent = v;
    $('advice').textContent = advice;
    $('bar').style.width = r.score + '%';
    $('years').textContent = r.askYears ? `Asks for ${r.askYears}+ years · you have 5+.` : '';
    countUp($('score'), r.score);
    chips($('strengths'), r.strengths, 'Nothing matched strongly');
    chips($('partial'), r.partial, 'None');
    chips($('gaps'), r.gaps, 'No obvious gaps');

    const cv = tailor(r);
    // ATS-safe: one column, standard headings, dates inline, plain characters, real text (no images or tables).
    const t = x => esc(x.replace(/₹\s?/g, 'INR ').replace(/[“”]/g, '"').replace(/[’]/g, "'"));
    $('cv').innerHTML = `
      <header><h3>${cv.name}</h3><p>Hyderabad, India | <a href="mailto:chandrasknadendla@gmail.com">chandrasknadendla@gmail.com</a> | <a href="tel:+917382959704">+91 73829 59704</a></p><p><a href="https://www.linkedin.com/in/kamalchandrasai-nadendla-welcomesyou/">LinkedIn</a> | <a href="https://chandranadendla.com">chandranadendla.com</a></p></header>
      <h4>Professional Summary</h4><p>${t(cv.profile)}</p>
      <h4>Core Skills</h4><p>${cv.skills.map(t).join(' | ')}</p>
      <h4>Professional Experience</h4>${cv.roles.map(x => `<p class="role"><b>${t(x.title)}</b>, ${t(x.org)} | ${t(x.when)}</p><ul>${x.bullets.map(b => `<li>${t(b)}</li>`).join('')}</ul>`).join('')}
      <h4>Projects</h4><ul>${cv.projects.map(p => `<li><b><a href="${p.url}">${t(p.name)}</a>:</b> ${t(p.text)}</li>`).join('')}</ul>
      <h4>Education</h4>${cv.education.map(([d, s, y]) => `<p><b>${t(d)}</b>, ${t(s)} | ${y}</p>`).join('')}`;

    $('people').innerHTML = people(company, title).map(p => `<li><a href="${p.url}" target="_blank" rel="noopener noreferrer"><b>${p.who}</b>${p.why ? `<span>${p.why}</span>` : ''}<i aria-hidden="true">↗</i><span class="sr-only"> (LinkedIn search, new tab)</span></a></li>`).join('');
    $('msg').value = message(company, title, r);
    $('msg').dispatchEvent(new Event('input'));
    ctx = { company, title, r, jd: cleanJd($('jd').value) };
    $('out').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  $('msg').addEventListener('input', () => {
    const n = $('msg').value.length;
    $('chars').textContent = `${n} / 300`;
    $('chars').classList.toggle('over', n > 300);
  });
  $('copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('msg').value); $('copy').textContent = 'Copied'; }
    catch { $('msg').select(); $('copy').textContent = 'Press Ctrl+C'; }
    setTimeout(() => { $('copy').textContent = 'Copy note'; }, 1800);
  });
  let ctx = {};
  const store = { get: () => { try { return localStorage.getItem('jm-key') || ''; } catch { return ''; } },
    set: v => { try { v ? localStorage.setItem('jm-key', v) : localStorage.removeItem('jm-key'); } catch {} } };
  const keyState = () => { $('key-state').textContent = store.get() ? 'saved: answers by Claude' : 'not set: using templates'; };
  keyState();
  $('save-key').addEventListener('click', () => { store.set($('key').value.trim()); $('key').value = ''; keyState(); });

  $('ask').addEventListener('click', async () => {
    const q = $('q').value.trim();
    if (!q) return $('q').focus();
    const key = store.get();
    const show = (text, note) => { $('ans').value = text; $('ans-chars').textContent = `${text.length} characters${note ? ' · ' + note : ''}`; };
    if (!key) return show(answer(q, ctx), 'template');
    $('ask').disabled = true; show('', 'Claude is writing…');
    try {
      const { default: Anthropic } = await import('https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/+esm');
      const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
      const context = ctx.jd ? `Role: ${ctx.title || 'unknown'} at ${ctx.company || 'unknown company'}\n\nJob description:\n${ctx.jd}\n\n` : '';
      const res = await client.beta.messages.create({
        model: 'claude-opus-5',
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium' },
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: answerPrompt(),
        messages: [{ role: 'user', content: `${context}Application question:\n${q}` }],
      });
      if (res.stop_reason === 'refusal') throw new Error('Claude declined this one');
      const text = res.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
      show(text, 'Claude');
    } catch (err) {
      const why = err instanceof Error ? err.message : String(err);
      show(answer(q, ctx), 'template (Claude failed: ' + why.slice(0, 80) + ')');
    } finally { $('ask').disabled = false; }
  });
  $('copy-ans').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('ans').value); $('copy-ans').textContent = 'Copied'; }
    catch { $('ans').select(); $('copy-ans').textContent = 'Press Ctrl+C'; }
    setTimeout(() => { $('copy-ans').textContent = 'Copy answer'; }, 1800);
  });
  // Download saves into a chosen applications folder (Chrome/Edge): <Company - Role - date>/ with the JD and the CV.
  // The folder handle is remembered in IndexedDB; other browsers get a plain download.
  const idb = (mode, fn) => new Promise((ok, no) => {
    const open = indexedDB.open('job-match', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('kv');
    open.onerror = () => no(open.error);
    open.onsuccess = () => { const req = fn(open.result.transaction('kv', mode).objectStore('kv')); req.onsuccess = () => ok(req.result); req.onerror = () => no(req.error); };
  });
  async function appsFolder(pick) {
    let dir = pick ? null : await idb('readonly', st => st.get('dir')).catch(() => null);
    if (dir && await dir.requestPermission({ mode: 'readwrite' }) !== 'granted') dir = null;
    if (!dir) {
      dir = await showDirectoryPicker({ id: 'job-applications', mode: 'readwrite', startIn: 'documents' });
      await idb('readwrite', st => st.put(dir, 'dir')).catch(() => {});
    }
    return dir;
  }
  const clean = x => x.replace(/[\\/:*?"<>|\n]+/g, ' ').replace(/\s+/g, ' ').slice(0, 60).replace(/[\s.]+$/, '').trim();
  $('print').addEventListener('click', async e => {
    const company = clean($('company').value || $('company').placeholder.replace(/^Company name$/, '')) || 'Company';
    const role = clean($('title').value || $('title').placeholder.replace(/^Role title$/, '')) || 'Role';
    const file = `Chandra_Nadendla_CV_${company.replace(/\W+/g, '_')}.pdf`;
    const doc = cvPdf($('cv'));
    if (!window.showDirectoryPicker) return doc.save(file);
    try {
      const root = await appsFolder(e.shiftKey); // Shift+click to choose a different folder
      const dir = await root.getDirectoryHandle(`${company} - ${role} - ${new Date().toISOString().slice(0, 10)}`, { create: true });
      const write = async (name, data) => { const w = await (await dir.getFileHandle(name, { create: true })).createWritable(); await w.write(data); await w.close(); };
      await write('job-description.txt', `${role} at ${company}\n\n${cleanJd($('jd').value)}`);
      await write(file, doc.output('blob'));
      $('print').firstChild.textContent = `Saved to ${root.name}/${dir.name} `;
      setTimeout(() => { $('print').firstChild.textContent = 'Download PDF '; }, 4000);
    } catch (err) {
      if (err.name === 'AbortError') return; // picker cancelled
      console.error('Folder save failed:', err);
      $('print').firstChild.textContent = `Folder save failed (${err.message}), downloaded instead `;
      setTimeout(() => { $('print').firstChild.textContent = 'Download PDF '; }, 6000);
      doc.save(file);
    }
  });

  // Real-text A4 PDF (ATS-readable, links kept) built from the rendered #cv.
  function cvPdf(cv) {
    const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    const M = 46, W = doc.internal.pageSize.getWidth() - 2 * M, H = doc.internal.pageSize.getHeight();
    let y = M;
    const need = h => { if (y + h > H - M) { doc.addPage(); y = M; } };
    const runs = el => {
      const out = [];
      (function walk(n, b, url) {
        for (const c of n.childNodes) c.nodeType === 3 ? out.push({ t: c.textContent, b, url }) : walk(c, b || c.tagName === 'B', url || c.href);
      })(el, el.tagName === 'H3', null);
      return out.flatMap(r => r.t.split(/(\s+)/).filter(Boolean).map(t => ({ ...r, t: t.replace(/\s+/g, ' ') })));
    };
    const block = (el, size, { center, indent = 0, bullet } = {}) => {
      const lh = size * 1.32, max = W - indent, lines = [[]];
      doc.setFontSize(size);
      let w = 0;
      for (const wd of runs(el)) {
        doc.setFont('helvetica', wd.b ? 'bold' : 'normal');
        wd.w = doc.getTextWidth(wd.t);
        const sp = wd.t === ' ';
        if (sp && !lines.at(-1).length) continue;
        if (!sp && w + wd.w > max && lines.at(-1).length) {
          if (lines.at(-1).at(-1).t === ' ') lines.at(-1).pop();
          lines.push([]); w = 0;
        }
        lines.at(-1).push(wd); w += wd.w;
      }
      lines.forEach((l, i) => {
        need(lh);
        const lw = l.reduce((a, x) => a + (x === l.at(-1) && x.t === ' ' ? 0 : x.w), 0);
        let x = M + indent + (center ? (max - lw) / 2 : 0);
        if (bullet && !i) { doc.setFont('helvetica', 'normal'); doc.text('\u2022', M + indent - 9, y + size); }
        for (const wd of l) {
          doc.setFont('helvetica', wd.b ? 'bold' : 'normal');
          doc.text(wd.t, x, y + size);
          if (wd.url) { doc.link(x, y, wd.w, lh, { url: wd.url }); doc.setLineWidth(0.4); doc.line(x, y + size + 1.5, x + wd.w, y + size + 1.5); }
          x += wd.w;
        }
        y += lh;
      });
    };
    for (const el of cv.children) {
      if (el.tagName === 'HEADER') {
        for (const c of el.children) block(c, c.tagName === 'H3' ? 18 : c.className === 'headline' ? 11 : 9.5, { center: true });
        y += 4;
      } else if (el.tagName === 'H4') {
        y += 8; need(30);
        doc.setFont('helvetica', 'bold').setFontSize(10.5);
        doc.text(el.textContent.toUpperCase(), M, y + 10.5);
        y += 14; doc.setLineWidth(0.7); doc.line(M, y, M + W, y); y += 5;
      } else if (el.tagName === 'UL') {
        for (const li of el.children) { block(li, 9.5, { indent: 12, bullet: true }); y += 1.5; }
        y += 3;
      } else {
        if (el.classList.contains('role')) y += 4;
        block(el, 9.8); y += 2;
      }
    }
    return doc;
  }

  // Check now: pull live openings (India/remote) and score them. Make CV: load the JD, tailor, save to the folder.
  let found = [];
  $('check').addEventListener('click', async () => {
    $('check').disabled = true; $('jobs-when').textContent = 'Checking job boards…';
    try {
      const { jobs, failed } = await fetchJobs();
      found = jobs;
      $('jobs-when').textContent = `${jobs.length} matching · checked ${new Date().toLocaleTimeString()}${failed.length ? ` · ${failed.length} board(s) unreachable` : ''}`;
      if (failed.length) console.warn('Job boards failed:', failed);
      $('jobs-list').innerHTML = jobs.map((j, i) => `<li data-q="${esc(`${j.company} ${j.title} ${j.location}`.toLowerCase())}"><b>${j.score}</b><span><a href="${esc(j.url || '#')}" target="_blank" rel="noopener noreferrer">${esc(j.title)}</a><small>${esc(j.company)} · ${esc(j.location || '')} · ${j.source}</small></span><button class="jm-btn" type="button" data-i="${i}">Make CV</button></li>`).join('') || '<li>No matching openings right now.</li>';
      $('jobs-filter').dispatchEvent(new Event('input'));
    } catch (err) {
      $('jobs-when').textContent = 'Check failed: ' + err.message;
    } finally { $('check').disabled = false; }
  });
  $('jobs-list').addEventListener('click', e => {
    const j = found[e.target.dataset.i];
    if (!j) return;
    $('jd').value = `${j.title}\n${j.jd}`;
    $('company').value = j.company; $('title').value = j.title;
    $('jm-form').requestSubmit();
    $('print').click(); // same click, so the folder picker is still allowed
  });
  $('jobs-filter').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    for (const li of $('jobs-list').children) li.hidden = !!li.dataset.q && !li.dataset.q.includes(q);
  });

  function countUp(el, to) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / 700);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
})();
