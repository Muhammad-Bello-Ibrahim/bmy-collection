/* ============================================================
   BMY Collection · scroll-driven 3D showcase
   ------------------------------------------------------------
   Classic-script build (works served over HTTP or opened from
   file://). Three.js + addons load as plain CDN <script>s that
   expose the global THREE namespace.

   The timeline is deterministic: scroll progress p (0 → 1)
   drives the camera path, the model pose and the editorial
   copy. Scrolling down moves forward, scrolling up reverses —
   no auto-rotation.

   Timeline keyframes (p = scroll progress):
     0.00  model fades in — small, farther, wide cinematic camera
     0.25  model at full scale, camera moved closer
     0.50  model rotated ~90°, camera holds distance
     0.75  camera passes around the model, subtle parallax
     1.00  camera back to hero position, final presentation angle
   ============================================================ */

(function () {
  'use strict';

  /* if the CDN scripts failed, don't touch the DOM — the inline
     guard script in index.html applies the static fallback. */
  if (typeof THREE === 'undefined') return;
  window.BMYShowcase = { booted: true };

  /* ------------------------------------------------------------
     CONFIG — everything worth tuning lives here
     ------------------------------------------------------------ */
  var CONFIG = {
    /* local Sketchfab GLB — swap for your own model file */
    modelUrl: 'models/agbada_cloth_model.glb',

    /* how much of the frame the model fills at the closest camera stop */
    frameFill: 0.85,

    model: {
      /* scale multipliers applied on top of the auto-fit */
      startScale: 0.85,             // 0%
      endScale: 1.0,                // reached by 25%
      /* rotation.y in radians at key stops */
      rotation0: 0,                 // 0%
      rotation50: Math.PI / 2,      // 50% — 90° reveal
      rotation100: Math.PI,         // 100% — final presentation angle
      /* subtle left/right drift during the 50–75% camera pass */
      parallax: 0.12
    },

    camera: {
      fov: 42,
      fovMobile: 46,
      near: 0.1,
      far: 60,
      /* the point the camera always looks at */
      target: new THREE.Vector3(0, 0.1, 0),
      /* cinematic path — stops are visited at 0 / 25 / 50 / 75 / 100% */
      path: [
        new THREE.Vector3(0.0, 1.15, 9.2),  // 0%   wide, farther
        new THREE.Vector3(0.0, 1.05, 6.3),  // 25%  closer
        new THREE.Vector3(1.7, 1.05, 6.4),  // 50%  slight orbit
        new THREE.Vector3(3.1, 0.95, 5.7),  // 75%  side detail
        new THREE.Vector3(0.5, 1.18, 7.7)   // 100% hero position
      ]
    },

    /* fraction of the timeline used to cross-fade between text stages */
    copyFade: 0.06,

    /* how strongly the studio environment map lights the garment */
    envIntensity: 0.8
  };

  /* ------------------------------------------------------------
     Utilities
     ------------------------------------------------------------ */
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(t) { var c = clamp01(t); return c * c * (3 - 2 * c); }
  function isMobile() { return window.matchMedia('(max-width: 720px)').matches; }
  function reduceMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ------------------------------------------------------------
     DOM
     ------------------------------------------------------------ */
  var section = document.getElementById('showcase');
  var stage = section.querySelector('.showcase-stage');
  var canvas = document.getElementById('showcaseCanvas');
  var loadBar = document.getElementById('showcaseLoadBar');
  var loadText = document.getElementById('showcaseLoadText');
  var slides = Array.prototype.slice.call(section.querySelectorAll('.showcase-slide'));
  var progressBar = document.getElementById('showcaseProgressBar');
  var hint = section.querySelector('.showcase-scroll-hint');

  /* ------------------------------------------------------------
     State
     ------------------------------------------------------------ */
  var state = {
    ready: false,      // GLB loaded and placed
    visible: false,    // stage in viewport (render gate)
    baseScale: 1,      // auto-fit scale for the model
    shadowY: -1.8,     // ground shadow height
    rawSize: { x: 1, y: 1 },
    rawMinY: 0,
    nearDist: 6.4,     // closest camera stop (used for auto-fit)
    raf: 0
  };

  var scene, camera, renderer, curve, model, shadow;

  /* ------------------------------------------------------------
     Timeline
     ------------------------------------------------------------ */
  function rotationAt(p) {
    if (p < 0.25) return CONFIG.model.rotation0;
    if (p < 0.5) return lerp(CONFIG.model.rotation0, CONFIG.model.rotation50, smoothstep((p - 0.25) / 0.25));
    if (p < 0.75) return CONFIG.model.rotation50;
    return lerp(CONFIG.model.rotation50, CONFIG.model.rotation100, smoothstep((p - 0.75) / 0.25));
  }

  function applyTimeline(p) {
    if (!state.ready || !model) return;

    /* camera glides along the cinematic path */
    var pos = curve.getPointAt(p);
    camera.position.copy(pos);

    /* subtle parallax + target lift during the 50–75% side pass */
    var side = smoothstep(clamp01((p - 0.5) / 0.25));
    camera.position.x += Math.sin(side * Math.PI) * 0.18;
    var target = CONFIG.camera.target;
    camera.lookAt(target.x, target.y + Math.sin(side * Math.PI) * 0.06, target.z);

    /* model pose */
    var growth = p < 0.25 ? smoothstep(p / 0.25) : 1;
    model.scale.setScalar(state.baseScale * lerp(CONFIG.model.startScale, CONFIG.model.endScale, growth));
    model.rotation.y = rotationAt(p);
    model.position.x = Math.sin(side * Math.PI) * CONFIG.model.parallax;

    /* model fades into view over the first 10% */
    canvas.style.opacity = p < 0.1 ? smoothstep(p / 0.1) : 1;
  }

  function applyCopy(p) {
    slides.forEach(function (el, i) {
      var a = i / 4;
      var b = (i + 1) / 4;
      var fade = CONFIG.copyFade;
      var fadeIn = smoothstep(clamp01((p - (a - fade)) / fade));
      var fadeOut = i < slides.length - 1 ? 1 - smoothstep(clamp01((p - (b - fade)) / fade)) : 1;
      var op = clamp01(Math.min(fadeIn, fadeOut));
      el.style.opacity = op;
      el.style.transform = 'translateY(' + ((1 - op) * 22) + 'px)';
      el.style.visibility = op > 0.02 ? 'visible' : 'hidden';
    });
  }

  function sync() {
    var rect = section.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var p = clamp01(total > 0 ? -rect.top / total : 1);

    applyTimeline(p);
    applyCopy(p);

    progressBar.style.transform = 'scaleX(' + p + ')';
    hint.style.opacity = 1 - smoothstep(clamp01(p / 0.04));
  }

  /* ------------------------------------------------------------
     Scene
     ------------------------------------------------------------ */
  function fitModel(gltfModel) {
    var box = new THREE.Box3().setFromObject(gltfModel);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());

    gltfModel.position.x -= center.x;
    gltfModel.position.y -= center.y;
    gltfModel.position.z -= center.z;

    state.rawSize = { x: size.x, y: size.y };
    state.rawMinY = box.min.y - center.y;
    state.nearDist = Math.min.apply(null, CONFIG.camera.path.map(function (pt) { return pt.z; }));
    state.shadowY = state.rawMinY;

    refit();
    gltfModel.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
  }

  /* re-fit after viewport/aspect changes (mobile rotation, resize) */
  function refit() {
    if (!model) return;
    var fov = isMobile() ? CONFIG.camera.fovMobile : CONFIG.camera.fov;
    var aspect = camera.aspect || 1.6;
    var vh = 2 * state.nearDist * Math.tan(THREE.MathUtils.degToRad(fov) / 2) * CONFIG.frameFill;
    var vw = vh * aspect;
    var scale = Math.min(vw / Math.max(state.rawSize.x, 0.001), vh / Math.max(state.rawSize.y, 0.001));
    state.baseScale = scale;
    model.scale.setScalar(scale);
    state.shadowY = state.rawMinY * scale - 0.01;
    if (shadow) shadow.position.y = state.shadowY;
  }

  function addGroundShadow() {
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0,0,0,.55)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    var tex = new THREE.CanvasTexture(c);
    var mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, state.shadowY, 0);
    mesh.renderOrder = 0;
    shadow = mesh;
    scene.add(mesh);
  }

  function init() {
    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      scene.fog = new THREE.Fog(0x0a0a0a, 14, 26);

      camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, 1, CONFIG.camera.near, CONFIG.camera.far);

      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
      renderer.setClearColor(0x0a0a0a, 1);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.useLegacyLights = false;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2));

      /* cinematic lighting — warm key, cool rim, soft studio environment */
      var pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

      var hemi = new THREE.HemisphereLight(0x9a7f5a, 0x0a0a0a, 0.45);
      scene.add(hemi);

      var key = new THREE.DirectionalLight(0xffe6c4, 2.6);
      key.position.set(3.5, 4.5, 4.5);
      scene.add(key);

      var rim = new THREE.DirectionalLight(0xdce6ff, 1.35);
      rim.position.set(-4, 2.5, -5);
      scene.add(rim);

      var fill = new THREE.DirectionalLight(0xffffff, 0.4);
      fill.position.set(-3, 1, 4);
      scene.add(fill);

      curve = new THREE.CatmullRomCurve3(CONFIG.camera.path, false, 'centripetal');

      onResize();
      loadModel();
    } catch (err) {
      console.warn('WebGL / 3D unavailable — using static fallback.', err);
      fallback();
    }
  }

  function loadModel() {
    var loader = new THREE.GLTFLoader();
    var draco = new THREE.DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(draco);

    loader.load(
      CONFIG.modelUrl,
      function (gltf) {
        model = gltf.scene;
        /* control how strongly the environment lights the dark cloth */
        model.traverse(function (o) {
          if (!o.isMesh) return;
          var mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(function (m) {
            if (m && m.envMapIntensity !== undefined) m.envMapIntensity = CONFIG.envIntensity;
          });
        });
        fitModel(model);
        scene.add(model);
        addGroundShadow();
        section.classList.add('is-loaded');
        state.ready = true;
        loadText.textContent = 'Ready';
        sync();
      },
      function (e) {
        if (e.lengthComputable && e.total) {
          var pct = Math.round((e.loaded / e.total) * 100);
          loadBar.style.width = pct + '%';
          loadText.textContent = 'Preparing the atelier… ' + pct + '%';
        }
      },
      function (err) {
        console.warn('Failed to load 3D model:', CONFIG.modelUrl, err);
        fallback();
      }
    );
  }

  function fallback() {
    section.classList.add('is-static', 'is-loaded');
    stopLoop();
  }

  /* ------------------------------------------------------------
     Render loop (paused when off-screen)
     ------------------------------------------------------------ */
  function loop() {
    state.raf = requestAnimationFrame(loop);
    if (state.ready && state.visible) renderer.render(scene, camera);
  }

  function startLoop() {
    if (!state.raf) state.raf = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (state.raf) { cancelAnimationFrame(state.raf); state.raf = 0; }
  }

  /* ------------------------------------------------------------
     Resize
     ------------------------------------------------------------ */
  function onResize() {
    if (!renderer) return;
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = isMobile() ? CONFIG.camera.fovMobile : CONFIG.camera.fov;
    camera.updateProjectionMatrix();
    refit();
    sync();
  }
  window.addEventListener('resize', onResize);

  /* ------------------------------------------------------------
     Scroll → timeline (rAF-throttled, passive)
     ------------------------------------------------------------ */
  var scrollPending = false;
  window.addEventListener('scroll', function () {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(function () {
      scrollPending = false;
      sync();
    });
  }, { passive: true });

  /* ------------------------------------------------------------
     Visibility gating (only render while the stage is on screen)
     ------------------------------------------------------------ */
  var visIO = new IntersectionObserver(function (entries) {
    var vis = entries.some(function (e) { return e.isIntersecting; });
    state.visible = vis;
    if (vis) { startLoop(); sync(); } else { stopLoop(); }
  }, { threshold: 0 });
  visIO.observe(stage);

  /* ------------------------------------------------------------
     Boot
     ------------------------------------------------------------ */
  if (reduceMotion()) {
    /* respect the user's preference — static editorial frame, no 3D */
    section.classList.add('is-static', 'is-loaded');
  } else {
    /* lazy: only fetch the GLB when the section approaches the viewport */
    var loadIO = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        loadIO.disconnect();
        init();
      }
    }, { rootMargin: '500px 0px 500px 0px', threshold: 0 });
    loadIO.observe(stage);
  }
})();
