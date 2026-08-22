'use client';

import { useEffect, useRef, useState } from 'react';

const MODEL_URL = '/models/agbada_cloth_model.glb';

const CONFIG = {
  frameFill: 0.85,
  model: {
    startScale: 0.85,
    endScale: 1.0,
    rotation0: 0,
    rotation50: Math.PI / 2,
    rotation100: Math.PI,
    parallax: 0.12
  },
  camera: {
    fov: 42,
    fovMobile: 46,
    near: 0.1,
    far: 60,
    path: [
      [0.0, 1.15, 9.2],
      [0.0, 1.05, 6.3],
      [1.7, 1.05, 6.4],
      [3.1, 0.95, 5.7],
      [0.5, 1.18, 7.7]
    ]
  },
  copyFade: 0.06,
  envIntensity: 0.8
};

const SLIDES = [
  {
    eyebrow: 'BMY Collection · Gombe',
    title: <>Crafted with <em>Heritage</em></>,
    sub: 'Cut from premium shadda, brocade, and atiku — tailored by hand.'
  },
  {
    eyebrow: 'Ready-to-Wear · Bespoke',
    title: <>Designed for <em>Today</em></>,
    sub: 'Ceremonial agbada to everyday caftans.'
  },
  {
    eyebrow: 'Hand Finished',
    title: <>Details that <em>Matter</em></>,
    sub: 'Fine embroidery, structured seams, and custom finishes.'
  },
  {
    eyebrow: 'The Wardrobe',
    title: <>Discover the <em>Collection</em></>,
    sub: 'Explore pieces or book a custom bespoke fitting.'
  }
];

export default function Showcase() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const loadBarRef = useRef(null);
  const loadTextRef = useRef(null);
  const progressRef = useRef(null);
  const hintRef = useRef(null);
  const copyRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatus('static');
      return;
    }

    let disposed = false;
    let cleanup = () => {};
    let raf = 0;

    // Safety fallback timer — ensure UI never hangs on loading screen
    const safetyTimer = setTimeout(() => {
      if (!disposed && status === 'loading') {
        setStatus('static');
      }
    }, 2800);

    (async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
        if (disposed) return;

        const els = {
          section: sectionRef.current,
          canvas: canvasRef.current,
          loadBar: loadBarRef.current,
          loadText: loadTextRef.current,
          progress: progressRef.current,
          hint: hintRef.current,
          copy: copyRef.current
        };
        cleanup = initShowcase(THREE, GLTFLoader, RoomEnvironment, els, {
          onReady: () => {
            clearTimeout(safetyTimer);
            if (!disposed) setStatus('ready');
          },
          onError: () => {
            clearTimeout(safetyTimer);
            if (!disposed) setStatus('static');
          }
        });
      } catch (err) {
        console.warn('3D showcase unavailable, switching to static showcase:', err);
        clearTimeout(safetyTimer);
        if (!disposed) setStatus('static');
      }
    })();

    return () => {
      disposed = true;
      clearTimeout(safetyTimer);
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  const className =
    status === 'error' || status === 'static'
      ? 'showcase is-static is-loaded'
      : status === 'ready'
        ? 'showcase is-loaded'
        : 'showcase is-loaded';

  return (
    <section className={className} id="showcase" ref={sectionRef} aria-label="Scroll-driven 3D showcase">
      <div className="showcase-stage">
        <canvas className="showcase-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="showcase-vignette" aria-hidden="true" />

        <div className="showcase-copy" ref={copyRef}>
          {SLIDES.map((s, i) => (
            <div className="showcase-slide" key={i}>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="showcase-title">{s.title}</h2>
              <p className="showcase-sub">{s.sub}</p>
              {i === SLIDES.length - 1 && (
                <a href="#collection" className="btn btn-line showcase-cta">Explore the Collection</a>
              )}
            </div>
          ))}
        </div>

        <div className="showcase-load" role="status" aria-live="polite">
          <span className="showcase-load-bar"><i ref={loadBarRef} /></span>
          <span className="showcase-load-text" ref={loadTextRef}>Preparing the atelier…</span>
        </div>

        <div className="showcase-progress" aria-hidden="true"><i ref={progressRef} /></div>
        <p className="showcase-scroll-hint" ref={hintRef}>Scroll to explore</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Three.js setup — imported on demand so it never runs on the
   server. Timeline is scroll-driven and fully deterministic.
   ------------------------------------------------------------ */
function initShowcase(THREE, GLTFLoader, RoomEnvironment, els, cbs) {
  const { section, canvas, loadBar, loadText, progress, hint, copy } = els;
  const slides = Array.prototype.slice.call(copy.querySelectorAll('.showcase-slide'));

  const target = new THREE.Vector3(0, 0.1, 0);
  const path = CONFIG.camera.path.map((p) => new THREE.Vector3(...p));

  const state = {
    ready: false,
    visible: false,
    baseScale: 1,
    shadowY: -1.8,
    rawSize: { x: 1, y: 1 },
    rawMinY: 0,
    nearDist: 6.4,
    raf: 0
  };

  let scene, camera, renderer, curve, model, shadow;
  let scrollPending = false;
  let cleanup = false;
  const cleanups = [];
  const addCleanup = (fn) => cleanups.push(fn);

  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(t) { const c = clamp01(t); return c * c * (3 - 2 * c); }
  function isMobile() { return window.matchMedia('(max-width: 720px)').matches; }

  function rotationAt(p) {
    const m = CONFIG.model;
    if (p < 0.25) return m.rotation0;
    if (p < 0.5) return lerp(m.rotation0, m.rotation50, smoothstep((p - 0.25) / 0.25));
    if (p < 0.75) return m.rotation50;
    return lerp(m.rotation50, m.rotation100, smoothstep((p - 0.75) / 0.25));
  }

  const MODEL_Y_OFFSET = -0.35;

  function getDesktopX() {
    return isMobile() ? 0 : 1.5;
  }

  function applyTimeline(p) {
    if (!state.ready || !model) return;

    const pos = curve.getPointAt(p);
    camera.position.copy(pos);

    const xBase = getDesktopX();
    const side = smoothstep(clamp01((p - 0.5) / 0.25));
    camera.position.x += Math.sin(side * Math.PI) * 0.18 + (isMobile() ? 0 : 0.25);
    camera.lookAt(target.x + (isMobile() ? 0 : 0.45), target.y + Math.sin(side * Math.PI) * 0.06 + MODEL_Y_OFFSET * 0.4, target.z);

    const growth = p < 0.25 ? smoothstep(p / 0.25) : 1;
    model.scale.setScalar(state.baseScale * lerp(CONFIG.model.startScale, CONFIG.model.endScale, growth));
    model.rotation.y = rotationAt(p);
    model.position.x = xBase + Math.sin(side * Math.PI) * CONFIG.model.parallax;
    model.position.y = MODEL_Y_OFFSET;
    if (shadow) {
      shadow.position.x = model.position.x;
      shadow.position.y = state.shadowY + MODEL_Y_OFFSET;
    }

    canvas.style.opacity = p < 0.1 ? smoothstep(p / 0.1) : 1;
  }

  function applyCopy(p) {
    slides.forEach((el, i) => {
      const a = i / 4;
      const b = (i + 1) / 4;
      const f = CONFIG.copyFade;
      const fadeIn = smoothstep(clamp01((p - (a - f)) / f));
      const fadeOut = i < slides.length - 1 ? 1 - smoothstep(clamp01((p - (b - f)) / f)) : 1;
      const op = clamp01(Math.min(fadeIn, fadeOut));
      el.style.opacity = op;
      el.style.transform = 'translateY(' + ((1 - op) * 22) + 'px)';
      el.style.visibility = op > 0.02 ? 'visible' : 'hidden';
    });
  }

  function sync() {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = clamp01(total > 0 ? -rect.top / total : 1);

    applyTimeline(p);
    applyCopy(p);

    progress.style.transform = 'scaleX(' + p + ')';
    hint.style.opacity = 1 - smoothstep(clamp01(p / 0.04));
  }

  function refit() {
    if (!model) return;
    const fov = isMobile() ? CONFIG.camera.fovMobile : CONFIG.camera.fov;
    const vh = 2 * state.nearDist * Math.tan(THREE.MathUtils.degToRad(fov) / 2) * CONFIG.frameFill;
    const vw = vh * camera.aspect;
    const scale = Math.min(vw / Math.max(state.rawSize.x, 0.001), vh / Math.max(state.rawSize.y, 0.001));
    state.baseScale = isMobile() ? scale : scale * 0.90;
    model.scale.setScalar(state.baseScale);
    state.shadowY = state.rawMinY * state.baseScale - 0.01;
    if (shadow) {
      shadow.position.y = state.shadowY + MODEL_Y_OFFSET;
      shadow.position.x = getDesktopX();
    }
  }

  function fitModel(gltfModel) {
    const box = new THREE.Box3().setFromObject(gltfModel);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    gltfModel.position.x -= center.x;
    gltfModel.position.y -= center.y;
    gltfModel.position.z -= center.z;

    state.rawSize = { x: size.x, y: size.y };
    state.rawMinY = box.min.y - center.y;
    state.nearDist = Math.min.apply(null, path.map((pt) => pt.z));
    state.shadowY = state.rawMinY;

    refit();
    gltfModel.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  }

  function addGroundShadow() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0,0,0,.55)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(c);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, state.shadowY, 0);
    mesh.renderOrder = 0;
    shadow = mesh;
    scene.add(mesh);
  }

  function loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cleanup) return;
        model = gltf.scene;
        model.traverse((o) => {
          if (!o.isMesh) return;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if (m && m.envMapIntensity !== undefined) m.envMapIntensity = CONFIG.envIntensity;
          });
        });
        fitModel(model);
        scene.add(model);
        addGroundShadow();
        state.ready = true;
        loadText.textContent = 'Ready';
        sync();
        cbs.onReady();
      },
      (e) => {
        if (e.lengthComputable && e.total) {
          const pct = Math.round((e.loaded / e.total) * 100);
          loadBar.style.width = pct + '%';
          loadText.textContent = 'Preparing the atelier… ' + pct + '%';
        }
      },
      (err) => {
        console.warn('Failed to load 3D model:', MODEL_URL, err);
        cbs.onError();
      }
    );
  }

  function loop() {
    state.raf = requestAnimationFrame(loop);
    if (state.ready && state.visible) renderer.render(scene, camera);
  }

  /* ---- scene ---- */
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.Fog(0x0a0a0a, 14, 26);

  camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, 1, CONFIG.camera.near, CONFIG.camera.far);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x0a0a0a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2));

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = CONFIG.envIntensity;

  scene.add(new THREE.HemisphereLight(0x9a7f5a, 0x0a0a0a, 0.45));

  const key = new THREE.DirectionalLight(0xffe6c4, 2.6);
  key.position.set(3.5, 4.5, 4.5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xdce6ff, 1.35);
  rim.position.set(-4, 2.5, -5);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-3, 1, 4);
  scene.add(fill);

  curve = new THREE.CatmullRomCurve3(path, false, 'centripetal');

  /* ---- resize ---- */
  const onResize = () => {
    const stage = section.querySelector('.showcase-stage');
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = isMobile() ? CONFIG.camera.fovMobile : CONFIG.camera.fov;
    camera.updateProjectionMatrix();
    refit();
    sync();
  };
  window.addEventListener('resize', onResize);
  addCleanup(() => window.removeEventListener('resize', onResize));
  onResize();

  /* ---- scroll ---- */
  const onScroll = () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      scrollPending = false;
      sync();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  addCleanup(() => window.removeEventListener('scroll', onScroll));

  /* ---- visibility gating ---- */
  const visIO = new IntersectionObserver(
    (entries) => {
      const vis = entries.some((e) => e.isIntersecting);
      state.visible = vis;
      if (vis) { if (!state.raf) state.raf = requestAnimationFrame(loop); sync(); } else { cancelAnimationFrame(state.raf); state.raf = 0; }
    },
    { threshold: 0 }
  );
  visIO.observe(section.querySelector('.showcase-stage'));
  addCleanup(() => visIO.disconnect());

  /* ---- lazy-load the model on approach ---- */
  const loadIO = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        loadIO.disconnect();
        try {
          loadModel();
        } catch (err) {
          console.warn('Failed to start 3D showcase:', err);
          cbs.onError();
        }
      }
    },
    { rootMargin: '500px 0px 500px 0px', threshold: 0 }
  );
  loadIO.observe(section.querySelector('.showcase-stage'));
  addCleanup(() => loadIO.disconnect());

  return () => {
    cleanup = true;
    cleanups.forEach((fn) => fn());
    if (renderer) renderer.dispose();
    pmrem.dispose();
  };
}
