/**
 * Duel Bullet Roulette — Game Logic & UI Manager
 * ----------------------------------------------
 * Bug Fix:
 * Sebelumnya ketika Player 2 menembak lawan (Player 1), setelah animasi selesai
 * hanya `resetPlayerSprite(victim)` yang dipanggil. Akibatnya, `shooter` (Player 2)
 * tidak pernah dikembalikan ke pose idle (`player2_idle.png`) dan tetap tertahan
 * di pose menembak (`player2_shoot_enemy.png`).
 *
 * Sekarang `resetPlayerSprite(shooter)` dan `resetPlayerSprite(victim)` selalu dipanggil
 * secara eksplisit setelah setiap resolusi tembakan dan transisi giliran.
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Audio Synthesizer (Web Audio API - Direct browser sound generation)
  // ---------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      if (type === "click") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "cock") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "blank") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "bang") {
        const bufferSize = audioCtx.sampleRate * 0.4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.linearRampToValueAtTime(100, now + 0.4);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noise.start(now);
        noise.stop(now + 0.4);
      } else if (type === "win") {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.25);
        });
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // ---------------------------------------------------------------------
  // Konstanta
  // ---------------------------------------------------------------------
  const BULLET_LIMITS = {
    maxTotal: 10,
    minSafe: 1,
    maxSafe: 7,
    minDanger: 3,
    maxDanger: 9,
  };

  const STARTING_LIVES = 3;

  const PHASE = {
    CONFIG: "config",
    PLAYING: "playing",
    CONFIRMING: "confirming",
    RESOLVING: "resolving",
    GAME_OVER: "game_over",
  };

  // ---------------------------------------------------------------------
  // Cache Referensi Elemen DOM
  // ---------------------------------------------------------------------
  const el = {
    minusSafe: document.getElementById("minusSafe"),
    plusSafe: document.getElementById("plusSafe"),
    minusDanger: document.getElementById("minusDanger"),
    plusDanger: document.getElementById("plusDanger"),
    safeBulletCount: document.getElementById("safeBulletCount"),
    dangerBulletCount: document.getElementById("dangerBulletCount"),
    bulletIcons: document.getElementById("bulletIcons"),
    bulletRatioFill: document.getElementById("bulletRatioFill"),
    remainingChamberInfo: document.getElementById("remainingChamberInfo"),
    soundToggle: document.getElementById("soundToggle"),

    startGame: document.getElementById("startGame"),
    reset: document.getElementById("reset"),

    config: document.getElementById("config"),
    mainGame: document.getElementById("mainGame"),
    actions: document.getElementById("actions"),
    confirm: document.getElementById("confirm"),
    result: document.getElementById("result"),

    turnInfo: document.getElementById("turnInfo"),
    player1Area: document.getElementById("player1Area"),
    player2Area: document.getElementById("player2Area"),
    player1: document.getElementById("player1"),
    player2: document.getElementById("player2"),
    player1Lives: document.getElementById("player1Lives"),
    player2Lives: document.getElementById("player2Lives"),

    shootSelf: document.getElementById("shootSelf"),
    shootEnemy: document.getElementById("shootEnemy"),
    yes: document.getElementById("yes"),
    no: document.getElementById("no"),
  };

  // ---------------------------------------------------------------------
  // State Manager
  // ---------------------------------------------------------------------
  function createInitialState() {
    return {
      phase: PHASE.CONFIG,
      safeBullets: 4,
      dangerBullets: 6,
      bullets: [],
      initialTotalBullets: 10,
      currentPlayer: 1,
      lives: { 1: STARTING_LIVES, 2: STARTING_LIVES },
      pendingTarget: null,
      resultText: "",
      timerId: null,
    };
  }

  let state = createInitialState();

  // ---------------------------------------------------------------------
  // Helper Functions
  // ---------------------------------------------------------------------
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function buildBulletPool(safeCount, dangerCount) {
    const pool = [];
    for (let i = 0; i < safeCount; i++) pool.push("safe");
    for (let i = 0; i < dangerCount; i++) pool.push("danger");
    return shuffle(pool);
  }

  function otherPlayer(player) {
    return player === 1 ? 2 : 1;
  }

  function clearPendingTimer() {
    if (state.timerId !== null) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
  }

  function after(ms, callback) {
    clearPendingTimer();
    state.timerId = setTimeout(() => {
      state.timerId = null;
      callback();
    }, ms);
  }

  // ---------------------------------------------------------------------
  // Render System
  // ---------------------------------------------------------------------
  function render() {
    const inConfig = state.phase === PHASE.CONFIG;
    el.config.style.display = inConfig ? "block" : "none";
    el.mainGame.style.display = inConfig ? "none" : "block";

    // Setup Bullets
    el.safeBulletCount.innerText = state.safeBullets;
    el.dangerBulletCount.innerText = state.dangerBullets;

    const totalSelected = state.safeBullets + state.dangerBullets;
    const safePercent = (state.safeBullets / totalSelected) * 100;
    if (el.bulletRatioFill) {
      el.bulletRatioFill.style.width = `${safePercent}%`;
    }

    if (el.bulletIcons) {
      el.bulletIcons.innerHTML = "";
      for (let i = 0; i < state.safeBullets; i++) {
        const img = document.createElement("img");
        img.src = "assets/safe_bullet.png";
        img.alt = "Safe bullet";
        img.title = "Safe Bullet";
        el.bulletIcons.appendChild(img);
      }
      for (let i = 0; i < state.dangerBullets; i++) {
        const img = document.createElement("img");
        img.src = "assets/danger_bullet.png";
        img.alt = "Danger bullet";
        img.title = "Danger Bullet";
        el.bulletIcons.appendChild(img);
      }
    }

    // Turn Info & Active Card Glow
    el.turnInfo.innerText = `Player ${state.currentPlayer}'s Turn`;
    if (el.player1Area && el.player2Area) {
      if (state.currentPlayer === 1) {
        el.player1Area.classList.add("active-turn");
        el.player2Area.classList.remove("active-turn");
      } else {
        el.player2Area.classList.add("active-turn");
        el.player1Area.classList.remove("active-turn");
      }
    }

    // Chamber Remaining Status
    if (el.remainingChamberInfo) {
      el.remainingChamberInfo.innerText = `Chamber: ${state.bullets.length} / ${state.initialTotalBullets} Bullets Remaining`;
    }

    // Render Player Lives
    renderLives(el.player1Lives, state.lives[1]);
    renderLives(el.player2Lives, state.lives[2]);

    // Button visibility per phase
    el.actions.style.display = state.phase === PHASE.PLAYING ? "flex" : "none";
    el.confirm.style.display = state.phase === PHASE.CONFIRMING ? "flex" : "none";
    el.reset.style.display = state.phase === PHASE.GAME_OVER ? "block" : "none";

    // Result feed text
    el.result.innerText = state.resultText;
    el.result.style.display = state.resultText ? "block" : "none";
  }

  function renderLives(container, livesLeft) {
    container.innerHTML = "";
    for (let i = 0; i < STARTING_LIVES; i++) {
      const heart = document.createElement("img");
      heart.classList.add("life");
      if (i < livesLeft) {
        heart.src = "assets/heart.png";
        heart.alt = "Heart";
      } else {
        heart.src = "assets/heart_break.png";
        heart.alt = "Broken Heart";
        heart.classList.add("broken");
      }
      container.appendChild(heart);
    }
  }

  /** Mengembalikan sprite pemain ke pose idle dan visibilitas normal */
  function resetPlayerSprite(player) {
    const img = el[`player${player}`];
    img.src = `assets/player${player}_idle.png`;
    img.style.visibility = "visible";
  }

  function setPlayerSprite(player, pose) {
    el[`player${player}`].src = `assets/player${player}_${pose}.png`;
  }

  // ---------------------------------------------------------------------
  // Event Listeners (Setup & Sound)
  // ---------------------------------------------------------------------
  el.minusSafe.addEventListener("click", () => {
    playSound("click");
    if (state.safeBullets > BULLET_LIMITS.minSafe) {
      state.safeBullets--;
      render();
    }
  });

  el.plusSafe.addEventListener("click", () => {
    playSound("click");
    const wouldExceedTotal = state.safeBullets + state.dangerBullets >= BULLET_LIMITS.maxTotal;
    if (state.safeBullets < BULLET_LIMITS.maxSafe && !wouldExceedTotal) {
      state.safeBullets++;
      render();
    }
  });

  el.minusDanger.addEventListener("click", () => {
    playSound("click");
    if (state.dangerBullets > BULLET_LIMITS.minDanger) {
      state.dangerBullets--;
      render();
    }
  });

  el.plusDanger.addEventListener("click", () => {
    playSound("click");
    const wouldExceedTotal = state.safeBullets + state.dangerBullets >= BULLET_LIMITS.maxTotal;
    if (state.dangerBullets < BULLET_LIMITS.maxDanger && !wouldExceedTotal) {
      state.dangerBullets++;
      render();
    }
  });

  if (el.soundToggle) {
    el.soundToggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      el.soundToggle.innerText = soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
      if (soundEnabled) playSound("click");
    });
  }

  // ---------------------------------------------------------------------
  // Game Initialization & Reset
  // ---------------------------------------------------------------------
  el.startGame.addEventListener("click", () => {
    playSound("cock");
    startGame();
  });

  el.reset.addEventListener("click", () => {
    playSound("click");
    resetGame();
  });

  function startGame() {
    state.bullets = buildBulletPool(state.safeBullets, state.dangerBullets);
    state.initialTotalBullets = state.bullets.length;
    state.currentPlayer = Math.random() > 0.5 ? 1 : 2;
    state.lives = { 1: STARTING_LIVES, 2: STARTING_LIVES };
    state.pendingTarget = null;
    state.resultText = "";
    state.phase = PHASE.PLAYING;

    resetPlayerSprite(1);
    resetPlayerSprite(2);
    render();
  }

  function resetGame() {
    clearPendingTimer();
    state = createInitialState();
    resetPlayerSprite(1);
    resetPlayerSprite(2);
    render();
  }

  // ---------------------------------------------------------------------
  // Shooting Logic & Animations (Fixed Bug Here)
  // ---------------------------------------------------------------------
  el.shootSelf.addEventListener("click", () => {
    playSound("cock");
    confirmAction("self");
  });

  el.shootEnemy.addEventListener("click", () => {
    playSound("cock");
    confirmAction("enemy");
  });

  el.yes.addEventListener("click", () => executeShot(state.pendingTarget));
  el.no.addEventListener("click", () => {
    playSound("click");
    cancelShot();
  });

  function confirmAction(target) {
    if (state.phase !== PHASE.PLAYING) return;
    state.pendingTarget = target;
    state.phase = PHASE.CONFIRMING;
    setPlayerSprite(state.currentPlayer, target === "self" ? "shoot_self" : "shoot_enemy");
    render();
  }

  function cancelShot() {
    state.pendingTarget = null;
    state.phase = PHASE.PLAYING;
    resetPlayerSprite(state.currentPlayer);
    render();
  }

  function executeShot(target) {
    if (state.phase !== PHASE.CONFIRMING) return;

    const bullet = state.bullets.pop();
    const shooter = state.currentPlayer;
    const victim = target === "self" ? shooter : otherPlayer(shooter);

    state.phase = PHASE.RESOLVING;

    if (bullet === "danger") {
      playSound("bang");
      state.lives[victim]--;

      if (state.lives[victim] <= 0) {
<<<<<<< HEAD
        // PERBAIKAN BUG: kembalikan shooter ke pose idle jika shooter bukan korban
=======
>>>>>>> 92fd528 (downgrade design, fix bug)
        if (shooter !== victim) {
          resetPlayerSprite(shooter);
        }
        setPlayerSprite(victim, "ghost");
        el[`player${victim}`].src = `assets/player${victim}_ghost.gif`;
        state.resultText = describeFatalShot(shooter, victim, target);
        render();
        playSound("win");
        endGame();
        return;
      }

      // Selamat dari peluru tajam: sembunyikan korban sesaat
      el[`player${victim}`].style.visibility = "hidden";
      state.resultText = describeSurvivedShot(shooter, victim, target);
      render();
      after(1000, () => {
        // PERBAIKAN BUG: Kembalikan KEDUA pemain (shooter & victim) ke pose idle!
        resetPlayerSprite(victim);
        resetPlayerSprite(shooter);
        advanceTurn();
      });
      return;
    }

    // Peluru aman (blank / safe bullet)
    playSound("blank");
    if (target === "self") {
      state.resultText = `Player ${shooter} shot themselves with a SAFE bullet and earns another turn!`;
      render();
      after(1000, () => {
        resetPlayerSprite(shooter);
        state.phase = PHASE.PLAYING;
        state.resultText = "";
        render();
      });
    } else {
      state.resultText = `Player ${shooter} shot Player ${victim} with a SAFE bullet!`;
      render();
      after(1000, () => {
        // PERBAIKAN BUG: Kembalikan KEDUA pemain (shooter & victim) ke pose idle!
        resetPlayerSprite(shooter);
        resetPlayerSprite(victim);
        advanceTurn();
      });
    }
  }

  function describeFatalShot(shooter, victim, target) {
    if (target === "self") {
      return `💥 BOOM! Player ${shooter} shot themselves with a dangerous bullet and died! Player ${otherPlayer(shooter)} WINS! 🏆`;
    }
    return `💥 BOOM! Player ${shooter} shot Player ${victim} with a dangerous bullet! Player ${victim} died! Player ${shooter} WINS! 🏆`;
  }

  function describeSurvivedShot(shooter, victim, target) {
    if (target === "self") {
      return `⚡ Player ${shooter} shot themselves with a dangerous bullet but SURVIVED!`;
    }
    return `⚡ Player ${shooter} shot Player ${victim} with a dangerous bullet but they SURVIVED!`;
  }

  function advanceTurn() {
    if (state.bullets.length === 0) {
      state.resultText = "🤝 It's a TIE! All bullets in the chamber have been exhausted!";
      playSound("win");
      endGame();
      return;
    }
    state.currentPlayer = otherPlayer(state.currentPlayer);
    state.pendingTarget = null;
    state.resultText = "";
    state.phase = PHASE.PLAYING;
<<<<<<< HEAD

    // Pastikan sprite pemain yang masih hidup kembali ke idle pose
    if (state.lives[1] > 0) resetPlayerSprite(1);
    if (state.lives[2] > 0) resetPlayerSprite(2);

=======
    if (state.lives[1] > 0) resetPlayerSprite(1);
    if (state.lives[2] > 0) resetPlayerSprite(2);
>>>>>>> 92fd528 (downgrade design, fix bug)
    render();
  }

  function endGame() {
    state.pendingTarget = null;
    state.phase = PHASE.GAME_OVER;
    render();
  }

  // Initial Render
  render();
})();

