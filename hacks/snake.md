---
layout: base
title: Snake Game
permalink: /snake/
---

<style>
    body { font-family: sans-serif; }
    .wrap { margin: auto; display: block; }
    canvas {
        display: none;
        border: 10px solid #FFFFFF;
    }
    canvas:focus { outline: none; }
    #gameover p, #setting p, #menu p { font-size: 20px; }
    #gameover a, #setting a, #menu a {
        font-size: 30px;
        display: block;
    }
    #gameover a:hover, #setting a:hover, #menu a:hover { cursor: pointer; }
    #gameover a:hover::before, #setting a:hover::before, #menu a:hover::before {
        content: ">";
        margin-right: 10px;
    }
    #menu { display: block; }
    #gameover { display: none; }
    #setting { display: none; }
    #setting input { display:none; }
    #setting label { cursor: pointer; }
    #setting input:checked + label {
        background-color: #FFF;
        color: #000;
    }
</style>

<h2>Snake</h2>
<div class="container">
    <p class="fs-4">Score: <span id="score_value">0</span></p>
    <div class="container bg-secondary" style="text-align:center;">
        <!-- Main Menu -->
        <div id="menu" class="py-4 text-light">
            <p>Welcome to Snake, press <span style="background:#fff; color:#000">space</span> to begin</p>
            <a id="new_game" class="link-alert">new game</a>
            <a id="setting_menu" class="link-alert">settings</a>
        </div>
        <!-- Game Over -->
        <div id="gameover" class="py-4 text-light">
            <p>Game Over, press <span style="background:#fff; color:#000">space</span> to try again</p>
            <a id="new_game1" class="link-alert">new game</a>
            <a id="setting_menu1" class="link-alert">settings</a>
        </div>
        <!-- Play Screen -->
        <canvas id="snake" class="wrap" width="320" height="320" tabindex="1"></canvas>
        <!-- Settings Screen -->
        <div id="setting" class="py-4 text-light">
            <p>Settings Screen, press <span style="background:#fff; color:#000">space</span> to go back</p>
            <a id="new_game2" class="link-alert">new game</a>
            <br>
            <p>Speed:
                <input id="speed1" type="radio" name="speed" value="150" checked/>
                <label for="speed1">Slow</label>
                <input id="speed2" type="radio" name="speed" value="100"/>
                <label for="speed2">Normal</label>
                <input id="speed3" type="radio" name="speed" value="60"/>
                <label for="speed3">Fast</label>
            </p>
            <p>Wall:
                <input id="wallon" type="radio" name="wall" value="1" checked/>
                <label for="wallon">On</label>
                <input id="walloff" type="radio" name="wall" value="0"/>
                <label for="walloff">Off</label>
            </p>
        </div>
    </div>
</div>

<script>
(function(){
    const DIRECTION = { UP:0, RIGHT:1, DOWN:2, LEFT:3 };
    const SCREEN = { MENU:-1, GAME:0, GAME_OVER:1, SETTING:2 };

    class SnakeGame {
        constructor(canvas, scoreElem) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.scoreElem = scoreElem;
            this.blockSize = 10;
            this.reset();
        }

        reset() {
            this.snake = [{x: 5, y: 15}];
            this.snakeDir = DIRECTION.RIGHT;
            this.snakeNextDir = DIRECTION.RIGHT;
            this.score = 0;
            this.updateScore();
            this.addFood();
            this.running = true;
            this.paused = false;
            this.lastTime = 0;
        }

        updateScore() {
            this.scoreElem.textContent = this.score;
        }

        addFood() {
            let valid = false;
            while (!valid) {
                this.food = {
                    x: Math.floor(Math.random() * (this.canvas.width / this.blockSize)),
                    y: Math.floor(Math.random() * (this.canvas.height / this.blockSize))
                };
                valid = !this.snake.some(p => p.x === this.food.x && p.y === this.food.y);
            }
        }

        changeDir(keyCode) {
            const opposites = {
                [DIRECTION.UP]: DIRECTION.DOWN,
                [DIRECTION.DOWN]: DIRECTION.UP,
                [DIRECTION.LEFT]: DIRECTION.RIGHT,
                [DIRECTION.RIGHT]: DIRECTION.LEFT
            };
            const keyMap = {
                37: DIRECTION.LEFT,
                38: DIRECTION.UP,
                39: DIRECTION.RIGHT,
                40: DIRECTION.DOWN
            };
            if (keyCode in keyMap) {
                let newDir = keyMap[keyCode];
                if (newDir !== opposites[this.snakeDir]) {
                    this.snakeNextDir = newDir;
                }
            }
            if (keyCode === 80) { // P = pause
                this.paused = !this.paused;
            }
        }

        move() {
            let head = {...this.snake[0]};
            this.snakeDir = this.snakeNextDir;
            switch (this.snakeDir) {
                case DIRECTION.UP: head.y--; break;
                case DIRECTION.RIGHT: head.x++; break;
                case DIRECTION.DOWN: head.y++; break;
                case DIRECTION.LEFT: head.x--; break;
            }
            // Wall check
            if (this.wall === 1) {
                if (head.x < 0 || head.x >= this.canvas.width/this.blockSize ||
                    head.y < 0 || head.y >= this.canvas.height/this.blockSize) {
                    return false;
                }
            } else {
                if (head.x < 0) head.x += this.canvas.width/this.blockSize;
                if (head.x >= this.canvas.width/this.blockSize) head.x = 0;
                if (head.y < 0) head.y += this.canvas.height/this.blockSize;
                if (head.y >= this.canvas.height/this.blockSize) head.y = 0;
            }
            // Self collision
            if (this.snake.some(p => p.x === head.x && p.y === head.y)) {
                return false;
            }
            this.snake.unshift(head);
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score++;
                this.updateScore();
                this.addFood();
            } else {
                this.snake.pop();
            }
            return true;
        }

        drawBlock(x,y,color="#fff") {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x*this.blockSize,y*this.blockSize,this.blockSize,this.blockSize);
        }

        render() {
            this.ctx.fillStyle = "royalblue";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
            this.snake.forEach(p => this.drawBlock(p.x,p.y));
            this.drawBlock(this.food.x,this.food.y,"#f00");
        }

        loop = (time) => {
            if (!this.running) return;
            if (this.paused) {
                requestAnimationFrame(this.loop);
                return;
            }
            if (time - this.lastTime > this.speed) {
                if (!this.move()) {
                    this.running = false;
                    showScreen(SCREEN.GAME_OVER);
                    return;
                }
                this.render();
                this.lastTime = time;
            }
            requestAnimationFrame(this.loop);
        }
    }

    // DOM Elements
    const canvas = document.getElementById("snake");
    const eleScore = document.getElementById("score_value");
    const screen_menu = document.getElementById("menu");
    const screen_game_over = document.getElementById("gameover");
    const screen_setting = document.getElementById("setting");

    let game;
    let currentScreen = SCREEN.MENU;

    function showScreen(screen) {
        currentScreen = screen;
        screen_menu.style.display = (screen===SCREEN.MENU)?"block":"none";
        screen_game_over.style.display = (screen===SCREEN.GAME_OVER)?"block":"none";
        screen_setting.style.display = (screen===SCREEN.SETTING)?"block":"none";
        canvas.style.display = (screen===SCREEN.GAME || screen===SCREEN.GAME_OVER)?"block":"none";
    }

    function newGame() {
        game = new SnakeGame(canvas,eleScore);
        // settings
        const speedSetting = document.querySelector("input[name='speed']:checked").value;
        const wallSetting = document.querySelector("input[name='wall']:checked").value;
        game.speed = parseInt(speedSetting);
        game.wall = parseInt(wallSetting);
        canvas.focus();
        showScreen(SCREEN.GAME);
        requestAnimationFrame(game.loop);
    }

    // Event Listeners
    document.getElementById("new_game").onclick = newGame;
    document.getElementById("new_game1").onclick = newGame;
    document.getElementById("new_game2").onclick = newGame;
    document.getElementById("setting_menu").onclick = ()=>showScreen(SCREEN.SETTING);
    document.getElementById("setting_menu1").onclick = ()=>showScreen(SCREEN.SETTING);

    window.addEventListener("keydown",(e)=>{
        if (e.code==="Space" && currentScreen!==SCREEN.GAME) {
            newGame();
        } else if (currentScreen===SCREEN.GAME) {
            game.changeDir(e.keyCode);
        }
    });
})();
</script>
