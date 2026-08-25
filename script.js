/* =========================================================
   RADHIKA DATE INVITE — script.js
   Plain JS, no dependencies. Pixel-art dog is drawn on
   <canvas> from small hand-authored pixel grids and scaled
   up crisply via CSS `image-rendering: pixelated`.
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) document.body.classList.add("reduced-motion");

  /* =========================================================
     1. PIXEL DOG SPRITE ENGINE
     ========================================================= */

  // Left-half rows (8 px) of a 16-wide symmetric sitting puppy.
  // Mirrored at draw time to produce the full 16x19 sprite.
  // The center column (index 7) stays filled through the head/body so the
  // two mirrored halves read as ONE silhouette instead of two side-by-side
  // blobs — only the paw row intentionally gaps at the center.
  const DOG_HALF = [
    "........", // 0  spacer
    "......oo", // 1  head top point
    ".....ohh", // 2  head widening
    "....ohhh", // 3  head widening
    "...ohhhh", // 4  head widening
    "oeeohhhh", // 5  ear (outer) + head
    "oeeohhhh", // 6  ear (outer) + head
    ".oohhhhh", // 7  ear taper into cheek
    "..ohhhhh", // 8  cheek
    "..ohkkhh", // 9  EYES row
    "..ohwwww", // 10 muzzle / MOUTH row
    "...ohhhh", // 11 chin narrows
    "....ohhh", // 12 neck narrows
    "..ohhhhh", // 13 shoulders widen
    "..orrrrr", // 14 collar
    "..ohhhhh", // 15 body
    "..ohhhhh", // 16 body
    "..hw.wh.", // 17 paws (center gap is intentional)
    "........", // 18 spacer
  ];
  const ROW_EYES = 9;
  const ROW_EYES_UPPER = 8;
  const ROW_MOUTH = 10;

  function mirrorRow(half) {
    return (half + half.split("").reverse().join("")).split("");
  }

  function buildGrid(halfRows) {
    return halfRows.map(mirrorRow);
  }

  const BASE_GRID = buildGrid(DOG_HALF);
  const COLS = BASE_GRID[0].length;
  const CENTER_L = COLS / 2 - 1; // 7
  const CENTER_R = COLS / 2; // 8

  function gridFor(expression) {
    const g = BASE_GRID.map((row) => row.slice());
    if (expression === "blink") {
      g[ROW_EYES][4] = "o";
      g[ROW_EYES][5] = "o";
      g[ROW_EYES][10] = "o";
      g[ROW_EYES][11] = "o";
    } else if (expression === "surprised") {
      g[ROW_EYES_UPPER][4] = "k";
      g[ROW_EYES_UPPER][5] = "k";
      g[ROW_EYES_UPPER][10] = "k";
      g[ROW_EYES_UPPER][11] = "k";
      g[ROW_MOUTH][CENTER_L] = "o";
      g[ROW_MOUTH][CENTER_R] = "o";
    } else if (expression === "sideeye") {
      g[ROW_EYES][10] = "o";
      g[ROW_EYES][11] = "o";
    } else if (expression === "happy") {
      g[ROW_EYES][4] = "o";
      g[ROW_EYES][5] = "o";
      g[ROW_EYES][10] = "o";
      g[ROW_EYES][11] = "o";
      g[ROW_MOUTH][CENTER_L] = "f";
      g[ROW_MOUTH][CENTER_R] = "f";
    }
    return g;
  }

  // ---------------------------------------------------------
  // STAGE-1 HERO PUPPY — a separate, larger, more detailed
  // sprite used ONLY for Stage 1's dog. Built the same way as
  // the shared puppy above (mirrored half-rows) but at higher
  // resolution with a couple of extra details (eye glint,
  // blush, a tiny collar charm). Entirely independent data —
  // does not touch DOG_HALF/PALETTE_MAIN/etc., so every other
  // stage's dog rendering is unaffected.
  // ---------------------------------------------------------
  const DOG1_HALF = [
    "..........", // 0  spacer
    ".......ooo", // 1  head top point
    "......ohhh", // 2  head widening
    ".....ohhhh", // 3  head widening
    "....ohhhhh", // 4  head widening
    "oeeohhhhhh", // 5  ear (outer) + head
    "oeeohhhhhh", // 6  ear (outer) + head
    ".oohhhhhhh", // 7  ear taper into cheek
    "..ohhhhhhh", // 8  cheek
    "..ohgkkhhh", // 9  EYES row (g = glint, k = pupil, 3px wide)
    "..obwwwwww", // 10 muzzle / MOUTH row (b = blush)
    "....ohhhhh", // 11 chin narrows
    ".....ohhhh", // 12 neck narrows
    "...ohhhhhh", // 13 shoulders widen
    "...orrrrrr", // 14 collar
    "...ohhhhhc", // 15 body (c = tiny collar charm)
    "...ohhhhhh", // 16 body
    "...ohhhhhh", // 17 body
    "..hw..wh..", // 18 paws (center gap intentional)
    "..........", // 19 spacer
  ];
  const ROW_EYES1 = 9;
  const ROW_EYES1_UPPER = 8;
  const ROW_MOUTH1 = 10;

  const BASE_GRID1 = buildGrid(DOG1_HALF);
  const COLS1 = BASE_GRID1[0].length;
  const CENTER1_L = COLS1 / 2 - 1; // 9
  const CENTER1_R = COLS1 / 2; // 10

  const EYE1_L = [4, 5, 6];
  const EYE1_R = [13, 14, 15];

  function gridFor1(expression) {
    const g = BASE_GRID1.map((row) => row.slice());
    if (expression === "blink") {
      EYE1_L.forEach((c) => (g[ROW_EYES1][c] = "o"));
      EYE1_R.forEach((c) => (g[ROW_EYES1][c] = "o"));
    } else if (expression === "surprised") {
      EYE1_L.forEach((c) => (g[ROW_EYES1_UPPER][c] = "k"));
      EYE1_R.forEach((c) => (g[ROW_EYES1_UPPER][c] = "k"));
      g[ROW_MOUTH1][CENTER1_L] = "o";
      g[ROW_MOUTH1][CENTER1_R] = "o";
    } else if (expression === "sideeye") {
      EYE1_R.forEach((c) => (g[ROW_EYES1][c] = "o"));
    } else if (expression === "happy") {
      EYE1_L.forEach((c) => (g[ROW_EYES1][c] = "o"));
      EYE1_R.forEach((c) => (g[ROW_EYES1][c] = "o"));
      g[ROW_MOUTH1][CENTER1_L] = "f";
      g[ROW_MOUTH1][CENTER1_R] = "f";
    }
    return g;
  }

  const PALETTE_HERO = {
    o: "#4a2a1c",
    e: "#e0995c",
    h: "#f8c988",
    w: "#fff8ef",
    k: "#2a1810",
    g: "#ffffff",
    b: "#ffb3c6",
    r: "#ff4d79",
    c: "#ffd166",
  };

  function createHeroDog(bodyCanvasId, tailCanvasId) {
    const bodyCanvas = document.getElementById(bodyCanvasId);
    const tailCanvas = document.getElementById(tailCanvasId);
    drawGrid(tailCanvas, buildTailGrid(), TAIL_PALETTE_MAIN);
    const instance = {
      bodyCanvas,
      expression: "idle",
      locked: false,
      setExpression(expr) {
        this.expression = expr;
        drawGrid(this.bodyCanvas, gridFor1(expr), PALETTE_HERO);
      },
    };
    instance.setExpression("idle");
    dogRegistry.push(instance);
    return instance;
  }

  const TAIL_GRID = [
    "...oo...",
    "..oeeo..",
    ".oeeeo..",
    ".oeeo...",
    "oeeo....",
    "oeeo....",
    ".oeeo...",
    "..oeeo..",
    "...oeo..",
    "....oo..",
  ];

  const PALETTE_MAIN = {
    o: "#4a2a1c",
    e: "#e0995c",
    h: "#f8c988",
    w: "#fff8ef",
    k: "#2a1810",
    r: "#ff4d79",
    f: "#ff9db8",
  };
  const PALETTE_PARTNER = {
    o: "#4a2a1c",
    e: "#c98a5a",
    h: "#fdf1e2",
    w: "#ffffff",
    k: "#2a1810",
    r: "#b56cf0",
    f: "#ff9db8",
  };
  const TAIL_PALETTE_MAIN = { o: "#4a2a1c", e: "#e0995c" };
  const TAIL_PALETTE_PARTNER = { o: "#4a2a1c", e: "#c98a5a" };

  function drawGrid(canvas, grid, palette) {
    if (!canvas) return;
    const rows = grid.length;
    const cols = grid[0].length;
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, cols, rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const ch = grid[y][x];
        const color = palette[ch];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  // Registry of all dog instances so a global blink loop can animate them.
  const dogRegistry = [];

  function createDog(bodyCanvasId, tailCanvasId, variant) {
    const bodyCanvas = document.getElementById(bodyCanvasId);
    const tailCanvas = document.getElementById(tailCanvasId);
    const palette = variant === "partner" ? PALETTE_PARTNER : PALETTE_MAIN;
    const tailPalette = variant === "partner" ? TAIL_PALETTE_PARTNER : TAIL_PALETTE_MAIN;
    drawGrid(tailCanvas, buildTailGrid(), tailPalette);

    const instance = {
      bodyCanvas,
      expression: "idle",
      locked: false,
      setExpression(expr) {
        this.expression = expr;
        drawGrid(this.bodyCanvas, gridFor(expr), palette);
      },
    };
    instance.setExpression("idle");
    dogRegistry.push(instance);
    return instance;
  }

  function buildTailGrid() {
    return TAIL_GRID.map((row) => row.split(""));
  }

  // Global gentle blink loop (skipped under reduced motion).
  if (!reduceMotion) {
    setInterval(() => {
      dogRegistry.forEach((dog) => {
        if (dog.locked || dog.expression !== "idle") return;
        dog.setExpression("blink");
        setTimeout(() => {
          if (!dog.locked) dog.setExpression("idle");
        }, 160);
      });
    }, 3600);
  }

  // Instantiate every dog sprite used across the five stages.
  // Stage 1 uses the separate, higher-detail hero sprite defined above;
  // every other stage keeps the original shared sprite untouched.
  const dog1 = createHeroDog("dogCanvas1", "tailCanvas1");
  createDog("dogCanvas2a", "tailCanvas2a", "partner");
  createDog("dogCanvas2b", "tailCanvas2b", "main");
  createDog("dogCanvas2c", "tailCanvas2c", "main");
  createDog("dogCanvas3", "tailCanvas3", "main");
  createDog("dogCanvas4", "tailCanvas4", "main");
  createDog("dogCanvas5a", "tailCanvas5a", "partner");
  createDog("dogCanvas5b", "tailCanvas5b", "main");

  /* =========================================================
     2. STAGE-1 DOG REACTIONS (CSS pose + sprite expression)
     ========================================================= */
  const dog1El = document.getElementById("dog1");
  let reactTimer = null;

  function dogReact(attempt) {
    if (!dog1El) return;
    dog1El.classList.remove("tilt", "surprised", "shake", "lookyes", "sideeye");
    clearTimeout(reactTimer);

    let pose = "tilt";
    let expr = "idle";
    if (attempt <= 1) {
      pose = "tilt";
      expr = "idle";
    } else if (attempt === 2) {
      pose = "surprised";
      expr = "surprised";
    } else if (attempt === 3) {
      pose = "shake";
      expr = "idle";
    } else if (attempt === 4) {
      pose = "lookyes";
      expr = "idle";
    } else {
      pose = "sideeye";
      expr = "sideeye";
    }

    dog1El.classList.add(pose);
    dog1.locked = true;
    dog1.setExpression(expr);
    reactTimer = setTimeout(() => {
      dog1El.classList.remove(pose);
      dog1.locked = false;
      dog1.setExpression("idle");
    }, 950);
  }

  function dogJumpFor(el, controller) {
    if (!el) return;
    el.classList.remove("tilt", "surprised", "shake", "lookyes", "sideeye");
    el.classList.add("jump");
    if (controller) {
      controller.locked = true;
      controller.setExpression("happy");
    }
    setTimeout(() => {
      el.classList.remove("jump");
      if (controller) {
        controller.locked = false;
        controller.setExpression("idle");
      }
    }, 700);
  }

  /* =========================================================
     3. HEART / SPARKLE BURST HELPER
     ========================================================= */
  function burstAt(container, x, y, count, glyph) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "heart-burst";
      span.textContent = glyph || "♥";
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 30 + Math.random() * 30;
      span.style.setProperty("--bx", `${Math.cos(angle) * dist}px`);
      span.style.setProperty("--by", `${Math.sin(angle) * dist - 20}px`);
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      container.appendChild(span);
      setTimeout(() => span.remove(), 950);
    }
  }

  /* =========================================================
     4. STAGE 1 — THE ASK / NO-BUTTON DODGE
     ========================================================= */
  const safeZone = document.getElementById("safeZone");
  const yesBtn1 = document.getElementById("yesBtn1");
  const noBtn1 = document.getElementById("noBtn1");
  const hintText = document.getElementById("hintText");
  const attemptMessageEl = document.getElementById("attemptMessage");
  const dogBubble = document.getElementById("dogBubble");

  const ATTEMPT_MESSAGES = [
    "Really?",
    "Ego again?",
    "Nice try, Diva Princess.",
    "We both know how this ends.",
    "Even the dog is judging you now.",
  ];
  const BUBBLE_MESSAGES = [
    "Hmm… what are you doing?",
    "That button is shy!",
    "It keeps running away!",
    "Okay this is just funny now.",
    "Just say yes already!",
    "I'm judging you too.",
  ];

  let attempts = 0;
  let dodging = false;
  const MIN_SCALE = 0.32;
  const MAX_SCALE = 2.15;

  function scaleFor(n) {
    return Math.max(MIN_SCALE, 1 - 0.15 * n);
  }
  function yesScaleFor(n) {
    return Math.min(MAX_SCALE, 1 + 0.15 * n);
  }

  function setMessage(el, text) {
    el.textContent = text;
    el.classList.remove("show");
    // restart CSS animation
    void el.offsetWidth;
    el.classList.add("show");
  }

  function placeNoButton() {
    const zoneRect = safeZone.getBoundingClientRect();
    const yesRect = yesBtn1.getBoundingClientRect();
    const noRect = noBtn1.getBoundingClientRect();

    const noW = noRect.width;
    const noH = noRect.height;
    const maxX = Math.max(0, zoneRect.width - noW);
    const maxY = Math.max(0, zoneRect.height - noH);

    const yesRel = {
      left: yesRect.left - zoneRect.left - 10,
      top: yesRect.top - zoneRect.top - 10,
      right: yesRect.right - zoneRect.left + 10,
      bottom: yesRect.bottom - zoneRect.top + 10,
    };

    let best = null;
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      const overlapsYes = x < yesRel.right && x + noW > yesRel.left && y < yesRel.bottom && y + noH > yesRel.top;
      if (!overlapsYes) {
        best = { x, y };
        break;
      }
      if (!best) best = { x, y };
    }

    noBtn1.style.left = `${best.x}px`;
    noBtn1.style.top = `${best.y}px`;
  }

  function dodgeNo() {
    if (dodging) return;
    dodging = true;

    attempts++;
    const msgIndex = Math.min(attempts, ATTEMPT_MESSAGES.length) - 1;
    setMessage(attemptMessageEl, ATTEMPT_MESSAGES[msgIndex]);

    if (dogBubble) {
      const bIdx = Math.min(attempts, BUBBLE_MESSAGES.length - 1);
      dogBubble.innerHTML = BUBBLE_MESSAGES[bIdx] + ' <span class="bubble-emoji">🐾</span>';
    }

    noBtn1.style.setProperty("--no-scale", scaleFor(attempts));
    yesBtn1.style.setProperty("--yes-scale", yesScaleFor(attempts));
    // switch to absolute px positioning (overrides the initial % placement)
    noBtn1.style.transform = `scale(${scaleFor(attempts)})`;
    noBtn1.style.transformOrigin = "center";
    requestAnimationFrame(placeNoButton);

    dogReact(attempts);

    if (hintText) {
      hintText.style.opacity = attempts >= 2 ? "0" : "1";
    }

    setTimeout(() => {
      dodging = false;
    }, 340);
  }

  function centerButtons() {
    if (!safeZone || !yesBtn1 || !noBtn1) return;
    const zoneW = safeZone.getBoundingClientRect().width;
    const yesW = yesBtn1.getBoundingClientRect().width;
    const noW = noBtn1.getBoundingClientRect().width;
    const gap = 14;
    const total = yesW + gap + noW;
    const startX = Math.max(0, (zoneW - total) / 2);
    yesBtn1.style.left = `${startX}px`;
    noBtn1.style.left = `${startX + yesW + gap}px`;
  }
  centerButtons();
  window.addEventListener("resize", () => {
    if (attempts === 0) centerButtons();
  });

  if (noBtn1 && safeZone) {
    noBtn1.addEventListener("click", (e) => {
      e.preventDefault();
      dodgeNo();
    });
    noBtn1.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dodgeNo();
    });
    safeZone.addEventListener("pointermove", (e) => {
      if (dodging) return;
      const rect = noBtn1.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const threshold = Math.max(38, 55 - attempts * 3);
      if (dist < threshold) dodgeNo();
    });
  }

  const yesBtn1El = document.getElementById("yesBtn1");
  if (yesBtn1El) {
    yesBtn1El.addEventListener("click", () => {
      const rect = yesBtn1El.getBoundingClientRect();
      const zoneRect = safeZone.getBoundingClientRect();
      burstAt(safeZone, rect.left - zoneRect.left + rect.width / 2, rect.top - zoneRect.top, 8, "♥");
      dogJumpFor(dog1El, dog1);
      setTimeout(() => goToStage(2), 550);
    });
  }

  /* =========================================================
     5. STAGE NAVIGATION
     ========================================================= */
  const stages = Array.from(document.querySelectorAll(".stage"));

  function goToStage(n) {
    stages.forEach((s) => {
      const isTarget = s.dataset.stage === String(n);
      if (isTarget) {
        s.hidden = false;
        s.style.animation = "none";
        void s.offsetWidth;
        s.style.animation = "";
      } else {
        s.hidden = true;
      }
    });
    document.getElementById("srAnnouncer").textContent = `Stage ${n} of 5`;
    if (n === 3) startCalendarRunIn();
    if (n === 5) enterConfirmation();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.getElementById("toStage3Btn").addEventListener("click", () => goToStage(3));
  document.getElementById("toStage4Btn").addEventListener("click", () => {
    if (!selectedDate) return;
    goToStage(4);
  });
  document.getElementById("toStage5Btn").addEventListener("click", () => {
    if (!selectedActivity) return;
    goToStage(5);
  });

  function startCalendarRunIn() {
    const dog3El = document.getElementById("dog3");
    if (dog3El && !reduceMotion) {
      dog3El.classList.add("run-in");
      setTimeout(() => dog3El.classList.remove("run-in"), 950);
    }
  }

  /* =========================================================
     6. STAGE 3 — CALENDAR
     ========================================================= */
  const calTitle = document.getElementById("calTitle");
  const calendarGrid = document.getElementById("calendarGrid");
  const calPrev = document.getElementById("calPrev");
  const calNext = document.getElementById("calNext");
  const toStage4Btn = document.getElementById("toStage4Btn");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function renderCalendar() {
    calTitle.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    calendarGrid.innerHTML = "";

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startWeekday + 1;
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cal-cell";

      let cellDate;
      if (dayNum < 1) {
        cellDate = new Date(viewYear, viewMonth - 1, daysInPrevMonth + dayNum);
        cell.classList.add("muted");
        cell.textContent = cellDate.getDate();
        cell.disabled = true;
      } else if (dayNum > daysInMonth) {
        cellDate = new Date(viewYear, viewMonth + 1, dayNum - daysInMonth);
        cell.classList.add("muted");
        cell.textContent = cellDate.getDate();
        cell.disabled = true;
      } else {
        cellDate = new Date(viewYear, viewMonth, dayNum);
        cell.textContent = dayNum;
        const isPast = cellDate < today;
        if (isPast) {
          cell.classList.add("disabled");
          cell.disabled = true;
        } else {
          cell.classList.add("selectable");
          cell.addEventListener("click", () => selectDate(cellDate, cell));
        }
        if (sameDay(cellDate, today)) cell.classList.add("today");
        if (selectedDate && sameDay(cellDate, selectedDate)) cell.classList.add("selected");
      }
      calendarGrid.appendChild(cell);
    }

    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    calPrev.disabled = isCurrentMonth;
  }

  function selectDate(date, cellEl) {
    selectedDate = date;
    renderCalendar();
    toStage4Btn.disabled = false;
    if (!reduceMotion) {
      const sparkle = document.createElement("span");
      sparkle.className = "cal-sparkle";
      sparkle.textContent = "✦";
      const target = calendarGrid.children[Array.from(calendarGrid.children).findIndex((c) => c.textContent == date.getDate() && c.classList.contains("selected"))];
      (target || cellEl).appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 700);
    }
  }

  calPrev.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    renderCalendar();
  });
  calNext.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    renderCalendar();
  });

  renderCalendar();

  /* =========================================================
     7. STAGE 4 — ACTIVITY SELECT
     ========================================================= */
  const activityGrid = document.getElementById("activityGrid");
  const toStage5Btn = document.getElementById("toStage5Btn");
  let selectedActivity = null;

  activityGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".activity-card");
    if (!card) return;
    Array.from(activityGrid.children).forEach((c) => c.classList.remove("selected"));
    card.classList.remove("selected");
    void card.offsetWidth;
    card.classList.add("selected");
    selectedActivity = card.dataset.activity;
    toStage5Btn.disabled = false;
  });

  /* =========================================================
     8. STAGE 5 — CONFIRMATION
     ========================================================= */
  const confettiLayer = document.getElementById("confettiLayer");
  const confirmDate = document.getElementById("confirmDate");
  const confirmActivity = document.getElementById("confirmActivity");
  const confirmFinal = document.getElementById("confirmFinal");
  const confirmNotice = document.getElementById("confirmNotice");
  const newMessageBtn = document.getElementById("newMessageBtn");
  let confirmationEntered = false;

  function formatDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function spawnConfetti() {
    if (reduceMotion) return;
    const glyphs = ["♥", "✦", "💗", "🎉"];
    for (let i = 0; i < 20; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDuration = `${2.2 + Math.random() * 1.6}s`;
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.fontSize = `${0.7 + Math.random() * 0.8}rem`;
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 4200);
    }
  }

  function enterConfirmation() {
    if (confirmationEntered) return;
    confirmationEntered = true;

    confirmDate.querySelector("span").textContent = selectedDate ? formatDate(selectedDate) : "";
    confirmActivity.querySelector("span").textContent = selectedActivity || "";

    spawnConfetti();

    [confirmDate, confirmActivity, confirmFinal, confirmNotice, newMessageBtn].forEach((el) =>
      el.classList.remove("reveal")
    );

    setTimeout(() => confirmDate.classList.add("reveal"), 250);
    setTimeout(() => confirmActivity.classList.add("reveal"), 850);
    setTimeout(() => {
      confirmFinal.classList.add("reveal");
      confirmNotice.classList.add("reveal");
    }, 1450);
    setTimeout(() => newMessageBtn.classList.add("reveal"), 2100);
  }

  /* =========================================================
     9. NOTE MODAL
     ========================================================= */
  const noteOverlay = document.getElementById("noteOverlay");
  const noteClose = document.getElementById("noteClose");

  newMessageBtn.addEventListener("click", () => {
    noteOverlay.hidden = false;
  });
  noteClose.addEventListener("click", () => {
    noteOverlay.hidden = true;
  });
  noteOverlay.addEventListener("click", (e) => {
    if (e.target === noteOverlay) noteOverlay.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !noteOverlay.hidden) noteOverlay.hidden = true;
  });

  /* =========================================================
     10. INIT
     ========================================================= */
  goToStage(1);
})();
