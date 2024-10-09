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



document.addEventListener("DOMContentLoaded", () => {
    // Resten av din kod går här
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startBtn = document.getElementById("startBtn");
    const scoreDisplay = document.getElementById("score");
    const highscoreDisplay = document.getElementById("highscore");
    const gameOverElement = document.getElementById("gameOver");
    const restartBtn = document.getElementById("restartBtn");

	highscoreDisplay.innerText = "Highscore: " + highscore;
	canvas.style.display = "none"; // Dölj canvas
	scoreDisplay.style.display = "none"; //dölj poängen
	highscoreDisplay.style.display = "none"; //dölj highscore
    // Lägg till dina event listeners här
    startBtn.addEventListener("click", startGame);

    document.addEventListener("keydown", changeDirection);
    // ... resten av din kod
});

// Hämta highscore från localStorage
function getHighscore() {
    return parseInt(localStorage.getItem("highscore")) || 0;
}

// Sätt highscore i localStorage
function setHighscore(value) {
    localStorage.setItem("highscore", value);
}

// Skapa ett äpple på en slumpmässig position
function spawnApple() {
    apple = {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30),
    };
}

// Rita upp spelet på canvas
let cellSize = canvas.width / 30;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas

    // Rita äpplet
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(apple.x * cellSize + cellSize / 2, apple.y * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "brown";
    ctx.fillRect(apple.x * cellSize + cellSize / 2 - 2, apple.y * cellSize + 5, 4, 8); // Stjälk

    // Rita ormen
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) { 
            // Huvudet
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(snake[i].x * cellSize + cellSize / 2, snake[i].y * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
            ctx.fill();
            
            // Ögon
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(snake[i].x * cellSize + cellSize / 4, snake[i].y * cellSize + cellSize / 4, 2, 0, 2 * Math.PI);
            ctx.arc(snake[i].x * cellSize + (3 * cellSize) / 4, snake[i].y * cellSize + cellSize / 4, 2, 0, 2 * Math.PI);
            ctx.fill();
            
            // Tunga
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(snake[i].x * cellSize + cellSize / 2, snake[i].y * cellSize + cellSize);
            ctx.lineTo(snake[i].x * cellSize + cellSize / 2, snake[i].y * cellSize + cellSize + 5);
            ctx.stroke();
        } else {
            // Kroppssegment
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(snake[i].x * cellSize + cellSize / 2, snake[i].y * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}


// Uppdatera spelets logik
function update() {
    // Skapa ett nytt huvud för ormen baserat på nuvarande riktning
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Kontrollera om ormen krockar med väggarna eller med sin egen kropp
    if (
        head.x < 0 || 
        head.x >= canvas.width / cellSize || 
        head.y < 0 || 
        head.y >= canvas.height / cellSize || 
        collision(head, snake)
    ) {
        gameOver(); // Om kollision, avsluta spelet
        return;
    }

    // Lägg till det nya huvudet i början av ormen
    snake.unshift(head);

    // Kontrollera om ormen äter äpplet
    if (head.x === apple.x && head.y === apple.y) {
		eatSound.play(); // Spela upp äta-ljudet
        score++; // Öka poängen
        updateScoreDisplay(); // Uppdatera poängvisningen
        spawnApple(); // Placera ett nytt äpple
    } else {
        snake.pop(); // Ta bort sista segmentet om inget äpple ätits
    }
}

// Kontrollera om ormen krockar med sig själv eller går utanför spelytan
function collision(head, snake) {
    // Kontrollera om huvudet är utanför canvasens gränser
    if (head.x < 0 || head.x >= canvas.width / cellSize || head.y < 0 || head.y >= canvas.height / cellSize) {
        return true; // Kollision med vägg
    }

    // Kontrollera om huvudet krockar med något segment av kroppen (inklusive huvudet)
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true; // Kollision med kroppen
        }
    }
    
    return false; // Ingen kollision
}



// Starta spelet
function startGame() {
    resetGame(); // Återställ spelet till startläge
    canvas.focus(); // Sätt fokus på canvas så att tangenttryckningar fångas upp
    gameInterval = setInterval(() => {
        if (direction.x !== 0 || direction.y !== 0) {
            update(); // Uppdatera spelet om ormen rör sig
        }
        draw(); // Rita om spelet
    }, 100); // Uppdatera var 100 ms
}

// Hantera spelets slut
function gameOver() {
	gameOverSound.play();
    clearInterval(gameInterval); // Stoppa spelet
    if (score > highscore) {
        highscore = score; // Uppdatera highscore om nödvändigt
        setHighscore(highscore); // Spara highscore
    }
    highscoreDisplay.innerText = "Highscore: " + highscore; // Visa uppdaterat highscore
	canvas.style.display = "none"; // Dölj canvas
	gameOverElement.style.display = "block"; // Visa Game Over-skärmen
}

// Återställ spelet till startläge
function resetGame() {
    clearInterval(gameInterval); // Stoppa eventuellt pågående spel
	gameOverElement.style.display = "none"; // Dölj Game Over-skärmen
	canvas.style.display = "block"; // Visa canvas igen
	scoreDisplay.style.display = "block"; //dölj poängen
	highscoreDisplay.style.display = "block"; //dölj highscore
    // Skapa en orm med 2 segment vid start, placerade horisontellt
    snake = [
        { x: 10, y: 10 }, // Huvudet
        { x: 9, y: 10 }   // Första segmentet bakom huvudet
    ];

    direction = { x: 0, y: 0 }; // Ingen rörelse i början
    score = 0; // Återställ poäng
    updateScoreDisplay(); // Uppdatera poängvisningen
    spawnApple(); // Placera ett nytt äpple
}

// Uppdatera poängvisningen
function updateScoreDisplay() {
    scoreDisplay.innerText = "Poäng: " + score;
}

// Ändra riktning på ormen baserat på tangenttryckning
function changeDirection(event) {
    console.log(event.key); // Logga vilken tangent som trycks ned

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

function resizeCanvas() {
    const canvasSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.8);
    canvas.width = canvasSize - (canvasSize % 30);  // Gör storleken till en jämn multipel av 30
    canvas.height = canvas.width;
    cellSize = canvas.width / 30;
    draw(); // Rita om spelet efter att canvas har justerats
}
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) {
            direction = { x: 1, y: 0 }; // Svep höger
        } else if (deltaX < 0 && direction.x === 0) {
            direction = { x: -1, y: 0 }; // Svep vänster
        }
    } else {
        if (deltaY > 0 && direction.y === 0) {
            direction = { x: 0, y: 1 }; // Svep nedåt
        } else if (deltaY < 0 && direction.y === 0) {
            direction = { x: 0, y: -1 }; // Svep uppåt
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    canvas.focus(); // Se till att canvasen får fokus när sidan laddas
});
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Anpassa canvas-storleken direkt vid start

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