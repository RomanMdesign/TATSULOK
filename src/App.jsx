import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import * as THREE from "three";

/* =========================================================
   CHARACTERS
========================================================= */

const characters = [
  {
    id: "peyudo",
    name: "Peyudo",
    faction: "Panginoon",
    role: "Pangunahing puwersa ng Panginoon",
    power: "Bilis, yaman, impluwensiya",
    image: "/assets/character-01.jpg",
  },
  {
    id: "misteryo",
    name: "Misteryo",
    faction: "Panginoon",
    role: "Hustisya na dumadaan sa dahas",
    power: "Dahas at misteryo",
    image: "/assets/character-02.jpg",
  },
  {
    id: "bangag",
    name: "Bangag",
    faction: "Panginoon",
    role: "Magulong kapangyarihang nakaupo",
    power: "Lakas at impluwensiya",
    image: "/assets/character-03.jpg",
  },
  {
    id: "pula",
    name: "Pula",
    faction: "Panginoon",
    role: "Kamay na bakal",
    power: "Kontrol at puwersa",
    image: "/assets/character-04.jpg",
  },
  {
    id: "tanikala",
    name: "Tanikala",
    faction: "Panginoon",
    role: "Tagasunod na nagbubuklod sa sistema",
    power: "Pagbubuklod at kontrol",
    image: "/assets/character-05.jpg",
  },
  {
    id: "presyo",
    name: "Presyo",
    faction: "Malakas",
    role: "Gumagamit ng hipnotismo",
    power: "Hipnotismo",
    image: "/assets/character-06.jpg",
  },
  {
    id: "pintuan",
    name: "Pintuan",
    faction: "Malakas",
    role: "Trangkahan na maaaring magmanipula ng tadhana",
    power: "Manipulasyon",
    image: "/assets/character-07.jpg",
  },
  {
    id: "ling",
    name: "Ling",
    faction: "Mabuti",
    role: "Tagapagpagaling",
    power: "Paggaling",
    image: "/assets/character-08.jpg",
  },
  {
    id: "batid",
    name: "Batid",
    faction: "Mabuti",
    role: "Kumakatawan sa edukasyon",
    power: "Kaalaman",
    image: "/assets/character-09.jpg",
  },
  {
    id: "tisa",
    name: "Tisa",
    faction: "Mabuti",
    role: "Kumakatawan sa pagtatanim",
    power: "Paglikha at pagtatanim",
    image: "/assets/character-10.jpg",
  },
  {
    id: "subalit",
    name: "Subalit",
    faction: "Mabuti",
    role: "Lumalaban batay sa puso, isip, at kabutihan",
    power: "Paninindigan",
    image: "/assets/character-11.jpg",
  },
];

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />

      <Route path="/characters" element={<Characters />} />

      <Route
        path="/characters/:id"
        element={<CharacterDossier />}
      />

      <Route path="/dossier" element={<Dossier />} />

      <Route path="/factions" element={<Factions />} />

      <Route path="/missions" element={<Missions />} />

      <Route path="/mission/01" element={<Mission01 />} />

      <Route path="/district/01" element={<District />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout({ children }) {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="logo">
          <span>△</span>
          TATSULOK
        </Link>

        <nav>
          <Link to="/">Lobby</Link>
          <Link to="/characters">Characters</Link>
          <Link to="/dossier">Dossier</Link>
          <Link to="/factions">Factions</Link>
          <Link to="/missions">Missions</Link>
        </nav>
      </header>

      {children}
    </div>
  );
}

/* =========================================================
   LOBBY
========================================================= */

function Lobby() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("tatsulok_player") || ""
  );

  function start() {
    if (!name.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    localStorage.setItem(
      "tatsulok_player",
      name.trim()
    );

    navigate("/missions");
  }

  return (
    <Layout>
      <main className="lobby">
        <div className="lobby-bg" />

        <div className="lobby-content">
          <div className="big-triangle">△</div>

          <div className="eyebrow">
            INTERACTIVE PUZZLE GAME
          </div>

          <h1>TATSULOK</h1>

          <p>
            Isang puzzle game tungkol sa kapangyarihan,
            misteryo, kurapsyon, kaunlaran, at demokrasya.
          </p>

          <label>PLAYER NAME</label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Ilagay ang pangalan"
          />

          <div className="buttons">
            <button
              className="primary"
              onClick={start}
            >
              START
            </button>

            <Link
              to="/characters"
              className="secondary"
            >
              CHARACTERS
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

/* =========================================================
   CHARACTERS
========================================================= */

function Characters() {
  const [filter, setFilter] = useState("Lahat");

  const list =
    filter === "Lahat"
      ? characters
      : characters.filter(
          (c) => c.faction === filter
        );

  return (
    <Layout>
      <main className="page">
        <PageTitle
          eyebrow="CHARACTER SYSTEM"
          title="Piliin ang Iyong Karakter"
          text="Bawat karakter ay may sariling kapangyarihan at paninindigan."
        />

        <div className="filters">
          {[
            "Lahat",
            "Panginoon",
            "Malakas",
            "Mabuti",
          ].map((item) => (
            <button
              key={item}
              className={
                filter === item
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="character-grid">
          {list.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              className="character-card"
            >
              <div className="portrait">
                <img
                  src={character.image}
                  alt={character.name}
                />
              </div>

              <div className="character-card-info">
                <small>
                  {character.faction}
                </small>

                <h3>{character.name}</h3>

                <p>{character.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}

/* =========================================================
   CHARACTER DOSSIER
========================================================= */

function CharacterDossier() {
  const { id } = useParams();

  const navigate = useNavigate();

  const character = characters.find(
    (c) => c.id === id
  );

  if (!character) {
    return <NotFound />;
  }

  function selectCharacter() {
    localStorage.setItem(
      "selected_character",
      character.id
    );

    navigate("/missions");
  }

  return (
    <Layout>
      <main className="page">
        <button
          className="back"
          onClick={() => navigate(-1)}
        >
          ← BACK
        </button>

        <div className="dossier-layout">
          <div className="dossier-image">
            <img
              src={character.image}
              alt={character.name}
            />
          </div>

          <div>
            <div className="eyebrow">
              {character.faction}
            </div>

            <h1>{character.name}</h1>

            <h2>{character.role}</h2>

            <div className="power-box">
              <small>LAKAS</small>
              <strong>
                {character.power}
              </strong>
            </div>

            <p className="description">
              Ang karakter na ito ay bahagi ng
              mundo ng TATSULOK. Ang kanyang
              papel at mga desisyon ay maaaring
              makaapekto sa direksiyon ng misyon.
            </p>

            <button
              className="primary"
              onClick={selectCharacter}
            >
              SELECT CHARACTER
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}

/* =========================================================
   DOSSIER
========================================================= */

function Dossier() {
  const id = localStorage.getItem(
    "selected_character"
  );

  const character = characters.find(
    (c) => c.id === id
  );

  return (
    <Layout>
      <main className="page">
        <PageTitle
          eyebrow="DOSSIER"
          title="Character Dossier"
          text="Impormasyon ng napiling karakter."
        />

        {character ? (
          <div className="selected-card">
            <img
              src={character.image}
              alt={character.name}
            />

            <div>
              <div className="eyebrow">
                {character.faction}
              </div>

              <h2>{character.name}</h2>

              <p>{character.role}</p>

              <div className="power-box">
                <small>POWER</small>
                <strong>
                  {character.power}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty">
            <h2>Walang napiling karakter.</h2>

            <Link
              className="primary"
              to="/characters"
            >
              PUMILI NG KARAKTER
            </Link>
          </div>
        )}
      </main>
    </Layout>
  );
}

/* =========================================================
   FACTIONS
========================================================= */

function Factions() {
  return (
    <Layout>
      <main className="page">
        <PageTitle
          eyebrow="THREE SIDES"
          title="Factions"
          text="Tatlong panig ng lipunan."
        />

        <div className="faction-grid">
          <Faction
            number="01"
            title="PANGINOON"
            text="Kapangyarihan, yaman, impluwensiya, at kontrol."
            faction="Panginoon"
          />

          <Faction
            number="02"
            title="MALAKAS"
            text="Mga puwersang kayang baguhin ang direksiyon ng laban."
            faction="Malakas"
          />

          <Faction
            number="03"
            title="MABUTI"
            text="Puso, isip, edukasyon, paggaling, pagtatanim, at kabutihan."
            faction="Mabuti"
          />
        </div>
      </main>
    </Layout>
  );
}

function Faction({
  number,
  title,
  text,
  faction,
}) {
  const members = characters.filter(
    (c) => c.faction === faction
  );

  return (
    <div className="faction">
      <small>{number}</small>

      <h2>{title}</h2>

      <p>{text}</p>

      <div className="members">
        {members.map((member) => (
          <Link
            key={member.id}
            to={`/characters/${member.id}`}
          >
            {member.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MISSIONS
========================================================= */

function Missions() {
  return (
    <Layout>
      <main className="page">
        <PageTitle
          eyebrow="MISSION SELECT"
          title="Harapin ang Misyon"
          text="Piliin ang mission na haharapin mo."
        />

        <div className="mission-card">
          <div className="mission-number">
            01
          </div>

          <div className="mission-content">
            <small>MISSION 01</small>

            <h2>
              EVACUATION CENTER
            </h2>

            <p>
              May emergency sa distrito.
              Magtungo sa evacuation center
              at alamin kung ano ang tunay
              na nangyayari.
            </p>

            <div className="tags">
              <span>BAHA</span>
              <span>MISTERYO</span>
              <span>CHOICE</span>
            </div>

            <Link
              to="/mission/01"
              className="primary"
            >
              OPEN MISSION
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

/* =========================================================
   MISSION BRIEFING
========================================================= */

function Mission01() {
  const navigate = useNavigate();

  const player =
    localStorage.getItem(
      "tatsulok_player"
    ) || "PLAYER";

  const selectedId =
    localStorage.getItem(
      "selected_character"
    );

  const character = characters.find(
    (c) => c.id === selectedId
  );

  return (
    <Layout>
      <main className="page mission-briefing">
        <button
          className="back"
          onClick={() => navigate("/missions")}
        >
          ← BACK
        </button>

        <div className="eyebrow">
          MISSION 01
        </div>

        <h1>
          EVACUATION
          <br />
          CENTER
        </h1>

        <p className="large-text">
          {player}, may emergency sa district.
          Kailangan mong pumunta sa evacuation
          center at alamin kung ano ang nangyayari.
        </p>

        <div className="objectives">
          <div>
            <small>OBJECTIVE 01</small>
            <strong>
              Hanapin ang Evacuation Center
            </strong>
          </div>

          <div>
            <small>OBJECTIVE 02</small>
            <strong>
              Alamin ang tunay na nangyayari
            </strong>
          </div>
        </div>

        {character && (
          <div className="ready-character">
            <img
              src={character.image}
              alt={character.name}
            />

            <div>
              <small>READY CHARACTER</small>
              <strong>
                {character.name}
              </strong>
            </div>
          </div>
        )}

        <button
          className="primary start-mission"
          onClick={() =>
            navigate("/district/01")
          }
        >
          START MISSION
        </button>
      </main>
    </Layout>
  );
}

/* =========================================================
   ACTUAL THREE.JS FIRST PERSON DISTRICT
========================================================= */

function District() {
  const navigate = useNavigate();

  const [distance, setDistance] =
    useState(74);

  const [canInteract, setCanInteract] =
    useState(false);

  const [showEvent, setShowEvent] =
    useState(false);

  return (
    <div className="game">
      <ThreeDistrict
        onDistance={setDistance}
        onInteractState={setCanInteract}
      />

      <button
        className="game-back"
        onClick={() => navigate("/missions")}
      >
        ← BACK
      </button>

      <div className="game-hud">
        <div className="mission-hud">
          <small>MISSION 01</small>

          <strong>
            EVACUATION CENTER
          </strong>
        </div>

        <div className="distance-hud">
          <small>DISTANCE</small>

          <strong>
            {distance}m
          </strong>
        </div>
      </div>

      <div className="objective-world-marker">
        <div className="diamond">
          ◆
        </div>

        <strong>
          EVACUATION CENTER
        </strong>

        <span>
          {distance}m
        </span>
      </div>

      <div className="crosshair">
        +
      </div>

      <MobileControls />

      <div className="desktop-help">
        WASD = MOVE
        <br />
        MOUSE = LOOK
      </div>

      {canInteract && (
        <button
          className="interact"
          onClick={() =>
            setShowEvent(true)
          }
        >
          INTERACT
        </button>
      )}

      {showEvent && (
        <MissionEvent
          onClose={() =>
            setShowEvent(false)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   THREE.JS SCENE
========================================================= */

function ThreeDistrict({
  onDistance,
  onInteractState,
}) {
  const containerRef =
    useRef(null);

  const keys = useRef({});

  const joystick = useRef({
    x: 0,
    y: 0,
  });

  const look = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) return;

    /* ---------------- SCENE ---------------- */

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x101820
      );

    scene.fog =
      new THREE.Fog(
        0x101820,
        20,
        130
      );

    /* ---------------- CAMERA ---------------- */

    const camera =
      new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
          window.innerHeight,
        0.1,
        300
      );

    camera.position.set(
      0,
      1.7,
      32
    );

    /* ---------------- RENDERER ---------------- */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.shadowMap.enabled =
      true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    container.appendChild(
      renderer.domElement
    );

    /* ---------------- LIGHTING ---------------- */

    const ambient =
      new THREE.HemisphereLight(
        0xb5c7dd,
        0x17110d,
        1.5
      );

    scene.add(ambient);

    const moon =
      new THREE.DirectionalLight(
        0xd9e6ff,
        2.2
      );

    moon.position.set(
      -20,
      35,
      20
    );

    moon.castShadow = true;

    scene.add(moon);

    /* ---------------- GROUND ---------------- */

    const groundMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x25282c,
        roughness: 0.92,
      });

    const ground =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          180,
          180
        ),
        groundMaterial
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(ground);

    /* ---------------- ROAD ---------------- */

    const roadMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x141619,
        roughness: 0.95,
      });

    const road =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          18,
          180
        ),
        roadMaterial
      );

    road.rotation.x =
      -Math.PI / 2;

    road.position.y =
      0.012;

    scene.add(road);

    /* ---------------- SIDEWALK ---------------- */

    createBox(
      scene,
      10,
      0.25,
      180,
      0x55585b,
      14,
      0.12,
      0
    );

    createBox(
      scene,
      10,
      0.25,
      180,
      0x55585b,
      -14,
      0.12,
      0
    );

    /* ---------------- BUILDINGS ---------------- */

    const buildingPositions = [
      [-22, 9, -15, 14, 20],
      [-23, 10, 18, 16, 24],
      [22, 12, -22, 17, 28],
      [24, 9, 10, 15, 20],
      [-34, 8, 43, 18, 22],
      [35, 14, 45, 20, 31],
      [-30, 11, -48, 20, 25],
      [31, 10, -52, 19, 27],
    ];

    buildingPositions.forEach(
      (b, index) => {
        createBuilding(
          scene,
          b[0],
          b[1],
          b[2],
          b[3],
          b[4],
          index
        );
      }
    );

    /* ---------------- STREET LINES ---------------- */

    for (
      let z = -80;
      z < 80;
      z += 10
    ) {
      const line =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.25,
            0.03,
            4
          ),
          new THREE.MeshBasicMaterial({
            color: 0xd2cba4,
          })
        );

      line.position.set(
        0,
        0.04,
        z
      );

      scene.add(line);
    }

    /* ---------------- LAMP POSTS ---------------- */

    for (
      let z = -70;
      z <= 70;
      z += 20
    ) {
      createLamp(
        scene,
        -11,
        z
      );

      createLamp(
        scene,
        11,
        z + 10
      );
    }

    /* ---------------- CARS ---------------- */

    createCar(
      scene,
      -5,
      0.65,
      12,
      0x303840
    );

    createCar(
      scene,
      5,
      0.65,
      -18,
      0x24282d
    );

    createCar(
      scene,
      -5,
      0.65,
      -48,
      0x3b3230
    );

    /* ---------------- DEBRIS ---------------- */

    for (
      let i = 0;
      i < 16;
      i++
    ) {
      const debris =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.3 +
              Math.random() * 1,
            0.2 +
              Math.random() * 0.5,
            0.3 +
              Math.random() * 1
          ),
          new THREE.MeshStandardMaterial({
            color: 0x34373a,
          })
        );

      const side =
        Math.random() > 0.5
          ? 1
          : -1;

      debris.position.set(
        side *
          (15 +
            Math.random() * 8),
        0.2,
        -20 +
          Math.random() * 90
      );

      debris.rotation.y =
        Math.random() * 3;

      debris.castShadow = true;

      scene.add(debris);
    }

    /* ---------------- EVACUATION CENTER ---------------- */

    const objective =
      new THREE.Group();

    objective.position.set(
      0,
      0,
      -65
    );

    scene.add(objective);

    const center =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          10,
          5,
          7
        ),
        new THREE.MeshStandardMaterial({
          color: 0x4b4f55,
          roughness: 0.7,
        })
      );

    center.position.y =
      2.5;

    center.castShadow = true;

    objective.add(center);

    const roof =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          11,
          0.7,
          8
        ),
        new THREE.MeshStandardMaterial({
          color: 0x24272b,
        })
      );

    roof.position.y =
      5.35;

    roof.castShadow = true;

    objective.add(roof);

    const sign =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          7,
          1.4,
          0.25
        ),
        new THREE.MeshBasicMaterial({
          color: 0xeeeeee,
        })
      );

    sign.position.set(
      0,
      4,
      -3.65
    );

    objective.add(sign);

    /* ---------------- PLAYER ---------------- */

    let yaw = 0;
    let pitch = 0;

    const velocity =
      new THREE.Vector3();

    const direction =
      new THREE.Vector3();

    const target =
      new THREE.Vector3(
        0,
        0,
        -65
      );

    /* ---------------- KEYBOARD ---------------- */

    function keyDown(e) {
      keys.current[
        e.code
      ] = true;
    }

    function keyUp(e) {
      keys.current[
        e.code
      ] = false;
    }

    window.addEventListener(
      "keydown",
      keyDown
    );

    window.addEventListener(
      "keyup",
      keyUp
    );

    /* ---------------- MOUSE LOOK ---------------- */

    let mouseDown = false;

    function mouseDownHandler() {
      mouseDown = true;
    }

    function mouseUpHandler() {
      mouseDown = false;
    }

    function mouseMoveHandler(
      e
    ) {
      if (!mouseDown) return;

      yaw -=
        e.movementX *
        0.002;

      pitch -=
        e.movementY *
        0.002;

      pitch = THREE.MathUtils.clamp(
        pitch,
        -1.35,
        1.35
      );
    }

    renderer.domElement.addEventListener(
      "mousedown",
      mouseDownHandler
    );

    window.addEventListener(
      "mouseup",
      mouseUpHandler
    );

    window.addEventListener(
      "mousemove",
      mouseMoveHandler
    );

    /* ---------------- TOUCH LOOK ---------------- */

    let touchX = 0;
    let touchY = 0;

    function touchStart(e) {
      if (
        e.touches.length !== 1
      )
        return;

      touchX =
        e.touches[0].clientX;

      touchY =
        e.touches[0].clientY;
    }

    function touchMove(e) {
      if (
        e.touches.length !== 1
      )
        return;

      const x =
        e.touches[0].clientX;

      const y =
        e.touches[0].clientY;

      const dx =
        x - touchX;

      const dy =
        y - touchY;

      if (
        x >
        window.innerWidth * 0.35
      ) {
        yaw -= dx * 0.004;

        pitch -= dy * 0.004;

        pitch =
          THREE.MathUtils.clamp(
            pitch,
            -1.35,
            1.35
          );
      }

      touchX = x;
      touchY = y;
    }

    renderer.domElement.addEventListener(
      "touchstart",
      touchStart,
      {
        passive: true,
      }
    );

    renderer.domElement.addEventListener(
      "touchmove",
      touchMove,
      {
        passive: true,
      }
    );

    /* ---------------- RESIZE ---------------- */

    function resize() {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    }

    window.addEventListener(
      "resize",
      resize
    );

    /* ---------------- ANIMATION ---------------- */

    let previous =
      performance.now();

    let animation;

    function animate(now) {
      animation =
        requestAnimationFrame(
          animate
        );

      const delta =
        Math.min(
          (now - previous) /
            1000,
          0.05
        );

      previous = now;

      /* Movement */

      direction.set(
        0,
        0,
        0
      );

      if (
        keys.current.KeyW ||
        keys.current.ArrowUp
      ) {
        direction.z -= 1;
      }

      if (
        keys.current.KeyS ||
        keys.current.ArrowDown
      ) {
        direction.z += 1;
      }

      if (
        keys.current.KeyA ||
        keys.current.ArrowLeft
      ) {
        direction.x -= 1;
      }

      if (
        keys.current.KeyD ||
        keys.current.ArrowRight
      ) {
        direction.x += 1;
      }

      direction.x +=
        joystick.current.x;

      direction.z +=
        joystick.current.y;

      if (
        direction.lengthSq() >
        0
      ) {
        direction.normalize();

        velocity.copy(
          direction
        );

        const forward =
          new THREE.Vector3(
            Math.sin(yaw),
            0,
            Math.cos(yaw)
          );

        const right =
          new THREE.Vector3(
            Math.cos(yaw),
            0,
            -Math.sin(yaw)
          );

        const move =
          new THREE.Vector3();

        move.addScaledVector(
          forward,
          -velocity.z
        );

        move.addScaledVector(
          right,
          velocity.x
        );

        move.normalize();

        camera.position.addScaledVector(
          move,
          9 * delta
        );
      }

      /* Keep player in district */

      camera.position.x =
        THREE.MathUtils.clamp(
          camera.position.x,
          -10,
          10
        );

      camera.position.z =
        THREE.MathUtils.clamp(
          camera.position.z,
          -72,
          36
        );

      camera.position.y =
        1.7;

      camera.rotation.order =
        "YXZ";

      camera.rotation.y =
        yaw;

      camera.rotation.x =
        pitch;

      /* Objective distance */

      const dx =
        camera.position.x -
        target.x;

      const dz =
        camera.position.z -
        target.z;

      const distance =
        Math.round(
          Math.sqrt(
            dx * dx +
              dz * dz
          )
        );

      onDistance(
        distance
      );

      onInteractState(
        distance <= 4
      );

      renderer.render(
        scene,
        camera
      );
    }

    animate(
      performance.now()
    );

    /* ---------------- CLEANUP ---------------- */

    return () => {
      cancelAnimationFrame(
        animation
      );

      window.removeEventListener(
        "keydown",
        keyDown
      );

      window.removeEventListener(
        "keyup",
        keyUp
      );

      window.removeEventListener(
        "mouseup",
        mouseUpHandler
      );

      window.removeEventListener(
        "mousemove",
        mouseMoveHandler
      );

      window.removeEventListener(
        "resize",
        resize
      );

      renderer.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, [
    onDistance,
    onInteractState,
  ]);

  return (
    <div
      ref={containerRef}
      className="three-container"
    />
  );
}

/* =========================================================
   THREE.JS OBJECT HELPERS
========================================================= */

function createBox(
  scene,
  width,
  height,
  depth,
  color,
  x,
  y,
  z
) {
  const mesh =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.85,
      })
    );

  mesh.position.set(
    x,
    y,
    z
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  return mesh;
}

function createBuilding(
  scene,
  x,
  width,
  z,
  depth,
  height,
  index
) {
  const colors = [
    0x32373d,
    0x41464c,
    0x292e34,
    0x4a4540,
  ];

  const building =
    createBox(
      scene,
      width,
      height,
      depth,
      colors[index % colors.length],
      x,
      height / 2,
      z
    );

  /* Windows */

  const rows =
    Math.max(
      2,
      Math.floor(
        height / 3
      )
    );

  const columns =
    Math.max(
      2,
      Math.floor(
        width / 3
      )
    );

  for (
    let r = 0;
    r < rows;
    r++
  ) {
    for (
      let c = 0;
      c < columns;
      c++
    ) {
      const window =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.8,
            1.1,
            0.08
          ),
          new THREE.MeshBasicMaterial({
            color:
              Math.random() >
              0.25
                ? 0x788b91
                : 0x202326,
          })
        );

      window.position.set(
        x -
          width / 2 +
          1.6 +
          c * 2.8,
        2 +
          r * 3,
        z -
          depth / 2 -
          0.05
      );

      scene.add(window);
    }
  }

  return building;
}

function createLamp(
  scene,
  x,
  z
) {
  const pole =
    createBox(
      scene,
      0.18,
      5,
      0.18,
      0x17191c,
      x,
      2.5,
      z
    );

  const light =
    new THREE.PointLight(
      0xffdca8,
      2,
      14
    );

  light.position.set(
    x,
    5.2,
    z
  );

  scene.add(light);

  const bulb =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.22,
        12,
        12
      ),
      new THREE.MeshBasicMaterial({
        color: 0xffdca8,
      })
    );

  bulb.position.copy(
    light.position
  );

  scene.add(bulb);

  return pole;
}

function createCar(
  scene,
  x,
  y,
  z,
  color
) {
  const car =
    new THREE.Group();

  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        2.3,
        0.65,
        4
      ),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
      })
    );

  body.position.y =
    0.7;

  car.add(body);

  const cabin =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.6,
        0.55,
        1.8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x1c252d,
        roughness: 0.3,
      })
    );

  cabin.position.set(
    0,
    1.2,
    -0.2
  );

  car.add(cabin);

  car.position.set(
    x,
    0,
    z
  );

  car.rotation.y =
    Math.PI / 2;

  scene.add(car);

  return car;
}

/* =========================================================
   MOBILE CONTROLS
========================================================= */

function MobileControls() {
  const joystickRef =
    useRef(null);

  const knobRef =
    useRef(null);

  const [active, setActive] =
    useState(false);

  function start(e) {
    e.preventDefault();

    setActive(true);

    move(e);
  }

  function move(e) {
    if (!active) return;

    const touch =
      e.touches[0];

    if (!touch) return;

    const rect =
      joystickRef.current.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    let dx =
      touch.clientX -
      centerX;

    let dy =
      touch.clientY -
      centerY;

    const max =
      rect.width / 2 - 25;

    const length =
      Math.sqrt(
        dx * dx +
          dy * dy
      );

    if (length > max) {
      dx =
        (dx / length) *
        max;

      dy =
        (dy / length) *
        max;
    }

    if (
      knobRef.current
    ) {
      knobRef.current.style.transform =
        `translate(${dx}px, ${dy}px)`;
    }

    window.__TATSULOK_JOYSTICK__ = {
      x: dx / max,
      y: dy / max,
    };
  }

  function end() {
    setActive(false);

    if (
      knobRef.current
    ) {
      knobRef.current.style.transform =
        "translate(0,0)";
    }

    window.__TATSULOK_JOYSTICK__ = {
      x: 0,
      y: 0,
    };
  }

  useEffect(() => {
    const interval =
      setInterval(() => {
        const value =
          window.__TATSULOK_JOYSTICK__ || {
            x: 0,
            y: 0,
          };

        /* This bridges the touch joystick
           into the Three.js movement system. */

        document.documentElement.style.setProperty(
          "--joy-x",
          value.x
        );

        document.documentElement.style.setProperty(
          "--joy-y",
          value.y
        );
      }, 16);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div
      ref={joystickRef}
      className="joystick"
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}
      onTouchCancel={end}
    >
      <div
        ref={knobRef}
        className="joystick-knob"
      />
    </div>
  );
}

/* =========================================================
   MISSION EVENT
========================================================= */

function MissionEvent({
  onClose,
}) {
  const navigate =
    useNavigate();

  const [
    selected,
    setSelected,
  ] = useState(null);

  function choose(choice) {
    setSelected(choice);
  }

  return (
    <div className="event-overlay">
      <div className="event-panel">
        <button
          className="event-close"
          onClick={onClose}
        >
          ×
        </button>

        <small>
          EVACUATION CENTER
        </small>

        <h2>
          May nakita kang
          kakaiba.
        </h2>

        <p>
          May mga taong naghihintay
          sa loob. Ngunit may isang
          dokumentong naiwan sa
          mesa na maaaring magpaliwanag
          kung bakit hindi nailikas
          ang buong distrito.
        </p>

        <div className="choices">
          <button
            className={
              selected === "help"
                ? "choice selected"
                : "choice"
            }
            onClick={() =>
              choose("help")
            }
          >
            Tumulong muna sa mga tao.
          </button>

          <button
            className={
              selected === "document"
                ? "choice selected"
                : "choice"
            }
            onClick={() =>
              choose("document")
            }
          >
            Siyasatin ang dokumento.
          </button>
        </div>

        {selected && (
          <div className="choice-result">
            <strong>
              DESISYON NAPILI
            </strong>

            <p>
              Ang iyong desisyon ay
              magkakaroon ng epekto sa
              susunod na bahagi ng misyon.
            </p>

            <button
              className="primary"
              onClick={() => {
                onClose();
                navigate(
                  "/mission/01"
                );
              }}
            >
              CONTINUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function PageTitle({
  eyebrow,
  title,
  text,
}) {
  return (
    <div className="page-title">
      <div className="eyebrow">
        {eyebrow}
      </div>

      <h1>{title}</h1>

      <p>{text}</p>
    </div>
  );
}

function NotFound() {
  return (
    <Layout>
      <main className="empty">
        <h1>404</h1>

        <p>
          Hindi makita ang page.
        </p>

        <Link
          to="/"
          className="primary"
        >
          BACK TO LOBBY
        </Link>
      </main>
    </Layout>
  );
}
