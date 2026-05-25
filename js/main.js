// main.js for Cat Elementary
// Main entry point that boots up the game engine on window load

import { Game } from "./Game.js";
import { MapEngine } from "./Map.js";
import { PuzzleRunner } from "./PuzzleRunner.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log("🐾 Booting Cat Elementary Puzzle RPG...");
  Game.init();
  
  // Expose key game instances globally for console testing/debugging
  window.Game = Game;
  window.MapEngine = MapEngine;
  window.PuzzleRunner = PuzzleRunner;
});
