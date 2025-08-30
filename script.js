const board = document.getElementById("board");
const winnerText = document.getElementById("winner");
let currentPlayer = "X"; // Player always starts first
let cells = Array(9).fill(null);

// Create 9 cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.addEventListener("click", handleClick);
  board.appendChild(cell);
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!cells[index] && !checkWinner() && currentPlayer === "X") {
    makeMove(index, "X"); // Player move
    if (!checkWinner() && cells.includes(null)) {
      setTimeout(aiMove, 500); // AI move after short delay
    }
  }
}

function makeMove(index, player) {
  cells[index] = player;
  document.querySelector(`.cell[data-index='${index}']`).textContent = player;

  if (checkWinner()) {
    winnerText.textContent = `${player} Wins! 🎉`;
  } else if (cells.every(cell => cell)) {
    winnerText.textContent = "It's a Draw!";
  }
}

function aiMove() {
  // Try to win or block
  let move = findBestMove("O") || findBestMove("X") || getRandomMove();
  if (move !== null) {
    makeMove(move, "O");
  }
}

function findBestMove(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (cells[a] === player && cells[b] === player && !cells[c]) return c;
    if (cells[a] === player && cells[c] === player && !cells[b]) return b;
    if (cells[b] === player && cells[c] === player && !cells[a]) return a;
  }
  return null;
}

function getRandomMove() {
  const available = cells.map((val, idx) => val ? null : idx).filter(v => v !== null);
  return available.length ? available[Math.floor(Math.random() * available.length)] : null;
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function resetGame() {
  cells.fill(null);
  document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
  winnerText.textContent = "";
  currentPlayer = "X";
}
