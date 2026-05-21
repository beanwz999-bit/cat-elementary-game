// PuzzleRunner for Cat Elementary
// Manages rendering a minigame's progressive questions, player turns, and visual puzzles.

import { QUESTIONS, BOSS_QUESTIONS } from "./questions.js";
import { CatRenderer } from "./CatRenderer.js";

export const PuzzleRunner = {
  activeGame: null, // { grade, subject, questions, currentIdx, players, activePlayerIdx, answersCorrect: [] }
  onCompleteCallback: null,
  typingAnimationId: null,
  typingStartTime: null,
  typingDuration: null,

  clearTypingTimer() {
    if (this.typingAnimationId) {
      cancelAnimationFrame(this.typingAnimationId);
      this.typingAnimationId = null;
    }
    this.typingStartTime = null;
  },

  /**
   * Start a puzzle minigame
   */
  start(grade, subject, players, onComplete) {
    this.clearTypingTimer();
    const pool = QUESTIONS[grade][subject];
    this.onCompleteCallback = onComplete;

    // Shuffle and slice to get different questions on replay
    const targetLength = subject === "test" ? 6 : 5;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, Math.min(targetLength, pool.length));

    this.activeGame = {
      grade,
      subject,
      questions,
      currentIdx: 0,
      players,
      activePlayerIdx: 0,
      answersCorrect: new Array(questions.length).fill(false)
    };

    // Show modal
    const modal = document.getElementById("minigame-modal");
    modal.classList.remove("hidden");

    // Set titles
    document.getElementById("minigame-title").innerText = `${this.getSubjectName(subject)} Puzzle`;
    const subBadge = document.getElementById("minigame-subject");
    subBadge.innerText = subject.toUpperCase();
    subBadge.className = `subject-badge badge-${subject}`;

    this.renderQuestion();
  },

  getSubjectName(sub) {
    if (sub === "math") return "Kitten Arithmetic";
    if (sub === "reading") return "Word Whisker Rules";
    if (sub === "science") return "Meow-Science & Nature";
    if (sub === "typing") return "Kitten Keyboard Typing";
    return "Graduation Test";
  },

  /**
   * Draw the active question, turn, and visual assets
   */
  renderQuestion() {
    const game = this.activeGame;
    const q = game.questions[game.currentIdx];

    // 1. Update Turn info
    const activePlayer = game.players[game.activePlayerIdx];
    document.getElementById("current-turn-player-name").innerText = activePlayer.name;
    const turnInfo = document.getElementById("minigame-turn-info");
    turnInfo.style.borderLeftColor = activePlayer.color || "#ff7e5f";
    
    // Inject active player's cat mini-avatar in turn announcer
    const catIconWrapper = turnInfo.querySelector(".active-cat-icon");
    catIconWrapper.innerHTML = CatRenderer.getSVG(activePlayer.breed, activePlayer.color);
    catIconWrapper.style.width = "30px";
    catIconWrapper.style.height = "30px";

    // 2. Draw progress dots
    const dotsContainer = document.getElementById("question-progress-dots");
    dotsContainer.innerHTML = "";
    game.questions.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (idx === game.currentIdx) {
        dot.classList.add("active");
      } else if (idx < game.currentIdx) {
        if (game.answersCorrect[idx]) {
          dot.classList.add("correct");
        } else {
          dot.classList.add("incorrect");
        }
      }
      dotsContainer.appendChild(dot);
    });

    // 3. Render Question Text
    document.getElementById("question-text").innerText = q.text;

    // 4. Render visual graphics panel
    const visualPanel = document.getElementById("question-visuals");
    visualPanel.innerHTML = "";
    this.renderVisuals(q.visualType, q.visualData, visualPanel);

    // 5. Render multiple choice answer buttons or typing input field
    const optionsContainer = document.getElementById("answer-options");
    optionsContainer.innerHTML = "";
    
    // Restore default layout in case it was overridden by typing
    optionsContainer.style.display = "";
    optionsContainer.style.flexDirection = "";
    optionsContainer.style.alignItems = "";

    if (q.visualType === "typing") {
      optionsContainer.style.display = "flex";
      optionsContainer.style.flexDirection = "column";
      optionsContainer.style.alignItems = "center";

      const input = document.createElement("input");
      input.type = "text";
      input.id = "typing-game-input";
      input.className = "typing-input";
      input.placeholder = "Type the word here...";
      input.autocomplete = "off";
      input.autocapitalize = "off";
      input.spellcheck = false;
      optionsContainer.appendChild(input);

      // Auto-focus the input
      setTimeout(() => {
        input.focus();
      }, 50);

      // Case-insensitive typing validation
      input.addEventListener("input", (e) => {
        const typed = e.target.value.trim().toLowerCase();
        const target = q.correct.toLowerCase();
        if (typed === target) {
          this.clearTypingTimer();
          input.disabled = true;
          this.handleAnswer(q.correct);
        }
      });
    } else {
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.innerText = opt;
        btn.addEventListener("click", () => this.handleAnswer(opt));
        optionsContainer.appendChild(btn);
      });
    }

    // Hide feedback box
    document.getElementById("feedback-box").classList.add("hidden");
    const exitBtn = document.getElementById("feedback-exit-btn");
    if (exitBtn) {
      exitBtn.classList.add("hidden");
    }
  },

  /**
   * Render custom educational visuals based on question type
   */
  renderVisuals(type, data, container) {
    // Reset general visual attributes
    container.style.background = "";
    container.style.position = "";
    container.style.height = "";
    container.style.display = "";
    container.style.boxSizing = "";
    container.style.border = "";
    container.style.boxShadow = "";

    if (type === "fish") {
      // Draw ocean blue background and N swimming fish SVGs
      container.style.background = "linear-gradient(180deg, #a5d6a7 0%, #80deea 100%)";
      const fishesWrapper = document.createElement("div");
      fishesWrapper.style.display = "flex";
      fishesWrapper.style.justifyContent = "center";
      fishesWrapper.style.flexWrap = "wrap";
      fishesWrapper.style.gap = "10px";
      fishesWrapper.style.width = "100%";

      for (let i = 0; i < data.count; i++) {
        const fish = document.createElement("div");
        fish.className = "visual-fish";
        // Simple fish SVG
        fish.innerHTML = `
          <svg width="45" height="30" viewBox="0 0 45 30">
            <path d="M 5,15 C 20,5 35,5 40,15 C 35,25 20,25 5,15" fill="#ffa726" />
            <polygon points="5,15 0,8 0,22" fill="#fb8c00" />
            <circle cx="32" cy="12" r="2" fill="#fff" />
            <circle cx="32" cy="12" r="0.8" fill="#000" />
          </svg>
        `;
        fishesWrapper.appendChild(fish);
      }
      container.appendChild(fishesWrapper);
    } else if (type === "letters") {
      // Draw big wooden block with letters
      container.style.background = "#faf0e6";
      const letterBox = document.createElement("div");
      letterBox.className = "visual-letter-tile";
      letterBox.innerText = data.big;
      container.appendChild(letterBox);
    } else if (type === "colors") {
      // Draw overlapping colored circles
      container.style.background = "#fff";
      const svg = document.createElement("div");
      svg.innerHTML = `
        <svg width="150" height="100" viewBox="0 0 150 100">
          <circle cx="60" cy="50" r="35" fill="${data.color1}" opacity="0.75" />
          <circle cx="90" cy="50" r="35" fill="${data.color2}" opacity="0.75" />
          <text x="75" y="93" text-anchor="middle" font-weight="bold" fill="#7f8c8d" font-size="12">MIX THEM!</text>
        </svg>
      `;
      container.appendChild(svg);
    } else if (type === "clock") {
      // Draw analog clock face with hour/minute hands
      container.style.background = "#fff";
      const hour = data.hour;
      const min = data.minute;
      
      const hrAngle = (hour % 12) * 30 + min * 0.5;
      const minAngle = min * 6;

      const clockSvg = document.createElement("div");
      clockSvg.innerHTML = `
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="#f8f9f9" stroke="#34495e" stroke-width="4"/>
          <!-- Numbers -->
          <text x="60" y="24" text-anchor="middle" font-weight="bold" font-size="12" fill="#34495e">12</text>
          <text x="98" y="64" text-anchor="middle" font-weight="bold" font-size="12" fill="#34495e">3</text>
          <text x="60" y="104" text-anchor="middle" font-weight="bold" font-size="12" fill="#34495e">6</text>
          <text x="22" y="64" text-anchor="middle" font-weight="bold" font-size="12" fill="#34495e">9</text>
          <!-- Center Pin -->
          <circle cx="60" cy="60" r="4" fill="#ff7e5f"/>
          <!-- Hands rotated -->
          <line x1="60" y1="60" x2="60" y2="35" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" transform="rotate(${hrAngle} 60 60)"/>
          <line x1="60" y1="60" x2="60" y2="22" stroke="#ff7e5f" stroke-width="2.5" stroke-linecap="round" transform="rotate(${minAngle} 60 60)"/>
        </svg>
      `;
      container.appendChild(clockSvg);
    } else if (type === "typing") {
      // Set retro dark terminal styles dynamically
      container.style.background = "#121216";
      container.style.position = "relative";
      container.style.height = "140px";
      container.style.display = "block";
      container.style.boxSizing = "border-box";
      container.style.border = "2px solid #2c3e50";
      container.style.boxShadow = "inset 0 0 12px rgba(0, 0, 0, 0.85)";

      // Retro green scanlines
      const scanlines = document.createElement("div");
      scanlines.className = "terminal-scanlines";
      container.appendChild(scanlines);

      // Red caution/danger stripe area at the bottom
      const dangerPad = document.createElement("div");
      dangerPad.className = "typing-danger-pad";
      container.appendChild(dangerPad);

      // Falling green word element
      const wordDiv = document.createElement("div");
      wordDiv.id = "falling-word";
      wordDiv.className = "falling-word";
      wordDiv.innerText = data.word;
      container.appendChild(wordDiv);

      this.clearTypingTimer();

      // Determine grade-scaled duration (10s at Grade 2 down to 7s at Grade 5)
      let gradeNum = parseInt(this.activeGame.grade);
      if (isNaN(gradeNum)) {
        gradeNum = this.activeGame.grade === "K" ? 0 : 2;
      }
      this.typingDuration = Math.max(6000, (12 - gradeNum) * 1000);

      this.tickTyping = (timestamp) => {
        if (!this.activeGame) return;
        const currentQ = this.activeGame.questions[this.activeGame.currentIdx];
        if (!currentQ || currentQ.visualType !== "typing") return;

        if (!this.typingStartTime) {
          this.typingStartTime = timestamp;
        }

        const elapsed = timestamp - this.typingStartTime;
        const progress = Math.min(1, elapsed / this.typingDuration);

        // Map progress to falling coordinates inside the 140px high terminal view
        const startY = 10;
        const endY = 105; // hits the caution line beautifully
        const currentY = startY + progress * (endY - startY);

        const el = document.getElementById("falling-word");
        if (el) {
          el.style.top = `${currentY}px`;
        }

        if (progress >= 1) {
          // Touchdown failure!
          this.clearTypingTimer();
          const inputEl = document.getElementById("typing-game-input");
          if (inputEl) {
            inputEl.disabled = true;
          }
          this.handleAnswer(""); // incorrect empty answer
        } else {
          this.typingAnimationId = requestAnimationFrame(this.tickTyping);
        }
      };

      this.typingAnimationId = requestAnimationFrame(this.tickTyping);
    } else {
      // TextOnly - Simple generic picture or icon
      container.style.background = "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)";
      const icon = document.createElement("span");
      icon.style.fontSize = "4.5rem";
      icon.innerText = this.getSubjectIcon(this.activeGame.subject);
      container.appendChild(icon);
    }
  },

  getSubjectIcon(sub) {
    if (sub === "math") return "✏️";
    if (sub === "reading") return "📚";
    if (sub === "science") return "🔬";
    if (sub === "typing") return "⌨️";
    return "🎓";
  },

  /**
   * Validate selected answer and award feedback
   */
  handleAnswer(selected) {
    this.clearTypingTimer();
    const game = this.activeGame;
    const q = game.questions[game.currentIdx];
    const isCorrect = selected === q.correct;

    game.answersCorrect[game.currentIdx] = isCorrect;

    // Show Feedback Box
    const feedbackBox = document.getElementById("feedback-box");
    const fbIcon = document.getElementById("feedback-icon");
    const fbMsg = document.getElementById("feedback-message");
    const fbBtn = document.getElementById("feedback-next-btn");
    const exitBtn = document.getElementById("feedback-exit-btn");
    if (exitBtn) {
      exitBtn.classList.add("hidden");
    }

    feedbackBox.classList.remove("hidden");

    // Disable clicks on options to prevent double-answering
    const optionsContainer = document.getElementById("answer-options");
    optionsContainer.style.pointerEvents = "none";

    if (isCorrect) {
      fbIcon.innerText = "🎉";
      fbMsg.innerText = this.getRandomPraise();
      fbIcon.style.animation = "celebrate 0.5s ease infinite alternate";
    } else {
      fbIcon.innerText = "😿";
      fbMsg.innerText = `Oops! The correct answer was "${q.correct}".`;
      fbIcon.style.animation = "vibrate 0.2s infinite";
    }

    // Hide the button since we auto-advance in all cases
    fbBtn.style.display = "none";

    setTimeout(() => {
      // Safe check in case game was closed during timeout
      if (this.activeGame) {
        optionsContainer.style.pointerEvents = "auto";
        fbBtn.style.display = "inline-block";
        feedbackBox.classList.add("hidden");
        this.advanceQuestion();
      }
    }, 1250);
  },

  getRandomPraise() {
    const praises = [
      "Purr-fect job!",
      "You are a meow-velous genius!",
      "Super claw-ver!",
      "Claw-some work!",
      "Cat-tastic answer!",
      "Fur-tastic!"
    ];
    return praises[Math.floor(Math.random() * praises.length)];
  },

  /**
   * Advance to next question or end minigame
   */
  advanceQuestion() {
    this.clearTypingTimer();
    const game = this.activeGame;
    if (!game) return;
    game.currentIdx++;

    if (game.currentIdx >= game.questions.length) {
      // Completed minigame! Let's check passing scores
      const totalCorrect = game.answersCorrect.filter(Boolean).length;
      const isTest = game.subject === "test";
      const threshold = isTest ? 4 : 3;
      const passed = totalCorrect >= threshold;

      if (passed) {
        if (isTest) {
          // No double popup for the graduation test, go straight to graduation banner!
          this.close();
          if (this.onCompleteCallback) {
            this.onCompleteCallback(totalCorrect, game.questions.length, true);
          }
        } else {
          // Show success pop up inside the feedback box
          const feedbackBox = document.getElementById("feedback-box");
          const fbIcon = document.getElementById("feedback-icon");
          const fbMsg = document.getElementById("feedback-message");
          const fbBtn = document.getElementById("feedback-next-btn");
          const exitBtn = document.getElementById("feedback-exit-btn");
          if (exitBtn) {
            exitBtn.classList.add("hidden");
          }

          // Lock answers container
          const optionsContainer = document.getElementById("answer-options");
          optionsContainer.style.pointerEvents = "none";

          feedbackBox.classList.remove("hidden");
          fbIcon.innerText = "😻";
          fbIcon.style.animation = "bounce 0.5s infinite alternate";
          fbMsg.innerText = `Meow-vellous! You passed the subject! You got ${totalCorrect} out of ${game.questions.length} correct! 🎉`;

          fbBtn.style.display = "inline-block";
          fbBtn.innerText = "Awesome! 🐾";

          fbBtn.onclick = () => {
            optionsContainer.style.pointerEvents = "auto";
            feedbackBox.classList.add("hidden");
            this.close();
            if (this.onCompleteCallback) {
              this.onCompleteCallback(totalCorrect, game.questions.length, true);
            }
          };
        }
      } else {
        // Show failure and retry option inside the feedback box
        const feedbackBox = document.getElementById("feedback-box");
        const fbIcon = document.getElementById("feedback-icon");
        const fbMsg = document.getElementById("feedback-message");
        const fbBtn = document.getElementById("feedback-next-btn");
        const exitBtn = document.getElementById("feedback-exit-btn");

        // Lock answers container
        const optionsContainer = document.getElementById("answer-options");
        optionsContainer.style.pointerEvents = "none";

        feedbackBox.classList.remove("hidden");
        fbIcon.innerText = "😿";
        fbIcon.style.animation = "vibrate 0.2s infinite";
        fbMsg.innerText = `Study a little more and please try again! You got ${totalCorrect} out of ${game.questions.length} correct. (Need at least ${threshold} correct)`;

        fbBtn.style.display = "inline-block";
        fbBtn.innerText = "Try Again 🔄";

        if (game.subject === "typing") {
          if (exitBtn) {
            exitBtn.classList.remove("hidden");
            exitBtn.onclick = () => {
              optionsContainer.style.pointerEvents = "auto";
              feedbackBox.classList.add("hidden");
              exitBtn.classList.add("hidden");
              this.close();
            };
          }
        } else {
          if (exitBtn) {
            exitBtn.classList.add("hidden");
          }
        }

        fbBtn.onclick = () => {
          this.clearTypingTimer();
          if (exitBtn) {
            exitBtn.classList.add("hidden");
          }
          // Re-shuffle and select new questions for the retry!
          const pool = QUESTIONS[game.grade][game.subject];
          const targetLength = game.subject === "test" ? 6 : 5;
          const shuffled = [...pool].sort(() => Math.random() - 0.5);
          game.questions = shuffled.slice(0, Math.min(targetLength, pool.length));

          // Restart minigame from first question
          game.currentIdx = 0;
          game.activePlayerIdx = 0;
          game.answersCorrect = new Array(game.questions.length).fill(false);

          // Restore normal states
          optionsContainer.style.pointerEvents = "auto";
          feedbackBox.classList.add("hidden");
          this.renderQuestion();
        };
      }
    } else {
      // Switch turns for multiplayer
      game.activePlayerIdx = (game.activePlayerIdx + 1) % game.players.length;
      this.renderQuestion();
    }
  },

  close() {
    this.clearTypingTimer();
    document.getElementById("minigame-modal").classList.add("hidden");
    this.activeGame = null;
  }
};
export default PuzzleRunner;
