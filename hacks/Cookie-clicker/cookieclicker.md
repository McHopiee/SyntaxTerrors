---
layout: base
title: Cookie Clicker
permalink: /cookie-clicker-game/
---

<div class="grid grid-cols-4 gap-4 aspect-square">
  <!-- Shop -->
  <div class="col-span-1 bg-white p-4 shadow-lg flex flex-col" id="shop-container">
    <div class="text-xl font-bold mb-4 text-center">SHOP</div>
    <div id="shop-items"></div>
  </div>

  <!-- Game -->
  <div id="game-area" class="col-span-3 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-orange-200 rounded-2xl shadow-xl relative overflow-hidden">
    <!-- Title -->
    <div class="text-4xl font-extrabold mb-6 text-brown-800 drop-shadow-md tracking-wide">
      🍪 Cookie Clicker
    </div>

    <!-- Cookie Button -->
    <div id="cookie" 
      class="w-64 h-64 bg-cover bg-center rounded-full cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 ease-out flex items-center justify-center bg-white">
      <img src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png" class="w-full h-full rounded-full select-none pointer-events-none" />
    </div>

    <!-- Counter -->
    <div id="counter" class="mt-6 text-2xl font-semibold text-brown-900 bg-white/80 px-6 py-3 rounded-lg shadow-md">
      Cookies: <span id="cookie-count" class="font-bold text-orange-600">0</span>
    </div>

    <!-- CPS Display -->
    <div id="cps-counter" class="mt-2 text-lg font-medium text-brown-800">
      CPS: <span id="cps-value">0</span>
    </div>
  </div>
</div>

<script src="https://cdn.tailwindcss.com"></script>
<script>
  // Shop items definition
  const shopItems = [
    { id: "cursorBtn", name: "🖱️ Cursor", emoji: "🖱️", cost: 15, cps: 1, color: "green" },
    { id: "grandmaBtn", name: "👵 Grandma", emoji: "👵", cost: 100, cps: 5, color: "blue" },
    { id: "factoryBtn", name: "🏭 Factory", emoji: "🏭", cost: 1000, cps: 50, color: "purple" },
    { id: "bankBtn", name: "🏦 Bank", emoji: "🏦", cost: 10000, cps: 500, color: "pink" },
    { id: "templeBtn", name: "⛪ Temple", emoji: "⛪", cost: 50000, cps: 2000, color: "indigo" },
    { id: "portalBtn", name: "🌌 Portal", emoji: "🌌", cost: 500000, cps: 10000, color: "red" }
  ];

  // Game state
  let gameState = {
    cookies: 0,
    cps: 0,
    upgrades: {}
  };

  const cookieCountEl = document.getElementById("cookie-count");
  const cpsValueEl = document.getElementById("cps-value");
  const shopContainer = document.getElementById("shop-items");
  const gameArea = document.getElementById("game-area");

  // Create shop buttons
  shopItems.forEach(item => {
    const btn = document.createElement("button");
    btn.id = item.id;
    btn.textContent = `${item.name} (Cost: ${item.cost})`;
    btn.className = `bg-${item.color}-500 hover:bg-${item.color}-600 text-white px-4 py-2 mb-2 rounded shadow transition`;
    btn.addEventListener("click", () => buyUpgrade(item));
    shopContainer.appendChild(btn);
    gameState.upgrades[item.id] = { count: 0, cost: item.cost };
  });

  // Buy upgrade
  function buyUpgrade(item) {
    const upgrade = gameState.upgrades[item.id];
    if (gameState.cookies >= upgrade.cost) {
      gameState.cookies -= upgrade.cost;
      upgrade.count++;
      gameState.cps += item.cps;
      upgrade.cost = Math.floor(upgrade.cost * 1.25); // inflation
      document.getElementById(item.id).textContent = `${item.name} (Cost: ${upgrade.cost}) | Owned: ${upgrade.count}`;
      updateCounter();
      flyEmoji(item.emoji);
    }
  }

  // Cookie click
  document.getElementById("cookie").addEventListener("click", (e) => {
    gameState.cookies++;
    updateCounter();
    floatingText(e.pageX, e.pageY, "+1 🍪");
  });

  // Floating +1 animation
  function floatingText(x, y, text) {
    const floating = document.createElement("span");
    floating.textContent = text;
    floating.className = "absolute text-orange-600 font-bold";
    floating.style.left = x + "px";
    floating.style.top = y + "px";
    floating.style.pointerEvents = "none";
    floating.style.animation = "floatUp 1s ease-out forwards";
    document.body.appendChild(floating);
    setTimeout(() => floating.remove(), 1000);
  }

  // Flying emoji animation (when buying)
  function flyEmoji(emoji) {
    const fly = document.createElement("span");
    fly.textContent = emoji;
    fly.className = "absolute text-4xl";
    fly.style.left = Math.random() * (gameArea.offsetWidth - 50) + "px";
    fly.style.top = Math.random() * (gameArea.offsetHeight - 50) + "px";
    fly.style.animation = "flyAround 2s ease-out forwards";
    gameArea.appendChild(fly);
    setTimeout(() => fly.remove(), 2000);
  }

  // Update counters
  function updateCounter() {
    cookieCountEl.textContent = Math.floor(gameState.cookies);
    cpsValueEl.textContent = gameState.cps;
  }

  // Auto cookie generation
  setInterval(() => {
    gameState.cookies += gameState.cps;
    updateCounter();
  }, 1000);

  // Save/load
  function saveGame() {
    localStorage.setItem("cookieGame", JSON.stringify(gameState));
  }
  function loadGame() {
    const saved = localStorage.getItem("cookieGame");
    if (saved) {
      gameState = JSON.parse(saved);
      // Update shop buttons with costs + owned
      shopItems.forEach(item => {
        const upgrade = gameState.upgrades[item.id];
        if (upgrade) {
          document.getElementById(item.id).textContent = `${item.name} (Cost: ${upgrade.cost}) | Owned: ${upgrade.count}`;
        }
      });
      updateCounter();
    }
  }
  window.addEventListener("beforeunload", saveGame);
  window.addEventListener("load", loadGame);
</script>

<style>
@keyframes floatUp {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-50px); opacity: 0; }
}

@keyframes flyAround {
  0% { transform: translate(0,0) scale(1); opacity: 1; }
  50% { transform: translate(50px,-50px) scale(1.3); opacity: 0.8; }
  100% { transform: translate(-30px,60px) scale(0.8); opacity: 0; }
}
</style>
