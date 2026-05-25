// Map.js for Cat Elementary
// Handles HTML5 Canvas RPG rendering, collision, interactions, and follow-the-leader cats.
// Polished with the school hallway reference theme:
// - Checkered tiles flooring (warm orange, light green, pale yellow, cream)
// - Colorful lockers (yellow, green, blue) with name plates (OLIVER, MIA, LEO) and drawings
// - Hanging banner: "WELCOME TO ELEMENTARY SCHOOL!"
// - Bulletin board with autumn leaves and student drawings
// - Cats drawn with backpacks, uniforms, and red sneakers on all fours!

import { CAT_BREEDS } from "./CatRenderer.js";

export const MapEngine = {
  canvas: null,
  ctx: null,
  game: null,
  
  // View states
  currentView: "hallway", 
  currentGradeIdx: 0,     
  
  // Dimensions & Camera
  width: 800,
  height: 500,
  cameraX: 0,
  
  // Player state
  playerX: 100,
  playerY: 340,
  playerSpeed: 1.6,
  facing: "right",
  isWalking: false,
  walkFrame: 0,
  
  // Multi-player cat trailing history
  trailHistory: [],
  trailGap: 28,
  
  // Keys down
  keys: {},
  
  // Targets for click-to-move
  moveTarget: null,
  
  // Level doors
  doors: [
    { name: "Kindergarten", x: 180, unlocked: true, grade: 0 },
    { name: "1st Grade", x: 340, unlocked: false, grade: 1 },
    { name: "2nd Grade", x: 500, unlocked: false, grade: 2 },
    { name: "3rd Grade", x: 660, unlocked: false, grade: 3 },
    { name: "4th Grade", x: 820, unlocked: false, grade: 4 },
    { name: "5th Grade", x: 980, unlocked: false, grade: 5 },
    { name: "Principal's Office", x: 1140, unlocked: false, grade: 6 }
  ],
  
  classroomHotspots: [],
  activeHotspot: null,

  init(canvasElement, gameInstance) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.game = gameInstance;
    
    this.resize();
    window.addEventListener("resize", () => this.resize());
    
    window.addEventListener("keydown", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
        return;
      }
      if (this.isModalOpen()) return;

      this.keys[e.key] = true;
      this.moveTarget = null;
      
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault(); // Prevent page scrolling or default form triggers
        
        let npcInteracted = false;
        if (e.key === " ") {
          const nearestNpc = this.getNearestNPC();
          if (nearestNpc) {
            let shouldTalkToNpc = true;
            if (this.activeHotspot) {
              const npcDist = Math.hypot(this.playerX - nearestNpc.x, this.playerY - nearestNpc.y);
              const hotspotDist = Math.hypot(this.playerX - this.activeHotspot.x, this.playerY - this.activeHotspot.y);
              if (npcDist >= hotspotDist) {
                shouldTalkToNpc = false;
              }
            }
            if (shouldTalkToNpc) {
              this.triggerNPCSpeechBubble(nearestNpc);
              npcInteracted = true;
            }
          }
        }

        if (!npcInteracted && this.activeHotspot) {
          this.interactWithHotspot();
        }
      }
    });
    
    window.addEventListener("keyup", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
        return;
      }
      this.keys[e.key] = false;
    });
    
    this.handleCanvasInput = (clickX, clickY) => {
      if (this.isModalOpen()) return;

      const minY = 260;
      const maxY = 450;

      // Check if user tapped/clicked directly on a nearby NPC cat to talk
      let npcClicked = null;
      if (this.npcs) {
        this.npcs.forEach(npc => {
          const isCurrent = (this.currentView === "hallway" && npc.room === "hallway") || 
                            (this.currentView === "classroom" && npc.room === "classroom" && npc.grade === this.currentGradeIdx);
          if (isCurrent) {
            const clickDistToNpc = Math.hypot(clickX - npc.x, clickY - npc.y);
            if (clickDistToNpc < 35) {
              npcClicked = npc;
            }
          }
        });
      }

      if (npcClicked) {
        const distToPlayer = Math.hypot(this.playerX - npcClicked.x, this.playerY - npcClicked.y);
        if (distToPlayer < 65) {
          this.triggerNPCSpeechBubble(npcClicked);
          return; // Skip setting moveTarget so we don't start walking
        }
      }
      
      const potentialMoveTarget = {
        x: Math.max(20, Math.min(this.currentView === "hallway" ? 1580 : 780, clickX)),
        y: Math.max(minY, Math.min(maxY, clickY))
      };
      // Set the move target so they walk to where they tapped
      this.moveTarget = potentialMoveTarget;
    };

    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (this.width / rect.width) + (this.currentView === "hallway" ? this.cameraX : 0);
      const clickY = (e.clientY - rect.top) * (this.height / rect.height);
      this.handleCanvasInput(clickX, clickY);
    });

    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling/zooming when tapping the game
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (touch.clientX - rect.left) * (this.width / rect.width) + (this.currentView === "hallway" ? this.cameraX : 0);
        const clickY = (touch.clientY - rect.top) * (this.height / rect.height);
        this.handleCanvasInput(clickX, clickY);
      }
    }, { passive: false });

    // Allow direct clicks/taps on the visual interaction prompt bubble overlay
    const promptEl = document.getElementById("interact-prompt");
    if (promptEl) {
      const handlePromptClick = (e) => {
        if (this.isModalOpen()) return;
        e.preventDefault();
        e.stopPropagation();
        if (this.activeHotspot) {
          this.interactWithHotspot();
        }
      };
      promptEl.addEventListener("click", handlePromptClick);
      promptEl.addEventListener("touchstart", handlePromptClick, { passive: false });
    }
    
    this.setupClassroomHotspots(0);
    this.initNPCs();
  },
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = rect.width || this.width;
    const displayHeight = rect.height || this.height;
    
    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;
    
    this.scaleX = (displayWidth * dpr) / this.width;
    this.scaleY = (displayHeight * dpr) / this.height;
  },
  
  isModalOpen() {
    const minigameModal = document.getElementById("minigame-modal");
    const bossModal = document.getElementById("boss-modal");
    const victoryModal = document.getElementById("victory-modal");
    const gradModal = document.getElementById("grad-modal");
    const saveModal = document.getElementById("save-modal");
    
    return (minigameModal && !minigameModal.classList.contains("hidden")) ||
           (bossModal && !bossModal.classList.contains("hidden")) ||
           (victoryModal && !victoryModal.classList.contains("hidden")) ||
           (gradModal && !gradModal.classList.contains("hidden")) ||
           (saveModal && !saveModal.classList.contains("hidden"));
  },
  
  setupClassroomHotspots(gradeIdx = 0) {
    // Handcrafted unique layouts for each classroom to make them feel distinct
    const layouts = {
      0: { // Kindergarten
        math: { x: 220, y: 240 },
        reading: { x: 480, y: 220 },
        science: { x: 320, y: 380 },
        test: { x: 680, y: 300 }
      },
      1: { // 1st Grade
        math: { x: 450, y: 380 },
        reading: { x: 220, y: 260 },
        science: { x: 580, y: 240 },
        test: { x: 680, y: 380 }
      },
      2: { // 2nd Grade
        math: { x: 300, y: 220 },
        reading: { x: 580, y: 380 },
        science: { x: 200, y: 380 },
        test: { x: 680, y: 240 },
        typing: { x: 440, y: 380 }
      },
      3: { // 3rd Grade
        math: { x: 580, y: 260 },
        reading: { x: 320, y: 380 },
        science: { x: 450, y: 220 },
        test: { x: 680, y: 360 },
        typing: { x: 220, y: 260 }
      },
      4: { // 4th Grade
        math: { x: 220, y: 380 },
        reading: { x: 450, y: 360 },
        science: { x: 300, y: 220 },
        test: { x: 680, y: 260 },
        typing: { x: 580, y: 240 }
      },
      5: { // 5th Grade
        math: { x: 320, y: 240 },
        reading: { x: 220, y: 380 },
        science: { x: 550, y: 380 },
        test: { x: 680, y: 280 },
        typing: { x: 450, y: 220 }
      }
    };

    const lay = layouts[gradeIdx] || layouts[0];

    this.classroomHotspots = [
      { id: "math", name: "Math Desk", x: lay.math.x, y: lay.math.y, radius: 45, color: "#4a90e2", icon: "✏️" },
      { id: "reading", name: "Reading Board", x: lay.reading.x, y: lay.reading.y, radius: 45, color: "#ff7e5f", icon: "📚" },
      { id: "science", name: "Science Table", x: lay.science.x, y: lay.science.y, radius: 45, color: "#2ecc71", icon: "🔬" },
      { id: "test", name: "Teacher's Desk (Final Test)", x: lay.test.x, y: lay.test.y, radius: 50, color: "#f1c40f", icon: "🎓" }
    ];

    if (lay.typing) {
      this.classroomHotspots.push({
        id: "typing",
        name: "Typing Keyboard",
        x: lay.typing.x,
        y: lay.typing.y,
        radius: 45,
        color: "#9b59b6",
        icon: "💻"
      });
    }
  },

  initNPCs() {
    this.npcs = [];
    const catNames = [
      "Luna", "Bella", "Simba", "Chloe", "Loki",
      "Oreo", "Lucy", "Leo", "Lily", "Nala",
      "Coco", "Cleo", "Jasper", "Shadow", "Milo",
      "Oliver", "Felix", "Smokey", "Daisy", "Toby",
      "Gizmo", "Peanut", "Mochi", "Zoe", "Ginger"
    ];
    const breeds = ["tabby", "siamese", "calico", "tuxedo", "persian", "russianblue"];
    const collarColors = ["#ff3333", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#ff7e5f"];

    // Spawn hallway students (7 students, increased from 5)
    for (let i = 0; i < 7; i++) {
      this.npcs.push({
        name: catNames[i % catNames.length] + " 🐾",
        breed: breeds[Math.floor(Math.random() * breeds.length)],
        collarColor: collarColors[Math.floor(Math.random() * collarColors.length)],
        x: 150 + Math.random() * 1050, // hallway length
        y: 280 + Math.random() * 120, // y bounds
        targetX: null,
        targetY: null,
        speed: 0.8 + Math.random() * 0.6,
        facing: Math.random() > 0.5 ? "left" : "right",
        isWalking: false,
        walkTimer: Math.random() * 60,
        room: "hallway",
        grade: null
      });
    }

    // Spawn classroom students (14 students, increased from 12)
    // Grades 1 and 3 will have 3 students; other grades will have 2.
    for (let grade = 0; grade < 6; grade++) {
      const studentCount = (grade === 1 || grade === 3) ? 3 : 2;
      for (let i = 0; i < studentCount; i++) {
        const nameIdx = 7 + grade * 2 + i; // Offset by 7 hallway names
        this.npcs.push({
          name: catNames[nameIdx % catNames.length] + " 🐾",
          breed: breeds[Math.floor(Math.random() * breeds.length)],
          collarColor: collarColors[Math.floor(Math.random() * collarColors.length)],
          x: 180 + Math.random() * 450, // classroom x bounds
          y: 220 + Math.random() * 200, // classroom y bounds
          targetX: null,
          targetY: null,
          speed: 0.6 + Math.random() * 0.4,
          facing: Math.random() > 0.5 ? "left" : "right",
          isWalking: false,
          walkTimer: Math.random() * 60,
          room: "classroom",
          grade: grade
        });
      }
    }
  },

  updateNPCsMovement() {
    if (!this.npcs) return;

    this.npcs.forEach(npc => {
      if (npc.speechBubble && npc.speechBubble.timer > 0) {
        npc.speechBubble.timer--;
      }
      // Only update if NPC is in the current view/classroom
      const isCurrent = (this.currentView === "hallway" && npc.room === "hallway") || 
                        (this.currentView === "classroom" && npc.room === "classroom" && npc.grade === this.currentGradeIdx);
      if (!isCurrent) return;

      npc.walkTimer--;

      if (npc.walkTimer <= 0) {
        if (npc.isWalking) {
          // Finish walk, start idling
          npc.isWalking = false;
          npc.targetX = null;
          npc.targetY = null;
          npc.walkTimer = 60 + Math.random() * 180; // 1 to 3 seconds idle
        } else {
          // Finish idle, select target and start walking
          npc.isWalking = true;
          if (npc.room === "classroom") {
            npc.targetX = 150 + Math.random() * 550; // classroom x bounds
            npc.targetY = 220 + Math.random() * 220; // classroom y bounds
          } else {
            npc.targetX = 100 + Math.random() * 1170; // hallway x bounds
            npc.targetY = 280 + Math.random() * 120;  // hallway y bounds
          }
          npc.walkTimer = 180 + Math.random() * 240; // 3 to 7 seconds maximum walk time
        }
      }

      if (npc.isWalking && npc.targetX !== null) {
        const dx = npc.targetX - npc.x;
        const dy = npc.targetY - npc.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 5) {
          npc.isWalking = false;
          npc.targetX = null;
          npc.targetY = null;
          npc.walkTimer = 60 + Math.random() * 180;
        } else {
          const angle = Math.atan2(dy, dx);
          npc.x += Math.cos(angle) * npc.speed;
          npc.y += Math.sin(angle) * npc.speed;
          npc.facing = dx > 0 ? "right" : "left";
          
          // Clamp positions to bounds
          if (npc.room === "classroom") {
            npc.x = Math.max(120, Math.min(750, npc.x));
            npc.y = Math.max(200, Math.min(460, npc.y));
          } else {
            npc.x = Math.max(100, Math.min(1270, npc.x));
            npc.y = Math.max(280, Math.min(440, npc.y));
          }
        }
      }
    });
  },

  drawNPCs() {
    if (!this.npcs) return;

    this.npcs.forEach(npc => {
      const isCurrent = (this.currentView === "hallway" && npc.room === "hallway") || 
                        (this.currentView === "classroom" && npc.room === "classroom" && npc.grade === this.currentGradeIdx);
      if (!isCurrent) return;

      this.drawSingleCat(npc.x, npc.y, npc.breed, npc.collarColor, npc.facing, npc.isWalking, npc.name);
      
      // Draw speech bubble if active
      if (npc.speechBubble && npc.speechBubble.timer > 0) {
        this.drawSpeechBubble(this.ctx, npc.x, npc.y, npc.speechBubble.text, npc.isWalking);
      }
    });
  },
  
  setView(view, gradeIdx = 0) {
    this.currentView = view;
    this.currentGradeIdx = gradeIdx;
    
    // Dynamic positions for each grade classroom
    this.setupClassroomHotspots(gradeIdx);
    
    this.moveTarget = null;
    this.keys = {};
    
    this.doors.forEach(d => {
      d.unlocked = d.grade <= this.game.state.unlockedGrade;
    });

    if (view === "hallway") {
      this.playerX = this.doors[gradeIdx].x;
      this.playerY = 350;
    } else {
      this.playerX = 100;
      this.playerY = 350;
    }
    
    this.trailHistory = [];
    for (let i = 0; i < 100; i++) {
      this.trailHistory.push({
        x: this.playerX,
        y: this.playerY,
        facing: this.facing,
        isWalking: false
      });
    }
  },
  
  updateMovement() {
    if (this.isModalOpen()) {
      this.isWalking = false;
      this.keys = {};
      this.moveTarget = null;
      this.walkFrame = 0;
      return;
    }
    let dx = 0;
    let dy = 0;
    
    const minY = 270;
    const maxY = 450;
    let minX = 20;
    let maxX = this.currentView === "hallway" ? 1360 : 760;

    if (this.moveTarget) {
      const distX = this.moveTarget.x - this.playerX;
      const distY = this.moveTarget.y - this.playerY;
      const distance = Math.hypot(distX, distY);
      
      if (distance < 5) {
        this.moveTarget = null;
      } else {
        dx = (distX / distance) * this.playerSpeed;
        dy = (distY / distance) * this.playerSpeed;
      }
    } else {
      if (this.keys["ArrowLeft"]) dx = -this.playerSpeed;
      if (this.keys["ArrowRight"]) dx = this.playerSpeed;
      if (this.keys["ArrowUp"]) dy = -this.playerSpeed;
      if (this.keys["ArrowDown"]) dy = this.playerSpeed;
    }

    this.isWalking = (dx !== 0 || dy !== 0);

    if (this.isWalking) {
      this.playerX += dx;
      this.playerY += dy;
      
      if (dx < 0) this.facing = "left";
      if (dx > 0) this.facing = "right";
      
      this.playerX = Math.max(minX, Math.min(maxX, this.playerX));
      this.playerY = Math.max(minY, Math.min(maxY, this.playerY));
      
      this.walkFrame = (this.walkFrame + 0.10) % 4;
    } else {
      this.walkFrame = 0;
    }
    
    this.trailHistory.unshift({
      x: this.playerX,
      y: this.playerY,
      facing: this.facing,
      isWalking: this.isWalking
    });
    
    if (this.trailHistory.length > 200) {
      this.trailHistory.pop();
    }
    
    if (this.currentView === "hallway") {
      const targetCamX = this.playerX - this.width / 2;
      this.cameraX += (targetCamX - this.cameraX) * 0.1;
      this.cameraX = Math.max(0, Math.min(1380 - this.width, this.cameraX));
    }
  },

  checkInteractions() {
    this.activeHotspot = null;
    
    if (this.currentView === "hallway") {
      const interactDist = 45;
      const doorNear = this.doors.find(d => Math.abs(this.playerX - d.x) < interactDist && this.playerY < 320);
      if (doorNear) {
        this.activeHotspot = {
          type: "door",
          id: doorNear.grade,
          name: doorNear.name,
          unlocked: doorNear.unlocked,
          x: doorNear.x,
          y: 260
        };
      }
    } else {
      const interactDist = 65;
      const tableNear = this.classroomHotspots.find(t => Math.hypot(this.playerX - t.x, this.playerY - t.y) < interactDist);
      if (tableNear) {
        this.activeHotspot = {
          type: "puzzle",
          id: tableNear.id,
          name: tableNear.name,
          x: tableNear.x,
          y: tableNear.y
        };
      }
      
      if (this.playerX < 60 && Math.abs(this.playerY - 340) < 60) {
        this.activeHotspot = {
          type: "exit",
          id: "exit",
          name: "Exit Classroom",
          x: 20,
          y: 340
        };
      }
    }

    const prompt = document.getElementById("interact-prompt");
    if (this.activeHotspot) {
      prompt.classList.remove("hidden");
      const bubble = prompt.querySelector(".interact-bubble");
      if (this.activeHotspot.type === "door") {
        if (this.activeHotspot.unlocked) {
          bubble.innerHTML = `Press <span class="interact-key">Space</span> or <span class="interact-click">Tap</span> to enter ${this.activeHotspot.name}`;
        } else {
          bubble.innerHTML = `🔒 ${this.activeHotspot.name} is Locked! Pass previous grades first.`;
        }
      } else if (this.activeHotspot.type === "puzzle") {
        const isTestLocked = this.activeHotspot.id === "test" && !this.game.isClassroomCleared(this.currentGradeIdx);
        if (isTestLocked) {
          const reqCount = this.currentGradeIdx >= 2 ? 4 : 3;
          bubble.innerHTML = `📚 Solve all ${reqCount} subject minigames to unlock the Final Test!`;
        } else {
          const isSolved = this.game.isPuzzleCompleted(this.currentGradeIdx, this.activeHotspot.id);
          const stars = this.game.getPuzzleStars(this.currentGradeIdx, this.activeHotspot.id);
          const starStr = stars > 0 ? " " + "⭐".repeat(stars) : "";
          const solvedTag = isSolved ? `✅ Replay${starStr}` : "⭐ Play";
          bubble.innerHTML = `Press <span class="interact-key">Space</span> or <span class="interact-click">Tap</span> to play ${this.activeHotspot.name} ${solvedTag}`;
        }
      } else if (this.activeHotspot.type === "exit") {
        bubble.innerHTML = `Press <span class="interact-key">Space</span> or <span class="interact-click">Tap</span> to go out to the Hallway`;
      }
    } else {
      prompt.classList.add("hidden");
    }
  },

  interactWithHotspot() {
    if (!this.activeHotspot) return;
    
    if (this.activeHotspot.type === "door") {
      if (this.activeHotspot.unlocked) {
        this.game.enterClassroom(this.activeHotspot.id);
      }
    } else if (this.activeHotspot.type === "puzzle") {
      const isTestLocked = this.activeHotspot.id === "test" && !this.game.isClassroomCleared(this.currentGradeIdx);
      if (!isTestLocked) {
        this.game.openMinigame(this.currentGradeIdx, this.activeHotspot.id);
      }
    } else if (this.activeHotspot.type === "exit") {
      this.game.enterHallway();
    }
  },

  draw() {
    this.updateMovement();
    this.checkInteractions();
    
    this.resize();
    
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.save();
    ctx.scale(this.scaleX, this.scaleY);
    
    if (this.currentView === "hallway") {
      ctx.translate(-this.cameraX, 0);
      this.drawHallwayBackground();
    } else {
      this.drawClassroomBackground();
    }
    
    if (this.currentView === "classroom") {
      this.drawClassroomProps();
    }
    
    this.updateNPCsMovement();
    this.drawNPCs();
    this.drawPlayerCats();

    ctx.restore();
  },

  /**
   * Reference Theme: Warm Checkerboard tiles floor, yellow/green/blue lockers, leaves bulletin board, hanging welcome banner
   */
  drawHallwayBackground() {
    const ctx = this.ctx;
    
    // 1. FLOORING: Checkered pastel tiles (orange, light green, pale yellow, cream)
    ctx.fillStyle = "#faf0e6"; // base cream
    ctx.fillRect(0, 260, 1380, 240);
    
    const tileColors = ["#ffe5d9", "#d8f3dc", "#fcf6bd", "#d8e2dc"];
    const tileW = 60;
    const tileH = 30;
    
    for (let x = -60; x < 1380 + 60; x += tileW) {
      for (let y = 260; y < 500; y += tileH) {
        // Offset rows for isometric perspective brick layout
        const offset = ((y - 260) / tileH) % 2 === 0 ? 0 : tileW / 2;
        const colorIdx = Math.abs(Math.floor((x + offset) / tileW) + Math.floor(y / tileH)) % tileColors.length;
        
        ctx.fillStyle = tileColors[colorIdx];
        ctx.beginPath();
        // Perspective quad drawing
        ctx.moveTo(x + offset, y);
        ctx.lineTo(x + offset + tileW, y);
        ctx.lineTo(x + offset + tileW - 10, y + tileH);
        ctx.lineTo(x + offset - 10, y + tileH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(44, 62, 80, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // 2. WALLS: Soft pale yellow/cream walls matching the cozy reference
    ctx.fillStyle = "#fff8e7";
    ctx.fillRect(0, 0, 1380, 260);
    
    // Wooden baseboard trim
    ctx.fillStyle = "#cd853f";
    ctx.fillRect(0, 252, 1380, 8);
    ctx.fillStyle = "#2c3e50"; // Baseboard shadow outline
    ctx.fillRect(0, 258, 1380, 2);

    // 3. DOORS: Wooden framed with name plates
    this.doors.forEach(d => {
      // Wood frame border
      ctx.fillStyle = "#8a5a36";
      ctx.fillRect(d.x - 34, 100, 68, 152);
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(d.x - 34, 100, 68, 152);
      
      // Inside door panel
      ctx.fillStyle = d.unlocked ? "#f4a460" : "#95a5a6";
      ctx.fillRect(d.x - 28, 105, 56, 147);
      
      // Door Window
      ctx.fillStyle = d.unlocked ? "#e0f7fa" : "#7f8c8d";
      ctx.fillRect(d.x - 16, 115, 32, 40);
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 2;
      ctx.strokeRect(d.x - 16, 115, 32, 40);
      // Window panes cross
      ctx.beginPath();
      ctx.moveTo(d.x, 115); ctx.lineTo(d.x, 155);
      ctx.moveTo(d.x - 16, 135); ctx.lineTo(d.x + 16, 135);
      ctx.stroke();
      
      // Gold door handle
      ctx.fillStyle = "#f1c40f";
      ctx.beginPath();
      ctx.arc(d.x + 20, 185, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sign above door
      ctx.fillStyle = "#fff";
      ctx.fillRect(d.x - 45, 60, 90, 26);
      ctx.strokeRect(d.x - 45, 60, 90, 26);
      
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 12px Fredoka";
      ctx.textAlign = "center";
      let doorLabel = d.name;
      if (d.grade === 0) doorLabel = "KINDERGARTEN";
      if (d.grade >= 1 && d.grade <= 5) doorLabel = `GRADE ${d.grade}`;
      if (d.grade === 6) doorLabel = "PRINCIPAL";
      ctx.fillText(doorLabel, d.x, 77);

      // Lock Overlay
      if (!d.unlocked) {
        ctx.fillStyle = "rgba(44, 62, 80, 0.65)";
        ctx.fillRect(d.x - 28, 105, 56, 147);
        ctx.font = "32px sans-serif";
        ctx.fillText("🔒", d.x, 185);
      }
    });

    // 4. THEMED LOCKERS: Pastel yellow, green, and blue lockers with drawings and name tags
    const lockers = [
      // Space 0: Left of Kindergarten Door 180 (4 lockers)
      { x: 25, color: "#ffd166", name: "OLIVER" },
      { x: 49, color: "#06d6a0", name: "MIA" },
      { x: 73, color: "#118ab2", name: "LEO" },
      { x: 97, color: "#ff7e5f", name: "LUNA" },
      
      // Space 1: Between Kindergarten (180) and 1st Grade (340) - 3 lockers
      { x: 226, color: "#06d6a0", name: "SIMBA" },
      { x: 250, color: "#118ab2", name: "MILO" },
      { x: 274, color: "#ffd166", name: "FELIX" },
      
      // Space 2: Between 1st Grade (340) and 2nd Grade (500) - 3 lockers
      { x: 386, color: "#118ab2", name: "CLEO" },
      { x: 410, color: "#ff7e5f", name: "SMOKEY" },
      { x: 434, color: "#06d6a0", name: "BELLA" },
      
      // Space 3: Between 2nd Grade (500) and 3rd Grade (660) - 3 lockers
      { x: 546, color: "#ffd166", name: "OREO" },
      { x: 570, color: "#118ab2", name: "LILY" },
      { x: 594, color: "#06d6a0", name: "MAX" },
      
      // Space 4: Between 3rd Grade (660) and 4th Grade (820) - 3 lockers
      { x: 706, color: "#118ab2", name: "TIGER" },
      { x: 730, color: "#ffd166", name: "COCO" },
      { x: 754, color: "#ff7e5f", name: "CHLOE" },
      
      // Space 5: Between 4th Grade (820) and 5th Grade (980) - 3 lockers
      { x: 866, color: "#06d6a0", name: "NALA" },
      { x: 890, color: "#ffd166", name: "JASPER" },
      { x: 914, color: "#118ab2", name: "SHADOW" },
      
      // Space 6: Between 5th Grade (980) and Principal (1140) - 3 lockers
      { x: 1026, color: "#ff7e5f", name: "LOKI" },
      { x: 1050, color: "#06d6a0", name: "LUCY" },
      { x: 1074, color: "#ffd166", name: "COOKIE" },
      
      // Space 7: Right of Principal Door 1140 - 3 lockers
      { x: 1186, color: "#118ab2", name: "PEANUT" },
      { x: 1210, color: "#ff7e5f", name: "DAISY" },
      { x: 1234, color: "#06d6a0", name: "PUMPKIN" }
    ];

    lockers.forEach((locker, idx) => {
      const xPos = locker.x;
      // Locker body
      ctx.fillStyle = locker.color;
      ctx.fillRect(xPos, 110, 20, 142);
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 2;
      ctx.strokeRect(xPos, 110, 20, 142);
      
      // Vent slats
      ctx.beginPath();
      ctx.moveTo(xPos + 5, 118); ctx.lineTo(xPos + 15, 118);
      ctx.moveTo(xPos + 5, 122); ctx.lineTo(xPos + 15, 122);
      ctx.moveTo(xPos + 5, 126); ctx.lineTo(xPos + 15, 126);
      ctx.stroke();
      
      // Handle
      ctx.fillStyle = "#5d6d7e";
      ctx.fillRect(xPos + 15, 170, 3, 10);
      
      // Name tag taped to locker
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(xPos + 1, 140, 18, 8);
      ctx.strokeRect(xPos + 1, 140, 18, 8);
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 5px Nunito";
      ctx.textAlign = "center";
      ctx.fillText(locker.name, xPos + 10, 146, 16);
      
      // Drawing/Star sticker taped on some lockers
      if (idx % 2 === 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(xPos + 3, 190, 14, 14);
        ctx.strokeRect(xPos + 3, 190, 14, 14);
        // child flower sketch
        ctx.fillStyle = "#ff7e5f";
        ctx.beginPath(); ctx.arc(xPos + 10, 197, 3, 0, Math.PI*2); ctx.fill();
      }
    });

    // 5. WOODEN BULLETIN BOARD: display fall leaves and drawings
    const boardX = 1270;
    ctx.fillStyle = "#a0522d"; // wooden frame
    ctx.fillRect(boardX, 100, 90, 130);
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boardX, 100, 90, 130);
    ctx.fillStyle = "#deb887"; // cork texture
    ctx.fillRect(boardX + 6, 106, 78, 118);
    
    // Pin papers
    ctx.fillStyle = "white";
    ctx.fillRect(boardX + 15, 115, 25, 30);
    ctx.strokeRect(boardX + 15, 115, 25, 30);
    ctx.fillStyle = "#ffb74d";
    ctx.fillRect(boardX + 48, 125, 30, 25);
    ctx.strokeRect(boardX + 48, 125, 30, 25);
    // Draw leaf sketch
    ctx.fillStyle = "#e67e22";
    ctx.font = "14px sans-serif";
    ctx.fillText("🍁", boardX + 27, 135);
    ctx.fillText("🍃", boardX + 63, 142);

    // 6. HANGING CEILING BANNER: "WELCOME TO ELEMENTARY SCHOOL!"
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(490, 15);
    ctx.lineTo(890, 15);
    ctx.lineTo(880, 48);
    ctx.lineTo(500, 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hanging ropes
    ctx.beginPath();
    ctx.moveTo(520, 0); ctx.lineTo(520, 15);
    ctx.moveTo(860, 0); ctx.lineTo(860, 15);
    ctx.stroke();
    // Banner text
    ctx.fillStyle = "#1b4f72";
    ctx.font = "bold 15px Fredoka";
    ctx.fillText("WELCOME TO CAT ELEMENTARY SCHOOL!", 690, 36);
    ctx.restore();
  },

  /**
   * Classroom Background
   */
  drawClassroomBackground() {
    const ctx = this.ctx;
    
    // Flooring - Warm checkered pattern
    ctx.fillStyle = "#f5f5dc";
    ctx.fillRect(0, 260, this.width, this.height - 260);
    
    const tileColors = ["#fceade", "#e3f0ec", "#fffbe6", "#eaf2f8"];
    const tileW = 50;
    const tileH = 25;
    
    for (let x = 0; x < this.width; x += tileW) {
      for (let y = 260; y < this.height; y += tileH) {
        const colorIdx = Math.abs(Math.floor(x / tileW) + Math.floor(y / tileH)) % tileColors.length;
        ctx.fillStyle = tileColors[colorIdx];
        ctx.fillRect(x, y, tileW, tileH);
        ctx.strokeStyle = "rgba(44, 62, 80, 0.04)";
        ctx.strokeRect(x, y, tileW, tileH);
      }
    }
    
    // Wall - Cozy yellow cream
    ctx.fillStyle = "#fffdf0";
    ctx.fillRect(0, 0, this.width, 260);
    
    // Trim
    ctx.fillStyle = "#cd853f";
    ctx.fillRect(0, 252, this.width, 8);
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 258, this.width, 2);
    
    // Door on left to exit
    ctx.fillStyle = "#8a5a36";
    ctx.fillRect(0, 110, 30, 142);
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-5, 110, 35, 142);
    ctx.fillStyle = "#f4a460";
    ctx.fillRect(0, 115, 24, 132);
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(15, 185, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Big green chalkboard on center wall
    ctx.fillStyle = "#1e8449";
    ctx.fillRect(180, 45, 440, 120);
    ctx.strokeStyle = "#855c33";
    ctx.lineWidth = 6;
    ctx.strokeRect(180, 45, 440, 120);
    // double dark outline
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.strokeRect(177, 42, 446, 126);
    
    ctx.fillStyle = "white";
    ctx.font = "bold 20px 'Fredoka'";
    ctx.textAlign = "center";
    const gradeName = this.game.getGradeFullName(this.currentGradeIdx);
    ctx.fillText(`Welcome to ${gradeName}!`, 400, 85);
    
    ctx.font = "14px 'Nunito'";
    ctx.fillStyle = "#fcf3cf";
    ctx.fillText("⭐ Complete all subjects first! ⭐", 400, 118);
    ctx.fillText("🎓 Then take the Final Graduation Test at the teacher's desk!", 400, 142);
    
    // Draw Teacher NPC behind the teacher's desk
    const testDesk = this.classroomHotspots.find(h => h.id === "test");
    if (testDesk) {
      this.drawTeacherNPC(testDesk.x, testDesk.y - 10);
    } else {
      this.drawTeacherNPC(650, 290);
    }
  },

  drawTeacherNPC(x, y) {
    const ctx = this.ctx;
    const gradeIdx = this.currentGradeIdx;
    
    const TEACHER_STYLES = [
      { name: "Mrs. Tabby", head: "#e67e22", ears: "#d35400", sweater: "#a569bd", breed: "tabby" },
      { name: "Mr. Siamese", head: "#f3eae1", ears: "#5d4437", sweater: "#3498db", breed: "siamese" },
      { name: "Ms. Russian Blue", head: "#7f8c8d", ears: "#34495e", sweater: "#e74c3c", breed: "russianblue" },
      { name: "Mrs. Tuxedo", head: "#2c3e50", ears: "#1a252f", sweater: "#27ae60", breed: "tuxedo" },
      { name: "Mr. Calico", head: "#ffffff", ears: "#e67e22", sweater: "#f39c12", breed: "calico" },
      { name: "Prof. Persian", head: "#f2f4f4", ears: "#bdc3c7", sweater: "#16a085", breed: "persian" }
    ];

    const style = TEACHER_STYLES[gradeIdx] || TEACHER_STYLES[0];
    
    ctx.save();
    
    // Ears
    ctx.fillStyle = style.ears;
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 20);
    ctx.lineTo(x - 5, y - 48);
    ctx.lineTo(x + 5, y - 25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + 15, y - 20);
    ctx.lineTo(x + 5, y - 48);
    ctx.lineTo(x - 5, y - 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Fluffy Head shape
    ctx.fillStyle = style.head;
    ctx.beginPath();
    ctx.arc(x, y - 20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Cheek fluffs
    ctx.beginPath();
    ctx.arc(x - 15, y - 16, 5, 0, Math.PI*2);
    ctx.arc(x + 15, y - 16, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // Breed specific overlays
    if (style.breed === "siamese") {
      // Siamese dark face mask
      ctx.fillStyle = style.ears;
      ctx.beginPath();
      ctx.ellipse(x, y - 20, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (style.breed === "calico") {
      // Orange patch left, black patch right
      ctx.fillStyle = "#e67e22";
      ctx.beginPath();
      ctx.arc(x - 7, y - 23, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2c3e50";
      ctx.beginPath();
      ctx.arc(x + 8, y - 18, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (style.breed === "tuxedo") {
      // White muzzle patch
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(x, y - 16, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (style.breed === "tabby") {
      // Forehead tabby stripes
      ctx.strokeStyle = style.ears;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 34); ctx.lineTo(x - 4, y - 28);
      ctx.moveTo(x, y - 35); ctx.lineTo(x, y - 27);
      ctx.moveTo(x + 4, y - 34); ctx.lineTo(x + 4, y - 28);
      ctx.stroke();
    }

    // Glasses
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(x - 6, y - 22, 6, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x + 6, y - 22, 6, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    
    // Nose/Mouth
    ctx.fillStyle = "#e57373";
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 15);
    ctx.lineTo(x + 2, y - 15);
    ctx.lineTo(x, y - 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Sweater
    ctx.fillStyle = style.sweater;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 4);
    ctx.lineTo(x + 20, y - 4);
    ctx.lineTo(x + 14, y + 30);
    ctx.lineTo(x - 14, y + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();

    // Name Tag above teacher's head
    ctx.save();
    ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
    ctx.font = "bold 9px Fredoka";
    ctx.textAlign = "center";
    const nameWidth = ctx.measureText(style.name).width + 8;
    ctx.fillRect(x - nameWidth / 2, y - 62, nameWidth, 13);
    ctx.fillStyle = "white";
    ctx.fillText(style.name, x, y - 52);
    ctx.restore();
  },

  drawOutlineStar(ctx, cx, cy, radius = 9) {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.restore();
  },

  drawClassroomProps() {
    const ctx = this.ctx;
    
    this.classroomHotspots.forEach(t => {
      const isSolved = this.game.isPuzzleCompleted(this.currentGradeIdx, t.id);
      
      // Shadow
      ctx.fillStyle = "rgba(44, 62, 80, 0.08)";
      ctx.beginPath();
      ctx.ellipse(t.x, t.y + 15, t.radius - 5, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Desk Base (Legs)
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(t.x - 22, t.y); ctx.lineTo(t.x - 26, t.y + 22);
      ctx.moveTo(t.x + 22, t.y); ctx.lineTo(t.x + 26, t.y + 22);
      ctx.stroke();

      if (t.id === "math") {
        // Sandbox Table
        ctx.fillStyle = "#cd853f";
        ctx.fillRect(t.x - 35, t.y - 15, 70, 30);
        ctx.strokeRect(t.x - 35, t.y - 15, 70, 30);
        
        ctx.fillStyle = "#eedc82";
        ctx.fillRect(t.x - 30, t.y - 10, 60, 20);
        
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(t.x - 10, t.y, 4, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = "#3498db";
        ctx.fillRect(t.x + 10, t.y - 4, 6, 8);
        ctx.strokeRect(t.x + 10, t.y - 4, 6, 8);
        
      } else if (t.id === "reading") {
        // Reading Table
        ctx.fillStyle = "#e67e22";
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius - 10, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = "#3498db";
        ctx.fillRect(t.x - 18, t.y - 10, 14, 5);
        ctx.strokeRect(t.x - 18, t.y - 10, 14, 5);
        
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(t.x - 16, t.y - 6, 12, 5);
        ctx.strokeRect(t.x - 16, t.y - 6, 12, 5);
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(t.x + 2, t.y - 6, 10, 10);
        ctx.strokeRect(t.x + 2, t.y - 6, 10, 10);
        ctx.fillRect(t.x + 12, t.y - 6, 10, 10);
        ctx.strokeRect(t.x + 12, t.y - 6, 10, 10);
        
        ctx.beginPath();
        ctx.moveTo(t.x + 12, t.y - 6); ctx.lineTo(t.x + 12, t.y + 4);
        ctx.stroke();

      } else if (t.id === "science") {
        // Science Bench
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(t.x - 38, t.y - 12, 76, 24);
        ctx.strokeRect(t.x - 38, t.y - 12, 76, 24);
        
        ctx.fillStyle = "#3498db";
        ctx.fillRect(t.x - 20, t.y - 6, 8, 12);
        ctx.strokeStyle = "#2c3e50";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t.x - 20, t.y - 6, 8, 12);
        
        ctx.fillStyle = "#2ecc71";
        ctx.beginPath();
        ctx.arc(t.x + 15, t.y + 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(t.x + 13, t.y - 8, 4, 6);
        ctx.stroke();
        
      } else if (t.id === "test") {
        // Teacher's Desk
        ctx.fillStyle = "#8b4513";
        ctx.fillRect(t.x - 42, t.y - 18, 84, 36);
        ctx.strokeRect(t.x - 42, t.y - 18, 84, 36);
        
        ctx.fillStyle = "#5c2d0c";
        ctx.fillRect(t.x - 34, t.y - 10, 20, 12);
        ctx.strokeRect(t.x - 34, t.y - 10, 20, 12);
        ctx.fillRect(t.x + 14, t.y - 10, 20, 12);
        ctx.strokeRect(t.x + 14, t.y - 10, 20, 12);
        
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(t.x - 18, t.y - 8, 4, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        
        ctx.strokeStyle = "#2ecc71";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(t.x - 18, t.y - 12); ctx.lineTo(t.x - 16, t.y - 15);
        ctx.stroke();
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(t.x + 2, t.y - 10, 14, 18);
        ctx.strokeStyle = "#2c3e50";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t.x + 2, t.y - 10, 14, 18);
        
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 9px Nunito";
        ctx.textAlign = "center";
        ctx.fillText("A+", t.x + 9, t.y + 2);
      } else if (t.id === "typing") {
        // Computer desk (retro blue monitor and white keyboard)
        ctx.fillStyle = "#5c3d2e"; // Dark wooden desk top
        ctx.fillRect(t.x - 36, t.y - 12, 72, 24);
        ctx.strokeRect(t.x - 36, t.y - 12, 72, 24);
        
        // Retro blue monitor base
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(t.x - 12, t.y - 2, 24, 4);
        ctx.strokeRect(t.x - 12, t.y - 2, 24, 4);
        ctx.fillRect(t.x - 4, t.y - 8, 8, 8);
        ctx.strokeRect(t.x - 4, t.y - 8, 8, 8);
        
        // Retro blue monitor screen housing
        ctx.fillStyle = "#bdc3c7";
        ctx.fillRect(t.x - 22, t.y - 28, 44, 20);
        ctx.strokeRect(t.x - 22, t.y - 28, 44, 20);
        
        // Screen (retro blue/cyan)
        ctx.fillStyle = "#00d2ff";
        ctx.fillRect(t.x - 18, t.y - 24, 36, 12);
        
        // Green text cursor on screen
        ctx.fillStyle = "#39ff14";
        ctx.fillRect(t.x - 12, t.y - 20, 4, 4);
        
        // Keyboard (white keyboard in front of monitor)
        ctx.fillStyle = "#ecf0f1";
        ctx.fillRect(t.x - 18, t.y + 4, 36, 6);
        ctx.strokeRect(t.x - 18, t.y + 4, 36, 6);
      }

      ctx.lineWidth = 2.2;
      
      // Label text
      ctx.font = "bold 13px Fredoka";
      ctx.textAlign = "center";
      
      // Crisp white outline stroke
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3.5;
      ctx.strokeText(t.name, t.x, t.y + 36);
      
      // Clean filled text
      ctx.fillStyle = "#2c3e50";
      ctx.fillText(t.name, t.x, t.y + 36);

      // Solved marker
      if (isSolved) {
        const stars = this.game.getPuzzleStars(this.currentGradeIdx, t.id);
        if (stars > 0) {
          ctx.fillStyle = "#f1c40f";
          ctx.font = "bold 16px sans-serif";
          const starStr = "⭐".repeat(stars);
          ctx.fillText(starStr, t.x, t.y - 25);
        } else {
          ctx.fillStyle = "#2ecc71";
          ctx.font = "bold 18px sans-serif";
          ctx.fillText("✅", t.x + 22, t.y - 20);
        }
      } else {
        const floatY = t.y - 32 + Math.sin(Date.now() / 150) * 4;
        this.drawOutlineStar(ctx, t.x, floatY - 6, 9);
      }
    });
  },

  drawPlayerCats() {
    const ctx = this.ctx;
    const players = this.game.state.players;
    
    for (let i = players.length - 1; i >= 0; i--) {
      const p = players[i];
      const breed = p.breed;
      const color = p.color;
      
      const trailIndex = i * this.trailGap;
      const pos = this.trailHistory[trailIndex] || this.trailHistory[this.trailHistory.length - 1] || { x: this.playerX, y: this.playerY, facing: this.facing, isWalking: false };
      
      this.drawSingleCat(pos.x, pos.y, breed, color, pos.facing, pos.isWalking, p.name);
    }
  },

  /**
   * Custom Redraw matching the reference: polo shirts, green backpacks, red sneakers!
   */
  drawSingleCat(x, y, breedId, collarColor, facing, isWalking, name) {
    const ctx = this.ctx;
    const breed = CAT_BREEDS[breedId] || CAT_BREEDS.tabby;
    const p = breed.primary;
    const s = breed.secondary;
    const eyes = breed.eyes;
    
    ctx.save();
    ctx.translate(x, y);
    
    if (facing === "right") {
      ctx.scale(-1, 1);
    }
    
    let legOffset = 0;
    let bodyOffset = 0;
    if (isWalking) {
      legOffset = Math.sin(Date.now() / 80) * 4;
      bodyOffset = Math.abs(Math.sin(Date.now() / 80)) * 2;
    }

    // 1. Shadow
    ctx.fillStyle = "rgba(44, 62, 80, 0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 14, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tail (bold outlines)
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    const tailBob = isWalking ? Math.sin(Date.now() / 100) * 4 : 0;
    ctx.quadraticCurveTo(24, -5 + tailBob, 20, -18 + tailBob);
    ctx.stroke();
    // Inner fill for tail
    ctx.strokeStyle = breedId === "siamese" || breedId === "russianblue" ? s : p;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Legs and paws (Natural paw drawing matching breed color points)
    const pawColor = (breedId === "siamese" || breedId === "tuxedo") ? s : p;

    ctx.fillStyle = p;
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#2c3e50";
    
    // Back legs (Left and Right)
    ctx.fillRect(3, 4 + legOffset, 4, 6);
    ctx.strokeRect(3, 4 + legOffset, 4, 6);
    ctx.fillStyle = pawColor;
    ctx.beginPath();
    ctx.ellipse(5, 10 + legOffset, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = p;
    ctx.fillRect(8, 4 - legOffset, 4, 6);
    ctx.strokeRect(8, 4 - legOffset, 4, 6);
    ctx.fillStyle = pawColor;
    ctx.beginPath();
    ctx.ellipse(10, 10 - legOffset, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Front legs
    ctx.fillStyle = p;
    ctx.fillRect(-7, 4 + legOffset, 4, 6);
    ctx.strokeRect(-7, 4 + legOffset, 4, 6);
    ctx.fillStyle = pawColor;
    ctx.beginPath();
    ctx.ellipse(-5, 10 + legOffset, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = p;
    ctx.fillRect(-12, 4 - legOffset, 4, 6);
    ctx.strokeRect(-12, 4 - legOffset, 4, 6);
    ctx.fillStyle = pawColor;
    ctx.beginPath();
    ctx.ellipse(-10, 10 - legOffset, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 4. Natural Body
    ctx.fillStyle = p;
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#2c3e50";
    ctx.beginPath();
    ctx.ellipse(0, -2 - bodyOffset, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Overlays for specific breeds (Calico/Tuxedo/Tabby parts)
    if (breedId === "calico") {
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.ellipse(4, -4 - bodyOffset, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = breed.extra;
      ctx.beginPath();
      ctx.ellipse(-6, -2 - bodyOffset, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (breedId === "tuxedo") {
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.ellipse(-8, 0 - bodyOffset, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (breedId === "tabby") {
      ctx.strokeStyle = s;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(2, -6 - bodyOffset); ctx.quadraticCurveTo(4, -3 - bodyOffset, 2, 0 - bodyOffset);
      ctx.moveTo(6, -4 - bodyOffset); ctx.quadraticCurveTo(8, -1 - bodyOffset, 6, 2 - bodyOffset);
      ctx.moveTo(-2, -5 - bodyOffset); ctx.quadraticCurveTo(0, -2 - bodyOffset, -2, 1 - bodyOffset);
      ctx.stroke();
    }



    // 6. Head (cheek fluffy bumps)
    ctx.fillStyle = p;
    
    // draw round ears first
    const earColor = breedId === "siamese" ? s : p;
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.moveTo(-18, -17 - bodyOffset);
    ctx.lineTo(-18, -26 - bodyOffset);
    ctx.lineTo(-12, -20 - bodyOffset);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-8, -20 - bodyOffset);
    ctx.lineTo(-6, -26 - bodyOffset);
    ctx.lineTo(-4, -17 - bodyOffset);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Fluffy Head shape
    ctx.fillStyle = p;
    ctx.beginPath();
    ctx.arc(-11, -12 - bodyOffset, 9, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // cheeks fluff extensions
    ctx.beginPath();
    ctx.arc(-17, -10 - bodyOffset, 3.5, 0, Math.PI * 2);
    ctx.arc(-5, -10 - bodyOffset, 3.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    
    // Siamese mask & Calico/Tabby head patterns
    if (breedId === "siamese") {
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.ellipse(-11, -11 - bodyOffset, 6.5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (breedId === "calico") {
      // Orange patch on right head
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.arc(-7, -13 - bodyOffset, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Black patch on left head
      ctx.fillStyle = breed.extra;
      ctx.beginPath();
      ctx.arc(-15, -11 - bodyOffset, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (breedId === "tabby") {
      // Tabby stripes on forehead
      ctx.strokeStyle = s;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-13, -19 - bodyOffset); ctx.lineTo(-13, -16 - bodyOffset);
      ctx.moveTo(-11, -20 - bodyOffset); ctx.lineTo(-11, -15 - bodyOffset);
      ctx.moveTo(-9, -19 - bodyOffset); ctx.lineTo(-9, -16 - bodyOffset);
      ctx.stroke();
    }

    // 5. Neck collar (drawn on top of head base so it is fully visible)
    ctx.strokeStyle = collarColor;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-16, -2 - bodyOffset);
    ctx.quadraticCurveTo(-11, 1 - bodyOffset, -6, -2 - bodyOffset);
    ctx.stroke();
    
    // Collar bell
    ctx.fillStyle = "#f1c40f";
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-11, 2 - bodyOffset, 2.6, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();


    // Whiskers
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-18, -9 - bodyOffset); ctx.lineTo(-24, -9 - bodyOffset);
    ctx.moveTo(-18, -11 - bodyOffset); ctx.lineTo(-25, -12 - bodyOffset);
    ctx.moveTo(-5, -9 - bodyOffset); ctx.lineTo(1, -9 - bodyOffset);
    ctx.moveTo(-5, -11 - bodyOffset); ctx.lineTo(2, -12 - bodyOffset);
    ctx.stroke();

    // Sparkling Eyes (White bases + iris + pupil + sparkles)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-14, -14 - bodyOffset, 2.5, 0, Math.PI * 2);
    ctx.arc(-8, -14 - bodyOffset, 2.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    
    // Iris
    ctx.fillStyle = eyes;
    ctx.beginPath();
    ctx.arc(-14, -14 - bodyOffset, 1.8, 0, Math.PI * 2);
    ctx.arc(-8, -14 - bodyOffset, 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-14, -14 - bodyOffset, 1.1, 0, Math.PI * 2);
    ctx.arc(-8, -14 - bodyOffset, 1.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Sparkling highlights
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-14.8, -14.8 - bodyOffset, 0.6, 0, Math.PI * 2);
    ctx.arc(-8.8, -14.8 - bodyOffset, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = breed.nose || "#e57373";
    ctx.beginPath();
    ctx.moveTo(-12, -9.5 - bodyOffset);
    ctx.lineTo(-10, -9.5 - bodyOffset);
    ctx.lineTo(-11, -8.5 - bodyOffset);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    
    // Name Tag
    ctx.save();
    ctx.fillStyle = "rgba(44, 62, 80, 0.75)";
    ctx.font = "bold 9px Fredoka";
    ctx.textAlign = "center";
    const nameWidth = ctx.measureText(name).width + 8;
    ctx.fillRect(x - nameWidth / 2, y - 44 - bodyOffset, nameWidth, 13);
    ctx.fillStyle = "white";
    ctx.fillText(name, x, y - 34 - bodyOffset);
    ctx.restore();
  },

  getNearestNPC() {
    if (!this.npcs) return null;
    let nearest = null;
    let minDist = 65; // interaction range: 65 pixels
    
    this.npcs.forEach(npc => {
      const isCurrent = (this.currentView === "hallway" && npc.room === "hallway") || 
                        (this.currentView === "classroom" && npc.room === "classroom" && npc.grade === this.currentGradeIdx);
      if (!isCurrent) return;
      
      const dist = Math.hypot(this.playerX - npc.x, this.playerY - npc.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = npc;
      }
    });
    return nearest;
  },

  triggerNPCSpeechBubble(npc) {
    const sounds = [
      "Meow! 😸",
      "Purr... 😽",
      "Mew~ 🐾",
      "Mrrrp! 😻",
      "Meow-meow! 😺",
      "Nyaa~ 😸",
      "Prrrt? 😼",
      "Mrow! 😽"
    ];
    const text = sounds[Math.floor(Math.random() * sounds.length)];
    npc.speechBubble = {
      text: text,
      timer: 120 // 2 seconds at 60 fps
    };
    // Make NPC face the player
    npc.facing = (this.playerX > npc.x) ? "right" : "left";
  },

  drawSpeechBubble(ctx, x, y, text, isWalking = false) {
    let bodyOffset = 0;
    if (isWalking) {
      bodyOffset = Math.abs(Math.sin(Date.now() / 80)) * 2;
    }
    ctx.save();
    ctx.font = "bold 11px 'Fredoka'";
    const textWidth = ctx.measureText(text).width;
    const bubbleWidth = textWidth + 16;
    const bubbleHeight = 22;
    const bx = x - bubbleWidth / 2;
    const by = y - 76 - bodyOffset; // Draw it higher than the name tag!
    
    // Draw bubble rounded rect shadow
    ctx.fillStyle = "rgba(44, 62, 80, 0.15)";
    const shadowOffset = 2;
    ctx.beginPath();
    
    // Rounded rect manually for 100% cross-browser safety
    const r = 8;
    ctx.moveTo(bx + r + shadowOffset, by + shadowOffset);
    ctx.lineTo(bx + bubbleWidth - r + shadowOffset, by + shadowOffset);
    ctx.quadraticCurveTo(bx + bubbleWidth + shadowOffset, by + shadowOffset, bx + bubbleWidth + shadowOffset, by + r + shadowOffset);
    ctx.lineTo(bx + bubbleWidth + shadowOffset, by + bubbleHeight - r + shadowOffset);
    ctx.quadraticCurveTo(bx + bubbleWidth + shadowOffset, by + bubbleHeight + shadowOffset, bx + bubbleWidth - r + shadowOffset, by + bubbleHeight + shadowOffset);
    ctx.lineTo(bx + r + shadowOffset, by + bubbleHeight + shadowOffset);
    ctx.quadraticCurveTo(bx + shadowOffset, by + bubbleHeight + shadowOffset, bx + shadowOffset, by + bubbleHeight - r + shadowOffset);
    ctx.lineTo(bx + shadowOffset, by + r + shadowOffset);
    ctx.quadraticCurveTo(bx + shadowOffset, by + shadowOffset, bx + r + shadowOffset, by + shadowOffset);
    ctx.closePath();
    ctx.fill();

    // Draw bubble rounded rect
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bubbleWidth - r, by);
    ctx.quadraticCurveTo(bx + bubbleWidth, by, bx + bubbleWidth, by + r);
    ctx.lineTo(bx + bubbleWidth, by + bubbleHeight - r);
    ctx.quadraticCurveTo(bx + bubbleWidth, by + bubbleHeight, bx + bubbleWidth - r, by + bubbleHeight);
    
    // Small triangle pointer at the bottom pointing down
    ctx.lineTo(x + 5, by + bubbleHeight);
    ctx.lineTo(x, by + bubbleHeight + 6);
    ctx.lineTo(x - 5, by + bubbleHeight);
    
    ctx.lineTo(bx + r, by + bubbleHeight);
    ctx.quadraticCurveTo(bx, by + bubbleHeight, bx, by + bubbleHeight - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw text inside bubble
    ctx.fillStyle = "#2c3e50";
    ctx.textAlign = "center";
    ctx.fillText(text, x, by + 15);
    ctx.restore();
  }
};
export default MapEngine;
