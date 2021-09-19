// import mazeBuilder from "../managers/mazeBuilder";
import mazeBuilder from "../managers/mazeBuilder";
import directions from "./directions";
import scores from "./scores";

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

  async move() {
    for (const direction of this.directionsSequence) {
      await this.delay();
      this.step(direction);
    }
  }

  delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  step(eDirection) {
    console.log("should take step");
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

    if (this.hasFinished()) {
      this.reachesTarget = true;
    }

    this.computeScores();
    this.path.push([...this.currentPosition]);
    mazeBuilder.setAgentPosition(this.currentPosition);
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
    Object.values(scores).forEach((objScore) => {
      if (objScore.happened(this)) {
        this.score += objScore.score;
        if (objScore.isPenalty) {
          this.validPath = false;
        }
      }
    });
  }
}

export default Cromossome;
