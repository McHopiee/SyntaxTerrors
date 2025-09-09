---
layout: base
title: 🏓 Pong Game
description: 2-player Pong game
permalink: /pong
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Pong - Wins Tracker</title>
  <style>
    body {
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      flex-direction: column;
      color: #fff;
      font-family: Arial, sans-serif;
    }

    .controls {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .difficulty-btn {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #666;
      background: #111;
      color: #fff;
      cursor: pointer;
      user-select: none;
    }

    .difficulty-btn.active {
      background: #4caf50;
      border-color: #3a8a3a;
    }

    #pongCanvas {
      border: 2px solid #fff;
      background: #000;
      display: block;
    }

    #restartBtn {
      display: none;
      margin-top: 12px;
      padding: 8px 14px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      background: #4caf50;
      color: white;
      cursor: pointer;
    }

    #restartBtn:hover { background: #45a049; }

    /* Notebook button */
    #notebookBtn {
      margin-top: 16px;
      padding: 8px 14px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      background: #2196f3;
      color: white;
      cursor: pointer;
    }

    #notebookBtn:hover { background: #1976d2; }
  </style>
</head>
<body>
  <div class="controls">
    <span>Difficulty:</span>
    <button id="easyBtn" class="difficulty-btn">Easy</button>
    <button id="normalBtn" class="difficulty-btn">Normal</button>
    <button id="hardBtn" class="difficulty-btn">Hard</button>
  </div>

  <canvas id="pongCanvas" width="800" height="500"></canvas>
  <button id="restartBtn">Restart Game</button>

  <!-- New button to view notebook -->
  <button id="notebookBtn">View Notebook Explanation</button>

  <script>
    document.getElementById("notebookBtn").addEventListener("click", () => {
      window.location.href = "/SyntaxTerrors/pongdetails"; 
    });

    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");
    const restartBtn = document.getElementById("restartBtn");

    const easyBtn = document.getElementById("easyBtn");
    const normalBtn = document.getElementById("normalBtn");
    const hardBtn = document.getElementById("hardBtn");

    // --- Paddle Class ---
    class Paddle {
      constructor(x, y, width, height, speed, upKey, downKey) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.upKey = upKey;
        this.downKey = downKey;
      }

      draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }

      move(keys) {
        if (keys[this.upKey] && this.y > 0) {
          this.y -= this.speed;
        }
        if (keys[this.downKey] && this.y + this.height < canvas.height) {
          this.y += this.speed;
        }
      }
    }

    // --- Ball Class ---
    class Ball {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseSpeed = speed;
        this.reset();
      }

      reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.velX = Math.random() > 0.5 ? this.baseSpeed : -this.baseSpeed;
        this.velY = (Math.random() * this.baseSpeed) - (this.baseSpeed / 2);
      }

      draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      move() {
        this.x += this.velX;
        this.y += this.velY;

        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
          this.velY = -this.velY;
        }
      }

      checkCollision(paddle) {
        if (
          this.x - this.radius < paddle.x + paddle.width &&
          this.x + this.radius > paddle.x &&
          this.y > paddle.y &&
          this.y < paddle.y + paddle.height
        ) {
          this.velX = -this.velX;
          let deltaY = this.y - (paddle.y + paddle.height / 2);
          this.velY = deltaY * 0.3;
        }
      }
    }

    // --- Game Variables ---
    const paddleWidth = 10;
    let paddleHeight = 100;
    const paddleSpeed = 7;
    const ballRadius = 10;
    let ballSpeed = 5;

    let player1 = new Paddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, "w", "s");
    let player2 = new Paddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, "i", "k");
    let ball = new Ball(canvas.width / 2, canvas.height / 2, ballRadius, ballSpeed);

    let player1Score = 0, player2Score = 0;
    const winningScore = 10;
    let gameOver = false;

    // --- Wins Tracker ---
    let player1Wins = parseInt(localStorage.getItem("pongPlayer1Wins") || "0");
    let player2Wins = parseInt(localStorage.getItem("pongPlayer2Wins") || "0");

    function saveWin(winner) {
      if (winner === 1) {
        player1Wins++;
        localStorage.setItem("pongPlayer1Wins", player1Wins);
      } else if (winner === 2) {
        player2Wins++;
        localStorage.setItem("pongPlayer2Wins", player2Wins);
      }
    }

    const keys = {};
    document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
    document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

    // --- Updated drawText function (allows font size) ---
    function drawText(text, x, y, color = "white", size = 30) {
      ctx.fillStyle = color;
      ctx.font = `${size}px Arial`;
      ctx.fillText(text, x, y);
    }

    function update() {
      if (gameOver) return;

      player1.move(keys);
      player2.move(keys);
      ball.move();
      ball.checkCollision(player1);
      ball.checkCollision(player2);

      if (ball.x - ball.radius < 0) {
        player2Score++;
        ball.reset();
      } else if (ball.x + ball.radius > canvas.width) {
        player1Score++;
        ball.reset();
      }

      if (player1Score >= winningScore || player2Score >= winningScore) {
        gameOver = true;
        if (player1Score >= winningScore) saveWin(1);
        else saveWin(2);
        restartBtn.style.display = "inline-block";
      }
    }

    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      player1.draw();
      player2.draw();
      ball.draw();

      // Main scores (large)
      drawText(player1Score, canvas.width / 4, 50, "white", 30);
      drawText(player2Score, 3 * canvas.width / 4, 50, "white", 30);

      // Wins tracker (smaller at 18px)
      drawText("P1 Wins: " + player1Wins, 50, 30, "yellow", 18);
      drawText("P2 Wins: " + player2Wins, canvas.width - 200, 30, "yellow", 18);

      if (gameOver) {
        drawText("Game Over", canvas.width / 2 - 80, canvas.height / 2, "red", 28);
        drawText(
          player1Score >= winningScore ? "Player 1 Wins!" : "Player 2 Wins!",
          canvas.width / 2 - 120,
          canvas.height / 2 + 40,
          "yellow",
          22
        );
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    restartBtn.addEventListener("click", () => {
      player1Score = 0;
      player2Score = 0;
      ball.reset();
      gameOver = false;
      restartBtn.style.display = "none";
    });

    // --- Difficulty Settings ---
    function updateDifficultyUI(mode) {
      easyBtn.classList.remove("active");
      normalBtn.classList.remove("active");
      hardBtn.classList.remove("active");
      if (mode === "easy") easyBtn.classList.add("active");
      else if (mode === "normal") normalBtn.classList.add("active");
      else if (mode === "hard") hardBtn.classList.add("active");
    }

    function setDifficulty(mode) {
      localStorage.setItem("pongDifficulty", mode);

      if (mode === "easy") {
        ball.baseSpeed = 3;
        paddleHeight = 120;
      } else if (mode === "normal") {
        ball.baseSpeed = 5;
        paddleHeight = 100;
      } else if (mode === "hard") {
        ball.baseSpeed = 10;
        paddleHeight = 80;
      }

      player1 = new Paddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, "w", "s");
      player2 = new Paddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, "i", "k");
      ball = new Ball(canvas.width / 2, canvas.height / 2, ballRadius, ball.baseSpeed);

      updateDifficultyUI(mode);
    }

    easyBtn.addEventListener("click", () => setDifficulty("easy"));
    normalBtn.addEventListener("click", () => setDifficulty("normal"));
    hardBtn.addEventListener("click", () => setDifficulty("hard"));

    const savedMode = localStorage.getItem("pongDifficulty") || "normal";
    setDifficulty(savedMode);

    gameLoop();
  </script>
</body>
</html>
