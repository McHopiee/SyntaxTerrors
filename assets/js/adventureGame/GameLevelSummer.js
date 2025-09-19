import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';

// ⬅️ adjust this import to match your actual next level
import GameLevelChocolate from './GameLevelChocolate.js';

class GameLevelSummer {
  constructor(gameEnv) {
    this.gameEnv = gameEnv; // keep reference for later
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // background
    const image_src_summer = path + "/images/mm/mm_background_mountains.png";
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

    // npcs
    const sprite_src_red = path + "/images/mm/redanim.png"; 
    const RED_SCALE_FACTOR = 6;
    const sprite_data_red = {
      id: 'Red M&M',
      greeting: "Open up your VSCode by running the command code . in terminal!",
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
      greeting: `Activate your virtual environment by running the following commands in your terminal:\n (1) ./scripts/activate.sh\n (2) python3 -m venv venv\n (3) source venv/bin/activate`,
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

    const sprite_src_portal = path + "/images/mm/greenportal.png"; 
    const PORTAL_SCALE_FACTOR = 6;
    const sprite_data_portal = {
      id: 'Mysterious Portal',
      greeting: "Answer my quiz to continue! Press E to take the quiz.",
      src: sprite_src_portal,
      SCALE_FACTOR: PORTAL_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 1300, y: height - (height / PORTAL_SCALE_FACTOR)-50 }, 
      pixels: { height: 200, width: 252 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      left: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      up: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      interact: () => {
        this.triggerQuiz();
      }
    };

    // ===== QUIZ SETUP =====
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
    this.quizContainer.style.display = "none"; 
    document.body.appendChild(this.quizContainer);

    // Classes used in the game
    this.classes = [
      { class: GameEnvBackground, data: image_data_summer },
      { class: Player, data: sprite_data_blank },
      { class: Npc, data: sprite_data_red },
      { class: Npc, data: sprite_data_orange },
      { class: Npc, data: sprite_data_portal, onInteract: () => this.triggerQuiz() }
    ];
  }

  loadLevel(levelClass) {
    this.currentLevel = new levelClass(this); // Create a new instance of the level
    this.currentLevel.init(); // Initialize the new level (if applicable)
  }

  triggerQuiz() {
    let currentIndex = 0;

    const nextQuestion = () => {
      if (currentIndex < this.quizQuestions.length) {
        this.showQuestion(currentIndex, (correct) => {
          if (correct) {
            alert("Correct! 🎉");
            currentIndex++;
            nextQuestion();
          } else {
            alert("Oops, try again!");
            nextQuestion();
          }
        });
      } else {
        alert("🎉 Quiz complete!");
        this.quizContainer.style.display = "none";

        // 🚪 Transport player to GameLevelChocolate
        if (this.gameEnv && typeof this.gameEnv.loadLevel === "function") {
          console.log("Loading GameLevelChocolate...");
          this.gameEnv.loadLevel(GameLevelChocolate);
        } else {
          console.error("gameEnv.loadLevel is not a function or gameEnv is undefined.");
        }
      }
    };

    nextQuestion();
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
        callback(i === q.answer);
      };
      this.quizContainer.appendChild(btn);
    });

    this.quizContainer.style.display = "block";
  }
}

export default GameLevelSummer;
