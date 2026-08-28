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

  /* TIMER */
  useEffect(() => {
    if (screen !== "mission" || gamePaused || missionComplete) return;

    const interval = setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          clearInterval(interval);
          setHealth((h) => Math.max(0, h - 10));
          setMessage("Naubos ang oras. Lumala ang sitwasyon sa distrito.");
          return 180;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, gamePaused, missionComplete]);

  /* KEYBOARD */
  useEffect(() => {
    function handleKeyDown(event) {
      if (screen !== "mission" || gamePaused || choiceOpen) return;

      const key = event.key.toLowerCase();

      if (["arrowup", "w"].includes(key)) movePlayer(0, -4);
      if (["arrowdown", "s"].includes(key)) movePlayer(0, 4);
      if (["arrowleft", "a"].includes(key)) movePlayer(-4, 0);
      if (["arrowright", "d"].includes(key)) movePlayer(4, 0);

      if (key === "e" || key === " ") interactObjective();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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
    setTimer(180);
    setMissionComplete(false);
    setChoiceOpen(false);
    setGamePaused(false);
    setMessage("MISSION 01 — Hanapin ang evacuation center.");
    setObjective(objectives[0]);
    setPlayer({ x: 50, y: 78 });
  }

  function movePlayer(dx, dy) {
    setPlayer((current) => ({
      x: Math.max(5, Math.min(95, current.x + dx)),
      y: Math.max(8, Math.min(90, current.y + dy)),
    }));
  }

  function distanceToObjective() {
    const dx = player.x - objective.x;
    const dy = player.y - objective.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function interactObjective() {
    const distance =
