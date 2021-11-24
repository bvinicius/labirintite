import cellValues from "./cellValues";

export default Object.freeze({
  walkedIntoWall: {
    score: -10,
    happened: isOnWall,
    isFatal: true
  },
  outOfMaze: {
    score: -10,
    happened: isOutOfMaze,
    isFatal: true
  },
  freeCell: {
    score: 5,
    happened: isOnFreeCell,
    isFatal: false
  },
  foundDestiny: {
    score: 100,
    happened: isOnDestination,
    isFatal: false
  },
  foundCoin: {
    score: 50,
    happened: isOnCoin,
    isFatal: false
  },
});

function isOnWall(cromossome) {
  return cromossome.currentCell === cellValues.WALL;
}

function isOutOfMaze(cromossome) {
  const { maze } = cromossome;
  const maxLength = maze.length;
  return cromossome.currentPosition.some((value) => value < 0 || value > maxLength);
}

function isOnFreeCell(cromossome) {
  return cromossome.currentCell === cellValues.FREE;
}

function isOnDestination(cromossome) {
  return cromossome.currentCell === cellValues.DESTINATION;
}

function isOnCoin(cromossome) {
  return cromossome.currentCell === cellValues.COIN;
}
