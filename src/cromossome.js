const Directions = require('./directions');
const Scores = require('./scores');

class Cromossome {
    constructor(directionsSequence, maze) {
        this.score = 0;
        this.currentPosition = [0, 0];
        this.path = [[...this.currentPosition]];
        this.directionsSequence = directionsSequence;
        this.maze = maze;
    }

    go() {
        this.directionsSequence.forEach((direction) => {
            this.walk(direction, this.maze);
        });
    }

    walk(eDirection) {

        switch (eDirection) {
            case Directions.UP:
                this.currentPosition[0]--;
                break;
            case Directions.DOWN:
                this.currentPosition[0]++;
                break;
            case Directions.LEFT:
                this.currentPosition[1]--;
                break;
            case Directions.RIGHT:
                this.currentPosition[1]++;
                break;
        }

        if (this.hasFinished()) {
            console.log('chegou!!');
            return;
        }

        this.computeScores();
        this.path.push([...this.currentPosition]);
    }

    hasFinished() {
        const [line, column] = this.currentPosition;
        return this.maze[line, column] === 'S';
    }

    /**
     * Adiciona ou retira pontos de acordo com as penalidades.
     * @param {*} position 
     */
    computeScores() {
        Object.values(Scores).forEach((objScore) => {
            this.score += objScore.happened(this) ? objScore.score : 0;
        });
    }
}

module.exports = Cromossome;
