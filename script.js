const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
let score = 0;

// Movimento do jogador
document.addEventListener('keydown', (event) => {
    const left = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    if (event.key === 'ArrowLeft' && left > 0) {
        player.style.left = left - 15 + 'px';
    }
    if (event.key === 'ArrowRight' && left < 550) {
        player.style.left = left + 15 + 'px';
    }
    if (event.key === ' ') {
        shoot();
    }
});

// Atirar
function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = player.style.left;
    game.appendChild(bullet);
    moveBullet(bullet);
}

// Mover a bala
function moveBullet(bullet) {
    const interval = setInterval(() => {
        const bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom < 400) {
            bullet.style.bottom = bulletBottom + 5 + 'px';
        } else {
            clearInterval(interval);
            bullet.remove();
        }
    }, 20);
    checkCollision(bullet, interval);
}

// Verificar colisão com o alvo
function checkCollision(bullet, interval) {
    const target = document.createElement('div');
    target.classList.add('target');
    target.style.left = Math.random() * 570 + 'px';
    game.appendChild(target);

    const targetInterval = setInterval(() => {
        const bulletRect = bullet.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        if (
            bulletRect.x < targetRect.x + targetRect.width &&
            bulletRect.x + bulletRect.width > targetRect.x &&
            bulletRect.y < targetRect.y + targetRect.height &&
            bulletRect.height + bulletRect.y > targetRect.y
        ) {
            score++;
            scoreDisplay.innerText = 'Pontuação: ' + score;
            clearInterval(interval);
            bullet.remove();
            target.remove();
            clearInterval(targetInterval);
        } else if (parseInt(target.style.top) > 400) {
            target.remove();
            clearInterval(targetInterval);
        } else {
            target.style.top = (parseInt(target.style.top) || 0) + 2 + 'px';
        }
    }, 20);
}

// Gerar alvos a cada 2 segundos
setInterval(() => {
    const target = document.createElement('div');
    target.classList.add('target');
    target.style.left = Math.random() * 570 + 'px';
    game.appendChild(target);
}, 2000);
