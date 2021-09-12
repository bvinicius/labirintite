module.exports = Object.freeze({
    repeatedPosition: {
        score: -500,
        happened: detectRepeatedPosition,
        isPenalty: true
    },
    walkedIntoWall: {
        score: -1000,
        happened: detectIntoWall,
        isPenalty: true
    },
    outOfMaze: {
        score: -10000,
        happened: detectOutOfMaze,
        isPenalty: true
    },
    validWalk: {
        score: 10000,
        happened: detectValidWalk,
        isPenalty: false
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