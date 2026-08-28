import React, { useEffect, useState } from "react";
import {
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Cloud,
  Check,
  ArrowRight,
  LockKeyhole,
  Zap,
  Crown,
  Heart,
  Shield,
  Brain,
  DoorOpen,
  Sprout,
  GraduationCap,
  Crosshair,
  RotateCcw
} from "lucide-react";

/*
===========================================================
TATSULOK
INTERACTIVE LOBBY CHARACTER SYSTEM
===========================================================
*/

const CHARACTERS = [
  {
    id: "peyudo",
    name: "PEYUDO",
    faction: "PANGINOON",
    factionClass: "panginoon",
    short: "Mabilis. Mayaman. Tanyag. Makapangyarihan.",
    description:
      "Mabilis, mayaman, tanyag, at may kapangyarihan. Siya ang pangunahing puwersa ng Panginoon.",
    role: "Pangunahing puwersa ng Panginoon",
    power: "Bilis • Yaman • Impluwensiya",
    symbol: "Mataas na posisyon sa Tatsulok",
    icon: Crown,
    portraitClass: "peyudo",
    quote: "Ang posisyon ay kapangyarihan.",
    stats: {
      bilis: 96,
      yaman: 99,
      impluwensiya: 94,
      tapang: 81
    }
  },
  {
    id: "misteryo",
    name: "MISTERYO",
    faction: "PANGINOON",
    factionClass: "panginoon",
    short: "Pumapatay at kumukuha ng hustisiya.",
    description:
      "Isang aninong kumikilos sa dilim. Hustisya ang tawag niya sa sarili niyang pamamaraan.",
    role: "Hustisyang dumadaan sa dahas",
    power: "Lihim • Dahas • Takot",
    symbol: "Nakatagong kamay",
    icon: Crosshair,
    portraitClass: "misteryo",
    quote: "Hindi lahat ng hustisya ay may liwanag.",
    stats: {
      bilis: 87,
      yaman: 61,
      impluwensiya: 79,
      tapang: 97
    }
  },
  {
    id: "bangag",
    name: "BANGAG",
    faction: "PANGINOON",
    factionClass: "panginoon",
    short: "Baliw, makapangyarihan, nakaupo, at mataba.",
    description:
      "Magulong kapangyarihang nakaupo sa trono. Hindi madaling hulaan ang susunod niyang kilos.",
    role: "Magulong kapangyarihang nakaupo sa trono",
    power: "Awtoridad • Kayamanan • Kaguluhan",
    symbol: "Trono",
    icon: Shield,
    portraitClass: "bangag",
    quote: "Ang sistema ay para sa nakaupo.",
    stats: {
      bilis: 53,
      yaman: 92,
      impluwensiya: 96,
      tapang: 88
    }
  },
  {
    id: "pula",
    name: "PULA",
    faction: "PANGINOON",
    factionClass: "panginoon",
    short: "May kamay na bakal at mga sinulid na pumupunit.",
    description:
      "Kamay na bakal. Hawak ang mga sinulid na kayang punitin ang mga ugnayan ng kalaban.",
    role: "Kamay na bakal ng sistema",
    power: "Kontrol • Takot • Pwersa",
    symbol: "Punit na sinulid",
    icon: Zap,
    portraitClass: "pula",
    quote: "Isang hila lang.",
    stats: {
      bilis: 73,
      yaman: 68,
      impluwensiya: 91,
      tapang: 94
    }
  },
  {
    id: "tanikala",
    name: "TANIKALA",
    faction: "PANGINOON",
    factionClass: "panginoon",
    short: "Tauhan ng Panginoon na karakter.",
    description:
      "Tagasunod na nagbubuklod at nagpapanatili sa sistema.",
    role: "Tagasunod ng Panginoon",
    power: "Depensa • Disiplina • Sistema",
    symbol: "Kadena",
    icon: LockKeyhole,
    portraitClass: "tanikala",
    quote: "Ang tanikala ay hindi kusang napuputol.",
    stats: {
      bilis: 62,
      yaman: 51,
      impluwensiya: 76,
      tapang: 91
    }
  },
  {
    id: "presyo",
    name: "PRESYO",
    faction: "MALAKAS",
    factionClass: "malakas",
    short: "Gumagamit ng hipnotismo.",
    description:
      "Kayang baguhin ang pagtingin ng iba sa pamamagitan ng hipnotismo at sikolohikal na kontrol.",
    role: "Tagapagbago ng isip",
    power: "Hipnotismo • Manipulasyon • Isip",
    symbol: "Umiikot na mata",
    icon: Brain,
    portraitClass: "presyo",
    quote: "Hindi mo kailangang pilitin ang taong sumunod.",
    stats: {
      bilis: 77,
      yaman: 72,
      impluwensiya: 98,
      tapang: 69
    }
  },
  {
    id: "pintuan",
    name: "PINTUAN",
    faction: "MALAKAS",
    factionClass: "malakas",
    short: "Trangkahan na maaaring magmanipula ng tadhana.",
    description:
      "Isang tagapagbukas at tagapagsara ng posibilidad. Maaari niyang baguhin ang direksiyon ng laban.",
    role: "Tagapamahala ng mga posibilidad",
    power: "Tadhana • Landas • Pagbabago",
    symbol: "Trangkahan",
    icon: DoorOpen,
    portraitClass: "pintuan",
    quote: "Bawat pinto ay may presyong kapalit.",
    stats: {
      bilis: 70,
      yaman: 63,
      impluwensiya: 93,
      tapang: 78
    }
  },
  {
    id: "ling",
    name: "LING",
    faction: "MABUTI",
    factionClass: "mabuti",
    short: "Tagapagpagaling.",
    description:
      "Tagapagpagaling na pinipiling iligtas ang iba kahit nasa gitna ng kaguluhan.",
    role: "Tagapagpagaling",
    power: "Pagpapagaling • Pag-asa • Buhay",
    symbol: "Bukas na kamay",
    icon: Heart,
    portraitClass: "ling",
    quote: "Ang buhay ay hindi dapat maging presyo.",
    stats: {
      bilis: 68,
      yaman: 46,
      impluwensiya: 71,
      tapang: 89
    }
  },
  {
    id: "batid",
    name: "BATID",
    faction: "MABUTI",
    factionClass: "mabuti",
    short: "Kumakatawan sa edukasyon.",
    description:
      "Naniniwala na ang kaalaman ang pinakamabisang sandata laban sa manipulasyon.",
    role: "Tagapagtanggol ng edukasyon",
    power: "Kaalaman • Lohika • Pagkatuto",
    symbol: "Aklat",
    icon: GraduationCap,
    portraitClass: "batid",
    quote: "Ang alam ng tao ay hindi madaling agawin.",
    stats: {
      bilis: 65,
      yaman: 48,
      impluwensiya: 82,
      tapang: 76
    }
  },
  {
    id: "tisa",
    name: "TISA",
    faction: "MABUTI",
    factionClass: "mabuti",
    short: "Kumakatawan sa pagtatanim.",
    description:
      "Kumakatawan sa pagtatanim, pagkain, kabuhayan, at pag-asa sa hinaharap.",
    role: "Tagapag-ingat ng kabuhayan",
    power: "Lupa • Pagkain • Pagtitiis",
    symbol: "Binhi",
    icon: Sprout,
    portraitClass: "tisa",
    quote: "Kung may binhi, may bukas.",
    stats: {
      bilis: 59,
      yaman: 43,
      impluwensiya: 67,
      tapang: 84
    }
  },
  {
    id: "subalit",
    name: "SUBALIT",
    faction: "MABUTI",
    factionClass: "mabuti",
    short: "Lumabalang batay sa puso, isip, at kabutihan.",
    description:
      "Hindi sumusunod nang bulag. Lumalaban batay sa puso, isip, at kabutihan.",
    role: "Tagapagtanggol ng paninindigan",
    power: "Tapang • Isip • Kabutihan",
    symbol: "Tatlong panig",
    icon: Shield,
    portraitClass: "subalit",
    quote: "May laban na hindi nasusukat sa lakas.",
    stats: {
      bilis: 81,
      yaman: 41,
      impluwensiya: 84,
      tapang: 96
    }
  }
];

const FACTIONS = [
  {
    id: "panginoon",
    name: "PANGINOON",
    title: "Ang nasa itaas",
    color: "gold",
    description:
      "Kapangyarihan, kayamanan, posisyon, at kontrol. Ang kanilang lakas ay nasa sistemang kanilang kinokontrol.",
    members: ["peyudo", "misteryo", "bangag", "pula", "tanikala"]
  },
  {
    id: "malakas",
    name: "MALAKAS",
    title: "Ang nagbabago ng laban",
    color: "red",
    description:
      "Mga puwersang kayang baguhin ang direksiyon ng laban. Ang kanilang desisyon ay may kapalit.",
    members: ["presyo", "pintuan"]
  },
  {
    id: "mabuti",
    name: "MABUTI",
    title: "Ang lumalaban para sa iba",
    color: "cyan",
    description:
      "Kaalaman, buhay, kabuhayan, at paninindigan. Hindi sila pinakamalakas, ngunit may dahilan silang lumaban.",
    members: ["ling", "batid", "tisa", "subalit"]
  }
];

const NAV_ITEMS = [
  { id: "world", label: "WORLD" },
  { id: "lobby", label: "LOBBY" },
  { id: "characters", label: "CHARACTERS" },
  { id: "dossier", label: "DOSSIER" },
  { id: "factions", label: "FACTIONS" },
  { id: "mission", label: "MISSION" }
];

function App() {
  const [activePage, setActivePage] = useState("world");
  const [selectedCharacter, setSelectedCharacter] = useState("peyudo");
  const [name, setName] = useState(
    localStorage.getItem("tatsulok-player-name") || ""
  );
  const [ready, setReady] = useState(
    localStorage.getItem("tatsulok-ready") === "true"
  );
  const [missionStarted, setMissionStarted] = useState(false);
  const [sound, setSound] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const character =
    CHARACTERS.find((item) => item.id === selectedCharacter) ||
    CHARACTERS[0];

  useEffect(() => {
    localStorage.setItem("tatsulok-player-name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("tatsulok-ready", String(ready));
  }, [ready]);

  const goTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseCharacter = (id) => {
    setSelectedCharacter(id);
    setReady(false);
    goTo("dossier");
  };

  const startMission = () => {
    if (!name.trim()) {
      goTo("lobby");
      return;
    }

    if (!ready) {
      goTo("dossier");
      return;
    }

    setMissionStarted(true);
    goTo("mission");
  };

  const resetGame = () => {
    setReady(false);
    setMissionStarted(false);
    setSelectedCharacter("peyudo");
    localStorage.removeItem("tatsulok-ready");
    goTo("world");
  };

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        goTo={goTo}
        sound={sound}
        setSound={setSound}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      <main className="main-content">
        {activePage === "world" && (
          <WorldPage
            goTo={goTo}
            selectedCharacter={character}
          />
        )}

        {activePage === "lobby" && (
          <LobbyPage
            name={name}
            setName={setName}
            ready={ready}
            setReady={setReady}
            character={character}
            goTo={goTo}
            startMission={startMission}
          />
        )}

        {activePage === "characters" && (
          <CharactersPage
            characters={CHARACTERS}
            selectedCharacter={selectedCharacter}
            chooseCharacter={chooseCharacter}
          />
        )}

        {activePage === "dossier" && (
          <DossierPage
            character={character}
            characters={CHARACTERS}
            selectedCharacter={selectedCharacter}
            chooseCharacter={chooseCharacter}
            ready={ready}
            setReady={setReady}
            goTo={goTo}
          />
        )}

        {activePage === "factions" && (
          <FactionsPage
            factions={FACTIONS}
            characters={CHARACTERS}
            chooseCharacter={chooseCharacter}
          />
        )}

        {activePage === "mission" && (
          <MissionPage
            character={character}
            name={name}
            missionStarted={missionStarted}
            ready={ready}
            startMission={startMission}
            resetGame={resetGame}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  activePage,
  goTo,
  sound,
  setSound,
  showSettings,
  setShowSettings
}) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => goTo("world")}>
        <div className="brand-symbol">
          <span>△</span>
        </div>

        <div className="brand-name">TATSULOK</div>
      </button>

      <nav className="main-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => goTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="save-status">
          <Cloud size={15} />
          <span>SAVED LOCALLY</span>
        </div>

        <button
          className="icon-button"
          aria-label="Sound"
          onClick={() => setSound(!sound)}
        >
          {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          className="icon-button"
          aria-label="Settings"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} />
        </button>

        <button
          className="icon-button"
          aria-label="Fullscreen"
          onClick={() => document.documentElement.requestFullscreen?.()}
        >
          <Maximize size={18} />
        </button>
      </div>

      {showSettings && (
        <div className="settings-popover">
          <div className="settings-title">SYSTEM</div>

          <div className="settings-row">
            <span>Sound</span>
            <button
              className={`mini-switch ${sound ? "on" : ""}`}
              onClick={() => setSound(!sound)}
            >
              {sound ? "ON" : "OFF"}
            </button>
          </div>

          <div className="settings-row">
            <span>Save</span>
            <span className="settings-green">LOCAL</span>
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================
   WORLD
========================================================= */

function WorldPage({ goTo }) {
  return (
    <section className="page page-world">
      <div className="world-grid">
        <div className="world-copy panel">
          <PanelLabel number="01 / 10" text="WORLD PREMISE" />

          <h1>
            ANG MUNDO NG
            <strong>TATSULOK</strong>
          </h1>

          <p className="lead">
            Isang puzzle game tungkol sa kapangyarihan, misteryo,
            kurapsyon, kaunlaran, at demokrasya.
          </p>

          <ul className="premise-list">
            <li>
              <span>△</span>
              Tatlong panig ng lipunan: Panginoon, Malakas, at Mabuti
            </li>
            <li>
              <span>◈</span>
              Bawat karakter ay may sariling kapangyarihan at paninindigan
            </li>
            <li>
              <span>⌁</span>
              Ang layunin: unawain ang misteryo sa likod ng kapangyarihan
            </li>
            <li>
              <span>!</span>
              Mga temang haharapin: baha, lindol, kurapsyon, at pang-aalipin
            </li>
          </ul>

          <button className="gold-button" onClick={() => goTo("lobby")}>
            ENTER LOBBY
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="world-image visual-panel">
          <div className="city-overlay" />

          <div className="triangle-monument">
            <div className="triangle-inner">△</div>
          </div>

          <div className="storm-light light-one" />
          <div className="storm-light light-two" />

          <div className="image-caption">
            <span>SECTOR 01</span>
            <span>MANILA / TATSULOK</span>
          </div>
        </div>
      </div>

      <div className="section-dots">
        <span className="dot active" />
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </section>
  );
}

/* =========================================================
   LOBBY
========================================================= */

function LobbyPage({
  name,
  setName,
  ready,
  setReady,
  character,
  goTo,
  startMission
}) {
  return (
    <section className="page">
      <div className="two-column-layout">
        <div className="panel lobby-intro">
          <PanelLabel number="02 / 10" text="THE ENTRY POINT" />

          <h1>
            LOBBY <span>/ MENU</span>
          </h1>

          <ul className="instruction-list">
            <li>Maglagay ng pangalan para makapasok</li>
            <li>Maaaring i-save ang laro at progreso</li>
            <li>Pindutin ang Start para simulan ang misyon</li>
            <li>Pindutin ang Ready kapag handa na ang karakter</li>
          </ul>

          <label className="field-label">PLAYER NAME</label>

          <input
            className="player-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ilagay ang pangalan..."
            maxLength={24}
          />

          <button
            className="red-button full-width"
            onClick={() => {
              if (name.trim()) {
                goTo("characters");
              }
            }}
          >
            ENTER
          </button>

          <div className="local-save">
            <Cloud size={14} />
            Progress saved locally
          </div>
        </div>

        <div className="panel lobby-visual">
          <div className="lobby-triangles">
            <div className="lobby-triangle gold">
              <span>△</span>
              <small>PANGINOON</small>
            </div>

            <div className="lobby-triangle red">
              <span>△</span>
              <small>MALAKAS</small>
            </div>

            <div className="lobby-triangle cyan">
              <span>△</span>
              <small>MABUTI</small>
            </div>
          </div>

          <div className="lobby-floor" />

          <div className="lobby-status-tabs">
            <button className="active">START</button>

            <button
              className={ready ? "ready-active" : ""}
              onClick={() => setReady(!ready)}
            >
              {ready ? "READY ✓" : "READY"}
            </button>

            <span>PROGRESS SAVED LOCALLY</span>
          </div>

          <div className="lobby-selected">
            <div>
              <span>SELECTED CHARACTER</span>
              <strong>{character.name}</strong>
            </div>

            <Portrait character={character} />
          </div>

          <button className="red-button" onClick={startMission}>
            START MISSION
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CHARACTERS
========================================================= */

function CharactersPage({
  characters,
  selectedCharacter,
  chooseCharacter
}) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? characters
      : characters.filter((character) => character.faction === filter);

  return (
    <section className="page">
      <PanelLabel number="03 / 10" text="PUZZLE GAME FLOW" />

      <div className="characters-heading">
        <div>
          <h1>
            PILIH ANG
            <br />
            <span>IYONG KARAKTER</span>
          </h1>

          <p>
            Libre ang lahat ng karakter at puwedeng gamitin.
            Pindutin ang karakter para makita ang dossier nito.
          </p>
        </div>

        <div className="filter-tabs">
          {["ALL", "PANGINOON", "MALAKAS", "MABUTI"].map((filterName) => (
            <button
              key={filterName}
              className={filter === filterName ? "active" : ""}
              onClick={() => setFilter(filterName)}
            >
              {filterName}
            </button>
          ))}
        </div>
      </div>

      <div className="character-grid">
        {filtered.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            selected={selectedCharacter === character.id}
            onClick={() => chooseCharacter(character.id)}
          />
        ))}
      </div>

      <div className="selection-hint">
        <span>SELECT</span>
        <span>Piliin at page ang iyong karakter</span>
      </div>
    </section>
  );
}

/* =========================================================
   DOSSIER
========================================================= */

function DossierPage({
  character,
  characters,
  selectedCharacter,
  chooseCharacter,
  ready,
  setReady,
  goTo
}) {
  const Icon = character.icon;

  return (
    <section className="page">
      <PanelLabel number="04 / 10" text="CHARACTER DOSSIER" />

      <div className="dossier-layout">
        <div className={`dossier-hero ${character.factionClass}`}>
          <div className="dossier-portrait">
            <Portrait character={character} large />
          </div>

          <div className="dossier-info">
            <div className="faction-badge">
              {character.faction}
            </div>

            <h1>{character.name}</h1>

            <p className="dossier-short">{character.short}</p>

            <div className="dossier-quote">
              “{character.quote}”
            </div>
          </div>
        </div>

        <div className="dossier-details panel">
          <div className="detail-heading">
            <Icon size={24} />
            <span>PROFILE</span>
          </div>

          <p>{character.description}</p>

          <div className="detail-item">
            <span>PAPEL</span>
            <strong>{character.role}</strong>
          </div>

          <div className="detail-item">
            <span>LAKAS</span>
            <strong>{character.power}</strong>
          </div>

          <div className="detail-item">
            <span>SIMBOLO</span>
            <strong>{character.symbol}</strong>
          </div>

          <div className="stat-block">
            <StatBar label="BILIS" value={character.stats.bilis} />
            <StatBar label="YAMAN" value={character.stats.yaman} />
            <StatBar
              label="IMPLUWIENSIYA"
              value={character.stats.impluwensiya}
            />
            <StatBar label="TAPANG" value={character.stats.tapang} />
          </div>

          <div className="ready-control">
            <div>
              <span>CHARACTER STATUS</span>
              <strong className={ready ? "ready-text" : ""}>
                {ready ? "READY" : "NOT READY"}
              </strong>
            </div>

            <button
              className={`ready-button ${ready ? "active" : ""}`}
              onClick={() => setReady(!ready)}
            >
              {ready ? (
                <>
                  <Check size={20} />
                  READY
                </>
              ) : (
                "READY"
              )}
            </button>
          </div>

          <div className="dossier-actions">
            <button
              className="outline-button"
              onClick={() => goTo("characters")}
            >
              CHANGE CHARACTER
            </button>

            <button
              className="red-button"
              onClick={() => {
                if (ready) goTo("mission");
              }}
            >
              START MISSION
            </button>
          </div>
        </div>
      </div>

      <div className="mini-character-strip">
        {characters.map((item) => (
          <button
            key={item.id}
            className={`mini-character ${
              selectedCharacter === item.id ? "selected" : ""
            }`}
            onClick={() => chooseCharacter(item.id)}
          >
            <Portrait character={item} />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   FACTIONS
========================================================= */

function FactionsPage({ factions, characters, chooseCharacter }) {
  return (
    <section className="page">
      <PanelLabel number="08 / 10" text="THE THREE SIDES" />

      <div className="factions-header">
        <h1>ANG TATLONG PANIG</h1>

        <p>
          Tatlong panig ng lipunan. Tatlong uri ng kapangyarihan.
          Isang Tatsulok.
        </p>
      </div>

      <div className="factions-grid">
        {factions.map((faction) => {
          const members = characters.filter((character) =>
            faction.members.includes(character.id)
          );

          return (
            <div
              key={faction.id}
              className={`faction-card faction-${faction.color}`}
            >
              <div className="faction-symbol">
                △
              </div>

              <div className="faction-title">
                <span>{faction.title}</span>
                <h2>{faction.name}</h2>
              </div>

              <p>{faction.description}</p>

              <div className="faction-members">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => chooseCharacter(member.id)}
                  >
                    <Portrait character={member} />
                    <span>{member.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   MISSION
========================================================= */

function MissionPage({
  character,
  name,
  missionStarted,
  ready,
  startMission,
  resetGame
}) {
  return (
    <section className="page mission-page">
      <PanelLabel number="09 / 10" text="FINAL LOBBY STATE" />

      <div className="mission-layout">
        <div className="mission-copy panel">
          <div className="mission-number">FINAL LOBBY STATE</div>

          <h1>
            START. READY.
            <span>HARAPIN ANG MISYON.</span>
          </h1>

          <ul>
            <li>Pumasok sa lobby</li>
            <li>Pumili ng karakter</li>
            <li>Mag-Ready</li>
            <li>
              Harapin ang baha, lindol, kurapsyon, at pang-aalipin
            </li>
          </ul>

          <div className="mission-player">
            <span>PLAYER</span>
            <strong>{name || "UNKNOWN PLAYER"}</strong>
          </div>

          <div className="mission-player">
            <span>SELECTED CHARACTER</span>
            <strong>{character.name}</strong>
          </div>
        </div>

        <div className="mission-card panel">
          <div className="selected-character-preview">
            <Portrait character={character} large />
          </div>

          <div className="selected-character-name">
            <span>SELECTED CHARACTER</span>
            <strong>{character.name}</strong>
          </div>

          <div className={`status-chip ${ready ? "ready" : ""}`}>
            {ready ? <Check size={16} /> : <span />}
            {ready ? "READY" : "NOT READY"}
          </div>

          <div className="mission-buttons">
            <button className="outline-button" onClick={resetGame}>
              <RotateCcw size={15} />
              RESET
            </button>

            <button
              className="red-button"
              disabled={!ready}
              onClick={startMission}
            >
              {missionStarted ? "MISSION ACTIVE" : "START MISSION"}
            </button>
          </div>
        </div>
      </div>

      <div className="mission-world">
        <div className="storm-city">
          <div className="large-triangle">△</div>

          <div className="city-building b1" />
          <div className="city-building b2" />
          <div className="city-building b3" />
          <div className="city-building b4" />
          <div className="city-building b5" />
        </div>

        <div className="mission-overlay">
          <h2>
            ANG TATSULOK AY HINDI LANG
            <span>LABAN NG LAKAS</span>
          </h2>

          <p>
            Laban din ito ng lakas, isip, puso, at paninindigan.
          </p>

          {missionStarted && (
            <div className="mission-begins">
              MISSION BEGINS
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function PanelLabel({ number, text }) {
  return (
    <div className="panel-label">
      <span>{number}</span>
      <strong>{text}</strong>
    </div>
  );
}

function Portrait({ character, large = false }) {
  return (
    <div
      className={`portrait portrait-${character.portraitClass} ${
        large ? "portrait-large" : ""
      }`}
      role="img"
      aria-label={`${character.name} character portrait`}
    >
      <div className="portrait-light" />

      <div className="portrait-silhouette">
        <div className="portrait-head" />
        <div className="portrait-body" />
        <div className="portrait-shoulder left" />
        <div className="portrait-shoulder right" />
      </div>

      <div className="portrait-symbol">
        {character.faction === "PANGINOON" && "△"}
        {character.faction === "MALAKAS" && "◈"}
        {character.faction === "MABUTI" && "✦"}
      </div>
    </div>
  );
}

function CharacterCard({ character, selected, onClick }) {
  return (
    <button
      className={`character-card ${character.factionClass} ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <Portrait character={character} />

      <div className="character-card-info">
        <div className="character-faction">
          {character.faction}
        </div>

        <h3>{character.name}</h3>

        <p>{character.short}</p>
      </div>

      {selected && (
        <div className="selected-mark">
          <Check size={15} />
        </div>
      )}
    </button>
  );
}

function StatBar({ label, value }) {
  return (
    <div className="stat-row">
      <div className="stat-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="stat-track">
        <div
          className="stat-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>TATSULOK</span>
      <span>INTERACTIVE LOBBY SYSTEM</span>
      <span>LOCAL SAVE ENABLED</span>
    </footer>
  );
}

export default App;
