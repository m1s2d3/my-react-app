import { useState, useEffect } from "react";

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
    if (mode === "computer" && !isXNext && !winner && !gameOver) {
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
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);
    if (emptyIndices.length === 0) return;

    // Simple AI: Random move
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
      className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center text-4xl md:text-6xl font-bold text-indigo-600 transition-transform hover:scale-105 focus:outline-none"
      onClick={() => handleClick(index)}
      disabled={board[index] !== null}
    >
      {board[index]}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-gray-600">Play against a friend or the computer</p>
      </header>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setMode("single")}
          className={`px-4 py-2 rounded-full font-medium ${
            mode === "single"
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 border border-indigo-300"
          } transition-all`}
        >
          Single Player
        </button>
        <button
          onClick={() => setMode("multi")}
          className={`px-4 py-2 rounded-full font-medium ${
            mode === "multi"
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 border border-indigo-300"
          } transition-all`}
        >
          Multiplayer
        </button>
      </div>

      {!winner ? (
        <p className="text-xl text-gray-700 mb-6">
          {isXNext ? "Player X's turn" : mode === "single" ? "Computer's turn" : "Player O's turn"}
        </p>
      ) : (
        <p className="text-xl text-green-600 font-semibold mb-6">
          {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg flex items-center justify-center"
          >
            {renderCell(index)}
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all"
      >
        {winner ? "Play Again" : "Reset Game"}
      </button>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Tap the icon below to add this game to your home screen.</p>
        <img
          src="https://placehold.co/100x100/indigo/white?text=Add+to+Home+Screen"
          alt="Add to Home Screen"
          className="mx-auto mt-4 w-16 h-16 object-cover rounded-lg shadow-md"
        />
      </footer>
    </div>
  );
}
