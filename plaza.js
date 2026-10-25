/* ======================================================================
   GLONARI PLAZA 210° — the site's first screen (2026-10-24).
   Built on the Digital Banker atrium technology (digital-banker/atrium/
   atrium.js; "Технологическая инструкция Атриум 210"): a 210° cylindrical
   panorama in three.js r128, names engraved into the facades, hover
   highlight (50% dim + gold outline), click only on a move of ≤ 6 px,
   href or a placeholder room screen, and a busy-flag safety timer.
   Shared by index.html (desktop) and mobile/index.html (phones): the
   <script> tag's data-base is the path prefix to the repo root.

   Everything that is usually edited is in the PLAZA block below.
   Coordinates are pixels of the panorama 6516 × 2172.
   ====================================================================== */
const PLAZA = {
  // the hint under the building bar (shown in capitals by plaza.css)
  hint: 'Drag to see more',
  hintTouch: 'Swipe to see more',

  image: {
    full:  'assets/plaza-6516.webp',   // computers
    small: 'assets/plaza-3258.webp',   // phones / small GPUs
    width: 6516, height: 2172,
    spanDeg: 210,      // horizontal coverage of the picture
    horizonY: 1000,    // camera eye level (accepted 2026-10-24: keeps the facades straight)
  },

  // Gia on the fountain. "Double" video like the atrium's gia.mp4: top half =
  // colour (already multiplied by alpha), bottom half = alpha mask.
  // Plays in a loop the whole time the page is open (paused only while the
  // tab is hidden). x — centre, bottom — lower edge, height — frame height
  // (panorama pixels; placed by the user's template 2026-10-24).
  // frameW × frameH — the video's own frame (one half).
  host: {
    video:  'assets/gia-fountain.mp4',
    poster: 'assets/gia-fountain-poster.jpg',
    x: 3186, bottom: 1825, height: 672,
    frameW: 1264, frameH: 628,
  },

  // Corner rounding of every outline, in panorama pixels (Gia and the fountain:
  // converted to frame pixels so it looks the same on screen). An outline point
  // may carry its own radius as a third number: [x, y, r].
  cornerRadius: 25,

  // Buildings, left to right.
  // plaque:  the blank band on the facade the name is engraved into — four
  //          corners [left-top, right-top, right-bottom, left-bottom]
  //          (the bands are drawn in perspective).
  // outline: the building's silhouette (hover/click area and gold outline).
  // href:    where a click goes (relative to the site root); null — the
  //          placeholder room screen.
  buildings: [
    { id: 'journey', name: 'Glonari Journey', href: null,
      plaque: [[636,626],[980,683],[980,725],[636,675]],
      outline: [[468,1300],[468,549],[640,577],[640,481],[970,548],[970,629],[1040,640],[1040,1300]] },
    { id: 'pulse', name: 'Glonari Pulse', href: null,
      plaque: [[1202,703],[1599,759],[1599,797],[1202,747]],
      outline: [[1062,1300],[1062,630],[1205,650],[1205,541],[1585,610],[1585,703],[1636,710],[1636,1300]] },
    { id: 'news', name: 'Glonari News', href: null,
      plaque: [[1810,763],[2167,799],[2167,839],[1810,807]],
      outline: [[1686,1300],[1686,706],[1805,721],[1805,638],[2150,679],[2150,763],[2204,770],[2204,1300]] },
    { id: 'connections', name: 'Global Connections', href: null,
      plaque: [[2330,794],[2730,825],[2730,865],[2330,837]],
      outline: [[2250,1300],[2250,758],[2355,766],[2355,660],[2730,700],[2730,793],[2782,797],[2782,1300]] },
    { id: 'banker', name: 'Digital Banker', href: 'digital-banker/gia/index.html',
      plaque: [[2985,770],[3430,770],[3430,799],[2985,799]],
      outline: [[2863,1295],[2863,757],[3230,606,12],[3572,753],[3572,1295]] },
    { id: 'dream', name: 'Global Dream', href: null,
      plaque: [[3700,821],[4019,783],[4019,834],[3700,864]],
      outline: [[3638,1300],[3638,783],[3684,778],[3684,699],[4015,651],[4015,741],[4122,729],[4122,1300]] },
    { id: 'commercial', name: 'Glonari Commercial', href: null,
      plaque: [[4240,786],[4572,752],[4572,797],[4240,833]],
      outline: [[4190,1300],[4190,747],[4240,742],[4240,664],[4575,620],[4575,708],[4682,697],[4682,1300]] },
    { id: 'homes', name: 'Glonari Homes', href: null,
      plaque: [[4760,753],[5067,721],[5067,767],[4760,801]],
      outline: [[4720,1300],[4720,714],[4789,707],[4789,638],[5065,605],[5065,681],[5185,670],[5185,1300]] },
    { id: 'personas', name: 'Signature Personas', href: null,
      plaque: [[5330,609],[5760,583],[5760,642],[5330,668]],
      outline: [[5237,1300],[5237,615],[5238,606],[5241,598],[5246,589],[5252,581],[5261,572],[5271,563],[5283,555],[5297,546],[5312,538],[5329,530],[5347,523],[5367,515],[5387,509],[5409,502],[5431,496],[5455,491],[5478,486],[5503,482],[5527,478],[5552,475],[5577,473],[5601,471],[5626,470],[5649,470],[5672,470],[5695,471],[5716,473],[5737,475],[5756,478],[5775,482],[5792,486],[5807,491],[5820,496],[5833,502],[5843,508],[5852,515],[5858,522],[5863,530],[5866,538],[5867,546],[5867,546],[5867,1300]] },
  ],

  // Gia and the fountain: outlines in the video frame's own pixels (frameW × frameH).
  gia: { id: 'gia', name: 'Gia', label: 'Meet Gia', href: 'meet-gia/index.html',
    outline: [[428,17],[415,22],[403,31],[390,45],[376,65],[362,94],[357,117],[350,129],[348,141],[331,163],[325,201],[328,241],[327,292],[319,326],[319,339],[306,383],[297,397],[292,402],[285,405],[254,413],[247,419],[247,426],[253,433],[264,435],[304,431],[312,428],[327,425],[348,418],[427,418],[493,430],[497,437],[507,483],[508,525],[514,546],[518,580],[522,592],[528,600],[539,606],[571,614],[585,614],[593,609],[596,601],[595,593],[585,572],[582,551],[585,530],[588,522],[591,517],[595,515],[599,516],[612,535],[618,538],[625,539],[645,535],[697,530],[707,523],[709,518],[709,512],[704,504],[693,497],[677,490],[645,480],[629,471],[618,469],[612,463],[575,355],[562,329],[548,311],[550,301],[541,273],[534,196],[526,162],[513,152],[506,137],[505,126],[509,114],[510,107],[498,74],[481,40],[472,29],[461,22],[446,17],[437,16]] },
  fountain: { id: 'fountain', name: 'Glonari', label: 'Glonari', href: null,
    outline: [[887,206],[887,222],[884,237],[881,252],[875,267],[869,281],[861,294],[851,307],[841,318],[830,329],[817,338],[804,346],[790,352],[775,358],[760,361],[744,364],[729,365],[713,364],[698,361],[683,358],[668,352],[654,346],[641,338],[628,329],[617,318],[606,307],[597,294],[589,281],[582,267],[577,252],[573,237],[571,222],[570,206],[571,190],[573,175],[577,160],[582,145],[589,131],[597,118],[606,105],[617,94],[628,83],[641,74],[654,66],[668,59],[683,54],[698,50],[713,48],[729,47],[744,48],[760,50],[775,54],[790,59],[804,66],[817,74],[830,83],[841,94],[851,105],[861,118],[869,131],[875,145],[881,160],[884,175],[887,190]] },

  roomPlaceholder: 'This room is being prepared. Its content will appear here soon.',
};

/* ====================================================================== */
(() => {
  'use strict';
  const BASE = (document.currentScript && document.currentScript.dataset.base) || '';
  const url = (p) => BASE + p;
  const IMG = PLAZA.image;
  const W = IMG.width, H = IMG.height;
  const SPAN = THREE.MathUtils.degToRad(IMG.spanDeg);
  const R = W / SPAN;                        // cylinder radius in pixels
  const TAN_TOP = IMG.horizonY / R;
  const TAN_BOT = -(H - IMG.horizonY) / R;
  const MAX_SPAN = TAN_TOP - TAN_BOT;
  const MIN_SPAN = MAX_SPAN * 0.42;
  const MAX_HALF_W = Math.tan(THREE.MathUtils.degToRad(80));
  const HOST_DEPTH = 0.8;                    // the video panel stands in front of the panorama
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), svg = $('overlay'), bar = $('bar');
  const roomView = $('room'), roomTitle = $('room-title'), roomText = $('room-text');
  const backBtn = $('back'), veil = $('veil'), nav = $('rooms-nav');

  const coarse = matchMedia('(pointer: coarse)').matches;
  const HINT = coarse ? PLAZA.hintTouch : PLAZA.hint;

  /* ---------- WebGL ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    $('status').textContent = 'This view needs WebGL. Turn on hardware acceleration in your browser settings, then reload the page.';
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();

  /* ---------- picture pixel -> point on the cylinder ---------- */
  const angleOf = (px) => (px - W / 2) / R;
  function toWorld(px, py) {
    const a = angleOf(px);
    return new THREE.Vector3(Math.sin(a), (IMG.horizonY - py) / R, -Math.cos(a));
  }

  /* ---------- the video panel: frame pixel -> point on its flat plane ---------- */
  const HOST = PLAZA.host;
  const hostH = HOST.height, hostW = hostH * (HOST.frameW / HOST.frameH);
  const hostK = hostH / HOST.frameH;          // frame pixels -> picture pixels
  const hostA = angleOf(HOST.x);
  const hostCy = HOST.bottom - hostH / 2;
  const hostCenter = new THREE.Vector3(Math.sin(hostA) * HOST_DEPTH, ((IMG.horizonY - hostCy) / R) * HOST_DEPTH, -Math.cos(hostA) * HOST_DEPTH);
  const hostRight = new THREE.Vector3(Math.cos(hostA), 0, Math.sin(hostA));
  function hostToWorld(fx, fy) {
    const dx = (fx - HOST.frameW / 2) * hostK, dy = (fy - HOST.frameH / 2) * hostK;
    return hostCenter.clone()
      .addScaledVector(hostRight, (dx / R) * HOST_DEPTH)
      .add(new THREE.Vector3(0, (-dy / R) * HOST_DEPTH, 0));
  }
  // picture-pixel position of a frame pixel (for centring the camera on Gia / the fountain)
  const hostToPicture = (fx, fy) => [HOST.x + (fx - HOST.frameW / 2) * hostK, hostCy + (fy - HOST.frameH / 2) * hostK];

  /* ---------- view ---------- */
  const view = { yaw: 0, cy: (TAN_TOP + TAN_BOT) / 2, span: MAX_SPAN };
  const target = { ...view };
  let vel = 0, dirty = true, anim = null;
  let vw = 1, vh = 1, aspect = 1;

  function clampView(v) {
    v.span = THREE.MathUtils.clamp(v.span, MIN_SPAN, MAX_SPAN);
    if ((v.span / 2) * aspect > MAX_HALF_W) v.span = (2 * MAX_HALF_W) / aspect;
    v.cy = THREE.MathUtils.clamp(v.cy, TAN_BOT + v.span / 2, TAN_TOP - v.span / 2);
    const halfH = Math.atan((v.span / 2) * aspect);
    const lim = Math.max(0, SPAN / 2 - halfH);
    v.yaw = THREE.MathUtils.clamp(v.yaw, -lim, lim);
    return v;
  }
  function applyCamera() {
    const n = 0.01, halfW = (view.span / 2) * aspect;
    camera.projectionMatrix.makePerspective(-halfW * n, halfW * n,
      (view.cy + view.span / 2) * n, (view.cy - view.span / 2) * n, n, 10);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    camera.rotation.set(0, -view.yaw, 0);
    camera.updateMatrixWorld(true);
  }
  function resize() {
    vw = stage.clientWidth; vh = stage.clientHeight; aspect = vw / vh;
    renderer.setSize(vw, vh, false);
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    svg.querySelectorAll('.full').forEach((el) => { el.setAttribute('width', vw); el.setAttribute('height', vh); });
    clampView(target); clampView(view); dirty = true;
  }
  addEventListener('resize', resize);

  /* ---------- names engraved into the facade bands (drawn into the texture) ---------- */
  function drawSpaced(ctx, text, x, y, spacing, stroke = false) {
    const chars = [...text];
    const widths = chars.map((c) => ctx.measureText(c).width);
    const total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
    let cx = x - total / 2;
    chars.forEach((c, i) => { stroke ? ctx.strokeText(c, cx, y) : ctx.fillText(c, cx, y); cx += widths[i] + spacing; });
  }
  function textWidth(ctx, text, spacing) {
    return [...text].reduce((s, c) => s + ctx.measureText(c).width, 0) + spacing * (text.length - 1);
  }
  const LH = 1.08, FILL_W = 0.8;   // line height; text ≤ 80% of the band width (instruction §9)
  // Largest size for these lines: by the band height (Cinzel capitals ≈ 0.7 of the size) and by 80% of its width
  function fitSize(ctx, lines, pw, ph) {
    let size = (ph * 0.92) / (0.7 + LH * (lines.length - 1));
    const widest = () => {
      ctx.font = `600 ${size}px Cinzel, "Trajan Pro", Georgia, serif`;
      return Math.max(...lines.map((l) => textWidth(ctx, l, size * 0.14)));
    };
    while (widest() > pw * FILL_W && size > 6) size *= 0.97;
    return size;
  }
  // The name in the band's local coordinates: origin in its centre; a vertical
  // shear tilts the lines along the wall's perspective, the letters stay upright.
  function drawInscription(ctx, b) {
    const [lt, rt, rb, lb] = b.plaque;
    const ml = [(lt[0] + lb[0]) / 2, (lt[1] + lb[1]) / 2];
    const mr = [(rt[0] + rb[0]) / 2, (rt[1] + rb[1]) / 2];
    const pw = mr[0] - ml[0], k = (mr[1] - ml[1]) / pw;
    const ph = Math.min(lb[1] - lt[1], rb[1] - rt[1]);
    // one line, or two when that gives bigger letters (long names, instruction §9)
    const name = b.name.toUpperCase(), words = name.split(' ');
    let lines = [name], size = fitSize(ctx, lines, pw, ph);
    if (words.length > 1) {
      const cut = Math.ceil(words.length / 2), two = [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
      const s2 = fitSize(ctx, two, pw, ph);
      if (s2 > size) { lines = two; size = s2; }
    }
    ctx.font = `600 ${size}px Cinzel, "Trajan Pro", Georgia, serif`;
    const sp = size * 0.14, lh = size * LH;
    const y0 = -(lh * (lines.length - 1)) / 2;
    ctx.save();
    ctx.transform(1, k, 0, 1, (ml[0] + mr[0]) / 2, (ml[1] + mr[1]) / 2);
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    const d = Math.max(1, size * 0.05);
    lines.forEach((line, i) => {
      const y = y0 + i * lh;
      ctx.fillStyle = 'rgba(40, 20, 4, 0.9)';      // shadow of the cut's upper edge
      drawSpaced(ctx, line, 0, y - d * 1.3, sp);
      ctx.fillStyle = 'rgba(255, 250, 236, 0.9)';  // highlight of its lower edge
      drawSpaced(ctx, line, 0, y + d * 1.2, sp);
      const g = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
      g.addColorStop(0, '#6A4214'); g.addColorStop(0.5, '#C8943C'); g.addColorStop(1, '#5C3810');
      ctx.strokeStyle = '#2a1504';
      ctx.lineWidth = Math.max(1, size * 0.035);
      drawSpaced(ctx, line, 0, y, sp, true);
      ctx.fillStyle = g;
      drawSpaced(ctx, line, 0, y, sp);
    });
    ctx.restore();
  }

  /* ---------- cylinder of 4 tiles (fits the texture limit of any phone) ---------- */
  function buildTile(canvas, a0, a1) {
    const seg = 40, pos = [], uv = [], idx = [];
    for (let i = 0; i <= seg; i++) {
      const t = i / seg, a = a0 + (a1 - a0) * t, x = Math.sin(a), z = -Math.cos(a);
      pos.push(x, TAN_TOP, z, x, TAN_BOT, z); uv.push(t, 1, t, 0);
      if (i < seg) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })));
  }
  function buildPanorama(img) {
    const s = img.naturalWidth / W, N = 4, tw = Math.round(img.naturalWidth / N);
    for (let i = 0; i < N; i++) {
      const x0 = (i * W) / N, x1 = ((i + 1) * W) / N;
      const c = document.createElement('canvas');
      c.width = i === N - 1 ? img.naturalWidth - tw * i : tw; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, -tw * i, 0);
      ctx.save(); ctx.scale(s, s); ctx.translate(-x0, 0);
      PLAZA.buildings.forEach((b) => {
        const xs = b.plaque.map(([x]) => x);
        if (Math.max(...xs) > x0 && Math.min(...xs) < x1) drawInscription(ctx, b);
      });
      ctx.restore();
      buildTile(c, angleOf(x0), angleOf(x1));
    }
  }

  /* ---------- Gia on the fountain: flat panel facing the camera, looping video ---------- */
  let hostVideo = null, hostMat = null;
  const alphaShader = {
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    // top half of the frame — colour (already multiplied by alpha), bottom half — the mask
    fragmentShader: 'uniform sampler2D map; varying vec2 vUv; void main(){' +
      ' vec3 c = texture2D(map, vec2(vUv.x, 0.5 + vUv.y * 0.5)).rgb;' +
      ' float a = texture2D(map, vec2(vUv.x, vUv.y * 0.5)).r;' +
      ' if (a < 0.004) discard; gl_FragColor = vec4(c, a); }',
  };
  function buildHost() {
    hostMat = new THREE.ShaderMaterial({
      uniforms: { map: { value: null } }, ...alphaShader,
      transparent: true, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry((hostW / R) * HOST_DEPTH, (hostH / R) * HOST_DEPTH), hostMat);
    mesh.position.copy(hostCenter);
    mesh.rotation.y = -hostA;
    mesh.renderOrder = 3;
    mesh.visible = false;
    scene.add(mesh);
    // poster and video are filtered alike (no mipmaps), so the swap does not change sharpness
    const flat = (tex) => { tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false; return tex; };
    const show = (tex) => { hostMat.uniforms.map.value = tex; mesh.visible = true; dirty = true; };
    new THREE.TextureLoader().load(url(HOST.poster), (t) => { if (!hostMat.uniforms.map.value) show(flat(t)); });
    if (reduceMotion) return;   // "reduce motion": the still poster only

    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto';
    v.src = url(HOST.video);
    hostVideo = v;
    let vtex = null;
    // switch from the poster to the video only once a frame is really decoded (no flash)
    const toVideo = () => {
      if (v.paused || v.readyState < v.HAVE_CURRENT_DATA) return;
      if (!vtex) vtex = flat(new THREE.VideoTexture(v));
      if (hostMat.uniforms.map.value !== vtex) { vtex.needsUpdate = true; show(vtex); }
    };
    if ('requestVideoFrameCallback' in v) {
      const onFrame = () => { toVideo(); dirty = true; v.requestVideoFrameCallback(onFrame); };
      v.requestVideoFrameCallback(onFrame);
    } else {
      v.addEventListener('timeupdate', toVideo);
    }
  }
  // the loop runs all the time the visitor is on the page
  function playHost() {
    if (!hostVideo || document.hidden) return;
    hostVideo.play().catch(() => addEventListener('pointerdown', () => hostVideo.play().catch(() => {}), { once: true }));
  }
  document.addEventListener('visibilitychange', () => {
    if (!hostVideo) return;
    if (document.hidden) hostVideo.pause(); else playHost();
  });

  /* ---------- zones: outlines for hover and click ---------- */
  // straight edges are cut into short pieces, so the outline bends with the cylinder
  function densify(pts, step) {
    const out = [];
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % pts.length];
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
      for (let j = 0; j < n; j++) out.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n]);
    });
    return out;
  }
  // every corner becomes a circular arc; the radius is capped at half of each neighbouring edge
  function roundCorners(pts, r) {
    const out = [];
    pts.forEach((b, i) => {
      const a = pts[(i + pts.length - 1) % pts.length], c = pts[(i + 1) % pts.length];
      const ux = a[0] - b[0], uy = a[1] - b[1], vx = c[0] - b[0], vy = c[1] - b[1];
      const lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
      const ang = Math.acos(THREE.MathUtils.clamp((ux * vx + uy * vy) / (lu * lv), -1, 1));
      let rr = b.length > 2 ? b[2] : r;
      if (!(rr > 0) || ang > Math.PI - 1e-3) { out.push([b[0], b[1]]); return; }
      const t = Math.min(rr / Math.tan(ang / 2), lu / 2, lv / 2);
      rr = t * Math.tan(ang / 2);
      const bx = ux / lu + vx / lv, by = uy / lu + vy / lv, bl = Math.hypot(bx, by), k = rr / Math.sin(ang / 2) / bl;
      const cx = b[0] + bx * k, cy = b[1] + by * k;
      const a1 = Math.atan2(b[1] + (uy / lu) * t - cy, b[0] + (ux / lu) * t - cx);
      const a2 = Math.atan2(b[1] + (vy / lv) * t - cy, b[0] + (vx / lv) * t - cx);
      const da = ((a2 - a1 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
      const n = Math.max(2, Math.ceil((Math.abs(da) * rr) / 6));
      for (let j = 0; j <= n; j++) out.push([cx + rr * Math.cos(a1 + (da * j) / n), cy + rr * Math.sin(a1 + (da * j) / n)]);
    });
    return out;
  }
  const bbox = (pts) => {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs) => { const el = document.createElementNS(SVGNS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
  // Dim everything but the active zone; Gia and the fountain stand in front of
  // the buildings, so they stay dimmed (and cut the gold outline) when a building is active.
  const defs = mk('defs', {});
  const mDim = mk('mask', { id: 'm-dim', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: '100%', height: '100%' });
  const mDimHole = mk('path', { fill: '#000' }), mDimOcc = mk('path', { fill: '#fff' });
  mDim.append(mk('rect', { class: 'full', fill: '#fff' }), mDimHole, mDimOcc);
  const mGlow = mk('mask', { id: 'm-glow', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: '100%', height: '100%' });
  const mGlowOcc = mk('path', { fill: '#000' });
  mGlow.append(mk('rect', { class: 'full', fill: '#fff' }), mGlowOcc);
  defs.append(mDim, mGlow);
  const dimRect = mk('rect', { class: 'dim full', mask: 'url(#m-dim)' });
  const glowPath = mk('path', { class: 'glow', mask: 'url(#m-glow)' });
  svg.append(defs, dimRect, glowPath);

  const zoneList = [
    ...PLAZA.buildings.map((b) => {
      const box = bbox(b.outline);
      return { ...b, kind: 'building', label: `Enter ${b.name}`, world: densify(roundCorners(b.outline, PLAZA.cornerRadius), 40).map(([x, y]) => toWorld(x, y)),
        cx: (box.x0 + box.x1) / 2, cyPx: (box.y0 + box.y1) / 2, hPx: box.y1 - box.y0 };
    }),
    ...[PLAZA.fountain, PLAZA.gia].map((z) => {   // the fountain first: Gia sits in front of it
      const box = bbox(z.outline), [px0, py0] = hostToPicture(box.x0, box.y0), [px1, py1] = hostToPicture(box.x1, box.y1);
      return { ...z, kind: 'host', world: densify(roundCorners(z.outline, PLAZA.cornerRadius / hostK), 30).map(([x, y]) => hostToWorld(x, y)),
        cx: (px0 + px1) / 2, cyPx: (py0 + py1) / 2, hPx: py1 - py0 };
    }),
  ];
  // DOM order = back to front: buildings, then the fountain, then Gia (on top for the pointer)
  const zones = zoneList.map((z) => {
    const hit = mk('path', { class: 'door', 'data-room': z.id });
    svg.appendChild(hit);
    return { ...z, hit, d: '' };
  });
  // keyboard / screen-reader buttons, left to right
  const ordered = [...zones].sort((a, b) => a.cx - b.cx);
  ordered.forEach((z) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = z.label; btn.dataset.room = z.id;
    nav.appendChild(btn); z.btn = btn;
  });
  const byId = Object.fromEntries(zones.map((z) => [z.id, z]));
  const hostZones = zones.filter((z) => z.kind === 'host');

  /* ---------- building bar: one icon per building, a line with dots, the hint ----------
     The active icon is the building nearest the centre of the screen; a
     click turns the camera to it and highlights it (like ‹ ›), never enters.
     The hint shows the hovered/focused zone's label (instruction §9) and is
     read out by screen readers; the icon row is hidden from them. */
  const BAR_ICON = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 11.5 16 4l12 7.5ZM5 13.5h22M7.5 15.5v9M12.5 15.5v9M19.5 15.5v9M24.5 15.5v9M5 26.5h22M3.5 28.5h25"/></svg>';
  const barRow = document.createElement('div');
  barRow.className = 'bar-row'; barRow.setAttribute('aria-hidden', 'true');
  const barItems = zones.filter((z) => z.kind === 'building').map((z) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.tabIndex = -1; btn.innerHTML = `${BAR_ICON}<i></i>`;
    btn.addEventListener('click', () => { if (inRoom || busyFlag) return; setActive(z.id); pinBar(z); lookAt(z); });
    barRow.appendChild(btn);
    return { z, btn };
  });
  const barHint = document.createElement('p');
  barHint.className = 'bar-hint'; barHint.setAttribute('aria-live', 'polite'); barHint.textContent = HINT;
  bar.append(barRow, barHint);
  // After an icon or ‹ › picks a building, its icon stays active until the
  // visitor moves the camera (drag, pinch, wheel, keys, Tab, entering): at the
  // picture's edges the camera stops short of centring Journey / Personas.
  let barOn = null, barPin = null;
  const pinBar = (z) => { barPin = barItems.find((it) => it.z === z) || null; dirty = true; };
  function updateBar() {
    let best = barPin, bd = Infinity;
    if (!best) barItems.forEach((it) => { const d = Math.abs(angleOf(it.z.cx) - view.yaw); if (d < bd) { bd = d; best = it; } });
    if (best === barOn) return;
    if (barOn) barOn.btn.classList.remove('on');
    best.btn.classList.add('on'); barOn = best;
  }

  const tmp = new THREE.Vector3();
  function project(list) {
    let out = '';
    for (let i = 0; i < list.length; i++) {
      tmp.copy(list[i]).applyMatrix4(camera.matrixWorldInverse);
      if (tmp.z > -0.02) return '';
      tmp.applyMatrix4(camera.projectionMatrix);
      out += `${i ? 'L' : 'M'}${((tmp.x + 1) / 2 * vw).toFixed(1)} ${((1 - tmp.y) / 2 * vh).toFixed(1)}`;
    }
    return out + 'Z';
  }
  function updateOverlay() {
    zones.forEach((z) => {
      z.d = project(z.world);
      z.hit.setAttribute('d', z.d);
      z.hit.style.display = z.d ? '' : 'none';
    });
    const a = active && byId[active];
    const occ = a && a.kind === 'building' ? hostZones.map((z) => z.d).join('') : '';
    mDimHole.setAttribute('d', a ? a.d : '');
    mDimOcc.setAttribute('d', occ);
    mGlowOcc.setAttribute('d', occ);
    glowPath.setAttribute('d', a ? a.d : '');
  }

  /* ---------- custom cursor (index.html and mobile/index.html, mouse only) ----------
     Copy of glonari.com's: the dot sits on the mouse, the ring trails it
     (0.18 per frame, 1 under reduced motion); .is-hot while the mouse is
     over a zone, .is-away while it is off the page. */
  const ggDot = document.querySelector('.gg-dot'), ggRing = document.querySelector('.gg-ring');
  const gg = ggDot && ggRing && matchMedia('(hover: hover) and (pointer: fine)').matches;
  function cursorHot(on) { if (gg) ggDot.classList.toggle('is-hot', on); }
  if (gg) {
    const lag = reduceMotion ? 1 : 0.18;
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
    const away = (on) => { ggDot.classList.toggle('is-away', on); ggRing.classList.toggle('is-away', on); };
    document.documentElement.addEventListener('pointerleave', () => away(true));
    document.documentElement.addEventListener('pointerenter', () => away(false));
    (function follow() {
      rx += (mx - rx) * lag; ry += (my - ry) * lag;
      ggDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ggRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- active zone (hover or focus) ---------- */
  let active = null;
  function setActive(id) {
    if (active === id) return;
    active = id;
    if (!id) cursorHot(false);
    svg.classList.toggle('has-active', !!id);
    stage.classList.toggle('pointing', !!id);
    barHint.textContent = id ? byId[id].label : HINT;
    dirty = true;
  }

  /* ---------- view animation ---------- */
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let animDone = null;
  function animateTo(to, ms, done) {
    // an interrupted animation still runs its completion (frees busy/locked state)
    if (anim && animDone) { const prev = animDone; animDone = null; prev(); }
    animDone = done || null;
    const from = { ...view };
    const t0 = performance.now();
    vel = 0;
    anim = (now) => {
      const t = Math.min(1, (now - t0) / ms), k = ease(t);
      view.yaw = from.yaw + (to.yaw - from.yaw) * k;
      view.cy = from.cy + (to.cy - from.cy) * k;
      view.span = from.span + (to.span - from.span) * k;
      clampView(view); Object.assign(target, view); dirty = true;
      if (t >= 1) { anim = null; const cb = animDone; animDone = null; cb && cb(); }
    };
  }
  function lookAt(z) {
    animateTo(clampView({ yaw: angleOf(z.cx), cy: view.cy, span: view.span }), reduceMotion ? 1 : 700);
  }

  /* ---------- entering a zone and coming back ---------- */
  let inRoom = null, savedView = null, busyFlag = false, busyTimer = 0, leftFor = null;
  const setBusy = (v) => {
    busyFlag = v; clearTimeout(busyTimer);
    if (v) busyTimer = setTimeout(() => { busyFlag = false; }, 4000);   // safety net (instruction §11)
  };
  function enterZone(id) {
    const z = byId[id];
    if (!z || busyFlag || inRoom) return;
    setBusy(true); savedView = { ...view }; setActive(id); cursorHot(false); pinBar(null);
    document.body.classList.add('entering');
    const to = { yaw: angleOf(z.cx), cy: (IMG.horizonY - z.cyPx) / R, span: (z.hPx / R) * 0.62 };
    animateTo(to, reduceMotion ? 1 : 1150, () => {
      veil.classList.add('on');
      setTimeout(() => {
        if (z.href) { leftFor = id; location.href = url(z.href); return; }
        document.body.classList.remove('entering');
        inRoom = id;
        roomTitle.textContent = z.name;
        roomText.textContent = PLAZA.roomPlaceholder;
        roomView.hidden = false;
        document.body.classList.add('in-room');
        requestAnimationFrame(() => { veil.classList.remove('on'); roomView.classList.add('shown'); });
        backBtn.focus({ preventScroll: true });
        setBusy(false);
      }, reduceMotion ? 60 : 380);
    });
  }
  function leaveRoom() {
    if (!inRoom || busyFlag) return;
    setBusy(true);
    const z = byId[inRoom];
    veil.classList.add('on');
    setTimeout(() => {
      roomView.classList.remove('shown'); roomView.hidden = true;
      document.body.classList.remove('in-room');
      inRoom = null; veil.classList.remove('on');
      document.body.classList.remove('entering');
      animateTo(clampView({ ...savedView }), reduceMotion ? 1 : 900, () => { setBusy(false); });
      setActive(null);
      // focus goes back to the zone's button without starting another camera move (instruction §11)
      restoringFocus = true; z.btn.focus({ preventScroll: true }); restoringFocus = false;
    }, reduceMotion ? 60 : 380);
  }
  backBtn.addEventListener('click', leaveRoom);

  // Browser Back from Digital Banker / Meet Gia: the page can come back from the
  // back/forward cache exactly as it was left (veil on, camera pushed in).
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    playHost();
    if (!leftFor) return;
    leftFor = null;
    veil.classList.remove('on');
    document.body.classList.remove('entering');
    setActive(null);
    setBusy(false);
    if (savedView) animateTo(clampView({ ...savedView }), reduceMotion ? 1 : 900);
  });

  /* ---------- mouse, finger, wheel ---------- */
  const pointers = new Map();
  let drag = null, pinch = null;
  const radPerPx = () => (2 * Math.atan((view.span / 2) * aspect)) / vw;

  stage.addEventListener('pointerdown', (e) => {
    if (inRoom || busyFlag) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture(e.pointerId);
    if (anim && animDone) { const cb = animDone; animDone = null; cb(); }
    anim = null; vel = 0;
    if (pointers.size === 1) {
      const el = e.target.closest && e.target.closest('[data-room]');
      drag = { lx: e.clientX, ly: e.clientY, moved: 0, room: el ? el.dataset.room : null };
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), span: target.span };
      drag = null; pinBar(null);
    }
  });
  stage.addEventListener('pointermove', (e) => {
    if (inRoom) return;
    if (!pointers.has(e.pointerId)) {
      if (e.pointerType === 'mouse' && !busyFlag) {
        const el = e.target.closest && e.target.closest('[data-room]');
        setActive(el ? el.dataset.room : null);
        cursorHot(!!el);
      }
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      target.span = pinch.span * (pinch.dist / Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)));
      clampView(target); dirty = true; return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    drag.lx = e.clientX; drag.ly = e.clientY;
    if (drag.moved > 6) {   // more than 6 px — a drag, never a click
      stage.classList.add('dragging'); pinBar(null);
      const k = radPerPx();
      target.yaw -= dx * k; vel = -dx * k;
      target.cy += dy * (view.span / vh);
      clampView(target); dirty = true;
    }
  });
  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    stage.classList.remove('dragging');
    if (drag && pointers.size === 0) {
      if (drag.moved <= 6 && drag.room && e.type === 'pointerup') enterZone(drag.room);
      drag = null;
    }
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !pointers.size) setActive(null); });
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (inRoom || busyFlag) return;
    anim = null; pinBar(null);
    target.span *= Math.exp(e.deltaY * 0.0012);
    clampView(target); dirty = true;
  }, { passive: false });

  /* ---------- ‹ › to the neighbouring zone (phones and narrow screens) ---------- */
  function stepZone(dir) {
    if (inRoom || busyFlag) return;
    const cur = active ? angleOf(byId[active].cx) : view.yaw;
    const eps = active ? 0.005 : 0.06;
    const list = dir > 0 ? ordered : [...ordered].reverse();
    const next = list.find((z) => (angleOf(z.cx) - cur) * dir > eps) || list[list.length - 1];
    setActive(next.id); pinBar(next); lookAt(next);
  }
  $('prev').addEventListener('click', () => stepZone(-1));
  $('next').addEventListener('click', () => stepZone(1));

  /* ---------- keyboard ---------- */
  let restoringFocus = false;
  nav.addEventListener('focusin', (e) => {
    const id = e.target.dataset.room; if (!id || inRoom || busyFlag || restoringFocus) return;
    setActive(id); pinBar(null); lookAt(byId[id]);
  });
  nav.addEventListener('focusout', () => { if (!inRoom && !busyFlag) setActive(null); });
  nav.addEventListener('click', (e) => { const id = e.target.dataset && e.target.dataset.room; if (id) enterZone(id); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inRoom) { leaveRoom(); return; }
    if (inRoom || busyFlag) return;
    const step = 0.09;
    if (e.key === 'ArrowLeft') target.yaw -= step;
    else if (e.key === 'ArrowRight') target.yaw += step;
    else if (e.key === 'ArrowUp') target.cy += step * 0.5;
    else if (e.key === 'ArrowDown') target.cy -= step * 0.5;
    else if (e.key === '+' || e.key === '=') target.span *= 0.88;
    else if (e.key === '-') target.span /= 0.88;
    else return;
    e.preventDefault(); anim = null; pinBar(null); clampView(target); dirty = true;
  });

  /* ---------- frame loop: render only when something changed ---------- */
  function tick(now) {
    requestAnimationFrame(tick);
    if (anim) anim(now);
    else {
      if (!drag && vel) { target.yaw += vel; vel *= 0.92; if (Math.abs(vel) < 1e-5) vel = 0; clampView(target); dirty = true; }
      const f = 0.2;
      const dy = target.yaw - view.yaw, dc = target.cy - view.cy, ds = target.span - view.span;
      if (Math.abs(dy) + Math.abs(dc) + Math.abs(ds) > 1e-6) {
        view.yaw += dy * f; view.cy += dc * f; view.span += ds * f; clampView(view); dirty = true;
      }
    }
    if (hostVideo && !hostVideo.paused && !('requestVideoFrameCallback' in hostVideo)) dirty = true;
    if (!dirty) return;
    dirty = false;
    applyCamera();
    renderer.render(scene, camera);
    updateOverlay();
    updateBar();
  }

  /* ---------- loading ---------- */
  const small = Math.min(screen.width, screen.height) < 700 ||
    renderer.capabilities.maxTextureSize < 4096;
  const img = new Image();
  img.decoding = 'async';
  img.src = url(small ? IMG.small : IMG.full);
  const fontsReady = Promise.race([
    document.fonts ? document.fonts.load('600 64px Cinzel') : Promise.resolve(),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
  Promise.all([img.decode ? img.decode() : new Promise((r) => (img.onload = r)), fontsReady])
    .then(() => {
      buildHost();
      buildPanorama(img);
      resize();
      if (!reduceMotion) {   // opening turn −29° → 0° over 2.4 s (instruction §10)
        view.yaw = -0.5; clampView(view); Object.assign(target, view);
        animateTo(clampView({ yaw: 0, cy: view.cy, span: view.span }), 2400);
      }
      requestAnimationFrame(tick);
      document.body.classList.add('ready');
      playHost();
    })
    .catch(() => { $('status').textContent = 'The plaza image did not load. Check that the assets folder is in place, then reload.'; });
})();
