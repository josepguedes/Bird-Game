# Bird Game 3D 🦅

A high-performance, frame-rate independent 3D browser game built with Three.js. Control a bird flying through dynamic biomes, complete progressive flight objectives, manage wing stamina, collect golden feathers and energy shield power-ups, avoid hazardous obstacles & stunt airplanes, and set new high scores!

## 🚀 Key Features & Enhancements

- 🎯 **Dynamic Objectives System**: Active in-game mission tracker (`#objectiveCard`) featuring sequential flight goals (e.g. *Collector Aprendiz*, *Voo de Sobrevivência*, *Escudo Protótipo*, *Deserto Solar*...). Unlocks celebratory fanfare chimes, bonus points (+100 to +500 PTS), and stamina refills upon completion!
- ⚡ **Wings Stamina & Energy Gauge**: Tactical boost management with a visual bottom-center energy bar. Impulses consume stamina, which regenerates naturally over time and recharges when picking up golden feathers and shield orbs.
- 👁️ **Ultra High-Contrast UI Visibility**: Redesigned dark glassmorphic cards with opaque backings (`rgba(10, 16, 28, 0.90)`), bright neon borders, text shadow legibility filters (`text-shadow`), color-coded status badges, and enhanced contrast across all daylight, sunset, arctic, and night biomes.
- 📏 **Flight Vector Reticle & Altitude Ruler**: Vertical height gauge on the screen edge and a floating flight target reticle for precision flying and aiming at collectible clusters.
- 🛡️ **Energy Shield Power-Ups**: Collect floating blue energy orbs to equip a 3D wireframe shield bubble around the bird. Absorbs 1 fatal obstacle or stunt airplane crash!
- ⚡ **Combo Multiplier System**: Collect golden feathers in rapid succession (< 3s) to build up combo multipliers (`x2`, `x3`, `x4`...) with ascending sound chimes and bonus points!
- 💨 **Flap Boost Ability & Dual Controls**: Control flight altitude using either **Mouse Vertical Steering** or **Keyboard** (`W`/`S` or `Up`/`Down` Arrow keys). Press `Spacebar` or `Click` to trigger an active Flap Boost with wind particle bursts.
- ⏸️ **Pause & Resume System**: Press `ESC` or `P` or click the HUD pause button to pause the flight at any time.
- ⏱️ **Monitor Hz Frame-Rate Independence**: Movement, physics, lerping, and difficulty scaling are standardized across all monitor refresh rates (60Hz, 120Hz, 144Hz, 240Hz+) using `THREE.Clock` delta timing.
- 🔊 **Synthesized Web Audio Engine**: Zero-dependency Web Audio API sound engine for wing flap swooshes, feather pickup chimes, objective completion fanfare, shield activation/shatter FX, crash thuds, and UI button sounds.
- 🌍 **Dynamic Biomes**: Procedural environmental transitions between *Floresta Lush*, *Deserto do Pôr-do-Sol*, *Glaciar Ártico*, and *Noite Cósmica*.

## 🕹️ Controls

- **Vertical Steering**: Mouse movement OR `W` / `S` / `Up` / `Down` Arrow keys
- **Flap Boost**: `Spacebar` OR Left Mouse Click (consumes Wings Stamina)
- **Pause Game**: `ESC` OR `P` key OR Pause button in HUD
- **Sound Toggle**: Speaker icon button in Top HUD

## 🛠️ Running Locally

Run any local web server in the project directory:

```bash
# Option 1: Node.js (Built-in server)
node -e "const http = require('http'), fs = require('fs'), path = require('path'); http.createServer((req, res) => { let p = '.' + req.url; if (p === './') p = './index.html'; fs.readFile(p, (e, c) => res.end(c)); }).listen(8000);"

# Option 2: Python
python -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

## 📁 Project Structure

```
Bird-Game/
├── index.html    # Game UI layout, HUD elements, CSS styles, glassmorphic modals & objectives panel
├── main.js       # Core 3D engine, frame-rate fix, audio synthesizer, objectives engine & physics
└── README.md     # Documentation and guide
```
