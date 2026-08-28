Oo. Heto na ang buong README.md sa isang text/code block lang. I-copy-paste mo nang buo sa GitHub file na README.md.

# 🔺 TATSULOK
## Interactive First-Person 3D Puzzle Game
**TATSULOK** ay isang interactive puzzle game tungkol sa **kapangyarihan, misteryo, kurapsyon, kaunlaran, at demokrasya**.
Ang mundo ng TATSULOK ay nahahati sa tatlong panig ng lipunan:
- **PANGINOON**
- **MALAKAS**
- **MABUTI**
Bawat karakter ay may sariling kapangyarihan, papel, paninindigan, at misteryo.
> **Ang Tatsulok ay hindi lang laban ng lakas — laban din ito ng paninindigan.**
---
# 🌍 ANG MUNDO NG TATSULOK
Tatlong panig ng lipunan ang bumubuo sa mundo ng TATSULOK.
## 🔺 PANGINOON
Mga karakter na kumakatawan sa mataas na antas ng kapangyarihan, yaman, impluwensiya, at kontrol.
### Mga Karakter
**Peyudo** — mabilis, mayaman, tanyag, at may kapangyarihan.
**Misteryo** — pumapatay at kumukuha ng hustisiya.
**Bangag** — baliw, makapangyarihan, nakaupo, at mataba.
**Pula** — may kamay na bakal at mga sinulid na pumupunit.
**Tanikala** — tauhan ng Panginoon na karakter.
---
## ⚡ MALAKAS
Mga karakter na may kakayahang baguhin ang direksiyon ng laban.
### Mga Karakter
**Presyo** — gumagamit ng hipnotismo.
**Pintuan** — trangkahan na maaaring magmanipula ng tadhana.
> **Ang bawat desisyon ay may kapalit.**
---
## ❤️ MABUTI
Mga karakter na kumakatawan sa puso, isip, edukasyon, paggaling, pagtatanim, at kabutihan.
### Mga Karakter
**Ling** — tagapagpagaling.
**Batid** — kumakatawan sa edukasyon.
**Tisa** — kumakatawan sa pagtatanim.
**Subalit** — lumalaban batay sa puso, isip, at kabutihan.
---
# 🎮 LOBBY / MENU
Sa simula ng laro, papasok ang player sa TATSULOK Lobby.
Maaaring:
- Maglagay ng pangalan
- I-save ang laro
- Tingnan ang Characters
- Tingnan ang Dossier
- Tingnan ang Factions
- Pumili ng karakter
- Pindutin ang READY
- Simulan ang Mission
### Lobby Flow
```text
TATSULOK LOBBY
       ↓
ENTER NAME
       ↓
CHARACTER SELECTION
       ↓
DOSSIER
       ↓
SELECT CHARACTER
       ↓
READY
       ↓
START MISSION

⸻

🧩 CHARACTER SELECTION

Libre ang lahat ng karakter at maaaring gamitin sa laro.

Ang characters ay ipinapakita bilang interactive character pages/tabs.

Maaaring:

* Pindutin ang character tab
* Tingnan ang portrait
* Basahin ang papel
* Tingnan ang faction
* Tingnan ang lakas
* Tingnan ang kakayahan
* Buksan ang dossier
* Pumili ng karakter
* Mag-READY

⸻

📂 DOSSIER SYSTEM

Bawat karakter ay may sariling dossier.

Maaaring makita ang:

* Pangalan
* Faction
* Papel
* Lakas
* Kakayahan
* Simbolo
* Background
* Mission relevance

⸻

🏙️ FIRST-PERSON 3D DISTRICT

Ang pangunahing gameplay ng TATSULOK ay isang tunay na first-person 3D playable district.

Hindi ito:

* Flat map
* Screenshot
* Bird’s-eye view
* Top-down map
* Buildings na nakapatong lamang sa isang larawan

Ang player mismo ang nasa loob ng distrito.

Makikita ng player:

* 3D buildings
* Streets
* Ground
* Walls
* Sidewalks
* Street lights
* Vehicles
* Debris
* Environmental objects
* Lighting
* Shadows
* Objective markers
* Mission locations

⸻

👁️ FIRST-PERSON CAMERA

Ang camera ay nasa perspective mismo ng player.

Ang player ay hindi tumitingin sa buong mapa mula sa itaas.

Sa halip, makikita niya ang:

        PLAYER VIEW
      3D BUILDING
           │
           │
     ───── STREET ─────
           │
       OBJECTIVE
           ★
           │
      DISTRICT AREA

Ang layunin ay maramdaman na parang ikaw mismo ang nasa loob ng district.

⸻

🚶 PLAYABLE MOVEMENT

Maaaring maglakad ang player sa loob ng 3D district.

Ang player ay maaaring:

* Lumakad pasulong
* Lumakad paatras
* Kumaliwa
* Kumanan
* Tumingin sa paligid
* Lumapit sa buildings
* Pumunta sa objectives
* Mag-explore
* Makipag-interact sa mission objects

⸻

📱 MOBILE / iPAD CONTROLS

Ang laro ay playable sa mobile at iPad gamit ang touch controls.

Virtual Joystick

Ginagamit para sa movement.

        ↑
     ←  ●  →
        ↓

Camera Look

Swipe/touch gesture para tumingin sa paligid.

Interaction

Kapag malapit na sa objective:

┌───────────────────┐
│      INTERACT     │
└───────────────────┘

⸻

🖥️ DESKTOP CONTROLS

Movement

W = Forward
A = Left
S = Backward
D = Right

Camera

Mouse movement para sa first-person camera.

⸻

🎯 OBJECTIVE SYSTEM

Ang objective ay nasa mismong 3D world.

Hindi lamang ito icon sa isang flat map.

Mission 01 Example

START
        ★
EVACUATION CENTER
       74m

Makikita ng player ang objective sa harapan habang naglalakad sa district.

⸻

📍 OBJECTIVE DISTANCE

Awtomatikong nagbabago ang distance habang lumalapit ang player.

Halimbawa:

74m
 ↓
50m
 ↓
24m
 ↓
10m
 ↓
3m

Kapag nasa interaction range na:

★ EVACUATION CENTER
        3m
   [ INTERACT ]

⸻

🤝 INTERACTION SYSTEM

Kapag nasa tamang distance ang player mula sa objective o interactive object, lalabas ang:

[ INTERACT ]

Kapag pinindot:

3D GAMEPLAY
     ↓
INTERACT
     ↓
MISSION EVENT
     ↓
DIALOGUE
     ↓
CHOICE
     ↓
CONSEQUENCE

⸻

🎭 MISSION / DIALOGUE / CHOICE SYSTEM

Pagkatapos ng interaction, maaaring lumabas ang isang mission event.

Halimbawa

MISSION EVENT
May mga taong nangangailangan ng tulong
sa evacuation center.
Ano ang iyong gagawin?
[ TUMULONG ]
[ MAGHANAP NG EBIDENSYA ]
[ UMALIS ]

Ang mga desisyon ng player ay maaaring makaapekto sa progression ng mission at kuwento.

⸻

⏱️ WALANG MISSION TIMER

Walang countdown timer.

Hindi kailangang madaliin ang player.

Maaaring:

* Mag-explore
* Maglakad
* Maghanap ng objectives
* Magbasa ng dialogue
* Magdesisyon
* Bumalik sa ibang bahagi ng district

⸻

🌊 MISSION THEMES

Maaaring harapin ng player ang iba’t ibang problema at misteryo.

Kabilang dito ang:

* Baha
* Lindol
* Kurapsyon
* Pang-aalipin
* Kapangyarihan
* Misteryo
* Kaunlaran
* Demokrasya
* Hustisya
* Paninindigan

⸻

🎬 MISSION FLOW

LOBBY
  │
  ▼
CHARACTER SELECTION
  │
  ▼
DOSSIER
  │
  ▼
READY
  │
  ▼
START
  │
  ▼
FIRST-PERSON 3D DISTRICT
  │
  ▼
EXPLORE
  │
  ▼
FIND OBJECTIVE
  │
  ▼
WALK TO OBJECTIVE
  │
  ▼
INTERACT
  │
  ▼
MISSION EVENT
  │
  ▼
DIALOGUE
  │
  ▼
CHOICE
  │
  ▼
CONSEQUENCE
  │
  ▼
MISSION PROGRESSION

⸻

🔙 BACK SYSTEM

May functional na:

← BACK

Ang BACK button ay hindi decorative lamang.

Kapag pinindot:

3D MISSION
     ↓
← BACK
     ↓
MISSION / LOBBY

Babalik ang player sa tamang Mission/Lobby screen nang hindi kinakailangang i-refresh ang buong application.

⸻

💾 SAVE SYSTEM

Maaaring i-save ang progression ng player.

Kasama rito ang:

* Player name
* Selected character
* Mission progress
* Completed objectives
* Choices
* Game state

Para sa local version, maaaring gamitin ang browser local storage.

⸻

🏗️ 3D ENVIRONMENT

Ang district ay binubuo bilang isang tunay na 3D environment.

Kasama sa environment ang:

* Buildings na may lalim at taas
* Roads
* Ground
* Walls
* Sidewalks
* Street poles
* Vehicles
* Debris
* Props
* Mission objects
* Lighting
* Shadows
* Atmospheric elements

Ang camera ay nasa loob ng environment at gumagalaw kasama ng player.

⸻

🔺 CORE GAME EXPERIENCE

Ang TATSULOK ay pinagsasama ang:

CHARACTER
    +
FACTION
    +
EXPLORATION
    +
MYSTERY
    +
MISSION
    +
DIALOGUE
    +
CHOICE
    +
CONSEQUENCE

Hindi lamang kailangang malaman ng player kung sino ang malakas.

Kailangan niyang tuklasin:

Sino ang tunay na kumokontrol?

Ano ang tunay na misteryo?

Ano ang kapalit ng bawat desisyon?

⸻

🛠️ TECHNOLOGY

Ang project ay gumagamit ng:

* React
* Vite
* JavaScript
* CSS
* Three.js
* WebGL
* HTML/CSS HUD
* Responsive Touch Controls

3D Rendering

Ang Three.js/WebGL ang ginagamit para sa playable 3D district.

Interface

Ang HTML/CSS at React ang ginagamit para sa:

* Lobby
* Character Selection
* Dossier
* Factions
* HUD
* Mission panels
* Dialogue
* Choice buttons
* INTERACT button
* BACK button
* Mobile controls

⸻

📁 PROJECT STRUCTURE

TATSULOK/
│
├── README.md
├── package.json
├── vite.config.js
├── index.html
│
├── public/
│   └── assets/
│       ├── character-01.jpg
│       ├── character-02.jpg
│       ├── character-03.jpg
│       ├── character-04.jpg
│       ├── character-05.jpg
│       ├── character-06.jpg
│       ├── character-07.jpg
│       ├── character-08.jpg
│       ├── character-09.jpg
│       ├── character-10.jpg
│       ├── character-11.jpg
│       └── tatsulok-reference.jpg
│
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    │
    └── game/
        ├── District3D.jsx
        ├── PlayerController.jsx
        ├── MissionSystem.js
        └── characters.js

⸻

⚠️ IMPORTANT ASSETS

Ang existing 11 character images ay bahagi ng TATSULOK project.

Huwag tanggalin o burahin ang:

character-01.jpg
character-02.jpg
character-03.jpg
character-04.jpg
character-05.jpg
character-06.jpg
character-07.jpg
character-08.jpg
character-09.jpg
character-10.jpg
character-11.jpg

Gayundin ang:

tatsulok-reference.jpg

Ang mga existing assets ay mananatili habang ina-update ang lobby, character, dossier, faction, mission, at 3D gameplay systems.

⸻

🚀 DEVELOPMENT

Install dependencies:

npm install

Run the development server:

npm run dev

Build the production version:

npm run build

Preview the production build:

npm run preview

⸻

🌐 RENDER DEPLOYMENT

Ang TATSULOK ay maaaring i-deploy bilang Static Site sa Render.

Build Command

npm run build

Publish Directory

dist

Deployment Flow

GITHUB
   ↓
RENDER
   ↓
npm install
   ↓
npm run build
   ↓
dist
   ↓
LIVE TATSULOK WEB APP

Ang project ay dapat manatiling compatible sa Vite production build.

⸻

🌐 OTHER DEPLOYMENT OPTIONS

Maaari rin itong i-deploy sa:

* Vercel
* Netlify
* GitHub Pages
* Iba pang Vite-compatible hosting

⸻

🎮 FINAL GAME FLOW

                         🔺 TATSULOK
                              │
                              ▼
                            LOBBY
                              │
                              ▼
                       ENTER YOUR NAME
                              │
                              ▼
                     CHARACTER SELECTION
                              │
                              ▼
                           DOSSIER
                              │
                              ▼
                            READY
                              │
                              ▼
                            START
                              │
                              ▼
                  FIRST-PERSON 3D DISTRICT
                              │
                              ▼
                          EXPLORE
                              │
                              ▼
                       FIND OBJECTIVE
                              │
                              ▼
                      WALK TO OBJECTIVE
                              │
                              ▼
                           INTERACT
                              │
                              ▼
                       MISSION EVENT
                              │
                              ▼
                         DIALOGUE
                              │
                              ▼
                           CHOICE
                              │
                              ▼
                        CONSEQUENCE
                              │
                              ▼
                   MISSION PROGRESSION
                              │
                              ▼
                         SAVE GAME

⸻

🔺 TATSULOK

START. READY. HARAPIN ANG MISYON.

Ang Tatsulok ay hindi lang laban ng lakas — laban din ito ng paninindigan.

⸻

STATUS

Development / Interactive Prototype

Core Features

* First-person 3D district
* True 3D environment
* 3D buildings and streets
* Ground and walls
* Environmental objects
* Lighting and shadows
* Player movement
* Mobile/iPad virtual joystick
* Touch camera controls
* Desktop WASD controls
* Mouse camera controls
* Objective markers
* Dynamic objective distance
* Interaction range
* INTERACT button
* Mission system
* Dialogue system
* Choice system
* Character selection
* Dossier system
* Faction system
* Lobby system
* Save progression
* Functional BACK navigation
* Render deployment support

Iyan na ang **isang copy-paste lang** na `README.md`.
