const Directions = require('./directions');
const Scores = require('./scores');

class Cromossome {
    constructor() {
        this.score = 0;
        this.path = [0, 0];
    }

    get currentPosition() {
        return this.path[this.path.length - 1];
    }

    walk(eDirection, maze) {

        const newPosition = this.currentPosition;

        switch (eDirection) {
            case Directions.UP:
                newPosition[0]--;
                break;
            case Directions.DOWN:
                newPosition[0]++;
                break;
            case Directions.LEFT:
                newPosition[1]--;
                break;
            case Directions.RIGHT:
                newPosition[1]++;
                break;
        }

        if (this.hasFinished(newPosition, maze)) {
            console.log('chegou!!');
            return;
        }

        this.computePenalties(newPosition, maze);
        this.path.push(newPosition);
    }

    hasFinished(newPosition, maze) {
        return maze[newPosition[0], newPosition[1]] === 'S';
    }

    /**
     * Adiciona ou retira pontos de acordo com as penalidades.
     * @param {*} newPosition 
     */
    computePenalties(newPosition, maze) {
        let score = 0;
        score += this.currentPosition.some((value) => value < 0 || value > 11) ? Scores.invalidWalk : 0; // caiu fora do labirinto
        score += maze[this.currentPosition[0], this.currentPosition[1]] === '1' ? Scores.invalidWalk : 0; // foi para a parede
        score += maze[this.currentPosition[0], this.currentPosition[1]] === '0' ? Scores.validWalk : 0; // andou corretamente
        score += this.path.includes(newPosition) ? Scores.back : 0; // já passou por esse ponto
        this.score += score;
    }
}

module.exports = Cromossome;
