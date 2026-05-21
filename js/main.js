// main.js for Cat Elementary
// Main entry point that boots up the game engine on window load

import { Game } from "./Game.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log("🐾 Booting Cat Elementary Puzzle RPG...");
  Game.init();
});
