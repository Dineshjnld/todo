const grid = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('timeLeft');
const bestEl = document.getElementById('bestScore');

const TOTAL_TILES = 9;
const GAME_TIME = 30;

const difficultySettings = {
    chill: { moveInterval: 900 },
    steady: { moveInterval: 700 },
    fast: { moveInterval: 500 }
};

let activeIndex = -1;
let score = 0;
let timeLeft = GAME_TIME;
let running = false;
let moveTimer = null;
let countdownTimer = null;

const bestScoreKey = 'pulse-grid-best';

function initGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < TOTAL_TILES; i++) {
        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.type = 'button';
        tile.dataset.index = String(i);
        tile.setAttribute('aria-label', `Tile ${i + 1}`);
        grid.appendChild(tile);
    }
}

function loadBestScore() {
    const stored = Number(localStorage.getItem(bestScoreKey));
    if (!Number.isNaN(stored)) {
        bestEl.textContent = stored;
    }
}

function setActiveTile(index) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => tile.classList.remove('active'));
    if (index >= 0) {
        tiles[index].classList.add('active');
    }
    activeIndex = index;
}

function pickNextTile() {
    let next = Math.floor(Math.random() * TOTAL_TILES);
    if (TOTAL_TILES > 1) {
        while (next === activeIndex) {
            next = Math.floor(Math.random() * TOTAL_TILES);
        }
    }
    setActiveTile(next);
}

function updateStats() {
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
}

function startGame() {
    if (running) return;
    if (timeLeft <= 0) {
        resetGame();
    }

    running = true;
    difficultySelect.disabled = true;
    startBtn.textContent = 'Pause';

    pickNextTile();
    const { moveInterval } = difficultySettings[difficultySelect.value];

    moveTimer = setInterval(pickNextTile, moveInterval);
    countdownTimer = setInterval(() => {
        timeLeft -= 1;
        updateStats();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function pauseGame() {
    running = false;
    startBtn.textContent = 'Resume';
    clearInterval(moveTimer);
    clearInterval(countdownTimer);
}

function endGame() {
    pauseGame();
    startBtn.textContent = 'Start';
    setActiveTile(-1);
    difficultySelect.disabled = false;

    const bestScore = Number(bestEl.textContent) || 0;
    if (score > bestScore) {
        bestEl.textContent = score;
        localStorage.setItem(bestScoreKey, String(score));
    }
}

function resetGame() {
    pauseGame();
    score = 0;
    timeLeft = GAME_TIME;
    startBtn.textContent = 'Start';
    difficultySelect.disabled = false;
    setActiveTile(-1);
    updateStats();
}

function handleTileClick(event) {
    const tile = event.target.closest('.tile');
    if (!tile || !running) return;

    const index = Number(tile.dataset.index);
    if (index === activeIndex) {
        score += 1;
        tile.classList.add('hit');
        setTimeout(() => tile.classList.remove('hit'), 180);
        pickNextTile();
    } else {
        score = Math.max(0, score - 1);
        tile.classList.add('miss');
        setTimeout(() => tile.classList.remove('miss'), 180);
    }

    updateStats();
}

startBtn.addEventListener('click', () => {
    if (running) {
        pauseGame();
    } else {
        startGame();
    }
});

resetBtn.addEventListener('click', resetGame);

grid.addEventListener('click', handleTileClick);

difficultySelect.addEventListener('change', () => {
    if (running) {
        pauseGame();
        startGame();
    }
});

initGrid();
loadBestScore();
updateStats();
