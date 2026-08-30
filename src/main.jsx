import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

/*
  TATSULOK CHARACTER AUDIO
  -------------------------
  Pula     -> /assets/pula.wav
  Tanikala -> /assets/tanikala.mp3

  Kapag pinindot ang character card:
  - hihinto ang dating character audio
  - tutugtog ang bagong character audio
  - mananatili ang existing App / Lobby / Characters / Dossier / Factions
*/

function CharacterAudioBridge() {
  const audioRef = useRef(null);

  const tracks = {
    pula: "/assets/pula.wav",
    tanikala: "/assets/tanikala.mp3",
  };

  useEffect(() => {
    const stopCurrentAudio = () => {
      const current = audioRef.current;

      if (!current) return;

      current.pause();

      try {
        current.currentTime = 0;
      } catch {
        // Ignore reset errors from an already-ended audio element.
      }

      current.onended = null;
      current.onerror = null;
      audioRef.current = null;
    };

    const playCharacterAudio = (characterId) => {
      const source = tracks[characterId];

      if (!source) {
        stopCurrentAudio();
        return;
      }

      stopCurrentAudio();

      const audio = new Audio(source);

      audio.preload = "auto";
      audio.volume = 1.0;

      audioRef.current = audio;

      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };

      audio.onerror = () => {
        console.error(
          `Hindi ma-play ang audio para kay ${characterId}: ${source}`
        );

        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };

      /*
        Dahil ang click/touch event ang nag-trigger nito,
        user-initiated ang playback at compatible ito sa
        mobile/iPad browser autoplay restrictions.
      */
      audio.play().catch((error) => {
        console.warn(
          `Audio playback blocked para kay ${characterId}.`,
          error
        );
      });
    };

    const getCharacterIdFromCard = (card) => {
      if (!card) return null;

      /*
        Sinusuri muna ang data-character attribute kung mayroon.
        Halimbawa:
        <button className="character-card" data-character="pula">
      */
      const dataCharacter = card.dataset?.character?.toLowerCase();

      if (dataCharacter === "pula") return "pula";
      if (dataCharacter === "tanikala") return "tanikala";

      /*
        Fallback:
        Kung ang existing card ay walang data-character,
        babasahin ang text ng card.
      */
      const text = card.textContent
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      if (text.includes("tanikala")) return "tanikala";
      if (text.includes("pula")) return "pula";

      return null;
    };

    const handleCharacterClick = (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const card = target.closest(
        ".character-card, [data-character]"
      );

      if (!card) return;

      const characterId = getCharacterIdFromCard(card);

      if (characterId) {
        playCharacterAudio(characterId);
      }
    };

    /*
      Click para desktop + touch/pointer para iPad/mobile.
      Pointerdown ang ginagamit para mas mabilis ang response
      sa touch device.
    */
    document.addEventListener("pointerdown", handleCharacterClick);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleCharacterClick
      );

      stopCurrentAudio();
    };
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <CharacterAudioBridge />
  </React.StrictMode>
);
