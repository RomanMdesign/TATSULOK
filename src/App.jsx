import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

/* =========================================================
   TATSULOK
   PLAYABLE FIRST-PERSON DISTRICT
   Mobile / iPad / Desktop
   ========================================================= */

const characters = [
  {
    id: "peyudo",
    name: "PEYUDO",
    faction: "PANGINOON",
    className: "panginoon",
    image: "/assets/peyudo.jpg",
    tagline: "Mabilis. Mayaman. Tanyag. Makapangyarihan.",
    role: "Pangunahing puwersa ng Panginoon",
    power: "Bilis, yaman, impluwensiya",
    symbol: "Mataas na posisyon sa tatsulok",
    description:
      "Isang makapangyarihang personalidad na gumagamit ng bilis, yaman at impluwensiya upang kontrolin ang direksiyon ng laban.",
  },
  {
    id: "misteryo",
    name: "MISTERYO",
    faction: "PANGINOON",
    className: "panginoon",
    image: "/assets/misteryo.jpg",
    tagline: "Hustisya na dumadaan sa dahas.",
    role: "Tagapaghiganti",
    power: "Dahas at lihim",
    symbol: "Anino",
    description:
      "Isang misteryosong karakter na naniniwalang ang hustisya ay kailangang kunin sa sariling paraan.",
  },
  {
    id: "bangag",
    name: "BANGAG",
    faction: "PANGINOON",
    className: "panginoon",
    image: "/assets/bangag.jpg",
    tagline: "Magulong kapangyarihang nakaupo sa trono.",
    role: "Tagapaghawak ng kapangyarihan",
    power: "Lakas at awtoridad",
    symbol: "Trono",
    description:
      "Magulo ngunit makapangyarihan. Ang kaniyang posisyon ay nagbibigay sa kaniya ng malaking impluwensiya sa sistema.",
  },
  {
    id: "pula",
    name: "PULA",
    faction: "PANGINOON",
    className: "panginoon",
    image: "/assets/pula.jpg",
    tagline: "Kamay na bakal at mga sinulid na pumupunit.",
    role: "Tagakontrol",
    power: "Kontrol at pananakot",
    symbol: "Pulang sinulid",
    description:
      "Isang karakter na kumokontrol sa mga galaw ng iba gamit ang takot, puwersa at mga nakatagong koneksiyon.",
  },
  {
    id: "tanikala",
    name: "TANIKALA",
    faction: "PANGINOON",
    className: "panginoon",
    image: "/assets/tanikala.jpg",
    tagline: "Tauhan ng Panginoon na nagbubuklod sa sistema.",
    role: "Tagasunod",
    power: "Disiplina at pagkontrol",
    symbol: "Tanikala",
    description:
      "Isang tauhang nakakabit sa sistema at nagsisilbing tagapagpatupad ng mga utos.",
  },
  {
    id: "presyo",
    name: "PRESYO",
    faction: "MALAKAS",
    className: "malakas",
    image: "/assets/presyo.jpg",
    tagline: "Gumagamit ng hipnotismo.",
    role: "Manipulator",
    power: "Hipnotismo at impluwensiya",
    symbol: "Mata",
    description:
      "Kayang baguhin ang pag-iisip at pananaw ng iba upang maiba ang direksiyon ng laban.",
  },
  {
    id: "pintuan",
    name: "PINTUAN",
    faction: "MALAKAS",
    className: "malakas",
    image: "/assets/pintuan.jpg",
    tagline: "Trangkahan na maaaring magmanipula ng tadhana.",
    role: "Tagapamagitan",
    power: "Pagbukas at pagsara ng posibilidad",
    symbol: "Pintuan",
    description:
      "Isang bantay ng mga posibilidad. Ang bawat pintuang binubuksan ay maaaring magdala sa ibang kapalaran.",
  },
  {
    id: "ling",
    name: "LING",
    faction: "MABUTI",
    className: "mabuti",
    image: "/assets/ling.jpg",
    tagline: "Tagapagpagaling.",
    role: "Tagapagpagaling",
    power: "Pagpapagaling at pag-asa",
    symbol: "Buhay",
    description:
      "Pinoprotektahan ang iba at nagbibigay ng pagkakataon para makabangon ang mga nasaktan.",
  },
  {
    id: "batid",
    name: "BATID",
    faction: "MABUTI",
    className: "mabuti",
    image: "/assets/batid.jpg",
    tagline: "Kumakatawan sa edukasyon.",
    role: "Tagapagturo",
    power: "Kaalaman at edukasyon",
    symbol: "Karunungan",
    description:
      "Naniniwala na ang kaalaman ang susi upang mabago ang sistema at makagawa ng mas mabuting desisyon.",
  },
  {
    id: "tisa",
    name: "TISA",
    faction: "MABUTI",
    className: "mabuti",
    image: "/assets/tisa.jpg",
    tagline: "Kumakatawan sa pagtatanim.",
    role: "Tagapagtanim",
    power: "Pag-unlad at pagtitiyaga",
    symbol: "Binhi",
    description:
      "Kumakatawan sa mabagal ngunit matibay na pag-unlad na nagsisimula sa isang maliit na binhi.",
  },
  {
    id: "subalit",
    name: "SUBALIT",
    faction: "MABUTI",
    className: "mabuti",
    image: "/assets/subalit.jpg",
    tagline: "Lumaban batay sa puso, isip, at kabutihan.",
    role: "Tagapagtanggol",
    power: "Tapang at paninindigan",
    symbol: "Puso at isip",
    description:
      "Hindi lamang lakas ang kaniyang sandata. Gumagamit siya ng puso, isip at paninindigan.",
  },
];

const factions = {
  LAHAT: "lahat",
  PANGINOON: "panginoon",
  MALAKAS: "malakas",
  MABUTI: "mabuti",
};

/* =========================================================
   WORLD LOCATIONS
   ========================================================= */

const locations = [
  {
    id: "evacuation",
    name: "EVACUATION CENTER",
    type: "OBJECTIVE",
    x: 50,
    y: 36,
    icon: "✚",
    color: "green",
  },
  {
    id: "relief",
    name: "RELIEF SUPPLIES",
    type: "SUPPLY",
    x: 69,
    y: 42,
    icon: "▣",
    color: "gold",
  },
  {
    id: "office",
    name: "DISTRICT OFFICE",
    type: "INTEL",
    x: 30,
    y: 25,
    icon: "⌂",
    color: "red",
  },
  {
    id: "school",
    name: "SCHOOL",
    type: "CIVILIAN",
    x: 24,
    y: 51,
    icon: "▤",
    color: "blue",
  },
  {
    id: "market",
    name: "MARKET",
    type: "AREA",
    x: 55,
    y: 58,
    icon: "▦",
    color: "gold",
  },
  {
    id: "warehouse",
    name: "WAREHOUSE",
    type: "AREA",
    x: 14,
    y: 69,
    icon: "▣",
    color: "purple",
  },
  {
    id: "depot",
    name: "DEPOT",
    type: "AREA",
    x: 80,
    y: 63,
    icon: "▰",
    color: "blue",
  },
  {
    id: "bridge",
    name: "OLD BRIDGE",
    type: "ROUTE",
    x: 83,
    y: 82,
    icon: "═",
    color: "blue",
  },
  {
    id: "tower",
    name: "TOWER",
    type: "LANDMARK",
    x: 54,
    y: 15,
    icon: "△",
    color: "purple",
  },
  {
    id: "hotel",
    name: "HOTEL",
    type: "LANDMARK",
    x: 72,
    y: 18,
    icon: "H",
    color: "gold",
  },
  {
    id: "cityhall",
    name: "CITY HALL",
    type: "LANDMARK",
    x: 21,
    y: 17,
    icon: "⌘",
    color: "blue",
  },
];

const missions = [
  {
    id: 1,
    title: "EVACUATION CENTER",
    description: "Tulungan ang mga mamamayan.",
    objective: "evacuation",
    message: "Pumasok sa distrito. Hanapin ang evacuation center.",
  },
  {
    id: 2,
    title: "RELIEF SUPPLIES",
    description: "Hanapin ang nawawalang suplay.",
    objective: "relief",
    message: "Nasa loob ng district ang nawawalang relief supplies.",
  },
  {
    id: 3,
    title: "DISTRICT OFFICE",
    description: "Siyasatin ang dokumento.",
    objective: "office",
    message: "May dokumentong maaaring magbago ng iyong pananaw.",
  },
  {
    id: 4,
    title: "OLD BRIDGE",
    description: "Buksan ang evacuation route.",
    objective: "bridge",
    message: "Ang lumang tulay ang huling daan palabas ng distrito.",
  },
];

/* =========================================================
   CITY GEOMETRY
   ========================================================= */

const cityBuildings = [
  { x: 8, y: 9, w: 15, h: 21, height: 5, name: "CITY HALL" },
  { x: 27, y: 7, w: 13, h: 17, height: 7, name: "TOWER" },
  { x: 50, y: 8, w: 13, h: 22, height: 6, name: "HOTEL" },
  { x: 69, y: 8, w: 19, h: 19, height: 5, name: "MALL" },
  { x: 5, y: 43, w: 17, h: 22, height: 4, name: "WAREHOUSE" },
  { x: 27, y: 37, w: 14, h: 18, height: 5, name: "SCHOOL" },
  { x: 51, y: 40, w: 16, h: 18, height: 4, name: "MARKET" },
  { x: 76, y: 43, w: 15, h: 24, height: 5, name: "DEPOT" },
];

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("tatsulok-player") || ""
  );

  const [selectedId, setSelectedId] = useState(
    () => localStorage.getItem("tatsulok-character") || "subalit"
  );

  const [activeFaction, setActiveFaction] = useState("LAHAT");
  const [ready, setReady] = useState(false);

  const [screen, setScreen] = useState(
    () => localStorage.getItem("tatsulok-screen") || "world"
  );

  const [mission, setMission] = useState(
    () => Number(localStorage.getItem("tatsulok-mission")) || 1
  );

  const [health, setHealth] = useState(
    () => Number(localStorage.getItem("tatsulok-health")) || 100
  );

  const [power, setPower] = useState(
    () => Number(localStorage.getItem("tatsulok-power")) || 68
  );

  const [trust, setTrust] = useState(
    () => Number(localStorage.getItem("tatsulok-trust")) || 42
  );

  const [humanity, setHumanity] = useState(
    () => Number(localStorage.getItem("tatsulok-humanity")) || 55
  );

  const [player, setPlayer] = useState({
    x: 50,
    y: 82,
  });

  const [message, setMessage] = useState(
    "Pumasok sa distrito. Hanapin ang evacuation center."
  );

  const [choiceOpen, setChoiceOpen] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  const [inventory, setInventory] = useState({
    medkit: 3,
    water: 2,
    supplies: 1,
  });

  const [camera, setCamera] = useState({
    yaw: 0,
    pitch: 0,
  });

  const joystickRef = useRef(null);
  const joystickActive = useRef(false);

  const selectedCharacter = useMemo(
    () => characters.find((c) => c.id === selectedId) || characters[10],
    [selectedId]
  );

  const currentMission =
    missions.find((m) => m.id === mission) || missions[0];

  const currentObjective = locations.find(
    (location) => location.id === currentMission.objective
  );

  const filteredCharacters =
    activeFaction === "LAHAT"
      ? characters
      : characters.filter((c) => c.faction === activeFaction);

  /* =========================================================
     LOCAL SAVE
     ========================================================= */

  useEffect(() => {
    localStorage.setItem("tatsulok-player", playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem("tatsulok-character", selectedId);
  }, [selectedId]);

  useEffect(() => {
    localStorage.setItem("tatsulok-screen", screen);
  }, [screen]);

  useEffect(() => {
    localStorage.setItem("tatsulok-mission", mission);
    localStorage.setItem("tatsulok-health", health);
    localStorage.setItem("tatsulok-power", power);
    localStorage.setItem("tatsulok-trust", trust);
    localStorage.setItem("tatsulok-humanity", humanity);
  }, [mission, health, power, trust, humanity]);

  /* =========================================================
     KEYBOARD MOVEMENT
     ========================================================= */

  useEffect(() => {
    function handleKeyDown(event) {
      if (screen !== "mission") return;
      if (choiceOpen || showMap || journalOpen) return;

      const key = event.key.toLowerCase();

      if (key === "w" || key === "arrowup") {
        event.preventDefault();
        movePlayer(0, -2.5);
      }

      if (key === "s" || key === "arrowdown") {
        event.preventDefault();
        movePlayer(0, 2.5);
      }

      if (key === "a" || key === "arrowleft") {
        event.preventDefault();
        movePlayer(-2.5, 0);
      }

      if (key === "d" || key === "arrowright") {
        event.preventDefault();
        movePlayer(2.5, 0);
      }

      if (key === "e" || key === " ") {
        event.preventDefault();
        interactObjective();
      }

      if (key === "m") {
        setShowMap(true);
      }

      if (key === "j") {
        setJournalOpen(true);
      }

      if (key === "escape") {
        setChoiceOpen(false);
        setShowMap(false);
        setJournalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  /* =========================================================
     PLAYER MOVEMENT
     ========================================================= */

  function movePlayer(dx, dy) {
    setPlayer((current) => ({
      x: Math.max(4, Math.min(96, current.x + dx)),
      y: Math.max(7, Math.min(94, current.y + dy)),
    }));
  }

  function moveDirection(direction) {
    if (choiceOpen || showMap || journalOpen) return;

    if (direction === "up") movePlayer(0, -3);
    if (direction === "down") movePlayer(0, 3);
    if (direction === "left") movePlayer(-3, 0);
    if (direction === "right") movePlayer(3, 0);
  }

  /* =========================================================
     DISTANCE
     ========================================================= */

  function distanceToObjective() {
    if (!currentObjective) return 999;

    const dx = player.x - currentObjective.x;
    const dy = player.y - currentObjective.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /* =========================================================
     INTERACTION
     ========================================================= */

  function interactObjective() {
    if (choiceOpen) return;

    const distance = distanceToObjective();

    if (distance > 14) {
      setMessage(
        `Masyadong malayo. Lumapit pa sa ${currentObjective.name}.`
      );
      return;
    }

    setChoiceOpen(true);
    setMessage(`Nasa ${currentObjective.name} ka na.`);
  }

  /* =========================================================
     MISSION CHOICES
     ========================================================= */

  function makeChoice(choice) {
    setChoiceOpen(false);

    if (mission === 1) {
      if (choice === "help") {
        setHumanity((value) => Math.min(100, value + 15));
        setTrust((value) => Math.min(100, value + 15));
        setPower((value) => Math.max(0, value - 5));

        setMessage(
          "Tinulungan mo ang mga mamamayan. Tumaas ang tiwala at humanity."
        );
      }

      if (choice === "control") {
        setPower((value) => Math.min(100, value + 15));
        setTrust((value) => Math.max(0, value - 10));

        setMessage(
          "Kinontrol mo ang distribution. Tumaas ang power ngunit bumaba ang trust."
        );
      }

      if (choice === "leave") {
        setHumanity((value) => Math.max(0, value - 15));
        setMessage("Pinili mong huwag makialam.");
      }
    }

    if (mission === 2) {
      setInventory((items) => ({
        ...items,
        supplies: items.supplies + 2,
      }));

      setTrust((value) => Math.min(100, value + 8));

      setMessage("Nakuha mo ang relief supplies.");
    }

    if (mission === 3) {
      setPower((value) => Math.min(100, value + 8));
      setTrust((value) => Math.min(100, value + 5));

      setMessage("Nakuha mo ang dokumentong naglalantad sa sistema.");
    }

    if (mission === 4) {
      setHumanity((value) => Math.min(100, value + 20));
      setTrust((value) => Math.min(100, value + 12));

      setMessage("Nabuksan ang evacuation route.");
    }

    setMissionComplete(true);
  }

  /* =========================================================
     NEXT MISSION
     ========================================================= */

  function nextMission() {
    if (mission >= 4) {
      setScreen("dossier");
      setMissionComplete(false);
      return;
    }

    const next = mission + 1;

    setMission(next);
    setPlayer({ x: 50, y: 82 });
    setMissionComplete(false);

    const nextMissionData = missions.find((m) => m.id === next);

    setMessage(nextMissionData.message);
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetMission() {
    setPlayer({ x: 50, y: 82 });
    setMissionComplete(false);
    setChoiceOpen(false);

    const m = missions.find((item) => item.id === mission);

    setMessage(m?.message || "Bumalik sa simula ng mission.");
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function goBack() {
    if (screen === "mission") {
      setScreen("lobby");
      setChoiceOpen(false);
      setShowMap(false);
      setJournalOpen(false);
      return;
    }

    if (screen === "lobby") {
      setScreen("world");
      return;
    }

    if (screen === "characters") {
      setScreen("lobby");
      return;
    }

    if (screen === "dossier") {
      setScreen("characters");
      return;
    }

    if (screen === "factions") {
      setScreen("world");
      return;
    }

    setScreen("world");
  }

  function selectCharacter(id) {
    setSelectedId(id);
    setReady(false);
  }

  function toggleReady() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setReady((value) => !value);
  }

  function enterLobby() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setScreen("lobby");
  }

  function startMission() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    if (!ready) {
      alert("Pindutin muna ang READY.");
      return;
    }

    setScreen("mission");
    setMission(1);
    setMissionComplete(false);
    setChoiceOpen(false);
    setShowMap(false);
    setJournalOpen(false);
    setPlayer({ x: 50, y: 82 });
    setMessage(missions[0].message);
  }

  /* =========================================================
     JOYSTICK
     ========================================================= */

  function handleJoystickStart(event) {
    event.preventDefault();

    joystickActive.current = true;

    handleJoystickMove(event);
  }

  function handleJoystickMove(event) {
    if (!joystickActive.current) return;

    const touch =
      event.touches?.[0] ||
      event.changedTouches?.[0] ||
      event;

    if (!touch) return;

    const rect = joystickRef.current?.getBoundingClientRect();

    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;

    const max = rect.width * 0.34;

    const normalizedX = Math.max(-1, Math.min(1, dx / max));
    const normalizedY = Math.max(-1, Math.min(1, dy / max));

    setPlayer((current) => ({
      x: Math.max(
        4,
        Math.min(96, current.x + normalizedX * 1.8)
      ),
      y: Math.max(
        7,
        Math.min(94, current.y + normalizedY * 1.8)
      ),
    }));
  }

  function handleJoystickEnd() {
    joystickActive.current = false;
  }

  /* =========================================================
     CAMERA LOOK
     ========================================================= */

  function lookAround(direction) {
    setCamera((current) => ({
      ...current,
      yaw:
        direction === "left"
          ? Math.max(-12, current.yaw - 3)
          : Math.min(12, current.yaw + 3),
    }));
  }

  /* =========================================================
     WORLD SCREEN
     ========================================================= */

  if (screen === "world") {
    return (
      <div className="app">
        <TopNav
          screen={screen}
          goBack={goBack}
          setScreen={setScreen}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />

        <main className="landing">
          <div className="landing-glow" />

          <div className="landing-content">
            <div className="eyebrow">TATSULOK / LIVE DISTRICT</div>

            <h1>
              ANG DISTRICT
              <br />
              AY BUHAY.
            </h1>

            <p>
              Isang interactive mission world kung saan bawat
              galaw at bawat desisyon ay may epekto.
            </p>

            <div className="player-entry">
              <label>OPERATIVE NAME</label>

              <input
                value={playerName}
                onChange={(event) =>
                  setPlayerName(event.target.value)
                }
                placeholder="Ilagay ang pangalan"
              />
            </div>

            <button
              className="gold-button large"
              onClick={enterLobby}
            >
              ENTER DISTRICT
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     LOBBY
     ========================================================= */

  if (screen === "lobby") {
    return (
      <div className="app">
        <TopNav
          screen={screen}
          goBack={goBack}
          setScreen={setScreen}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />

        <main className="lobby-screen">
          <section className="lobby-heading">
            <div>
              <span className="eyebrow">OPERATIVE SELECTION</span>

              <h1>
                PILIIN ANG
                <br />
                IYONG TAUHAN
              </h1>
            </div>

            <div className="save-status">
              ● SAVED LOCALLY
            </div>
          </section>

          <section className="character-grid">
            {characters.map((character) => (
              <button
                key={character.id}
                className={`character-card ${
                  selectedId === character.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => selectCharacter(character.id)}
              >
                <div className="character-image-wrap">
                  <img
                    src={character.image}
                    alt={character.name}
                    onError={(event) => {
                      event.currentTarget.style.opacity = "0";
                    }}
                  />

                  <span className="character-index">
                    {String(
                      characters.indexOf(character) + 1
                    ).padStart(2, "0")}
                  </span>
                </div>

                <div className="character-info">
                  <strong>{character.name}</strong>
                  <span>{character.faction}</span>
                </div>
              </button>
            ))}
          </section>

          <section className="selected-character">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
            />

            <div className="selected-copy">
              <span className="eyebrow">
                SELECTED OPERATIVE
              </span>

              <h2>{selectedCharacter.name}</h2>

              <p>{selectedCharacter.description}</p>

              <div className="character-stats">
                <span>{selectedCharacter.role}</span>
                <span>{selectedCharacter.power}</span>
                <span>{selectedCharacter.symbol}</span>
              </div>
            </div>

            <div className="ready-panel">
              <label>PLAYER</label>

              <strong>
                {playerName || "UNNAMED"}
              </strong>

              <button
                className={`ready-button ${
                  ready ? "active" : ""
                }`}
                onClick={toggleReady}
              >
                {ready ? "READY ✓" : "READY"}
              </button>

              <button
                className="gold-button"
                onClick={startMission}
              >
                START MISSION
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* =========================================================
     CHARACTERS
     ========================================================= */

  if (screen === "characters") {
    return (
      <div className="app">
        <TopNav
          screen={screen}
          goBack={goBack}
          setScreen={setScreen}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />

        <main className="characters-page">
          <div className="page-header">
            <span className="eyebrow">TATSULOK DATABASE</span>
            <h1>CHARACTERS</h1>
          </div>

          <div className="faction-tabs">
            {Object.keys(factions).map((faction) => (
              <button
                key={faction}
                className={
                  activeFaction === faction ? "active" : ""
                }
                onClick={() => setActiveFaction(faction)}
              >
                {faction}
              </button>
            ))}
          </div>

          <div className="character-grid large-grid">
            {filteredCharacters.map((character) => (
              <button
                key={character.id}
                className="character-card"
                onClick={() => {
                  setSelectedId(character.id);
                  setScreen("dossier");
                }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                />

                <div className="character-info">
                  <strong>{character.name}</strong>
                  <span>{character.faction}</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     DOSSIER
     ========================================================= */

  if (screen === "dossier") {
    return (
      <div className="app">
        <TopNav
          screen={screen}
          goBack={goBack}
          setScreen={setScreen}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />

        <main className="dossier-page">
          <section className="dossier-portrait">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
            />
          </section>

          <section className="dossier-copy">
            <span className="eyebrow">
              OPERATIVE DOSSIER
            </span>

            <h1>{selectedCharacter.name}</h1>

            <h3>{selectedCharacter.faction}</h3>

            <p className="dossier-tagline">
              {selectedCharacter.tagline}
            </p>

            <p>{selectedCharacter.description}</p>

            <div className="dossier-lines">
              <div>
                <span>ROLE</span>
                <strong>{selectedCharacter.role}</strong>
              </div>

              <div>
                <span>POWER</span>
                <strong>{selectedCharacter.power}</strong>
              </div>

              <div>
                <span>SYMBOL</span>
                <strong>{selectedCharacter.symbol}</strong>
              </div>
            </div>

            <button
              className="gold-button"
              onClick={() => setScreen("lobby")}
            >
              BACK TO LOBBY
            </button>
          </section>
        </main>
      </div>
    );
  }

  /* =========================================================
     FACTIONS
     ========================================================= */

  if (screen === "factions") {
    return (
      <div className="app">
        <TopNav
          screen={screen}
          goBack={goBack}
          setScreen={setScreen}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />

        <main className="factions-page">
          <div className="page-header">
            <span className="eyebrow">POWER STRUCTURE</span>
            <h1>FACTIONS</h1>
          </div>

          <div className="faction-overview">
            <article className="faction-box panginoon">
              <span>PANGINOON</span>
              <h2>CONTROL</h2>
              <p>
                Yaman, impluwensiya at awtoridad.
              </p>
            </article>

            <article className="faction-box malakas">
              <span>MALAKAS</span>
              <h2>INFLUENCE</h2>
              <p>
                Manipulasyon at posibilidad.
              </p>
            </article>

            <article className="faction-box mabuti">
              <span>MABUTI</span>
              <h2>HUMANITY</h2>
              <p>
                Kaalaman, pag-asa at paninindigan.
              </p>
            </article>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     MISSION
     ========================================================= */

  return (
    <div className="app mission-app">
      <TopNav
        screen={screen}
        goBack={goBack}
        setScreen={setScreen}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      <main className="mission-layout">

        {/* LEFT HUD */}

        <aside className="mission-left hud-panel">
          <div className="mission-title">
            <span>MISSION {String(mission).padStart(2, "0")}</span>
            <h1>{currentMission.title}</h1>
            <p>{currentMission.description}</p>
          </div>

          <div className="operative-mini">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
            />

            <div>
              <span>OPERATIVE</span>
              <strong>{selectedCharacter.name}</strong>
              <small>{selectedCharacter.faction}</small>
            </div>
          </div>

          <div className="feed">
            <h3>MISSION FEED</h3>

            <div className="feed-item">
              <i />
              Pumasok sa distrito.
            </div>

            <div className="feed-item">
              <i />
              May narinig na sigawan sa Market.
            </div>

            <div className="feed-item">
              <i />
              Relief Supplies may nawawala.
            </div>
          </div>

          <div className="objectives">
            <div className="section-heading">
              <span>OBJECTIVES</span>
              <b>
                {missionComplete ? "1/1" : "0/1"}
              </b>
            </div>

            <div
              className={`objective-row ${
                !missionComplete ? "active" : ""
              }`}
            >
              <i />
              {currentMission.title}
            </div>
          </div>
        </aside>

        {/* FIRST PERSON GAME */}

        <section className="game-view">

          <div
            className="world-3d"
            style={{
              transform: `perspective(900px) rotateY(${camera.yaw}deg)`,
            }}
          >
            <div className="sky" />

            <div className="far-city">
              {cityBuildings.map((building, index) => (
                <div
                  key={index}
                  className="building"
                  style={{
                    left: `${building.x}%`,
                    top: `${building.y}%`,
                    width: `${building.w}%`,
                    height: `${building.h}%`,
                  }}
                >
                  <div className="building-face">
                    <span>{building.name}</span>

                    <div className="windows">
                      {Array.from({ length: 12 }).map(
                        (_, i) => (
                          <i key={i} />
                        )
                      )}
                    </div>
                  </div>

                  <div
                    className="building-side"
                    style={{
                      transform: `translateX(${building.height}px) skewY(-12deg)`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="road road-main" />
            <div className="road road-cross" />
            <div className="road road-diagonal" />

            <div className="canal" />
            <div className="bridge" />

            <div className="street-lamp lamp-1" />
            <div className="street-lamp lamp-2" />
            <div className="street-lamp lamp-3" />

            <div className="street-car car-1" />
            <div className="street-car car-2" />
            <div className="street-car car-3" />

            {/* LANDMARKS */}

            {locations.map((location) => {
              const active =
                location.id === currentMission.objective;

              return (
                <button
                  key={location.id}
                  className={`world-marker ${location.color} ${
                    active ? "target" : ""
                  }`}
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                  }}
                  onClick={() => {
                    if (active) {
                      interactObjective();
                    } else {
                      setMessage(
                        `${location.name}: ${location.type}.`
                      );
                    }
                  }}
                >
                  <span className="marker-icon">
                    {location.icon}
                  </span>

                  <span className="marker-label">
                    {location.name}
                  </span>

                  {active && (
                    <small>
                      {Math.round(
                        distanceToObjective() * 1.6
                      )}
                      m
                    </small>
                  )}
                </button>
              );
            })}

            {/* PLAYER POSITION */}

            <div
              className="player-marker"
              style={{
                left: `${player.x}%`,
                top: `${player.y}%`,
              }}
            >
              <div className="player-shadow" />
              <div className="player-body" />
            </div>

            {/* CROSSHAIR */}

            <div className="crosshair">
              <span />
              <span />
              <span />
              <span />
            </div>

            {/* WEAPON */}

            <div className="weapon">
              <div className="weapon-hand" />
              <div className="weapon-body" />
              <div className="weapon-barrel" />
            </div>

            {/* TARGET MESSAGE */}

            <div className="target-distance">
              <strong>
                {currentObjective?.name}
              </strong>

              <span>
                {Math.round(distanceToObjective() * 1.6)}m
              </span>
            </div>

            {/* STATUS MESSAGE */}

            <div className="game-message">
              {message}
            </div>
          </div>

          {/* MOBILE CONTROLS */}

          <div className="touch-controls">

            <div
              ref={joystickRef}
              className="joystick"
              onTouchStart={handleJoystickStart}
              onTouchMove={handleJoystickMove}
              onTouchEnd={handleJoystickEnd}
              onTouchCancel={handleJoystickEnd}
            >
              <div className="joystick-stick" />
            </div>

            <div className="touch-actions">

              <button
                className="touch-look"
                onClick={() => lookAround("left")}
              >
                ◀
              </button>

              <button
                className="interact-button"
                onClick={interactObjective}
              >
                <strong>E</strong>
                <span>INTERACT</span>
              </button>

              <button
                className="touch-look"
                onClick={() => lookAround("right")}
              >
                ▶
              </button>

            </div>
          </div>

          {/* DESKTOP CONTROLS */}

          <div className="desktop-controls">
            <span>WASD / ARROWS — MOVE</span>
            <span>E — INTERACT</span>
            <span>M — MAP</span>
            <span>J — JOURNAL</span>
          </div>

          {/* WEAPON HUD */}

          <div className="weapon-hud">
            <div className="weapon-slot active">
              <span>PRIMARY</span>
              <strong>▰</strong>
              <b>30 / 120</b>
            </div>

            <div className="weapon-slot">
              <span>SECONDARY</span>
              <strong>▱</strong>
              <b>12 / 36</b>
            </div>

            <div className="weapon-slot">
              <span>ITEM</span>
              <strong>◇</strong>
              <b>2</b>
            </div>
          </div>
        </section>

        {/* RIGHT HUD */}

        <aside className="mission-right hud-panel">

          <div className="right-box">
            <h3>CONTROLS</h3>

            <div className="keyboard">
              <button onClick={() => moveDirection("up")}>
                W
              </button>

              <div>
                <button
                  onClick={() => moveDirection("left")}
                >
                  A
                </button>

                <button
                  onClick={() => moveDirection("down")}
                >
                  S
                </button>

                <button
                  onClick={() => moveDirection("right")}
                >
                  D
                </button>
              </div>

              <button
                className="key-wide"
                onClick={interactObjective}
              >
                E &nbsp; INTERACT
              </button>
            </div>
          </div>

          <div className="right-box">
            <h3>STATS</h3>

            <Stat
              label="HEALTH"
              value={health}
              type="health"
            />

            <Stat
              label="POWER"
              value={power}
              type="power"
            />

            <Stat
              label="TRUST"
              value={trust}
              type="trust"
            />

            <Stat
              label="HUMANITY"
              value={humanity}
              type="humanity"
            />
          </div>

          <div className="right-box">
            <h3>INVENTORY</h3>

            <div className="inventory">
              <div>
                <strong>✚</strong>
                <span>x{inventory.medkit}</span>
              </div>

              <div>
                <strong>♢</strong>
                <span>x{inventory.water}</span>
              </div>

              <div>
                <strong>▣</strong>
                <span>x{inventory.supplies}</span>
              </div>
            </div>
          </div>

          <div className="right-box shortcuts">
            <div>
              MOVE
              <span>W A S D</span>
            </div>

            <div>
              INTERACT
              <span>E</span>
            </div>

            <div>
              MAP
              <span>M</span>
            </div>

            <div>
              JOURNAL
              <span>J</span>
            </div>
          </div>

          <button
            className="reset-button"
            onClick={resetMission}
          >
            RESET MISSION
          </button>
        </aside>
      </main>

      {/* MAP */}

      {showMap && (
        <div className="modal-layer">
          <div className="map-modal">
            <button
              className="modal-close"
              onClick={() => setShowMap(false)}
            >
              ×
            </button>

            <span className="eyebrow">
              DISTRICT 07
            </span>

            <h2>TACTICAL MAP</h2>

            <div className="mini-map-large">
              {locations.map((location) => (
                <button
                  key={location.id}
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                  }}
                  className={
                    location.id === currentMission.objective
                      ? "map-target"
                      : ""
                  }
                  onClick={() => {
                    if (
                      location.id ===
                      currentMission.objective
                    ) {
                      setShowMap(false);
                      interactObjective();
                    }
                  }}
                >
                  ●
                </button>
              ))}

              <div
                className="map-player"
                style={{
                  left: `${player.x}%`,
                  top: `${player.y}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* JOURNAL */}

      {journalOpen && (
        <div className="modal-layer">
          <div className="journal-modal">
            <button
              className="modal-close"
              onClick={() => setJournalOpen(false)}
            >
              ×
            </button>

            <span className="eyebrow">
              OPERATIVE JOURNAL
            </span>

            <h2>MISSION {String(mission).padStart(2, "0")}</h2>

            <p>{currentMission.description}</p>

            <div className="journal-stat">
              <span>POWER</span>
              <strong>{power}</strong>
            </div>

            <div className="journal-stat">
              <span>TRUST</span>
              <strong>{trust}</strong>
            </div>

            <div className="journal-stat">
              <span>HUMANITY</span>
              <strong>{humanity}</strong>
            </div>
          </div>
        </div>
      )}

      {/* CHOICE */}

      {choiceOpen && (
        <div className="modal-layer choice-layer">
          <div className="choice-modal">

            <span className="eyebrow">
              DECISION POINT
            </span>

            <h2>{currentMission.title}</h2>

            <p>{message}</p>

            {mission === 1 && (
              <>
                <button
                  className="choice green-choice"
                  onClick={() => makeChoice("help")}
                >
                  <strong>A</strong>
                  <span>
                    GAMITIN ANG SARILING YAMAN
                    <small>
                      para sa evacuation
                    </small>
                  </span>
                </button>

                <button
                  className="choice gold-choice"
                  onClick={() => makeChoice("control")}
                >
                  <strong>B</strong>
                  <span>
                    KONTROLIN ANG RELIEF
                    <small>
                      distribution ng suplay
                    </small>
                  </span>
                </button>

                <button
                  className="choice red-choice"
                  onClick={() => makeChoice("leave")}
                >
                  <strong>C</strong>
                  <span>
                    HUWAG MAKIALAM
                    <small>
                      iwan ang distrito
                    </small>
                  </span>
                </button>
              </>
            )}

            {mission > 1 && (
              <button
                className="choice green-choice"
                onClick={() => makeChoice("continue")}
              >
                <strong>✓</strong>
                <span>
                  IPAGPATULOY
                  <small>
                    Tapusin ang objective
                  </small>
                </span>
              </button>
            )}

            <button
              className="cancel-choice"
              onClick={() => setChoiceOpen(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* MISSION COMPLETE */}

      {missionComplete && (
        <div className="mission-complete">
          <div className="complete-card">
            <span className="eyebrow">
              OBJECTIVE COMPLETE
            </span>

            <h2>{currentMission.title}</h2>

            <div className="complete-stats">
              <span>
                POWER <b>{power}</b>
              </span>

              <span>
                TRUST <b>{trust}</b>
              </span>

              <span>
                HUMANITY <b>{humanity}</b>
              </span>
            </div>

            <button
              className="gold-button"
              onClick={nextMission}
            >
              {mission >= 4
                ? "VIEW ENDING"
                : "NEXT MISSION →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TOP NAV
   ========================================================= */

function TopNav({
  screen,
  goBack,
  setScreen,
  soundOn,
  setSoundOn,
}) {
  return (
    <header className="top-nav">

      <div className="brand">
        <div className="brand-mark">△</div>

        <div>
          <strong>TATSULOK</strong>
          <small>LIVE DISTRICT</small>
        </div>
      </div>

      <nav>
        <button
          className={screen === "world" ? "active" : ""}
          onClick={() => setScreen("world")}
        >
          WORLD
        </button>

        <button
          className={screen === "lobby" ? "active" : ""}
          onClick={() => setScreen("lobby")}
        >
          LOBBY
        </button>

        <button
          className={
            screen === "characters" ? "active" : ""
          }
          onClick={() => setScreen("characters")}
        >
          CHARACTERS
        </button>

        <button
          className={screen === "dossier" ? "active" : ""}
          onClick={() => setScreen("dossier")}
        >
          DOSSIER
        </button>

        <button
          className={screen === "factions" ? "active" : ""}
          onClick={() => setScreen("factions")}
        >
          FACTIONS
        </button>

        <button
          className={screen === "mission" ? "active" : ""}
          onClick={() => setScreen("mission")}
        >
          MISSION
        </button>
      </nav>

      <div className="nav-actions">

        {screen !== "world" && (
          <button
            className="back-button"
            onClick={goBack}
          >
            ← BACK
          </button>
        )}

        <button
          className="sound-button"
          onClick={() => setSoundOn((value) => !value)}
        >
          {soundOn ? "♪" : "×"}
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   STAT
   ========================================================= */

function Stat({ label, value, type }) {
  return (
    <div className="stat">

      <div className="stat-label">
        <span>{label}</span>
        <b>{value}%</b>
      </div>

      <div className="stat-track">
        <div
          className={`stat-fill ${type}`}
          style={{ width: `${value}%` }}
        />
      </div>

    </div>
  );
}

export default App;
