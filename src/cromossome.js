const Directions = require('./directions');
const Scores = require('./scores');

class Cromossome {
    constructor(directionsSequence, maze) {
        this.score = 0;
        this.currentPosition = [0, 0];
        this.path = [[this.currentPosition[0], this.currentPosition[1]]];
        this.directionsSequence = directionsSequence;
        this.maze = maze;
        this.validPath = true;
        this.reachesTarget = false;
        this.moved = false;
    }

    get isSolution() {
        return this.validPath && this.reachesTarget;
    }

    move() {
        this.directionsSequence.forEach((direction) => { this.walk(direction, this.maze); });
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
            this.reachesTarget = true;
        }

        this.computeScores();
        this.path.push([...this.currentPosition]);
        this.moved = true;
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
            if (objScore.happened(this)) {
                this.score += objScore.score;
                if (objScore.isPenalty) {
                    // console.log('\n PENALTY! \n');
                    this.validPath = false;
                }
            }
        });
    }
}

module.exports = Cromossome;
