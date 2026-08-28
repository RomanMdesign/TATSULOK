import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

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
    role: "Hustisyang dumadaan sa dahas",
    power: "Dahas at misteryo",
    image: "/assets/character-02.jpg",
  },
  {
    id: "bangag",
    name: "Bangag",
    faction: "Panginoon",
    role: "Magulong kapangyarihan",
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
    role: "Tagasunod ng sistema",
    power: "Pagbubuklod at kontrol",
    image: "/assets/character-05.jpg",
  },
  {
    id: "presyo",
    name: "Presyo",
    faction: "Malakas",
    role: "Tagapagmanipula",
    power: "Hipnotismo",
    image: "/assets/character-06.jpg",
  },
  {
    id: "pintuan",
    name: "Pintuan",
    faction: "Malakas",
    role: "Tagapagbago ng tadhana",
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
    role: "Lumalaban batay sa puso at isip",
    power: "Paninindigan",
    image: "/assets/character-11.jpg",
  },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/characters" element={<Characters />} />
      <Route path="/characters/:id" element={<CharacterDossier />} />
      <Route path="/dossier" element={<Dossier />} />
      <Route path="/factions" element={<Factions />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/mission/01" element={<Mission01 />} />
      <Route path="/district/01" element={<District />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* ---------------- LAYOUT ---------------- */

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-symbol">△</span>
          <span>TATSULOK</span>
        </Link>

        <nav className="main-nav">
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            Lobby
          </Link>

          <Link
            className={location.pathname.startsWith("/characters") ? "active" : ""}
            to="/characters"
          >
            Characters
          </Link>

          <Link
            className={location.pathname === "/dossier" ? "active" : ""}
            to="/dossier"
          >
            Dossier
          </Link>

          <Link
            className={location.pathname === "/factions" ? "active" : ""}
            to="/factions"
          >
            Factions
          </Link>

          <Link
            className={location.pathname.startsWith("/mission") ? "active" : ""}
            to="/missions"
          >
            Missions
          </Link>
        </nav>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}

/* ---------------- LOBBY ---------------- */

function Lobby() {
  const navigate = useNavigate();
  const [name, setName] = useState(
    localStorage.getItem("tatsulok_player") || ""
  );

  function startGame() {
    const playerName = name.trim();

    if (!playerName) {
      alert("Maglagay muna ng pangalan.");
      return;
    }

    localStorage.setItem("tatsulok_player", playerName);
    navigate("/missions");
  }

  return (
    <Layout>
      <section className="lobby-page">
        <div className="lobby-overlay" />

        <div className="lobby-content">
          <div className="triangle-logo">△</div>

          <p className="eyebrow">INTERACTIVE 3D PUZZLE GAME</p>

          <h1>TATSULOK</h1>

          <p className="tagline">
            Isang puzzle game tungkol sa kapangyarihan, misteryo,
            kurapsyon, kaunlaran, at demokrasya.
          </p>

          <div className="name-panel">
            <label>PLAYER NAME</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ilagay ang pangalan"
              maxLength={24}
            />
          </div>

          <div className="lobby-buttons">
            <button className="primary-button" onClick={startGame}>
              START
            </button>

            <Link className="secondary-button" to="/characters">
              CHARACTERS
            </Link>

            <Link className="secondary-button" to="/missions">
              MISSIONS
            </Link>
          </div>

          <p className="lobby-note">
            START. READY. HARAPIN ANG MISYON.
          </p>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- CHARACTERS ---------------- */

function Characters() {
  const [selectedFaction, setSelectedFaction] = useState("Lahat");

  const filtered =
    selectedFaction === "Lahat"
      ? characters
      : characters.filter((character) => character.faction === selectedFaction);

  return (
    <Layout>
      <section className="standard-page">
        <PageHeader
          eyebrow="CHARACTER SYSTEM"
          title="Piliin ang Iyong Karakter"
          description="Bawat karakter ay may sariling kapangyarihan, papel, faction, at paninindigan."
        />

        <div className="filter-tabs">
          {["Lahat", "Panginoon", "Malakas", "Mabuti"].map((faction) => (
            <button
              key={faction}
              className={selectedFaction === faction ? "filter active" : "filter"}
              onClick={() => setSelectedFaction(faction)}
            >
              {faction}
            </button>
          ))}
        </div>

        <div className="character-grid">
          {filtered.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              className="character-card"
            >
              <div className="character-image-wrap">
                <img
                  src={character.image}
                  alt={character.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="character-info">
                <span>{character.faction}</span>
                <h3>{character.name}</h3>
                <p>{character.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- CHARACTER DOSSIER ---------------- */

function CharacterDossier() {
  const { id } = useLocation();
  const characterId = id.pathname.split("/").pop();

  const character = characters.find((item) => item.id === characterId);

  const navigate = useNavigate();

  if (!character) {
    return <NotFound />;
  }

  function selectCharacter() {
    localStorage.setItem("selected_character", character.id);
    navigate("/missions");
  }

  return (
    <Layout>
      <section className="dossier-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <div className="dossier-layout">
          <div className="dossier-portrait">
            <img src={character.image} alt={character.name} />
          </div>

          <div className="dossier-content">
            <span className="eyebrow">{character.faction}</span>

            <h1>{character.name}</h1>

            <h2>{character.role}</h2>

            <div className="dossier-box">
              <span>LAKAS</span>
              <strong>{character.power}</strong>
            </div>

            <p>
              Ang karakter na ito ay bahagi ng mundo ng TATSULOK.
              Ang kaniyang papel at mga desisyon ay maaaring makaapekto
              sa direksiyon ng misyon.
            </p>

            <button className="primary-button" onClick={selectCharacter}>
              SELECT CHARACTER
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- DOSSIER ---------------- */

function Dossier() {
  const selectedId = localStorage.getItem("selected_character");

  const selected = characters.find((character) => character.id === selectedId);

  return (
    <Layout>
      <section className="standard-page">
        <PageHeader
          eyebrow="DOSSIER"
          title="Character Dossier"
          description="Tingnan ang impormasyon ng iyong napiling karakter."
        />

        {selected ? (
          <div className="selected-dossier">
            <img src={selected.image} alt={selected.name} />

            <div>
              <span className="eyebrow">{selected.faction}</span>
              <h2>{selected.name}</h2>
              <p>{selected.role}</p>

              <div className="dossier-box">
                <span>POWER</span>
                <strong>{selected.power}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h2>Walang napiling karakter.</h2>
            <Link to="/characters" className="primary-button">
              PUMILI NG KARAKTER
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
}

/* ---------------- FACTIONS ---------------- */

function Factions() {
  return (
    <Layout>
      <section className="standard-page">
        <PageHeader
          eyebrow="THREE SIDES"
          title="Factions"
          description="Tatlong panig ng lipunan ang bumubuo sa Tatsulok."
        />

        <div className="faction-grid">
          <FactionCard
            symbol="01"
            title="PANGINOON"
            description="Kapangyarihan, yaman, impluwensiya, at kontrol."
            members={characters.filter((c) => c.faction === "Panginoon")}
          />

          <FactionCard
            symbol="02"
            title="MALAKAS"
            description="Mga puwersang kayang baguhin ang direksiyon ng laban."
            members={characters.filter((c) => c.faction === "Malakas")}
          />

          <FactionCard
            symbol="03"
            title="MABUTI"
            description="Puso, isip, edukasyon, paggaling, pagtatanim, at kabutihan."
            members={characters.filter((c) => c.faction === "Mabuti")}
          />
        </div>
      </section>
    </Layout>
  );
}

function FactionCard({ symbol, title, description, members }) {
  return (
    <div className="faction-card">
      <span className="faction-number">{symbol}</span>
      <h2>{title}</h2>
      <p>{description}</p>

      <div className="member-list">
        {members.map((member) => (
          <Link key={member.id} to={`/characters/${member.id}`}>
            {member.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------------- MISSIONS ---------------- */

function Missions() {
  return (
    <Layout>
      <section className="standard-page">
        <PageHeader
          eyebrow="MISSION SELECT"
          title="Harapin ang Misyon"
          description="Pumasok sa district at tuklasin ang misteryo sa likod ng kapangyarihan."
        />

        <div className="mission-list">
          <div className="mission-card">
            <div className="mission-number">01</div>

            <div className="mission-details">
              <span>MISSION 01</span>
              <h2>EVACUATION CENTER</h2>

              <p>
                May emergency sa distrito. Magtungo sa evacuation
                center at alamin kung ano ang tunay na nangyayari.
              </p>

              <div className="mission-tags">
                <span>BAHA</span>
                <span>MISTERYO</span>
                <span>DECISION</span>
              </div>

              <Link to="/mission/01" className="primary-button">
                OPEN MISSION
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- MISSION 01 ---------------- */

function Mission01() {
  const navigate = useNavigate();

  const playerName =
    localStorage.getItem("tatsulok_player") || "PLAYER";

  const selectedId = localStorage.getItem("selected_character");

  const selected = characters.find((c) => c.id === selectedId);

  return (
    <Layout>
      <section className="mission-briefing">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <div className="mission-briefing-content">
          <span className="eyebrow">MISSION 01</span>

          <h1>EVACUATION CENTER</h1>

          <p className="mission-intro">
            {playerName}, may emergency sa district.
            Kailangan mong pumunta sa evacuation center.
          </p>

          <div className="mission-objectives">
            <div>
              <span>OBJECTIVE 01</span>
              <strong>Hanapin ang Evacuation Center</strong>
            </div>

            <div>
              <span>OBJECTIVE 02</span>
              <strong>Alamin ang tunay na nangyayari</strong>
            </div>
          </div>

          {selected && (
            <div className="ready-character">
              <img src={selected.image} alt={selected.name} />
              <div>
                <span>SELECTED CHARACTER</span>
                <strong>{selected.name}</strong>
              </div>
            </div>
          )}

          <button
            className="primary-button mission-start-button"
            onClick={() => navigate("/district/01")}
          >
            START MISSION
          </button>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- 3D DISTRICT ---------------- */

function District() {
  const navigate = useNavigate();

  return (
    <div className="district-page">
      <button
        className="district-back"
        onClick={() => navigate("/missions")}
      >
        ← BACK
      </button>

      <div className="district-hud">
        <div className="hud-top">
          <div>
            <small>MISSION 01</small>
            <strong>EVACUATION CENTER</strong>
          </div>

          <div className="hud-distance">
            <small>DISTANCE</small>
            <strong>74m</strong>
          </div>
        </div>

        <div className="objective-marker">
          <div className="marker-icon">◆</div>
          <strong>EVACUATION CENTER</strong>
          <span>74m</span>
        </div>

        <div className="district-center">
          <div className="crosshair">+</div>
        </div>

        <div className="mobile-joystick">
          <div className="joystick-ring">
            <div className="joystick-knob" />
          </div>
        </div>

        <button
          className="interact-button"
          onClick={() => navigate("/mission/01?event=evacuation")}
        >
          INTERACT
        </button>

        <div className="district-controls">
          <span>W A S D / TOUCH</span>
          <span>LOOK: MOUSE / SWIPE</span>
        </div>
      </div>

      <DistrictScene />
    </div>
  );
}

/*
  Temporary procedural 3D-looking district layer.

  Ito ang visual shell ng district page.
  Ang actual Three.js scene ay ilalagay sa District3D component
  kapag ikinabit na ang full WebGL player controller.
*/
function DistrictScene() {
  return (
    <div className="district-scene">
      <div className="sky" />

      <div className="building building-a">
        <div className="windows" />
      </div>

      <div className="building building-b">
        <div className="windows" />
      </div>

      <div className="building building-c">
        <div className="windows" />
      </div>

      <div className="street">
        <div className="street-line" />
      </div>

      <div className="street-object pole pole-a" />
      <div className="street-object pole pole-b" />

      <div className="car car-a" />
      <div className="debris debris-a" />
      <div className="debris debris-b" />

      <div className="district-fog" />
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="page-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function NotFound() {
  return (
    <Layout>
      <section className="empty-state">
        <h1>404</h1>
        <p>Hindi makita ang page.</p>
        <Link to="/" className="primary-button">
          BACK TO LOBBY
        </Link>
      </section>
    </Layout>
  );
}

export default App;
