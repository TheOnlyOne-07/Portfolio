import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Chess, PieceSymbol, Square } from "chess.js";
import { CHESS_PIECES } from "../assets/chessPieces";
import { portfolioConfig } from "../config/portfolio";
import {
  buildPortfolioChatReply,
  ChessBoardContext,
  SUGGESTED_CHAT_PROMPTS,
} from "../utils/portfolioChat";
import "../styles/Play.css";

interface MoveHistoryEntry {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  san: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

class UciEngineClient {
  private worker: Worker | null = null;
  private onMoveCallback: ((move: string) => void) | null = null;

  async init(): Promise<void> {
    return new Promise((resolve) => {
      this.worker = new Worker(
        new URL("../workers/chessEngine.worker.ts", import.meta.url),
        { type: "module" }
      );
      this.worker.onmessage = (event: MessageEvent<string>) => {
        const line = event.data;
        if (line === "readyok") {
          resolve();
        } else if (line.startsWith("bestmove")) {
          const move = line.split(" ")[1];
          if (this.onMoveCallback && move && move !== "(none)") {
            this.onMoveCallback(move);
          }
        }
      };
      this.send("uci");
      this.send("isready");
    });
  }

  send(command: string) {
    this.worker?.postMessage(command);
  }

  setPosition(fen: string) {
    this.send(`position fen ${fen}`);
  }

  getBestMove(callback: (move: string) => void, depth = 4) {
    this.onMoveCallback = callback;
    this.send(`go depth ${depth}`);
  }

  quit() {
    if (this.worker) {
      this.send("quit");
      this.worker.terminate();
      this.worker = null;
    }
  }
}

const Play: React.FC = () => {
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [statusText, setStatusText] = useState("White's turn");
  const [isThinking, setIsThinking] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);

  const engineRef = useRef<UciEngineClient | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: portfolioConfig.play.welcomeMessage,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const files = flipped
    ? ["h", "g", "f", "e", "d", "c", "b", "a"]
    : ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = flipped
    ? ["1", "2", "3", "4", "5", "6", "7", "8"]
    : ["8", "7", "6", "5", "4", "3", "2", "1"];

  const updateStatus = useCallback((chess: Chess) => {
    if (chess.isCheckmate()) {
      setStatusText(
        chess.turn() === "w"
          ? "Checkmate! Black wins!"
          : "Checkmate! White wins!"
      );
    } else if (chess.isDraw()) {
      if (chess.isStalemate()) setStatusText("Draw by stalemate");
      else if (chess.isThreefoldRepetition()) setStatusText("Draw by repetition");
      else if (chess.isInsufficientMaterial())
        setStatusText("Draw by insufficient material");
      else setStatusText("Draw");
    } else if (chess.isCheck()) {
      setStatusText(
        chess.turn() === "w" ? "White is in check!" : "Black is in check!"
      );
    } else {
      setStatusText(chess.turn() === "w" ? "White's turn" : "Black's turn");
    }
  }, []);

  useEffect(() => {
    updateStatus(game);
  }, [game, updateStatus]);

  useEffect(() => {
    const client = new UciEngineClient();
    engineRef.current = client;
    client.init();
    return () => {
      client.quit();
      engineRef.current = null;
    };
  }, []);

  const executeMove = useCallback(
    (from: Square, to: Square, promotion: PieceSymbol = "q") => {
      try {
        const next = new Chess(game.fen());
        const moveResult = next.move({ from, to, promotion });
        if (moveResult) {
          if (moveResult.captured) {
            if (moveResult.color === "w") {
              setCapturedByWhite((prev) => [...prev, moveResult.captured!]);
            } else {
              setCapturedByBlack((prev) => [...prev, moveResult.captured!]);
            }
          }
          setMoveHistory((prev) => [
            ...prev,
            {
              from: moveResult.from,
              to: moveResult.to,
              piece: moveResult.piece,
              captured: moveResult.captured,
              san: moveResult.san,
            },
          ]);
          setLastMove({ from, to });
          setGame(next);
          setSelectedSquare(null);
          setLegalMoves([]);
          setPendingPromotion(null);
        }
      } catch {
        setSelectedSquare(null);
        setLegalMoves([]);
        setPendingPromotion(null);
      }
    },
    [game]
  );

  // Trigger AI move when it's Black's turn
  useEffect(() => {
    if (game.turn() === "b" && !game.isGameOver() && engineRef.current) {
      setIsThinking(true);
      const currentFen = game.fen();
      const timer = window.setTimeout(() => {
        engineRef.current?.setPosition(currentFen);
        engineRef.current?.getBestMove((bestMoveStr) => {
          const from = bestMoveStr.substring(0, 2) as Square;
          const to = bestMoveStr.substring(2, 4) as Square;
          const promo = (bestMoveStr[4] as PieceSymbol | undefined) || "q";
          executeMove(from, to, promo);
          setIsThinking(false);
        }, portfolioConfig.play.searchDepth);
      }, 120);

      return () => window.clearTimeout(timer);
    }
  }, [game, executeMove]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSquareClick = (sq: Square) => {
    if (isThinking || game.turn() !== "w" || game.isGameOver()) return;
    const piece = game.get(sq);

    if (selectedSquare) {
      if (legalMoves.includes(sq)) {
        const movingPiece = game.get(selectedSquare);
        const isPromotion =
          movingPiece?.type === "p" &&
          movingPiece.color === "w" &&
          sq.endsWith("8");
        if (isPromotion) {
          setPendingPromotion({ from: selectedSquare, to: sq });
        } else {
          executeMove(selectedSquare, sq);
        }
        return;
      }

      if (piece && piece.color === game.turn()) {
        setSelectedSquare(sq);
        const moves = game.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        return;
      }

      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (piece && piece.color === game.turn()) {
      setSelectedSquare(sq);
      const moves = game.moves({ square: sq, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    }
  };

  const handleNewGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setCapturedByBlack([]);
    setCapturedByWhite([]);
    setLastMove(null);
    setStatusText("White's turn");
    setPendingPromotion(null);
    setIsThinking(false);
  };

  const renderMessageContent = (text: string) => {
    const tokenRegex = /(https?:\/\/[^\s)]+|\/myworks\b|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(tokenRegex);
    return parts.map((part, idx) => {
      if (/^https?:\/\//.test(part)) {
        const cleanUrl = part.replace(/[.,;!?]+$/, "");
        const trailing = part.slice(cleanUrl.length);
        return (
          <React.Fragment key={idx}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-link"
              data-cursor="disable"
            >
              {cleanUrl}
            </a>
            {trailing}
          </React.Fragment>
        );
      }
      if (part === "/myworks") {
        return (
          <Link
            key={idx}
            to="/myworks"
            className="chat-link"
            data-cursor="disable"
          >
            /myworks
          </Link>
        );
      }
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
        return (
          <a
            key={idx}
            href={`mailto:${part}`}
            className="chat-link"
            data-cursor="disable"
          >
            {part}
          </a>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: portfolioConfig.play.welcomeMessage,
      },
    ]);
    setInputValue("");
  };

  const handleSendMessage = async (overrideText?: string) => {
    const trimmed = (overrideText ?? inputValue).trim();
    if (!trimmed || isTyping) return;
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!overrideText) setInputValue("");
    setIsTyping(true);

    const boardContext: ChessBoardContext = {
      statusText,
      moveCount: moveHistory.length,
      lastMoveSan: moveHistory[moveHistory.length - 1]?.san,
      turn: game.turn(),
      isGameOver: game.isGameOver(),
      isCheck: game.isCheck(),
    };

    try {
      const payload = {
        boardContext,
        messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Invalid chat response");
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch {
      // Seamless local assistant fallback if API route is offline (e.g. static deploy)
      const fallbackReply = buildPortfolioChatReply(nextHistory, boardContext);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackReply },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderPiece = (piece: { color: string; type: string } | undefined) => {
    if (!piece) return null;
    const key = `${piece.color}${piece.type.toUpperCase()}`;
    const svg = CHESS_PIECES[key];
    if (!svg) return null;
    return (
      <div
        className="chess-piece"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  };

  const renderCaptured = (pieces: string[], color: "w" | "b") =>
    pieces.map((type, idx) => {
      const key = `${color}${type.toUpperCase()}`;
      return (
        <div
          key={idx}
          className="captured-piece"
          dangerouslySetInnerHTML={{ __html: CHESS_PIECES[key] || "" }}
        />
      );
    });

  const pairedMoves: Array<{
    moveNum: number;
    white: string;
    black: string;
  }> = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairedMoves.push({
      moveNum: Math.floor(i / 2) + 1,
      white: moveHistory[i]?.san || "",
      black: moveHistory[i + 1]?.san || "",
    });
  }

  return (
    <div className="play-page">
      <div className="play-header">
        <Link to="/" className="back-button" data-cursor="disable">
          &larr; Back to Home
        </Link>
      </div>

      <div className="chess-container">
        {/* Left AI Chat Panel */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-meta">
              <span className="chat-status-dot" />
              <span className="chat-title">Talk with Tejas</span>
            </div>
            {messages.length > 1 && (
              <button
                type="button"
                className="chat-reset-btn"
                onClick={handleResetChat}
                data-cursor="disable"
                title="Clear chat"
              >
                Reset
              </button>
            )}
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-content">
                  {msg.role === "assistant"
                    ? renderMessageContent(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message assistant">
                <div className="message-content typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-suggestions" aria-label="Suggested questions">
            {SUGGESTED_CHAT_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chat-chip"
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                data-cursor="disable"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about projects, hardware, or chess..."
              value={inputValue}
              maxLength={500}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              data-cursor="disable"
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              data-cursor="disable"
              aria-label="Send message"
            >
              &#10148;
            </button>
          </div>
        </div>

        {/* Center Chess Board */}
        <div className="chess-board-section">
          <div className="player-bar opponent-bar">
            <div className="player-info">
              <div className="player-avatar">
                <img
                  src={portfolioConfig.media.avatarImage}
                  alt={portfolioConfig.play.opponentName}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="player-details">
                <span className="player-name">
                  {portfolioConfig.play.opponentName}
                </span>
                <span className="player-rating">
                  {isThinking
                    ? "🤔 Thinking..."
                    : portfolioConfig.play.opponentRating}
                </span>
              </div>
            </div>
            <div className="captured-pieces">
              {renderCaptured(capturedByBlack, "w")}
            </div>
          </div>

          <div className="chess-board-wrapper">
            <div className="chess-board">
              {ranks.map((rank) =>
                files.map((file) => {
                  const sq = `${file}${rank}` as Square;
                  const piece = game.get(sq);
                  const isLight =
                    ("abcdefgh".indexOf(file) + (parseInt(rank, 10) - 1)) %
                      2 ===
                    1;
                  const isSelected = selectedSquare === sq;
                  const isLegal = legalMoves.includes(sq);
                  const isLastMove =
                    lastMove && (lastMove.from === sq || lastMove.to === sq);
                  const isInCheck =
                    game.isCheck() &&
                    piece?.type === "k" &&
                    piece?.color === game.turn();

                  return (
                    <div
                      key={sq}
                      className={`chess-square ${isLight ? "light" : "dark"} ${
                        isSelected ? "selected" : ""
                      } ${isLastMove ? "last-move" : ""} ${
                        isInCheck ? "in-check" : ""
                      }`}
                      onClick={() => handleSquareClick(sq)}
                      data-cursor="disable"
                    >
                      {file === (flipped ? "h" : "a") && (
                        <span className="coord-rank">{rank}</span>
                      )}
                      {rank === (flipped ? "8" : "1") && (
                        <span className="coord-file">{file}</span>
                      )}
                      {renderPiece(piece)}
                      {isLegal && (
                        <div
                          className={`move-indicator ${
                            piece ? "capture" : ""
                          }`}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {pendingPromotion && (
              <div className="promotion-overlay">
                <span>Choose Promotion Piece</span>
                <div className="promotion-choices">
                  {(["q", "r", "b", "n"] as PieceSymbol[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="promotion-btn"
                      onClick={() =>
                        executeMove(
                          pendingPromotion.from,
                          pendingPromotion.to,
                          p
                        )
                      }
                      dangerouslySetInnerHTML={{
                        __html: CHESS_PIECES[`w${p.toUpperCase()}`] || "",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="player-bar player-bar-bottom">
            <div className="player-info">
              <div className="player-avatar">
                <span>👤</span>
              </div>
              <div className="player-details">
                <span className="player-name">You</span>
                <span className="player-rating">White</span>
              </div>
            </div>
            <div className="captured-pieces">
              {renderCaptured(capturedByWhite, "b")}
            </div>
          </div>
        </div>

        {/* Right Controls & Move History */}
        <div className="chess-side-panel right-panel">
          <div className="game-status">
            <span className={game.isCheck() ? "check" : ""}>{statusText}</span>
          </div>

          <div className="move-history">
            <div className="move-history-header">Moves</div>
            <div className="move-history-list">
              {pairedMoves.map((row, idx) => (
                <div className="move-row" key={idx}>
                  <span className="move-num">{row.moveNum}.</span>
                  <span className="move-white">{row.white}</span>
                  <span className="move-black">{row.black}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="game-controls">
            <button
              type="button"
              onClick={handleNewGame}
              className="control-btn"
              data-cursor="disable"
            >
              New Game
            </button>
            <button
              type="button"
              onClick={() => {
                if (moveHistory.length > 0) {
                  if (window.confirm("Start new game?")) {
                    handleNewGame();
                    setFlipped((f) => !f);
                  }
                } else {
                  setFlipped((f) => !f);
                }
              }}
              className="control-btn"
              data-cursor="disable"
            >
              Flip Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
