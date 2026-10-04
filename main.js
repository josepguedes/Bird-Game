import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- WEBAUDIO SOUND SYSTEM ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('birdGame_muted') === 'true';
        this.updateUI();
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('birdGame_muted', this.muted);
        this.updateUI();
        if (!this.muted) {
            this.playCollectSound();
        }
    }

    updateUI() {
        const svg = document.getElementById('soundIconSvg');
        if (svg) {
            if (this.muted) {
                svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
            } else {
                svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
            }
        }
    }

    playTone(freq, type, duration, startVol = 0.1, endVol = 0) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    playFlapSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.14);
        } catch (e) {}
    }

    playCollectSound(comboMultiplier = 1) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const pitchShift = 1 + (comboMultiplier - 1) * 0.12;
            const baseFreqs = [523.25, 659.25, 783.99, 1046.50];
            
            baseFreqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const startTime = now + idx * 0.045;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq * pitchShift, startTime);

                gain.gain.setValueAtTime(0.12, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.12);
            });
        } catch (e) {}
    }

    playShieldSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {}
    }

    playShieldBreakSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    }

    playHitSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {}
    }

    playButtonClick() {
        this.playTone(600, 'sine', 0.05, 0.09, 0.001);
    }

    playObjectiveCompleteSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const startTime = now + idx * 0.065;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.16, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.18);
            });
        } catch (e) {}
    }
}

const soundEngine = new SoundEngine();

// --- DYNAMIC BIOMES CONFIGURATION ---
// --- DYNAMIC BIOMES CONFIGURATION ---
const BIOMES = [
    {
        name: "Lush Forest",
        minScore: 0,
        skyColor: new THREE.Color(0x7dd3fc),
        fogColor: new THREE.Color(0xbae6fd),
        groundColor: new THREE.Color(0x22c55e),
        sunColor: new THREE.Color(0xfff5d6),
        ambientColor: new THREE.Color(0xfffbe8)
    },
    {
        name: "Sunset Desert",
        minScore: 180, // Reached after ~1.5 to 2 minutes of active flight
        skyColor: new THREE.Color(0xf97316),
        fogColor: new THREE.Color(0xfdba74),
        groundColor: new THREE.Color(0x854d0e),
        sunColor: new THREE.Color(0xfde047),
        ambientColor: new THREE.Color(0xfef08a)
    },
    {
        name: "Arctic Glacier",
        minScore: 450, // Reached after ~3.5 to 4.5 minutes
        skyColor: new THREE.Color(0x0284c7),
        fogColor: new THREE.Color(0xe0f2fe),
        groundColor: new THREE.Color(0xf1f5f9),
        sunColor: new THREE.Color(0xe0f2fe),
        ambientColor: new THREE.Color(0xf0f9ff)
    },
    {
        name: "Cosmic Night",
        minScore: 850, // Reached after ~6+ minutes of master flight
        skyColor: new THREE.Color(0x0f172a),
        fogColor: new THREE.Color(0x1e1b4b),
        groundColor: new THREE.Color(0x312e81),
        sunColor: new THREE.Color(0xa855f7),
        ambientColor: new THREE.Color(0x6366f1)
    }
];

let currentBiomeIndex = 0;

// --- ENVIRONMENT & SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = BIOMES[0].skyColor.clone();
scene.fog = new THREE.FogExp2(BIOMES[0].fogColor.getHex(), 0.012);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls disabled so mouse clicks NEVER alter the flight camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

// --- STATE MANAGEMENT ---
const birdMovement = {
    baseY: 0,
    targetY: 0,
    velocityY: 0
};

let gameStarted = false;
let isGameOver = false;
let isPaused = false;
let gameSpeed = 1.0;
let gameBoost = 0;
const SPEED_INCREASE_RATE = 0.08;
const BASE_MOVEMENT_SPEED = 0.12;

let gameTime = 0;
let distanceTraveled = 0;
let currentScore = 0;
let bonusScore = 0;
let timerInterval = null;
let feathersCollected = 0;
let hasShield = false;
let comboCount = 0;
let maxCombo = 1;
let lastFeatherTime = 0;
let highScore = parseInt(localStorage.getItem('birdGame_highScore') || '0', 10);

// Stamina & Energy System
let stamina = 100;
const MAX_STAMINA = 100;
const STAMINA_REGEN_RATE = 14; // per second
const BOOST_STAMINA_COST = 25;

// Dynamic Objectives System
const OBJECTIVES_LIST = [
    { id: 1, title: "Apprentice Collector", desc: "Collect 3 Golden Feathers", target: 3, type: "feathers", rewardPts: 30 },
    { id: 2, title: "Survival Flight", desc: "Survive for 25 Seconds", target: 25, type: "time", rewardPts: 40 },
    { id: 3, title: "Combo Master", desc: "Reach a x2 Combo", target: 2, type: "combo", rewardPts: 45 },
    { id: 4, title: "Prototype Shield", desc: "Collect 1 Blue Shield Orb", target: 1, type: "shields", rewardPts: 50 },
    { id: 5, title: "Avid Aviator", desc: "Reach 100 Points", target: 100, type: "score", rewardPts: 60 },
    { id: 6, title: "Solar Desert", desc: "Reach 180 Points (Desert Biome)", target: 180, type: "score", rewardPts: 100 },
    { id: 7, title: "Elite Collector", desc: "Collect 8 Golden Feathers", target: 8, type: "feathers", rewardPts: 80 },
    { id: 8, title: "Sky Ace", desc: "Reach 450 Points (Glacier Biome)", target: 450, type: "score", rewardPts: 150 }
];

let currentObjectiveIndex = 0;
let objectivesCompletedCount = 0;
let totalFlapsPerformed = 0;
let totalShieldsCollected = 0;

// High Precision Game Timer (replacing deprecated THREE.Clock)
class GameTimer {
    constructor() {
        this.startTime = performance.now();
        this.lastTime = performance.now();
    }
    getDelta() {
        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;
        return delta;
    }
    getElapsedTime() {
        return (performance.now() - this.startTime) / 1000;
    }
}
const clock = new GameTimer();

// UI & Modal Elements
const hudScoreEl = document.getElementById('scoreVal');
const hudBiomeEl = document.getElementById('biomeVal');
const hudHighScoreEl = document.getElementById('highScoreVal');
const hudFeathersEl = document.getElementById('feathersVal');
const hudSpeedEl = document.getElementById('speedVal');
const hudTimerEl = document.getElementById('timerVal');
const shieldBadgeEl = document.getElementById('shieldBadge');
const comboBannerEl = document.getElementById('comboBanner');
const pausePopupEl = document.getElementById('pausePopup');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeButton');
const restartPauseBtn = document.getElementById('restartPauseButton');
const gameOverPopupEl = document.getElementById('gameOverPopup');
const retryBtn = document.getElementById('retryButton');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const biomeToastEl = document.getElementById('biomeToast');
const biomeToastNameEl = document.getElementById('biomeToastName');

// Main Menu, Shop & Credits Elements
const mainMenuModalEl = document.getElementById('mainMenuModal');
const shopModalEl = document.getElementById('shopModal');
const creditsModalEl = document.getElementById('creditsModal');
const playBtn = document.getElementById('playBtn');
const openShopBtn = document.getElementById('openShopBtn');
const closeShopBtn = document.getElementById('closeShopBtn');
const openCreditsBtn = document.getElementById('openCreditsBtn');
const closeCreditsBtn = document.getElementById('closeCreditsBtn');
const mainMenuPauseBtn = document.getElementById('mainMenuPauseBtn');
const mainMenuGameOverBtn = document.getElementById('mainMenuGameOverBtn');

// New Objective & Gauge Elements
const objTitleEl = document.getElementById('objTitle');
const objProgressBarEl = document.getElementById('objProgressBar');
const objProgressValEl = document.getElementById('objProgressVal');
const objRewardPillEl = document.getElementById('objRewardPill');
const objectiveToastEl = document.getElementById('objectiveToast');
const objToastMsgEl = document.getElementById('objToastMsg');
const altitudeIndicatorEl = document.getElementById('altitudeIndicator');
const flightReticleEl = document.getElementById('flightReticle');
const finalObjectivesEl = document.getElementById('finalObjectives');

hudHighScoreEl.textContent = highScore;

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(BIOMES[0].ambientColor.getHex(), 0.75);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(BIOMES[0].sunColor.getHex(), 1.25);
sunLight.position.set(25, 30, 20);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -30;
sunLight.shadow.camera.right = 30;
sunLight.shadow.camera.top = 30;
sunLight.shadow.camera.bottom = -30;
scene.add(sunLight);

// Sun Mesh
const sunGeo = new THREE.SphereGeometry(3.2, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(-22, 18, -25);
scene.add(sun);

// Dedicated Studio Lighting for 3D Bird Showroom
const showroomLight = new THREE.DirectionalLight(0xffffff, 0);
showroomLight.position.set(-2, 4, 5);
scene.add(showroomLight);

// 3D Pedestal Platform for Showroom Mode
const pedestalGroup = new THREE.Group();
const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.2, 32);
const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8 });
const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);

const ringGeo = new THREE.TorusGeometry(1.22, 0.035, 16, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
const ringMesh = new THREE.Mesh(ringGeo, ringMat);
ringMesh.rotation.x = Math.PI / 2;
ringMesh.position.y = 0.11;

pedestalGroup.add(pedestalMesh);
pedestalGroup.add(ringMesh);
pedestalGroup.position.set(-3.5, -0.65, 0);
pedestalGroup.visible = false;
scene.add(pedestalGroup);

// --- ENVIRONMENT PROPS ---
function createMountainRange() {
    const group = new THREE.Group();
    for (let i = 0; i < 10; i++) {
        const height = Math.random() * 6 + 6;
        const radius = Math.random() * 4 + 4;
        const geo = new THREE.ConeGeometry(radius, height, 5);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x475569,
            roughness: 0.9,
            flatShading: true
        });
        const mtn = new THREE.Mesh(geo, mat);
        mtn.position.set(i * 9 - 40, height / 2 - 5, -25 - Math.random() * 5);
        group.add(mtn);

        const capGeo = new THREE.ConeGeometry(radius * 0.4, height * 0.4, 5);
        const capMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(i * 9 - 40, height - (height * 0.2) - 5, -25 - Math.random() * 5);
        group.add(cap);
    }
    return group;
}
scene.add(createMountainRange());

function createCloud() {
    const cloudGroup = new THREE.Group();
    const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        transparent: true,
        opacity: 0.85
    });

    const sphereCount = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < sphereCount; i++) {
        const radius = Math.random() * 0.8 + 0.6;
        const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
        const sphere = new THREE.Mesh(sphereGeo, cloudMaterial);
        sphere.position.set(
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 0.9,
            (Math.random() - 0.5) * 1.5
        );
        cloudGroup.add(sphere);
    }
    return cloudGroup;
}

const clouds = [];
const CLOUD_COUNT = 25;
for (let i = 0; i < CLOUD_COUNT; i++) {
    const cloud = createCloud();
    cloud.position.set(
        (Math.random() * 90) - 20,
        Math.random() * 6 + 5,
        (Math.random() - 0.5) * 20
    );
    scene.add(cloud);
    clouds.push(cloud);
}

// Rolling Ground Mesh
const groundGeo = new THREE.PlaneGeometry(120, 35, 60, 20);
const posAttr = groundGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    posAttr.setZ(i, Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.8);
}
groundGeo.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
    color: BIOMES[0].groundColor.getHex(),
    roughness: 0.8,
    flatShading: true
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -5.5, 0);
ground.receiveShadow = true;
scene.add(ground);

function createPineTree() {
    const group = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, 1.6, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    trunk.position.set(0, 0.8, 0);
    group.add(trunk);

    for (let i = 0; i < 3; i++) {
        const foliageGeo = new THREE.ConeGeometry(1.2 - i * 0.25, 1.4, 7);
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, flatShading: true });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.castShadow = true;
        foliage.position.set(0, 1.8 + i * 0.8, 0);
        group.add(foliage);
    }

    group.position.set(
        (Math.random() - 0.5) * 80,
        -5.5,
        Math.max((Math.random() - 0.5) * 16, -4)
    );
    return group;
}

const trees = [];
for (let i = 0; i < 18; i++) {
    const tree = createPineTree();
    scene.add(tree);
    trees.push(tree);
}

function createBoulder() {
    const radius = Math.random() * 0.6 + 0.4;
    const geo = new THREE.DodecahedronGeometry(radius, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9, flatShading: true });
    const rock = new THREE.Mesh(geo, mat);
    rock.castShadow = true;
    rock.receiveShadow = true;
    rock.position.set(
        (Math.random() - 0.5) * 80,
        -5.2,
        Math.max((Math.random() - 0.5) * 16, -4)
    );
    return rock;
}

const rocks = [];
for (let i = 0; i < 14; i++) {
    const r = createBoulder();
    scene.add(r);
    rocks.push(r);
}

camera.position.set(0, 1, 10);
camera.lookAt(0, 0, 0);

// --- OBSTACLES & PROCEDURAL GENERATION ---
const obstacles = [];
const OBSTACLE_COUNT = 7;
const OBSTACLE_SPACING = 24;
let lastObstacleY = 0;
const MIN_HEIGHT = -3.0;
const MAX_HEIGHT = 3.0;

function createNaturalObstacle(typeIndex) {
    const group = new THREE.Group();
    
    if (typeIndex % 2 === 0) {
        const geo = new THREE.DodecahedronGeometry(0.7, 1);
        const mat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, flatShading: true });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        group.add(mesh);

        const mossGeo = new THREE.SphereGeometry(0.5, 12, 12);
        const mossMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 });
        const moss = new THREE.Mesh(mossGeo, mossMat);
        moss.position.set(0, 0.4, 0);
        group.add(moss);
    } else {
        const logGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.4, 8);
        const logMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, flatShading: true });
        const log = new THREE.Mesh(logGeo, logMat);
        log.rotation.z = Math.PI / 4;
        log.castShadow = true;
        group.add(log);

        for (let b = 0; b < 3; b++) {
            const branch = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 5), logMat);
            branch.position.set((b - 1) * 0.4, 0.3, 0);
            branch.rotation.z = (b - 1) * 0.5;
            group.add(branch);
        }
    }

    return group;
}

function getBalancedYPosition() {
    const maxDeviation = 2.4;
    const randomFactor = Math.random() * 2 - 1;
    const newY = lastObstacleY + (randomFactor * maxDeviation);
    const clampedY = Math.max(MIN_HEIGHT + 0.4, Math.min(MAX_HEIGHT - 0.4, newY));
    lastObstacleY = Math.random() < 0.25 ? (Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT) : clampedY;
    return lastObstacleY;
}

for (let i = 0; i < OBSTACLE_COUNT; i++) {
    const obstacle = createNaturalObstacle(i);
    const y = getBalancedYPosition();
    obstacle.position.set(i * OBSTACLE_SPACING + 22, y, 0);
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// --- STUNT AIRPLANE HAZARD ---
function createAirplane() {
    const group = new THREE.Group();

    const fuselageGeo = new THREE.CylinderGeometry(0.24, 0.16, 2.3, 16);
    const fuselageMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.castShadow = true;
    group.add(fuselage);

    const cockpitGeo = new THREE.SphereGeometry(0.22, 16, 12);
    const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, roughness: 0.1, metalness: 0.9 });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.scale.set(1.4, 0.8, 0.8);
    cockpit.position.set(-0.25, 0.2, 0);
    group.add(cockpit);

    const noseGeo = new THREE.ConeGeometry(0.24, 0.5, 16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(-1.4, 0, 0);
    group.add(nose);

    const propGroup = new THREE.Group();
    const propHubGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const propHubMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9 });
    propGroup.add(new THREE.Mesh(propHubGeo, propHubMat));

    for (let p = 0; p < 2; p++) {
        const bladeGeo = new THREE.BoxGeometry(0.04, 0.95, 0.12);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.x = p * Math.PI / 2;
        propGroup.add(blade);
    }
    propGroup.name = "propeller";
    propGroup.position.set(-1.65, 0, 0);
    group.add(propGroup);

    const wingGeo = new THREE.BoxGeometry(0.6, 0.04, 2.7);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(-0.3, 0.05, 0);
    wings.castShadow = true;
    group.add(wings);

    for (let s = -1; s <= 1; s += 2) {
        const podGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.7, 8);
        const podMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8 });
        const pod = new THREE.Mesh(podGeo, podMat);
        pod.rotation.z = Math.PI / 2;
        pod.position.set(-0.3, 0.05, s * 1.35);
        group.add(pod);
    }

    const tailFinGeo = new THREE.BoxGeometry(0.42, 0.65, 0.04);
    const tailFinMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.7 });
    const tailFin = new THREE.Mesh(tailFinGeo, tailFinMat);
    tailFin.position.set(0.85, 0.35, 0);
    tailFin.rotation.z = -0.3;
    group.add(tailFin);

    const tailWingGeo = new THREE.BoxGeometry(0.32, 0.03, 1.0);
    const tailWings = new THREE.Mesh(tailWingGeo, wingMat);
    tailWings.position.set(0.85, 0.05, 0);
    group.add(tailWings);

    return group;
}

const airplanes = [];
const AIRPLANE_COUNT = 2;
for (let i = 0; i < AIRPLANE_COUNT; i++) {
    const airplane = createAirplane();
    airplane.position.set(999, 0, 0);
    scene.add(airplane);
    airplanes.push(airplane);
}

// --- COLLECTIBLES (GOLDEN FEATHERS & SHIELD ORBS) ---
const feathers = [];
const FEATHER_COUNT = 4;

function createGoldenFeather() {
    const group = new THREE.Group();
    const geo = new THREE.IcosahedronGeometry(0.32, 0);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.9,
        flatShading: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);
    return group;
}

for (let i = 0; i < FEATHER_COUNT; i++) {
    const feather = createGoldenFeather();
    const targetX = 22 + i * OBSTACLE_SPACING + (OBSTACLE_SPACING / 2);
    feather.position.set(targetX, getBalancedYPosition(), 0);
    scene.add(feather);
    feathers.push(feather);
}

// Shield Orb Collectibles
const shields = [];
const SHIELD_COUNT = 2;

function createShieldOrb() {
    const group = new THREE.Group();
    const geo = new THREE.OctahedronGeometry(0.38, 0);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
        flatShading: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);
    return group;
}

for (let i = 0; i < SHIELD_COUNT; i++) {
    const shieldOrb = createShieldOrb();
    shieldOrb.position.set(999, 0, 0); // Spawns dynamically
    scene.add(shieldOrb);
    shields.push(shieldOrb);
}

// Particle System FX
const particleGeo = new THREE.BufferGeometry();
const PARTICLE_MAX = 100;
const particlePositions = new Float32Array(PARTICLE_MAX * 3);
const particleColors = new Float32Array(PARTICLE_MAX * 3);
const particleVelocities = [];

for (let i = 0; i < PARTICLE_MAX; i++) {
    particlePositions[i * 3] = 999;
    particlePositions[i * 3 + 1] = 999;
    particlePositions[i * 3 + 2] = 999;

    particleColors[i * 3] = 0.98;
    particleColors[i * 3 + 1] = 0.75;
    particleColors[i * 3 + 2] = 0.14;

    particleVelocities.push(new THREE.Vector3());
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.95
});
const particleSystem = new THREE.Points(particleGeo, particleMat);
scene.add(particleSystem);

function triggerParticleBurst(pos, isBlue = false) {
    for (let i = 0; i < 24; i++) {
        const idx = Math.floor(Math.random() * PARTICLE_MAX);
        particlePositions[idx * 3] = pos.x;
        particlePositions[idx * 3 + 1] = pos.y;
        particlePositions[idx * 3 + 2] = pos.z;

        if (isBlue) {
            particleColors[idx * 3] = 0.22;
            particleColors[idx * 3 + 1] = 0.74;
            particleColors[idx * 3 + 2] = 0.97;
        } else {
            particleColors[idx * 3] = 0.98;
            particleColors[idx * 3 + 1] = 0.75;
            particleColors[idx * 3 + 2] = 0.14;
        }

        particleVelocities[idx].set(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
        );
    }
    particleGeo.attributes.position.needsUpdate = true;
    particleGeo.attributes.color.needsUpdate = true;
}

function emitSkinParticle(effectType) {
    // Continuous tail particle trail disabled to keep bird flight clean and free of tail artifacts
    return;
}

// --- SLEEK ORGANIC 3D BIRD MODEL ---
const birdGroup = new THREE.Group();

const birdPrimaryMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.2, flatShading: true });
const birdBellyMat = new THREE.MeshStandardMaterial({ color: 0xfff8e7, roughness: 0.5, flatShading: true });
const birdGoldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.35, roughness: 0.2, metalness: 0.8, flatShading: true });
const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.85, flatShading: true });
const eyeIrisMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Torso
const bodyGeo = new THREE.SphereGeometry(0.55, 24, 16);
const bodyMesh = new THREE.Mesh(bodyGeo, birdPrimaryMat);
bodyMesh.scale.set(1.5, 0.95, 0.85);
bodyMesh.castShadow = true;
birdGroup.add(bodyMesh);

// Belly
const bellyGeo = new THREE.SphereGeometry(0.48, 20, 16);
const bellyMesh = new THREE.Mesh(bellyGeo, birdBellyMat);
bellyMesh.scale.set(1.2, 0.8, 0.78);
bellyMesh.position.set(0.15, -0.12, 0);
birdGroup.add(bellyMesh);

// Head
const headGeo = new THREE.SphereGeometry(0.4, 24, 16);
const headMesh = new THREE.Mesh(headGeo, birdPrimaryMat);
headMesh.scale.set(1.05, 0.98, 0.95);
headMesh.position.set(0.55, 0.22, 0);
headMesh.castShadow = true;
birdGroup.add(headMesh);

// Crown Crest
const crestGroup = new THREE.Group();
for (let i = 0; i < 3; i++) {
    const featherGeo = new THREE.ConeGeometry(0.07, 0.45, 5);
    const feather = new THREE.Mesh(featherGeo, birdGoldMat);
    feather.position.set(-i * 0.08, 0.15, (i - 1) * 0.06);
    feather.rotation.z = -0.6 - i * 0.1;
    crestGroup.add(feather);
}
crestGroup.position.set(0.5, 0.55, 0);
birdGroup.add(crestGroup);

// Beak
const beakGeo = new THREE.ConeGeometry(0.14, 0.5, 12);
const beakMesh = new THREE.Mesh(beakGeo, beakMat);
beakMesh.rotation.z = -Math.PI / 2;
beakMesh.position.set(0.98, 0.2, 0);
beakMesh.castShadow = true;
birdGroup.add(beakMesh);

// Eyes
function createEye(isRight) {
    const zSign = isRight ? 1 : -1;
    const eyeGroup = new THREE.Group();
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), eyeIrisMat);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), eyePupilMat);
    pupil.position.set(0.03, 0, zSign * 0.04);
    const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeHighlightMat);
    highlight.position.set(0.05, 0.04, zSign * 0.06);
    eyeGroup.add(iris);
    eyeGroup.add(pupil);
    eyeGroup.add(highlight);
    eyeGroup.position.set(0.72, 0.3, zSign * 0.32);
    return eyeGroup;
}
birdGroup.add(createEye(true));
birdGroup.add(createEye(false));

// Wings
function createMultiLayerWing(isRight) {
    const wingGroup = new THREE.Group();
    const zSign = isRight ? 1 : -1;

    const shoulderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), birdPrimaryMat);
    wingGroup.add(shoulderMesh);

    const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.035, 0.22), birdGoldMat);
    f1.position.set(-0.3, 0, zSign * 0.75);
    f1.rotation.y = -zSign * 0.35;
    f1.castShadow = true;
    wingGroup.add(f1);

    const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.038, 0.22), birdPrimaryMat);
    f2.position.set(-0.2, 0.005, zSign * 0.55);
    f2.rotation.y = -zSign * 0.25;
    f2.castShadow = true;
    wingGroup.add(f2);

    const f3 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.22), birdPrimaryMat);
    f3.position.set(-0.1, 0.01, zSign * 0.35);
    f3.rotation.y = -zSign * 0.15;
    f3.castShadow = true;
    wingGroup.add(f3);

    const f4 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.045, 0.25), birdBellyMat);
    f4.position.set(0.0, 0.015, zSign * 0.18);
    f4.rotation.y = -zSign * 0.05;
    f4.castShadow = true;
    wingGroup.add(f4);

    wingGroup.position.set(0.05, 0.1, zSign * 0.35);
    return wingGroup;
}

const rightWingGroup = createMultiLayerWing(true);
const leftWingGroup = createMultiLayerWing(false);
birdGroup.add(rightWingGroup);
birdGroup.add(leftWingGroup);

// Tail
const tailGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
    const angle = (i - 2) * 0.22;
    const length = 0.85 - Math.abs(i - 2) * 0.1;
    const tailFeather = new THREE.Mesh(new THREE.BoxGeometry(length, 0.03, 0.14), i % 2 === 0 ? birdGoldMat : birdPrimaryMat);
    tailFeather.position.set(-0.7 - Math.cos(angle) * 0.15, 0.05, Math.sin(angle) * 0.25);
    tailFeather.rotation.y = -angle;
    tailFeather.rotation.z = 0.15;
    tailFeather.castShadow = true;
    tailGroup.add(tailFeather);
}
birdGroup.add(tailGroup);

// 3D Protective Energy Shield Bubble around Bird
const birdShieldGeo = new THREE.IcosahedronGeometry(0.95, 2);
const birdShieldMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    wireframe: true,
    transparent: true,
    opacity: 0.0
});
const birdShieldMesh = new THREE.Mesh(birdShieldGeo, birdShieldMat);
birdGroup.add(birdShieldMesh);

birdGroup.position.set(-3.9, 0, 0);
scene.add(birdGroup);

// --- BIRD SKINS CATALOG & 3D SHOWROOM ENGINE ---
const SKINS = [
    {
        id: "blue_jay",
        name: "Blue Eagle",
        desc: "Classic cyan blue plumage with glowing gold crest.",
        cost: 0,
        primaryColor: 0x0284c7,
        bellyColor: 0xfff8e7,
        goldColor: 0xfbbf24,
        beakColor: 0xf59e0b,
        eyeIrisColor: 0x38bdf8,
        previewGradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
        effectType: null
    },
    {
        id: "phoenix",
        name: "Blazing Phoenix 🔥",
        desc: "Aerodynamic fiery red wings and radiant golden plumage.",
        cost: 300,
        primaryColor: 0xdc2626,
        bellyColor: 0xfef08a,
        goldColor: 0xf59e0b,
        beakColor: 0x7c2d12,
        eyeIrisColor: 0xfde047,
        previewGradient: "linear-gradient(135deg, #dc2626, #f59e0b)",
        effectType: null
    },
    {
        id: "cyber_hawk",
        name: "Cyber Neon ⚡",
        desc: "Futuristic cyber alloy finish with glowing cyan accents.",
        cost: 800,
        primaryColor: 0x1e1b4b,
        bellyColor: 0x38bdf8,
        goldColor: 0xc084fc,
        beakColor: 0xa855f7,
        eyeIrisColor: 0x22d3ee,
        previewGradient: "linear-gradient(135deg, #1e1b4b, #c084fc)",
        effectType: null
    },
    {
        id: "emerald_falcon",
        name: "Emerald Falcon 🌿",
        desc: "Polished emerald body with regal jade plumage.",
        cost: 1500,
        primaryColor: 0x047857,
        bellyColor: 0xd1fae5,
        goldColor: 0xfbbf24,
        beakColor: 0xd97706,
        eyeIrisColor: 0x34d399,
        previewGradient: "linear-gradient(135deg, #047857, #34d399)",
        effectType: null
    },
    {
        id: "shadow_raven",
        name: "Shadow Raven 🌑",
        desc: "Stealth obsidian black feathers with precision beak.",
        cost: 2800,
        primaryColor: 0x0f172a,
        bellyColor: 0x475569,
        goldColor: 0x818cf8,
        beakColor: 0x312e81,
        eyeIrisColor: 0x818cf8,
        previewGradient: "linear-gradient(135deg, #0f172a, #818cf8)",
        effectType: null
    },
    {
        id: "celestial_gold",
        name: "Celestial Gold 🌟",
        desc: "Legendary 24k solid gold bird with majestic metallic shine.",
        cost: 5000,
        primaryColor: 0xf59e0b,
        bellyColor: 0xfffbe8,
        goldColor: 0xfde047,
        beakColor: 0x78350f,
        eyeIrisColor: 0xfef08a,
        previewGradient: "linear-gradient(135deg, #f59e0b, #fde047)",
        effectType: null
    }
];

let bankedPoints = parseInt(localStorage.getItem('birdGame_bankedPoints') || '0', 10);
let unlockedSkins = JSON.parse(localStorage.getItem('birdGame_unlockedSkins') || '["blue_jay"]');
let equippedSkinId = localStorage.getItem('birdGame_equippedSkin') || 'blue_jay';
let previewSkinId = equippedSkinId;
let isShopShowroomActive = false;

function saveShopState() {
    localStorage.setItem('birdGame_bankedPoints', bankedPoints);
    localStorage.setItem('birdGame_unlockedSkins', JSON.stringify(unlockedSkins));
    localStorage.setItem('birdGame_equippedSkin', equippedSkinId);
    updateBankedPointsUI();
}

function updateBankedPointsUI() {
    const b1 = document.getElementById('bankedPointsVal');
    const b2 = document.getElementById('shopBankedPointsVal');
    const menuHigh = document.getElementById('menuHighScoreVal');
    if (b1) b1.textContent = `${bankedPoints} Pts`;
    if (b2) b2.textContent = `${bankedPoints} Pts`;
    if (menuHigh) menuHigh.textContent = highScore;
}

function setCameraMode(mode) {
    if (mode === "showroom") {
        isShopShowroomActive = true;
        scene.background = new THREE.Color(0x060a14);
        scene.fog.color.setHex(0x060a14);
        birdGroup.position.set(-3.5, 0.2, 0);
        camera.position.set(-2.2, 0.55, 2.4);
        camera.lookAt(-3.5, 0.2, 0);
        showroomLight.intensity = 2.4;
        pedestalGroup.visible = true;
    } else {
        isShopShowroomActive = false;
        isGameOver = false;
        isPaused = false;
        showroomLight.intensity = 0;
        pedestalGroup.visible = false;
        scene.background.copy(BIOMES[currentBiomeIndex].skyColor);
        scene.fog.color.copy(BIOMES[currentBiomeIndex].fogColor);
        camera.position.set(0, 1, 10);
        camera.lookAt(0, 0, 0);
        birdGroup.rotation.set(0, 0, 0);
        birdGroup.position.set(-3.9, 0, 0);
        birdMovement.baseY = 0;
        birdMovement.targetY = 0;
        birdMovement.velocityY = 0;

        // Clear all gameplay objects offscreen for a clean main menu attract mode
        if (typeof obstacles !== 'undefined' && obstacles) obstacles.forEach(o => o.position.set(999, 0, 0));
        if (typeof airplanes !== 'undefined' && airplanes) airplanes.forEach(a => a.position.set(999, 0, 0));
        if (typeof feathers !== 'undefined' && feathers) feathers.forEach(f => f.position.set(999, 0, 0));
        if (typeof shields !== 'undefined' && shields) shields.forEach(s => s.position.set(999, 0, 0));

        applySkin(equippedSkinId);
    }
}

function applySkinMaterials(skin) {
    birdPrimaryMat.color.setHex(skin.primaryColor);
    birdBellyMat.color.setHex(skin.bellyColor);
    birdGoldMat.color.setHex(skin.goldColor);
    beakMat.color.setHex(skin.beakColor);
    eyeIrisMat.color.setHex(skin.eyeIrisColor);
}

function applySkin(skinId) {
    const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
    applySkinMaterials(skin);
    equippedSkinId = skin.id;
    saveShopState();
}

function updatePreviewCard(skinId) {
    previewSkinId = skinId;
    const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
    applySkinMaterials(skin);

    const rarityEl = document.getElementById('previewRarity');
    const titleEl = document.getElementById('previewTitle');
    const descEl = document.getElementById('previewDesc');
    const actionBtn = document.getElementById('previewActionBtn');

    if (titleEl) titleEl.textContent = skin.name;
    if (descEl) descEl.textContent = skin.desc;

    const isUnlocked = unlockedSkins.includes(skin.id);
    const isEquipped = equippedSkinId === skin.id;

    if (rarityEl) {
        rarityEl.textContent = skin.cost === 0 ? "STARTER SKIN" : skin.cost >= 600 ? "LEGENDARY SKIN" : "RARE SKIN";
    }

    if (actionBtn) {
        if (isEquipped) {
            actionBtn.innerHTML = `<span>✓ EQUIPPED</span>`;
            actionBtn.className = "btn-primary btn-shop-active";
            actionBtn.onclick = null;
        } else if (isUnlocked) {
            actionBtn.innerHTML = `<span>EQUIP SKIN</span>`;
            actionBtn.className = "btn-primary";
            actionBtn.onclick = () => {
                soundEngine.playCollectSound();
                applySkin(skin.id);
                renderShopShowroom();
            };
        } else {
            const canAfford = bankedPoints >= skin.cost;
            actionBtn.innerHTML = `<span>BUY FOR ${skin.cost} PTS</span>`;
            actionBtn.className = `btn-primary ${canAfford ? 'btn-gold' : 'btn-secondary'}`;
            actionBtn.onclick = () => {
                if (bankedPoints >= skin.cost) {
                    bankedPoints -= skin.cost;
                    unlockedSkins.push(skin.id);
                    soundEngine.playObjectiveCompleteSound();
                    applySkin(skin.id);
                    renderShopShowroom();
                } else {
                    soundEngine.playTone(180, 'sawtooth', 0.15, 0.15, 0.001);
                }
            };
        }
    }
}

function renderShopShowroom() {
    const shopGrid = document.getElementById('shopGrid');
    if (!shopGrid) return;

    updateBankedPointsUI();
    shopGrid.innerHTML = '';

    SKINS.forEach(skin => {
        const isUnlocked = unlockedSkins.includes(skin.id);
        const isEquipped = equippedSkinId === skin.id;
        const isSelected = previewSkinId === skin.id;

        const card = document.createElement('div');
        card.className = `skin-card-row ${isSelected ? 'selected' : ''} ${isEquipped ? 'equipped' : ''}`;

        card.innerHTML = `
            <div class="skin-row-badge" style="background: ${skin.previewGradient}">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div class="skin-row-info">
                <div class="skin-row-title">${skin.name} ${isEquipped ? '✓' : ''}</div>
                <div class="skin-row-desc">${skin.desc}</div>
            </div>
            <div class="skin-row-price">${isEquipped ? 'Equipped' : isUnlocked ? 'Unlocked' : skin.cost + ' Pts'}</div>
        `;

        card.addEventListener('mouseenter', () => {
            updatePreviewCard(skin.id);
            renderShopShowroomSelection();
        });

        card.addEventListener('click', () => {
            soundEngine.playButtonClick();
            updatePreviewCard(skin.id);
            renderShopShowroomSelection();
        });

        shopGrid.appendChild(card);
    });

    updatePreviewCard(previewSkinId);
}

function renderShopShowroomSelection() {
    const rows = document.querySelectorAll('.skin-card-row');
    rows.forEach((row, idx) => {
        if (SKINS[idx] && SKINS[idx].id === previewSkinId) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });
}

// Initial skin application and banked points load
applySkin(equippedSkinId);
updateBankedPointsUI();
setCameraMode("attract");

// Keyboard state tracking
const keysPressed = {};

// Collision Radii
const BIRD_COLLISION_RADIUS = 0.52;
const OBSTACLE_COLLISION_RADIUS = 0.58;
const AIRPLANE_COLLISION_RADIUS = 0.75;
const FEATHER_COLLISION_RADIUS = 0.75;
const SHIELD_COLLISION_RADIUS = 0.75;

function checkObstacleCollision(obstacle) {
    const dx = birdGroup.position.x - obstacle.position.x;
    const dy = birdGroup.position.y - obstacle.position.y;
    const dz = birdGroup.position.z - obstacle.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const combinedRadius = BIRD_COLLISION_RADIUS + OBSTACLE_COLLISION_RADIUS;
    return distSq < (combinedRadius * combinedRadius);
}

function checkAirplaneCollision(airplane) {
    const dx = birdGroup.position.x - airplane.position.x;
    const dy = birdGroup.position.y - airplane.position.y;
    const dz = birdGroup.position.z - airplane.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const combinedRadius = BIRD_COLLISION_RADIUS + AIRPLANE_COLLISION_RADIUS;
    return distSq < (combinedRadius * combinedRadius);
}

function checkFeatherCollision(feather) {
    const dx = birdGroup.position.x - feather.position.x;
    const dy = birdGroup.position.y - feather.position.y;
    const dz = birdGroup.position.z - feather.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const combinedRadius = BIRD_COLLISION_RADIUS + FEATHER_COLLISION_RADIUS;
    return distSq < (combinedRadius * combinedRadius);
}

function checkShieldCollision(shieldOrb) {
    const dx = birdGroup.position.x - shieldOrb.position.x;
    const dy = birdGroup.position.y - shieldOrb.position.y;
    const dz = birdGroup.position.z - shieldOrb.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const combinedRadius = BIRD_COLLISION_RADIUS + SHIELD_COLLISION_RADIUS;
    return distSq < (combinedRadius * combinedRadius);
}

// Biome Toast Notification
let toastTimeout = null;
function showBiomeToast(biomeName) {
    if (biomeToastEl && biomeToastNameEl) {
        biomeToastNameEl.textContent = biomeName.toUpperCase();
        biomeToastEl.classList.add('active');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            biomeToastEl.classList.remove('active');
        }, 3500);
    }
}

// Combo Toast Notification
let comboTimeout = null;
function triggerComboUI(count) {
    if (comboBannerEl) {
        comboBannerEl.textContent = `⚡ COMBO x${count}!`;
        comboBannerEl.classList.add('active');
        if (comboTimeout) clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            comboBannerEl.classList.remove('active');
        }, 2200);
    }
}

// Objectives Logic
function getCurrentObjective() {
    if (currentObjectiveIndex < OBJECTIVES_LIST.length) {
        return OBJECTIVES_LIST[currentObjectiveIndex];
    }
    // Procedural infinite objectives for high scores
    const cycle = Math.floor((currentObjectiveIndex - OBJECTIVES_LIST.length) / 3);
    const subIdx = (currentObjectiveIndex - OBJECTIVES_LIST.length) % 3;
    if (subIdx === 0) {
        const target = 12 + cycle * 5;
        return { title: `Feather Master Mk.${cycle+1}`, desc: `Collect ${target} Golden Feathers`, target: target, type: "feathers", rewardPts: 450 + cycle * 100 };
    } else if (subIdx === 1) {
        const target = 45 + cycle * 25;
        return { title: `Sky Survivor Mk.${cycle+1}`, desc: `Survive for ${target}s`, target: target, type: "time", rewardPts: 500 + cycle * 100 };
    } else {
        const target = 100 + cycle * 40;
        return { title: `Sky Legend Mk.${cycle+1}`, desc: `Reach ${target} Points`, target: target, type: "score", rewardPts: 600 + cycle * 150 };
    }
}

let objToastTimeout = null;
function showObjectiveToast(rewardText) {
    if (objectiveToastEl && objToastMsgEl) {
        objToastMsgEl.textContent = rewardText;
        objectiveToastEl.classList.add('active');
        if (objToastTimeout) clearTimeout(objToastTimeout);
        objToastTimeout = setTimeout(() => {
            objectiveToastEl.classList.remove('active');
        }, 3500);
    }
}

function updateObjectiveUI() {
    const obj = getCurrentObjective();
    if (!objTitleEl) return;
    
    objTitleEl.textContent = obj.desc;
    objRewardPillEl.textContent = `+${obj.rewardPts} PTS`;

    let currentVal = 0;
    if (obj.type === "feathers") currentVal = feathersCollected;
    else if (obj.type === "time") currentVal = gameTime;
    else if (obj.type === "flaps") currentVal = totalFlapsPerformed;
    else if (obj.type === "shields") currentVal = totalShieldsCollected;
    else if (obj.type === "combo") currentVal = maxCombo;
    else if (obj.type === "score") currentVal = currentScore;

    const progressPct = Math.min(100, Math.floor((currentVal / obj.target) * 100));
    if (objProgressBarEl) objProgressBarEl.style.width = `${progressPct}%`;
    if (objProgressValEl) objProgressValEl.textContent = `${Math.min(currentVal, obj.target)} / ${obj.target}`;

    // Check completion
    if (currentVal >= obj.target) {
        objectivesCompletedCount++;
        bonusScore += obj.rewardPts;
        currentScore = Math.floor(distanceTraveled * 0.15) + (feathersCollected * 5) + bonusScore;
        hudScoreEl.textContent = currentScore;
        stamina = Math.min(MAX_STAMINA, stamina + 50); // Stamina bonus reward
        soundEngine.playObjectiveCompleteSound();
        triggerParticleBurst(birdGroup.position, false);
        showObjectiveToast(`🎯 OBJECTIVE COMPLETED! +${obj.rewardPts} PTS!`);

        currentObjectiveIndex++;
        updateObjectiveUI();
    }
}

// Flap Boost Ability
function triggerFlapBoost() {
    if (!gameStarted || isGameOver || isPaused) return;
    if (stamina < BOOST_STAMINA_COST) {
        // Low stamina feedback
        soundEngine.playTone(180, 'sawtooth', 0.1, 0.12, 0.001);
        return;
    }

    stamina = Math.max(0, stamina - BOOST_STAMINA_COST);
    totalFlapsPerformed++;
    birdMovement.targetY = Math.min(3.5, birdMovement.targetY + 1.25);
    soundEngine.playFlapSound();
    triggerParticleBurst(birdGroup.position, false);
    updateObjectiveUI();
}

// Pause Game Logic
function togglePause() {
    if (!gameStarted || isGameOver) return;
    isPaused = !isPaused;
    soundEngine.playButtonClick();
    if (isPaused) {
        stopTimer();
        pausePopupEl.classList.remove('hidden');
    } else {
        pausePopupEl.classList.add('hidden');
        startTimer();
    }
}

// Timer Controls
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isGameOver && gameStarted && !isPaused) {
            gameTime += 1;
            const minutes = Math.floor(gameTime / 60);
            const seconds = gameTime % 60;
            hudTimerEl.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Game Over Logic
function gameOver() {
    isGameOver = true;
    stopTimer();
    soundEngine.playHitSound();

    bankedPoints += currentScore;
    saveShopState();

    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    const timeStr = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    document.getElementById('finalTime').textContent = timeStr;
    document.getElementById('finalFeathers').textContent = feathersCollected;
    if (finalObjectivesEl) finalObjectivesEl.textContent = objectivesCompletedCount;
    document.getElementById('finalScore').textContent = currentScore;

    const newRecordBadge = document.getElementById('newRecordBadge');
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('birdGame_highScore', highScore);
        hudHighScoreEl.textContent = highScore;
        newRecordBadge.style.display = 'inline-flex';
    } else {
        newRecordBadge.style.display = 'none';
    }

    gameOverPopupEl.classList.remove('hidden');
}

// Reset Game Logic
function resetGame() {
    isGameOver = false;
    isPaused = false;
    gameSpeed = 1.0;
    gameBoost = 0;
    distanceTraveled = 0;
    currentScore = 0;
    feathersCollected = 0;
    hasShield = false;
    comboCount = 0;
    maxCombo = 1;
    lastFeatherTime = 0;
    currentBiomeIndex = 0;
    stamina = MAX_STAMINA;
    bonusScore = 0;
    currentObjectiveIndex = 0;
    objectivesCompletedCount = 0;
    totalFlapsPerformed = 0;
    totalShieldsCollected = 0;

    hudScoreEl.textContent = "0";
    hudBiomeEl.textContent = BIOMES[0].name;
    hudFeathersEl.textContent = "0";
    hudSpeedEl.textContent = "1.0x";
    shieldBadgeEl.style.display = "none";
    birdShieldMat.opacity = 0.0;

    scene.background.copy(BIOMES[0].skyColor);
    scene.fog.color.copy(BIOMES[0].fogColor);
    groundMat.color.copy(BIOMES[0].groundColor);
    sunLight.color.copy(BIOMES[0].sunColor);
    ambientLight.color.copy(BIOMES[0].ambientColor);

    birdGroup.position.set(-3.9, currentPointerY ? currentPointerY * 4.2 : 0, 0);
    birdGroup.rotation.z = 0;
    birdGroup.rotation.x = 0;
    birdMovement.targetY = currentPointerY ? currentPointerY * 4.2 : 0;
    birdMovement.baseY = birdMovement.targetY;
    birdMovement.velocityY = 0;

    obstacles.forEach((obstacle, i) => {
        const y = getBalancedYPosition();
        obstacle.position.set(i * OBSTACLE_SPACING + 22, y, 0);
    });

    airplanes.forEach((airplane) => {
        airplane.position.set(999, 0, 0);
    });

    feathers.forEach((feather, i) => {
        const targetX = 22 + i * OBSTACLE_SPACING + (OBSTACLE_SPACING / 2);
        feather.position.set(targetX, getBalancedYPosition(), 0);
    });

    shields.forEach((shieldOrb) => {
        shieldOrb.position.set(999, 0, 0);
    });

    updateObjectiveUI();
    startTimer();
    setHUDVisibility(true);
}

function setHUDVisibility(visible) {
    const hud = document.getElementById('hud');
    const objCard = document.getElementById('objectiveCard');
    const altGauge = document.getElementById('altitudeGauge');
    const reticle = document.getElementById('flightReticle');
    const displayVal = visible ? '' : 'none';
    if (hud) hud.style.display = displayVal;
    if (objCard) objCard.style.display = displayVal;
    if (altGauge) altGauge.style.display = displayVal;
    if (reticle) reticle.style.display = displayVal;
}

// Hide gameplay HUD initially on main menu
setHUDVisibility(false);

// --- EVENT LISTENERS & MENU NAVIGATION ---
if (playBtn) {
    playBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (mainMenuModalEl) mainMenuModalEl.classList.add('hidden');
        setCameraMode("gameplay");
        gameStarted = true;
        resetGame();
    });
}

if (openShopBtn) {
    openShopBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        setCameraMode("showroom");
        renderShopShowroom();
        if (shopModalEl) shopModalEl.classList.remove('hidden');
    });
}

if (closeShopBtn) {
    closeShopBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (shopModalEl) shopModalEl.classList.add('hidden');
        setCameraMode("attract");
    });
}

if (openCreditsBtn) {
    openCreditsBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (creditsModalEl) creditsModalEl.classList.remove('hidden');
    });
}

if (closeCreditsBtn) {
    closeCreditsBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (creditsModalEl) creditsModalEl.classList.add('hidden');
    });
}

if (mainMenuPauseBtn) {
    mainMenuPauseBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        pausePopupEl.classList.add('hidden');
        gameStarted = false;
        setHUDVisibility(false);
        setCameraMode("attract");
        if (mainMenuModalEl) mainMenuModalEl.classList.remove('hidden');
        updateBankedPointsUI();
    });
}

if (mainMenuGameOverBtn) {
    mainMenuGameOverBtn.addEventListener('click', () => {
        soundEngine.playButtonClick();
        gameOverPopupEl.classList.add('hidden');
        gameStarted = false;
        setHUDVisibility(false);
        setCameraMode("attract");
        if (mainMenuModalEl) mainMenuModalEl.classList.remove('hidden');
        updateBankedPointsUI();
    });
}

retryBtn.addEventListener('click', () => {
    soundEngine.playButtonClick();
    gameOverPopupEl.classList.add('hidden');
    resetGame();
});

pauseBtn.addEventListener('click', () => {
    togglePause();
});

resumeBtn.addEventListener('click', () => {
    togglePause();
});

restartPauseBtn.addEventListener('click', () => {
    pausePopupEl.classList.add('hidden');
    resetGame();
});

soundToggleBtn.addEventListener('click', () => {
    soundEngine.toggleMute();
});

// Mouse & touch vertical steering (sole control mechanism)
let currentPointerY = 0;

function updatePointerY(clientY) {
    currentPointerY = -(clientY / window.innerHeight) * 2 + 1;
    if (gameStarted && !isGameOver && !isPaused) {
        birdMovement.targetY = currentPointerY * 4.2;
    }
}

window.addEventListener('pointermove', (event) => {
    updatePointerY(event.clientY);
});

window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        updatePointerY(event.touches[0].clientY);
    }
}, { passive: true });

// Pause hotkeys (P or Escape)
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP' || e.code === 'Escape') {
        togglePause();
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const deltaRatio = delta * 60;

    if (!gameStarted) {
        const time = clock.getElapsedTime();

        if (isShopShowroomActive) {
            // --- 3D SHOWROOM PREVIEW CAMERA MODE ---
            birdGroup.position.x = -3.5;
            birdGroup.rotation.y += 0.015 * deltaRatio;
            birdGroup.rotation.z = Math.sin(time * 2) * 0.05;
            birdGroup.position.y = 0.25 + Math.sin(time * 2.5) * 0.06;

            const flapAngle = Math.sin(time * 4) * 0.2;
            rightWingGroup.rotation.x = flapAngle;
            leftWingGroup.rotation.x = -flapAngle;

            clouds.forEach(cloud => {
                cloud.position.x -= BASE_MOVEMENT_SPEED * 0.4 * deltaRatio;
                if (cloud.position.x < -30) cloud.position.x = 40 + Math.random() * 10;
            });

            trees.forEach(tree => {
                tree.position.x -= BASE_MOVEMENT_SPEED * 0.4 * deltaRatio;
                if (tree.position.x < -40) tree.position.x = 40 + Math.random() * 10;
            });

            renderer.render(scene, camera);
            return;
        }

        // --- MAIN MENU BACKGROUND ATTRACT DEMO MODE ---
        birdMovement.targetY = Math.sin(time * 1.5) * 2.2;
        const prevY = birdMovement.baseY;
        const lerpAlpha = 0.05;
        birdMovement.baseY += (birdMovement.targetY - birdMovement.baseY) * lerpAlpha;
        birdMovement.velocityY = (birdMovement.baseY - prevY) / Math.max(delta, 0.001);

        const targetPitch = Math.max(-0.35, Math.min(0.35, birdMovement.velocityY * 0.04));
        birdGroup.rotation.z += (targetPitch - birdGroup.rotation.z) * lerpAlpha;

        birdGroup.position.y = birdMovement.baseY + Math.sin(time * 3) * 0.05;

        // Wing Flap & Tail
        const flapAngle = Math.sin(time * 6) * 0.3;
        rightWingGroup.rotation.x = flapAngle;
        leftWingGroup.rotation.x = -flapAngle;
        tailGroup.rotation.z = Math.cos(time * 2) * 0.08;

        // Background environment scrolling (Clouds, Trees, Rocks only - No Obstacles in Menu)
        clouds.forEach(cloud => {
            cloud.position.x -= BASE_MOVEMENT_SPEED * 0.7 * deltaRatio;
            if (cloud.position.x < -30) cloud.position.x = 40 + Math.random() * 10;
        });

        trees.forEach(tree => {
            tree.position.x -= BASE_MOVEMENT_SPEED * 0.7 * deltaRatio;
            if (tree.position.x < -40) tree.position.x = 40 + Math.random() * 10;
        });

        rocks.forEach(rock => {
            rock.position.x -= BASE_MOVEMENT_SPEED * 0.7 * deltaRatio;
            if (rock.position.x < -40) rock.position.x = 40 + Math.random() * 10;
        });

        // Emit skin particles during showroom/preview if active
        const previewSkin = SKINS.find(s => s.id === (isShopShowroomActive ? previewSkinId : equippedSkinId));
        if (previewSkin && previewSkin.effectType) {
            emitSkinParticle(previewSkin.effectType);
        }

        renderer.render(scene, camera);
        return;
    }

    if (isGameOver || isPaused) return;

    // Dynamic Speed Scaling
    gameBoost += 0.002 * deltaRatio;
    gameSpeed = 1.0 + (gameBoost * SPEED_INCREASE_RATE);
    hudSpeedEl.textContent = `${gameSpeed.toFixed(1)}x`;

    // Distance & Score
    distanceTraveled += BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
    currentScore = Math.floor(distanceTraveled * 0.15) + (feathersCollected * 5) + bonusScore;
    hudScoreEl.textContent = currentScore;

    // Biome Check
    let targetBiomeIndex = 0;
    for (let i = BIOMES.length - 1; i >= 0; i--) {
        if (currentScore >= BIOMES[i].minScore) {
            targetBiomeIndex = i;
            break;
        }
    }

    if (targetBiomeIndex !== currentBiomeIndex) {
        currentBiomeIndex = targetBiomeIndex;
        showBiomeToast(BIOMES[currentBiomeIndex].name);
        soundEngine.playCollectSound();
    }
    hudBiomeEl.textContent = BIOMES[currentBiomeIndex].name;

    // Smooth Biome Lighting Lerp (Gradual, graceful color transition over time)
    const activeBiome = BIOMES[currentBiomeIndex];
    const lerpSpeed = 0.003 * deltaRatio;

    scene.background.lerp(activeBiome.skyColor, lerpSpeed);
    scene.fog.color.lerp(activeBiome.fogColor, lerpSpeed);
    groundMat.color.lerp(activeBiome.groundColor, lerpSpeed);
    sunLight.color.lerp(activeBiome.sunColor, lerpSpeed);
    ambientLight.color.lerp(activeBiome.ambientColor, lerpSpeed);

    const time = clock.getElapsedTime() * 5;

    // Smooth Bird Height Lerp
    const prevY = birdMovement.baseY;
    const lerpAlpha = 1 - Math.pow(1 - 0.09, deltaRatio);
    birdMovement.baseY += (birdMovement.targetY - birdMovement.baseY) * lerpAlpha;
    birdMovement.baseY = Math.max(-3.5, Math.min(3.5, birdMovement.baseY));

    // Dynamic Flight Physics (Pitch & Roll)
    birdMovement.velocityY = (birdMovement.baseY - prevY) / Math.max(delta, 0.001);
    const targetPitch = Math.max(-0.45, Math.min(0.45, birdMovement.velocityY * 0.045));
    const targetRoll = Math.max(-0.35, Math.min(0.35, birdMovement.velocityY * 0.03));

    birdGroup.rotation.z += (targetPitch - birdGroup.rotation.z) * lerpAlpha;
    birdGroup.rotation.x += (targetRoll - birdGroup.rotation.x) * lerpAlpha;

    // Bird Idle Floating & Wing Flap
    const floatingEffect = Math.sin(time * 0.8) * 0.06;
    birdGroup.position.y = birdMovement.baseY + floatingEffect;

    const flapAngle = Math.sin(time * (1.5 + gameSpeed * 0.3)) * 0.3;
    rightWingGroup.rotation.x = flapAngle;
    leftWingGroup.rotation.x = -flapAngle;
    tailGroup.rotation.z = Math.cos(time * 0.8) * 0.08;

    // Emit skin particle trail during active flight
    const activeSkinObj = SKINS.find(s => s.id === equippedSkinId);
    if (activeSkinObj && activeSkinObj.effectType) {
        emitSkinParticle(activeSkinObj.effectType);
    }

    // Shield 3D Mesh Rotation & Opacity pulse
    if (hasShield) {
        birdShieldMesh.rotation.y += 0.03 * deltaRatio;
        birdShieldMesh.rotation.z += 0.02 * deltaRatio;
        birdShieldMat.opacity = 0.65 + Math.sin(time * 2) * 0.15;
    } else {
        birdShieldMat.opacity = 0.0;
    }

    // Environment Movement
    clouds.forEach(cloud => {
        cloud.position.x -= BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
        if (cloud.position.x < -30) {
            cloud.position.x = 40 + Math.random() * 10;
            cloud.position.y = Math.random() * 6 + 5;
        }
    });

    trees.forEach(tree => {
        tree.position.x -= BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
        if (tree.position.x < -40) {
            tree.position.x = 40 + Math.random() * 10;
        }
    });

    rocks.forEach(rock => {
        rock.position.x -= BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
        if (rock.position.x < -40) {
            rock.position.x = 40 + Math.random() * 10;
        }
    });

    // Obstacles Movement & Collision
    obstacles.forEach(obstacle => {
        obstacle.position.x -= BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
        obstacle.rotation.x += 0.015 * deltaRatio;
        obstacle.rotation.y += 0.02 * deltaRatio;

        if (obstacle.position.x < -25) {
            const currentMaxX = Math.max(...obstacles.map(o => o.position.x));
            obstacle.position.x = currentMaxX + OBSTACLE_SPACING + Math.random() * 3;
            obstacle.position.y = getBalancedYPosition();
        }

        if (checkObstacleCollision(obstacle)) {
            if (hasShield) {
                // Shield absorbs impact!
                hasShield = false;
                shieldBadgeEl.style.display = "none";
                soundEngine.playShieldBreakSound();
                triggerParticleBurst(obstacle.position, true);
                // Reposition obstacle safely out of way
                obstacle.position.x += 15;
            } else {
                gameOver();
            }
        }
    });

    // Stunt Airplanes Hazard Movement & Collision (Appears only in high speed / Desert Biome >= 180 pts)
    airplanes.forEach(airplane => {
        const prop = airplane.getObjectByName("propeller");
        if (prop) prop.rotation.x += 0.5 * deltaRatio;

        if (currentScore >= 180) {
            if (airplane.position.x > 200) {
                airplane.position.x = 45 + Math.random() * 25;
                airplane.position.y = getBalancedYPosition();
            }

            airplane.position.x -= (BASE_MOVEMENT_SPEED * gameSpeed * 1.5) * deltaRatio;

            if (airplane.position.x < -35) {
                airplane.position.x = 45 + Math.random() * 25;
                airplane.position.y = getBalancedYPosition();
            }

            if (checkAirplaneCollision(airplane)) {
                if (hasShield) {
                    hasShield = false;
                    shieldBadgeEl.style.display = "none";
                    soundEngine.playShieldBreakSound();
                    triggerParticleBurst(airplane.position, true);
                    airplane.position.x += 20;
                } else {
                    gameOver();
                }
            }
        } else {
            airplane.position.x = 999;
        }
    });

    // Golden Feathers Movement & Collision
    const nowSec = clock.getElapsedTime();
    feathers.forEach(feather => {
        feather.position.x -= BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
        feather.rotation.y += 0.05 * deltaRatio;
        feather.position.y += Math.sin(time * 2 + feather.position.x) * 0.003;

        if (feather.position.x < -25) {
            const currentMaxX = Math.max(...obstacles.map(o => o.position.x));
            feather.position.x = currentMaxX + (OBSTACLE_SPACING / 2) + Math.random() * 2;
            feather.position.y = getBalancedYPosition();
        }

        if (checkFeatherCollision(feather)) {
            // Combo calculation (within 3 seconds)
            if (nowSec - lastFeatherTime < 3.0) {
                comboCount += 1;
            } else {
                comboCount = 1;
            }
            lastFeatherTime = nowSec;
            maxCombo = Math.max(maxCombo, comboCount);

            soundEngine.playCollectSound(comboCount);
            triggerParticleBurst(feather.position, false);
            feathersCollected += 1;
            hudFeathersEl.textContent = feathersCollected;

            // Stamina bonus on collecting feather
            stamina = Math.min(MAX_STAMINA, stamina + 25);
            updateObjectiveUI();

            if (comboCount > 1) {
                triggerComboUI(comboCount);
            }

            const currentMaxX = Math.max(...obstacles.map(o => o.position.x));
            feather.position.x = currentMaxX + (OBSTACLE_SPACING / 2) + Math.random() * 4;
            feather.position.y = getBalancedYPosition();
        }
    });

    // Shield Orbs Spawn & Collision
    shields.forEach(shieldOrb => {
        if (shieldOrb.position.x > 800 && !hasShield && Math.random() < 0.005) {
            // Spawn shield orb ahead in flight corridor
            const currentMaxX = Math.max(...obstacles.map(o => o.position.x));
            shieldOrb.position.set(currentMaxX + 8, getBalancedYPosition(), 0);
        }

        if (shieldOrb.position.x < 800) {
            shieldOrb.position.x -= BASE_MOVEMENT_SPEED * gameSpeed * deltaRatio;
            shieldOrb.rotation.y += 0.06 * deltaRatio;
            shieldOrb.rotation.z += 0.03 * deltaRatio;

            if (shieldOrb.position.x < -25) {
                shieldOrb.position.x = 999; // Dormant
            }

            if (checkShieldCollision(shieldOrb)) {
                hasShield = true;
                totalShieldsCollected++;
                shieldBadgeEl.style.display = "flex";
                soundEngine.playShieldSound();
                triggerParticleBurst(shieldOrb.position, true);
                stamina = Math.min(MAX_STAMINA, stamina + 35);
                updateObjectiveUI();
                shieldOrb.position.x = 999; // Dormant
            }
        }
    });

    // Altitude Ruler Update (-3.5 to +3.5 mapped to 5% to 90%)
    if (altitudeIndicatorEl) {
        const normAlt = ((birdGroup.position.y - (-3.5)) / 7.0) * 100;
        altitudeIndicatorEl.style.bottom = `${Math.max(5, Math.min(90, normAlt))}%`;
    }

    // Flight Reticle Update
    if (flightReticleEl) {
        const reticleScreenY = (0.5 - (birdMovement.targetY / 8.4)) * window.innerHeight;
        const reticleScreenX = window.innerWidth * 0.35;
        flightReticleEl.style.top = `${reticleScreenY}px`;
        flightReticleEl.style.left = `${reticleScreenX}px`;
    }

    // Passive Objective Progress Update (for time & score checks)
    updateObjectiveUI();

    // Particles Update
    for (let i = 0; i < PARTICLE_MAX; i++) {
        if (particlePositions[i * 3] < 900) {
            particlePositions[i * 3] += particleVelocities[i].x * deltaRatio;
            particlePositions[i * 3 + 1] += particleVelocities[i].y * deltaRatio;
            particlePositions[i * 3 + 2] += particleVelocities[i].z * deltaRatio;
            particleVelocities[i].multiplyScalar(0.92);

            if (particleVelocities[i].lengthSq() < 0.0001) {
                particlePositions[i * 3] = 999;
            }
        }
    }
    particleGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Start loop
animate();