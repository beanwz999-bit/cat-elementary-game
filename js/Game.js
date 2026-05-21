// Game.js for Cat Elementary
// Central state and view manager. Bridges RPG exploration and puzzle modalities.

import { SaveSystem } from "./SaveSystem.js";
import { CatRenderer, CAT_BREEDS } from "./CatRenderer.js";
import { MapEngine } from "./Map.js";
import { PuzzleRunner } from "./PuzzleRunner.js";
import { BOSS_QUESTIONS } from "./questions.js";

export const Game = {
  state: {
    players: [],         // array of { name, breed, color }
    unlockedGrade: 0,    // 0 = K, 1 = 1st, etc., 6 = Boss
    completedPuzzles: {} // "gradeIndex": ["math", "reading", "science", "test"]
  },

  activePlayerCount: 1,
  gameLoopId: null,
  
  // Boss Battle state
  bossHp: 100,
  bossQuestionIdx: 0,
  bossActivePlayerIdx: 0,

  init() {
    this.bindStartScreen();
    this.bindCustomizer();
    
    // Save Progress HUD button
    document.getElementById("save-progress-btn").addEventListener("click", () => {
      this.saveProgress(true);
    });

    // Save & Quit menu button
    document.getElementById("save-quit-btn").addEventListener("click", () => {
      this.saveProgress(false);
      this.exitToMenu();
    });

    // Reset Confirmation buttons
    document.getElementById("confirm-cancel-btn").addEventListener("click", () => {
      this.hideResetConfirmation();
    });
    document.getElementById("confirm-ok-btn").addEventListener("click", () => {
      this.resetProgress();
    });
    
    // Minigame modal close button
    document.getElementById("minigame-close-btn").addEventListener("click", () => {
      PuzzleRunner.close();
    });
    
    // Victory restart button
    document.getElementById("victory-restart-btn").addEventListener("click", () => {
      document.getElementById("victory-modal").classList.add("hidden");
      this.exitToMenu();
    });

    // Graduation close button
    document.getElementById("grad-close-btn").addEventListener("click", () => {
      document.getElementById("grad-modal").classList.add("hidden");
      this.enterHallway(this.state.unlockedGrade);
    });
  },

  /**
   * Bind start menu buttons
   */
  bindStartScreen() {
    // Start Game button takes user to the Profiles Screen
    document.getElementById("start-game-btn").addEventListener("click", () => {
      this.showScreen("profiles-screen");
      this.renderProfiles();
    });

    // Profiles Screen Back to Menu button
    document.getElementById("profiles-back-btn").addEventListener("click", () => {
      this.showScreen("start-screen");
    });

    // Quick Play button
    document.getElementById("quick-play-btn").addEventListener("click", () => {
      this.activeProfileIdx = null;
      this.showScreen("customizer-screen");
      this.renderCustomizerPlayers();
    });
  },

  /**
   * Show/Hide screen wrapper
   */
  showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
    screens.forEach(s => {
      s.classList.remove("active");
      s.style.opacity = 0;
    });

    const active = document.getElementById(screenId);
    active.classList.add("active");
    // Force redraw layout then fade-in
    setTimeout(() => {
      active.style.opacity = 1;
    }, 50);

    // Stop/start Canvas game loop
    if (screenId === "exploration-screen") {
      this.startLoop();
    } else {
      this.stopLoop();
    }
  },



  /**
   * Initialize customizer event handlers
   */
  bindCustomizer() {
    const selectorButtons = document.querySelectorAll(".player-count-selector .btn-selector");
    selectorButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        selectorButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activePlayerCount = parseInt(btn.dataset.players);
        this.renderCustomizerPlayers();
      });
    });

    document.getElementById("customizer-back-btn").addEventListener("click", () => {
      this.showScreen("profiles-screen");
      this.renderProfiles();
    });

    document.getElementById("customizer-start-btn").addEventListener("click", () => {
      this.startNewGame();
    });
  },

  /**
   * Render customizer options for chosen number of players
   */
  renderCustomizerPlayers() {
    const container = document.querySelector(".players-setup-container");
    container.innerHTML = "";

    const defaultNames = ["Milo", "Bella", "Oreo"];
    const defaultColors = ["#ff3333", "#3498db", "#f1c40f"];
    const breedIds = Object.keys(CAT_BREEDS);
    const collarColors = ["#ff3333", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#ff7e5f"];

    for (let i = 0; i < this.activePlayerCount; i++) {
      const card = document.createElement("div");
      card.className = "player-card";
      
      const defaultName = defaultNames[i];
      const defaultColor = defaultColors[i % defaultColors.length];
      const defaultBreed = breedIds[i % breedIds.length];

      card.innerHTML = `
        <h3>Kitten Player ${i + 1}</h3>
        <div class="cat-preview-box" id="preview-${i}">
          ${CatRenderer.getSVG(defaultBreed, defaultColor)}
        </div>
        
        <div class="customizer-input-group">
          <label>Kitten Name:</label>
          <input type="text" id="name-${i}" value="${defaultName}" maxlength="8" placeholder="Enter name...">
        </div>

        <div class="customizer-input-group">
          <label>Cat Breed:</label>
          <select id="breed-${i}">
            ${breedIds.map(bid => `<option value="${bid}" ${bid === defaultBreed ? "selected" : ""}>${CAT_BREEDS[bid].name}</option>`).join("")}
          </select>
        </div>

        <div class="customizer-input-group">
          <label>Collar Color:</label>
          <div class="swatch-picker" id="swatches-${i}">
            ${collarColors.map(color => `
              <div class="swatch${color === defaultColor ? " active" : ""}" data-color="${color}" style="background-color: ${color};"></div>
            `).join("")}
          </div>
          <input type="hidden" id="collar-${i}" value="${defaultColor}">
        </div>
      `;

      container.appendChild(card);

      // Event handlers to update the preview in real-time
      const updatePreview = () => {
        const breed = document.getElementById(`breed-${i}`).value;
        const color = document.getElementById(`collar-${i}`).value;
        const previewBox = document.getElementById(`preview-${i}`);
        previewBox.innerHTML = CatRenderer.getSVG(breed, color);
      };

      document.getElementById(`breed-${i}`).addEventListener("change", updatePreview);

      // Bind swatch events
      const swatches = card.querySelectorAll(".swatch");
      swatches.forEach(swatch => {
        swatch.addEventListener("click", () => {
          const color = swatch.getAttribute("data-color");
          document.getElementById(`collar-${i}`).value = color;

          // Highlight the selected swatch
          card.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
          swatch.classList.add("active");

          updatePreview();
        });
      });
    }
  },

  /**
   * Extract customizer settings and start a fresh game
   */
  startNewGame() {
    this.state.players = [];
    this.state.unlockedGrade = 0;
    this.state.completedPuzzles = {};

    for (let i = 0; i < this.activePlayerCount; i++) {
      const name = document.getElementById(`name-${i}`).value.trim() || `Player ${i + 1}`;
      const breed = document.getElementById(`breed-${i}`).value;
      const color = document.getElementById(`collar-${i}`).value;

      this.state.players.push({ name, breed, color });
    }

    // Save initial state
    this.saveProgress();
    this.enterWorld();
  },

  /**
   * Load previous progress
   */
  loadSavedGame() {
    const saved = SaveSystem.load(this.activeProfileIdx);
    if (saved) {
      this.state = saved;
      this.enterWorld();
    }
  },

  saveProgress(showToast = false) {
    if (!this.activeProfileIdx) return;
    const saved = SaveSystem.save(this.activeProfileIdx, this.state);
    if (saved && showToast) {
      this.showToast("Progress Saved!");
    }
  },

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `<span>🐾</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Toast automatically animates out and gets removed
    setTimeout(() => {
      toast.remove();
    }, 2300);
  },

  renderProfiles() {
    for (let idx = 1; idx <= 3; idx++) {
      const statusDiv = document.getElementById(`profile-status-${idx}`);
      const actionsDiv = document.getElementById(`profile-actions-${idx}`);
      if (!statusDiv || !actionsDiv) continue;
      
      const saved = SaveSystem.load(idx);
      
      if (saved && SaveSystem.validateState(saved)) {
        const gradeName = this.getGradeFullName(saved.unlockedGrade);
        const playersHtml = saved.players.map(p => `
          <span class="save-status-cat-badge" style="border-left: 3px solid ${p.color};">
            🐾 ${p.name} (${p.breed})
          </span>
        `).join("");

        let puzzlesCount = 0;
        for (const grade in saved.completedPuzzles) {
          const subjects = saved.completedPuzzles[grade].filter(s => s !== "test");
          puzzlesCount += subjects.length;
        }

        statusDiv.innerHTML = `
          <div style="margin-bottom: 6px;"><strong>Grade:</strong> ${gradeName}</div>
          <div style="margin-bottom: 6px;"><strong>Puzzles Passed:</strong> ${puzzlesCount}</div>
          <div style="margin-bottom: 4px;"><strong>Kittens:</strong></div>
          <div class="profile-cats-container">${playersHtml}</div>
        `;

        actionsDiv.innerHTML = `
          <button class="btn btn-success continue-profile-btn" data-profile="${idx}">Continue</button>
          <button class="btn btn-danger btn-sm delete-profile-btn" data-profile="${idx}">Delete Profile</button>
        `;
      } else {
        statusDiv.innerHTML = `
          <div class="profile-status-empty">
            <span class="icon">🐾</span>
            <span>No Kittens Yet</span>
          </div>
        `;

        actionsDiv.innerHTML = `
          <button class="btn btn-primary new-profile-btn" data-profile="${idx}">Create Profile</button>
        `;
      }
    }

    // Bind event listeners for the dynamically created buttons
    this.bindProfileButtons();
  },

  bindProfileButtons() {
    // New profile creation
    document.querySelectorAll(".new-profile-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.dataset.profile);
        this.activeProfileIdx = idx;
        this.showScreen("customizer-screen");
        this.renderCustomizerPlayers();
      });
    });

    // Continue profile
    document.querySelectorAll(".continue-profile-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.dataset.profile);
        this.activeProfileIdx = idx;
        const saved = SaveSystem.load(idx);
        if (saved) {
          this.state = saved;
          this.enterWorld();
        }
      });
    });

    // Delete profile trigger
    document.querySelectorAll(".delete-profile-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.dataset.profile);
        this.deletingProfileIdx = idx;
        this.showResetConfirmation();
      });
    });
  },

  showResetConfirmation() {
    document.getElementById("confirm-modal").classList.remove("hidden");
  },

  hideResetConfirmation() {
    document.getElementById("confirm-modal").classList.add("hidden");
  },

  resetProgress() {
    if (this.deletingProfileIdx) {
      SaveSystem.clear(this.deletingProfileIdx);
      this.showToast(`Profile ${this.deletingProfileIdx} progress wiped!`);
      this.deletingProfileIdx = null;
      this.hideResetConfirmation();
      this.renderProfiles();
    }
  },

  exitToMenu() {
    this.showScreen("start-screen");
  },

  /**
   * Enter the RPG world
   */
  enterWorld() {
    this.showScreen("exploration-screen");
    
    // Bind Canvas element
    const canvas = document.getElementById("rpg-canvas");
    MapEngine.init(canvas, this);
    
    // Set to hallway (or the highest grade they completed last)
    const activeGradeIdx = Math.min(5, this.state.unlockedGrade);
    this.enterHallway(activeGradeIdx);
  },

  enterHallway(gradeIdx = this.state.unlockedGrade) {
    // Principal's office index is 6
    if (this.state.unlockedGrade === 6 && gradeIdx === 6) {
      this.startBossBattle();
      return;
    }
    
    MapEngine.setView("hallway", Math.min(5, gradeIdx));
    this.updateHUD();
  },

  enterClassroom(gradeIdx) {
    if (gradeIdx === 6) {
      this.startBossBattle();
      return;
    }
    MapEngine.setView("classroom", gradeIdx);
    this.updateHUD();
  },

  /**
   * Redraw HUD text and badges
   */
  updateHUD() {
    // Configure HUD buttons based on active mode
    const saveProgressBtn = document.getElementById("save-progress-btn");
    const saveQuitBtn = document.getElementById("save-quit-btn");
    if (!this.activeProfileIdx) {
      if (saveProgressBtn) saveProgressBtn.style.display = "none";
      if (saveQuitBtn) {
        saveQuitBtn.innerText = "Exit to Menu 🚪";
        saveQuitBtn.classList.remove("btn-danger");
        saveQuitBtn.classList.add("btn-secondary");
      }
    } else {
      if (saveProgressBtn) saveProgressBtn.style.display = "inline-flex";
      if (saveQuitBtn) {
        saveQuitBtn.innerText = "Save & Menu";
        saveQuitBtn.classList.remove("btn-secondary");
        saveQuitBtn.classList.add("btn-danger");
      }
    }

    // Current grade label
    const titleText = document.getElementById("hud-grade-title");
    if (MapEngine.currentView === "hallway") {
      titleText.innerText = "School Hallway 🏫";
      titleText.style.background = "var(--color-secondary)";
    } else {
      titleText.innerText = `${this.getGradeFullName(MapEngine.currentGradeIdx)} Classroom 🐾`;
      titleText.style.background = "var(--color-primary)";
    }

    // HUD Active player badges
    const playersList = document.getElementById("hud-players-list");
    playersList.innerHTML = "";
    this.state.players.forEach(p => {
      const tag = document.createElement("div");
      tag.className = "hud-player-tag";
      
      // Inline micro SVG
      const miniSvg = document.createElement("span");
      miniSvg.style.width = "20px";
      miniSvg.style.height = "20px";
      miniSvg.innerHTML = CatRenderer.getSVG(p.breed, p.color);
      
      tag.appendChild(miniSvg);
      
      const label = document.createElement("span");
      label.innerText = p.name;
      tag.appendChild(label);
      
      playersList.appendChild(tag);
    });

    // Classroom graduation progress indicator
    const progressText = document.getElementById("progress-text");
    const progressBar = document.getElementById("grade-progress");
    
    if (MapEngine.currentView === "hallway") {
      // Show grades unlocked in hallway
      const totalGrades = 6; // K to 5
      const unlocked = this.state.unlockedGrade;
      const pct = (unlocked / totalGrades) * 100;
      progressText.innerText = `School Progress: ${unlocked}/6 Grades`;
      progressBar.style.setProperty("--pct", `${pct}%`);
      progressBar.style.display = "block";
      
      // set inline width using custom variable or direct styling
      progressBar.style.background = "#ebedef";
      // Update progress bar filler
      const styleTag = document.getElementById("progressbar-helper-style") || document.createElement("style");
      styleTag.id = "progressbar-helper-style";
      styleTag.innerHTML = `.grade-progress-bar::after { width: ${pct}%; }`;
      document.head.appendChild(styleTag);
    } else {
      // In classroom: show subject puzzles solved (max 3 or 4)
      const solvedList = this.state.completedPuzzles[MapEngine.currentGradeIdx] || [];
      // Remove test from solved count for this HUD gauge
      const subjectsSolved = solvedList.filter(s => s !== "test").length;
      const totalSubjects = MapEngine.currentGradeIdx >= 2 ? 4 : 3;
      const pct = (subjectsSolved / totalSubjects) * 100;
      
      progressText.innerText = `Puzzles solved: ${subjectsSolved}/${totalSubjects}`;
      
      const styleTag = document.getElementById("progressbar-helper-style") || document.createElement("style");
      styleTag.id = "progressbar-helper-style";
      styleTag.innerHTML = `.grade-progress-bar::after { width: ${pct}%; }`;
      document.head.appendChild(styleTag);
    }
  },

  getGradeFullName(idx) {
    if (idx === 0) return "Kindergarten";
    if (idx === 1) return "1st Grade";
    if (idx === 2) return "2nd Grade";
    if (idx === 3) return "3rd Grade";
    if (idx === 4) return "4th Grade";
    if (idx === 5) return "5th Grade";
    return "Principal";
  },

  isPuzzleCompleted(gradeIdx, subject) {
    const list = this.state.completedPuzzles[gradeIdx];
    return list ? list.includes(subject) : false;
  },

  isClassroomCleared(gradeIdx) {
    // Cleared when math, reading, science (and typing starting in 2nd grade) are all complete
    const list = this.state.completedPuzzles[gradeIdx] || [];
    const baseCleared = list.includes("math") && list.includes("reading") && list.includes("science");
    if (gradeIdx >= 2) {
      return baseCleared && list.includes("typing");
    }
    return baseCleared;
  },

  /**
   * Route and launch the minigame modal
   */
  openMinigame(gradeIdx, subject) {
    // Map index integer to standard keys in questions database
    const gradeKey = gradeIdx === 0 ? "K" : gradeIdx;
    
    PuzzleRunner.start(gradeKey, subject, this.state.players, (correct, total, passed) => {
      // Puzzle complete callback
      this.handleMinigameComplete(gradeIdx, subject, correct, total, passed);
    });
  },

  handleMinigameComplete(gradeIdx, subject, correct, total, passed) {
    if (passed === false) return; // defensive guard
    
    // Mark as solved
    if (!this.state.completedPuzzles[gradeIdx]) {
      this.state.completedPuzzles[gradeIdx] = [];
    }

    const solvedList = this.state.completedPuzzles[gradeIdx];
    if (!solvedList.includes(subject)) {
      solvedList.push(subject);
    }

    this.saveProgress();
    this.updateHUD();

    // Check if they completed the graduation test
    if (subject === "test") {
      // Graduate!
      this.graduateGrade(gradeIdx);
    }
  },

  graduateGrade(gradeIdx) {
    const nextGrade = gradeIdx + 1;
    
    if (nextGrade > this.state.unlockedGrade) {
      this.state.unlockedGrade = nextGrade;
      this.saveProgress();
    }
    
    // Trigger custom graduation modal & confetti
    const gradModal = document.getElementById("grad-modal");
    const gradTitle = document.getElementById("grad-title");
    
    gradTitle.innerText = `You graduated ${this.getGradeFullName(gradeIdx)}! 🎓`;
    gradModal.classList.remove("hidden");

    // Spawn falling confetti
    const container = document.getElementById("grad-confetti");
    container.innerHTML = "";
    const colors = ["#ff3333", "#33ff33", "#3333ff", "#ffff33", "#ff33ff", "#33ffff", "#f39c12", "#9b59b6"];
    for (let i = 0; i < 100; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * -30 - 10 + "px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = Math.random() * 8 + 4 + "px";
      p.style.height = Math.random() * 12 + 6 + "px";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      p.style.animationDelay = Math.random() * 2.5 + "s";
      p.style.animationDuration = Math.random() * 2 + 1.5 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(p);
    }
    
    // Allow players to remain in the classroom to walk around; they must exit manually via the door.
    this.updateHUD();
  },

  /**
   * Principal Vacuum Cleaner Final Boss Fight setup
   */
  startBossBattle() {
    this.stopLoop(); // Pause RPG Map Engine
    this.bossHp = 100;
    this.bossQuestionIdx = 0;
    this.bossActivePlayerIdx = 0;

    const modal = document.getElementById("boss-modal");
    modal.classList.remove("hidden");

    // Render player cats in boss arena
    const catsContainer = document.getElementById("boss-player-cats");
    catsContainer.innerHTML = "";
    this.state.players.forEach(p => {
      const avatar = document.createElement("div");
      avatar.className = "boss-player-cat-avatar celebrate";
      avatar.innerHTML = CatRenderer.getSVG(p.breed, p.color);
      // add dynamic walk or bobbing style
      avatar.style.animation = "float 3s ease-in-out infinite";
      catsContainer.appendChild(avatar);
    });

    this.renderBossRound();
  },

  renderBossRound() {
    // Update active player turn
    const activePlayer = this.state.players[this.bossActivePlayerIdx];
    document.getElementById("boss-current-player").innerText = activePlayer.name;
    document.getElementById("boss-turn-info").style.borderLeftColor = activePlayer.color;

    // Load boss question
    const q = BOSS_QUESTIONS[this.bossQuestionIdx % BOSS_QUESTIONS.length];
    document.getElementById("boss-question-text").innerText = q.text;

    // Display options
    const optionsContainer = document.getElementById("boss-answer-options");
    optionsContainer.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.innerText = opt;
      btn.addEventListener("click", () => this.handleBossAnswer(opt));
      optionsContainer.appendChild(btn);
    });

    // Hide feedback panel
    document.getElementById("boss-feedback").classList.add("hidden");
    
    // Update health bars
    document.getElementById("boss-hp").style.width = `${this.bossHp}%`;
    document.getElementById("boss-graphic").className = "boss-graphic";
  },

  handleBossAnswer(selected) {
    const q = BOSS_QUESTIONS[this.bossQuestionIdx % BOSS_QUESTIONS.length];
    const isCorrect = selected === q.correct;

    const feedbackPanel = document.getElementById("boss-feedback");
    const fbIcon = document.getElementById("boss-feedback-icon");
    const fbMsg = document.getElementById("boss-feedback-msg");
    const fbBtn = document.getElementById("boss-next-round-btn");

    feedbackPanel.classList.remove("hidden");

    // Disable clicks on options to prevent double-answering
    const optionsContainer = document.getElementById("boss-answer-options");
    optionsContainer.style.pointerEvents = "none";

    const bossGraphic = document.getElementById("boss-graphic");

    if (isCorrect) {
      this.bossHp -= 20;
      this.bossHp = Math.max(0, this.bossHp);
      
      fbIcon.innerText = "💥";
      fbMsg.innerText = `HIT! ${this.state.players[this.bossActivePlayerIdx].name} answered correctly! The Vacuum took 20 damage!`;
      bossGraphic.className = "boss-graphic vibrate";
      
      // Update HP bar immediately
      document.getElementById("boss-hp").style.width = `${this.bossHp}%`;
    } else {
      fbIcon.innerText = "💨";
      fbMsg.innerText = `MISS! Oh no, correct answer: "${q.correct}"`;
    }

    fbBtn.style.display = "none";

    setTimeout(() => {
      optionsContainer.style.pointerEvents = "auto";
      fbBtn.style.display = "inline-block";
      feedbackPanel.classList.add("hidden");
      
      if (this.bossHp <= 0) {
        this.winGame();
      } else {
        this.bossQuestionIdx++;
        this.bossActivePlayerIdx = (this.bossActivePlayerIdx + 1) % this.state.players.length;
        this.renderBossRound();
      }
    }, 1250);
  },

  /**
   * Final Victory Screen Graduation Ceremony!
   */
  winGame() {
    // Hide boss battle
    document.getElementById("boss-modal").classList.add("hidden");
    
    // Clear save progress to allow starting fresh
    if (this.activeProfileIdx) {
      SaveSystem.clear(this.activeProfileIdx);
    }

    const victoryModal = document.getElementById("victory-modal");
    victoryModal.classList.remove("hidden");

    // Render player cats in graduation ceremony
    const victorCatsContainer = document.getElementById("victory-cats");
    victorCatsContainer.innerHTML = "";
    this.state.players.forEach(p => {
      const wrapper = document.createElement("div");
      wrapper.className = "graduating-cat-wrapper";
      
      const avatar = document.createElement("div");
      avatar.className = "graduating-cat-avatar";
      avatar.innerHTML = CatRenderer.getSVG(p.breed, p.color);
      
      // Inject tiny graduation cap on top of SVG inside avatar (absolute overlay)
      const cap = document.createElement("span");
      cap.innerText = "🎓";
      cap.style.position = "absolute";
      cap.style.top = "-24px";
      cap.style.left = "50%";
      cap.style.transform = "translateX(-50%)";
      cap.style.fontSize = "2.2rem";
      cap.style.zIndex = "5";
      
      avatar.appendChild(cap);
      wrapper.appendChild(avatar);
      
      const label = document.createElement("span");
      label.className = "victory-cat-name";
      label.innerText = p.name;
      wrapper.appendChild(label);
      
      victorCatsContainer.appendChild(wrapper);
    });
  },

  /**
   * Game Canvas render ticker
   */
  startLoop() {
    this.stopLoop();
    
    const loop = () => {
      MapEngine.draw();
      this.gameLoopId = requestAnimationFrame(loop);
    };
    
    this.gameLoopId = requestAnimationFrame(loop);
  },

  stopLoop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }
};
export default Game;
