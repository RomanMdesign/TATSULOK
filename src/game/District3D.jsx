import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { missionChoices } from "./MissionSystem";

function makeNoiseTexture(w, h, base, variance, stripes = false) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const n = (Math.random() - 0.5) * variance;
    let r = ((base >> 16) & 255) + n, g = ((base >> 8) & 255) + n, b = (base & 255) + n;
    if (stripes && (i % w) % 18 < 2) { r -= 18; g -= 18; b -= 14; }
    const o = i * 4;
    img.data[o] = Math.max(0, Math.min(255, r));
    img.data[o + 1] = Math.max(0, Math.min(255, g));
    img.data[o + 2] = Math.max(0, Math.min(255, b));
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function District3D({ mission, activeCharacter, playerName, onExit, onComplete }) {
  const mountRef = useRef(null);
  const playerRef = useRef({ x: 0, z: 14, yaw: 0, pitch: 0, running: false });
  const keysRef = useRef({});
  const joyRef = useRef({ active: false, x: 0, y: 0 });
  const lookRef = useRef({ active: false, id: null, x: 0, y: 0 });
  const stageRef = useRef(0);
  const interactRef = useRef(null);
  const viewRef = useRef("first");
  const lootRef = useRef([]);
  const statsRef = useRef({ hp: 100, food: 88, stam: 100, scrap: 0, wood: 0 });
  const [distance, setDistance] = useState(0);
  const [objective, setObjective] = useState("REACH THE FLOODED AREA");
  const [canInteract, setCanInteract] = useState(false);
  const [interactLabel, setInteractLabel] = useState("APPROACH");
  const [dialogue, setDialogue] = useState(null);
  const [choices, setChoices] = useState(null);
  const [craftOpen, setCraftOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);
  const [view, setView] = useState("first");
  const [hp, setHp] = useState(100);
  const [food, setFood] = useState(88);
  const [stam, setStam] = useState(100);
  const [scrap, setScrap] = useState(0);
  const [wood, setWood] = useState(0);
  const [slots, setSlots] = useState(["HATCHET", "TORCH", "", "", "BOW"]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [toast, setToast] = useState("");

  const ROUTE = { flood: { x: 0, z: -18 }, survivor: { x: 5, z: -38 }, clue: { x: -5, z: -52 }, side: { x: 7, z: -74 }, supplies: { x: -6, z: -88 }, evac: { x: 0, z: -118 } };
  const STAGES = [
    { name: "REACH THE FLOODED AREA", pos: ROUTE.flood },
    { name: "FIND THE SURVIVOR", pos: ROUTE.survivor, talk: "TALK" },
    { name: "INVESTIGATE THE CLUE", pos: ROUTE.clue, talk: "INVESTIGATE" },
    { name: "FIND ANOTHER WAY THROUGH", pos: ROUTE.side },
    { name: "COLLECT RELIEF SUPPLIES", pos: ROUTE.supplies, talk: "COLLECT" },
    { name: "REACH THE EVACUATION CENTER", pos: ROUTE.evac, talk: "INTERACT" }
  ];

  const toggleView = () => {
    const next = viewRef.current === "first" ? "third" : "first";
    viewRef.current = next;
    setView(next);
  };

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") { playerRef.current.running = true; setRunning(true); }
      if (e.code === "KeyE") doInteract();
      if (e.code === "KeyV") toggleView();
      if (e.code === "KeyC") setCraftOpen((v) => !v);
      if (e.code === "Digit1") setActiveSlot(0);
      if (e.code === "Digit2") setActiveSlot(1);
      if (e.code === "Digit3") setActiveSlot(2);
      if (e.code === "Escape") document.exitPointerLock?.();
    };
    const up = (e) => {
      keysRef.current[e.code] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") { playerRef.current.running = false; setRunning(false); }
    };
    const onLock = () => setLocked(!!document.pointerLockElement);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    document.addEventListener("pointerlockchange", onLock);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      document.removeEventListener("pointerlockchange", onLock);
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1218);
    scene.fog = new THREE.Fog(0x0b1218, 28, 95);
    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.08, 180);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const concreteTex = makeNoiseTexture(128, 128, 0x6a6863, 28); concreteTex.repeat.set(4, 6);
    const plasterTex = makeNoiseTexture(128, 128, 0x8a7d6e, 22); plasterTex.repeat.set(3, 5);
    const brickTex = makeNoiseTexture(128, 128, 0x6b4a3a, 30, true); brickTex.repeat.set(5, 8);
    const asphaltTex = makeNoiseTexture(256, 256, 0x1a1d20, 16); asphaltTex.repeat.set(2, 18);
    const walkTex = makeNoiseTexture(128, 128, 0x7a776f, 18); walkTex.repeat.set(3, 16);
    const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0.08, ...extra });
    const addBox = (w, h, d, mat, x, y, z, parent = scene) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z); parent.add(mesh); return mesh;
    };
    const matRoad = std(0xffffff, { map: asphaltTex, roughness: 0.55, metalness: 0.12 });
    const matWalk = std(0xffffff, { map: walkTex, roughness: 0.9 });
    const matRoof = std(0x2a2e31, { roughness: 0.7 });
    const matDark = std(0x2c3033);
    const matRust = std(0x6a3b28, { roughness: 0.7, metalness: 0.35 });
    const matWood = std(0x5c3a22);
    const matSand = std(0xc4b07a);
    const matMetal = std(0x6d7377, { metalness: 0.65, roughness: 0.35 });
    const matYellow = new THREE.MeshStandardMaterial({ color: 0xffc52e, emissive: 0x3a2a00, roughness: 0.4 });
    const matWater = new THREE.MeshStandardMaterial({ color: 0x1a4d5e, roughness: 0.12, metalness: 0.55, transparent: true, opacity: 0.72 });
    const matRed = std(0x7a1f1f);
    const matDrum = std(0x2f5d86, { metalness: 0.45, roughness: 0.4 });
    const matGlassOff = std(0x0c1820, { roughness: 0.2, metalness: 0.4, emissive: 0x02080c });
    const matGlassOn = std(0x1c2a18, { roughness: 0.25, metalness: 0.2, emissive: 0xffc46a, emissiveIntensity: 0.55 });
    const matGlassCool = std(0x102018, { roughness: 0.25, metalness: 0.2, emissive: 0x7ec8ff, emissiveIntensity: 0.35 });

    addBox(140, 0.4, 240, std(0x3d403c, { map: concreteTex }), 0, -0.22, -55);
    addBox(11.6, 0.08, 210, matRoad, 0, 0.02, -55);
    addBox(7.2, 0.14, 210, matWalk, -10.2, 0.08, -55);
    addBox(7.2, 0.14, 210, matWalk, 10.2, 0.08, -55);
    for (let z = 14; z > -160; z -= 7.5) addBox(0.16, 0.03, 2.6, matYellow, 0, 0.07, z);
    addBox(36, 0.08, 10, matRoad, -16, 0.02, -74);
    addBox(34, 0.08, 10, matRoad, 16, 0.02, -101);

    const colliders = [];
    const addCol = (x, z, w, d) => colliders.push({ x, z, hw: w / 2, hd: d / 2 });
    const facadeMats = [
      std(0xffffff, { map: plasterTex, roughness: 0.88 }),
      std(0xffffff, { map: brickTex, roughness: 0.9 }),
      std(0x5f6463, { map: concreteTex, roughness: 0.82 }),
      std(0x4e3b32, { roughness: 0.86 }),
      std(0x4a5050, { roughness: 0.8 })
    ];
    const building = (x, z, w, d, h, matIndex = 0) => {
      addBox(w, h, d, facadeMats[matIndex % facadeMats.length], x, h / 2, z);
      addBox(w + 0.7, 0.28, d + 0.7, matRoof, x, h + 0.08, z);
      addCol(x, z, w, d);
      addBox(2.4, 2.6, 0.12, matDark, x, 1.35, z + d / 2 + 0.08);
      addBox(2.6, 0.16, 1.4, matRust, x, 2.72, z + d / 2 + 0.55);
      const cols = Math.max(3, Math.floor(w / 2.4));
      const rows = Math.max(3, Math.floor((h - 3.4) / 2.35));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const lit = (c * 3 + r * 7 + matIndex) % 5 !== 0;
        const glass = !lit ? matGlassOff : ((c + r) % 7 === 0 ? matGlassCool : matGlassOn);
        addBox(1.05, 1.25, 0.07, glass, x - w / 2 + 1.6 + c * 2.35, 4.1 + r * 2.35, z + d / 2 + 0.04);
      }
    };
    building(-23.5, -4, 16.5, 15.5, 16, 0);
    building(-23.8, -28, 15.2, 14.8, 12, 1);
    building(-24.2, -52, 16.8, 16, 18, 2);
    building(-23.6, -84, 15.8, 15.2, 13, 1);
    building(-24.4, -116, 17.4, 16.2, 17, 0);
    building(23.6, -6, 16.8, 16.2, 19, 2);
    building(23.4, -32, 15.6, 15.4, 14, 4);
    building(24.0, -56, 16.6, 16.2, 17, 1);
    building(23.5, -86, 15.8, 15.2, 12, 3);
    building(24.2, -118, 18.2, 16.6, 16, 0);

    for (let z = 10; z > -150; z -= 14) {
      [-1, 1].forEach((side) => {
        const px = side * 7.35;
        addBox(0.14, 5.4, 0.14, matMetal, px, 2.7, z);
        addBox(0.7, 0.12, 0.7, matYellow, px, 5.5, z);
        const bulb = new THREE.PointLight(0xffd089, 1.6, 13, 1.7);
        bulb.position.set(px, 5.25, z); scene.add(bulb);
      });
    }

    const tree = (x, z) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 3.4, 6), matWood);
      trunk.position.set(x, 1.7, z); scene.add(trunk);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(1.35, 8, 6), std(0x1f4a2c));
      crown.position.set(x, 3.6, z); scene.add(crown);
    };
    [[-8.2, -12], [8.1, -24], [-8.3, -46], [8.2, -80], [-8.1, -108]].forEach(([x, z]) => tree(x, z));

    const flood = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.4, 0.16, 20), matWater);
    flood.rotation.x = 0; flood.position.set(0, 0.08, -20); scene.add(flood);

    const loot = [];
    const addBarrel = (x, z) => {
      const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 1.05, 12), matDrum);
      drum.position.y = 0.55; g.add(drum);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 12), matMetal);
      lid.position.y = 1.08; g.add(lid);
      loot.push({ type: "barrel", x, z, taken: false, mesh: g });
    };
    addBarrel(-4.6, -8); addBarrel(4.8, -22); addBarrel(-4.4, -44); addBarrel(4.6, -62); addBarrel(-4.8, -96);
    lootRef.current = loot;

    const makePerson = (shirt, vestCol) => {
      const g = new THREE.Group();
      const legs = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.55, 3, 6), std(0x1c2422));
      legs.position.y = 0.55; g.add(legs);
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.7, 4, 8), std(shirt));
      torso.position.y = 1.2; g.add(torso);
      const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.45, 8), std(vestCol));
      vest.position.y = 1.28; g.add(vest);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), std(0xc49a78));
      head.position.y = 1.82; g.add(head);
      return g;
    };
    const npc = makePerson(0x2a3a32, 0xc9a23a); npc.position.set(5, 0, -38); scene.add(npc);
    const hero = makePerson(0x1e2a28, 0xb42323); scene.add(hero);

    const clue = new THREE.Group(); clue.position.set(-5, 0, -52); scene.add(clue);
    addBox(0.7, 1.15, 0.12, matYellow, 0, 0.7, 0, clue);
    addBox(12.5, 1.05, 0.35, matRed, 0, 0.55, -68);
    addBox(1.6, 1.1, 0.55, matSand, -4.2, 0.55, -67.2);
    addBox(1.6, 1.1, 0.55, matSand, 4.2, 0.55, -67.2);
    const supplies = new THREE.Group(); supplies.position.set(-6, 0, -88); scene.add(supplies);
    for (let i = 0; i < 3; i++) addBox(1.05, 0.72, 0.9, matWood, i * 1.12, 0.36, 0, supplies);
    const evac = new THREE.Group(); evac.position.set(0, 0, -122); scene.add(evac);
    addBox(18, 8.2, 14, std(0x5d6160, { map: concreteTex }), 0, 4.1, 0, evac);
    addBox(19, 0.35, 15, matRoof, 0, 8.35, 0, evac);
    addBox(3.6, 3.4, 0.2, matDark, 0, 1.7, 7.15, evac);
    addBox(10, 0.55, 0.18, matRed, 0, 5.7, 7.2, evac);
    const marker = new THREE.Group(); scene.add(marker);
    const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), new THREE.MeshBasicMaterial({ color: 0xffd24a }));
    diamond.position.y = 2.6; marker.add(diamond);
    scene.add(new THREE.HemisphereLight(0x8aa4b8, 0x0a0c0b, 0.55));
    const moon = new THREE.DirectionalLight(0xc9d6e2, 0.45); moon.position.set(-40, 50, 10); scene.add(moon);
    const fill = new THREE.DirectionalLight(0xffc27a, 0.22); fill.position.set(20, 18, 8); scene.add(fill);

    const blocked = (x, z) => {
      if (x < -5.7 || x > 5.7) {
        if ((z > -79 && z < -69) || (z > -106 && z < -96)) return Math.abs(x) > 20;
        if (Math.abs(x) > 20) return true;
      }
      for (const b of colliders) if (x > b.x - b.hw - 0.5 && x < b.x + b.hw + 0.5 && z > b.z - b.hd - 0.5 && z < b.z + b.hd + 0.5) return true;
      if (z < -67 && z > -70 && Math.abs(x) < 6.4) return true;
      if (z > 16 || z < -140) return true;
      return false;
    };
    const near = (a, b, r) => Math.hypot(a.x - b.x, a.z - b.z) <= r;
    let hudTick = 0;
    const clock = new THREE.Clock(); let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.04);
      const p = playerRef.current, keys = keysRef.current, st = statsRef.current;
      let mx = 0, mz = 0;
      if (keys.KeyW || keys.ArrowUp) mz += 1;
      if (keys.KeyS || keys.ArrowDown) mz -= 1;
      if (keys.KeyA || keys.ArrowLeft) mx -= 1;
      if (keys.KeyD || keys.ArrowRight) mx += 1;
      mx += joyRef.current.x; mz += -joyRef.current.y;
      const len = Math.hypot(mx, mz); if (len > 1) { mx /= len; mz /= len; }
      const moving = len > 0.05;
      if (p.running && moving) st.stam = Math.max(0, st.stam - dt * 18);
      else st.stam = Math.min(100, st.stam + dt * 12);
      st.food = Math.max(8, st.food - dt * 0.35);
      const canRun = p.running && st.stam > 4;
      const speed = canRun ? 7.2 : 4.4;
      const fwdX = -Math.sin(p.yaw), fwdZ = -Math.cos(p.yaw), rightX = Math.cos(p.yaw), rightZ = -Math.sin(p.yaw);
      const nx = p.x + (rightX * mx + fwdX * mz) * speed * dt;
      const nz = p.z + (rightZ * mx + fwdZ * mz) * speed * dt;
      if (!blocked(nx, p.z)) p.x = nx;
      if (!blocked(p.x, nz)) p.z = nz;
      hero.position.set(p.x, 0, p.z);
      hero.rotation.y = p.yaw;
      hero.visible = viewRef.current === "third";
      if (viewRef.current === "first") {
        camera.position.set(p.x, 1.68, p.z);
        camera.rotation.order = "YXZ"; camera.rotation.y = p.yaw; camera.rotation.x = p.pitch;
      } else {
        const back = 4.2, lift = 2.15;
        camera.position.set(p.x + Math.sin(p.yaw) * back, lift - p.pitch * 0.6, p.z + Math.cos(p.yaw) * back);
        camera.lookAt(p.x, 1.35, p.z);
      }
      const stage = STAGES[stageRef.current];
      let label = "APPROACH", ready = false, target = null;
      const barrel = lootRef.current.find((b) => !b.taken && near(p, b, 2.1));
      if (barrel) { label = "LOOT BARREL"; ready = true; target = { kind: "loot", barrel }; }
      else if (stage) {
        marker.position.set(stage.pos.x, 0, stage.pos.z);
        diamond.rotation.y += dt * 2;
        const meters = Math.round(Math.hypot(p.x - stage.pos.x, p.z - stage.pos.z));
        setDistance(meters);
        if (stageRef.current === 0 && meters <= 6) { stageRef.current = 1; setObjective(STAGES[1].name); }
        if (stageRef.current === 3 && p.z < -72) { stageRef.current = 4; setObjective(STAGES[4].name); }
        const talk = stage.talk && near(p, stage.pos, stageRef.current === 5 ? 6 : 3.2);
        if (talk) { label = stage.talk; ready = true; target = { kind: "mission", s: stageRef.current }; }
      }
      setCanInteract(ready); setInteractLabel(label); interactRef.current = target;
      hudTick += dt;
      if (hudTick > 0.25) {
        hudTick = 0;
        setHp(Math.round(st.hp)); setFood(Math.round(st.food)); setStam(Math.round(st.stam));
        setScrap(st.scrap); setWood(st.wood);
      }
      renderer.render(scene, camera);
    };
    tick();
    const resize = () => { camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1); camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight, false); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); };
  }, []);

  const doInteract = () => {
    const t = interactRef.current;
    if (!t) return;
    if (t.kind === "loot" && t.barrel && !t.barrel.taken) {
      t.barrel.taken = true;
      t.barrel.mesh.visible = false;
      statsRef.current.scrap += 8 + Math.floor(Math.random() * 7);
      statsRef.current.wood += 3;
      setToast("Scrap + components nakuha");
      setTimeout(() => setToast(""), 1600);
      return;
    }
    const s = t.s;
    if (s === 1) { setDialogue({ title: "SURVIVOR", text: `Tulungan mo kami${playerName ? ", " + playerName : ""}. Maraming residente ang naiwan.` }); stageRef.current = 2; setObjective(STAGES[2].name); setCanInteract(false); }
    else if (s === 2) { setDialogue({ title: "DAMAGED REPORT", text: "Ang evacuation center ay nasa kabilang dulo — pero may harang sa daan." }); stageRef.current = 3; setObjective(STAGES[3].name); setCanInteract(false); }
    else if (s === 4) { setDialogue({ title: "RELIEF SUPPLIES", text: "Nakuha mo ang mga relief supplies. Dalhin sa evacuation center." }); stageRef.current = 5; setObjective(STAGES[5].name); setCanInteract(false); }
    else if (s === 5) setChoices(missionChoices);
  };

  const craft = (id) => {
    const st = statsRef.current;
    if (id === "spear" && st.wood >= 10) { st.wood -= 10; setSlots((s) => { const n = [...s]; n[2] = "SPEAR"; return n; }); setToast("Wooden spear crafted"); }
    else if (id === "med" && st.scrap >= 12) { st.scrap -= 12; st.hp = Math.min(100, st.hp + 25); setToast("Medkit used"); }
    else if (id === "bow" && st.wood >= 16 && st.scrap >= 8) { st.wood -= 16; st.scrap -= 8; setSlots((s) => { const n = [...s]; n[4] = "BOW"; return n; }); setToast("Wooden bow crafted"); }
    else setToast("Kulang ang materials");
    setTimeout(() => setToast(""), 1400);
    setCraftOpen(false);
  };

  const onLookDown = (e) => { if (e.target.closest(".td-ui")) return; if (e.pointerType === "mouse") { mountRef.current?.requestPointerLock?.(); return; } lookRef.current = { active: true, id: e.pointerId, x: e.clientX, y: e.clientY }; };
  const onLookMove = (e) => {
    const p = playerRef.current;
    if (document.pointerLockElement) { p.yaw -= e.movementX * 0.0024; p.pitch = THREE.MathUtils.clamp(p.pitch - e.movementY * 0.002, -1.2, 1.2); return; }
    if (!lookRef.current.active || lookRef.current.id !== e.pointerId) return;
    p.yaw -= (e.clientX - lookRef.current.x) * 0.004;
    p.pitch = THREE.MathUtils.clamp(p.pitch - (e.clientY - lookRef.current.y) * 0.003, -1.2, 1.2);
    lookRef.current.x = e.clientX; lookRef.current.y = e.clientY;
  };
  const onLookUp = (e) => { if (lookRef.current.id === e.pointerId) lookRef.current.active = false; };
  const joyDown = (e) => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); joyRef.current.active = true; updateJoy(e); };
  const updateJoy = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    let y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const l = Math.hypot(x, y) || 1; if (l > 1) { x /= l; y /= l; }
    joyRef.current.x = x; joyRef.current.y = y;
  };
  const joyUp = () => { joyRef.current = { active: false, x: 0, y: 0 }; };
  const pickChoice = (choice) => {
    try { const prev = JSON.parse(localStorage.getItem("tatsulok-choices") || "[]"); prev.push({ mission: mission?.id, choice: choice.id, character: activeCharacter?.id, at: Date.now() }); localStorage.setItem("tatsulok-choices", JSON.stringify(prev)); } catch {}
    setChoices(null); setDialogue({ title: choice.title, text: choice.description + " Ang bawat desisyon ay may kapalit.", done: true });
  };

  return (
    <div ref={mountRef} className="tatsulok-district" onPointerDown={onLookDown} onPointerMove={onLookMove} onPointerUp={onLookUp} onPointerCancel={onLookUp}>
      {view === "first" && <div className="td-crosshair" />}
      <div className="td-hud td-ui">
        <button className="td-back" onClick={onExit}>← BACK</button>
        <button className="td-view" onClick={toggleView}>{view === "first" ? "3RD PERSON" : "1ST PERSON"}</button>
        <div className="td-top">
          <div className="td-kicker">MISSION {mission?.number || "01"} · {view === "first" ? "FIRST PERSON" : "THIRD PERSON"}</div>
          <div className="td-title">{mission?.title || "EVACUATION CENTER"}</div>
        </div>
        <div className="td-obj"><span>OBJECTIVE</span><strong>{objective}</strong><em>{distance}m</em><div style={{ marginTop: 8, fontSize: 11 }}>SCRAP {scrap} · WOOD {wood}</div></div>
      </div>
      <div className="td-bars td-ui">
        <div className="td-bar hp"><i style={{ width: hp + "%" }} /></div>
        <div className="td-bar food"><i style={{ width: food + "%" }} /></div>
        <div className="td-bar stam"><i style={{ width: stam + "%" }} /></div>
      </div>
      <div className="td-hotbar td-ui">
        {slots.map((s, i) => (
          <button key={i} className={"td-slot" + (activeSlot === i ? " on" : "")} onClick={() => setActiveSlot(i)}>{s || ""}</button>
        ))}
      </div>
      <div className="td-minimap td-ui"><span /></div>
      {toast && <div className="td-hint td-ui">{toast}</div>}
      {!locked && !toast && <div className="td-hint td-ui">V VIEW · C CRAFT · E LOOT · WASD</div>}
      <div className="td-controls td-ui">
        <div className="td-joy" onPointerDown={joyDown} onPointerMove={(e) => joyRef.current.active && updateJoy(e)} onPointerUp={joyUp} onPointerCancel={joyUp}><i /></div>
        <div className="td-actions">
          <button className="td-craft" onClick={() => setCraftOpen(true)}>CRAFT</button>
          <button className="td-run" onPointerDown={() => { playerRef.current.running = true; setRunning(true); }} onPointerUp={() => { playerRef.current.running = false; setRunning(false); }}>{running ? "RUNNING" : "RUN"}</button>
          <button className={"td-use" + (canInteract ? " ready" : "")} disabled={!canInteract} onClick={doInteract}>{canInteract ? interactLabel : "APPROACH"}</button>
        </div>
      </div>
      {craftOpen && (
        <div className="td-modal td-ui"><div className="td-box">
          <span>WORKBENCH</span><h2>Craft</h2>
          <p>Scrap {scrap} · Wood {wood}. Parang early Oxide: spear muna, bow pag may materials.</p>
          <div className="td-choices">
            <button onClick={() => craft("spear")}>WOODEN SPEAR — 10 wood</button>
            <button onClick={() => craft("bow")}>WOODEN BOW — 16 wood + 8 scrap</button>
            <button onClick={() => craft("med")}>MEDKIT — 12 scrap</button>
            <button onClick={() => setCraftOpen(false)}>CLOSE</button>
          </div>
        </div></div>
      )}
      {dialogue && (<div className="td-modal td-ui"><div className="td-box"><span>MISSION EVENT</span><h2>{dialogue.title}</h2><p>{dialogue.text}</p><button onClick={() => { if (dialogue.done) onComplete?.(); else setDialogue(null); }}>{dialogue.done ? "RETURN TO MISSIONS" : "CONTINUE"}</button></div></div>)}
      {choices && (<div className="td-modal td-ui"><div className="td-box"><span>DESISYON</span><h2>Evacuation Center</h2><p>Ano ang iyong gagawin?</p><div className="td-choices">{choices.map((c) => (<button key={c.id} onClick={() => pickChoice(c)}>{c.title}</button>))}</div></div></div>)}
    </div>
  );
}
