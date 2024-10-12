// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const GROUND_Y = canvas.height - 20;

let gameSpeed = 3; // Reduced speed for easier gameplay
let gameOver = false;

// Load images
const dinoImage = new Image();
dinoImage.src = 'assets/dino.png'; // Ensure this path is correct and image is 50x50px

const cactusImage = new Image();
cactusImage.src = 'assets/cactus.png'; // Ensure this path is correct and image is 30x30px

// Load sounds
const jumpSound = new Audio('assets/jump.mp3'); // Ensure this path is correct
const collisionSound = new Audio('assets/collision.mp3'); // Ensure this path is correct

// Dino Class
class Dino {
    constructor() {
        this.x = 50;
        this.y = GROUND_Y - 50;
        this.width = 50;
        this.height = 50;
        this.dy = 0;
        this.jumpForce = JUMP_FORCE;
        this.isJumping = false;
    }

    draw() {
        ctx.drawImage(dinoImage, this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.isJumping) {
            this.dy += GRAVITY;
            this.y += this.dy;

            if (this.y >= GROUND_Y - this.height) {
                this.y = GROUND_Y - this.height;
                this.isJumping = false;
                this.dy = 0;
            }
        }
    }

    jump() {
        if (!this.isJumping) {
            this.dy = this.jumpForce;
            this.isJumping = true;
            jumpSound.play();
        }
    }
}

// Cactus Class
class Cactus {
    constructor() {
        this.x = canvas.width;
        this.y = GROUND_Y - 30; // Adjusted for new height
        this.width = 30;        // Reduced width
        this.height = 30;       // Reduced height
    }

    draw() {
        ctx.drawImage(cactusImage, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= gameSpeed;
    }
}

const dino = new Dino();
const cactusArray = [];

function spawnCactus() {
    cactusArray.push(new Cactus());
}

let cactusSpawnTimer = 0;
const cactusSpawnInterval = 120; // Increased from 90 to 120 frames

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Get the Restart Button Element
const restartButton = document.getElementById('restartButton');

// Function to Handle Cactuses
function handleCactuses() {
    cactusSpawnTimer++;
    if (cactusSpawnTimer >= cactusSpawnInterval) {
        spawnCactus();
        cactusSpawnTimer = 0;
    }

    cactusArray.forEach((cactus, index) => {
        cactus.update();
        cactus.draw();

        // Collision Detection with Margins
        const collisionMargin = 5; // Pixels to reduce collision box size
        if (
            dino.x + collisionMargin < cactus.x + cactus.width - collisionMargin &&
            dino.x + dino.width - collisionMargin > cactus.x + collisionMargin &&
            dino.y + collisionMargin < cactus.y + cactus.height - collisionMargin &&
            dino.y + dino.height - collisionMargin > cactus.y + collisionMargin
        ) {
            collisionSound.play();
            gameOver = true;
            showGameOver();
        }

        // Remove off-screen cactuses
        if (cactus.x + cactus.width < 0) {
            cactusArray.splice(index, 1);
            score += 10; // Bonus for successfully passing a cactus

            // Increase game speed every 100 points
            if (score % 100 === 0 && score !== 0) {
                gameSpeed += 0.5;
            }
        }
    });
}

// Function to Clear Canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to Draw Ground
function drawGround() {
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, GROUND_Y, canvas.width, 2);
}

// Function to Display Score and High Score
function displayScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#333333';
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 150, 60);
}

// Function to Show Game Over Screen
function showGameOver() {
    // Display Game Over Text
    ctx.font = '30px Arial';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Enter or Click Restart to Play Again', canvas.width / 2, canvas.height / 2 + 30);

    // Update High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    // Show Restart Button
    restartButton.style.display = 'inline-block';
}

// Function to Display Score
function updateGame() {
    if (!gameOver) {
        requestAnimationFrame(updateGame);
    }

    clearCanvas();
    drawGround();
    dino.update();
    dino.draw();
    handleCactuses();
    displayScore();

    if (!gameOver) {
        score += 1;
    }
}

// Function to Restart the Game
function restartGame() {
    gameOver = false;
    dino.y = GROUND_Y - dino.height;
    dino.dy = 0;
    dino.isJumping = false;
    cactusArray.length = 0;
    gameSpeed = 3; // Reset to initial speed
    score = 0;
    restartButton.style.display = 'none';
    updateGame();
}

// Event Listener for Jump and Restart
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        dino.jump();
    }
    if (gameOver && e.code === 'Enter') {
        restartGame();
    }
});

// Event Listener for Restart Button Click
restartButton.addEventListener('click', function () {
    restartGame();
});

// Start the game when images are loaded
window.onload = function () {
    updateGame();
};
