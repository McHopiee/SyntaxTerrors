---
layout: base
title: Games Hub
permalink: /games/
---

# 🎮 Games Hub

> Click any game below to play!

<div style="display: flex; flex-wrap: wrap; gap: 10px;">

  <button class="btn-md btn-rounded btn-gameblue" onclick="window.location.href='/SyntaxTerrors/snake/'">
    Snake Game
  </button>

  <button class="btn-md btn-rounded btn-gamepurple" onclick="window.location.href='/game2'">
    Game 2
  </button>

  <button class="btn-md btn-rounded btn-gamepink" onclick="window.location.href='/SyntaxTerrors/pong'">
    Pong
  </button>

  <button class="btn-md btn-rounded btn-gamemagenta" onclick="window.location.href='/game4'">
    Game 4
  </button>

</div>

<style>
/* size and style */
.btn-md {
  padding: 7px 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  border-radius: 2.5rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Muted game button colors */
.btn-gameblue {
  background: linear-gradient(135deg, #1e2b3d, #2c3d5a);
  box-shadow: 0 4px 10px rgba(44, 61, 90, 0.3);
}
.btn-gamepurple {
  background: linear-gradient(135deg, #332841, #4a3b5f);
  box-shadow: 0 4px 10px rgba(74, 59, 95, 0.3);
}
.btn-gamepink {
  background: linear-gradient(135deg, #3a1f2d, #5a3a4c);
  box-shadow: 0 4px 10px rgba(90, 58, 76, 0.3);
}
.btn-gamemagenta {
  background: linear-gradient(135deg, #3c1a34, #5d3750);
  box-shadow: 0 4px 10px rgba(93, 55, 80, 0.3);
}

/* Hover effects */
.btn-gameblue:hover {
  transform: scale(1.07);
  box-shadow: 0 6px 14px rgba(44, 61, 90, 0.45);
}
.btn-gamepurple:hover {
  transform: scale(1.07);
  box-shadow: 0 6px 14px rgba(74, 59, 95, 0.45);
}
.btn-gamepink:hover {
  transform: scale(1.07);
  box-shadow: 0 6px 14px rgba(90, 58, 76, 0.45);
}
.btn-gamemagenta:hover {
  transform: scale(1.07);
  box-shadow: 0 6px 14px rgba(93, 55, 80, 0.45);
}
</style>
