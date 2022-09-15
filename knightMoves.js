let DirX = [2, 1, -1, -2, -2, -1, 1, 2],
  DirY = [1, 2, 2, 1, -1, -2, -2, -1];

function isSafe(i, j, n, Board) {
  return i >= 0 && j >= 0 && i < n && j < n && 0 == Board[i][j];
}

let isPossible = !1;

function knightTour(ChessBoard, N, x, y, visited = 1) {
  if (((ChessBoard[x][y] = visited), visited == N * N)) {
    isPossible = !0;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) console.log(ChessBoard[i][j] + " ");
      console.log("\n");
    }

    return console.log("\n"), void (ChessBoard[x][y] = 0);
  }

  for (let i = 0; i < 8; i++) {
    let newX = x + DirX[i];
    let newY = y + DirY[i];

    isSafe(newX, newY, N, ChessBoard) &&
      !ChessBoard[newX][newY] &&
      knightTour(ChessBoard, N, newX, newY, visited + 1);
  }
  ChessBoard[x][y] = 0;
}

let ChessBoard = new Array(5).fill(0).map(() => new Array(5).fill(0));
let N = ChessBoard.length;
let X = 1;
let Y = 1;

knightTour(ChessBoard, N, X - 1, Y - 1);
isPossible || console.log("-1");
