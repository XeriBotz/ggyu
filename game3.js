let board = Array(25).fill(''); // Papan permainan 5x5
let currentPlayer = 'X';
let gameOver = false;
let isComputerTurn = false;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const gameResult = document.getElementById('game-result');

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (gameOver || board[index] !== '' || isComputerTurn) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.disabled = true;

    if (checkWinner()) {
      gameOver = true;
      showWinningAnimation();
      gameResult.textContent = `Pemenang: Pemain ${currentPlayer}`;
      gameResult.classList.add(currentPlayer === 'X' ? 'win' : 'lose');
    } else if (board.every(cell => cell !== '')) {
      gameOver = true;
      gameResult.textContent = "Hasil: Seri";
      gameResult.classList.add('draw');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Giliran: Pemain ${currentPlayer}`;
      if (currentPlayer === 'O') computerMove();
    }
  });
});

resetButton.addEventListener('click', resetGame);

// Fungsi AI dengan algoritma Minimax
function computerMove() {
  isComputerTurn = true;

  let bestMove = minimax(board, 0, true); // Cari langkah terbaik menggunakan Minimax
  setTimeout(() => {
    board[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';
    cells[bestMove.index].disabled = true;

    if (checkWinner()) {
      gameOver = true;
      showWinningAnimation();
      gameResult.textContent = 'Pemenang: Pemain O';
      gameResult.classList.add('lose');
    } else if (board.every(cell => cell !== '')) {
      gameOver = true;
      gameResult.textContent = "Hasil: Seri";
      gameResult.classList.add('draw');
    } else {
      currentPlayer = 'X';
      status.textContent = `Giliran: Pemain ${currentPlayer}`;
      isComputerTurn = false;
    }
  }, 800);
}

// Fungsi Minimax untuk mencari langkah terbaik
function minimax(board, depth, isMaximizingPlayer) {
  const winner = checkWinner();
  if (winner) return { score: isMaximizingPlayer ? -1 : 1, index: -1 };
  if (board.every(cell => cell !== '')) return { score: 0, index: -1 };

  let bestMove = { score: isMaximizingPlayer ? -Infinity : Infinity, index: -1 };

  for (let i = 0; i < 25; i++) {
    if (board[i] === '') {
      board[i] = isMaximizingPlayer ? 'O' : 'X';
      const currentScore = minimax(board, depth + 1, !isMaximizingPlayer).score;
      board[i] = '';

      if (
        (isMaximizingPlayer && currentScore > bestMove.score) ||
        (!isMaximizingPlayer && currentScore < bestMove.score)
      ) {
        bestMove = { score: currentScore, index: i };
      }
    }
  }

  return bestMove;
}

// Mengecek pemenang
function checkWinner() {
  const winPatterns = [
    // Baris
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Kolom
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonal
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c, d, e] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e]) {
      return pattern; // Kembalikan pola pemenang
    }
  }
  return null;
}

// Animasi kemenangan
function showWinningAnimation() {
  const winningPattern = checkWinner();
  if (winningPattern) {
    winningPattern.forEach(index => {
      cells[index].classList.add('highlight'); // Tambahkan animasi highlight
    });
  }
}

// Reset permainan
function resetGame() {
  board = Array(25).fill('');
  gameOver = false;
  isComputerTurn = false;
  currentPlayer = 'X';
  status.textContent = 'Giliran: Pemain X';
  gameResult.textContent = '';
  gameResult.classList.remove('win', 'lose', 'draw');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('highlight'); // Hapus highlight animasi
  });
}
