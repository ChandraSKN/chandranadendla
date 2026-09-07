const holder = document.querySelector('.about-avatar');
if (holder) {
  let started = false;
  const observer = new IntersectionObserver(async entries => {
    if (!entries[0].isIntersecting || started) return;
    started = true; observer.disconnect();
    let renderer;
    try {
      const [T, { GLTFLoader }] = await Promise.all([
        import('./vendor/three/three.module.min.js'),
        import('./vendor/three/GLTFLoader.js')
      ]);
      const gltf = await new GLTFLoader().loadAsync('./person.glb');
      const scene = new T.Scene(); scene.add(gltf.scene);
      const model = gltf.scene;
      model.updateMatrixWorld(true);
      const bounds = new T.Box3().setFromObject(model);
      const size = bounds.getSize(new T.Vector3());
      model.scale.multiplyScalar(2.85 / size.y);
      model.updateMatrixWorld(true);
      const fitted = new T.Box3().setFromObject(model);
      model.position.x -= (fitted.min.x + fitted.max.x) / 2;
      model.position.y -= fitted.min.y;
      model.updateMatrixWorld(true);
      const bones = ['LeftArm', 'LeftForeArm', 'LeftHand'].map(name => model.getObjectByName(name));
      function aim(bone, childName, direction) {
        const child = model.getObjectByName(childName);
        if (!bone || !child) return;
        model.updateMatrixWorld(true);
        const origin = bone.getWorldPosition(new T.Vector3());
        const current = child.getWorldPosition(new T.Vector3()).sub(origin).normalize();
        const delta = new T.Quaternion().setFromUnitVectors(current, direction.clone().normalize());
        const world = bone.getWorldQuaternion(new T.Quaternion()).premultiply(delta);
        const parent = bone.parent.getWorldQuaternion(new T.Quaternion()).invert();
        bone.quaternion.copy(parent.multiply(world));
        model.updateMatrixWorld(true);
      }
      renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      const camera = new T.OrthographicCamera(-2, 2, 1.95, -1.6, 0.1, 30);
      camera.position.set(0.45, 1.65, 7); camera.lookAt(0.45, 1.45, 0);
      scene.add(new T.HemisphereLight(0xfffff0, 0x647257, 2.5));
      const key = new T.DirectionalLight(0xffffff, 3); key.position.set(-3, 6, 5); scene.add(key);
      const mobile = matchMedia('(max-width: 700px)');
      const host = holder.querySelector('.avatar-canvas'); host.append(renderer.domElement);
      const status = holder.querySelector('.avatar-status');
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const rig = [];
      model.traverse(node => { if (node.isBone) rig.push({ node, rest: node.quaternion.clone() }); });
      const head = model.getObjectByName('Head');
      const pointer = new T.Vector2();
      let action = 'point', visible = false, lost = false;
      let introStarted = false, automaticLoop = false;
      let frame = 0, last = 0, waveTime = 0, settling = 0;
      const messages = { wave: 'Hello! Thanks for stopping by.', point: 'Explore my background and approach to product below.', reset: 'Ready when you are. Choose an action.' };
      function pose(dt) {
        const previous = rig.map(({ node }) => node.quaternion.clone());
        rig.forEach(({ node, rest }) => node.quaternion.copy(rest));
        if (action === 'point') {
          const direction = mobile.matches ? new T.Vector3(0.55, -0.85, 0.1) : new T.Vector3(1, 0.16, 0.05);
          aim(bones[0], 'LeftForeArm', mobile.matches ? new T.Vector3(0.6, -0.8, 0) : new T.Vector3(1, -0.35, 0));
          aim(bones[1], 'LeftHand', direction);
          aim(bones[2], 'LeftHandIndex1', direction);
          for (const finger of ['Middle', 'Ring', 'Pinky']) {
            for (let i = 1; i <= 3; i++) {
              const joint = model.getObjectByName(`LeftHand${finger}${i}`);
              if (joint) joint.rotation.x = 1.15;
            }
          }
        } else if (action === 'wave') {
          const swing = reduced.matches ? 0 : Math.sin(waveTime * 7) * 0.3;
          aim(bones[0], 'LeftForeArm', new T.Vector3(0.9, 0.1, 0));
          aim(bones[1], 'LeftHand', new T.Vector3(swing, 1, 0));
          aim(bones[2], 'LeftHandIndex1', new T.Vector3(swing, 1, 0));
          for (const finger of ['Index', 'Middle', 'Ring', 'Pinky']) {
            for (let i = 1; i <= 3; i++) {
              const joint = model.getObjectByName(`LeftHand${finger}${i}`);
              if (joint) joint.rotation.x = 0;
            }
          }
        }
        if (head && !reduced.matches) {
          head.rotation.y += pointer.x * 0.16;
          head.rotation.x -= pointer.y * 0.08;
        }
        const blend = reduced.matches ? 1 : 1 - Math.exp(-dt * 12);
        rig.forEach(({ node }, i) => node.quaternion.slerpQuaternions(previous[i], node.quaternion.clone(), blend));
        model.updateMatrixWorld(true);
      }
      function tick(now = performance.now()) {
        frame = 0;
        if (!visible || document.hidden || lost) return;
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
        last = now;
        if (!reduced.matches) waveTime += dt;
        if (automaticLoop && waveTime >= (action === 'wave' ? 3 : 5)) {
          setAction(action === 'wave' ? 'point' : 'wave');
        }
        pose(dt);
        renderer.render(scene, camera);
        settling = Math.max(0, settling - dt);
        if (!reduced.matches && (automaticLoop || settling > 0)) frame = requestAnimationFrame(tick);
      }
      function requestDraw() {
        cancelAnimationFrame(frame); frame = 0; last = 0;
        if (visible && !document.hidden && !lost) tick();
      }
      function setAction(next) {
        action = next; waveTime = 0; settling = 0.8;
        status.textContent = messages[action];
        holder.dataset.action = action;
      }
      host.addEventListener('pointermove', event => {
        if (reduced.matches || event.pointerType === 'touch') return;
        const rect = host.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        settling = 0.6;
        if (!frame) requestDraw();
      });
      host.addEventListener('pointerleave', () => {
        pointer.set(0, 0); settling = 0.6;
        requestDraw();
      });
      function resize() {
        const { width, height } = host.getBoundingClientRect();
        camera.left = -1.775 * width / height; camera.right = 1.775 * width / height;
        camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
        settling = 0.8; requestDraw();
      }
      renderer.domElement.addEventListener('webglcontextlost', event => {
        event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0;
        holder.classList.remove('avatar-ready');
      });
      renderer.domElement.addEventListener('webglcontextrestored', () => {
        lost = false; resize(); holder.classList.add('avatar-ready');
      });
      new ResizeObserver(resize).observe(host);
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35;
        if (visible && !introStarted) {
          introStarted = true;
          automaticLoop = !reduced.matches;
          setAction(automaticLoop ? 'wave' : 'point');
        }
        requestDraw();
      }, { threshold: [0, 0.35] }).observe(holder);
      document.addEventListener('visibilitychange', requestDraw);
      mobile.addEventListener('change', resize);
      reduced.addEventListener('change', () => {
        pointer.set(0, 0);
        automaticLoop = !reduced.matches && introStarted;
        setAction(automaticLoop ? 'wave' : 'point');
        requestDraw();
      });
     
      resize(); holder.classList.add('avatar-ready');
      holder.dataset.action = action;
    } catch {
      renderer?.dispose(); renderer?.domElement.remove();
      holder.classList.remove('avatar-ready');
    }
  }, { rootMargin: '200px' });
  observer.observe(holder);
}
