const Directions = require("./directions");
const Scores = require("./scores");

class Cromossome {
  constructor(directions, maze) {
    this.score = 0;
    this.currentPosition = [0, 0];
    this.path = [[this.currentPosition[0], this.currentPosition[1]]];
    this.directions = directions;
    this.scores = [];
    this.maze = maze;
    this.validPath = true;
    this.reachesTarget = false;
    this.moved = false;
  }

  get isSolution() {
    return this.validPath && this.reachesTarget;
  }

  move() {
    this.directions.forEach((direction) => {
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
      this.reachesTarget = true;
    }

    this.computeScores();
    this.path.push([...this.currentPosition]);
    this.moved = true;
  }

  hasFinished() {
    const [line, column] = this.currentPosition;
    return this.maze[(line, column)] === "S";
  }

  /**
   * Adiciona ou retira pontos de acordo com as penalidades.
   * @param {*} position
   */
  computeScores() {
    let stepScore = 0;
    Object.values(Scores).forEach((objScore) => {
      if (objScore.happened(this)) {
        stepScore += objScore.score;
        if (objScore.isPenalty) {
          this.validPath = false;
        }
      }
    });

    this.score += stepScore;
    this.scores.push(stepScore);
  }
}

module.exports = Cromossome;
