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
    dx: 0
};

let bullets = [];
const bulletSpeed = 4;
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
    ctx.fillText('Space = Atirar', 20, 170);
}

function movePlayer() {
    const speed = isSprinting ? player.sprintSpeed : player.speed;
    player.x += player.dx * speed;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
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
            }
        });
    });
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
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isSprinting = false;
    }
});

update();
