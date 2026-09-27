# TATSULOK

First-person / third-person 3D district game. Playable on Render as a Vite static site.

## What is finished in this repo (Phases A–C)

- Lobby, characters, dossiers, factions, missions
- First-person and third-person camera (V or HUD button)
- Night district with facades, lamps, trees, barrels, flood water
- Mission 01 path: flood → survivor → clue → detour → supplies → evac → choice
- Survival layer: HP / food / stamina, hotbar, scrap + wood, loot barrels
- Craft: spear, bow, medkit (workbench modal)
- Save helpers in `src/game/SurvivalSystem.js` (recipes, localStorage)

## Controls

- Look: click/drag or pointer lock
- Move: WASD or joystick
- Run: Shift / RUN
- Interact / loot: E
- Toggle view: V
- Craft: C

## Deploy (Render)

- Build: `npm install && npm run build`
- Publish: `dist`

## What Phases D–Z would actually be

Those are not extra CSS passes. They are a different product:

- D–F: multi-district open map, vehicles, animals, NPC combat AI
- G–K: base building grid, decay, locks, raids, clans
- L–P: dedicated game server, inventory replication, anti-cheat
- Q–Z: animation set, gun feel, weather, progression seasons

That work belongs in Unity / Unreal / a custom multiplayer backend — not this Vite + Three.js static site.

This repository is the **complete web prototype**: story district + camera modes + survival loop that can ship on Render.
