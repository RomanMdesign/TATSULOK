import React, { useEffect, useMemo, useState } from "react";
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
