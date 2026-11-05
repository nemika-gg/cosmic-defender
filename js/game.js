
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Playerspship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5
};

// Keyboardcntrls
const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.code] = true;

    if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
        event.preventDefault();
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.code] = false;
});

// Draw spship
function drawPlayer() {
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();

    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - 20, player.y + 40);
    ctx.lineTo(player.x + 20, player.y + 40);

    ctx.closePath();
    ctx.fill();
}

// Mleft and right
function movePlayer() {
    if (keys["ArrowLeft"] || keys["KeyA"]) {
        player.x = player.x - player.speed;
    }

    if (keys["ArrowRight"] || keys["KeyD"]) {
        player.x = player.x + player.speed;
    }

    // To keep the player inside canvas
    if (player.x < 20) {
        player.x = 20;
    }

    if (player.x > canvas.width - 20) {
        player.x = canvas.width - 20;
    }
}

// Bullets
const bullets = [];
let lastShot = 0;

// Enemies
const enemies = [];

function shoot() {
    let currentTime = performance.now();

    // Added a small delay between shots
    if (currentTime - lastShot < 250) {
        return;
    }

    bullets.push({
        x: player.x - 3,
        y: player.y - 10,
        width: 6,
        height: 15,
        speed: 7
    });

    lastShot = currentTime;
}

// Create enemies
function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -40,
        width: 40,
        height: 40,
        speed: 2
    });
}

// Move bullets upward
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y = bullets[i].y - bullets[i].speed;

        // For removing bullets outside the screen
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        }
    }
}

// Move enemies
function updateEnemies() {
    for (let enemy of enemies) {
        enemy.y += enemy.speed;
    }
}

// Check bullet collisions with enemies
function checkCollisions() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        for (let j = enemies.length - 1; j >= 0; j--) {

            let bullet = bullets[i];
            let enemy = enemies[j];

            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {

                // Remove bullet
                bullets.splice(i, 1);

                // Remove enemy
                enemies.splice(j, 1);

                break;
            }
        }
    }
}



// Draw bullets
function drawBullets() {
    ctx.fillStyle = "yellow";

    for (let bullet of bullets) {
        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );
    }
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = "red";

    for (let enemy of enemies) {
        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );
    }
}

// Background stars
const stars = [];

for (let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
    });
}

// mobement stars down
function updateStars() {
    for (let star of stars) {
        star.y = star.y + star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

// Draw stars
function drawStars() {
    ctx.fillStyle = "white";

    for (let star of stars) {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateStars();
    movePlayer();

    if (keys["Space"]) {
        shoot();
    }

    updateBullets();
    updateEnemies();

    drawStars();
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// Spawn enemies every 1500 milliseconds
setInterval(spawnEnemy, 1500);

gameLoop();

