import { Chess, Move, PieceSymbol } from "chess.js";

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square tables from White's perspective (row 0 = rank 8, row 7 = rank 1)
const PST: Record<PieceSymbol, number[][]> = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 27, 27, 10, 5, 5],
    [0, 0, 0, 24, 24, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -22, -22, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === "w" ? -99999 : 99999;
  }
  if (game.isDraw()) return 0;

  const board = game.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c];
      if (!sq) continue;
      const base = PIECE_VALUES[sq.type];
      const pstRow = sq.color === "w" ? r : 7 - r;
      const pst = PST[sq.type][pstRow][c];
      const total = base + pst;
      score += sq.color === "w" ? total : -total;
    }
  }

  return score;
}

function scoreMove(move: Move): number {
  let s = 0;
  if (move.captured) {
    s += 10 * PIECE_VALUES[move.captured] - PIECE_VALUES[move.piece];
  }
  if (move.promotion) {
    s += PIECE_VALUES[move.promotion];
  }
  if (move.san.includes("+")) {
    s += 60;
  }
  return s;
}

function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => scoreMove(b) - scoreMove(a));
}

function quiescence(
  game: Chess,
  alpha: number,
  beta: number,
  maximizing: boolean,
  qDepth: number
): number {
  const standPat = evaluateBoard(game);
  if (qDepth <= 0) return standPat;

  if (maximizing) {
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;

    const captures = orderMoves(
      game.moves({ verbose: true }).filter((m) => m.captured || m.promotion)
    );
    for (const move of captures) {
      game.move(move);
      const val = quiescence(game, alpha, beta, false, qDepth - 1);
      game.undo();
      if (val >= beta) return beta;
      if (val > alpha) alpha = val;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (beta > standPat) beta = standPat;

    const captures = orderMoves(
      game.moves({ verbose: true }).filter((m) => m.captured || m.promotion)
    );
    for (const move of captures) {
      game.move(move);
      const val = quiescence(game, alpha, beta, true, qDepth - 1);
      game.undo();
      if (val <= alpha) return alpha;
      if (val < beta) beta = val;
    }
    return beta;
  }
}

function alphabeta(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  deadline: number
): number {
  if (Date.now() > deadline) {
    return evaluateBoard(game);
  }
  if (game.isCheckmate()) {
    return maximizing ? -99999 - depth : 99999 + depth;
  }
  if (game.isDraw()) return 0;
  if (depth <= 0) {
    return quiescence(game, alpha, beta, maximizing, 2);
  }

  const moves = orderMoves(game.moves({ verbose: true }));
  if (maximizing) {
    let best = -Infinity;
    for (const move of moves) {
      game.move(move);
      const val = alphabeta(game, depth - 1, alpha, beta, false, deadline);
      game.undo();
      if (val > best) best = val;
      if (best > alpha) alpha = best;
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      game.move(move);
      const val = alphabeta(game, depth - 1, alpha, beta, true, deadline);
      game.undo();
      if (val < best) best = val;
      if (best < beta) beta = best;
      if (beta <= alpha) break;
    }
    return best;
  }
}

function findBestMove(fen: string, maxDepth: number): string {
  const game = new Chess(fen);
  const moves = orderMoves(game.moves({ verbose: true }));
  if (moves.length === 0) return "(none)";

  const maximizing = game.turn() === "w";
  const deadline = Date.now() + 900; // snappy <= 900ms budget
  let bestMove = moves[0];

  for (let depth = 1; depth <= Math.min(maxDepth, 4); depth++) {
    let currentBest = moves[0];
    let bestEval = maximizing ? -Infinity : Infinity;

    for (const move of moves) {
      if (Date.now() > deadline && depth > 1) break;
      game.move(move);
      const val = alphabeta(
        game,
        depth - 1,
        -Infinity,
        Infinity,
        !maximizing,
        deadline
      );
      game.undo();

      if (maximizing ? val > bestEval : val < bestEval) {
        bestEval = val;
        currentBest = move;
      }
    }

    bestMove = currentBest;
    if (Date.now() > deadline) break;
  }

  return `${bestMove.from}${bestMove.to}${bestMove.promotion || ""}`;
}

let currentFen = new Chess().fen();

self.onmessage = (e: MessageEvent<string>) => {
  const cmd = String(e.data || "").trim();

  if (cmd === "uci") {
    self.postMessage("id name PortfolioChessEngine 1.0");
    self.postMessage("uciok");
  } else if (cmd === "isready") {
    self.postMessage("readyok");
  } else if (cmd.startsWith("position fen ")) {
    currentFen = cmd.slice("position fen ".length).trim();
  } else if (cmd.startsWith("go")) {
    const depthMatch = cmd.match(/depth\s+(\d+)/);
    const depth = depthMatch ? parseInt(depthMatch[1], 10) : 3;
    const best = findBestMove(currentFen, depth);
    self.postMessage(`bestmove ${best}`);
  }
};
