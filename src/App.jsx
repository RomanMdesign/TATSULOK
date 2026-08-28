import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

/* =========================================================
   TATSULOK — PLAYABLE 3D DISTRICT
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

const objectives = [
  {
    id: "evacuation",
    title: "EVACUATION CENTER",
    subtitle: "Tulungan ang mga mamamayan",
    x: 48,
    y: 45,
    color: "green",
  },
  {
    id: "supplies",
    title: "RELIEF SUPPLIES",
    subtitle: "Hanapin ang nawawalang suplay",
    x: 72,
    y: 29,
    color: "gold",
  },
  {
    id: "office",
    title: "DISTRICT OFFICE",
    subtitle: "Siyasatin ang dokumento",
    x: 26,
    y: 23,
    color: "red",
  },
  {
    id: "bridge",
    title: "OLD BRIDGE",
    subtitle: "Buksan ang evacuation route",
    x: 79,
    y: 70,
    color: "blue",
  },
];

const buildings = [
  { x: 8, y: 10, w: 14, h: 20, label: "CITY HALL" },
  { x: 28, y: 6, w: 13, h: 17, label: "TOWER" },
  { x: 52, y: 7, w: 14, h: 22, label: "HOTEL" },
  { x: 73, y: 7, w: 18, h: 18, label: "MALL" },
  { x: 5, y: 42, w: 17, h: 22, label: "WAREHOUSE" },
  { x: 28, y: 34, w: 14, h: 18, label: "SCHOOL" },
  { x: 56, y: 37, w: 16, h: 19, label: "MARKET" },
  { x: 79, y: 43, w: 13, h: 23, label: "DEPOT" },
];

function App() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("tatsulok-player") || ""
  );

  const [selectedId, setSelectedId] = useState(
    () => localStorage.getItem("tatsulok-character") || "peyudo"
  );

  const [activeFaction, setActiveFaction] = useState("LAHAT");
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState("world");
  const [soundOn, setSoundOn] = useState(true);

  /* GAME STATE */
  const [mission, setMission] = useState(1);
  const [health, setHealth] = useState(100);
  const [power, setPower] = useState(68);
  const [trust, setTrust] = useState(42);
  const [humanity, setHumanity] = useState(55);
  const [timer, setTimer] = useState(180);

  const [objective, setObjective] = useState(objectives[0]);

  const [player, setPlayer] = useState({
    x: 50,
    y: 78,
  });

  const [message, setMessage] = useState(
    "Pumasok sa distrito. Hanapin ang evacuation center."
  );

  const [gamePaused, setGamePaused] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [showDossier, setShowDossier] = useState(false);

  const selectedCharacter = useMemo(
    () => characters.find((c) => c.id === selectedId),
    [selectedId]
  );

  const filteredCharacters =
    activeFaction === "LAHAT"
      ? characters
      : characters.filter((c) => c.faction === activeFaction);

  useEffect(() => {
    localStorage.setItem("tatsulok-player", playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem("tatsulok-character", selectedId);
  }, [selectedId]);

  /* =========================================================
     TIMER
     ========================================================= */

  useEffect(() => {
    if (screen !== "mission" || gamePaused || missionComplete) return;

    const interval = setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          setHealth((h) => Math.max(0, h - 10));
          setMessage(
            "Naubos ang oras. Lumala ang sitwasyon sa distrito. +10 segundo penalty."
          );
          return 180;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, gamePaused, missionComplete]);

  /* =========================================================
     KEYBOARD
     ========================================================= */

  useEffect(() => {
    function handleKeyDown(event) {
      if (screen !== "mission" || gamePaused || choiceOpen) return;

      const key = event.key.toLowerCase();

      if (["arrowup", "w"].includes(key)) {
        event.preventDefault();
        movePlayer(0, -4);
      }

      if (["arrowdown", "s"].includes(key)) {
        event.preventDefault();
        movePlayer(0, 4);
      }

      if (["arrowleft", "a"].includes(key)) {
        event.preventDefault();
        movePlayer(-4, 0);
      }

      if (["arrowright", "d"].includes(key)) {
        event.preventDefault();
        movePlayer(4, 0);
      }

      if (key === "e" || key === " ") {
        event.preventDefault();
        interactObjective();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  /* =========================================================
     CHARACTER
     ========================================================= */

  function selectCharacter(id) {
    setSelectedId(id);
    setReady(false);
  }

  function toggleReady() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setReady((current) => !current);
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function enterLobby() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setScreen("lobby");
  }

  function openWorld() {
    setScreen("world");
    setShowDossier(false);
  }

  /* =========================================================
     START MISSION
     ========================================================= */

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
    setTimer(180);
    setHealth(100);
    setPower(68);
    setTrust(42);
    setHumanity(55);
    setMissionComplete(false);
    setChoiceOpen(false);
    setGamePaused(false);
    setCompletedObjectives([]);
    setMessage("MISSION 01 — Hanapin ang evacuation center.");
    setObjective(objectives[0]);
    setPlayer({ x: 50, y: 78 });
  }

  /* =========================================================
     MOVEMENT
     ========================================================= */

  function movePlayer(dx, dy) {
    if (gamePaused || choiceOpen || missionComplete) return;

    setPlayer((current) => ({
      x: Math.max(5, Math.min(95, current.x + dx)),
      y: Math.max(8, Math.min(90, current.y + dy)),
    }));
  }

  /* =========================================================
     OBJECTIVE DISTANCE
     ========================================================= */

  function distanceToObjective() {
    const dx = player.x - objective.x;
    const dy = player.y - objective.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /* =========================================================
     OBJECTIVE INTERACTION
     ========================================================= */

  function interactObjective() {
    if (gamePaused || missionComplete) return;

    const distance = distanceToObjective();

    if (distance > 10) {
      setMessage(
        `Masyado ka pang malayo. Lumapit sa ${objective.title}.`
      );
      return;
    }

    if (completedObjectives.includes(objective.id)) {
      setMessage("Nakumpleto na ang objective na ito.");
      return;
    }

    setChoiceOpen(true);
    setGamePaused(true);
  }

  /* =========================================================
     OBJECTIVE CHOICE
     ========================================================= */

  function chooseAction(action) {
    if (objective.id === "evacuation") {
      if (action === "help") {
        setHumanity((v) => Math.min(100, v + 15));
        setTrust((v) => Math.min(100, v + 10));
        setPower((v) => Math.max(0, v - 5));
        setMessage(
          "Tinulungan mo ang mga mamamayan. Tumaas ang Humanity at Trust."
        );
      } else {
        setPower((v) => Math.min(100, v + 10));
        setHumanity((v) => Math.max(0, v - 12));
        setMessage(
          "Pinili mong unahin ang misyon. Tumaas ang Power ngunit bumaba ang Humanity."
        );
      }
    }

    if (objective.id === "supplies") {
      if (action === "secure") {
        setTrust((v) => Math.min(100, v + 12));
        setPower((v) => Math.min(100, v + 6));
        setMessage(
          "Na-secure ang relief supplies. Nakuha mo ang tiwala ng distrito."
        );
      } else {
        setPower((v) => Math.min(100, v + 15));
        setHumanity((v) => Math.max(0, v - 8));
        setMessage(
          "Ginamit mo ang suplay para sa sariling advantage."
        );
      }
    }

    if (objective.id === "office") {
      if (action === "inspect") {
        setTrust((v) => Math.min(100, v + 15));
        setMessage(
          "Nakita mo ang dokumentong nag-uugnay sa isang makapangyarihang grupo."
        );
      } else {
        setPower((v) => Math.min(100, v + 12));
        setTrust((v) => Math.max(0, v - 5));
        setMessage("Kinuha mo ang dokumento nang walang pahintulot.");
      }
    }

    if (objective.id === "bridge") {
      if (action === "open") {
        setHumanity((v) => Math.min(100, v + 12));
        setTrust((v) => Math.min(100, v + 8));
        setMessage("Nabuksan ang evacuation route. Ligtas na ang tulay.");
      } else {
        setPower((v) => Math.min(100, v + 10));
        setHealth((v) => Math.max(0, v - 5));
        setMessage("Pinilit mong buksan ang ruta. Nasira ang bahagi ng tulay.");
      }
    }

    setCompletedObjectives((current) => [...current, objective.id]);

    setChoiceOpen(false);
    setGamePaused(false);

    const currentIndex = objectives.findIndex(
      (item) => item.id === objective.id
    );

    const nextObjective = objectives[currentIndex + 1];

    if (nextObjective) {
      setTimeout(() => {
        setObjective(nextObjective);
        setMessage(
          `Bagong objective: ${nextObjective.title} — ${nextObjective.subtitle}`
        );
      }, 350);
    } else {
      setTimeout(() => {
        setMissionComplete(true);
        setGamePaused(true);
        setMessage("MISSION COMPLETE — Naayos mo ang distrito.");
      }, 450);
    }
  }

  /* =========================================================
     NEXT MISSION
     ========================================================= */

  function nextMission() {
    const next = mission + 1;

    setMission(next);
    setTimer(180);
    setMissionComplete(false);
    setChoiceOpen(false);
    setGamePaused(false);
    setCompletedObjectives([]);

    setObjective(objectives[0]);

    setPlayer({
      x: 50,
      y: 78,
    });

    setMessage(
      `MISSION ${String(next).padStart(
        2,
        "0"
      )} — Bagong operasyon sa distrito.`
    );

    setScreen("mission");
  }

  function exitMission() {
    setGamePaused(false);
    setChoiceOpen(false);
    setMissionComplete(false);
    setScreen("lobby");
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetGame() {
    setHealth(100);
    setPower(68);
    setTrust(42);
    setHumanity(55);
    setTimer(180);
    setMission(1);
    setObjective(objectives[0]);
    setPlayer({ x: 50, y: 78 });
    setCompletedObjectives([]);
    setMissionComplete(false);
    setChoiceOpen(false);
    setGamePaused(false);
    setMessage("Pumasok sa distrito. Hanapin ang evacuation center.");
  }

  /* =========================================================
     FORMATTING
     ========================================================= */

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  /* =========================================================
     LANDING / WORLD SCREEN
     ========================================================= */

  if (screen === "world") {
    return (
      <main className="app-shell">
        <section className="world-landing">
          <div className="landing-noise" />

          <header className="topbar">
            <div className="brand">
              <span className="brand-mark">△</span>
              <div>
                <strong>TATSULOK</strong>
                <small>POWER • MYSTERY • CHOICE</small>
              </div>
            </div>

            <button
              className="sound-button"
              onClick={() => setSoundOn((v) => !v)}
            >
              {soundOn ? "SOUND ON" : "SOUND OFF"}
            </button>
          </header>

          <div className="landing-content">
            <div className="landing-copy">
              <div className="eyebrow">INTERACTIVE DISTRICT</div>

              <h1>
                ENTER THE
                <span> TATSULOK</span>
              </h1>

              <p>
                Isang playable district kung saan bawat galaw,
                desisyon at pakikipag-ugnayan ay may epekto sa
                kapangyarihan, tiwala at humanidad.
              </p>

              <div className="name-box">
                <label>PLAYER NAME</label>

                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ilagay ang iyong pangalan"
                  maxLength={24}
                />
              </div>

              <button className="primary-button" onClick={enterLobby}>
                ENTER DISTRICT
              </button>
            </div>

            <div className="landing-triangle">
              <div className="triangle-glow" />
              <div className="triangle-symbol">△</div>

              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />

              <div className="floating-card card-one">
                <span>01</span>
                POWER
              </div>

              <div className="floating-card card-two">
                <span>02</span>
                MYSTERY
              </div>

              <div className="floating-card card-three">
                <span>03</span>
                CHOICE
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     LOBBY
     ========================================================= */

  if (screen === "lobby") {
    return (
      <main className="app-shell lobby-shell">
        <header className="topbar lobby-topbar">
          <div className="brand">
            <span className="brand-mark">△</span>

            <div>
              <strong>TATSULOK</strong>
              <small>CHARACTER LOBBY</small>
            </div>
          </div>

          <div className="top-actions">
            <span className="player-label">
              PLAYER: {playerName || "UNKNOWN"}
            </span>

            <button
              className="sound-button"
              onClick={() => setSoundOn((v) => !v)}
            >
              {soundOn ? "SOUND ON" : "SOUND OFF"}
            </button>
          </div>
        </header>

        <section className="lobby-layout">
          <aside className="character-sidebar">
            <div className="section-label">FACTIONS</div>

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

            <div className="character-list">
              {filteredCharacters.map((character) => (
                <button
                  key={character.id}
                  className={`character-row ${
                    selectedId === character.id ? "selected" : ""
                  }`}
                  onClick={() => selectCharacter(character.id)}
                >
                  <img
                    src={character.image}
                    alt={character.name}
                  />

                  <div>
                    <strong>{character.name}</strong>
                    <span>{character.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="character-stage">
            <div className="stage-grid" />

            <div className="stage-heading">
              <span>OPERATIVE SELECTION</span>
              <small>11 AVAILABLE CHARACTERS</small>
            </div>

            <div className="character-showcase">
              <div className="portrait-frame">
                <div className="portrait-glow" />

                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                />

                <div className="portrait-corner tl" />
                <div className="portrait-corner tr" />
                <div className="portrait-corner bl" />
                <div className="portrait-corner br" />
              </div>

              <div className="character-information">
                <div
                  className={`faction-badge ${selectedCharacter.className}`}
                >
                  {selectedCharacter.faction}
                </div>

                <h1>{selectedCharacter.name}</h1>

                <p className="tagline">
                  {selectedCharacter.tagline}
                </p>

                <div className="stat-grid">
                  <div>
                    <small>ROLE</small>
                    <strong>{selectedCharacter.role}</strong>
                  </div>

                  <div>
                    <small>POWER</small>
                    <strong>{selectedCharacter.power}</strong>
                  </div>

                  <div>
                    <small>SYMBOL</small>
                    <strong>{selectedCharacter.symbol}</strong>
                  </div>
                </div>

                <p className="description">
                  {selectedCharacter.description}
                </p>

                <div className="lobby-controls">
                  <button
                    className={`ready-button ${
                      ready ? "is-ready" : ""
                    }`}
                    onClick={toggleReady}
                  >
                    {ready ? "✓ READY" : "READY"}
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => setShowDossier(true)}
                  >
                    VIEW DOSSIER
                  </button>

                  <button
                    className="mission-button"
                    onClick={startMission}
                  >
                    START MISSION →
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>

        {showDossier && (
          <div
            className="modal-backdrop"
            onClick={() => setShowDossier(false)}
          >
            <div
              className="dossier-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setShowDossier(false)}
              >
                ×
              </button>

              <div className="dossier-image">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                />
              </div>

              <div className="dossier-content">
                <span className="section-label">
                  CLASSIFIED DOSSIER
                </span>

                <h2>{selectedCharacter.name}</h2>

                <p>{selectedCharacter.description}</p>

                <div className="dossier-line">
                  <span>FACTION</span>
                  <strong>{selectedCharacter.faction}</strong>
                </div>

                <div className="dossier-line">
                  <span>ROLE</span>
                  <strong>{selectedCharacter.role}</strong>
                </div>

                <div className="dossier-line">
                  <span>POWER</span>
                  <strong>{selectedCharacter.power}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  /* =========================================================
     MISSION SCREEN
     ========================================================= */

  return (
    <main className="mission-shell">
      <header className="mission-header">
        <div className="mission-brand">
          <span>△</span>
          <div>
            <strong>TATSULOK</strong>
            <small>LIVE DISTRICT</small>
          </div>
        </div>

        <div className="mission-title">
          <span>MISSION {String(mission).padStart(2, "0")}</span>
          <strong>{objective.title}</strong>
        </div>

        <div className="mission-header-actions">
          <button onClick={() => setGamePaused((v) => !v)}>
            {gamePaused ? "RESUME" : "PAUSE"}
          </button>

          <button onClick={exitMission}>EXIT</button>
        </div>
      </header>

      <section className="mission-interface">
        <aside className="mission-panel left-panel">
          <div className="player-card">
            <div className="mini-portrait">
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
              />
            </div>

            <div>
              <span>OPERATIVE</span>
              <strong>{selectedCharacter.name}</strong>
              <small>{playerName}</small>
            </div>
          </div>

          <div className="mission-objective">
            <span className="section-label">CURRENT OBJECTIVE</span>

            <h2>{objective.title}</h2>

            <p>{objective.subtitle}</p>

            <div className="objective-progress">
              {objectives.map((item) => (
                <span
                  key={item.id}
                  className={
                    completedObjectives.includes(item.id)
                      ? "done"
                      : item.id === objective.id
                      ? "current"
                      : ""
                  }
                />
              ))}
            </div>
          </div>

          <div className="message-console">
            <span>MISSION FEED</span>
            <p>{message}</p>
          </div>
        </aside>

        <section className="district-wrapper">
          <div className="district">
            <div className="skyline skyline-back">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="road road-horizontal road-one" />
            <div className="road road-horizontal road-two" />
            <div className="road road-horizontal road-three" />

            <div className="road road-vertical road-four" />
            <div className="road road-vertical road-five" />
            <div className="road road-vertical road-six" />

            <div className="district-grid" />

            {buildings.map((building) => (
              <div
                key={building.label}
                className="district-building"
                style={{
                  left: `${building.x}%`,
                  top: `${building.y}%`,
                  width: `${building.w}%`,
                  height: `${building.h}%`,
                }}
              >
                <div className="building-roof" />

                <div className="building-windows">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <i key={i} />
                  ))}
                </div>

                <span>{building.label}</span>
              </div>
            ))}

            <div className="park">
              <i />
              <i />
              <i />
              <i />
              <span>PARK</span>
            </div>

            {objectives.map((item) => {
              const isCurrent = objective.id === item.id;
              const isDone = completedObjectives.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`objective-marker ${item.color} ${
                    isCurrent ? "current" : ""
                  } ${isDone ? "completed" : ""}`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                >
                  <div className="marker-ring" />
                  <div className="marker-dot">
                    {isDone ? "✓" : "!"}
                  </div>

                  <div className="marker-label">
                    {item.title}
                  </div>
                </div>
              );
            })}

            <div
              className="player-avatar"
              style={{
                left: `${player.x}%`,
                top: `${player.y}%`,
              }}
            >
              <div className="player-shadow" />
              <div className="player-ring" />

              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
              />

              <span>{selectedCharacter.name}</span>
            </div>

            <div className="district-compass">
              <span>N</span>
              <i>+</i>
            </div>

            <div className="map-scale">DISTRICT SECTOR 01</div>

            {(gamePaused || choiceOpen || missionComplete) && (
              <div className="map-overlay">
                {missionComplete ? (
                  <div className="mission-complete-card">
                    <span className="complete-mark">✓</span>
                    <small>OPERATION SUCCESSFUL</small>
                    <h2>MISSION COMPLETE</h2>
                    <p>
                      Nakumpleto mo ang lahat ng objectives sa
                      district.
                    </p>

                    <div className="result-stats">
                      <div>
                        <span>HEALTH</span>
                        <strong>{health}%</strong>
                      </div>

                      <div>
                        <span>POWER</span>
                        <strong>{power}%</strong>
                      </div>

                      <div>
                        <span>TRUST</span>
                        <strong>{trust}%</strong>
                      </div>

                      <div>
                        <span>HUMANITY</span>
                        <strong>{humanity}%</strong>
                      </div>
                    </div>

                    <div className="complete-actions">
                      <button
                        className="secondary-button"
                        onClick={exitMission}
                      >
                        LOBBY
                      </button>

                      <button
                        className="mission-button"
                        onClick={nextMission}
                      >
                        NEXT MISSION →
                      </button>
                    </div>
                  </div>
                ) : choiceOpen ? (
                  <div className="choice-card">
                    <span className="section-label">
                      INTERACTION AVAILABLE
                    </span>

                    <h2>{objective.title}</h2>

                    <p>{objective.subtitle}</p>

                    {objective.id === "evacuation" && (
                      <div className="choice-buttons">
                        <button onClick={() => chooseAction("help")}>
                          HELP THE PEOPLE
                        </button>

                        <button
                          onClick={() => chooseAction("ignore")}
                        >
                          IGNORE AND ADVANCE
                        </button>
                      </div>
                    )}

                    {objective.id === "supplies" && (
                      <div className="choice-buttons">
                        <button
                          onClick={() => chooseAction("secure")}
                        >
                          SECURE THE SUPPLIES
                        </button>

                        <button
                          onClick={() => chooseAction("take")}
                        >
                          TAKE CONTROL
                        </button>
                      </div>
                    )}

                    {objective.id === "office" && (
                      <div className="choice-buttons">
                        <button
                          onClick={() => chooseAction("inspect")}
                        >
                          INSPECT DOCUMENTS
                        </button>

                        <button
                          onClick={() => chooseAction("steal")}
                        >
                          TAKE THE FILE
                        </button>
                      </div>
                    )}

                    {objective.id === "bridge" && (
                      <div className="choice-buttons">
                        <button onClick={() => chooseAction("open")}>
                          OPEN EVACUATION ROUTE
                        </button>

                        <button
                          onClick={() => chooseAction("force")}
                        >
                          FORCE THE GATE
                        </button>
                      </div>
                    )}

                    <button
                      className="cancel-choice"
                      onClick={() => {
                        setChoiceOpen(false);
                        setGamePaused(false);
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="pause-card">
                    <span>MISSION PAUSED</span>
                    <h2>DISTRICT FROZEN</h2>

                    <button
                      className="mission-button"
                      onClick={() => setGamePaused(false)}
                    >
                      RESUME MISSION
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <aside className="mission-panel right-panel">
          <div className="timer-card">
            <span>MISSION TIMER</span>
            <strong className={timer <= 30 ? "danger" : ""}>
              {formatTime(timer)}
            </strong>
          </div>

          <div className="stat-panel">
            <StatBar label="HEALTH" value={health} />
            <StatBar label="POWER" value={power} />
            <StatBar label="TRUST" value={trust} />
            <StatBar label="HUMANITY" value={humanity} />
          </div>

          <div className="controls-card">
            <span className="section-label">CONTROLS</span>

            <div className="keyboard">
              <div>
                <button onClick={() => movePlayer(0, -4)}>▲</button>
              </div>

              <div>
                <button onClick={() => movePlayer(-4, 0)}>◀</button>
                <button onClick={() => movePlayer(0, 4)}>▼</button>
                <button onClick={() => movePlayer(4, 0)}>▶</button>
              </div>
            </div>

            <button
              className="interact-button"
              onClick={interactObjective}
            >
              <strong>E</strong>
              INTERACT
            </button>

            <small>
              Desktop: WASD / Arrow Keys
              <br />
              Mobile/iPad: gamitin ang controls
            </small>
          </div>

          <div className="mission-stats">
            <div>
              <span>OBJECTIVES</span>
              <strong>
                {completedObjectives.length}/{objectives.length}
              </strong>
            </div>

            <div>
              <span>POSITION</span>
              <strong>
                {Math.round(player.x)} / {Math.round(player.y)}
              </strong>
            </div>
          </div>

          <button className="reset-button" onClick={resetGame}>
            RESET MISSION
          </button>
        </aside>
      </section>
    </main>
  );
}

/* =========================================================
   STAT BAR
   ========================================================= */

function StatBar({ label, value }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-heading">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="stat-track">
        <div
          className="stat-fill"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export default App;
