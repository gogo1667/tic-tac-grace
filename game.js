let gameStarted = false;
let gameMode = null;

const welcomeScreen = document.getElementById("welcomeScreen");
const walterBtn = document.getElementById("walterBtn");
const rumiBtn = document.getElementById("rumiBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");

const resultOverlay = document.getElementById("resultOverlay");
const resultMessage = document.getElementById("resultMessage");
const retryBtn = document.getElementById("retryBtn");

const xScoreDisplay = document.getElementById("xScore");
const oScoreDisplay = document.getElementById("oScore");
const tieScoreDisplay = document.getElementById("tieScore");

walterBtn.addEventListener("click", () => startGame("walterComputer"));
rumiBtn.addEventListener("click", () => startGame("rumiComputer"));
twoPlayerBtn.addEventListener("click", () => startGame("twoPlayer"));

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

let xScore = 0;
let oScore = 0;
let tieScore = 0;

function startGame(mode) {
    gameMode = mode;
    gameStarted = true;
    welcomeScreen.style.display = "none";

    // Reset board state
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.innerHTML = "");
    gameOver = false;

    currentPlayer = mode === "rumiComputer" ? "O" : "X";

    // If computer should go first, make its move
    if (isComputerTurn()) {
        setTimeout(computerMove, 400);
    }
}

const cells = document.querySelectorAll(".cell");

const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

function handleClick(e) {
    if (!gameStarted || gameOver) return;

    const cell = e.currentTarget;
    const index = cell.getAttribute("data-index");

    if (board[index] !== "") return;

    // Prevent human from playing computer's turn
    if (isComputerTurn()) return;

    makeMove(cell, index);
}

function makeMove(cell, index) {
    board[index] = currentPlayer;

    const img = document.createElement("img");
    img.src = currentPlayer === "X"
        ? "images/walterX.png"
        : "images/rumiO.png";
    img.classList.add("pieceImage");

    cell.appendChild(img);

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (!gameOver && isComputerTurn()) {
        setTimeout(computerMove, 400);
    }
}

function isComputerTurn() {
    if (gameMode === "twoPlayer") return false;

    if (gameMode === "walterComputer" && currentPlayer === "O") return true;
    if (gameMode === "rumiComputer" && currentPlayer === "X") return true;

    return false;
}

function computerMove() {
    let emptyIndexes = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(v => v !== null);

    if (emptyIndexes.length === 0) return;

    let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    let cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);

    makeMove(cell, randomIndex);
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a,b,c] = condition;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;

            if (board[a] === "X") {
                xScore++;
                xScoreDisplay.textContent = xScore;
                resultMessage.textContent = "Walter Wins";
            } else {
                oScore++;
                oScoreDisplay.textContent = oScore;
                resultMessage.textContent = "Rumi Wins";
            }

            showEndScreen();
            return true;
        }
    }

    if (!board.includes("")) {
        gameOver = true;
        tieScore++;
        tieScoreDisplay.textContent = tieScore;
        resultMessage.textContent = "It's a Tie";
        showEndScreen();
        return true;
    }

    return false;
}

function showEndScreen() {
    resultOverlay.style.display = "flex";
    retryBtn.style.display = "block";
}

retryBtn.addEventListener("click", resetGame);

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    cells.forEach(cell => {
        cell.innerHTML = "";
    });

    resultOverlay.style.display = "none";
    retryBtn.style.display = "none";
}
