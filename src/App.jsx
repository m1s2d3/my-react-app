import { useState, useEffect, useRef } from "react";
import "./App.css";
import clickSoundFile from "./sounds/click.mp3";
import clickSoundCompFile from "./sounds/clickComp.mp3";
import startSoundFile from "./sounds/start.mp3";
import winSoundFile from "./sounds/win.mp3";
import drawSoundFile from "./sounds/draw.mp3";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState("single");
  const [showSplash, setShowSplash] = useState(true);

  const sounds = useRef({
    click: new Audio(clickSoundFile),
    compClick: new Audio(clickSoundCompFile),
    start: new Audio(startSoundFile),
    win: new Audio(winSoundFile),
    draw: new Audio(drawSoundFile),
  });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  useEffect(() => {
    checkWinner();
  }, [board]);

  useEffect(() => {
    if (mode === "single" && !isXNext && !winner) {
      const timeoutId = setTimeout(computerMove, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isXNext, winner, mode]);

  const handleClick = (index) => {
    if (board[index] || winner || (mode === "single" && !isXNext)) return;
    sounds.current.click.play();
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const computerMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    if (emptyIndices.length === 0) return;
    sounds.current.compClick.play();
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    const newBoard = [...board];
    newBoard[emptyIndices[randomIndex]] = "O";
    setBoard(newBoard);
    setIsXNext(true);
  };

  const checkWinner = () => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        sounds.current.win.play();
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner("Draw");
      sounds.current.draw.play();
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderCell = (index) => (
    <button
      className="cell"
      onClick={() => handleClick(index)}
      disabled={board[index] !== null}
    >
      {board[index]}
    </button>
  );

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="text-section">
            <h1 className="splash-title">Tic Tac Toe</h1>
            <img src="app-icon.png" alt="game-icon" className="app-icon" />
            <p className="splash-subtitle">Let's play and have fun!</p>

            <button
              className="splash-btn"
              onClick={() => {
                sounds.current.start.play().catch(() => {});
                setShowSplash(false);
              }}
            >
              Start Game
            </button>

            <div className="splash-footer">
              <div className="created-by">
                <p>Created by <strong>Mohd Shamshad</strong></p>
                <img src="icon-developer.png" alt="Developer" className="mini-avatar" />
              </div>
              <p>© 2025 Powered by creativity and code.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Tic Tac Toe</h1>
        <p className="subtitle">Play against a friend or the computer</p>
      </header>

      <div className="mode-toggle">
        <button
          onClick={() => {
            setMode("single");
            resetGame();
          }}
          className={mode === "single" ? "mode active" : "mode"}
        >
          Single Player
        </button>
        <button
          onClick={() => {
            setMode("multi");
            resetGame();
          }}
          className={mode === "multi" ? "mode active" : "mode"}
        >
          Multiplayer
        </button>
      </div>

      <p className="turn">
        {!winner
          ? isXNext
            ? "Player X's turn"
            : mode === "single"
            ? "Computer's turn"
            : "Player O's turn"
          : winner === "Draw"
          ? "It's a draw!"
          : `${winner} wins!`}
      </p>

      <div className="board">
        {Array.from({ length: 9 }).map((_, index) => (
          <div className="cell-wrapper" key={index}>
            {renderCell(index)}
          </div>
        ))}
      </div>

      <button className="reset" onClick={resetGame}>
        Reset Game
      </button>

      {winner && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              {winner === "Draw" ? (
                <div className="modal-content-centered">
                  <img src="/draw.png" alt="draw" className="app-icon" />
                  It's a draw
                </div>
              ) : mode === "single" && winner === "O" ? (
                <div className="modal-content-centered">
                  <img src="/lose.png" alt="lose" className="app-icon" />
                  You Lose! 😞
                </div>
              ) : mode === "single" && winner === "X" ? (
                <div className="modal-content-centered">
                  <img src="/win.png" alt="winner" className="app-icon" />
                  You Win! 🎉
                </div>
              ) : (
                <div className="modal-content-centered">
                  <img src="/win.png" alt="winner" className="app-icon" />
                  {winner} Wins! 🎉
                </div>
              )}
            </h2>
            <button className="play" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
