const panel = document.querySelector('.thinking');
if (panel) {
  const descriptions = {
    people: 'Start with people: understand their needs and the problem worth solving.',
    business: 'Connect the idea to a clear business need, then prioritize what matters.',
    technology: 'Bring engineering into the conversation to make thoughtful, feasible products.'
  };
  const buttons = [...panel.querySelectorAll('[data-perspective]')];
  let selected = 'people';
  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.perspective;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    panel.querySelector('.thinking-description').textContent = descriptions[selected];
  }));
  const staticMode = matchMedia('(max-width: 700px), (prefers-reduced-motion: reduce)');
  let cleanup;
  let generation = 0;
  async function configure() {
    const current = ++generation;
    cleanup?.(); cleanup = undefined;
    if (staticMode.matches) return;
    try {
      const THREE = await import('./vendor/three/three.module.min.js');
      if (current !== generation) return;
      cleanup = mount(THREE);
    } catch {
      // The diagram and perspective controls remain usable without WebGL.
      panel.classList.remove('is-3d');
    }
  }
  staticMode.addEventListener('change', configure);
  configure();

  function mount(T) {
    const host = panel.querySelector('.thinking-canvas');
    const stage = panel.querySelector('.thinking-stage');
    const pause = panel.querySelector('.thinking-pause');
    const renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    host.append(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(38, 1, 0.1, 30);
    camera.position.set(0, 0, 8);
    scene.add(new T.HemisphereLight(0xffffef, 0x53664b, 2.6));
    const light = new T.DirectionalLight(0xffffff, 3.5);
    light.position.set(-3, 5, 5); scene.add(light);
    const group = new T.Group(); scene.add(group);
    const geometry = new T.SphereGeometry(1, 40, 28);
    const core = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: 0x4d6b3c, roughness: 0.35, metalness: 0.12 }));
    core.scale.setScalar(0.68); group.add(core);
    const keys = Object.keys(descriptions);
    const colors = [0xaec88a, 0xc3b78f, 0x88b19f];
    const labels = keys.map(key => {
      const label = document.createElement('span');
      label.className = 'thinking-node-label';
      label.textContent = key[0].toUpperCase() + key.slice(1);
      host.append(label);
      return label;
    });
    const projected = new T.Vector3();
    const spheres = keys.map((key, i) => {
      const mesh = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: colors[i], roughness: 0.32, metalness: 0.08, emissive: colors[i], emissiveIntensity: 0 }));
      mesh.scale.setScalar(0.32); mesh.userData.key = key; group.add(mesh); return mesh;
    });
    for (let i = 0; i < 2; i++) {
      const points = Array.from({ length: 129 }, (_, j) => {
        const a = j / 128 * Math.PI * 2;
        return new T.Vector3(Math.cos(a) * 1.95, Math.sin(a) * (0.95 + i * 0.22), Math.sin(a) * (i ? -0.5 : 0.5));
      });
      const ring = new T.Line(new T.BufferGeometry().setFromPoints(points), new T.LineBasicMaterial({ color: 0x91a47c, transparent: true, opacity: 0.4 }));
      ring.rotation.z = i ? -0.35 : 0.35; group.add(ring);
    }
    let frame = 0, last = 0, angle = 0, visible = true, paused = false, lost = false;
    const target = new T.Vector2();
    const raycaster = new T.Raycaster();
    const pointer = new T.Vector2();
    function pick(event) {
      const rect = host.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(spheres)[0]?.object;
    }
    function move(event) {
      const hit = pick(event);
      host.style.cursor = hit ? 'pointer' : 'default';
      target.set(pointer.x * 0.09, pointer.y * 0.09);
    }
    function leave() { target.set(0, 0); }
    function click(event) {
      const hit = pick(event);
      if (hit) buttons.find(button => button.dataset.perspective === hit.userData.key).click();
    }
    function render(now = 0) {
      frame = 0;
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (!paused) angle += delta * 0.13;
      group.rotation.y += (target.x - group.rotation.y) * 0.04;
      group.rotation.x += (-target.y - group.rotation.x) * 0.04;
      spheres.forEach((sphere, i) => {
        const a = angle + i * Math.PI * 2 / 3 + 0.45;
        sphere.position.set(Math.cos(a) * 1.85, Math.sin(a) * 1.12, Math.sin(a) * 0.45);
        sphere.material.emissiveIntensity = sphere.userData.key === selected ? 0.28 : 0;
        sphere.scale.setScalar(sphere.userData.key === selected ? 0.39 : 0.32);
      });
      renderer.render(scene, camera);
      spheres.forEach((sphere, i) => {
        sphere.getWorldPosition(projected).project(camera);
        labels[i].style.left = `${(projected.x * 0.5 + 0.5) * stage.clientWidth}px`;
        labels[i].style.top = `${(-projected.y * 0.5 + 0.5) * stage.clientHeight + 25}px`;
      });
      if (!paused && visible && !document.hidden && !lost) frame = requestAnimationFrame(render);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (visible && !document.hidden && !lost) render();
    }
    function resize() {
      const { width, height } = stage.getBoundingClientRect();
      camera.aspect = width / height; camera.updateProjectionMatrix();
      renderer.setSize(width, height, false); sync();
    }
    function toggle() { paused = !paused; pause.textContent = paused ? 'Resume motion' : 'Pause motion'; sync(); }
    function contextLost(event) { event.preventDefault(); lost = true; panel.classList.remove('is-3d'); pause.hidden = true; sync(); }
    function contextRestored() { lost = false; panel.classList.add('is-3d'); pause.hidden = false; sync(); }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(panel);
    const sizes = new ResizeObserver(resize); sizes.observe(stage);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('click', click);
    pause.addEventListener('click', toggle);
    buttons.forEach(button => button.addEventListener('click', sync));
    document.addEventListener('visibilitychange', sync);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
    panel.classList.add('is-3d'); pause.hidden = false;
    resize();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); sizes.disconnect();
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('click', click);
      pause.removeEventListener('click', toggle); buttons.forEach(button => button.removeEventListener('click', sync));
      document.removeEventListener('visibilitychange', sync);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
      scene.traverse(object => { if (object.geometry && object.geometry !== geometry) object.geometry.dispose(); object.material?.dispose(); });
      geometry.dispose(); renderer.dispose(); renderer.domElement.remove(); labels.forEach(label => label.remove());
      panel.classList.remove('is-3d'); pause.hidden = true; host.style.cursor = '';
    };
  }
}
