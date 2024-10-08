const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const ipAddressDisplay = document.getElementById("ipAddress");

let snake = [];
let direction = { x: 0, y: 0 };
let apple = {};
let score = 0;
let highscore = getHighscore();
let gameInterval;

function getHighscore() {
    return parseInt(localStorage.getItem("highscore")) || 0;
}

function setHighscore(value) {
    localStorage.setItem("highscore", value);
}

function resetGame() {
    clearInterval(gameInterval); // Stoppa tidigare intervall innan vi startar om
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    updateScoreDisplay();
    spawnApple();
}

function spawnApple() {
    apple = {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30),
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw apple
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * 20, apple.y * 20, 20, 20);
    
    // Draw snake
    ctx.fillStyle = "green";
    for (let segment of snake) {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    }
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check collision with walls
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 30 || collision(head, snake)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check if snake eats the apple
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        updateScoreDisplay();
        spawnApple();
    } else {
        snake.pop();
    }
}

function collision(head, snake) {
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    if (score > highscore) {
        highscore = score;
        setHighscore(highscore);
    }
    highscoreDisplay.innerText = "Highscore: " + highscore;

    // Visa Game Over-rutan
    const gameOverElement = document.getElementById("gameOver");
    gameOverElement.style.display = "block";
    
    // Starta om spelet när man klickar på "Starta om"
    document.getElementById("restartBtn").addEventListener("click", () => {
        gameOverElement.style.display = "none";
        resetGame();
        startGame(); // Starta spelet omedelbart
    });
}

function startGame() {
    clearInterval(gameInterval); // Se till att inget gammalt intervall körs
    gameInterval = setInterval(() => {
        if (direction.x !== 0 || direction.y !== 0) {
            update();
        }
        draw();
    }, 100);
}

document.getElementById("restartBtn").addEventListener("click", () => {
    const gameOverElement = document.getElementById("gameOver");
    gameOverElement.style.display = "none"; // Dölja Game Over-rutan
    resetGame(); // Starta om spelet
});

function updateScoreDisplay() {
    scoreDisplay.innerText = "Poäng: " + score;
}

function changeDirection(event) {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

startBtn.addEventListener("click", () => {
    resetGame();
    gameInterval = setInterval(() => {
        if (direction.x !== 0 || direction.y !== 0) {
            update();
        }
        draw();
    }, 100);
});

document.addEventListener("keydown", changeDirection);
highscoreDisplay.innerText = "Highscore: " + highscore;

// Hämta och visa användarens IP-adress
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        ipAddressDisplay.innerText = "Din IP-adress: " + data.ip;
    })
    .catch(error => {
        ipAddressDisplay.innerText = "Kunde inte hämta IP-adress.";
    });
