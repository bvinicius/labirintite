module.exports = Object.freeze({
  repeatedPosition: {
    score: 101,
    happened: detectRepeatedPosition,
    isPenalty: false,
  },
  walkedIntoWall: {
    score: 2002,
    happened: detectIntoWall,
    isPenalty: true,
  },
  outOfMaze: {
    score: 5003,
    happened: detectOutOfMaze,
    isPenalty: true,
  },
  validWalk: {
    score: -1000,
    happened: detectValidWalk,
    isPenalty: false,
  },
  foundDestiny: {
    score: -10000,
    happened: detectFoundDestiny,
    isPenalty: false
  }
});

function detectRepeatedPosition(cromossome) {
  return cromossome.path.some(e => e[0] == cromossome.currentPosition[0] && e[1] == cromossome.currentPosition[1]);
}

function detectIntoWall(cromossome) {
  const [line, column] = cromossome.currentPosition;
  return cromossome.maze[line] && cromossome.maze[line][column] == "1";
}

function detectOutOfMaze(cromossome) {
  return cromossome.currentPosition.some((value) => value < 0 || value > 11);
}

function detectValidWalk(cromossome) {
  const [line, column] = cromossome.currentPosition;
  return cromossome.maze[line] && cromossome.maze[line][column] == "0";
}

function detectFoundDestiny(cromossome) {
  const [line, column] = cromossome.currentPosition;
  return line == 11 && column == 11;
}
