
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player spaceship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5
};

// Keyboard controls
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

// Draw the spaceship
function drawPlayer() {
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();

    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - 20, player.y + 40);
    ctx.lineTo(player.x + 20, player.y + 40);

    ctx.closePath();
    ctx.fill();
}

// Move left and right
function movePlayer() {
    if (keys["ArrowLeft"] || keys["KeyA"]) {
        player.x = player.x - player.speed;
    }

    if (keys["ArrowRight"] || keys["KeyD"]) {
        player.x = player.x + player.speed;
    }

    // Keep player inside canvas
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

function shoot() {
    let currentTime = performance.now();

    // Small delay between shots
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

// Move bullets upward
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y = bullets[i].y - bullets[i].speed;

        // Remove bullets outside the screen
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
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

// Move stars down
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

    drawStars();
    drawPlayer();
    drawBullets();

    requestAnimationFrame(gameLoop);
}

gameLoop();

