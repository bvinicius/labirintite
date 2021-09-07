const fs = require('fs');
const Directions = require('./directions');

const SCORES = {
    back: -5,
    invalidWalk: -10,
    validWalk: 1
}

const maze = fs.readFileSync('maze.txt')
    .toString()
    .split('\r\n')
    .map(line => line.split(' '));

const totalScore = 0;
const currentPosition = [0, 0];
const path = currentPosition;

function walk(eDirection) {
    switch (eDirection) {
        case Directions.UP:
            currentPosition[0] --;
            break;
        case Directions.DOWN:
            currentPosition[0] ++;
            break;
        case Directions.LEFT:
            currentPosition[1] --;
            break;
        case Directions.RIGHT:
            currentPosition[1] ++;
            break;
    }

    //se chegou em S, precisa parar.
    computePenalties(currentPosition);
    path.push(currentPosition);
}

/**
 * Adiciona ou retira pontos de acordo com as penalidades.
 * @param {*} newPosition 
 */
function computePenalties(newPosition) {
    let score = 0;

    score += currentPosition.some((value) => value < 0 || value > 11) ? SCORES.invalidWalk : 0; // caiu fora do labirinto
    score += maze[currentPosition[0], currentPosition[1]] === '1' ? SCORES.invalidWalk : 0; // foi para a parede
    score += maze[currentPosition[0], currentPosition[1]] === '0' ? SCORES.validWalk : 0; // andou corretamente
    score += path.includes(newPosition) ? SCORES.back : 0; // já passou por esse ponto

    totalScore += score;
}