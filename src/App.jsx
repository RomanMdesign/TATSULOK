import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import * as THREE from "three";

/* =========================================================
   TATSULOK — CHARACTER DATA
   Existing 11 character image paths are preserved.
========================================================= */

const characters = [
  ["peyudo", "PEYUDO", "PANGINOON", 68, 42, 55, 60, "/assets/peyudo.jpg"],
  ["misteryo", "MISTERYO", "PANGINOON", 62, 38, 43, 35, "/assets/misteryo.jpg"],
  ["bangag", "BANGAG", "PANGINOON", 70, 35, 40, 48, "/assets/bangag.jpg"],
  ["pula", "PULA", "PANGINOON", 66, 44, 39, 51, "/assets/pula.jpg"],
  ["tanikala", "TANIKALA", "PANGINOON", 57, 52, 46, 40, "/assets/tanikala.jpg"],
  ["presyo", "PRESYO", "MALAKAS", 58, 48, 52, 64, "/assets/presyo.jpg"],
  ["pintuan", "PINTUAN", "MALAKAS", 52, 54, 57, 45, "/assets/pintuan.jpg"],
  ["ling", "LING", "MABUTI", 42, 68, 76, 35, "/assets/ling.jpg"],
  ["batid", "BATID", "MABUTI", 45, 70, 74, 38, "/assets/batid.jpg"],
  ["tisa", "TISA", "MABUTI", 40, 66, 79, 32, "/assets/tisa.jpg"],
  ["subalit", "SUBALIT", "MABUTI", 54, 73, 81, 41, "/assets/subalit.jpg"],
].map(([id, name, faction, power, trust, humanity, wealth, image]) => ({
  id,
  name,
  faction,
  power,
  trust,
  humanity,
  wealth,
  image,
}));

/* =========================================================
   MISSIONS
   No timer.
   The objective is physically placed in the 3D world.
========================================================= */

const missions = [
  {
    id: 1,
    title: "ANG BAHA",
    location: "DISTRICT 7",
    objective: "EVACUATION CENTER",
    description:
      "Isang matinding baha ang lumubog sa distrito. Hanapin ang evacuation center at iligtas ang mga mamamayan.",
    scene: "flood",
    choices: [
      {
        id: "A",
        title: "GAMITIN ANG SARILING YAMAN PARA SA EVACUATION.",
        desc: "Gamitin ang sariling yaman upang mailikas ang mga tao.",
        effects: { humanity: 15, trust: 15, power: -5 },
        tone: "good",
      },
      {
        id: "B",
        title: "KONTROLIN ANG RELIEF DISTRIBUTION.",
        desc: "Ikontrol ang distribusyon upang mapanatili ang impluwensiya.",
        effects: { power: 15, trust: -10 },
        tone: "gold",
      },
      {
        id: "C",
        title: "HUWAG MAKIALAM.",
        desc: "Hayaan ang distrito na lutasin ang sariling problema.",
        effects: { wealth: 10, humanity: -15, trust: -8 },
        tone: "bad",
      },
    ],
  },

  {
    id: 2,
    title: "ANG LINDOL",
    location: "OLD DISTRICT",
    objective: "COLLAPSED BUILDING",
    description:
      "Isang lindol ang sumira sa lumang distrito. May gusaling maaaring gumuho.",
    scene: "quake",
    choices: [
      {
        id: "A",
        title: "UNAHIN ANG MGA NAKALIGTAS.",
        desc: "Iligtas muna ang mga tao bago ang anumang ari-arian.",
        effects: { humanity: 18, trust: 10, power: -4 },
        tone: "good",
      },
      {
        id: "B",
        title: "KUNIN ANG MAHALAGANG DOKUMENTO.",
        desc: "Unahin ang dokumentong maaaring magbunyag ng lihim.",
        effects: { power: 10, trust: 5, humanity: -5 },
        tone: "gold",
      },
      {
        id: "C",
        title: "IWAN ANG LUGAR.",
        desc: "Masyadong mapanganib. Iligtas ang sarili.",
        effects: { power: 4, humanity: -18, trust: -12 },
        tone: "bad",
      },
    ],
  },

  {
    id: 3,
    title: "KURAPSYON",
    location: "CITY HALL",
    objective: "CITY HALL ARCHIVE",
    description:
      "May nawawalang pondo at isang lihim na listahan ng mga pangalan.",
    scene: "corruption",
    choices: [
      {
        id: "A",
        title: "ILABAS ANG EBIDENSIYA SA PUBLIKO.",
        desc: "Ipakita ang dokumento kahit may kapalit itong panganib.",
        effects: { humanity: 12, trust: 18, power: -8 },
        tone: "good",
      },
      {
        id: "B",
        title: "MAKIPAG-DEAL SA SISTEMA.",
        desc: "Makipagkasundo upang makakuha ng access sa loob.",
        effects: { power: 18, trust: -3, wealth: 8 },
        tone: "gold",
      },
      {
        id: "C",
        title: "SUNUGIN ANG MGA DOKUMENTO.",
        desc: "Burahin ang ebidensiya at protektahan ang mga sangkot.",
        effects: { power: 8, trust: -18, humanity: -12 },
        tone: "bad",
      },
    ],
  },

  {
    id: 4,
    title: "ANG TANIKALA",
    location: "CENTRAL TOWER",
    objective: "CENTRAL TOWER",
    description:
      "Sa huling yugto, kailangang pumili kung babaguhin o aangkinin ang sistema.",
    scene: "tower",
    choices: [
      {
        id: "A",
        title: "PUTULIN ANG SISTEMA.",
        desc: "Alisin ang lumang tanikala kahit hindi sigurado ang kinabukasan.",
        effects: { humanity: 25, trust: 12, power: -20 },
        tone: "good",
      },
      {
        id: "B",
        title: "BAGUHIN MULA SA LOOB NG SISTEMA.",
        desc: "Gamitin ang kapangyarihan upang baguhin ito.",
        effects: { power: 10, trust: 10, humanity: 5 },
        tone: "gold",
      },
      {
        id: "C",
        title: "PANATILIHIN ANG LAHAT NG KAPANGYARIHAN.",
        desc: "Aangkinin ang pinakamalaking kapangyarihan.",
        effects: { power: 25, trust: -25, humanity: -25 },
        tone: "bad",
      },
    ],
  },
];

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

/* =========================================================
   UI
========================================================= */

function Header({ active, onNavigate, sound, setSound }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate("lobby")}>
        <span className="brand-mark">△</span>
        <span>TATSULOK</span>
      </button>

      <nav>
        {["WORLD", "LOBBY", "CHARACTERS", "DOSSIER", "FACTIONS", "MISSION"].map(
          (item) => (
            <button
              key={item}
              className={active === item ? "active" : ""}
              onClick={() =>
                onNavigate(
                  item === "MISSION"
                    ? "mission"
                    : item === "CHARACTERS"
                    ? "characters"
                    : "lobby"
                )
              }
            >
              {item}
            </button>
          )
        )}
      </nav>

      <div className="top-actions">
        <span className="saved">● SAVED LOCALLY</span>

        <button
          onClick={() => setSound(!sound)}
          aria-label="sound"
          className="icon-button"
        >
          {sound ? "🔊" : "🔇"}
        </button>

        <button
          onClick={() => onNavigate("lobby")}
          aria-label="back to lobby"
          className="icon-button"
        >
          ⌂
        </button>
      </div>
    </header>
  );
}

function StatBar({ label, value }) {
  return (
    <div className="statbar">
      <span>{label}</span>
      <div>
        <i style={{ width: `${value}%` }} />
      </div>
      <b>{value}</b>
    </div>
  );
}

/* =========================================================
   3D DISTRICT ENGINE
========================================================= */

function createMaterial(color, roughness = 0.8) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.05,
  });
}

function createBuilding(scene, x, z, w, h, d, color, windows = true) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    createMaterial(color)
  );

  body.position.y = h / 2;
  group.add(body);

  if (windows) {
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x88a7a8,
      emissive: 0x243f40,
      emissiveIntensity: 0.4,
      roughness: 0.25,
    });

    const rows = Math.max(2, Math.floor(h / 2.4));
    const cols = Math.max(2, Math.floor(w / 2));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.75, 0.05),
          windowMaterial
        );

        const px =
          -w / 2 +
          1.1 +
          col * ((w - 2.2) / Math.max(1, cols - 1));

        const py = 1.5 + row * 2.15;

        window.position.set(px, py, d / 2 + 0.03);
        group.add(window);
      }
    }
  }

  group.position.set(x, 0, z);
  scene.add(group);

  return group;
}

function createStreetLight(scene, x, z) {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.1, 4.3, 8),
    createMaterial(0x202528)
  );

  pole.position.y = 2.15;
  group.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.08, 0.08),
    createMaterial(0x202528)
  );

  arm.position.set(0.4, 4.05, 0);
  group.add(arm);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xffd477,
      emissive: 0xffa62b,
      emissiveIntensity: 2.2,
    })
  );

  bulb.position.set(0.8, 3.95, 0);
  group.add(bulb);

  const light = new THREE.PointLight(0xffb84c, 1.2, 8);
  light.position.set(0.8, 3.8, 0);
  group.add(light);

  group.position.set(x, 0, z);
  scene.add(group);
}

function createCar(scene, x, z, rotation = 0) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.55, 4),
    createMaterial(0x333a3d)
  );

  body.position.y = 0.55;
  group.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 0.55, 1.9),
    createMaterial(0x1d272a)
  );

  cabin.position.y = 1.05;
  cabin.position.z = -0.15;
  group.add(cabin);

  const wheelMaterial = createMaterial(0x111314);

  [-1.25, 1.25].forEach((zWheel) => {
    [-1.05, 1.05].forEach((xWheel) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, 0.22, 12),
        wheelMaterial
      );

      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(xWheel, 0.35, zWheel);
      group.add(wheel);
    });
  });

  group.position.set(x, 0, z);
  group.rotation.y = rotation;

  scene.add(group);
}

function createObjectiveMarker(scene, position) {
  const group = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.12, 12, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffc857,
      transparent: true,
      opacity: 0.95,
    })
  );

  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  group.add(ring);

  const vertical = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 1.15, 4),
    new THREE.MeshBasicMaterial({
      color: 0xffc857,
      transparent: true,
      opacity: 0.95,
    })
  );

  vertical.position.y = 3.2;
  group.add(vertical);

  const light = new THREE.PointLight(0xffb52e, 3, 12);
  light.position.y = 2.5;
  group.add(light);

  group.position.copy(position);

  scene.add(group);

  return group;
}

function createDistrict(scene, mission) {
  const world = new THREE.Group();
  scene.add(world);

  /* Ground */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    createMaterial(mission.scene === "flood" ? 0x27383b : 0x24292a)
  );

  ground.rotation.x = -Math.PI / 2;
  world.add(ground);

  /* Main road */
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 160),
    createMaterial(0x15191a)
  );

  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.012;
  world.add(road);

  /* Side roads */
  [-32, 4, 39].forEach((z) => {
    const sideRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 10),
      createMaterial(0x171b1c)
    );

    sideRoad.rotation.x = -Math.PI / 2;
    sideRoad.position.set(0, 0.014, z);
    world.add(sideRoad);
  });

  /* Sidewalks */
  [-9, 9].forEach((x) => {
    const sidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.25, 160),
      createMaterial(0x575a58)
    );

    sidewalk.position.set(x, 0.12, 0);
    world.add(sidewalk);
  });

  /* Buildings */
  createBuilding(world, -23, -23, 18, 15, 22, 0x5a5148);
  createBuilding(world, 23, -23, 19, 20, 20, 0x41494a);
  createBuilding(world, -24, 15, 20, 12, 25, 0x554c44);
  createBuilding(world, 25, 16, 21, 25, 25, 0x353c3e);
  createBuilding(world, -27, 52, 20, 18, 25, 0x4b4640);
  createBuilding(world, 27, 51, 22, 14, 24, 0x55595a);

  /* Distant towers */
  createBuilding(world, -52, 22, 15, 32, 18, 0x303536);
  createBuilding(world, 52, 29, 16, 38, 18, 0x292e30);

  /* Street furniture */
  [-7, 7].forEach((x) => {
    [-28, 4, 37].forEach((z) => {
      createStreetLight(world, x, z);
    });
  });

  /* Cars / debris */
  createCar(world, -3.4, -16, Math.PI / 2);
  createCar(world, 3.4, 20, -Math.PI / 2);
  createCar(world, -3, 47, Math.PI / 2);

  const debrisMaterial = createMaterial(0x68625a);

  for (let i = 0; i < 13; i++) {
    const debris = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.35 + Math.random() * 0.8,
        0.2 + Math.random() * 0.45,
        0.35 + Math.random() * 0.8
      ),
      debrisMaterial
    );

    debris.position.set(
      (Math.random() - 0.5) * 10,
      0.25,
      -55 + Math.random() * 110
    );

    debris.rotation.y = Math.random() * Math.PI;
    world.add(debris);
  }

  /* Flood water */
  if (mission.scene === "flood") {
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 160),
      new THREE.MeshStandardMaterial({
        color: 0x244a55,
        transparent: true,
        opacity: 0.52,
        roughness: 0.2,
        metalness: 0.05,
      })
    );

    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.34;
    world.add(water);
  }

  /* Objective */
  const objectivePositions = {
    flood: new THREE.Vector3(0, 0, -72),
    quake: new THREE.Vector3(0, 0, -67),
    corruption: new THREE.Vector3(0, 0, -62),
    tower: new THREE.Vector3(0, 0, -58),
  };

  const objective = createObjectiveMarker(
    world,
    objectivePositions[mission.scene] || objectivePositions.flood
  );

  return {
    world,
    objective,
  };
}

/* =========================================================
   FIRST-PERSON 3D COMPONENT
========================================================= */

function FirstPersonDistrict({
  mission,
  onNearObjective,
  interactionRequested,
  onInteractionConsumed,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    keys: {},
    yaw: 0,
    pitch: 0,
    moving: false,
    joystickX: 0,
    joystickY: 0,
    touchLook: false,
    lastTouchX: 0,
    lastTouchY: 0,
  });

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.05,
      250
    );

    camera.position.set(0, 1.65, 19);
    camera.rotation.order = "YXZ";

    /* Lighting */
    scene.background = new THREE.Color(
      mission.scene === "flood" ? 0x102025 : 0x101416
    );

    const ambient = new THREE.HemisphereLight(
      0x8a9a9b,
      0x101314,
      1.25
    );

    scene.add(ambient);

    const moon = new THREE.DirectionalLight(0xd6dedc, 1.35);
    moon.position.set(-30, 50, 15);
    moon.castShadow = true;

    scene.add(moon);

    const district = createDistrict(scene, mission);

    /* Fog creates real depth */
    scene.fog = new THREE.Fog(
      mission.scene === "flood" ? 0x102025 : 0x101416,
      24,
      125
    );

    const state = stateRef.current;

    const onKeyDown = (e) => {
      state.keys[e.code] = true;

      if (
        ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e) => {
      state.keys[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let animationId;

    const clock = new THREE.Clock();

    function animate() {
      animationId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);

      const forward =
        (state.keys.KeyW || state.keys.ArrowUp ? 1 : 0) +
        (state.keys.KeyS || state.keys.ArrowDown ? -1 : 0);

      const strafe =
        (state.keys.KeyD || state.keys.ArrowRight ? 1 : 0) +
        (state.keys.KeyA || state.keys.ArrowLeft ? -1 : 0);

      const moveForward = forward - state.joystickY;
      const moveStrafe = strafe + state.joystickX;

      const speed = state.keys.ShiftLeft || state.keys.ShiftRight ? 9 : 5.5;

      const direction = new THREE.Vector3();

      direction.z = -moveForward;
      direction.x = moveStrafe;

      if (direction.lengthSq() > 1) {
        direction.normalize();
      }

      direction.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        state.yaw
      );

      camera.position.x += direction.x * speed * delta;
      camera.position.z += direction.z * speed * delta;

      /* Player boundaries */
      camera.position.x = THREE.MathUtils.clamp(
        camera.position.x,
        -7.2,
        7.2
      );

      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z,
        -82,
        22
      );

      camera.position.y = 1.65;

      camera.rotation.y = state.yaw;
      camera.rotation.x = state.pitch;

      /* Objective distance */
      const distance = camera.position.distanceTo(
        district.objective.position
      );

      onNearObjective(distance);

      /* Floating objective marker */
      district.objective.rotation.y += delta * 0.9;

      district.objective.children.forEach((child, index) => {
        if (index === 0) {
          const pulse = 1 + Math.sin(performance.now() * 0.004) * 0.1;
          child.scale.setScalar(pulse);
        }

        if (index === 1) {
          child.position.y =
            3.1 + Math.sin(performance.now() * 0.003) * 0.25;
        }
      });

      renderer.render(scene, camera);
    }

    animate();

    const resize = () => {
      if (!container.clientWidth || !container.clientHeight) return;

      camera.aspect =
        container.clientWidth / container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);

      resizeObserver.disconnect();

      district.world.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(
          renderer.domElement
        );
      }
    };
  }, [mission]);

  useEffect(() => {
    const state = stateRef.current;

    if (!interactionRequested) return;

    /* Interaction is intentionally handled by parent UI.
       This effect exists so the interaction request can be
       consumed cleanly when the player is in range. */

    onInteractionConsumed();
  }, [interactionRequested, onInteractionConsumed]);

  function joystickStart(e) {
    e.preventDefault();

    const touch = e.touches?.[0] || e;

    stateRef.current.joystickStartX = touch.clientX;
    stateRef.current.joystickStartY = touch.clientY;
  }

  function joystickMove(e) {
    e.preventDefault();

    const touch = e.touches?.[0] || e;

    const state = stateRef.current;

    const dx = touch.clientX - state.joystickStartX;
    const dy = touch.clientY - state.joystickStartY;

    const max = 48;

    state.joystickX = THREE.MathUtils.clamp(dx / max, -1, 1);
    state.joystickY = THREE.MathUtils.clamp(dy / max, -1, 1);
  }

  function joystickEnd(e) {
    e.preventDefault();

    stateRef.current.joystickX = 0;
    stateRef.current.joystickY = 0;
  }

  function lookStart(e) {
    if (e.touches?.length !== 1) return;

    stateRef.current.touchLook = true;
    stateRef.current.lastTouchX = e.touches[0].clientX;
    stateRef.current.lastTouchY = e.touches[0].clientY;
  }

  function lookMove(e) {
    if (!stateRef.current.touchLook || !e.touches?.length) return;

    const touch = e.touches[0];

    const dx = touch.clientX - stateRef.current.lastTouchX;
    const dy = touch.clientY - stateRef.current.lastTouchY;

    stateRef.current.yaw -= dx * 0.004;
    stateRef.current.pitch -= dy * 0.003;

    stateRef.current.pitch = THREE.MathUtils.clamp(
      stateRef.current.pitch,
      -1.1,
      1.1
    );

    stateRef.current.lastTouchX = touch.clientX;
    stateRef.current.lastTouchY = touch.clientY;
  }

  function lookEnd() {
    stateRef.current.touchLook = false;
  }

  return (
    <div
      className="three-district"
      ref={mountRef}
      onTouchStart={lookStart}
      onTouchMove={lookMove}
      onTouchEnd={lookEnd}
    >
      <div className="touch-look-hint">
        DRAG TO LOOK
      </div>

      <div
        className="mobile-joystick"
        onTouchStart={joystickStart}
        onTouchMove={joystickMove}
        onTouchEnd={joystickEnd}
      >
        <div className="joystick-base">
          <div className="joystick-knob" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MISSION SCREEN
========================================================= */

function MissionScreen({
  mission,
  character,
  stats,
  setStats,
  playerName,
  missionIndex,
  setMissionIndex,
  setScreen,
}) {
  const [distance, setDistance] = useState(74);
  const [choice, setChoice] = useState(null);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [flash, setFlash] = useState("");

  const inRange = distance <= 3.2;

  useEffect(() => {
    setChoice(null);
    setDialogueOpen(false);
    setDistance(74);
  }, [missionIndex]);

  function handleChoice(selected) {
    if (choice) return;

    setChoice(selected);

    setStats((current) => {
      const next = { ...current };

      Object.entries(selected.effects).forEach(([key, amount]) => {
        next[key] = clamp(next[key] + amount);
      });

      return next;
    });

    setFlash(`DESISYON ${selected.id} — NAKATAPOS.`);
  }

  function nextMission() {
    if (missionIndex >= missions.length - 1) {
      setScreen("ending");
      return;
    }

    setMissionIndex((index) => index + 1);
  }

  function interact() {
    if (!inRange) {
      setFlash("LUMAPIT PA SA OBJECTIVE.");
      return;
    }

    setDialogueOpen(true);
    setFlash("");
  }

  return (
    <div className="app mission-app">
      <Header
        active="MISSION"
        onNavigate={setScreen}
        sound={true}
        setSound={() => {}}
      />

      <div className="mission-world">

        {/* 3D WORLD */}
        <FirstPersonDistrict
          mission={mission}
          onNearObjective={(meters) => {
            setDistance(Math.max(0, meters));
          }}
          interactionRequested={false}
          onInteractionConsumed={() => {}}
        />

        {/* VIGNETTE */}
        <div className="fps-vignette" />

        {/* TOP MISSION INFO */}
        <div className="fps-top">
          <div>
            <div className="eyebrow">
              MISSION {String(mission.id).padStart(2, "0")}
            </div>

            <h1>{mission.title}</h1>

            <p>{mission.location}</p>
          </div>

          <div className="objective-distance">
            <span>OBJECTIVE</span>
            <b>{Math.round(distance)}m</b>
          </div>
        </div>

        {/* WORLD OBJECTIVE MARKER */}
        <div
          className={`world-objective ${
            inRange ? "near" : ""
          }`}
        >
          <div className="objective-beacon">◆</div>

          <div className="objective-card">
            <span>OBJECTIVE</span>
            <strong>{mission.objective}</strong>
            <small>{Math.round(distance)}m</small>
          </div>
        </div>

        {/* CROSSHAIR */}
        <div className="crosshair">
          <span />
          <i />
        </div>

        {/* LEFT HUD */}
        <aside className="fps-left-hud">
          <div className="fps-player">
            <img src={character.image} alt="" />

            <div>
              <b>{character.name}</b>
              <small>{character.faction}</small>
            </div>
          </div>

          <div className="fps-stats">
            <StatBar label="POWER" value={stats.power} />
            <StatBar label="TRUST" value={stats.trust} />
            <StatBar label="HUMANITY" value={stats.humanity} />
          </div>

          <div className="fps-objective-panel">
            <span>MISSION OBJECTIVE</span>
            <strong>{mission.objective}</strong>
            <p>{mission.description}</p>
          </div>
        </aside>

        {/* BACK BUTTON */}
        <button
          className="back-mission"
          onClick={() => setScreen("lobby")}
        >
          ← BACK
        </button>

        {/* INTERACT */}
        {inRange && (
          <button
            className="interact-button"
            onClick={interact}
          >
            <span>[ E ]</span>
            INTERACT
          </button>
        )}

        {/* MOBILE INTERACT */}
        {inRange && (
          <button
            className="mobile-interact"
            onClick={interact}
          >
            INTERACT
          </button>
        )}

        {/* BOTTOM MOBILE HUD */}
        <div className="mobile-mission-info">
          <span>{mission.location}</span>
          <b>{Math.round(distance)}m</b>
        </div>

        {flash && (
          <div className="fps-toast">
            {flash}
          </div>
        )}

        {/* DIALOGUE / CHOICE */}
        {dialogueOpen && (
          <div className="mission-dialogue">
            <div className="dialogue-panel">

              <button
                className="dialogue-close"
                onClick={() => setDialogueOpen(false)}
              >
                ×
              </button>

              <div className="eyebrow">
                {mission.location}
              </div>

              <h2>{mission.objective}</h2>

              <p className="dialogue-description">
                {mission.description}
              </p>

              <div className="choice-list">
                {mission.choices.map((item) => (
                  <button
                    key={item.id}
                    disabled={!!choice}
                    className={`choice-card ${item.tone} ${
                      choice?.id === item.id ? "chosen" : ""
                    }`}
                    onClick={() => handleChoice(item)}
                  >
                    <strong>{item.id}</strong>

                    <div>
                      <b>{item.title}</b>
                      <p>{item.desc}</p>

                      <small>
                        {Object.entries(item.effects)
                          .map(
                            ([key, value]) =>
                              `${value >= 0 ? "+" : "−"}${key.toUpperCase()} ${Math.abs(value)}`
                          )
                          .join("   ")}
                      </small>
                    </div>
                  </button>
                ))}
              </div>

              {choice && (
                <div className="consequence-card">
                  <span>CONSEQUENCE</span>

                  <h3>{choice.title}</h3>

                  <p>{choice.desc}</p>

                  <div className="effect-chips">
                    {Object.entries(choice.effects).map(
                      ([key, value]) => (
                        <span
                          key={key}
                          className={
                            value >= 0 ? "plus" : "minus"
                          }
                        >
                          {key.toUpperCase()}{" "}
                          {value >= 0 ? "+" : ""}
                          {value}
                        </span>
                      )
                    )}
                  </div>

                  <button
                    className="continue-button"
                    onClick={nextMission}
                  >
                    {missionIndex === missions.length - 1
                      ? "TAPUSIN ANG MISYON →"
                      : "MAGPATULOY →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("tatsulok_name") || ""
  );

  const [selectedId, setSelectedId] = useState("peyudo");

  const [screen, setScreen] = useState("lobby");

  const [missionIndex, setMissionIndex] = useState(0);

  const [stats, setStats] = useState({
    power: 68,
    trust: 42,
    humanity: 55,
    wealth: 60,
  });

  const [sound, setSound] = useState(true);

  const [flash, setFlash] = useState("");

  const character = useMemo(
    () =>
      characters.find((c) => c.id === selectedId) ||
      characters[0],
    [selectedId]
  );

  const mission = missions[missionIndex];

  useEffect(() => {
    localStorage.setItem("tatsulok_name", playerName);
  }, [playerName]);

  function chooseCharacter(id) {
    const c = characters.find((item) => item.id === id);

    if (!c) return;

    setSelectedId(id);

    setStats({
      power: c.power,
      trust: c.trust,
      humanity: c.humanity,
      wealth: c.wealth,
    });

    setScreen("lobby");
  }

  function startMission() {
    if (!playerName.trim()) {
      setFlash("MAGLAGAY MUNA NG PLAYER NAME.");
      return;
    }

    setFlash("");
    setMissionIndex(0);
    setScreen("mission");
  }

  function resetGame() {
    const c =
      characters.find((item) => item.id === selectedId) ||
      characters[0];

    setStats({
      power: c.power,
      trust: c.trust,
      humanity: c.humanity,
      wealth: c.wealth,
    });

    setMissionIndex(0);
    setScreen("mission");
  }

  const ending =
    stats.humanity >= 80 && stats.trust >= 65
      ? "ANG MABUTING PANININDIGAN"
      : stats.power >= 85 && stats.trust < 45
      ? "ANG BAGONG PANGINOON"
      : "ANG SISTEMANG NAGBAGO";

  /* ================= MISSION ================= */

  if (screen === "mission") {
    return (
      <MissionScreen
        mission={mission}
        character={character}
        stats={stats}
        setStats={setStats}
        playerName={playerName}
        missionIndex={missionIndex}
        setMissionIndex={setMissionIndex}
        setScreen={setScreen}
      />
    );
  }

  /* ================= ENDING ================= */

  if (screen === "ending") {
    return (
      <div className="app ending-screen">
        <Header
          active="MISSION"
          onNavigate={setScreen}
          sound={sound}
          setSound={setSound}
        />

        <main className="ending-content">
          <div className="eyebrow">
            FINAL MISSION / ENDING
          </div>

          <h1>{ending}</h1>

          <p>
            Ang bawat desisyon mo sa apat na misyon ay
            nakaapekto sa balanse ng Tatsulok.
          </p>

          <div className="final-stats">
            <StatBar label="POWER" value={stats.power} />
            <StatBar label="TRUST" value={stats.trust} />
            <StatBar
              label="HUMANITY"
              value={stats.humanity}
            />
            <StatBar label="WEALTH" value={stats.wealth} />
          </div>

          <div className="ending-actions">
            <button
              className="gold-button"
              onClick={resetGame}
            >
              PLAY AGAIN →
            </button>

            <button
              className="ghost-button"
              onClick={() => setScreen("lobby")}
            >
              RETURN TO LOBBY
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ================= LOBBY / CHARACTERS ================= */

  const characterScreen = screen === "characters";

  return (
    <div className="app lobby-app">
      <Header
        active={characterScreen ? "CHARACTERS" : "LOBBY"}
        onNavigate={setScreen}
        sound={sound}
        setSound={setSound}
      />

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              01 / WORLD PREMISE
            </div>

            <h1>
              ANG MUNDO NG
              <br />
              <span>TATSULOK</span>
            </h1>

            <p>
              Isang interactive puzzle-action game tungkol
              sa kapangyarihan, misteryo, kurapsyon,
              kaunlaran at paninindigan.
            </p>

            <div className="name-input">
              <input
                value={playerName}
                onChange={(e) =>
                  setPlayerName(e.target.value)
                }
                placeholder="PLAYER NAME..."
                maxLength={24}
              />

              <button
                onClick={() => {
                  if (playerName.trim()) {
                    setScreen("lobby");
                  } else {
                    setFlash(
                      "MAGLAGAY MUNA NG PANGALAN."
                    );
                  }
                }}
              >
                ENTER
              </button>
            </div>

            {flash && (
              <div className="form-toast">{flash}</div>
            )}
          </div>
        </section>

        <section className="character-section">
          <div className="section-head">
            <div>
              <div className="eyebrow">
                02 / CHARACTER SYSTEM
              </div>

              <h2>
                PILIIN ANG <span>IYONG KARAKTER</span>
              </h2>
            </div>

            <div className="section-note">
              11 CHARACTERS / 3 FACTIONS
              <br />
              CLICK TO SELECT
            </div>
          </div>

          <div className="character-grid">
            {characters.map((c, index) => (
              <button
                key={c.id}
                className={`character-card ${
                  selectedId === c.id ? "selected" : ""
                }`}
                onClick={() => chooseCharacter(c.id)}
              >
                <div className="card-image">
                  <img src={c.image} alt={c.name} />

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="card-info">
                  <b>{c.name}</b>
                  <small>{c.faction}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="dossier-section">
          <div className="dossier-portrait">
            <img
              src={character.image}
              alt={character.name}
            />
          </div>

          <div className="dossier-copy">
            <div className="eyebrow">
              SELECTED CHARACTER / DOSSIER
            </div>

            <h2>{character.name}</h2>

            <p className="faction-name">
              {character.faction}
            </p>

            <p>
              Handa na ang karakter para sa apat na yugto
              ng misyon. Ang stats ay magbabago habang
              gumagawa ka ng desisyon.
            </p>

            <div className="dossier-stats">
              <StatBar
                label="POWER"
                value={stats.power}
              />
              <StatBar
                label="TRUST"
                value={stats.trust}
              />
              <StatBar
                label="HUMANITY"
                value={stats.humanity}
              />
              <StatBar
                label="WEALTH"
                value={stats.wealth}
              />
            </div>

            <div className="launch-row">
              <div>
                <small>PLAYER</small>
                <b>{playerName || "UNKNOWN"}</b>
              </div>

              <button
                className="red-button"
                onClick={startMission}
              >
                START MISSION →
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
