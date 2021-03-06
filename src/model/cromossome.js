import directions from "./directions";
import scores from "./scores";

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

  isSolution() {
    return this.validPath && this.reachesTarget;
  }

  move() {
    this.directions.forEach((direction) => {
      this.walk(direction, this.maze);
    });
  }

  walk(eDirection) {
    switch (eDirection) {
      case directions.UP:
        this.currentPosition[0]--;
        break;
      case directions.DOWN:
        this.currentPosition[0]++;
        break;
      case directions.LEFT:
        this.currentPosition[1]--;
        break;
      case directions.RIGHT:
        this.currentPosition[1]++;
        break;
    }

    this.computeScores();
    this.path.push([...this.currentPosition]);
    this.moved = true;

    if (this.hasFinished()) {
      this.reachesTarget = true;
      return;
    }
  }

  hasFinished() {
    const [line, column] = this.currentPosition;
    return line == 11 && column == 11;
  }

  /**
   * Adiciona ou retira pontos de acordo com as penalidades.
   * @param {*} position
   */
  computeScores() {
    let stepScore = 0;
    Object.values(scores).forEach((objScore) => {
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

export default Cromossome;
