// GAME.JS — Cubic Trajectory: Sea Strike
// Renders a radar-style coordinate grid, simulates a missile flying along
// y = ax^3 + bx^2 + cx + d, and checks it against obstacles/target.

(function () {
  "use strict";

  // ---------- State ----------
  let currentLevelIndex = 0;
  let coeffs = { a: 0, b: 0, c: 0, d: 0 };
  let animating = false;
  let unlockedLevels = loadProgress();

  // ---------- DOM ----------
  const canvas = document.getElementById("scope");
  const ctx = canvas.getContext("2d");
  const levelNameEl = document.getElementById("level-name");
  const levelNumberEl = document.getElementById("level-number");
  const briefingEl = document.getElementById("briefing");
  const fireBtn = document.getElementById("fire-btn");
  const resetBtn = document.getElementById("reset-btn");
  const nextBtn = document.getElementById("next-btn");
  const statusEl = document.getElementById("status");
  const levelListEl = document.getElementById("level-list");
  const inputs = {
    a: document.getElementById("coef-a"),
    b: document.getElementById("coef-b"),
    c: document.getElementById("coef-c"),
    d: document.getElementById("coef-d"),
  };

  // World <-> screen mapping
  const WORLD_MIN = -6.5;
  const WORLD_MAX = 6.5;
  let scale, originX, originY;

  function resizeCanvas() {
    const size = Math.min(canvas.parentElement.clientWidth, 640);
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    scale = size / (WORLD_MAX - WORLD_MIN);
    originX = size / 2;
    originY = size / 2;
    draw();
  }

  function toScreenX(x) {
    return originX + x * scale;
  }
  function toScreenY(y) {
    return originY - y * scale;
  }

  // ---------- Level loading ----------
  function loadLevel(index) {
    currentLevelIndex = index;
    const level = LEVELS[index];
    coeffs = { a: 0, b: 0, c: 0, d: 0 };
    inputs.a.value = "";
    inputs.b.value = "";
    inputs.c.value = "";
    inputs.d.value = "";
    levelNameEl.textContent = level.name;
    levelNumberEl.textContent = "LEVEL " + level.id + " / " + LEVELS.length;
    briefingEl.textContent = level.briefing;
    statusEl.textContent = "";
    statusEl.className = "status";
    nextBtn.classList.add("hidden");
    fireBtn.disabled = false;
    animating = false;
    renderLevelList();
    draw();
  }

  function renderLevelList() {
    levelListEl.innerHTML = "";
    LEVELS.forEach((lvl, i) => {
      const btn = document.createElement("button");
      btn.className = "level-chip";
      btn.textContent = lvl.id;
      btn.title = lvl.name;
      if (i === currentLevelIndex) btn.classList.add("active");
      if (i > unlockedLevels) {
        btn.classList.add("locked");
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => {
          if (!animating) loadLevel(i);
        });
      }
      levelListEl.appendChild(btn);
    });
  }

  // ---------- Progress persistence ----------
  function loadProgress() {
    try {
      const saved = window.localStorage.getItem("cubic-strike-progress");
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  }
  function saveProgress(index) {
    try {
      window.localStorage.setItem("cubic-strike-progress", String(index));
    } catch (e) {
      /* ignore */
    }
  }

  // ---------- Drawing ----------
  function f(x) {
    return coeffs.a * x * x * x + coeffs.b * x * x + coeffs.c * x + coeffs.d;
  }

  function draw(missilePos, trail, exploded) {
    const size = canvas.width / window.devicePixelRatio;
    ctx.clearRect(0, 0, size, size);

    // background sweep vignette
    const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
    grad.addColorStop(0, "#07221c");
    grad.addColorStop(1, "#031310");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // grid
    ctx.strokeStyle = "rgba(74, 222, 128, 0.14)";
    ctx.lineWidth = 1;
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(74, 222, 128, 0.45)";
    for (let x = Math.ceil(WORLD_MIN); x <= WORLD_MAX; x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, size);
      ctx.stroke();
      if (x !== 0) ctx.fillText(x, sx + 3, toScreenY(0) + 12);
    }
    for (let y = Math.ceil(WORLD_MIN); y <= WORLD_MAX; y++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(size, sy);
      ctx.stroke();
      if (y !== 0) ctx.fillText(y, toScreenX(0) + 4, sy - 3);
    }

    // axes
    ctx.strokeStyle = "rgba(74, 222, 128, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toScreenX(WORLD_MIN), toScreenY(0));
    ctx.lineTo(toScreenX(WORLD_MAX), toScreenY(0));
    ctx.moveTo(toScreenX(0), toScreenY(WORLD_MIN));
    ctx.lineTo(toScreenX(0), toScreenY(WORLD_MAX));
    ctx.stroke();

    const level = LEVELS[currentLevelIndex];

    // obstacles
    level.obstacles.forEach((ob) => {
      drawObstacle(ob);
    });

    // target
    drawTarget(level.target);

    // planned curve preview (faint) once any coefficient is set
    if (hasAnyCoeff()) {
      ctx.strokeStyle = "rgba(250, 204, 21, 0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      let started = false;
      for (let px = WORLD_MIN; px <= WORLD_MAX; px += 0.05) {
        const py = f(px);
        if (py < WORLD_MIN - 3 || py > WORLD_MAX + 3) {
          started = false;
          continue;
        }
        const sx = toScreenX(px);
        const sy = toScreenY(py);
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // launch point marker
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.arc(toScreenX(level.domain[0]), toScreenY(f(level.domain[0])), 4, 0, Math.PI * 2);
    ctx.fill();

    // fired trail
    if (trail && trail.length > 1) {
      ctx.strokeStyle = exploded ? "rgba(255, 90, 60, 0.9)" : "rgba(96, 240, 255, 0.95)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = exploded ? "#ff5a3c" : "#60f0ff";
      ctx.beginPath();
      trail.forEach((p, i) => {
        const sx = toScreenX(p.x);
        const sy = toScreenY(p.y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // missile head
    if (missilePos) {
      const sx = toScreenX(missilePos.x);
      const sy = toScreenY(missilePos.y);
      if (exploded) {
        drawExplosion(sx, sy);
      } else {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.fillStyle = "#e6fff7";
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  function hasAnyCoeff() {
    return inputs.a.value !== "" || inputs.b.value !== "" || inputs.c.value !== "" || inputs.d.value !== "";
  }

  function drawObstacle(ob) {
    const sx = toScreenX(ob.x);
    const sy = toScreenY(ob.y);
    const r = ob.r * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    if (ob.type === "iceberg") {
      ctx.fillStyle = "rgba(180, 235, 250, 0.85)";
      ctx.strokeStyle = "#eafcff";
    } else {
      ctx.fillStyle = "rgba(101, 163, 89, 0.85)";
      ctx.strokeStyle = "#c8f5b0";
    }
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#dff5ff";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`(${ob.x}, ${ob.y})`, sx, sy + r + 13);
    ctx.textAlign = "left";
  }

  function drawTarget(t) {
    const sx = toScreenX(t.x);
    const sy = toScreenY(t.y);
    const r = t.r * scale;
    ctx.strokeStyle = "#ff5a3c";
    ctx.lineWidth = 2;
    [1, 0.6, 0.25].forEach((f) => {
      ctx.beginPath();
      ctx.arc(sx, sy, r * f + (f === 1 ? 0 : 0), 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(sx - r - 6, sy);
    ctx.lineTo(sx + r + 6, sy);
    ctx.moveTo(sx, sy - r - 6);
    ctx.lineTo(sx, sy + r + 6);
    ctx.stroke();

    ctx.fillStyle = "#ffb3a0";
    ctx.font = "bold 10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`TARGET (${t.x}, ${t.y})`, sx, sy - r - 10);
    ctx.textAlign = "left";
  }

  function drawExplosion(sx, sy) {
    const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, 22);
    grad.addColorStop(0, "#fff6d6");
    grad.addColorStop(0.4, "#ffb23c");
    grad.addColorStop(1, "rgba(255, 90, 60, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---------- Simulation ----------
  function readCoeffs() {
    return {
      a: parseFloat(inputs.a.value) || 0,
      b: parseFloat(inputs.b.value) || 0,
      c: parseFloat(inputs.c.value) || 0,
      d: parseFloat(inputs.d.value) || 0,
    };
  }

  function fire() {
    if (animating) return;
    coeffs = readCoeffs();
    const level = LEVELS[currentLevelIndex];
    const [xStart, xEnd] = level.domain;
    const step = 0.03;

    // Pre-compute full sampled path and find first collision / target hit
    const points = [];
    let hitIndex = -1;
    let collided = false;
    for (let x = xStart; x <= xEnd + 1e-9; x += step) {
      const y = f(x);
      points.push({ x, y });
      // target check first: reaching the target ends the run successfully
      const dTarget = Math.hypot(x - level.target.x, y - level.target.y);
      if (dTarget <= level.target.r) {
        hitIndex = points.length - 1;
        break;
      }
      // obstacle check
      for (const ob of level.obstacles) {
        const d = Math.hypot(x - ob.x, y - ob.y);
        if (d <= ob.r) {
          collided = true;
          hitIndex = points.length - 1;
          break;
        }
      }
      if (collided) break;
    }

    const success = hitIndex !== -1 && !collided;
    const finalIndex = hitIndex === -1 ? points.length - 1 : hitIndex;

    animating = true;
    fireBtn.disabled = true;
    statusEl.textContent = "";
    statusEl.className = "status";

    let frame = 0;
    const totalFrames = Math.max(30, Math.min(140, finalIndex));
    const framesPerPoint = finalIndex / totalFrames;

    function step_() {
      frame++;
      const idx = Math.min(finalIndex, Math.floor(frame * framesPerPoint));
      const trail = points.slice(0, idx + 1);
      const pos = points[idx];
      const isLastFrame = idx >= finalIndex;
      draw(pos, trail, isLastFrame && collided);

      if (!isLastFrame) {
        requestAnimationFrame(step_);
      } else {
        finishRun(success, collided, points, level);
      }
    }
    requestAnimationFrame(step_);
  }

  function finishRun(success, collided, points, level) {
    animating = false;
    fireBtn.disabled = false;
    if (success) {
      statusEl.textContent = "TARGET DESTROYED";
      statusEl.className = "status status-success";
      if (currentLevelIndex + 1 > unlockedLevels) {
        unlockedLevels = currentLevelIndex + 1;
        saveProgress(unlockedLevels);
      }
      if (currentLevelIndex < LEVELS.length - 1) {
        nextBtn.classList.remove("hidden");
      } else {
        statusEl.textContent = "TARGET DESTROYED — ALL SECTORS CLEARED";
      }
      renderLevelList();
    } else if (collided) {
      statusEl.textContent = "IMPACT — MISSILE LOST";
      statusEl.className = "status status-fail";
    } else {
      statusEl.textContent = "MISSILE PASSED THROUGH — TARGET NOT HIT";
      statusEl.className = "status status-fail";
    }
  }

  // ---------- Events ----------
  fireBtn.addEventListener("click", fire);
  resetBtn.addEventListener("click", () => loadLevel(currentLevelIndex));
  nextBtn.addEventListener("click", () => {
    if (currentLevelIndex < LEVELS.length - 1) loadLevel(currentLevelIndex + 1);
  });
  Object.values(inputs).forEach((inp) => {
    inp.addEventListener("input", () => {
      if (!animating) {
        coeffs = readCoeffs();
        draw();
      }
    });
  });
  window.addEventListener("resize", resizeCanvas);

  // ---------- Init ----------
  resizeCanvas();
  loadLevel(0);
})();
