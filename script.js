// Hämta element från DOM
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const gameOverElement = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Spelvariabler
let snake = [];
let direction = { x: 0, y: 0 };
let apple = {};
let score = 0;
let highscore = getHighscore();
let gameInterval;

// Hämta highscore från localStorage
function getHighscore() {
    return parseInt(localStorage.getItem("highscore")) || 0;
}

// Sätt highscore i localStorage
function setHighscore(value) {
    localStorage.setItem("highscore", value);
}

// Återställ spelet till startläge
function resetGame() {
    clearInterval(gameInterval); // Stoppa eventuellt pågående spel
    snake = [{ x: 10, y: 10 }]; // Placera ormen på startposition
    direction = { x: 0, y: 0 }; // Ingen rörelse i början
    score = 0; // Återställ poäng
    updateScoreDisplay(); // Uppdatera poängvisningen
    spawnApple(); // Placera ett nytt äpple
}

// Skapa ett äpple på en slumpmässig position
function spawnApple() {
    apple = {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30),
    };
}

// Rita upp spelet på canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
    
    // Rita äpplet
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * 20, apple.y * 20, 20, 20);
    
    // Rita ormen
    ctx.fillStyle = "green";
    for (let segment of snake) {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    }
}

// Uppdatera spelets logik
function update() {
    // Skapa ett nytt huvud för ormen baserat på nuvarande riktning
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Kontrollera om ormen krockar med väggarna eller sig själv
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 30 || collision(head, snake)) {
        gameOver(); // Om kollision, avsluta spelet
        return;
    }

    snake.unshift(head); // Lägg till det nya huvudet i början av ormen

    // Kontrollera om ormen äter äpplet
    if (head.x === apple.x && head.y === apple.y) {
        score++; // Öka poängen
        updateScoreDisplay(); // Uppdatera poängvisningen
        spawnApple(); // Placera ett nytt äpple
    } else {
        snake.pop(); // Ta bort sista segmentet om inget äpple ätits
    }
}

// Kontrollera om huvudet krockar med något segment av ormen
function collision(head, snake) {
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    return false;
}

// Hantera spelets slut
function gameOver() {
    clearInterval(gameInterval); // Stoppa spelet
    if (score > highscore) {
        highscore = score; // Uppdatera highscore om nödvändigt
        setHighscore(highscore); // Spara highscore
    }
    highscoreDisplay.innerText = "Highscore: " + highscore; // Visa uppdaterat highscore
    gameOverElement.style.display = "block"; // Visa Game Over-skärmen
}

// Starta spelet
function startGame() {
    resetGame(); // Återställ spelet till startläge
    gameInterval = setInterval(() => {
        if (direction.x !== 0 || direction.y !== 0) {
            update(); // Uppdatera spelet om ormen rör sig
        }
        draw(); // Rita om spelet
    }, 100); // Uppdatera var 100 ms
}

// Uppdatera poängvisningen
function updateScoreDisplay() {
    scoreDisplay.innerText = "Poäng: " + score;
}

// Ändra riktning på ormen baserat på tangenttryckning
function changeDirection(event) {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 }; // Gå uppåt om inte redan går vertikalt
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 }; // Gå neråt om inte redan går vertikalt
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 }; // Gå vänster om inte redan går horisontellt
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 }; // Gå höger om inte redan går horisontellt
            break;
    }
}

// Event listeners för knappar och tangenttryckningar
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
    gameOverElement.style.display = "none"; // Dölj Game Over-skärmen
    startGame(); // Starta om spelet
});

// Event listeners för mobila styrknappar
upBtn.addEventListener("click", () => changeDirection({ key: "ArrowUp" }));
downBtn.addEventListener("click", () => changeDirection({ key: "ArrowDown" }));
leftBtn.addEventListener("click", () => changeDirection({ key: "ArrowLeft" }));
rightBtn.addEventListener("click", () => changeDirection({ key: "ArrowRight" }));

// Event listener för tangentbordet
document.addEventListener("keydown", changeDirection);

// Initial setup
highscoreDisplay.innerText = "Highscore: " + highscore;
resetGame();