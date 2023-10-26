import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={'square ' + (highlight ? 'highlight ' :  '')} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay  }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } else {
    if (!squares.includes(null)) {
      status = 'Draw'
    } else {
     status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  }

  return (
    <>
      <div className="status">{status}</div>   
        {Array(3).fill(null).map((_, row) => (
          <div className="board-row" key={row}>
            {Array(3).fill(null).map((_, col) => {
              const squareIndex = row * 3 + col;
              return (
                <Square
                  key={squareIndex}
                  value={squares[squareIndex]}
                  highlight={winner && winner.includes(squareIndex)}
                  onSquareClick={() => handleClick(squareIndex)}
                />
              );
            })}
          </div>
        ))}

    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), index: -1}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, index: i}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(squares.index / 3);
      const col = squares.index % 3;
      description = (move === currentMove ? 'You are at' : 'Go to move') +  ` #${move} - (${row+1},${col+1})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        { move === currentMove ? description :
        (<button onClick={() => jumpTo(move)}>{description}</button>)
        }
      </li>

    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
          <button onClick={() => setAscending(!ascending)}>
          {ascending ? "Descending" : "Ascending"}
        </button>
        <ol>{ascending ? moves : moves.slice().reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
