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
  h2 {
    margin-top: 5px !important;
  }
  p {
    margin-bottom: 5px !important;
  }
</style>

<canvas id="gameCanvas" width="600" height="400"></canvas>

<!-- NEW: Next Level buttons -->
<button id="nextLevelBtn" style="display:none;margin:10px auto 0;padding:10px 16px;font-family:system-ui,Arial;font-size:16px;font-weight:600;border:1px solid #222;background:#fff;cursor:pointer;border-radius:8px;display:block;max-width:600px;color:#111 !important;">
  Next Level ▶
</button>



<script>
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const nextLevelBtn = document.getElementById("nextLevelBtn");

  // --- Levels / pause ---
  let level = 1;
  const levelSpeedScale = 1.12; // ball speed multiplier each level
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
  let dx = 2;
  let dy = -2;

  // Score and Lives
  let score = 0;
  let lives = 3;

  // Blocks
  let brickRowCount = 4;       // CHANGED: let (so we can increase rows)
  const brickColumnCount = 6;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 50;

  let bricks = [];
  const powerUpChance = 0.3; // 30% chance a brick contains a powerup

  function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        const hasPowerUp = Math.random() < powerUpChance;
        bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: hasPowerUp };
      }
    }
  }
  initBricks();

  // Powerups
  let powerUps = [];
  const powerUpSize = 20;
  const powerUpFallSpeed = 1.5;

  // Active powerup state
  let activePowerUp = null;
  let powerUpTimer = 0;
  const powerUpDuration = 5000; // 5 seconds

  // Input handling
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
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;

            score++;

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

  // Powerup mechanics
  function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
      let p = powerUps[i];
      if (p.active) {
        // Draw colorful circle with "P"
        let gradient = ctx.createRadialGradient(
          p.x, p.y, 5, p.x, p.y, powerUpSize
        );
        gradient.addColorStop(0, "yellow");
        gradient.addColorStop(1, "red");

        ctx.beginPath();
        ctx.arc(p.x, p.y, powerUpSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("P", p.x, p.y);

        // Move down
        p.y += powerUpFallSpeed;

        // Paddle catches powerup
        if (
          p.y + powerUpSize / 2 >= canvas.height - paddleHeight &&
          p.x > paddleX &&
          p.x < paddleX + paddleWidth
        ) {
          p.active = false;
          paddleWidth = basePaddleWidth + 40; // effect: enlarge paddle
          activePowerUp = "Wide Paddle";
          powerUpTimer = Date.now(); // start timer
        }

        // Missed powerup
        if (p.y > canvas.height) {
          p.active = false;
        }
      }
    }
  }

  // Draw timer bar if powerup active
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
      ctx.fillRect(
        canvas.width - 20,
        20 + (barHeight - fillHeight),
        barWidth,
        fillHeight
      );

      ctx.strokeStyle = "black";
      ctx.strokeRect(canvas.width - 20, 20, barWidth, barHeight);

      // If timer expired
      if (remaining <= 0) {
        activePowerUp = null;
        paddleWidth = basePaddleWidth;
      }
    }
  }

  // Drawing functions
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
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

          if (bricks[c][r].powerUp) {
            // Make powerup bricks glow yellow
            ctx.fillStyle = "gold";
            ctx.shadowColor = "orange";
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = "#0095DD";
            ctx.shadowBlur = 0;
          }

          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function resetBallAndPaddle() {
    // keep direction but reset position; adjust speed to current dx/dy magnitude
    const speed = Math.hypot(dx, dy);
    x = canvas.width / 2;
    y = canvas.height - 30;
    // random upward angle between 30° and 75°
    const angle = (Math.PI / 6) + Math.random() * (Math.PI / 3);
    const sign = Math.random() < 0.5 ? -1 : 1;
    dx = sign * speed * Math.cos(angle);
    dy = -Math.abs(speed * Math.sin(angle));
    paddleX = (canvas.width - paddleWidth) / 2;

    // clear any falling powerups
    powerUps = [];
    // reset active powerup on new level
    activePowerUp = null;
    paddleWidth = basePaddleWidth;
  }

  function nextLevel() {
    // Increase difficulty: speed up ball and add a row (up to fit)
    const currentSpeed = Math.hypot(dx, dy) * levelSpeedScale;
    const theta = Math.atan2(dy, dx);
    dx = currentSpeed * Math.cos(theta);
    dy = currentSpeed * Math.sin(theta);

    level++;
    if (brickRowCount < 8) brickRowCount++; // cap to keep on-screen

    initBricks();
    resetBallAndPaddle();

    // hide button and resume
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
    // Render current frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUps();
    drawPowerUpTimer();
    drawScore();
    drawLives();
    collisionDetection();

    // If all bricks cleared, pause and show Next Level button
    if (!paused && remainingBricks() === 0) {
      paused = true;
      nextLevelBtn.style.display = "block";
      // Do not schedule next frame; freeze the scene until button press
      return;
    }

    // Ball movement
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          alert("GAME OVER");
          document.location.reload(); // Restart game on miss
        } else {
          x = canvas.width/2; 
          y = canvas.height - 30;
          dx = 2 * Math.sign(dx);
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
        
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;

    if (!paused) requestAnimationFrame(draw);
  }

  // Start
  draw();
</script>
