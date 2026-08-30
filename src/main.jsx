import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

function CharacterAudioBridge() {
  const audioRef = useRef(null);

  const tracks = {
    peyudo: "/assets/peyudo.mp4",
    misteryo: "/assets/misteryo.mp4",
    bangag: "/assets/bangag.mp4",
    pula: "/assets/pula.wav",
    tanikala: "/assets/tanikala.mp3",
    tisa: "/assets/tisa.mp4",
  };

  useEffect(() => {
    const stopCurrentAudio = () => {
      const current = audioRef.current;

      if (!current) return;

      current.pause();

      try {
        current.currentTime = 0;
      } catch {}

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

      // Stop previous character audio
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
          `Hindi ma-play ang character audio: ${source}`
        );

        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };

      audio.play().catch((error) => {
        console.warn(
          `Hindi pinayagan ng browser ang audio playback para kay ${characterId}.`,
          error
        );
      });
    };

    const identifyCharacter = (card) => {
      if (!card) return null;

      // Preferred method:
      // <button data-character="pula">
      const dataCharacter =
        card.dataset?.character?.toLowerCase();

      if (tracks[dataCharacter]) {
        return dataCharacter;
      }

      // Fallback: basahin ang pangalan sa card
      const text = card.textContent
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      const characters = [
        "peyudo",
        "misteryo",
        "bangag",
        "pula",
        "tanikala",
        "tisa",
      ];

      return (
        characters.find((character) =>
          text.includes(character)
        ) || null
      );
    };

    const handleCharacterPointer = (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const card = target.closest(
        ".character-card, [data-character]"
      );

      if (!card) return;

      const characterId = identifyCharacter(card);

      if (characterId) {
        playCharacterAudio(characterId);
      }
    };

    /*
      Pointer event:
      - iPad touch
      - mobile touch
      - mouse click
      - desktop
    */
    document.addEventListener(
      "pointerdown",
      handleCharacterPointer
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleCharacterPointer
      );

      stopCurrentAudio();
    };
  }, []);

  return null;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
    <CharacterAudioBridge />
  </React.StrictMode>
);
