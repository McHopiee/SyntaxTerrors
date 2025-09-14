---
layout: base
title: Cayman Theme Gamified
permalink: /cayman-theme-game/
---

<style>
  canvas {
    background: #eee;
    display: block;
    margin: 0 auto;
    border: 1px solid #333;
  }

  /* Popup styles */
  #docChallenge {
    max-width: 760px;
    margin: 10px auto;
    padding: 14px;
    border-radius: 10px;
    background: linear-gradient(180deg,#fff,#fafafa);
    border: 1px solid #ccc;
    text-align: center;
    font-family: system-ui, Arial, sans-serif;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    color: black; /* font color black */
  }

  #docChallenge a {
    color: #d63384;
    font-weight: 700;
  }

  #docInput {
    padding: 8px;
    font-size: 14px;
    margin-right: 8px;
    width: 55%;
    border-radius: 6px;
    border: 1px solid #bbb;
  }

  #docSubmit {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #666;
    background: #fff;
    cursor: pointer;
    color: black;
  }

  #docInstructions {
    font-size: 13px;
    color: black;
    margin-top: 8px;
  }
</style>

<canvas id="gameCanvas" width="600" height="400"></canvas>

<button id="nextLevelBtn" style="display:none;margin:10px auto 0;padding:10px 16px;font-family:system-ui,Arial;font-size:16px;font-weight:600;border:1px solid #222;background:#fff;cursor:pointer;border-radius:8px;display:block;max-width:600px;color:#111 !important;">
  Next Level ▶
</button>

<!-- Hack Popup for Documentation Challenge -->
<style>
  /* Force all text inside #docChallenge to be dark black and bold */
  #docChallenge, 
  #docChallenge * {
    color: #0d0d0d !important;
    font-weight: bold !important;
  }

  #docChallenge a {
    color: #d63384 !important; /* pink link color for visibility */
    text-decoration: underline;
  }

  #docChallenge input {
    padding: 6px;
    font-size: 14px;
    width: 55%;
    border-radius: 6px;
    border: 1px solid #bbb;
    background-color: #222;  /* dark background */
    color: #ffffff !important; /* white text */
  }

  #docChallenge button {
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #666;
    background: #fff;
    cursor: pointer;
    color: #0d0d0d;
  }

  #docChallenge p {
    margin: 6px 0;
    font-size: 16px;
  }

  #docInstructions {
    font-size: 13px;
    margin-top: 8px;
    color: #0d0d0d !important;
  }
</style>

<div id="docChallenge" style="display:none;">
  <p>
    🎉 You discovered Professor Mort's <strong>Pink Knowledge Brick</strong>! 🎉
  </p>
  <p>
    To proceed, open and read the theme documentation below, then paste the summary from the <em>very bottom</em> of that page into the box.
  </p>
  <p>
    <a id="docLink" href="https://pages.opencodingsociety.com/github/pages/theme" target="_blank" rel="noopener">
      Open Theme Documentation (opens in a new tab)
    </a>
  </p>
  <div style="margin-top:8px;">
    <input id="docInput" type="text" placeholder="Paste the summary from the bottom of the docs here">
    <button id="docSubmit" onclick="checkDocAnswer()">Submit</button>
  </div>
  <p id="docInstructions">
    (Tip: look for keywords like <em>Makefile</em>, <em>_themes</em>, and <em>opencs.html</em> at the bottom.)
  </p>
</div>

<script>
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const nextLevelBtn = document.getElementById("nextLevelBtn");

  let level = 1;
  const levelSpeedScale = 1.12;
  let paused = false;

  // Paddle
  let paddleHeight = 10;
  let basePaddleWidth = 75;
  let paddleWidth = basePaddleWidth;
  let paddleX = (canvas.width - paddleWidth) / 2;

  let rightPressed = false;
  let leftPressed = false;

  // Ball
  let ballRadius = 8;
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 5;
  let dy = -5;

  let score = 0;
  let lives = 3;

  // Blocks
  let brickRowCount = 4;
  const brickColumnCount = 6;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 50;

  let bricks = [];
  const powerUpChance = 0.3;

  function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        const hasPowerUp = Math.random() < powerUpChance;

        
        // Place five pink bricks at different positions
        const isHack = (
        (c===1 && r===1) ||
        (c===3 && r===0) ||
        (c===4 && r===2) 
        
        );


        bricks[c][r] = { x:0, y:0, status:1, powerUp:hasPowerUp, hack:isHack };
      }
    }
  }
  initBricks();

  // Powerups
  let powerUps = [];
  const powerUpSize = 20;
  const powerUpFallSpeed = 1.5;
  let activePowerUp = null;
  let powerUpTimer = 0;
  const powerUpDuration = 5000;

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  document.addEventListener("mousemove", mouseMoveHandler);

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
  }

  function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

  // Collision detection
  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        let b = bricks[c][r];
        if (b.status === 1) {
          if (x > b.x && x < b.x + brickWidth &&
              y > b.y && y < b.y + brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;

            if (b.hack) {
              paused = true;
              document.getElementById("docChallenge").style.display = "block";
              return;
            }

            if (b.powerUp) {
              powerUps.push({ x: b.x + brickWidth / 2, y: b.y, active: true });
            }
          }
        }
      }
    }
  }

  function remainingBricks() {
    let count = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) count++;
      }
    }
    return count;
  }

  // Powerup drawing
  function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
      let p = powerUps[i];
      if (p.active) {
        let gradient = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, powerUpSize);
        gradient.addColorStop(0,"yellow");
        gradient.addColorStop(1,"red");

        ctx.beginPath();
        ctx.arc(p.x, p.y, powerUpSize/2, 0, Math.PI*2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("P", p.x, p.y);

        p.y += powerUpFallSpeed;

        if (p.y + powerUpSize/2 >= canvas.height - paddleHeight &&
            p.x > paddleX &&
            p.x < paddleX + paddleWidth) {
          p.active = false;
          paddleWidth = basePaddleWidth + 40;
          activePowerUp = "Wide Paddle";
          powerUpTimer = Date.now();
        }

        if (p.y > canvas.height) {
          p.active = false;
        }
      }
    }
  }

  function drawPowerUpTimer() {
    if (activePowerUp) {
      let elapsed = Date.now() - powerUpTimer;
      let remaining = Math.max(0, powerUpDuration - elapsed);
      let barHeight = 100;
      let barWidth = 10;
      let fillHeight = (remaining / powerUpDuration) * barHeight;

      ctx.fillStyle = "gray";
      ctx.fillRect(canvas.width - 20, 20, barWidth, barHeight);

      ctx.fillStyle = "lime";
      ctx.fillRect(canvas.width - 20, 20 + (barHeight - fillHeight), barWidth, fillHeight);

      ctx.strokeStyle = "black";
      ctx.strokeRect(canvas.width - 20, 20, barWidth, barHeight);

      if (remaining <= 0) {
        activePowerUp = null;
        paddleWidth = basePaddleWidth;
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);

          if (bricks[c][r].hack) {
            ctx.fillStyle = "pink";
            ctx.shadowColor = "magenta";
            ctx.shadowBlur = 10;
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.font = "8px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Mort's Insights", brickX + brickWidth/2, brickY + brickHeight/2);
            ctx.shadowBlur = 0;
          } else if (bricks[c][r].powerUp) {
            ctx.fillStyle = "gold";
            ctx.shadowColor = "orange";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "#0095DD";
            ctx.shadowBlur = 0;
            ctx.fill();
          }

          ctx.closePath();
        }
      }
    }
  }

  function resetBallAndPaddle() {
    const speed = Math.hypot(dx, dy);
    x = canvas.width/2;
    y = canvas.height-30;
    const angle = (Math.PI/6) + Math.random()*(Math.PI/3);
    const sign = Math.random() < 0.5 ? -1 : 1;
    dx = sign * speed * Math.cos(angle);
    dy = -Math.abs(speed * Math.sin(angle));
    paddleX = (canvas.width - paddleWidth)/2;
    powerUps = [];
    activePowerUp = null;
    paddleWidth = basePaddleWidth;
  }

  function nextLevel() {
    const currentSpeed = Math.hypot(dx, dy) * levelSpeedScale;
    const theta = Math.atan2(dy, dx);
    dx = currentSpeed * Math.cos(theta);
    dy = currentSpeed * Math.sin(theta);

    level++;
    if (brickRowCount < 8) brickRowCount++;
    initBricks();
    resetBallAndPaddle();

    paused = false;
    nextLevelBtn.style.display = "none";
    requestAnimationFrame(draw);
  }

  nextLevelBtn.addEventListener("click", nextLevel);

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }

  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUps();
    drawPowerUpTimer();
    drawScore();
    drawLives();
    collisionDetection();

    if (!paused && remainingBricks() === 0) {
      paused = true;
      nextLevelBtn.style.display = "block";
      return;
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
      else {
        lives--;
        if (!lives) {
          alert("GAME OVER");
          document.location.reload();
        } else {
          x = canvas.width/2;
          y = canvas.height-30;
          dx = 2 * Math.sign(dx);
          dy = -2;
          paddleX = (canvas.width - paddleWidth)/2;
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;

    if (!paused) requestAnimationFrame(draw);
  }

  // Documentation hack logic
  function checkDocAnswer() {
    const input = document.getElementById("docInput").value.trim().toLowerCase();
    const keywords = ["makefile","_themes","opencs.html","override","layouts"];
    let hits = keywords.filter(k => input.includes(k)).length;

    if (hits >= 2) {
      score = 9999;
      alert(`🎉 Congratulations! You read the sacred theme scrolls. Your final max score is ${score}. Mr. Mortensen salutes you! 🎉`);
      document.location.reload();
    } else {
      lives--;
      if (lives <= 0) {
        alert("💀 Hey! You skipped your homework again. GAME OVER, courtesy of Mr. Mort!");
        document.location.reload();
      } else {
        alert("⚠️ Wrong answer! You lose a life for not reading Mr. Mort's wise words!");
        document.getElementById("docChallenge").style.display = "none";
        paused = false;
        draw();
      }
    }
  }

  draw();
</script>
