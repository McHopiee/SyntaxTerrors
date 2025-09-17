// Minimal desert level: only background and player
import GameEnvBackground from 'images/m&m/M&M_background.png';
import Player from './GameEngine/Player.js';

class GameLevelSummer {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // Background data
    const image_src_summer = path + "/images/mm/summer.png";
    const image_data_summer = {
      name: 'summer',
      greeting: "Welcome to the desert!  It is hot and dry here, but there are many adventures to be had!",
      src: image_src_summer,
      pixels: { height: 1008, width: 1796 }
    };

    // Player data
    const sprite_src_blank = path + "/images/mm/blankwalking.png";
    const BLANK_SCALE_FACTOR = 6;
    const sprite_data_blank = {
      id: 'Chill Guy',
      greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
      src: sprite_src_blank,
      SCALE_FACTOR: BLANK_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 20,
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

    // Only background and player in this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_summer },
      { class: Player, data: sprite_data_blank }
    ];
  }
}

export default GameLevelSummer;
