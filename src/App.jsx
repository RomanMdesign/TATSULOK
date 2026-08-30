import {
  useEffect,
  useState
} from "react";

import District3D from "./game/District3D";

import {
  characters
} from "./game/characters";

import {
  missions
} from "./game/MissionSystem";

export default function App() {
  const [page, setPage] =
    useState("lobby");

  const [selectedCharacter, setSelectedCharacter] =
    useState(
      localStorage.getItem(
        "tatsulok-character"
      ) || "misteryo"
    );

  const [playerName, setPlayerName] =
    useState(
      localStorage.getItem(
        "tatsulok-name"
      ) || ""
    );

  const [selectedMission, setSelectedMission] =
    useState(null);

  const [activeCharacter, setActiveCharacter] =
    useState(
      characters.find(
        (c) => c.id === selectedCharacter
      ) || characters[0]
    );

  useEffect(() => {
    localStorage.setItem(
      "tatsulok-character",
      selectedCharacter
    );
  }, [selectedCharacter]);

  useEffect(() => {
    localStorage.setItem(
      "tatsulok-name",
      playerName
    );
  }, [playerName]);

  const selectCharacter = (character) => {
  setSelectedCharacter(character.id);
  setActiveCharacter(character);

  const characterAudio = {
    peyudo: "/assets/peyudo.mp3",
    misteryo: "/assets/misteryo.mp3",
    bangag: "/assets/bangag.mp3",
    pula: "/assets/pula.wav",
    tanikala: "/assets/tanikala.mp3",
    tisa: "/assets/tisa.mp3",
  };

  // Stop currently playing character audio
  if (window.tatsulokCharacterAudio) {
    window.tatsulokCharacterAudio.pause();

    try {
      window.tatsulokCharacterAudio.currentTime = 0;
    } catch (error) {
      // Ignore reset errors
    }
  }

  const audioFile = characterAudio[character.id];

  // Characters without an assigned audio simply stop playback.
  if (!audioFile) {
    window.tatsulokCharacterAudio = null;
    return;
  }

  const audio = new Audio(audioFile);

  audio.preload = "auto";
  audio.volume = 1.0;

  window.tatsulokCharacterAudio = audio;

  audio.play().catch((error) => {
    console.error(
      `Hindi ma-play ang audio ni ${character.name}:`,
      error
    );
  });

  audio.onended = () => {
    if (window.tatsulokCharacterAudio === audio) {
      window.tatsulokCharacterAudio = null;
    }
  };
};

  const openMission = (mission) => {
    setSelectedMission(
      mission
    );

    setPage("game");
  };

  if (
    page === "game" &&
    selectedMission
  ) {
    return (
      <District3D
        mission={selectedMission}
        onExit={() => {
          setSelectedMission(null);
          setPage("missions");
        }}
        onComplete={() => {
          setSelectedMission(null);
          setPage("missions");
        }}
      />
    );
  }

  return (
    <div className="app">
      <Header
        page={page}
        setPage={setPage}
      />

      {page === "lobby" && (
        <Lobby
          playerName={playerName}
          setPlayerName={setPlayerName}
          character={activeCharacter}
          onCharacters={() =>
            setPage("characters")
          }
          onMissions={() =>
            setPage("missions")
          }
          onReady={() =>
            setPage("missions")
          }
        />
      )}

      {page === "characters" && (
        <CharactersPage
          selectedCharacter={
            activeCharacter
          }
          onSelect={
            selectCharacter
          }
          onDossier={() =>
            setPage("dossier")
          }
        />
      )}

      {page === "dossier" && (
        <Dossier
          character={activeCharacter}
          onBack={() =>
            setPage("characters")
          }
        />
      )}

      {page === "factions" && (
        <Factions />
      )}

      {page === "missions" && (
        <Missions
          onOpen={openMission}
        />
      )}
    </div>
  );
}

/* HEADER */

function Header({
  page,
  setPage
}) {
  return (
    <header className="site-header">
      <button
        className="brand"
        onClick={() =>
          setPage("lobby")
        }
      >
        <span className="brand-symbol">
          △
        </span>

        <span>TATSULOK</span>
      </button>

      <nav>
        <button
          className={
            page === "lobby"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("lobby")
          }
        >
          LOBBY
        </button>

        <button
          className={
            page === "characters"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("characters")
          }
        >
          CHARACTERS
        </button>

        <button
          className={
            page === "dossier"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("dossier")
          }
        >
          DOSSIER
        </button>

        <button
          className={
            page === "factions"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("factions")
          }
        >
          FACTIONS
        </button>

        <button
          className={
            page === "missions"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("missions")
          }
        >
          MISSIONS
        </button>
      </nav>
    </header>
  );
}

/* LOBBY */

function Lobby({
  playerName,
  setPlayerName,
  character,
  onCharacters,
  onMissions,
  onReady
}) {
  return (
    <main className="lobby-page">
      <section className="hero-copy">
        <div className="eyebrow">
          INTERACTIVE 3D PUZZLE GAME
        </div>

        <h1>
          ANG TATSULOK
        </h1>

        <p>
          Isang mundo ng kapangyarihan,
          misteryo, kurapsyon, kaunlaran,
          at demokrasya.
        </p>

        <div className="name-box">
          <label>
            PLAYER NAME
          </label>

          <input
            value={playerName}
            onChange={(e) =>
              setPlayerName(
                e.target.value
              )
            }
            placeholder="Ilagay ang pangalan"
          />
        </div>

        <div className="lobby-actions">
          <button
            onClick={onCharacters}
          >
            PUMILI NG KARAKTER
          </button>

          <button
            onClick={onMissions}
          >
            HARAPIN ANG MISYON
          </button>
        </div>
      </section>

      <section className="lobby-character">
        <div className="character-frame">
          <img
            src={character.image}
            alt={character.name}
          />
        </div>

        <div className="character-info">
          <span>
            {character.faction}
          </span>

          <h2>
            {character.name}
          </h2>

          <p>
            {character.description}
          </p>

          <button
            className="ready-button"
            onClick={onReady}
          >
            READY
          </button>
        </div>
      </section>
    </main>
  );
}

/* CHARACTERS */

function CharactersPage({
  selectedCharacter,
  onSelect,
  onDossier
}) {
  return (
    <main className="page">
      <div className="page-heading">
        <div className="eyebrow">
          CHARACTER SELECT
        </div>

        <h1>
          PUMILI NG KARAKTER
        </h1>

        <p>
          Libre ang lahat ng karakter
          at maaaring gamitin sa laro.
        </p>
      </div>

      <div className="character-grid">
        {characters.map(
          (character) => (
            <button
              key={character.id}
              className={
                "character-card " +
                (selectedCharacter.id ===
                character.id
                  ? "selected"
                  : "")
              }
              onClick={() =>
                onSelect(
                  character
                )
              }
            >
              <div className="character-image">
                <img
                  src={
                    character.image
                  }
                  alt={
                    character.name
                  }
                />
              </div>

              <div className="character-card-body">
                <span>
                  {character.faction}
                </span>

                <h2>
                  {character.name}
                </h2>

                <p>
                  {character.description}
                </p>
              </div>
            </button>
          )
        )}
      </div>

      <div className="selected-bar">
        <div>
          SELECTED CHARACTER
          <strong>
            {selectedCharacter.name}
          </strong>
        </div>

        <button
          onClick={onDossier}
        >
          OPEN DOSSIER
        </button>
      </div>
    </main>
  );
}

/* DOSSIER */

function Dossier({
  character,
  onBack
}) {
  return (
    <main className="dossier-page">
      <button
        className="back-link"
        onClick={onBack}
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

        <div className="dossier-content">
          <div className="eyebrow">
            CHARACTER DOSSIER
          </div>

          <div className="dossier-faction">
            {character.faction}
          </div>

          <h1>
            {character.name}
          </h1>

          <h3>
            {character.role}
          </h3>

          <p>
            {character.description}
          </p>

          <div className="stat-list">
            <Stat
              name="POWER"
              value={
                character.power
              }
            />

            <Stat
              name="TRUST"
              value={
                character.trust
              }
            />

            <Stat
              name="HUMANITY"
              value={
                character.humanity
              }
            />
          </div>

          <div className="ability-box">
            <span>
              ABILITY
            </span>

            <strong>
              {character.ability}
            </strong>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  name,
  value
}) {
  return (
    <div className="stat">
      <div>
        <span>
          {name}
        </span>

        <strong>
          {value}
        </strong>
      </div>

      <div className="stat-track">
        <div
          style={{
            width: `${value}%`
          }}
        />
      </div>
    </div>
  );
}

/* FACTIONS */

function Factions() {
  return (
    <main className="page">
      <div className="page-heading">
        <div className="eyebrow">
          THREE SIDES
        </div>

        <h1>
          MGA PAKSYON
        </h1>
      </div>

      <div className="faction-grid">
        <Faction
          title="PANGINOON"
          color="gold"
          text="Kapangyarihan, yaman, impluwensiya, at kontrol."
        />

        <Faction
          title="MALAKAS"
          color="red"
          text="Mga puwersang kayang baguhin ang direksiyon ng laban."
        />

        <Faction
          title="MABUTI"
          color="teal"
          text="Puso, isip, edukasyon, paggaling, pagtatanim, at kabutihan."
        />
      </div>
    </main>
  );
}

function Faction({
  title,
  color,
  text
}) {
  return (
    <section
      className={`faction-panel ${color}`}
    >
      <div className="eyebrow">
        FACTION
      </div>

      <h2>
        {title}
      </h2>

      <p>
        {text}
      </p>
    </section>
  );
}

/* MISSIONS */

function Missions({
  onOpen
}) {
  return (
    <main className="page mission-page">
      <div className="page-heading">
        <div className="eyebrow">
          MISSION SELECT
        </div>

        <h1>
          Harapin ang Misyon
        </h1>

        <p>
          Piliin ang mission na
          haharapin mo.
        </p>
      </div>

      <div className="mission-list">
        {missions.map(
          (mission) => (
            <article
              className="mission-card"
              key={mission.id}
            >
              <div className="mission-number">
                {mission.number}
              </div>

              <div className="mission-details">
                <div className="eyebrow">
                  MISSION{" "}
                  {mission.number}
                </div>

                <h2>
                  {mission.title}
                </h2>

                <p>
                  {mission.description}
                </p>

                <div className="mission-tags">
                  <span>
                    {mission.category}
                  </span>

                  <span>
                    MISTERYO
                  </span>

                  <span>
                    CHOICE
                  </span>
                </div>

                <button
                  className="open-mission"
                  onClick={() =>
                    onOpen(
                      mission
                    )
                  }
                >
                  OPEN MISSION
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </main>
  );
}
