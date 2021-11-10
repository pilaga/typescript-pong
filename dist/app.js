"use strict";
var body = document.body;
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var width = 500;
var height = 700;
var screenWidth = window.screen.width;
var canvasPosition = screenWidth / 2 - width / 2;
var isMobile = window.matchMedia('(max-width: 600px)');
var gameOverEl = document.createElement('div');
var paddleHeight = 10;
var paddleWidth = 50;
var paddleDiff = 25;
var paddleBottomX = 225;
var paddleTopX = 225;
var playerMoved = false;
var paddleContact = false;
var ballX = 250;
var ballY = 350;
var ballRadius = 5;
var speedY;
var speedX;
var trajectoryX;
var computerSpeed;
if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
}
else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
}
var playerScore = 0;
var computerScore = 0;
var winningScore = 5;
var isGameOver = true;
var isNewGame = true;
function renderCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);
    context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);
    context.beginPath();
    context.setLineDash([4]);
    context.moveTo(0, 350);
    context.lineTo(500, 350);
    context.strokeStyle = 'grey';
    context.stroke();
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, 0);
    context.fillStyle = 'white';
    context.fill();
    context.font = '32px Courier New';
    context.fillText(playerScore.toString(), 20, canvas.height / 2 + 50);
    context.fillText(computerScore.toString(), 20, canvas.height / 2 - 30);
}
function createCanvas() {
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas();
}
function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -1;
    paddleContact = false;
}
function ballMove() {
    ballY += -speedY;
    if (playerMoved && paddleContact) {
        ballX += speedX;
    }
}
function ballBoundaries() {
    if (ballX < 0 && speedX < 0) {
        speedX = -speedX;
    }
    if (ballX > width && speedX > 0) {
        speedX = -speedX;
    }
    if (ballY > height - paddleDiff) {
        if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
            paddleContact = true;
            if (playerMoved) {
                speedY -= 1;
                if (speedY < -5) {
                    speedY = -5;
                    computerSpeed = 6;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (paddleBottomX + paddleDiff);
            speedX = trajectoryX * 0.3;
        }
        else if (ballY > height) {
            ballReset();
            computerScore++;
        }
    }
    if (ballY < paddleDiff) {
        if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
            if (playerMoved) {
                speedY += 1;
                if (speedY > 5) {
                    speedY = 5;
                }
            }
            speedY = -speedY;
        }
        else if (ballY < 0) {
            ballReset();
            playerScore++;
        }
    }
}
function computerAI() {
    if (playerMoved) {
        if (paddleTopX + paddleDiff < ballX) {
            paddleTopX += computerSpeed;
        }
        else {
            paddleTopX -= computerSpeed;
        }
    }
}
function showGameOverEl(winner) {
    canvas.hidden = true;
    gameOverEl.textContent = '';
    gameOverEl.classList.add('game-over-container');
    var title = document.createElement('h1');
    title.textContent = winner + " Wins!";
    var playAgainBtn = document.createElement('button');
    playAgainBtn.setAttribute('onclick', 'startGame()');
    playAgainBtn.textContent = 'Play Again';
    gameOverEl.append(title, playAgainBtn);
    body.appendChild(gameOverEl);
}
function gameOver() {
    if (playerScore === winningScore || computerScore === winningScore) {
        isGameOver = true;
        var winner = playerScore === winningScore ? 'Player 1' : 'Computer';
        showGameOverEl(winner);
    }
}
function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    gameOver();
    if (!isGameOver) {
        window.requestAnimationFrame(animate);
    }
}
function startGame() {
    if (isGameOver && !isNewGame) {
        body.removeChild(gameOverEl);
        canvas.hidden = false;
    }
    isGameOver = false;
    isNewGame = false;
    playerScore = 0;
    computerScore = 0;
    ballReset();
    createCanvas();
    animate();
    canvas.addEventListener('mousemove', function (e) {
        playerMoved = true;
        paddleBottomX = e.clientX - canvasPosition - paddleDiff;
        if (paddleBottomX < paddleDiff) {
            paddleBottomX = 0;
        }
        if (paddleBottomX > width - paddleWidth) {
            paddleBottomX = width - paddleWidth;
        }
        canvas.style.cursor = 'none';
    });
}
startGame();
