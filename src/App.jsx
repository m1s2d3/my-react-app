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
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState("single");
  const [showSplash, setShowSplash] = useState(true);

  const clickSound = useRef(new Audio(clickSoundFile));
  const clickSoundComp = useRef(new Audio(clickSoundCompFile));
  const startSound = useRef(new Audio(startSoundFile));
  const winSound = useRef(new Audio(winSoundFile));
  const drawSound = useRef(new Audio(drawSoundFile));

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  useEffect(() => {
    checkWinner();
  }, [board]);

  useEffect(() => {
    if (mode === "single" && !isXNext && !winner && !gameOver) {
      const timeoutId = setTimeout(computerMove, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isXNext, winner, gameOver, mode]);

  const handleClick = (index) => {
    clickSound.current.play();
    if (board[index] || winner || (mode === "single" && !isXNext)) return;
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
    clickSoundComp.current.play();
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
        setGameOver(true);
        winSound.current.play();
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("Draw");
      setGameOver(true);
      drawSound.current.play();
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameOver(false);
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
      // <div className="splash-screen">
      //   <h1 className="splash-title">Tic Tac Toe</h1>
      //   <p className="splash-subtitle">Let's play and have fun!</p>
      //   <button className="splash-btn" onClick={() => {
      //     startSound.current.play().catch(() => {});
      //     setShowSplash(false)
      //     }}>
      //     Start Game
      //   </button>
      // </div>
      <div className="splash-screen">
      <div className="splash-content">
        <div className="text-section">
          <h1 className="splash-title">Tic Tac Toe</h1>
          <p className="splash-subtitle">Let's play and have fun!</p>

          <button
            className="splash-btn"
            onClick={() => {
              startSound.current.play().catch(() => {});
              setShowSplash(false);
            }}
          >
            Start Game
          </button>

          <div className="splash-footer">
            <div className="created-by">
              <p>Created by <strong>Mohd Shamshad</strong></p><img
                src="../public/icon-developer.png"
                alt="Developer"
                className="mini-avatar"
              />
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

      {gameOver && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins! 🎉`}</h2>
            <button className="play" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
