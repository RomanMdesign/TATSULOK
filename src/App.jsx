import React, { useMemo, useState } from "react";
import "./styles.css";

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

function App() {
  const [playerName, setPlayerName] = useState("");
  const [selectedId, setSelectedId] = useState("peyudo");
  const [activeFaction, setActiveFaction] = useState("LAHAT");
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState("lobby");
  const [soundOn, setSoundOn] = useState(true);

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

  function selectCharacter(id) {
    setSelectedId(id);
    setReady(false);
    setScreen("lobby");
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

    setScreen("mission");
  }

  function enterLobby() {
    if (!playerName.trim()) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    setScreen("lobby");
  }

  if (screen === "mission") {
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
            <button>DOSSIER</button>
            <button>FACTIONS</button>
            <button className="active">MISSION</button>
          </nav>

          <div className="top-actions">
            <span className="save-status">● SAVED LOCALLY</span>
            <button onClick={() => setSoundOn(!soundOn)}>
              {soundOn ? "🔊" : "🔇"}
            </button>
          </div>
        </header>

        <main className="mission-content">
          <div className="mission-badge">MISSION 01</div>

          <h1>
            ANG TATSULOK AY
            <br />
            <span>HINDI LANG LABAN NG LAKAS.</span>
          </h1>

          <p className="mission-lead">
            Labas sa ordinaryong mundo. Pumasok sa isang larong puno ng
            kapangyarihan, misteryo, kurapsyon at paninindigan.
          </p>

          <div className="mission-grid">
            <div className="mission-card">
              <span>01</span>
              <strong>BAHA</strong>
              <p>
                Harapin ang unang sakuna at alamin kung sino ang tunay na
                nakikinabang.
              </p>
            </div>

            <div className="mission-card">
              <span>02</span>
              <strong>LINDOL</strong>
              <p>
                Kapag gumalaw ang lupa, gumagalaw din ang mga puwersang nasa
                ilalim nito.
              </p>
            </div>

            <div className="mission-card">
              <span>03</span>
              <strong>KURAPSYON</strong>
              <p>
                Hindi lahat ng kalaban ay nakikita. Minsan, nasa loob mismo
                ng sistema.
              </p>
            </div>

            <div className="mission-card">
              <span>04</span>
              <strong>PANG-AALIPIN</strong>
              <p>
                Tuklasin kung sino ang nakagapos at sino ang may hawak ng
                tanikala.
              </p>
            </div>
          </div>

          <div className="mission-footer">
            <div>
              <small>PLAYER</small>
              <strong>{playerName || "UNKNOWN"}</strong>
            </div>

            <div>
              <small>CHARACTER</small>
              <strong>{selectedCharacter.name}</strong>
            </div>

            <button className="danger-button" onClick={() => setScreen("lobby")}>
              EXIT MISSION
            </button>
          </div>
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

          <button onClick={() => alert("Dossier unlocked sa mission.")}>
            DOSSIER
          </button>

          <button onClick={() => alert("Tatlong panig: Panginoon, Malakas, Mabuti.")}>
            FACTIONS
          </button>

          <button onClick={startMission}>MISSION</button>
        </nav>

        <div className="top-actions">
          <span className="save-status">☁ SAVED LOCALLY</span>

          <button onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? "🔊" : "🔇"}
          </button>

          <button onClick={() => alert("Settings")}>⚙</button>
        </div>
      </header>

      <main>
        {!showCharacters ? (
          <>
            <section className="hero">
              <div className="hero-overlay">
                <div className="eyebrow">01 / 10 — WORLD PREMISE</div>

                <h1>
                  ANG MUNDO NG
                  <br />
                  <span>TATSULOK</span>
                </h1>

                <p>
                  Isang puzzle game tungkol sa kapangyarihan, misteryo,
                  kurapsyon, kaunlaran, at demokrasya.
                </p>

                <div className="world-points">
                  <div>△ Tatlong panig ng lipunan: Panginoon, Malakas, at Mabuti</div>
                  <div>◈ Bawat karakter ay may sariling kapangyarihan at paninindigan</div>
                  <div>◉ Ang layunin: unawain ang misteryo sa likod ng kapangyarihan</div>
                  <div>⚠ Mga temang haharapin: baha, lindol, kurapsyon, at pang-aalipin</div>
                </div>

                <button className="gold-button" onClick={enterLobby}>
                  ENTER LOBBY →
                </button>
              </div>
            </section>

            <section className="lobby-section">
              <div className="section-copy">
                <div className="eyebrow">02 / 10 — THE ENTRY POINT</div>

                <h2>
                  LOBBY / <span>MENU</span>
                </h2>

                <ul>
                  <li>Maglagay ng pangalan para makapasok</li>
                  <li>Maaaring i-save ang laro at progreso</li>
                  <li>Pindutin ang Start para simulan ang misyon</li>
                  <li>Pindutin ang Ready kapag handa na ang karakter</li>
                </ul>

                <div className="name-box">
                  <input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    placeholder="Ilagay ang pangalan..."
                    maxLength={24}
                  />

                  <button onClick={enterLobby}>ENTER</button>
                </div>

                <div className="lobby-status">
                  <span>START</span>
                  <span className={ready ? "selected" : ""}>
                    {ready ? "READY ✓" : "READY"}
                  </span>
                  <small>PROGRESS SAVED LOCALLY</small>
                </div>
              </div>

              <div className="faction-wall">
                <div className="wall-symbol gold">△</div>
                <div className="wall-symbol red">△</div>
                <div className="wall-symbol blue">△</div>
              </div>
            </section>
          </>
        ) : null}

        <section className="character-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">03 / 10 — PUZZLE GAME FLOW</div>
              <h2>PILIIN ANG <span>IYONG KARAKTER</span></h2>
            </div>

            <div className="selection-help">
              Libre ang lahat ng karakter.
              <br />
              Pindutin ang isang karakter para tingnan ang dossier.
            </div>
          </div>

          <div className="faction-tabs">
            {Object.keys(factions).map((faction) => (
              <button
                key={faction}
                className={activeFaction === faction ? "active" : ""}
                onClick={() => setActiveFaction(faction)}
              >
                {faction}
              </button>
            ))}
          </div>

          <div className="character-grid">
            {filteredCharacters.map((character) => (
              <button
                key={character.id}
                className={`character-card ${
                  selectedId === character.id ? "selected" : ""
                } ${character.className}`}
                onClick={() => selectCharacter(character.id)}
              >
                <div className="character-image">
                  <img
                    src={character.image}
                    alt={character.name}
                    onError={(event) => {
                      event.currentTarget.style.opacity = "0";
                    }}
                  />

                  <div className="image-number">
                    {String(characters.indexOf(character) + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="character-info">
                  <strong>{character.name}</strong>
                  <small>{character.faction}</small>
                  <p>{character.tagline}</p>
                </div>
              </button>
            ))}
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
            <div className="eyebrow">SELECTED CHARACTER</div>

            <h2>{selectedCharacter.name}</h2>

            <div className={`faction-label ${selectedCharacter.className}`}>
              {selectedCharacter.faction}
            </div>

            <p className="tagline">{selectedCharacter.tagline}</p>

            <p className="description">
              {selectedCharacter.description}
            </p>

            <div className="stats">
              <div>
                <span>PAPEL</span>
                <strong>{selectedCharacter.role}</strong>
              </div>

              <div>
                <span>LAKAS</span>
                <strong>{selectedCharacter.power}</strong>
              </div>

              <div>
                <span>SIMBOLO</span>
                <strong>{selectedCharacter.symbol}</strong>
              </div>
            </div>

            <div className="ready-panel">
              <div>
                <small>PLAYER</small>
                <strong>{playerName || "WALA PANG PANGALAN"}</strong>
              </div>

              <button
                className={ready ? "ready active" : "ready"}
                onClick={toggleReady}
              >
                {ready ? "✓ READY" : "READY"}
              </button>
            </div>
          </div>
        </section>

        <section className="final-section">
          <div>
            <div className="eyebrow">09 / 10 — FINAL LOBBY STATE</div>

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
              Harapin ang baha, lindol, kurapsyon, at pang-aalipin.
            </p>
          </div>

          <div className="final-character">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
            />

            <div>
              <small>SELECTED CHARACTER</small>
              <strong>{selectedCharacter.name}</strong>
              <span>{ready ? "● READY" : "○ NOT READY"}</span>
            </div>
          </div>

          <div className="final-actions">
            <button
              className="secondary-button"
              onClick={() => setScreen("characters")}
            >
              CHANGE CHARACTER
            </button>

            <button className="danger-button" onClick={startMission}>
              START MISSION
            </button>
          </div>
        </section>
      </main>

      <footer>
        <span>TATSULOK</span>
        <span>ANG LABAN AY HINDI LANG SA LAKAS — LABAN DIN ITO NG PANININDIGAN.</span>
      </footer>
    </div>
  );
}

export default App;
