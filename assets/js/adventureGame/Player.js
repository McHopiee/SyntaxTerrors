class Player {
  constructor(data, gameEnv) {
    this.id = data.id;
    this.src = data.src;
    this.SCALE_FACTOR = data.SCALE_FACTOR;
    this.pixels = data.pixels;
    this.keypress = data.keypress;

    // Physics
    this.x = data.INIT_POSITION.x;
    this.y = data.INIT_POSITION.y;
    this.groundY = data.physics.groundY;
    this.gravity = data.physics.gravity;
    this.jumpStrength = data.physics.jumpStrength;
    this.velocityY = 0;
    this.isJumping = false;

    // Movement speed
    this.speed = 5;

    // Key states
    this.keysDown = {};
    window.addEventListener("keydown", (e) => this.keysDown[e.keyCode] = true);
    window.addEventListener("keyup", (e) => this.keysDown[e.keyCode] = false);

    // Sprite image
    this.image = new Image();
    this.image.src = this.src;
  }

  update() {
    // Horizontal movement
    if (this.keysDown[this.keypress.left]) this.x -= this.speed;
    if (this.keysDown[this.keypress.right]) this.x += this.speed;

    // Jump
    if (this.keysDown[this.keypress.jump] && !this.isJumping) {
      this.velocityY = -this.jumpStrength;
      this.isJumping = true;
    }

    // Apply gravity
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    // Ground collision
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.velocityY = 0;
      this.isJumping = false;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.pixels.width * this.SCALE_FACTOR,
      this.pixels.height * this.SCALE_FACTOR
    );
  }
}

export default Player;
