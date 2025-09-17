
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';

class GameLevelSummer {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // Background data
    const image_src_summer = path + "images/mm/mm_background.png";
    const image_data_summer = {
      name: 'summer',
      greeting: "Welcome to the desert!  It is hot and dry here, but there are many adventures to be had!",
      src: image_src_summer,
      pixels: { height: 1535, width: 2730 }
    };

    // Player data
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

    // NPC data — can reuse blankwalking or a different sprite sheet
    const sprite_src_red = path + "/images/mm/redanim.png"; // add an npc.png to your images
    const RED_SCALE_FACTOR = 6;
    const sprite_data_red = {
      id: 'Red M&M',
      greeting: "Open up your VSCode!",
      src: sprite_src_red,
      SCALE_FACTOR: RED_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 900, y: height - (height / RED_SCALE_FACTOR)-400 }, // NPC stands to the right
      pixels: { height: 36, width: 180 },
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
      { class: Npc, data: sprite_data_red }
    ];
  }
}

export default GameLevelSummer;
