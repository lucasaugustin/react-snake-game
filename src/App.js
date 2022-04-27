import { useState, useEffect } from 'react';
import './App.css';

const RIGHT = 'RIGHT';
const LEFT = 'LEFT';
const TOP = 'TOP';
const BOTTOM = 'BOTTOM';
const EMPTY = 'EMPTY';
const FILLED = 'FILLED';
const matrixSize = 20;
const emptyCellList = Array.from({ length: matrixSize }, () => EMPTY);
const emptyMatrix = emptyCellList.reduce((acc) => (
  [...acc, emptyCellList]
), []);

function App() {
  const [matrix, setMatrix] = useState(emptyMatrix);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(RIGHT);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0)

  const resetGame = () => {
    setMatrix(emptyMatrix);
    setLastPosition({ x: 0, y: 0 });
    setDirection(RIGHT);
    setFinished(false);
  }

  const verifyGameOver = (nextPosition) => {
    return (nextPosition.x === matrixSize
      || nextPosition.x < 0
      || nextPosition.y === matrixSize
      || nextPosition.y < 0
      || matrix[nextPosition.y][nextPosition.x] === FILLED
    )
  }

  const moveSnake = () => {
    let nextPosition = {};
    switch (direction) {
      case RIGHT:
      default:
        nextPosition = { x: lastPosition.x + 1, y: lastPosition.y };
        break;
      case LEFT:
        nextPosition = { x: lastPosition.x - 1, y: lastPosition.y };
        break;
      case TOP:
        nextPosition = { x: lastPosition.x, y: lastPosition.y - 1 };
        break;
      case BOTTOM:
        nextPosition = { x: lastPosition.x, y: lastPosition.y + 1 };
        break;
    };

    if (verifyGameOver(nextPosition)) {
      setFinished(true);
    } else {
      const newMatrix = matrix.map(r => r.slice());
      newMatrix[nextPosition.y][nextPosition.x] = FILLED;
      setMatrix(newMatrix);
      setLastPosition(nextPosition);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRound(round + 1);
    }, 500);

    if (finished) {
      clearTimeout(timeout);
    }
  }, [lastPosition, finished])

  useEffect(() => {
    moveSnake();
  }, [round])

  return (
    <div className='App'>
      <div>
        {matrix.map((row, ix) => (
          <div key={ix} className="Row">
            {row.map((cell, iy) => cell === FILLED
              ? <div key={iy} className="SnakeBody" />
              : <div key={iy} className="EmptyCell" />
            )}
          </div>
        ))}
      </div>
      <div className="SidePanel">
        {finished && <div className="GameOver">GAME OVER</div>}
        <div className="ArrowsWrapper">
          <button className="ArrowButton" onClick={() => setDirection(TOP)}>{'^'}</button>
          <div>
            <button className="ArrowButton" onClick={() => setDirection(LEFT)}>{'<'}</button>
            <button className="ArrowButton" onClick={() => setDirection(BOTTOM)}>{'v'}</button>
            <button className="ArrowButton" onClick={() => setDirection(RIGHT)}>{'>'}</button>
          </div>
        </div>
        <button className="resetButton" onClick={resetGame}>reset</button>
      </div>
    </div>
  );
}

export default App;
