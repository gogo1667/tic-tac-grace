let gameStarted = false;

const welcomeScreen = document.getElementById("welcomeScreen");
const startBtn = document.getElementById("startBtn");

const resultOverlay = document.getElementById("resultOverlay");
const resultMessage = document.getElementById("resultMessage");
const retryBtn = document.getElementById("retryBtn");

const xScoreDisplay = document.getElementById("xScore");
const oScoreDisplay = document.getElementById("oScore");
const tieScoreDisplay = document.getElementById("tieScore");

startBtn.addEventListener("click", () => {
    gameStarted = true;
    welcomeScreen.style.display = "none";
});

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

let xScore = 0;
let oScore = 0;
let tieScore = 0;

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

    const index = e.target.getAttribute("data-index");
    if (board[index] !== "") return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    checkWinner();
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a,b,c] = condition;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;

            if (currentPlayer === "X") {
                xScore++;
                xScoreDisplay.textContent = xScore;
                resultMessage.textContent = "You Win 🎉";
            } else {
                oScore++;
                oScoreDisplay.textContent = oScore;
                resultMessage.textContent = "Grace Wins 👑";
            }

            showEndScreen();
            return;
        }
    }

    if (!board.includes("")) {
        gameOver = true;
        tieScore++;
        tieScoreDisplay.textContent = tieScore;
        resultMessage.textContent = "It's a Tie 🤝";
        showEndScreen();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
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

    cells.forEach(cell => cell.textContent = "");

    resultOverlay.style.display = "none";
    retryBtn.style.display = "none";
}
