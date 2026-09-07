const root = document.querySelector('.model-explorer');
const stage = root.querySelector('.model-stage');
const status = root.querySelector('.model-status');
async function loadModel() {
  stage.setAttribute('aria-busy', 'true');
  status.textContent = 'Loading the 3D model…';
  let renderer;
  try {
    const [T, { GLTFLoader }] = await Promise.all([
      import('../../vendor/three/three.module.min.js'),
      import('../../vendor/three/GLTFLoader.js')
    ]);
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const gltf = await new GLTFLoader().loadAsync(new URL('./spinodoid.glb', import.meta.url).href);
    const scene = new T.Scene();
    const model = gltf.scene;
    const box = new T.Box3().setFromObject(model);
    const center = box.getCenter(new T.Vector3());
    const scale = 2 / Math.max(...box.getSize(new T.Vector3()).toArray());
    model.scale.setScalar(scale);
    model.position.copy(center.multiplyScalar(-scale));
    scene.add(model);
    scene.add(new T.HemisphereLight(0xffffee, 0x33452e, 2.6));
    const key = new T.DirectionalLight(0xffffff, 3.5); key.position.set(3, 5, 4); scene.add(key);
    const fill = new T.DirectionalLight(0xc7e6ff, 2); fill.position.set(-4, 1, -3); scene.add(fill);
    const camera = new T.PerspectiveCamera(40, 1, 0.1, 50);
    let yaw = 0.65, pitch = 0.4, distance = 6;
    const draw = () => {
      pitch = Math.max(-1.4, Math.min(1.4, pitch));
      distance = Math.max(3.5, Math.min(12, distance));
      camera.position.set(distance*Math.cos(pitch)*Math.sin(yaw), distance*Math.sin(pitch), distance*Math.cos(pitch)*Math.cos(yaw));
      camera.lookAt(0, 0, 0); renderer.render(scene, camera);
    };
    root.querySelector('.model-canvas').append(renderer.domElement);
    const resize = () => {
      renderer.setSize(stage.clientWidth, stage.clientHeight);
      camera.aspect = stage.clientWidth/stage.clientHeight;
      camera.updateProjectionMatrix(); draw();
    };
    new ResizeObserver(resize).observe(stage);
    stage.classList.add('ready');
    const controls = root.querySelectorAll('[data-view]');
    const act = action => {
      if(action==='left') yaw-=0.2;
      if(action==='right') yaw+=0.2;
      if(action==='in') distance/=1.15;
      if(action==='out') distance*=1.15;
      if(action==='reset') { yaw=0.65; pitch=0.4; distance=6; }
      draw();
    };
    controls.forEach(button => { button.disabled=false; button.addEventListener('click',()=>act(button.dataset.view)); });
    const pointers = new Map();
    stage.addEventListener('pointerdown', e => { if(e.button!==0) return; stage.focus({preventScroll:true}); pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', e => {
      const previous = pointers.get(e.pointerId); if(!previous) return;
      if(pointers.size===2){
        const other = [...pointers.entries()].find(([id])=>id!==e.pointerId)[1];
        const before = Math.hypot(previous.x-other.x,previous.y-other.y);
        const after = Math.hypot(e.clientX-other.x,e.clientY-other.y);
        if(before>0 && after>0) distance*=before/after;
      } else { yaw-=(e.clientX-previous.x)*0.008; pitch+=(e.clientY-previous.y)*0.008; }
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); draw();
    });
    for(const event of ['pointerup','pointercancel','lostpointercapture']) stage.addEventListener(event,e=>pointers.delete(e.pointerId));
    stage.addEventListener('keydown',e=>{
      const actions={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out',Home:'reset'};
      if(actions[e.key]) {e.preventDefault(); act(actions[e.key]);}
      if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();pitch+=e.key==='ArrowUp'?0.15:-0.15;draw();}
    });
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='The 3D view was interrupted. Reload this page to try again.';controls.forEach(b=>b.disabled=true);});
    resize();
    status.textContent='3D model ready. Rotate and zoom to explore the surfaces.';
  } catch(error) {
    renderer?.dispose();
    status.textContent='The 3D view could not load. Reload the page to try again.';
  } finally { stage.setAttribute('aria-busy','false'); }
}

loadModel();
