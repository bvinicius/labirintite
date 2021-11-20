export default Object.freeze({
  repeatedPosition: {
    score: -5,
    happened: detectRepeatedPosition,
    isFatal: false
  },
  walkedIntoWall: {
    score: -10,
    happened: detectIntoWall,
    isFatal: true
  },
  outOfMaze: {
    score: -10,
    happened: detectOutOfMaze,
    isFatal: true
  },
  validWalk: {
    score: 5,
    happened: detectValidWalk,
    isFatal: false
  },
  foundDestiny: {
    score: 50,
    happened: detectFoundDestiny,
    isFatal: false
  },
  foundCoin: {
    score: 50,
    happened: detectFoundCoin,
    isFatal: false
  },
});

function detectRepeatedPosition(cromossome) {
  return cromossome.path.some(
    (e) =>
      e[0] == cromossome.currentPosition[0] &&
      e[1] == cromossome.currentPosition[1]
  );
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

function detectFoundCoin() {
  return false;
}
