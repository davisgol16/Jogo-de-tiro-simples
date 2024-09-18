// Configurações Iniciais
let playerScore = 0;
let upgradeLevel = 0;
let shipSize = 50;
let bulletWidth = 5;
const pointsForUpgrade = 1000; // Pontos necessários para o próximo upgrade
const pointsForNextLevel = 3000; // Pontos necessários para a próxima fase

let currentLevel = 0;
const levels = [
    { enemies: 5, difficulty: 1, background: 'background1.png' },
    { enemies: 10, difficulty: 2, background: 'background2.png' },
    { enemies: 15, difficulty: 3, background: 'background3.png' },
    // Adicione mais fases conforme necessário
];
let levelData = levels[currentLevel];

// Atualiza a pontuação e verifica upgrades e mudança de fase
function updateScore(points) {
    playerScore += points;
    console.log(`Pontuação Atual: ${playerScore}`);
    checkUpgrade();
    checkLevelChange();
}

// Verifica se deve ocorrer um upgrade na nave ou nos tiros
function checkUpgrade() {
    while (playerScore >= (upgradeLevel + 1) * pointsForUpgrade) {
        upgradeLevel++;
        applyUpgrade();
    }
}

// Aplica os upgrades à nave e aos tiros
function applyUpgrade() {
    shipSize += 5;  // Aumenta o tamanho da nave
    bulletWidth += 2;  // Aumenta a largura dos tiros
    console.log(`Upgrade Level: ${upgradeLevel}`);
    console.log(`Ship Size: ${shipSize}, Bullet Width: ${bulletWidth}`);
    // Redesenhe a nave e os tiros com as novas propriedades, se necessário
}

// Verifica se deve iniciar a próxima fase
function checkLevelChange() {
    if (playerScore >= (currentLevel + 1) * pointsForNextLevel) {
        startNextLevel();
    }
}

// Inicia a próxima fase
function startNextLevel() {
    console.log(`Mudando para a próxima fase...`);
    currentLevel++;
    if (currentLevel < levels.length) {
        levelData = levels[currentLevel];
        resetGameForNewLevel();
        console.log(`Iniciando fase ${currentLevel + 1}`);
    } else {
        console.log('Você completou todas as fases!');
        // Lógica para finalizar o jogo ou reiniciar
    }
}

// Reseta o jogo para a nova fase
function resetGameForNewLevel() {
    playerScore = 0; // Opcional: ou mantenha a pontuação se desejar
    enemies = generateEnemies(levelData.enemies);
    updateBackground(levelData.background);
}

// Gera inimigos para a fase atual
function generateEnemies(numberOfEnemies) {
    let enemies = [];
    for (let i = 0; i < numberOfEnemies; i++) {
        enemies.push(createEnemy(levelData.difficulty));
    }
    return enemies;
}

// Cria um inimigo com base na dificuldade
function createEnemy(difficulty) {
    return {
        // Defina as propriedades do inimigo com base na dificuldade
    };
}

// Atualiza o fundo do jogo
function updateBackground(backgroundImage) {
    let img = new Image();
    img.src = backgroundImage;
    img.onload = function() {
        // Atualize o fundo do jogo no canvas
        // Exemplo: ctx.drawImage(img, 0, 0);
    };
}

// Desenha a nave no canvas
function drawShip(ctx, x, y) {
    let img = new Image();
    img.src = 'ship.png'; // Imagem da nave
    img.onload = function() {
        ctx.drawImage(img, x, y, shipSize, shipSize);
    };
}

// Desenha o tiro no canvas
function drawBullet(ctx, x, y) {
    ctx.fillStyle = 'red'; // Cor dos tiros
    ctx.fillRect(x, y, bulletWidth, 10); // Largura dos tiros
}

// Função principal do jogo
function gameLoop() {
    // Atualize o jogo
    // Exemplo: updateScore(10); // Atualize a pontuação
    // Outras atualizações do jogo
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 20,
    color: 'white',
    speed: 5,
    sprintSpeed: 10, // Velocidade durante o sprint
    dx: 0,
    dy: 0 // Velocidade vertical
};

let bullets = [];
const initialBulletSpeed = 4;
let bulletSpeed = initialBulletSpeed; // Velocidade inicial dos projéteis
let targets = []; // Corrigido para let
const targetSize = 30;
const targetInterval = 2000; // Alvos aparecem a cada 2 segundos

let score = 0;
let lastTargetTime = 0;
let isSprinting = false; // Variável para controlar o sprint

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawTargets() {
    ctx.fillStyle = 'yellow';
    targets.forEach(target => {
        ctx.fillRect(target.x, target.y, targetSize, targetSize);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawInstructions() {
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    
    // Instruções no canto superior esquerdo
    ctx.fillText('Instruções:', 20, 50);
    ctx.fillText('Shift = Sprint', 20, 80);
    ctx.fillText('Arrow Left = Mover Esquerda', 20, 110);
    ctx.fillText('Arrow Right = Mover Direita', 20, 140);
    ctx.fillText('Arrow Up = Mover Cima', 20, 170);
    ctx.fillText('Arrow Down = Mover Baixo', 20, 200);
    ctx.fillText('Space = Atirar', 20, 230);
}

function movePlayer() {
    const speed = isSprinting ? player.sprintSpeed : player.speed;
    player.x += player.dx * speed;
    player.y += player.dy * speed;

    // Limitar movimento dentro da tela
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bulletSpeed;
    });

    // Remove bullets that are out of bounds
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function moveTargets() {
    targets.forEach(target => {
        target.y += 2; // Move targets downwards
    });

    // Remove targets that are out of bounds
    targets = targets.filter(target => target.y < canvas.height);
}

function spawnTarget() {
    const x = Math.random() * (canvas.width - targetSize);
    const y = 0;
    targets.push({ x, y });
}

function checkCollisions() {
    bullets.forEach(bullet => {
        targets.forEach(target => {
            if (bullet.x < target.x + targetSize &&
                bullet.x + bullet.width > target.x &&
                bullet.y < target.y + targetSize &&
                bullet.y + bullet.height > target.y) {

                // Remove the bullet and the target on collision
                bullets.splice(bullets.indexOf(bullet), 1);
                targets.splice(targets.indexOf(target), 1);

                // Update the score
                score += 100;
                handleUpgrades(); // Verifica se há upgrades disponíveis
            }
        });
    });
}

function handleUpgrades() {
    // Atualiza a cada 1000 pontos
    if (score % 1000 === 0) {
        // Atualizar a velocidade dos projéteis como exemplo de upgrade
        bulletSpeed += 1;
    }
}

function update() {
    movePlayer();
    moveBullets();
    moveTargets();
    checkCollisions();

    // Spawn targets periodically
    const now = Date.now();
    if (now - lastTargetTime > targetInterval) {
        spawnTarget();
        lastTargetTime = now;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawTargets();
    drawScore();
    drawInstructions(); // Adiciona as instruções
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') player.dx = -1;
    if (e.code === 'ArrowRight') player.dx = 1;
    if (e.code === 'ArrowUp') player.dy = -1;
    if (e.code === 'ArrowDown') player.dy = 1;
    if (e.code === 'Space') {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10
        });
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isSprinting = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') player.dx = 0;
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') player.dy = 0;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isSprinting = false;
    }
});

update();
