// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = 'ready'; // ready, playing, paused, won, lost
let score = 0;
let lives = 3;
let level = 1;

// Paddle
const paddle = {
    width: 100,
    height: 15,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    speed: 8,
    dx: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: paddle.y - 10,
    radius: 8,
    speed: 4,
    dx: 4,
    dy: -4
};

// Blocks
const blockInfo = {
    rows: 5,
    cols: 10,
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 35,
    offsetY: 60
};

let blocks = [];

// Colors for different block rows
const blockColors = ['#ef4444', '#f97316', '#fbbf24', '#4ade80', '#3b82f6'];

// Initialize blocks
function createBlocks() {
    blocks = [];
    for (let row = 0; row < blockInfo.rows; row++) {
        for (let col = 0; col < blockInfo.cols; col++) {
            blocks.push({
                x: col * (blockInfo.width + blockInfo.padding) + blockInfo.offsetX,
                y: row * (blockInfo.height + blockInfo.padding) + blockInfo.offsetY,
                width: blockInfo.width,
                height: blockInfo.height,
                color: blockColors[row],
                visible: true,
                points: (5 - row) * 10
            });
        }
    }
}

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

// Draw blocks
function drawBlocks() {
    blocks.forEach(block => {
        if (block.visible) {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);

            // Add shine effect
            const gradient = ctx.createLinearGradient(block.x, block.y, block.x, block.y + block.height);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(block.x, block.y, block.width, block.height);

            // Border
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }
    });
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x < 0) {
        paddle.x = 0;
    }

    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Move ball
function moveBall() {
    if (gameState !== 'playing') return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left and right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        // Calculate hit position for angle variation
        const hitPos = (ball.x - paddle.x) / paddle.width;
        const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees

        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
    }

    // Ball falls below paddle
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        updateLives();

        if (lives === 0) {
            gameState = 'lost';
            showMessage('Game Over! Press SPACE to restart', 'lose');
        } else {
            resetBall();
            gameState = 'ready';
            showMessage('Press SPACE to continue', 'pause');
        }
    }
}

// Block collision detection
function blockCollision() {
    blocks.forEach(block => {
        if (block.visible) {
            if (
                ball.x + ball.radius > block.x &&
                ball.x - ball.radius < block.x + block.width &&
                ball.y + ball.radius > block.y &&
                ball.y - ball.radius < block.y + block.height
            ) {
                ball.dy *= -1;
                block.visible = false;
                score += block.points;
                updateScore();

                // Check win condition
                if (blocks.every(b => !b.visible)) {
                    level++;
                    updateLevel();
                    gameState = 'won';
                    showMessage('Level Complete! Press SPACE for next level', 'win');
                }
            }
        }
    });
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = paddle.y - 10;
    ball.speed = 4 + (level - 1) * 0.5;
    const angle = (Math.random() - 0.5) * Math.PI / 4;
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Update lives display
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// Update level display
function updateLevel() {
    document.getElementById('level').textContent = level;
}

// Show message
function showMessage(text, type = '') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

// Clear message
function clearMessage() {
    const messageEl = document.getElementById('message');
    messageEl.textContent = '';
    messageEl.className = 'message';
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();
    drawPaddle();
    drawBall();

    // Draw ready message on canvas
    if (gameState === 'ready') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2);
    }

    if (gameState === 'paused') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// Update game state
function update() {
    if (gameState === 'playing') {
        movePaddle();
        moveBall();
        blockCollision();
    }

    draw();
    requestAnimationFrame(update);
}

// Keyboard controls
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.dx = -paddle.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleSpaceBar();
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.dx = 0;
    }
}

// Mouse controls
function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddle.x = mouseX - paddle.width / 2;

    // Keep paddle in bounds
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Space bar handler
function handleSpaceBar() {
    if (gameState === 'ready') {
        gameState = 'playing';
        clearMessage();
    } else if (gameState === 'playing') {
        gameState = 'paused';
        showMessage('Press SPACE to continue', 'pause');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        clearMessage();
    } else if (gameState === 'won') {
        // Next level
        createBlocks();
        resetBall();
        gameState = 'ready';
        showMessage('Press SPACE to start', 'pause');
    } else if (gameState === 'lost') {
        // Reset game
        score = 0;
        lives = 3;
        level = 1;
        updateScore();
        updateLives();
        updateLevel();
        createBlocks();
        resetBall();
        gameState = 'ready';
        showMessage('Press SPACE to start', 'pause');
    }
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
canvas.addEventListener('mousemove', mouseMove);

// Initialize game
createBlocks();
showMessage('Press SPACE to start', 'pause');
update();
