import { useState, useEffect } from 'react';
import './App.css';

const RIGHT = 'RIGHT';
const LEFT = 'LEFT';
const UP = 'UP';
const DOWN = 'DOWN';
const EMPTY = 'EMPTY';
const FILLED = 'FILLED';
const CHECKPOINT = 'CHECKPOINT';
const matrixSize = 20;
const emptyCellList = Array.from({ length: matrixSize }, () => EMPTY);
const emptyMatrix = emptyCellList.reduce((acc) => (
  [...acc, emptyCellList]
), []);
const initialSnake = [
  { x: 0, y: 9 },
  { x: 1, y: 9 },
  { x: 2, y: 9 },
]
const initialCheckPoint = { x: 16, y: 3 };

function App() {
  const [matrix, setMatrix] = useState(emptyMatrix);
  const [direction, setDirection] = useState(RIGHT);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0);
  const [snake, setSnake] = useState(initialSnake);
  const [checkpoint, setCheckpoint] = useState(initialCheckPoint);

  const resetGame = () => {
    setMatrix(emptyMatrix);
    setSnake(initialSnake);
    setDirection(RIGHT);
    setFinished(false);
    setCheckpoint(initialCheckPoint)
  }

  const completeCheckpoint = () => {
    setCheckpoint({ x: checkpoint.y, y: checkpoint.x });
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
    const lastPosition = snake[snake.length - 1]
    let nextPosition = {};
    switch (direction) {
      case RIGHT:
      default:
        nextPosition = { x: lastPosition.x + 1, y: lastPosition.y };
        break;
      case LEFT:
        nextPosition = { x: lastPosition.x - 1, y: lastPosition.y };
        break;
      case UP:
        nextPosition = { x: lastPosition.x, y: lastPosition.y - 1 };
        break;
      case DOWN:
        nextPosition = { x: lastPosition.x, y: lastPosition.y + 1 };
        break;
    };

    if (verifyGameOver(nextPosition)) {
      setFinished(true);
    } else if (nextPosition.x === checkpoint.x && nextPosition.y === checkpoint.y) {
      setSnake([...snake, nextPosition])
    } else {
      setSnake([...snake.slice(1), nextPosition])
    }
  }

  const printSnake = () => {
    const newMatrix = emptyMatrix.map(r => r.slice());
    newMatrix[checkpoint.y][checkpoint.x] = CHECKPOINT;
    snake.forEach(cell => {
      if (newMatrix[cell.y][cell.x] === CHECKPOINT) {
        completeCheckpoint();
      }
      newMatrix[cell.y][cell.x] = FILLED;
    })
    setMatrix(newMatrix)
  }

  const changeDirection = (newDirection) => {
    if ((newDirection === direction)
      || (newDirection === RIGHT && direction === LEFT)
      || (newDirection === LEFT && direction === RIGHT)
      || (newDirection === UP && direction === DOWN)
      || (newDirection === DOWN && direction === UP)) {
      return
    } 
    setDirection(newDirection)
  }

  useEffect(() => {
    printSnake();

    if (!finished) {
      setTimeout(() => {
        setRound(round + 1);
      }, 200);
    }
  }, [snake, finished])

  useEffect(() => {
    //litle hack to use correct direction when moving.
    //if moveSnake was called directly (in place of setting a round count)
    // it would use the direction in memory when the timeout was created, not the current.
    moveSnake();
  }, [round])

  return (
    <div className='App'>
      <div className="GameOver">
        {finished && `GAME OVER - FINAL SCORE: ${(snake.length - initialSnake.length) * 10}`}
      </div>
      <div className="Game">
        <div>
          {matrix.map((row, ix) => (
            <div key={ix} className="Row">
              {row.map((cell, iy) => {
                if (cell === FILLED) return <div key={iy} className="Cell SnakeBody" />
                if (cell === CHECKPOINT) return <div key={iy} className="Cell Checkpoint" />
                return <div key={iy} className="Cell" />
              })}
            </div>
          ))}
        </div>
        <div className="SidePanel">
          <div className="ArrowsWrapper">
            <button className="ArrowButton" onClick={() => changeDirection(UP)}>{'^'}</button>
            <div>
              <button className="ArrowButton" onClick={() => changeDirection(LEFT)}>{'<'}</button>
              <button className="ArrowButton" onClick={() => changeDirection(DOWN)}>{'v'}</button>
              <button className="ArrowButton" onClick={() => changeDirection(RIGHT)}>{'>'}</button>
            </div>
          </div>
          <button className="resetButton" onClick={resetGame}>reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
