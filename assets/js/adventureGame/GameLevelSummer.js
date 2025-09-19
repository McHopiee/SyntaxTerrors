
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';

class GameLevelSummer {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // background
    const image_src_summer = path + "/images/mm/mm_background.png";
    const image_data_summer = {
      name: 'summer',
      greeting: "Welcome to the desert!  It is hot and dry here, but there are many adventures to be had!",
      src: image_src_summer,
      pixels: { height: 1535, width: 2730 }
    };

    // player
    const sprite_src_blank = path + "/images/mm/blankwalking.png";
    const BLANK_SCALE_FACTOR = 6;
    const sprite_data_blank = {
      id: 'Blank M&M',
      greeting: "I need to learn how to makes",
      src: sprite_src_blank,
      SCALE_FACTOR: BLANK_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 25,
      INIT_POSITION: { x: 0, y: height - (height / BLANK_SCALE_FACTOR) },
      pixels: { height: 70, width: 216 },
      orientation: { rows: 2, columns: 6 },
      down: { row: 0, start: 0, columns: 6 },
      downRight: { row: 0, start: 0, columns: 6, rotate: Math.PI / 16 },
      downLeft: { row: 1, start: 0, columns: 6, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 6 },
      right: { row: 0, start: 0, columns: 6 },
      up: { row: 0, start: 0, columns: 6 },
      upLeft: { row: 1, start: 0, columns: 6, rotate: Math.PI / 16 },
      upRight: { row: 0, start: 0, columns: 6, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    //npcs
    const sprite_src_red = path + "/images/mm/redanim.png"; 
    const RED_SCALE_FACTOR = 6;
    const sprite_data_red = {
      id: 'Red M&M',
      greeting: "Open up your VSCode using code . in terminal!",
      src: sprite_src_red,
      SCALE_FACTOR: RED_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 500, y: height - (height / RED_SCALE_FACTOR)-100 }, 
      pixels: { height: 36, width: 180 },
      orientation: { rows: 1, columns: 5 },
      down: { row: 0, start: 0, columns: 5 },
      left: { row: 1, start: 0, columns: 5 },
      right: { row: 0, start: 0, columns: 5 },
      up: { row: 0, start: 0, columns: 5 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
    };

    const sprite_src_orange = path + "/images/mm/orangeanim.png"; 
    const ORANGE_SCALE_FACTOR = 6;
    const sprite_data_orange = {
      id: 'Orange M&M',
      greeting: "Activate your virtual environment.",
      src: sprite_src_orange,
      SCALE_FACTOR: ORANGE_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 1000, y: height - (height / ORANGE_SCALE_FACTOR)-400 }, 
      pixels: { height: 35, width: 180 },
      orientation: { rows: 1, columns: 5 },
      down: { row: 0, start: 0, columns: 5 },
      left: { row: 1, start: 0, columns: 5 },
      right: { row: 0, start: 0, columns: 5 },
      up: { row: 0, start: 0, columns: 5 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_summer },
      { class: Player, data: sprite_data_blank },
      { class: Npc, data: sprite_data_red },
      { class: Npc, data: sprite_data_orange }
    ];
     const sprite_src_pink = path + "/images/mm/redanim.png"; 
    const PINK_SCALE_FACTOR = 6;
    const sprite_data_pink = {
      id: 'Pink M&M',
      greeting: "Answer my quiz to continue!",
      src: sprite_src_pink,
      SCALE_FACTOR: PINK_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 1000, y: height - (height / PINK_SCALE_FACTOR)-200 }, 
      pixels: { height: 35, width: 180 },
      orientation: { rows: 1, columns: 5 },
      down: { row: 0, start: 0, columns: 5 },
      left: { row: 1, start: 0, columns: 5 },
      right: { row: 0, start: 0, columns: 5 },
      up: { row: 0, start: 0, columns: 5 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      interact: () => {
        this.triggerQuiz();
      }
    };

    // ===== QUIZ SETUP (inline, no extra file) =====
    this.quizQuestions = [
      {
        question: "What command opens VSCode from terminal?",
        options: ["open .", "code .", "vscode start"],
        answer: 1
      },
      {
        question: "How do you activate a virtual environment?",
        options: [
          "python -m venv activate",
          "source venv/bin/activate",
          "pip install activate"
        ],
        answer: 1
      }
    ];

    this.quizContainer = document.createElement("div");
    this.quizContainer.style.position = "absolute";
    this.quizContainer.style.top = "50%";
    this.quizContainer.style.left = "50%";
    this.quizContainer.style.transform = "translate(-50%, -50%)";
    this.quizContainer.style.background = "white";
    this.quizContainer.style.padding = "20px";
    this.quizContainer.style.border = "3px solid black";
    this.quizContainer.style.zIndex = "9999";
    this.quizContainer.style.display = "none"; // hidden initially
    document.body.appendChild(this.quizContainer);

    // Classes used in the game
    this.classes = [
      { class: GameEnvBackground, data: image_data_summer },
      { class: Player, data: sprite_data_blank },
      { class: Npc, data: sprite_data_red },
      { class: Npc, data: sprite_data_orange },
      { class: Npc, data: sprite_data_pink, onInteract: () => this.triggerQuiz() }
    ];
  }

  triggerQuiz() {
    this.showQuestion(0, (correct) => {
      if (correct) {
        alert("Correct! 🎉");
      } else {
        alert("Oops, try again!");
      }
    });
  }

  showQuestion(index, callback) {
    const q = this.quizQuestions[index];
    this.quizContainer.innerHTML = `<h3>${q.question}</h3>`;

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.style.display = "block";
      btn.style.margin = "10px 0";
      btn.onclick = () => {
        callback(i === q.answer); // pass true if correct
        this.quizContainer.style.display = "none";
      };
      this.quizContainer.appendChild(btn);
    });

    this.quizContainer.style.display = "block";
  
  }
}

export default GameLevelSummer;
