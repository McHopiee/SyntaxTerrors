import GameLevelSummer from './GameLevelSummer.js';

// Setup canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Fake gameEnv object to pass in
const gameEnv = {
  innerWidth: canvas.width,
  innerHeight: canvas.height,
  path: "." // adjust if your images are in /public or another folder
};

// Load the level
const level = new GameLevelSummer(gameEnv);
const background = new level.classes[0].class(level.classes[0].data, gameEnv);
const player = new level.classes[1].class(level.classes[1].data, gameEnv);
const npc = new level.classes[2].class(level.classes[2].data, gameEnv);

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background (simple fill for now)
  if (background.image) {
    ctx.drawImage(
      background.image,
      0,
      0,
      canvas.width,
      canvas.height
    );
  } else {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Update + draw entities
  player.update();
  player.draw(ctx);

  npc.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
