// Booster pack 3D model — vanilla three.js
// Lifecycle: waits for #booster-canvas-mount to exist, then mounts a renderer + GLTF model.
// Click → shake → flash → particles → emit "booster-opened" event.

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const BASE_RX = Math.PI / 2;
const BASE_RY = Math.PI / 2;

let mounted = false;

function tryMount() {
  const wrap = document.getElementById("booster-canvas-mount");
  if (!wrap || mounted) return false;
  mounted = true;

  const host = document.getElementById("booster-card-host");
  const loading = document.getElementById("booster-loading");
  const hint = document.getElementById("booster-hint");

  // Renderer
  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 4.5;

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffe0a8, 3.0);
  key.position.set(2, 4, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xff8a3d, 1.2);
  fill.position.set(-4, 1, 2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd87a, 0.8);
  rim.position.set(0, -3, -4); scene.add(rim);

  let model = null;
  let targetRX = 0, targetRY = 0;
  let curRX = 0, curRY = 0;
  let shaking = false, shakeStart = 0;
  let opening = false;

  const loader = new GLTFLoader();
  loader.load(
    "assets/trading_card_pack.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      fitModel();
      if (loading) loading.style.display = "none";
      if (hint) hint.style.display = "flex";
    },
    undefined,
    (err) => {
      console.warn("GLB load failed", err);
      if (loading) loading.textContent = "Click to open";
      if (hint) hint.style.display = "flex";
    }
  );

  function size() {
    return { w: wrap.clientWidth, h: wrap.clientHeight };
  }

  function fitModel() {
    if (!model) return;
    model.rotation.set(BASE_RX, BASE_RY, 0);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const sz = box.getSize(new THREE.Vector3());
    const fov = camera.fov * (Math.PI / 180);
    const fh = 2 * Math.tan(fov / 2) * camera.position.z;
    const fw = fh * camera.aspect;
    const fit = 0.78;
    const scale = Math.min(fh * fit / sz.y, fw * fit / sz.x);
    model.scale.setScalar(scale);
    model.position.copy(center).multiplyScalar(-scale);
  }

  function resize() {
    const { w, h } = size();
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fitModel();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);

  function animate(t) {
    requestAnimationFrame(animate);
    if (model) {
      if (shaking) {
        const dt = (t - shakeStart) / 600;
        if (dt < 1) {
          const sh = Math.sin(dt * Math.PI * 6) * 0.16 * (1 - dt);
          model.rotation.y = BASE_RY + curRY + sh;
          model.rotation.x = BASE_RX + curRX;
        } else {
          shaking = false;
        }
      } else {
        curRX += (targetRX - curRX) * 0.07;
        curRY += (targetRY - curRY) * 0.07;
        model.rotation.x = BASE_RX + curRX;
        model.rotation.y = BASE_RY + curRY;
      }
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  // Mouse tilt + click
  function onMove(e) {
    if (opening) return;
    const r = host.getBoundingClientRect();
    const xn = (e.clientX - r.left) / r.width - 0.5;
    const yn = (e.clientY - r.top) / r.height - 0.5;
    targetRY = xn * 0.35;
    targetRX = -yn * 0.35;
  }
  function onLeave() { targetRX = 0; targetRY = 0; }
  function onClick() {
    if (opening || !model) return;
    opening = true;
    shaking = true;
    shakeStart = performance.now();
    if (hint) hint.style.display = "none";

    // flash + particles overlay
    const flash = document.createElement("div");
    flash.style.cssText = `
      position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:5;
      background:radial-gradient(circle at 50% 50%, rgba(255,255,200,0.95) 0%, rgba(255,180,80,0.7) 20%, rgba(255,138,61,0.3) 45%, transparent 70%);
      mix-blend-mode:screen;opacity:0;transform:scale(0.5);
      transition:opacity 0.3s, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
    `;
    host.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = "1";
      flash.style.transform = "scale(1.5)";
    });

    // particles
    const layer = document.createElement("div");
    layer.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:6;display:flex;align-items:center;justify-content:center;";
    host.appendChild(layer);
    const colors = ["#ffcb05", "#ffffff", "#ff8a3d", "#ffd87a", "#ff6a2a"];
    const chars = ["✦", "★", "✸", "·"];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("span");
      const a = Math.random() * Math.PI * 2;
      const d = 60 + Math.random() * 180;
      const tx = Math.cos(a) * d, ty = Math.sin(a) * d;
      const dur = 0.6 + Math.random() * 0.5;
      const sz = 8 + Math.random() * 12;
      p.textContent = chars[Math.floor(Math.random() * chars.length)];
      p.style.cssText = `
        position:absolute;color:${colors[i % colors.length]};
        font-size:${sz}px;text-shadow:0 0 8px currentColor, 0 0 18px currentColor;
        transform:translate(0,0) scale(0.4);opacity:1;
        transition:transform ${dur}s ease-out, opacity ${dur}s ease-out;
      `;
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${tx}px, ${ty}px) scale(0.1)`;
        p.style.opacity = "0";
      });
    }

    // emit reveal event after animation
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("booster-opened"));
    }, 700);
  }

  host.addEventListener("mousemove", onMove);
  host.addEventListener("mouseleave", onLeave);
  host.addEventListener("click", onClick);

  return true;
}

// poll until React mounts the slot
const tryAgain = () => {
  if (!tryMount()) requestAnimationFrame(tryAgain);
};
window.addEventListener("init-booster", () => {
  mounted = false;
  requestAnimationFrame(tryAgain);
});
requestAnimationFrame(tryAgain);
