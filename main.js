import * as THREE from 'three';
// ORBIT CONTROLS utility (enable moving camera with mouse)
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Configuração básica da cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)


// Variáveis de estado do jogo
let isGameOver = false;
let gameSpeed = 0;
let gameBoost = 0;
let initialGameSpeed = 2;
const SPEED_INCREASE_RATE = 0.1;
const BASE_MOVEMENT_SPEED = 0.05;

// Função que termina o jogo
function gameOver() {
    isGameOver = true;


    // Parar o cronómetro
    clearInterval(timerInterval);

    // Calcular o tempo final
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    const timeString = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    // Mostrar o pop up game over
    const gameOverPopup = document.getElementById('gameOverPopup');
    const survivalTime = document.getElementById('survivalTime');
    survivalTime.textContent = `Tempo: ${timeString}`;
    gameOverPopup.style.display = 'flex';
}

// Função que reinicia o jogo
function resetGame() {


    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Repor o estado inicial do jogo
    isGameOver = false;
    gameSpeed = initialGameSpeed;
    gameBoost = 0;
    gameTime = 0;
    
     // Iniciar um novo cronómetro
    const timerDiv = document.getElementById("timer");
    timerInterval = setInterval(() => {
        gameTime += 1;
        let minutes = Math.floor(gameTime / 60);
        let seconds = gameTime % 60;
        timerDiv.textContent = `Timer: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
    
    // Repor a posição do pássaro
    bodyGroup.position.set(-3.9, 0, 0);
    headGroup.position.set(-3, -0.9, 0);
    birdMovement.baseY = 0;
    birdMovement.targetY = 0;
    
    // Repor a posição dos obstáculos
    obstacles.forEach(obstacle => {
        obstacle.position.x = Math.random() * 50 + 25;
        obstacle.position.y = Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT;
    });
}

// Função que reinicia o cronómetro
function resetTimer() {
    gameTimer = Date.now();
    document.getElementById('timer').textContent = 'Timer: 0:00';
}


document.getElementById('retryButton').addEventListener('click', () => {
    const gameOverPopup = document.getElementById('gameOverPopup');
    gameOverPopup.style.display = 'none';
    resetGame();
    resetTimer(); // Add this line
    requestAnimationFrame(animate); // Use animate instead of gameLoop
});




// Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);



const lightDirectional1 = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(lightDirectional1)
lightDirectional1.position.set(30, 10, 0)
lightDirectional1.castShadow = true
lightDirectional1.distance = 100
lightDirectional1.decay = 2


let lightTarget = new THREE.Object3D()
lightTarget.position.set(20, 0, 0)
scene.add(lightTarget)
lightDirectional1.target = lightTarget

lightDirectional1.shadow.camera.bottom = -25
lightDirectional1.shadow.camera.top = 25
lightDirectional1.shadow.camera.left = -10
lightDirectional1.shadow.camera.right = 10
lightDirectional1.shadow.camera.far = 100
window.shadowCam = lightDirectional1.shadow.camera

// let cameraHelper = new THREE.CameraHelper(lightDirectional1.shadow.camera)
// scene.add(cameraHelper)


// Criação do sol   
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(-15, 10, -15);
scene.add(sun);


// Ciação de nuvens
function createCloud() {
    const cloudGroup = new THREE.Group();
    const cloudMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });



    const sphereCount = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < sphereCount; i++) {
        const sphereGeometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.5, 16, 16);
        const sphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
        sphere.castShadow = true;

        sphere.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 1
        );

        cloudGroup.add(sphere);
    }
    return cloudGroup;
}

const clouds = [];
const CLOUD_COUNT = 40;

// Criar nuvens iniciais com uma distribuição mais ampla
for (let i = 0; i < CLOUD_COUNT; i++) {
    const cloud = createCloud();
    
    cloud.position.set(
        (Math.random() * 60) - 10, 
        Math.random() * 6 + 6,     
        (Math.random() - 0.5) * 20 
    );
    scene.add(cloud);
    clouds.push(cloud);
}



// Criação do chão
const groundGeometry = new THREE.PlaneGeometry(50, 10);
const groundMaterial = new THREE.MeshLambertMaterial({
    color: 0x33cc33, 
    side: THREE.DoubleSide
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;


ground.rotation.x = Math.PI / 2;
ground.position.y = -5;  
ground.position.z = 2;   

scene.add(ground);

// Atualizar a câmara para uma melhor visualização em 2D
camera.position.set(0, 1, 10);
camera.lookAt(0, 0, 0);



// Função para criar uma rocha
function createRock() {
    const rockGeometry = new THREE.SphereGeometry(Math.random() * 0.8 + 0.5, 16, 16);
    const rockMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.castShadow = true;
    rock.position.set(
        (Math.random() - 0.5) * 50, // Distribuição das rochas
        -5, // Posição na parte inferior
        Math.max((Math.random() - 0.5) * 10, -2) // Limita a posição z no valor máximo de -2
    );
    return rock;

}

// Função para criar uma árvore
function createTree() {
    const treeGroup = new THREE.Group();

    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.position.set(0, 1, 0);
    treeGroup.add(trunk);

    // Folhagem
    const foliageGeometry = new THREE.SphereGeometry(1, 16, 16);
    const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.castShadow = true;
    foliage.position.set(0, 2, 0);
    treeGroup.add(foliage);

    treeGroup.position.set(
        (Math.random() - 0.5) * 50, // Distribuição das árvores
        -5, // Posição na parte inferior
        Math.max((Math.random() - 0.5) * 10, -2) // Limita a posição z no valor máximo de -2
    );

    return treeGroup;
}

// Criar rochas e árvores
const rocks = [];
const trees = [];
const ROCK_COUNT = 10;
const TREE_COUNT = 5;

for (let i = 0; i < ROCK_COUNT; i++) {
    const rock = createRock();
    scene.add(rock);
    rocks.push(rock);
}

for (let i = 0; i < TREE_COUNT; i++) {
    const tree = createTree();
    scene.add(tree);
    trees.push(tree);
}

// Adicionar animações ou efeitos se necessário (por exemplo, rotação das árvores)
rocks.forEach(rock => {
    rock.rotation.y = Math.random() * Math.PI; // Rotação aleatória para as rochas
});

trees.forEach(tree => {
    tree.rotation.y = Math.random() * Math.PI; // Rotação aleatória para as árvores
});




const obstacles = [];
const OBSTACLE_COUNT = 10;
const OBSTACLE_SPACING = 10;
let lastObstacleY = 0;

// Defina os limites de altura
const MIN_HEIGHT = -3; 
const MAX_HEIGHT = 3;  

function createObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.castShadow = true;
    return obstacle;
}

function getBalancedYPosition() {
    const maxDeviation = 2.5; 
    const randomFactor = Math.random() * 2 - 1; //
    const newY = lastObstacleY + (randomFactor * maxDeviation);
    const clampedY = Math.max(MIN_HEIGHT + 0.5, Math.min(MAX_HEIGHT - 0.5, newY));
    if (Math.random() < 4) {
        lastObstacleY = Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT;
    } else {
        lastObstacleY = clampedY;
    }
    
    return lastObstacleY;
}


for (let i = 0; i < OBSTACLE_COUNT; i++) {
    const obstacle = createObstacle();
    const y = getBalancedYPosition();
    obstacle.position.set(i * OBSTACLE_SPACING + 10, y, 0);
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// Verificar colisão
function checkCollision(object1, object2) {
    const object1Box = new THREE.Box3().setFromObject(object1);
    const object2Box = new THREE.Box3().setFromObject(object2);
    return object1Box.intersectsBox(object2Box);
}

// Movimento do pássaro
const birdMovement = {
    baseY: 0,
    targetY: 0
};

// PÁSSARO

// Grupo para cabeça, bico e olhos
const headGroup = new THREE.Group();

// Cabeça
const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const headMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0, 1.2, 0);
head.castShadow = true

// Bico
const beakGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
const beakMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const beak = new THREE.Mesh(beakGeometry, beakMaterial);
beak.position.set(0, 1.2, 0.4);
beak.rotation.x = Math.PI / 2;
beak.castShadow = true

// Olhos
const eyeGeometry = new THREE.SphereGeometry(0.08, 32, 32);
const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-0.2, 1.3, 0.3);
leftEye.castShadow = true

const rightEye = leftEye.clone();
rightEye.position.set(0.2, 1.3, 0.3);
rightEye.castShadow = true

// Adicionando a cabeça, bico e olhos ao grupo
headGroup.add(head);
headGroup.add(beak);
headGroup.add(leftEye);
headGroup.add(rightEye);

// Adicionando o grupo à cena
scene.add(headGroup);

headGroup.position.y = -0.9;
headGroup.position.x = -3;
headGroup.rotation.y = Math.PI / 2;


//Grupo do corpo
const bodyGroup = new THREE.Group();

// Corpo principal
const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.5, 400);
const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.castShadow = true
body.rotation.x = Math.PI / 2;
body.position.z = -0.2;
bodyGroup.add(body);

// Pernas
const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 32);
const legMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
leftLeg.castShadow = true
leftLeg.position.set(-0.3, -0.3, -0.9);
leftLeg.rotation.x = 20;
bodyGroup.add(leftLeg);

const rightLeg = leftLeg.clone();
rightLeg.position.set(0.3, -0.3, -0.9);
rightLeg.castShadow = true
rightLeg.rotation.x = 20;
bodyGroup.add(rightLeg);


// Penas da cauda
const tailFeathers = new THREE.Group();
const featherGeometry = new THREE.PlaneGeometry(0.2, 0.7);
const featherMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFD700,
    side: THREE.DoubleSide
});

for (let i = 0; i < 2; i++) {
    const feather = new THREE.Mesh(featherGeometry, featherMaterial);
    feather.position.set(i * 0.2 - 0.4, -1.5, -1);
    feather.rotation.x = -120;
    tailFeathers.add(feather);
}

tailFeathers.position.y = 2;
tailFeathers.position.z = 0;
tailFeathers.position.x = 0.3
bodyGroup.add(tailFeathers);

// Asas
const featherGroupLeft = new THREE.Group();
const featherGroupRight = new THREE.Group();

// Criar asa esquerda
for (let i = 0; i < 6; i++) {
    const leftWingFeather = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 1),
        new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })
    );
    leftWingFeather.position.x = i * 0.2 - 0.5;
    leftWingFeather.position.y = 1;
    leftWingFeather.position.z = -0.3;
    featherGroupLeft.add(leftWingFeather);
    leftWingFeather.castShadow = true
}

// Criar asa direita
for (let i = 0; i < 6; i++) {
    const rightWingFeather = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 1),
        new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })
    );
    rightWingFeather.position.x = i * 0.2 - 0.5;
    rightWingFeather.position.y = 1;
    rightWingFeather.position.z = -0.3;
    featherGroupRight.add(rightWingFeather);
    rightWingFeather.castShadow = true
}

// Ajuste da posição das asas para ficarem alinhadas ao corpo
featherGroupLeft.position.set(-1.2, 0, 0);
featherGroupRight.position.set(1.2, 0, 0);

bodyGroup.add(featherGroupLeft);
bodyGroup.add(featherGroupRight);

// Adicionando o grupo ao cena
scene.add(bodyGroup);

// Ajuste da posição e orientação do grupo do corpo
bodyGroup.position.y = 0;
bodyGroup.position.x = -3.9;
bodyGroup.rotation.y = Math.PI / 2;


OrbitControls
// Posição inicial da câmera
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);


let gameTimer;
// Função de animação
function animate() {

    // Verificar se o jogo foi iniciado
    if (gameStarted === false) {
        requestAnimationFrame(animate);

        return;
    }


    // Verificar se o jogo terminou
    if (isGameOver) {
        cancelAnimationFrame(gameTimer);
        return;
    }

    // Continuar com o loop de animação
    requestAnimationFrame(animate);

    gameBoost += 0.02;
    gameSpeed = 1.2 + (gameBoost * SPEED_INCREASE_RATE);
    const time = Date.now() * 0.03;


    // Movimento vertical suave do pássaro
    birdMovement.baseY += (birdMovement.targetY - birdMovement.baseY) * 0.05;
    birdMovement.baseY = Math.max(-2, Math.min(3, birdMovement.baseY)); // Limita a posição vertical do pássaro

    // Aplicar movimentação vertical
    const floatingEffect = Math.sin(time) * 0.05; // Efeito flutuante opcional
    const finalYPosition = birdMovement.baseY + floatingEffect;

    bodyGroup.position.y = finalYPosition;
    headGroup.position.y = finalYPosition - 0.9;

    // Animação das asas
    featherGroupLeft.children.forEach((feather, index) => {
        let yPosition = Math.sin(time + (featherGroupLeft.children.length - index - 1) * 0.3) * 0.1 * (featherGroupLeft.children.length - index - 1);
        feather.rotation.x = Math.PI / 3;
        feather.position.z = -0.3;
        feather.position.y = yPosition;
    });

    featherGroupRight.children.forEach((feather, index) => {
        let yPosition = Math.sin(time + index * 0.3) * 0.1 * (index);
        feather.rotation.x = Math.PI / 3;
        feather.position.z = -0.3;
        feather.position.y = yPosition;
    });

    // Animação do corpo e da cabeça (flutuação)
    let yPosition = Math.sin(time) * 0.05; // Leve movimento flutuante
    bodyGroup.position.y = finalYPosition + yPosition;
    headGroup.position.y = finalYPosition - 0.9 + yPosition;

    // Animação de piscar dos olhos
    let eyeScale = Math.abs(Math.sin(time * 0.05));
    leftEye.scale.y = eyeScale;
    rightEye.scale.y = eyeScale;

    // Movimento das nuvens
    clouds.forEach((cloud, index) => {
        cloud.position.x -= BASE_MOVEMENT_SPEED * gameSpeed; // Movimento mais suave das nuvens

        // Fade lento
        if (cloud.position.x < -25) {
            cloud.children.forEach(sphere => {
                sphere.material.opacity = (cloud.position.x + 30) / 5;
            });
        }

        if (cloud.position.x < -30) {
            cloud.position.x = 30;
            cloud.position.y = Math.random() * 3 + 4;
            cloud.children.forEach(sphere => {
                sphere.material.opacity = 0.8;
            });
        }
    });

    // Movimento das rochas
    rocks.forEach(rock => {
        rock.position.x -= BASE_MOVEMENT_SPEED * gameSpeed; // Movimento das rochas

        // Resetar posição da rocha quando sair da tela
        if (rock.position.x < -25) {
            rock.position.x = 25 + Math.random() * 5; // Começar de novo com algum deslocamento aleatório
        }
    });

    // Movimento das árvores
    trees.forEach(tree => {
        tree.position.x -= BASE_MOVEMENT_SPEED * gameSpeed; // Movimento das árvores

        // Resetar posição da árvore quando sair da tela
        if (tree.position.x < -25) {
            tree.position.x = 25 + Math.random() * 5; // Começar de novo com algum deslocamento aleatório
        }
    });

    // Verificar colisão com os obstáculos
    obstacles.forEach(obstacle => {
        obstacle.position.x -= BASE_MOVEMENT_SPEED * gameSpeed;
    
        if (obstacle.position.x < -25) {
            // Reset position with balanced spacing
            obstacle.position.x = 25 + Math.random() * 5;
            obstacle.position.y = getBalancedYPosition();
        }
    
        if (checkCollision(obstacle, bodyGroup)) {
            gameOver();
        }
    });


    // Renderizar a cena
    renderer.render(scene, camera);
}




// Listener para capturar o movimento vertical do cursor
document.addEventListener('mousemove', (event) => {
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normaliza o movimento do mouse para -1 a 1
    birdMovement.targetY = mouseY * 6; // Escala para ajustar a altura do pássaro
});

animate();