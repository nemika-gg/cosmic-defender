
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5
};

let keys = {};
let bullets = [];
let enemies = [];
let stars = [];

let score = 0;
let lives = 3;
let gameState = "start";
let lastShot = 0;
let lastEnemySpawn = 0;

let button = {
    x: canvas.width / 2 - 100,
    y: 300,
    width: 200,
    height: 50
};

document.addEventListener("keydown", function(e) {
    keys[e.code] = true;

    if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault();
    }

    if (e.code === "Enter" && gameState != "playing") {
        startGame();
    }
});

document.addEventListener("keyup", function(e) {
    keys[e.code] = false;
});

function startGame() {
    score = 0;
    lives = 3;
    bullets = [];
    enemies = [];

    player.x = canvas.width / 2;
    lastShot = 0;
    lastEnemySpawn = performance.now();

    gameState = "playing";
    keys = {};
}

canvas.addEventListener("click", function(e) {
    if (gameState == "playing") return;

    let rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) * canvas.width / rect.width;
    let y = (e.clientY - rect.top) * canvas.height / rect.height;

    if (x >= button.x && x <= button.x + button.width &&
        y >= button.y && y <= button.y + button.height) {
        startGame();
    }
});

function drawPlayer() {
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - 20, player.y + 40);
    ctx.lineTo(player.x + 20, player.y + 40);
    ctx.closePath();
    ctx.fill();
}

function movePlayer() {
    if (keys["ArrowLeft"] || keys["KeyA"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["KeyD"]) {
        player.x += player.speed;
    }

    if (player.x < 20) player.x = 20;
    if (player.x > canvas.width - 20) player.x = canvas.width - 20;
}

function shoot() {
    let time = performance.now();

    if (time - lastShot < 250) return;

    bullets.push({
        x: player.x - 3,
        y: player.y - 10,
        width: 6,
        height: 15,
        speed: 7
    });

    lastShot = time;
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;

        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        }
    }
}

function drawBullets() {
    ctx.fillStyle = "yellow";

    for (let b of bullets) {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    }
}

function spawnEnemy() {
    let enemy = {
        x: Math.random() * (canvas.width - 40) + 20,
        y: -40,
        width: 40,
        height: 40,
        speed: 2
    };

    enemies.push(enemy);
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;

        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }
}

function drawEnemies() {
    ctx.fillStyle = "red";

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// check if bullets hit enemies
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            let b = bullets[i];
            let e = enemies[j];

            if (b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y) {

                bullets.splice(i, 1);
                enemies.splice(j, 1);

                score = score + 10;
                break;
            }
        }
    }
}

function checkPlayerCollision() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];

        if (player.x - 20 < e.x + e.width &&
            player.x + 20 > e.x &&
            player.y < e.y + e.height &&
            player.y + 40 > e.y) {

            lives = lives - 1;
            enemies.splice(i, 1);

            if (lives <= 0) {
                gameState = "gameover";
                break;
            }
        }
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 30);
}

function drawLives() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Lives: " + lives, canvas.width - 10, 30);
    ctx.textAlign = "left";
}

// making the stars
for (let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
    });
}

function updateStars() {
    for (let star of stars) {
        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

function drawStars() {
    ctx.fillStyle = "white";

    for (let star of stars) {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
}

function drawButton(text) {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "#020617";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, button.y + 33);
}

function drawStartScreen() {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 46px Arial";
    ctx.fillText("COSMIC DEFENDER", canvas.width / 2, 155);

    ctx.font = "20px Arial";
    ctx.fillText("Destroy enemies and earn points!", canvas.width / 2, 210);
    ctx.fillText("A / D or Arrows to move, Space to shoot", canvas.width / 2, 245);

    drawButton("START GAME");

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Or press Enter", canvas.width / 2, 385);

    ctx.textAlign = "left";
}

function drawGameOverScreen() {
    ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f87171";
    ctx.textAlign = "center";
    ctx.font = "bold 50px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, 170);

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Final Score: " + score, canvas.width / 2, 240);

    drawButton("RESTART");

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Or press Enter", canvas.width / 2, 385);

    ctx.textAlign = "left";
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateStars();
    drawStars();

    if (gameState == "start") {
        drawStartScreen();
    }
    else if (gameState == "playing") {
        movePlayer();

        if (keys["Space"]) {
            shoot();
        }

        if (performance.now() - lastEnemySpawn >= 1500) {
            spawnEnemy();
            lastEnemySpawn = performance.now();
        }

        updateBullets();
        updateEnemies();
        checkCollisions();
        checkPlayerCollision();

        drawPlayer();
        drawBullets();
        drawEnemies();
        drawScore();
        drawLives();

        if (gameState == "gameover") {
            drawGameOverScreen();
        }
    }
    else if (gameState == "gameover") {
        drawGameOverScreen();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
