module.exports = Object.freeze({
    repeatedPosition: {
        score: -5,
        happened: detectRepeatedPosition
    },
    walkedIntoWall: {
        score: -10,
        happened: detectIntoWall
    },
    outOfMaze: {
        score: -10,
        happened: detectOutOfMaze
    },
    validWalk: {
        score: 10,
        happened: detectValidWalk
    }
});

function detectRepeatedPosition(cromossome) {
    return cromossome.path.includes(cromossome.currentPosition);
}

function detectIntoWall(cromossome) {
    const [line, column] = cromossome.currentPosition;
    return cromossome.maze[line, column] === '1';
}

function detectOutOfMaze(cromossome) {
    return cromossome.currentPosition.some((value) => value < 0 || value > 11);
}

function detectValidWalk(cromossome) {
    const [line, column] = cromossome.currentPosition;
    return cromossome.maze[line, column] === '0';
}