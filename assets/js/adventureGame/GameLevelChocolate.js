
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';

class GameLevelChocolate {
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
      greeting: "I need to learn how to use make to dynamically change my themes!",
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
    const sprite_src_yellow = path + "/images/mm/yellowanim.png"; 
    const YELLOW_SCALE_FACTOR = 6;
    const sprite_data_yellow = {
      id: 'Yellow M&M',
      greeting: "Go look at the make file! (https://github.com/Open-Coding-Society/pages/blob/main/Makefile). You should see sections for each theme such as use-cayman",
      src: sprite_src_yellow,
      SCALE_FACTOR: YELLOW_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 50, y: height - (height / YELLOW_SCALE_FACTOR)-350 }, 
      pixels: { height: 35, width: 180 },
      orientation: { rows: 1, columns: 5 },
      down: { row: 0, start: 0, columns: 5 },
      left: { row: 1, start: 0, columns: 5 },
      right: { row: 0, start: 0, columns: 5 },
      up: { row: 0, start: 0, columns: 5 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
    };

    const sprite_src_green = path + "/images/mm/greenanim.png"; 
    const GREEN_SCALE_FACTOR = 6;
    const sprite_data_green = {
      id: 'Green M&M',
      greeting: "Pick your favorite theme.  The Makefile includes targets to copy the appropriate config, Gemfile, and layouts from _themes/<theme>/ Here are the specific targets you can make: (1) make use-minima (2) make use-text (3) make use-cayman (4) make use-so-simpleand run the make command!",
      src: sprite_src_green,
      SCALE_FACTOR: GREEN_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 900, y: height - (height / GREEN_SCALE_FACTOR)-300 }, 
      pixels: { height: 36, width: 108 },
      orientation: { rows: 1, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      left: { row: 1, start: 0, columns: 3 },
      right: { row: 0, start: 0, columns: 3 },
      up: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
    };

    const sprite_src_blue = path + "/images/mm/blueanim.png"; 
    const BLUE_SCALE_FACTOR = 6;
    const sprite_data_blue = {
      id: 'Blue M&M',
      greeting: "Now show me what you have learned. Press E to start the quiz.",
      src: sprite_src_blue,
      SCALE_FACTOR: BLUE_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 1300, y: height - (height / BLUE_SCALE_FACTOR)-50 }, 
      pixels: { height: 36, width: 144 },
      orientation: { rows: 1, columns: 4 },
      down: { row: 0, start: 0, columns: 4 },
      left: { row: 1, start: 0, columns: 4 },
      right: { row: 0, start: 0, columns: 4 },
      up: { row: 0, start: 0, columns: 4 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      interact: () => {
        this.triggerQuiz();
      }
    };

    // ===== QUIZ SETUP (inline, no extra file) =====
    this.quizQuestions = [
      {
        question: "Which of the following is a valid command from the Makefile?",
        options: ["make use-minima", "make install-theme", "make setup-layouts"],
        answer: 0
      },
      {
        question: "According to the Makefile, which command would you use to switch to the 'text' theme?",
        options: [
          "make theme-text",
          "make text-install",
          "make use-text"
        ],
        answer: 2
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
      { class: Npc, data: sprite_data_yellow },
      { class: Npc, data: sprite_data_green },
      { class: Npc, data: sprite_data_blue }
    ];
  }

  triggerQuiz() {
  let currentIndex = 0;

  const nextQuestion = () => {
    if (currentIndex < this.quizQuestions.length) {
      this.showQuestion(currentIndex, (correct) => {
        if (correct) {
          alert("Correct! 🎉");
          currentIndex++;
          nextQuestion(); // next
        } else {
          alert("Oops, try again!");
          nextQuestion(); // retry same
        }
      });
    } else {
      alert("🎉 Quiz complete!");
      this.quizContainer.style.display = "none"; // hide when done
    }
  };

  nextQuestion(); // start
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
    };
    this.quizContainer.appendChild(btn);
  });

  this.quizContainer.style.display = "block";
  };

  }


export default GameLevelChocolate;
