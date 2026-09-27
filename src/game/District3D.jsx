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
    let r = ((base >> 16) & 255) + n;
    let g = ((base >> 8) & 255) + n;
    let b = (base & 255) + n;
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
  const [distance, setDistance] = useState(0);
  const [objective, setObjective] = useState("REACH THE FLOODED AREA");
  const [canInteract, setCanInteract] = useState(false);
  const [interactLabel, setInteractLabel] = useState("APPROACH");
  const [dialogue, setDialogue] = useState(null);
  const [choices, setChoices] = useState(null);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);
  const ROUTE = { flood: { x: 0, z: -18 }, survivor: { x: 5, z: -38 }, clue: { x: -5, z: -52 }, side: { x: 7, z: -74 }, supplies: { x: -6, z: -88 }, evac: { x: 0, z: -118 } };
  const STAGES = [
    { name: "REACH THE FLOODED AREA", pos: ROUTE.flood },
    { name: "FIND THE SURVIVOR", pos: ROUTE.survivor, talk: "TALK" },
    { name: "INVESTIGATE THE CLUE", pos: ROUTE.clue, talk: "INVESTIGATE" },
    { name: "FIND ANOTHER WAY THROUGH", pos: ROUTE.side },
    { name: "COLLECT RELIEF SUPPLIES", pos: ROUTE.supplies, talk: "COLLECT" },
    { name: "REACH THE EVACUATION CENTER", pos: ROUTE.evac, talk: "INTERACT" }
  ];

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") { playerRef.current.running = true; setRunning(true); }
      if (e.code === "KeyE") doInteract();
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
    const matGlassOff = std(0x0c1820, { roughness: 0.2, metalness: 0.4, emissive: 0x02080c });
    const matGlassOn = std(0x1c2a18, { roughness: 0.25, metalness: 0.2, emissive: 0xffc46a, emissiveIntensity: 0.55 });
    const matGlassCool = std(0x102018, { roughness: 0.25, metalness: 0.2, emissive: 0x7ec8ff, emissiveIntensity: 0.35 });

    addBox(140, 0.4, 240, std(0x3d403c, { map: concreteTex }), 0, -0.22, -55);
    addBox(11.6, 0.08, 210, matRoad, 0, 0.02, -55);
    addBox(7.2, 0.14, 210, matWalk, -10.2, 0.08, -55);
    addBox(7.2, 0.14, 210, matWalk, 10.2, 0.08, -55);
    addBox(0.12, 0.18, 210, matDark, -6.05, 0.12, -55);
    addBox(0.12, 0.18, 210, matDark, 6.05, 0.12, -55);
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
      const bodyMat = facadeMats[matIndex % facadeMats.length];
      addBox(w, h, d, bodyMat, x, h / 2, z);
      addBox(w + 0.7, 0.28, d + 0.7, matRoof, x, h + 0.08, z);
      addBox(w + 0.35, 0.55, 0.22, matDark, x, h + 0.4, z + d / 2);
      addBox(w + 0.35, 0.55, 0.22, matDark, x, h + 0.4, z - d / 2);
      addCol(x, z, w, d);
      addBox(w * 0.92, 0.12, 0.08, matDark, x, 3.15, z + d / 2 + 0.05);
      addBox(2.4, 2.6, 0.12, matDark, x, 1.35, z + d / 2 + 0.08);
      addBox(2.6, 0.16, 1.4, matRust, x, 2.72, z + d / 2 + 0.55);
      const cols = Math.max(3, Math.floor(w / 2.4));
      const rows = Math.max(3, Math.floor((h - 3.4) / 2.35));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = (c * 3 + r * 7 + matIndex) % 5 !== 0;
          const cool = (c + r + matIndex) % 7 === 0;
          const glass = !lit ? matGlassOff : cool ? matGlassCool : matGlassOn;
          addBox(1.05, 1.25, 0.07, glass, x - w / 2 + 1.6 + c * 2.35, 4.1 + r * 2.35, z + d / 2 + 0.04);
          addBox(1.05, 1.25, 0.07, (c + r) % 4 === 0 ? matGlassOn : matGlassOff, x - w / 2 + 1.6 + c * 2.35, 4.1 + r * 2.35, z - d / 2 - 0.04);
        }
      }
      addBox(1.3, 0.55, 0.9, matMetal, x - w / 4, h + 0.55, z - d / 5);
      addBox(0.18, 1.4, 0.18, matRust, x + w / 3, h + 0.9, z + d / 6);
      if (h > 12) addBox(2.2, 1.1, 2.2, matDark, x + w / 5, h + 0.7, z);
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
        const bulb = new THREE.PointLight(0xffd089, 1.8, 14, 1.7);
        bulb.position.set(px, 5.25, z);
        scene.add(bulb);
      });
    }
    addBox(1.15, 0.85, 0.95, matWood, -7.6, 0.42, -8);
    addBox(0.7, 0.55, 0.55, matRust, -6.7, 0.28, -7.8);
    addBox(1.15, 0.85, 0.95, matWood, 7.4, 0.42, -26);
    addBox(1.8, 0.55, 0.9, matSand, -6.6, 0.28, -16);
    addBox(1.8, 0.55, 0.9, matSand, -4.7, 0.28, -16);
    addBox(1.8, 0.55, 0.9, matSand, 6.5, 0.28, -21);
    const flood = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.14, 24), matWater);
    flood.position.set(0, 0.1, -20); scene.add(flood);
    const npc = new THREE.Group(); npc.position.set(5, 0, -38); scene.add(npc);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.95, 4, 8), std(0x2a3a32)); body.position.y = 1.05; npc.add(body);
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.55, 0.42), std(0xc9a23a)); vest.position.y = 1.25; npc.add(vest);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), std(0xc49a78)); head.position.y = 1.95; npc.add(head);
    const clue = new THREE.Group(); clue.position.set(-5, 0, -52); scene.add(clue);
    addBox(0.7, 1.15, 0.12, matYellow, 0, 0.7, 0, clue);
    addBox(12.5, 1.05, 0.35, matRed, 0, 0.55, -68);
    addBox(0.22, 1.7, 0.22, matMetal, -6.1, 0.85, -68);
    addBox(0.22, 1.7, 0.22, matMetal, 6.1, 0.85, -68);
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
    const clock = new THREE.Clock(); let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.04);
      const p = playerRef.current, keys = keysRef.current;
      let mx = 0, mz = 0;
      if (keys.KeyW || keys.ArrowUp) mz += 1;
      if (keys.KeyS || keys.ArrowDown) mz -= 1;
      if (keys.KeyA || keys.ArrowLeft) mx -= 1;
      if (keys.KeyD || keys.ArrowRight) mx += 1;
      mx += joyRef.current.x; mz += -joyRef.current.y;
      const len = Math.hypot(mx, mz); if (len > 1) { mx /= len; mz /= len; }
      const speed = p.running ? 7.2 : 4.4;
      const fwdX = -Math.sin(p.yaw), fwdZ = -Math.cos(p.yaw), rightX = Math.cos(p.yaw), rightZ = -Math.sin(p.yaw);
      const nx = p.x + (rightX * mx + fwdX * mz) * speed * dt;
      const nz = p.z + (rightZ * mx + fwdZ * mz) * speed * dt;
      if (!blocked(nx, p.z)) p.x = nx;
      if (!blocked(p.x, nz)) p.z = nz;
      camera.position.set(p.x, 1.68, p.z);
      camera.rotation.order = "YXZ"; camera.rotation.y = p.yaw; camera.rotation.x = p.pitch;
      const stage = STAGES[stageRef.current];
      if (stage) {
        marker.position.set(stage.pos.x, 0, stage.pos.z);
        diamond.rotation.y += dt * 2;
        const meters = Math.round(Math.hypot(p.x - stage.pos.x, p.z - stage.pos.z));
        setDistance(meters);
        if (stageRef.current === 0 && meters <= 6) { stageRef.current = 1; setObjective(STAGES[1].name); }
        if (stageRef.current === 3 && p.z < -72) { stageRef.current = 4; setObjective(STAGES[4].name); }
        const talk = stage.talk && near(p, stage.pos, stageRef.current === 5 ? 6 : 3.2);
        setCanInteract(!!talk); setInteractLabel(talk ? stage.talk : "APPROACH");
        interactRef.current = talk ? stageRef.current : null;
      }
      renderer.render(scene, camera);
    };
    tick();
    const resize = () => { camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1); camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight, false); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); };
  }, []);

  const doInteract = () => {
    const s = interactRef.current;
    if (s == null) return;
    if (s === 1) { setDialogue({ title: "SURVIVOR", text: `Tulungan mo kami${playerName ? ", " + playerName : ""}. Maraming residente ang naiwan.` }); stageRef.current = 2; setObjective(STAGES[2].name); setCanInteract(false); }
    else if (s === 2) { setDialogue({ title: "DAMAGED REPORT", text: "Ang evacuation center ay nasa kabilang dulo — pero may harang sa daan." }); stageRef.current = 3; setObjective(STAGES[3].name); setCanInteract(false); }
    else if (s === 4) { setDialogue({ title: "RELIEF SUPPLIES", text: "Nakuha mo ang mga relief supplies. Dalhin sa evacuation center." }); stageRef.current = 5; setObjective(STAGES[5].name); setCanInteract(false); }
    else if (s === 5) setChoices(missionChoices);
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
      <div className="td-crosshair" />
      <div className="td-hud td-ui">
        <button className="td-back" onClick={onExit}>← BACK</button>
        <div className="td-top">
          <div className="td-kicker">MISSION {mission?.number || "01"} · FIRST PERSON</div>
          <div className="td-title">{mission?.title || "EVACUATION CENTER"}</div>
        </div>
        <div className="td-obj"><span>OBJECTIVE</span><strong>{objective}</strong><em>{distance}m</em></div>
      </div>
      {!locked && <div className="td-hint td-ui">CLICK / DRAG TO LOOK · WASD · E INTERACT</div>}
      <div className="td-controls td-ui">
        <div className="td-joy" onPointerDown={joyDown} onPointerMove={(e) => joyRef.current.active && updateJoy(e)} onPointerUp={joyUp} onPointerCancel={joyUp}><i /></div>
        <div className="td-actions">
          <button className="td-run" onPointerDown={() => { playerRef.current.running = true; setRunning(true); }} onPointerUp={() => { playerRef.current.running = false; setRunning(false); }}>{running ? "RUNNING" : "RUN"}</button>
          <button className={"td-use" + (canInteract ? " ready" : "")} disabled={!canInteract} onClick={doInteract}>{canInteract ? interactLabel : "APPROACH"}</button>
        </div>
      </div>
      {dialogue && (<div className="td-modal td-ui"><div className="td-box"><span>MISSION EVENT</span><h2>{dialogue.title}</h2><p>{dialogue.text}</p><button onClick={() => { if (dialogue.done) onComplete?.(); else setDialogue(null); }}>{dialogue.done ? "RETURN TO MISSIONS" : "CONTINUE"}</button></div></div>)}
      {choices && (<div className="td-modal td-ui"><div className="td-box"><span>DESISYON</span><h2>Evacuation Center</h2><p>Ano ang iyong gagawin?</p><div className="td-choices">{choices.map((c) => (<button key={c.id} onClick={() => pickChoice(c)}>{c.title}</button>))}</div></div></div>)}
    </div>
  );
}
