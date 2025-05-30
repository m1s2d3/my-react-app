import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState("single"); // single or multiplayer

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    checkWinner();
    if (mode === "single" && !isXNext && !winner && !gameOver) {
      setTimeout(computerMove, 500);
    }
  }, [board, isXNext]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
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
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("Draw");
      setGameOver(true);
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

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Tic Tac Toe</h1>
        <p className="subtitle">Play against a friend or the computer</p>
      </header>

      <div className="mode-toggle">
        <button
          onClick={() => setMode("single")}
          className={mode === "single" ? "mode active" : "mode"}
        >
          Single Player
        </button>
        <button
          onClick={() => setMode("multi")}
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
        {winner ? "Play Again" : "Reset Game"}
      </button>

      <footer className="footer">
        <p>Tap the icon below to add this game to your home screen.</p>
        <img
          src="/vite.svg"
          alt="Add to Home Screen"
          className="icon"
        />
      </footer>
    </div>
  );
}
