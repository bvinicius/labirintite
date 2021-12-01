import { cellValues } from "./cellValues";

const walkedIntoWallScore = -10;
const outOfMazeScore = -10;
const freeCellScore = 5;
const foundDestinyScore = 100;
const foundCoinScore = 50;
const repeatedCellScore = -5;

const events = Object.freeze({
  walkedIntoWall: {
    score: walkedIntoWallScore,
    getScore: isOnWall,
    isFatal: true
  },
  outOfMaze: {
    score: outOfMazeScore,
    getScore: isOutOfMaze,
    isFatal: true
  },
  freeCell: {
    score: freeCellScore,
    getScore: isOnFreeCell,
    isFatal: false
  },
  foundDestiny: {
    score: foundDestinyScore,
    getScore: isOnDestination,
    isFatal: false
  },
  foundCoin: {
    score: foundCoinScore,
    getScore: isOnCoin,
    isFatal: false
  },
  repeatedCell: {
    score: repeatedCellScore,
    getScore: isRepeated,
    isFatal: false
  }
});

function isOnWall(cromossome) {
  return cromossome.currentCell === cellValues.WALL ? walkedIntoWallScore : 0;
}

function isOutOfMaze(cromossome) {
  const { maze } = cromossome;
  const maxLength = maze.length;

  return cromossome.currentPosition.some((value) => value < 0 || value > maxLength) ? outOfMazeScore : 0;
}

function isOnFreeCell(cromossome) {
  return cromossome.currentCell === cellValues.FREE ? freeCellScore : 0;
}

function isOnDestination(cromossome) {
  return cromossome.currentCell === cellValues.DESTINATION ? foundDestinyScore : 0;
}

function isOnCoin(cromossome) {
  return cromossome.currentCell === cellValues.COIN ? foundCoinScore : 0;
}

function isRepeated(cromossome) {
  const [row, col] = cromossome.currentPosition;
  const repeatCount = cromossome.path
    .slice(0, -1)
    .filter(position => position[0] === row && position[1] === col).length;

  return repeatCount * repeatedCellScore;
}

export default events;
