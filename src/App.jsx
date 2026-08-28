import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

const characters = [
  {
    id: "peyudo",
    name: "PEYUDO",
    faction: "PANGINOON",
    image: "/assets/peyudo.jpg",
    power: 68,
    trust: 42,
    humanity: 55,
  },
  {
    id: "misteryo",
    name: "MISTERYO",
    faction: "PANGINOON",
    image: "/assets/misteryo.jpg",
    power: 62,
    trust: 45,
    humanity: 48,
  },
  {
    id: "bangag",
    name: "BANGAG",
    faction: "PANGINOON",
    image: "/assets/bangag.jpg",
    power: 76,
    trust: 32,
    humanity: 40,
  },
  {
    id: "pula",
    name: "PULA",
    faction: "PANGINOON",
    image: "/assets/pula.jpg",
    power: 72,
    trust: 38,
    humanity: 42,
  },
  {
    id: "tanikala",
    name: "TANIKALA",
    faction: "PANGINOON",
    image: "/assets/tanikala.jpg",
    power: 70,
    trust: 35,
    humanity: 44,
  },
  {
    id: "presyo",
    name: "PRESYO",
    faction: "MALAKAS",
    image: "/assets/presyo.jpg",
    power: 58,
    trust: 51,
    humanity: 50,
  },
  {
    id: "pintuan",
    name: "PINTUAN",
    faction: "MALAKAS",
    image: "/assets/pintuan.jpg",
    power: 55,
    trust: 60,
    humanity: 52,
  },
  {
    id: "ling",
    name: "LING",
    faction: "MABUTI",
    image: "/assets/ling.jpg",
    power: 42,
    trust: 72,
    humanity: 80,
  },
  {
    id: "batid",
    name: "BATID",
    faction: "MABUTI",
    image: "/assets/batid.jpg",
    power: 45,
    trust: 76,
    humanity: 74,
  },
  {
    id: "tisa",
    name: "TISA",
    faction: "MABUTI",
    image: "/assets/tisa.jpg",
    power: 48,
    trust: 70,
    humanity: 78,
  },
  {
    id: "subalit",
    name: "SUBALIT",
    faction: "MABUTI",
    image: "/assets/subalit.jpg",
    power: 60,
    trust: 68,
    humanity: 81,
  },
];

const locations = [
  {
    id: "start",
    title: "PLAYER START",
    subtitle: "District entrance",
    type: "start",
    x: 75,
    y: 72,
    icon: "△",
  },
  {
    id: "plaza",
    title: "PLAZA",
    subtitle: "Main Objective",
    type: "objective",
    x: 51,
    y: 47,
    icon: "◆",
  },
  {
    id: "evacuation",
    title: "EVACUATION POINT",
    subtitle: "Fast Travel",
    type: "travel",
    x: 25,
    y: 39,
    icon: "✚",
  },
  {
    id: "market",
    title: "BLACK MARKET",
    subtitle: "NPC / Contact",
    type: "npc",
    x: 23,
    y: 69,
    icon: "♟",
  },
  {
    id: "supply",
    title: "SUPPLY DEPOT",
    subtitle: "Supply / Loot",
    type: "loot",
    x: 57,
    y: 72,
    icon: "▣",
  },
  {
    id: "government",
    title: "GOVERNMENT COMPLEX",
    subtitle: "Side Mission",
    type: "side",
    x: 37,
    y: 20,
    icon: "◇",
  },
  {
    id: "oldtown",
    title: "OLD TOWN",
    subtitle: "Side Mission",
    type: "side",
    x: 76,
    y: 38,
    icon: "◆",
  },
  {
    id: "power",
    title: "POWER PLANT",
    subtitle: "Locked Area",
    type: "locked",
    x: 70,
    y: 17,
    icon: "🔒",
  },
];

const missions = [
  {
    id: 1,
    title: "ANG BAHA",
    description:
      "Isang matinding baha ang lumubog sa district. Limitado ang oras, pagkain at pondo.",
    objective: "Hanapin ang nawawalang supply sa Plaza.",
  },
  {
    id: 2,
    title: "ANG LINDOL",
    description:
      "Isang malakas na lindol ang yumanig sa lumang distrito.",
    objective: "Hanapin ang mga nakaligtas sa Old Town.",
  },
  {
    id: 3,
    title: "KURAPSYON",
    description:
      "May nawawalang pondo at may taong kumokontrol sa distribution system.",
    objective: "Hanapin ang source ng nawawalang pondo.",
  },
  {
    id: 4,
    title: "ANG TANIKALA",
    description:
      "Sa huling yugto, kailangan mong pumili kung babaguhin ang sistema.",
    objective: "Harapin ang pinagmulan ng kapangyarihan.",
  },
];

function App() {
  const [screen, setScreen] = useState("lobby");
  const [playerName, setPlayerName] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("peyudo");

  const [missionIndex, setMissionIndex] = useState(0);
  const [objectiveDone, setObjectiveDone] = useState(false);

  const [power, setPower] = useState(68);
  const [trust, setTrust] = useState(42);
  const [humanity, setHumanity] = useState(55);

  const [position, setPosition] = useState({
    x: 50,
    y: 58,
  });

  const [activeLocation, setActiveLocation] = useState(null);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [choiceMade, setChoiceMade] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [message, setMessage] = useState(
    "Pumasok sa Plaza para simulan ang mission."
  );

  const character = useMemo(
    () => characters.find((c) => c.id === selectedCharacter),
    [selectedCharacter]
  );

  const mission = missions[missionIndex];

  useEffect(() => {
    if (!playerName) return;

    localStorage.setItem(
      "tatsulok-save",
      JSON.stringify({
        playerName,
        selectedCharacter,
        missionIndex,
        power,
        trust,
        humanity,
      })
    );
  }, [
    playerName,
    selectedCharacter,
    missionIndex,
    power,
    trust,
    humanity,
  ]);

  useEffect(() => {
    const save = localStorage.getItem("tatsulok-save");

    if (!save) return;

    try {
      const data = JSON.parse(save);

      if (data.playerName) setPlayerName(data.playerName);
      if (data.selectedCharacter)
        setSelectedCharacter(data.selectedCharacter);
      if (typeof data.missionIndex === "number")
        setMissionIndex(data.missionIndex);
      if (typeof data.power === "number") setPower(data.power);
      if (typeof data.trust === "number") setTrust(data.trust);
      if (typeof data.humanity === "number")
        setHumanity(data.humanity);
    } catch {
      // ignore corrupted save
    }
  }, []);

  function enterGame() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setScreen("district");
  }

  function selectCharacter(id) {
    setSelectedCharacter(id);

    const selected = characters.find((c) => c.id === id);

    if (selected) {
      setPower(selected.power);
      setTrust(selected.trust);
      setHumanity(selected.humanity);
    }
  }

  function movePlayer(dx, dy) {
    setPosition((current) => ({
      x: Math.max(8, Math.min(92, current.x + dx)),
      y: Math.max(15, Math.min(86, current.y + dy)),
    }));
  }

  function handleLocation(location) {
    setActiveLocation(location);

    if (location.id === "plaza") {
      setChoiceOpen(true);
      setMessage("May desisyon kang kailangang gawin.");
      return;
    }

    if (location.id === "supply") {
      setPower((v) => Math.min(100, v + 5));
      setMessage("SUPPLY NAKUHA: +5 POWER");
      return;
    }

    if (location.id === "evacuation") {
      setPosition({ x: 25, y: 39 });
      setMessage("FAST TRAVEL: EVACUATION POINT");
      return;
    }

    if (location.id === "power") {
      setMessage("LOCKED AREA — Hindi pa unlocked.");
      return;
    }

    if (location.type === "side") {
      setTrust((v) => Math.min(100, v + 5));
      setMessage("SIDE MISSION DISCOVERED: +5 TRUST");
      return;
    }

    if (location.type === "npc") {
      setHumanity((v) => Math.min(100, v + 3));
      setMessage("NPC CONTACT: May bagong impormasyon.");
      return;
    }
  }

  function chooseDecision(type) {
    setChoiceMade(type);
    setChoiceOpen(false);
    setObjectiveDone(true);

    if (type === "help") {
      setHumanity((v) => Math.min(100, v + 15));
      setPower((v) => Math.max(0, v - 5));
      setTrust((v) => Math.min(100, v + 5));
      setMessage("DESISYON: Tinulungan mo ang mga tao.");
    }

    if (type === "control") {
      setPower((v) => Math.min(100, v + 15));
      setTrust((v) => Math.max(0, v - 10));
      setMessage("DESISYON: Kinontrol mo ang relief distribution.");
    }

    if (type === "ignore") {
      setPower((v) => Math.min(100, v + 10));
      setHumanity((v) => Math.max(0, v - 15));
      setMessage("DESISYON: Pinili mong huwag makialam.");
    }
  }

  function nextMission() {
    if (missionIndex >= missions.length - 1) {
      setScreen("ending");
      return;
    }

    setMissionIndex((v) => v + 1);
    setObjectiveDone(false);
    setChoiceMade(null);
    setActiveLocation(null);
    setPosition({ x: 75, y: 72 });

    setMessage(
      `MISSION ${missionIndex + 2}: ${missions[missionIndex + 1].title}`
    );
  }

  if (screen === "lobby") {
    return (
      <div className="game">
        <header className="topbar">
          <div className="logo">
            <span>△</span>
            TATSULOK
          </div>

          <div className="top-nav">
            <button className="active">WORLD</button>
            <button>LOBBY</button>
            <button>CHARACTERS</button>
            <button>DOSSIER</button>
            <button>FACTIONS</button>
            <button onClick={enterGame}>MISSION</button>
          </div>

          <div className="top-right">
            <span className="saved">☁ SAVED LOCALLY</span>

            <button onClick={() => setSoundOn(!soundOn)}>
              {soundOn ? "🔊" : "🔇"}
            </button>
          </div>
        </header>

        <section className="lobby-hero">
          <div className="lobby-copy">
            <div className="eyebrow">TATSULOK / DISTRICT SYSTEM</div>

            <h1>
              ANG MUNDO NG
              <br />
              <span>TATSULOK</span>
            </h1>

            <p>
              Isang playable world tungkol sa kapangyarihan,
              misteryo, kurapsyon, kaunlaran at paninindigan.
            </p>

            <div className="name-input">
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ilagay ang pangalan..."
                maxLength={24}
              />

              <button onClick={enterGame}>ENTER DISTRICT →</button>
            </div>
          </div>
        </section>

        <section className="character-select">
          <div className="eyebrow">CHARACTER SELECTION</div>

          <h2>
            PILIIN ANG <span>TAUHAN</span>
          </h2>

          <div className="character-strip">
            {characters.map((item) => (
              <button
                key={item.id}
                className={
                  selectedCharacter === item.id
                    ? "char active"
                    : "char"
                }
                onClick={() => selectCharacter(item.id)}
              >
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.faction}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="selected-character">
            <img src={character.image} alt={character.name} />

            <div>
              <small>SELECTED CHARACTER</small>
              <h3>{character.name}</h3>
              <p>{character.faction}</p>

              <div className="mini-stats">
                <span>POWER {character.power}</span>
                <span>TRUST {character.trust}</span>
                <span>HUMANITY {character.humanity}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "ending") {
    return (
      <div className="ending-screen">
        <div className="ending-panel">
          <div className="eyebrow">TATSULOK / ENDING</div>

          <h1>
            ANG MABUTING
            <br />
            <span>PANININDIGAN</span>
          </h1>

          <p>
            Natapos mo ang unang district.
            Ang magiging ending ay depende sa mga
            desisyong ginawa mo.
          </p>

          <div className="ending-stats">
            <span>POWER {power}</span>
            <span>TRUST {trust}</span>
            <span>HUMANITY {humanity}</span>
          </div>

          <button
            className="gold-button"
            onClick={() => setScreen("district")}
          >
            BALIK SA DISTRICT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game district-game">
      <header className="topbar">
        <div className="logo">
          <span>△</span>
          TATSULOK
        </div>

        <div className="mission-title">
          MISSION {String(mission.id).padStart(2, "0")} —{" "}
          {mission.title}
        </div>

        <div className="top-right">
          <span className="saved">● SAVED LOCALLY</span>

          <button onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? "🔊" : "🔇"}
          </button>

          <button onClick={() => setScreen("lobby")}>×</button>
        </div>
      </header>

      <main className="district-layout">
        <aside className="left-hud">
          <div className="player-card">
            <img src={character.image} alt={character.name} />

            <div className="player-info">
              <strong>{character.name}</strong>
              <small>{character.faction}</small>

              <div className="bar">
                <span style={{ width: `${power}%` }} />
              </div>

              <label>POWER {power}</label>

              <div className="bar blue">
                <span style={{ width: `${trust}%` }} />
              </div>

              <label>TRUST {trust}</label>

              <div className="bar green">
                <span style={{ width: `${humanity}%` }} />
              </div>

              <label>HUMANITY {humanity}</label>
            </div>
          </div>

          <div className="objective-card">
            <div className="eyebrow">OBJECTIVE</div>

            <strong>{mission.objective}</strong>

            <div className="objective-progress">
              <span className={objectiveDone ? "done" : ""}>
                {objectiveDone ? "✓ COMPLETE" : "0 / 1"}
              </span>
            </div>
          </div>

          <div className="mini-map">
            <div className="map-grid" />

            {locations.map((location) => (
              <div
                key={location.id}
                className={`map-dot ${location.type}`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                }}
              />
            )}

            <div
              className="map-player"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            />

            <span className="district-number">
              DISTRICT 01
            </span>
          </div>
        </aside>

        <section className="district-world">
          <div className="world-sky">
            <div className="moon" />
            <div className="cloud cloud-a" />
            <div className="cloud cloud-b" />
          </div>

          <div className="city">
            <div className="far-buildings">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  className="building far"
                  key={i}
                  style={{
                    height: `${90 + ((i * 37) % 150)}px`,
                  }}
                />
              ))}
            </div>

            <div className="district-island">
              <div className="road road-main" />
              <div className="road road-cross" />

              <div className="water water-a" />
              <div className="water water-b" />

              <div className="building b1">
                <span>GOVERNMENT</span>
              </div>

              <div className="building b2">
                <span>OLD TOWN</span>
              </div>

              <div className="building b3">
                <span>MARKET</span>
              </div>

              <div className="building b4">
                <span>SUPPLY</span>
              </div>

              <div className="building b5">
                <span>POWER</span>
              </div>

              <div className="plaza">
                <div className="plaza-ring">
                  ◆
                </div>
              </div>

              <div className="bridge bridge-a" />
              <div className="bridge bridge-b" />
            </div>

            {locations.map((location) => (
              <button
                key={location.id}
                className={`location-marker ${location.type}`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                }}
                onClick={() => handleLocation(location)}
              >
                <span className="marker-icon">
                  {location.icon}
                </span>

                <span className="marker-label">
                  <strong>{location.title}</strong>
                  <small>{location.subtitle}</small>
                </span>
              </button>
            ))}

            <div
              className="player-avatar"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            >
              <div className="player-shadow" />
              <div className="player-body">●</div>
              <span>{character.name}</span>
            </div>
          </div>

          <div className="interaction-message">
            <span>●</span>
            {message}
          </div>

          <div className="mobile-controls">
            <div className="joystick">
              <button onClick={() => movePlayer(0, -4)}>▲</button>

              <button onClick={() => movePlayer(-4, 0)}>
                ◀
              </button>

              <div className="joystick-center" />

              <button onClick={() => movePlayer(4, 0)}>
                ▶
              </button>

              <button onClick={() => movePlayer(0, 4)}>▼</button>
            </div>

            <div className="action-buttons">
              <button onClick={() => setMessage("RUN")}>
                🏃
              </button>

              <button
                className="action-main"
                onClick={() => {
                  if (activeLocation) {
                    handleLocation(activeLocation);
                  } else {
                    setMessage(
                      "Lumapit sa isang marker para makipag-interact."
                    );
                  }
                }}
              >
                ◎
              </button>

              <button onClick={() => setMessage("INSPECT")}>
                🔍
              </button>
            </div>
          </div>
        </section>

        <aside className="right-hud">
          <div className="decision-title">
            PILIIN ANG
            <br />
            <span>IYONG DESISYON</span>
          </div>

          <button
            className="decision green"
            onClick={() => chooseDecision("help")}
          >
            <b>A</b>
            <div>
              <strong>GAMITIN ANG SARILING YAMAN</strong>
              <small>
                + HUMANITY 15 &nbsp; − POWER 5
              </small>
            </div>
          </button>

          <button
            className="decision gold"
            onClick={() => chooseDecision("control")}
          >
            <b>B</b>
            <div>
              <strong>KONTROLIN ANG RELIEF DISTRIBUTION</strong>
              <small>
                + POWER 15 &nbsp; − TRUST 10
              </small>
            </div>
          </button>

          <button
            className="decision red"
            onClick={() => chooseDecision("ignore")}
          >
            <b>C</b>
            <div>
              <strong>HUWAG MAKIALAM</strong>
              <small>
                + POWER 10 &nbsp; − HUMANITY 15
              </small>
            </div>
          </button>

          <div className="choice-status">
            <div className="eyebrow">KASAYSAYAN NG DESISYON</div>

            {!choiceMade ? (
              <span>WALANG DESISYON PA</span>
            ) : (
              <span className="choice-complete">
                DESISYON NAKA-RECORD ✓
              </span>
            )}
          </div>

          {objectiveDone && (
            <button
              className="next-mission"
              onClick={nextMission}
            >
              {missionIndex === missions.length - 1
                ? "ENDING →"
                : "NEXT MISSION →"}
            </button>
          )}
        </aside>
      </main>

      {choiceOpen && (
        <div className="decision-modal">
          <div className="modal-panel">
            <div className="eyebrow">MISSION DECISION</div>

            <h2>
              MAY NAKITA KANG
              <br />
              TAONG NAGTATAGO NG KAHON.
            </h2>

            <p>
              Ano ang gagawin mo?
            </p>

            <div className="modal-actions">
              <button
                className="green-action"
                onClick={() => chooseDecision("help")}
              >
                TULUNGAN
              </button>

              <button
                className="gold-action"
                onClick={() => chooseDecision("control")}
              >
                KONTROLIN
              </button>

              <button
                className="red-action"
                onClick={() => chooseDecision("ignore")}
              >
                DAHILAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

/*
===========================================================
TATSULOK
PLAYABLE MISSION SYSTEM
MISSION 01 — BAHA
===========================================================
*/

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

/*
===========================================================
MISSION DATA
===========================================================
*/

const missionScenes = [
  {
    id: 0,
    chapter: "01",
    location: "BARANGAY SANTA ANA",
    title: "ANG UNANG AGOS",
    text:
      "Gabi na nang dumating ang baha. Mabilis na tumataas ang tubig sa mga bahay. May dalawang daan palabas ng barangay, ngunit isa lamang ang maaaring buksan agad.",
    objective: "Piliin kung paano mo sisimulan ang operasyon.",
    choices: [
      {
        id: "rescue",
        label: "UNAHIN ANG MGA NAKAKULONG SA BAHAY",
        description: "Magpadala ng rescue team bago iligtas ang mga ari-arian.",
        effects: { energy: -8, integrity: 12, influence: 2 },
        clue: "May mga pamilyang naiwan sa lumang evacuation zone.",
        feedback:
          "May mga nailigtas agad. Ngunit kapalit nito, nabawasan ang iyong oras at resources.",
      },
      {
        id: "warehouse",
        label: "BANTAYAN MUNA ANG BODEGA",
        description:
          "Protektahan ang mga supply na maaaring gamitin sa susunod na araw.",
        effects: { energy: -4, integrity: -6, influence: 9 },
        clue: "May malaking shipment na hindi kasama sa opisyal na relief list.",
        feedback:
          "Napanatili ang ilang supply. Ngunit may mga taong naiwan sa kabilang bahagi ng barangay.",
      },
      {
        id: "investigate",
        label: "IMBESTIGAHAN ANG PINAGMULAN NG BAHA",
        description:
          "Huwag munang kumilos nang walang impormasyon.",
        effects: { energy: -5, integrity: 8, influence: 5 },
        clue: "May nakitang bagong kanal na tila sadyang binuksan.",
        feedback:
          "May natuklasang kakaibang bakas. Hindi normal ang direksiyon ng tubig.",
      },
    ],
  },

  {
    id: 1,
    chapter: "02",
    location: "LUMANG PUMPING STATION",
    title: "ANG NAKASARANG PINTUAN",
    text:
      "Nakakita ka ng pumping station na dapat sana ay gumagana. Naka-lock ito mula sa loob. Sa tabi ng pinto ay may bagong pulang marka.",
    objective: "Ano ang gagawin mo?",
    choices: [
      {
        id: "break",
        label: "BASAGIN ANG LOCK",
        description: "Walang oras para maghintay.",
        effects: { energy: -12, integrity: -2, influence: 8 },
        clue: "May maintenance log na binago ilang oras bago ang baha.",
        feedback:
          "Nabuksan ang station. Gumagana pa ang backup pump, ngunit may ebidensiyang nawala.",
      },
      {
        id: "talk",
        label: "HANAPIN ANG TAONG MAY SUSI",
        description: "Subukang alamin kung sino ang huling nagkaroon ng access.",
        effects: { energy: -6, integrity: 9, influence: 4 },
        clue: "Ang huling pirma sa logbook ay hindi tugma sa pangalan ng operator.",
        feedback:
          "May nahanap kang operator. Sinabi niyang pinagbawalan siyang buksan ang station.",
      },
      {
        id: "redmark",
        label: "SURIIN ANG PULANG MARKA",
        description: "May posibilidad na ito ay simbolo, babala, o code.",
        effects: { energy: -4, integrity: 10, influence: 6 },
        clue: "Ang pulang marka ay kapareho ng simbolong nakita sa relief warehouse.",
        feedback:
          "May koneksiyon ang pumping station at relief warehouse.",
      },
    ],
  },

  {
    id: 2,
    chapter: "03",
    location: "RELIEF WAREHOUSE",
    title: "ANG KULANG NA SUPPLY",
    text:
      "Sa warehouse, napansin mong hindi tugma ang bilang ng mga relief boxes sa opisyal na record. May daan papunta sa likod na hindi kasama sa blueprint.",
    objective: "Sundan ang bakas.",
    choices: [
      {
        id: "open",
        label: "BASAHIN ANG LEDGER",
        description: "Hanapin kung saan napunta ang nawawalang supply.",
        effects: { energy: -5, integrity: 11, influence: 5 },
        clue: "May regular na delivery papunta sa isang pribadong compound.",
        feedback:
          "May nakita kang pattern ng deliveries na hindi lumalabas sa public records.",
      },
      {
        id: "follow",
        label: "SUNDAN ANG LIHIM NA DAAN",
        description: "Diretsong alamin kung saan ito humahantong.",
        effects: { energy: -10, integrity: 7, influence: 10 },
        clue: "Ang lihim na daan ay papunta sa isang lumang administrative building.",
        feedback:
          "May natuklasang lihim na passage. Mukhang matagal nang ginagamit.",
      },
      {
        id: "report",
        label: "I-REPORT AGAD SA AUTHORITIES",
        description: "Ibigay ang impormasyon bago ka gumawa ng sariling hakbang.",
        effects: { energy: -2, integrity: 7, influence: 12 },
        clue: "May isang opisyal na tila sobrang interesado sa iyong natuklasan.",
        feedback:
          "Naipasa ang impormasyon. Ngunit maaaring may nakarinig na maling tao.",
      },
    ],
  },

  {
    id: 3,
    chapter: "04",
    location: "EVACUATION CENTER",
    title: "ANG TATLONG BERSYON",
    text:
      "Tatlong saksi ang nagbibigay ng magkakaibang kuwento tungkol sa baha. Isa ang nagsasabing natural itong sakuna. Isa ang nagsasabing aksidente. Ang pangatlo ay tahimik.",
    objective: "Kanino ka maniniwala?",
    choices: [
      {
        id: "elder",
        label: "PANIWALAAN ANG MATANDANG SAKSI",
        description: "Matagal na niyang kilala ang lugar.",
        effects: { energy: -3, integrity: 8, influence: 4 },
        clue: "May lumang mapa siyang ipinakita na may dating flood channel.",
        feedback:
          "May mahalagang historical map kang nakuha.",
      },
      {
        id: "engineer",
        label: "SURIIN ANG TECHNICAL REPORT",
        description: "Facts muna bago emosyon.",
        effects: { energy: -6, integrity: 10, influence: 7 },
        clue: "May pagbabago sa water-flow data na hindi maipaliwanag ng ulan lamang.",
        feedback:
          "Lumakas ang hinalang may ibang nagbago sa daloy ng tubig.",
      },
      {
        id: "silent",
        label: "KAUSAPIN ANG TAHIMIK NA SAKSI",
        description: "Maaaring siya ang may pinakamahalagang alam.",
        effects: { energy: -7, integrity: 13, influence: 3 },
        clue: "May nakita siyang truck na may dalang kagamitan bago nagsimula ang baha.",
        feedback:
          "May bagong lead: isang truck na walang government markings.",
      },
    ],
  },

  {
    id: 4,
    chapter: "05",
    location: "COMMAND CENTER",
    title: "ANG DESISYON",
    text:
      "May sapat ka nang ebidensiya upang makita ang pattern. Ngunit kailangan mong pumili: ilabas agad ang impormasyon, gamitin ito para makipagkasundo, o ipagpatuloy ang lihim na imbestigasyon.",
    objective: "Ito ang unang malaking desisyon ng misyon.",
    choices: [
      {
        id: "public",
        label: "ILABAS ANG EBIDENSIYA",
        description:
          "Ipakita sa publiko ang lahat ng iyong natuklasan.",
        effects: { energy: -10, integrity: 18, influence: -4 },
        clue: "May ilang dokumentong hindi pa napapatunayan.",
        feedback:
          "Kumalat ang impormasyon. Maraming tao ang naniwala, ngunit may ilang dokumentong kinuwestiyon.",
      },
      {
        id: "deal",
        label: "MAKIPAG-NEGOSYO SA SISTEMA",
        description:
          "Gamitin ang ebidensiya upang makakuha ng agarang access sa resources.",
        effects: { energy: -5, integrity: -12, influence: 18 },
        clue: "May kapalit ang bawat access.",
        feedback:
          "Nakuha mo ang kailangan mong resources. Ngunit may utang ka nang pabor.",
      },
      {
        id: "secret",
        label: "ITAGO MUNA ANG EBIDENSIYA",
        description:
          "Kumpletuhin muna ang puzzle bago gumawa ng malaking hakbang.",
        effects: { energy: -7, integrity: 12, influence: 9 },
        clue: "May isa pang pangalan sa likod ng lahat ng operasyon.",
        feedback:
          "Hindi pa tapos ang puzzle. Ngunit mas malinaw na ngayon kung sino ang nasa likod.",
      },
    ],
  },
];

/*
===========================================================
HELPERS
===========================================================
*/

const initialMissionState = {
  scene: 0,
  energy: 100,
  integrity: 50,
  influence: 20,
  clues: [],
  choices: [],
  completed: false,
  result: null,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getEnding(state) {
  const { integrity, influence, clues, energy } = state;

  if (clues.length >= 5 && integrity >= 70) {
    return {
      type: "TRUE",
      title: "ENDING A — ANG KATOTOHANAN",
      subtitle: "NABUKSAN ANG LIHIM",
      text:
        "Nabuo mo ang buong pattern. Hindi lamang baha ang iyong hinarap—may sistemang matagal nang kumikilos sa likod nito. Nailabas ang katotohanan nang may sapat na ebidensiya.",
    };
  }

  if (influence >= 55) {
    return {
      type: "POWER",
      title: "ENDING B — ANG KAPANGYARIHAN",
      subtitle: "NAKALUSOT KA SA SISTEMA",
      text:
        "Nakuha mo ang access at resources na kailangan upang manalo. Ngunit may kapalit ang bawat kasunduan. Hindi pa tapos ang laro.",
    };
  }

  if (energy <= 20) {
    return {
      type: "SURVIVAL",
      title: "ENDING C — NAKALIGTAS",
      subtitle: "NGUNIT HINDI NATAPOS ANG MISTERYO",
      text:
        "Nailigtas mo ang mga kaya mong iligtas, ngunit naubos ang resources. Maraming tanong ang nananatiling walang sagot.",
    };
  }

  return {
    type: "PARTIAL",
    title: "ENDING D — HINDI PA TAPOS",
    subtitle: "MAY MGA PUZZLE PANG NATITIRA",
    text:
      "May ilang piraso ng puzzle kang nakuha, ngunit hindi pa sapat upang makita ang buong larawan. Ang misyon ay maaaring ulitin upang makahanap ng ibang ruta.",
  };
}

/*
===========================================================
APP
===========================================================
*/

function App() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("tatsulok_player") || ""
  );

  const [selectedId, setSelectedId] = useState(
    () => localStorage.getItem("tatsulok_character") || "peyudo"
  );

  const [activeFaction, setActiveFaction] = useState("LAHAT");
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState("lobby");
  const [soundOn, setSoundOn] = useState(true);

  const [mission, setMission] = useState(() => {
    const saved = localStorage.getItem("tatsulok_mission");
    return saved ? JSON.parse(saved) : initialMissionState;
  });

  const [lastChoice, setLastChoice] = useState(null);

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedId),
    [selectedId]
  );

  const filteredCharacters =
    activeFaction === "LAHAT"
      ? characters
      : characters.filter(
          (character) => character.faction === activeFaction
        );

  useEffect(() => {
    localStorage.setItem("tatsulok_player", playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem("tatsulok_character", selectedId);
  }, [selectedId]);

  useEffect(() => {
    localStorage.setItem("tatsulok_mission", JSON.stringify(mission));
  }, [mission]);

  function selectCharacter(id) {
    setSelectedId(id);
    setReady(false);
    setScreen("lobby");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleReady() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan para makapasok sa lobby.");
      return;
    }

    setReady((current) => !current);
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

    if (mission.completed) {
      setScreen("mission");
      return;
    }

    setScreen("mission");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function enterLobby() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setScreen("lobby");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetMission() {
    setMission(initialMissionState);
    setLastChoice(null);
    setScreen("mission");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseMissionOption(choice) {
    if (mission.completed) return;

    const effects = choice.effects || {};

    const nextScene = mission.scene + 1;
    const isLast = nextScene >= missionScenes.length;

    const newClues = choice.clue
      ? [...mission.clues, choice.clue]
      : mission.clues;

    const nextState = {
      ...mission,
      scene: isLast ? missionScenes.length - 1 : nextScene,
      energy: clamp(mission.energy + (effects.energy || 0), 0, 100),
      integrity: clamp(
        mission.integrity + (effects.integrity || 0),
        0,
        100
      ),
      influence: clamp(
        mission.influence + (effects.influence || 0),
        0,
        100
      ),
      clues: newClues,
      choices: [
        ...mission.choices,
        {
          scene: mission.scene,
          choice: choice.id,
          label: choice.label,
        },
      ],
      completed: isLast,
      result: null,
    };

    if (isLast) {
      nextState.result = getEnding(nextState);
    }

    setLastChoice(choice);
    setMission(nextState);
  }

  function goNextAfterFeedback() {
    setLastChoice(null);
  }

  /*
  =========================================================
  MISSION SCREEN
  =========================================================
  */

  if (screen === "mission") {
    const currentScene = missionScenes[mission.scene];

    return (
      <div className="app mission-screen">
        <header className="topbar">
          <div className="brand">
            <div className="brand-symbol">△</div>
            <span>TATSULOK</span>
          </div>

          <nav className="nav">
            <button onClick={() => setScreen("lobby")}>LOBBY</button>
            <button onClick={() => setScreen("characters")}>
              CHARACTERS
            </button>
            <button
              onClick={() =>
                alert(
                  `CLUES DISCOVERED: ${mission.clues.length}/${missionScenes.length}`
                )
              }
            >
              DOSSIER
            </button>
            <button
              onClick={() =>
                alert("PANGINOON • MALAKAS • MABUTI")
              }
            >
              FACTIONS
            </button>
            <button className="active">MISSION</button>
          </nav>

          <div className="top-actions">
            <span className="save-status">● SAVED LOCALLY</span>

            <button onClick={() => setSoundOn(!soundOn)}>
              {soundOn ? "🔊" : "🔇"}
            </button>
          </div>
        </header>

        <main className="mission-game">
          <section className="mission-header">
            <div>
              <div className="eyebrow">TATSULOK OPERATIONS</div>

              <div className="mission-title-row">
                <div>
                  <div className="mission-code">MISSION 01</div>
                  <h1>BAHA</h1>
                </div>

                <div className="mission-player">
                  <small>PLAYER</small>
                  <strong>{playerName || "UNKNOWN"}</strong>
                  <span>{selectedCharacter.name}</span>
                </div>
              </div>
            </div>

            <div className="mission-progress-wrap">
              <div className="progress-label">
                <span>MISSION PROGRESS</span>
                <strong>
                  {mission.completed
                    ? "100%"
                    : `${Math.round(
                        (mission.scene / missionScenes.length) * 100
                      )}%`}
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  style={{
                    width: `${
                      mission.completed
                        ? 100
                        : Math.round(
                            (mission.scene / missionScenes.length) * 100
                          )
                    }%`,
                  }}
                />
              </div>
            </div>
          </section>

          {!mission.completed ? (
            <>
              <section className="mission-status-grid">
                <div className="status-box">
                  <span>ENERGY</span>
                  <strong>{mission.energy}</strong>
                  <div className="status-track">
                    <i
                      style={{ width: `${mission.energy}%` }}
                    />
                  </div>
                </div>

                <div className="status-box">
                  <span>INTEGRITY</span>
                  <strong>{mission.integrity}</strong>
                  <div className="status-track">
                    <i
                      style={{ width: `${mission.integrity}%` }}
                    />
                  </div>
                </div>

                <div className="status-box">
                  <span>INFLUENCE</span>
                  <strong>{mission.influence}</strong>
                  <div className="status-track">
                    <i
                      style={{
                        width: `${Math.min(
                          mission.influence,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="status-box clue-status">
                  <span>CLUES</span>
                  <strong>
                    {mission.clues.length}/{missionScenes.length}
                  </strong>
                  <div className="clue-dots">
                    {missionScenes.map((scene) => (
                      <i
                        key={scene.id}
                        className={
                          mission.clues[scene.id]
                            ? "found"
                            : ""
                        }
                      />
                    ))}
                  </div>
                </div>
              </section>

              <section className="mission-stage">
                <div className="stage-location">
                  <span>
                    {currentScene.chapter}
                  </span>

                  <div>
                    <small>LOCATION</small>
                    <strong>{currentScene.location}</strong>
                  </div>
                </div>

                <div className="stage-content">
                  <div className="stage-copy">
                    <div className="eyebrow">
                      SCENE {currentScene.chapter} /{" "}
                      {String(missionScenes.length).padStart(2, "0")}
                    </div>

                    <h2>{currentScene.title}</h2>

                    <p className="scene-text">
                      {currentScene.text}
                    </p>

                    <div className="objective">
                      <span>OBJECTIVE</span>
                      <strong>{currentScene.objective}</strong>
                    </div>
                  </div>

                  <div className="stage-character">
                    <div className="character-frame">
                      <img
                        src={selectedCharacter.image}
                        alt={selectedCharacter.name}
                      />

                      <div className="character-frame-label">
                        <span>OPERATIVE</span>
                        <strong>{selectedCharacter.name}</strong>
                      </div>
                    </div>

                    <div className="operative-note">
                      {selectedCharacter.tagline}
                    </div>
                  </div>
                </div>
              </section>

              {!lastChoice ? (
                <section className="choice-section">
                  <div className="choice-heading">
                    <div>
                      <div className="eyebrow">
                        DECISION POINT
                      </div>
                      <h3>PUMILI NG HAKBANG</h3>
                    </div>

                    <span>
                      Ang bawat desisyon ay may kapalit.
                    </span>
                  </div>

                  <div className="choice-grid">
                    {currentScene.choices.map(
                      (choice, index) => (
                        <button
                          className="choice-card"
                          key={choice.id}
                          onClick={() =>
                            chooseMissionOption(choice)
                          }
                        >
                          <div className="choice-number">
                            0{index + 1}
                          </div>

                          <div className="choice-body">
                            <strong>{choice.label}</strong>

                            <p>{choice.description}</p>

                            <div className="choice-effects">
                              {choice.effects.energy !== 0 && (
                                <span
                                  className={
                                    choice.effects.energy > 0
                                      ? "positive"
                                      : "negative"
                                  }
                                >
                                  ENERGY{" "}
                                  {choice.effects.energy > 0
                                    ? "+"
                                    : ""}
                                  {choice.effects.energy}
                                </span>
                              )}

                              {choice.effects.integrity !== 0 && (
                                <span
                                  className={
                                    choice.effects.integrity > 0
                                      ? "positive"
                                      : "negative"
                                  }
                                >
                                  INTEGRITY{" "}
                                  {choice.effects.integrity > 0
                                    ? "+"
                                    : ""}
                                  {choice.effects.integrity}
                                </span>
                              )}

                              {choice.effects.influence !== 0 && (
                                <span
                                  className={
                                    choice.effects.influence > 0
                                      ? "positive"
                                      : "negative"
                                  }
                                >
                                  INFLUENCE{" "}
                                  {choice.effects.influence > 0
                                    ? "+"
                                    : ""}
                                  {choice.effects.influence}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="choice-arrow">
                            →
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </section>
              ) : (
                <section className="feedback-section">
                  <div className="feedback-mark">✓</div>

                  <div>
                    <div className="eyebrow">
                      DECISION RECORDED
                    </div>

                    <h3>{lastChoice.label}</h3>

                    <p>{lastChoice.feedback}</p>

                    <div className="clue-found">
                      <span>CLUE DISCOVERED</span>
                      <strong>{lastChoice.clue}</strong>
                    </div>

                    <button
                      className="gold-button"
                      onClick={goNextAfterFeedback}
                    >
                      CONTINUE →
                    </button>
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="mission-result">
              <div className="result-symbol">
                {mission.result?.type === "TRUE"
                  ? "△"
                  : "◈"}
              </div>

              <div className="eyebrow">
                MISSION COMPLETE
              </div>

              <h2>{mission.result?.title}</h2>

              <h3>{mission.result?.subtitle}</h3>

              <p>{mission.result?.text}</p>

              <div className="result-stats">
                <div>
                  <small>ENERGY</small>
                  <strong>{mission.energy}</strong>
                </div>

                <div>
                  <small>INTEGRITY</small>
                  <strong>{mission.integrity}</strong>
                </div>

                <div>
                  <small>INFLUENCE</small>
                  <strong>{mission.influence}</strong>
                </div>

                <div>
                  <small>CLUES</small>
                  <strong>
                    {mission.clues.length}/
                    {missionScenes.length}
                  </strong>
                </div>
              </div>

              <div className="result-actions">
                <button
                  className="secondary-button"
                  onClick={() => setScreen("lobby")}
                >
                  RETURN TO LOBBY
                </button>

                <button
                  className="danger-button"
                  onClick={resetMission}
                >
                  RETRY MISSION
                </button>
              </div>
            </section>
          )}

          <section className="mission-log">
            <div>
              <small>OPERATIVE</small>
              <strong>{selectedCharacter.name}</strong>
            </div>

            <div>
              <small>FACTION</small>
              <strong>{selectedCharacter.faction}</strong>
            </div>

            <div>
              <small>DECISIONS</small>
              <strong>{mission.choices.length}</strong>
            </div>

            <div>
              <small>STATUS</small>
              <strong>
                {mission.completed
                  ? "COMPLETE"
                  : "ACTIVE"}
              </strong>
            </div>

            <button
              className="danger-button"
              onClick={() => setScreen("lobby")}
            >
              EXIT MISSION
            </button>
          </section>
        </main>
      </div>
    );
  }

  const showCharacters = screen === "characters";

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-symbol">△</div>
          <span>TATSULOK</span>
        </div>

        <nav className="nav">
          <button
            className={screen === "lobby" ? "active" : ""}
            onClick={() => setScreen("lobby")}
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
            className={showCharacters ? "active" : ""}
            onClick={() => setScreen("characters")}
          >
            CHARACTERS
          </button>

          <button
            onClick={() =>
              alert(
                `DOSSIER\n\nCLUES DISCOVERED: ${mission.clues.length}/${missionScenes.length}`
              )
            }
          >
            DOSSIER
          </button>

          <button
            onClick={() =>
              alert(
                "TATLONG PANIG\n\nPANGINOON\nMALAKAS\nMABUTI"
              )
            }
          >
            FACTIONS
          </button>

          <button onClick={startMission}>
            MISSION
          </button>
        </nav>

        <div className="top-actions">
          <span className="save-status">
            ● SAVED LOCALLY
          </span>

          <button
            onClick={() => setSoundOn(!soundOn)}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>

          <button
            onClick={() => alert("TATSULOK SETTINGS")}
          >
            ⚙
          </button>
        </div>
      </header>

      <main>
        {!showCharacters ? (
          <>
            <section className="hero">
              <div className="hero-overlay">
                <div className="eyebrow">
                  01 / 10 — WORLD PREMISE
                </div>

                <h1>
                  ANG MUNDO NG
                  <br />
                  <span>TATSULOK</span>
                </h1>

                <p>
                  Isang puzzle game tungkol sa
                  kapangyarihan, misteryo, kurapsyon,
                  kaunlaran, at demokrasya.
                </p>

                <div className="world-points">
                  <div>
                    △ Tatlong panig ng lipunan:
                    Panginoon, Malakas, at Mabuti
                  </div>

                  <div>
                    ◈ Bawat karakter ay may sariling
                    kapangyarihan at paninindigan
                  </div>

                  <div>
                    ◉ Ang layunin: unawain ang misteryo
                    sa likod ng kapangyarihan
                  </div>

                  <div>
                    ⚠ Mga temang haharapin: baha,
                    lindol, kurapsyon, at pang-aalipin
                  </div>
                </div>

                <button
                  className="gold-button"
                  onClick={enterLobby}
                >
                  ENTER LOBBY →
                </button>
              </div>
            </section>

            <section className="lobby-section">
              <div className="section-copy">
                <div className="eyebrow">
                  02 / 10 — THE ENTRY POINT
                </div>

                <h2>
                  LOBBY / <span>MENU</span>
                </h2>

                <ul>
                  <li>
                    Maglagay ng pangalan para makapasok
                  </li>
                  <li>
                    Maaaring i-save ang laro at progreso
                  </li>
                  <li>
                    Pumili ng karakter
                  </li>
                  <li>
                    Pindutin ang READY para simulan
                  </li>
                </ul>

                <div className="name-box">
                  <input
                    value={playerName}
                    onChange={(event) =>
                      setPlayerName(event.target.value)
                    }
                    placeholder="Ilagay ang pangalan..."
                    maxLength={24}
                  />

                  <button onClick={enterLobby}>
                    ENTER
                  </button>
                </div>

                <div className="lobby-status">
                  <span>START</span>

                  <span
                    className={
                      ready ? "selected" : ""
                    }
                  >
                    {ready ? "READY ✓" : "READY"}
                  </span>

                  <small>
                    PROGRESS SAVED LOCALLY
                  </small>
                </div>
              </div>

              <div className="faction-wall">
                <div className="wall-symbol gold">
                  △
                </div>

                <div className="wall-symbol red">
                  △
                </div>

                <div className="wall-symbol blue">
                  △
                </div>
              </div>
            </section>
          </>
        ) : null}

        <section className="character-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                03 / 10 — PUZZLE GAME FLOW
              </div>

              <h2>
                PILIIN ANG{" "}
                <span>IYONG KARAKTER</span>
              </h2>
            </div>

            <div className="selection-help">
              Libre ang lahat ng karakter.
              <br />
              Pindutin ang karakter para tingnan
              ang dossier.
            </div>
          </div>

          <div className="faction-tabs">
            {Object.keys(factions).map(
              (faction) => (
                <button
                  key={faction}
                  className={
                    activeFaction === faction
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveFaction(faction)
                  }
                >
                  {faction}
                </button>
              )
            )}
          </div>

          <div className="character-grid">
            {filteredCharacters.map(
              (character) => (
                <button
                  key={character.id}
                  className={`character-card ${
                    selectedId === character.id
                      ? "selected"
                      : ""
                  } ${character.className}`}
                  onClick={() =>
                    selectCharacter(character.id)
                  }
                >
                  <div className="character-image">
                    <img
                      src={character.image}
                      alt={character.name}
                      onError={(event) => {
                        event.currentTarget.style.opacity =
                          "0";
                      }}
                    />

                    <div className="image-number">
                      {String(
                        characters.indexOf(
                          character
                        ) + 1
                      ).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="character-info">
                    <strong>
                      {character.name}
                    </strong>

                    <small>
                      {character.faction}
                    </small>

                    <p>
                      {character.tagline}
                    </p>
                  </div>
                </button>
              )
            )}
          </div>
        </section>

        <section className="dossier-section">
          <div className="dossier-image">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
            />
          </div>

          <div className="dossier-content">
            <div className="eyebrow">
              SELECTED CHARACTER
            </div>

            <h2>{selectedCharacter.name}</h2>

            <div
              className={`faction-label ${selectedCharacter.className}`}
            >
              {selectedCharacter.faction}
            </div>

            <p className="tagline">
              {selectedCharacter.tagline}
            </p>

            <p className="description">
              {selectedCharacter.description}
            </p>

            <div className="stats">
              <div>
                <span>PAPEL</span>
                <strong>
                  {selectedCharacter.role}
                </strong>
              </div>

              <div>
                <span>LAKAS</span>
                <strong>
                  {selectedCharacter.power}
                </strong>
              </div>

              <div>
                <span>SIMBOLO</span>
                <strong>
                  {selectedCharacter.symbol}
                </strong>
              </div>
            </div>

            <div className="ready-panel">
              <div>
                <small>PLAYER</small>

                <strong>
                  {playerName ||
                    "WALA PANG PANGALAN"}
                </strong>
              </div>

              <button
                className={
                  ready
                    ? "ready active"
                    : "ready"
                }
                onClick={toggleReady}
              >
                {ready ? "✓ READY" : "READY"}
              </button>
            </div>
          </div>
        </section>

        <section className="final-section">
          <div>
            <div className="eyebrow">
              09 / 10 — FINAL LOBBY STATE
            </div>

            <h2>
              START. READY.
              <br />
              <span>HARAPIN ANG MISYON.</span>
            </h2>

            <p>
              Pumasok sa lobby.
              <br />
              Pumili ng karakter.
              <br />
              Mag-Ready.
              <br />
              Harapin ang unang misyon.
            </p>
          </div>

          <div className="final-character">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
            />

            <div>
              <small>
                SELECTED CHARACTER
              </small>

              <strong>
                {selectedCharacter.name}
              </strong>

              <span>
                {ready
                  ? "● READY"
                  : "○ NOT READY"}
              </span>
            </div>
          </div>

          <div className="final-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setScreen("characters")
              }
            >
              CHANGE CHARACTER
            </button>

            <button
              className="danger-button"
              onClick={startMission}
            >
              START MISSION
            </button>
          </div>
        </section>
      </main>

      <footer>
        <span>TATSULOK</span>

        <span>
          ANG LABAN AY HINDI LANG SA LAKAS —
          LABAN DIN ITO NG PANININDIGAN.
        </span>
      </footer>
    </div>
  );
}

export default App;
