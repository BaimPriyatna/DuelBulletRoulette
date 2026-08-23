/**
 * Duel Bullet Roulette — Game Logic
 * ----------------------------------
 * Refactor notes:
 * Sebelumnya banyak potongan kode "document.getElementById(x).style.display = ..."
 * tersebar di banyak fungsi. Setiap kali ada aksi baru (mulai game, reset,
 * konfirmasi tembak, dst) developer harus INGAT untuk menyetel display setiap
 * elemen secara manual. Sekali lupa satu tempat, atau ada `setTimeout` dari
 * ronde sebelumnya yang belum sempat jalan saat pemain klik "Reset", maka
 * timer basi itu akan menembak balik state game yang baru — itulah sumber
 * bug "tombol aksi tidak muncul lagi di game kedua / setelah reset".
 *
 * Sekarang semua tampilan diturunkan dari satu objek `state`, dan HANYA
 * fungsi `render()` yang boleh menyentuh `style.display`. Setiap transisi
 * (mulai game, tembak, konfirmasi, reset) mengubah `state` lalu memanggil
 * `render()`. Timer animasi juga disimpan referensinya di `state.timerId`
 * dan selalu dibatalkan (`clearTimeout`) sebelum membuat timer baru atau
 * saat reset, supaya tidak ada lagi "hantu" setTimeout dari ronde
 * sebelumnya yang menyelinap ke ronde berikutnya.
 */

(function () {
  "use strict";

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
    CONFIG: "config",       // layar setup jumlah peluru
    PLAYING: "playing",     // giliran pemain, tombol aksi tampil
    CONFIRMING: "confirming", // dialog "Are you sure?" tampil
    RESOLVING: "resolving", // animasi hasil tembakan sedang berjalan (tombol disembunyikan)
    GAME_OVER: "game_over", // ada pemenang / seri, tombol reset tampil
  };

  // ---------------------------------------------------------------------
  // Referensi elemen DOM (di-cache sekali di awal)
  // ---------------------------------------------------------------------
  const el = {
    minusSafe: document.getElementById("minusSafe"),
    plusSafe: document.getElementById("plusSafe"),
    minusDanger: document.getElementById("minusDanger"),
    plusDanger: document.getElementById("plusDanger"),
    safeBulletCount: document.getElementById("safeBulletCount"),
    dangerBulletCount: document.getElementById("dangerBulletCount"),
    bulletIcons: document.getElementById("bulletIcons"),
    startGame: document.getElementById("startGame"),
    reset: document.getElementById("reset"),

    config: document.getElementById("config"),
    mainGame: document.getElementById("mainGame"),
    actions: document.getElementById("actions"),
    confirm: document.getElementById("confirm"),
    result: document.getElementById("result"),

    turnInfo: document.getElementById("turnInfo"),
    player1: document.getElementById("player1"),
    player2: document.getElementById("player2"),
    player1Area: document.getElementById("player1Area"),
    player2Area: document.getElementById("player2Area"),
    player1Lives: document.getElementById("player1Lives"),
    player2Lives: document.getElementById("player2Lives"),

    shootSelf: document.getElementById("shootSelf"),
    shootEnemy: document.getElementById("shootEnemy"),
    yes: document.getElementById("yes"),
    no: document.getElementById("no"),

    game: document.getElementById("game"),
    flash: document.getElementById("flash"),
    duelEmblem: document.getElementById("duelEmblem"),
  };

  // ---------------------------------------------------------------------
  // State — satu-satunya sumber kebenaran untuk seluruh tampilan
  // ---------------------------------------------------------------------
  function createInitialState() {
    return {
      phase: PHASE.CONFIG,
      safeBullets: 4,
      dangerBullets: 6,
      bullets: [],
      currentPlayer: 1,
      lives: { 1: STARTING_LIVES, 2: STARTING_LIVES },
      pendingTarget: null, // "self" | "enemy" saat dialog konfirmasi tampil
      resultText: "",
      timerId: null, // referensi setTimeout animasi yang sedang berjalan
      prevLives: { 1: STARTING_LIVES, 2: STARTING_LIVES }, // buat trigger animasi heart-shatter
    };
  }

  let state = createInitialState();

  // ---------------------------------------------------------------------
  // Util
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

  /** Batalkan timer animasi yang mungkin masih menggantung dari aksi sebelumnya. */
  function clearPendingTimer() {
    if (state.timerId !== null) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
  }

  /** Jadwalkan lanjutan alur setelah animasi, sambil melacak timer-nya di state. */
  function after(ms, callback) {
    clearPendingTimer();
    state.timerId = setTimeout(() => {
      state.timerId = null;
      callback();
    }, ms);
  }

  // ---------------------------------------------------------------------
  // Render — satu-satunya tempat yang mengubah tampilan (display, teks, gambar)
  // ---------------------------------------------------------------------
  function render() {
    // --- Layar konfigurasi vs layar permainan ---
    const inConfig = state.phase === PHASE.CONFIG;
    el.config.style.display = inConfig ? "block" : "none";
    el.mainGame.style.display = inConfig ? "none" : "block";

    // --- Kontrol jumlah peluru ---
    el.safeBulletCount.innerText = state.safeBullets;
    el.dangerBulletCount.innerText = state.dangerBullets;
    el.bulletIcons.innerHTML = "";
    for (let i = 0; i < state.safeBullets; i++) {
      const img = document.createElement("img");
      img.src = "assets/safe_bullet.png";
      img.alt = "Safe bullet";
      el.bulletIcons.appendChild(img);
    }
    for (let i = 0; i < state.dangerBullets; i++) {
      const img = document.createElement("img");
      img.src = "assets/danger_bullet.png";
      img.alt = "Danger bullet";
      el.bulletIcons.appendChild(img);
    }

    // --- Info giliran & nyawa ---
    el.turnInfo.innerText = `Player ${state.currentPlayer}'s Turn`;
    renderLives(el.player1Lives, state.lives[1], state.prevLives[1]);
    renderLives(el.player2Lives, state.lives[2], state.prevLives[2]);
    state.prevLives = { 1: state.lives[1], 2: state.lives[2] };

    // --- HUD: sorot panel pemain yang sedang giliran ---
    const activePlaying = state.phase === PHASE.PLAYING || state.phase === PHASE.CONFIRMING;
    el.player1Area.classList.toggle("active", activePlaying && state.currentPlayer === 1);
    el.player2Area.classList.toggle("active", activePlaying && state.currentPlayer === 2);

    // --- Tombol aksi / dialog konfirmasi / tombol reset ---
    // Karena semuanya diturunkan dari `state.phase`, tidak mungkin ada
    // kondisi di mana kita "lupa" menampilkan tombol aksi di ronde baru.
    el.actions.style.display = state.phase === PHASE.PLAYING ? "block" : "none";
    el.confirm.style.display = state.phase === PHASE.CONFIRMING ? "block" : "none";
    el.reset.style.display = state.phase === PHASE.GAME_OVER ? "block" : "none";

    // --- Teks hasil ---
    el.result.innerText = state.resultText;
    el.result.style.display = state.resultText ? "block" : "none";
  }

  function renderLives(container, livesLeft, prevLivesLeft) {
    container.innerHTML = "";
    for (let i = 0; i < STARTING_LIVES; i++) {
      const heart = document.createElement("img");
      heart.classList.add("life");
      heart.src = i < livesLeft ? "assets/heart.png" : "assets/heart_break.png";
      // Kalau nyawa ini baru saja hilang di render ini, kasih animasi shatter.
      if (prevLivesLeft !== undefined && i < prevLivesLeft && i >= livesLeft) {
        heart.classList.add("lost");
      }
      container.appendChild(heart);
    }
  }

  /** Pastikan gambar seorang pemain kembali ke pose idle & terlihat. */
  function resetPlayerSprite(player) {
    const img = el[`player${player}`];
    img.src = `assets/player${player}_idle.png`;
    img.style.visibility = "visible";
    img.classList.remove("ghosted", "firing");
  }

  function setPlayerSprite(player, pose) {
    el[`player${player}`].src = `assets/player${player}_${pose}.png`;
  }

  // ---------------------------------------------------------------------
  // Kontrol jumlah peluru (layar konfigurasi)
  // ---------------------------------------------------------------------
  el.minusSafe.addEventListener("click", () => {
    if (state.safeBullets > BULLET_LIMITS.minSafe) {
      state.safeBullets--;
      render();
    }
  });

  el.plusSafe.addEventListener("click", () => {
    const wouldExceedTotal = state.safeBullets + state.dangerBullets >= BULLET_LIMITS.maxTotal;
    if (state.safeBullets < BULLET_LIMITS.maxSafe && !wouldExceedTotal) {
      state.safeBullets++;
      render();
    }
  });

  el.minusDanger.addEventListener("click", () => {
    if (state.dangerBullets > BULLET_LIMITS.minDanger) {
      state.dangerBullets--;
      render();
    }
  });

  el.plusDanger.addEventListener("click", () => {
    const wouldExceedTotal = state.safeBullets + state.dangerBullets >= BULLET_LIMITS.maxTotal;
    if (state.dangerBullets < BULLET_LIMITS.maxDanger && !wouldExceedTotal) {
      state.dangerBullets++;
      render();
    }
  });

  // ---------------------------------------------------------------------
  // Mulai / reset game
  // ---------------------------------------------------------------------
  el.startGame.addEventListener("click", startGame);
  el.reset.addEventListener("click", resetGame);

  function startGame() {
    state.bullets = buildBulletPool(state.safeBullets, state.dangerBullets);
    state.currentPlayer = Math.random() > 0.5 ? 1 : 2;
    state.lives = { 1: STARTING_LIVES, 2: STARTING_LIVES };
    state.prevLives = { 1: STARTING_LIVES, 2: STARTING_LIVES };
    state.pendingTarget = null;
    state.resultText = "";
    state.phase = PHASE.PLAYING;

    el.player1.classList.remove("ghosted");
    el.player2.classList.remove("ghosted");
    resetPlayerSprite(1);
    resetPlayerSprite(2);
    render();
  }

  function resetGame() {
    // Kunci dari perbaikan bug: batalkan dulu animasi ronde sebelumnya yang
    // mungkin masih menggantung, supaya tidak "menembak balik" ke game baru.
    clearPendingTimer();
    state = createInitialState();
    resetPlayerSprite(1);
    resetPlayerSprite(2);
    render();
  }

  // ---------------------------------------------------------------------
  // Alur menembak
  // ---------------------------------------------------------------------
  el.shootSelf.addEventListener("click", () => confirmAction("self"));
  el.shootEnemy.addEventListener("click", () => confirmAction("enemy"));
  el.yes.addEventListener("click", () => executeShot(state.pendingTarget));
  el.no.addEventListener("click", cancelShot);

  function confirmAction(target) {
    if (state.phase !== PHASE.PLAYING) return; // jaga-jaga dari klik ganda
    state.pendingTarget = target;
    state.phase = PHASE.CONFIRMING;
    setPlayerSprite(state.currentPlayer, target === "self" ? "shoot_self" : "shoot_enemy");
    render();
  }

  /** Trigger animasi recoil singkat pada sprite penembak. */
  function playRecoil(player) {
    const img = el[`player${player}`];
    img.classList.remove("firing");
    // force reflow supaya animasi bisa di-restart kalau ditrigger berturut-turut
    void img.offsetWidth;
    img.classList.add("firing");
  }

  /** Trigger screen-shake + flash merah singkat saat kena peluru tajam. */
  function playImpact() {
    el.game.classList.remove("impact");
    void el.game.offsetWidth;
    el.game.classList.add("impact");
    el.flash.classList.remove("hit");
    void el.flash.offsetWidth;
    el.flash.classList.add("hit");
    setTimeout(() => el.game.classList.remove("impact"), 400);
  }

  /** Kedip singkat pada emblem tengah tiap kali satu peluru ditembakkan — murni visual, tidak menunjukkan sisa peluru. */
  function pulseEmblem() {
    el.duelEmblem.classList.remove("pulse");
    void el.duelEmblem.offsetWidth;
    el.duelEmblem.classList.add("pulse");
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
    playRecoil(shooter);
    pulseEmblem();

    if (bullet === "danger") {
      state.lives[victim]--;
      playImpact();

      if (state.lives[victim] <= 0) {
        if (shooter !== victim) {
          resetPlayerSprite(shooter);
        }
        setPlayerSprite(victim, "ghost");
        // Dukung file animasi .gif untuk pose "ghost"
        el[`player${victim}`].src = `assets/player${victim}_ghost.gif`;
        el[`player${victim}`].classList.add("ghosted");
        state.resultText = describeFatalShot(shooter, victim, target);
        render();
        endGame();
        return;
      }

      // Selamat dari peluru tajam: sembunyikan sesaat sebagai efek visual,
      // lalu lanjut ke pemain berikutnya.
      el[`player${victim}`].style.visibility = "hidden";
      state.resultText = describeSurvivedShot(shooter, victim, target);
      render();
      after(1000, () => {
        resetPlayerSprite(victim);
        resetPlayerSprite(shooter);
        advanceTurn();
      });
      return;
    }

    // Peluru aman
    if (target === "self") {
      state.resultText = `Player ${shooter} shot themselves with a safe bullet and gets another turn!`;
      render();
      after(1000, () => {
        resetPlayerSprite(shooter);
        state.phase = PHASE.PLAYING;
        state.resultText = "";
        render();
      });
    } else {
      state.resultText = `Player ${shooter} shot Player ${victim} with a safe bullet!`;
      render();
      after(1000, () => {
        resetPlayerSprite(shooter);
        resetPlayerSprite(victim);
        advanceTurn();
      });
    }
  }

  function describeFatalShot(shooter, victim, target) {
    if (target === "self") {
      return `Player ${shooter} shot themselves with a dangerous bullet and died! Player ${otherPlayer(shooter)} wins!`;
    }
    return `Player ${shooter} shot Player ${victim} with a dangerous bullet and Player ${victim} died!`;
  }

  function describeSurvivedShot(shooter, victim, target) {
    if (target === "self") {
      return `Player ${shooter} shot themselves with a dangerous bullet but survived!`;
    }
    return `Player ${shooter} shot Player ${victim} with a dangerous bullet but they survived!`;
  }

  /** Pindah giliran, atau nyatakan seri kalau peluru sudah habis. */
  function advanceTurn() {
    if (state.bullets.length === 0) {
      state.resultText = "It's a tie! No bullets left!";
      endGame();
      return;
    }
    state.currentPlayer = otherPlayer(state.currentPlayer);
    state.pendingTarget = null;
    state.resultText = "";
    state.phase = PHASE.PLAYING;
    resetPlayerSprite(1);
    resetPlayerSprite(2);
    render();
  }

  function endGame() {
    state.pendingTarget = null;
    state.phase = PHASE.GAME_OVER;
    render();
  }

  // ---------------------------------------------------------------------
  // Render pertama kali saat halaman dimuat
  // ---------------------------------------------------------------------
  render();
})();