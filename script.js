    let playerLives = {1: 3, 2: 3};
    let currentPlayer = 1;
    let gameOver = false;
    let pendingAction = null; 
    let totalBullets = [];

    let safeBullets = 4;
    let dangerBullets = 6;
    const maxTotalBullets = 10;
    const minSafeBullets = 1;
    const maxSafeBullets = 7;
    const minDangerBullets = 3;
    const maxDangerBullets = 9;

    document.getElementById("minusSafe").addEventListener("click", function() {
        if (safeBullets > minSafeBullets) {
            safeBullets--;
            updateBulletDisplay();
        }
    });

    document.getElementById("plusSafe").addEventListener("click", function() {
        if (safeBullets < maxSafeBullets && safeBullets + dangerBullets < maxTotalBullets) {
            safeBullets++;
            updateBulletDisplay();
        }
    });

    document.getElementById("minusDanger").addEventListener("click", function() {
        if (dangerBullets > minDangerBullets) {
            dangerBullets--;
            updateBulletDisplay();
        }
    });

    document.getElementById("plusDanger").addEventListener("click", function() {
        if (dangerBullets < maxDangerBullets && safeBullets + dangerBullets < maxTotalBullets) {
            dangerBullets++;
            updateBulletDisplay();
        }
    });

    function updateBulletDisplay() {
        document.getElementById("safeBulletCount").innerText = safeBullets;
        document.getElementById("dangerBulletCount").innerText = dangerBullets;

        const bulletIcons = document.getElementById("bulletIcons");
        bulletIcons.innerHTML = ''; 

        for (let i = 0; i < safeBullets; i++) {
            const img = document.createElement("img");
            img.src = "safe_bullet.png";
            bulletIcons.appendChild(img);
        }

        for (let i = 0; i < dangerBullets; i++) {
            const img = document.createElement("img");
            img.src = "danger_bullet.png";
            bulletIcons.appendChild(img);
        }
    }

    updateBulletDisplay();

    document.getElementById("startGame").addEventListener("click", startGame);
    document.getElementById("reset").addEventListener("click", resetGame);

    function startGame() {
    safeBullets = parseInt(document.getElementById("safeBulletCount").innerText);
    dangerBullets = parseInt(document.getElementById("dangerBulletCount").innerText);

    totalBullets = createBullets(safeBullets, dangerBullets);

    totalBullets = shuffle(totalBullets);
    currentPlayer = Math.random() > 0.5 ? 1 : 2;

    document.getElementById("config").style.display = "none";
    document.getElementById("mainGame").style.display = "block";
    document.getElementById("actions").style.display = "block"; // Tampilkan tombol aksi
    updateTurnInfo();
    updateLives();
}


    function createBullets(safe, danger) {
        let bullets = [];
        for (let i = 0; i < safe; i++) {
            bullets.push("safe");
        }
        for (let i = 0; i < danger; i++) {
            bullets.push("danger");
        }
        return bullets;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateTurnInfo() {
        // Memperbarui turn info sesuai dengan skrip pertama
        document.getElementById("turnInfo").innerText = `Player ${currentPlayer}'s Turn`;
    }

    function updateLives() {
        const player1Lives = document.getElementById("player1Lives");
        player1Lives.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const life = document.createElement("img");
            life.classList.add("life");
            life.src = i < playerLives[1] ? "heart.png" : "heart_break.png";
            player1Lives.appendChild(life);
        }

        const player2Lives = document.getElementById("player2Lives");
        player2Lives.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const life = document.createElement("img");
            life.classList.add("life");
            life.src = i < playerLives[2] ? "heart.png" : "heart_break.png";
            player2Lives.appendChild(life);
        }
    }

    function resetGame() {
    playerLives = {1: 3, 2: 3};
    gameOver = false;
    pendingAction = null;

    document.getElementById("player1").src = "player1_idle.png";
    document.getElementById("player2").src = "player2_idle.png";

    document.getElementById("config").style.display = "block";
    document.getElementById("mainGame").style.display = "none";
    document.getElementById("result").innerText = '';
    document.getElementById("reset").style.display = "none";
    totalBullets = [];

    currentPlayer = Math.random() > 0.5 ? 1 : 2;

    updateTurnInfo();
    updateLives();

    // Pastikan tombol aksi ditampilkan kembali
    document.getElementById("actions").style.display = "none"; // Sembunyikan tombol aksi saat mereset
    }
        
    document.getElementById("shootSelf").addEventListener("click", function() {
        confirmAction("self");
    });

    document.getElementById("shootEnemy").addEventListener("click", function() {
        confirmAction("enemy");
    });

    function confirmAction(target) {
        pendingAction = target;
        showShootAnimation(target);
        document.getElementById("actions").style.display = "none";
        document.getElementById("confirm").style.display = "block";
    }

    function showShootAnimation(target) {
        if (target === "self") {
            document.getElementById(`player${currentPlayer}`).src = `player${currentPlayer}_shoot_self.png`;
        } else {
            document.getElementById(`player${currentPlayer}`).src = `player${currentPlayer}_shoot_enemy.png`;
        }
    }

    document.getElementById("yes").onclick = function() {
        performShoot(pendingAction);
    };

    document.getElementById("no").onclick = function() {
        document.getElementById("actions").style.display = "block";
        document.getElementById("confirm").style.display = "none";
        resetPlayerImage(); 
    };

    function resetPlayerImage() {
        document.getElementById(`player${currentPlayer}`).src = `player${currentPlayer}_idle.png`;
    }
function performShoot(target) {
    let bullet = totalBullets.pop(); 
    document.getElementById("confirm").style.display = "none";
    document.getElementById("result").style.display = "block";

    if (bullet === "danger") {
        if (target === "self") {
            playerLives[currentPlayer]--;
            updateLives();
            if (playerLives[currentPlayer] === 0) {
                document.getElementById(`player${currentPlayer}`).src = `player${currentPlayer}_ghost.gif`;
                document.getElementById("result").innerText = `Player ${currentPlayer} shot themselves with a dangerous bullet and died! Player ${currentPlayer === 1 ? 2 : 1} wins!`;
                gameOver = true;
            } else {
                document.getElementById(`player${currentPlayer}`).style.visibility = "hidden";
                document.getElementById("result").innerText = `Player ${currentPlayer} shot themselves with a dangerous bullet but survived!`;
                setTimeout(() => {
                    document.getElementById(`player${currentPlayer}`).style.visibility = "visible";
                    
                    resetPlayerImage();
                    switchTurn();
                }, 1000);
            }
        } else {
            let enemy = currentPlayer === 1 ? 2 : 1;
            playerLives[enemy]--;
            updateLives();
            if (playerLives[enemy] === 0) {
                document.getElementById(`player${enemy}`).src = `player${enemy}_ghost.gif`;
                document.getElementById("result").innerText = `Player ${currentPlayer} shot Player ${enemy} with a dangerous bullet and Player ${enemy} died!`;
                gameOver = true;
            } else {
                document.getElementById(`player${enemy}`).style.visibility = "hidden";
                    document.getElementById("result").innerText = `Player ${currentPlayer} shot Player ${enemy} with a dangerous bullet but they survived!`;
                setTimeout(() => {
                    document.getElementById(`player${enemy}`).style.visibility = "visible";
                    document.getElementById("result").style.display = "block";
                    resetPlayerImage();
                    switchTurn();
                }, 1000);
            }
        }
    } else {
        // Safe bullet logic
        if (target === "self") {
            document.getElementById("result").innerText = `Player ${currentPlayer} shot themselves with a safe bullet and gets another turn!`;
            setTimeout(() => {
                document.getElementById("actions").style.display = "block";
            }, 1000);
        } else {
            let enemy = currentPlayer === 1 ? 2 : 1;
            document.getElementById("result").innerText = `Player ${currentPlayer} shot Player ${enemy} with a safe bullet!`;
            setTimeout(() => {
                resetPlayerImage();
                switchTurn();
            }, 1000);
        }
    }
if (totalBullets.length === 0 && !gameOver) {
    document.getElementById("result").innerText = "It's a tie! No bullets left!";
    document.getElementById("result").style.display = "block";
    document.getElementById("reset").style.display = "block";

    gameOver = true;

    // Pastikan aksi tidak ditampilkan lagi saat seri
    document.getElementById("actions").style.display = "none";
}
    

        if (gameOver) {
            document.getElementById("actions").style.display = "none";
            document.getElementById("reset").style.display = "block";
        }
    }
function switchTurn() {
    if (totalBullets.length === 0 && !gameOver) {
        gameOver = true;
        document.getElementById("result").innerText = "It's a tie! No bullets left!";
        document.getElementById("result").style.display = "block";
        document.getElementById("reset").style.display = "block";
        document.getElementById("actions").style.display = "none";  // Hide actions when game is over
    } else if (!gameOver) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTurnInfo();
        document.getElementById("result").innerText = '';
        document.getElementById("actions").style.display = "block";
    }
}
