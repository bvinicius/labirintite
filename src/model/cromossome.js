import NeuralNetwork from "./neuralNetwork";
import directions from './directions';
class Cromossome {
  constructor(weights, maze) {
    this.weights = [weights];
    this.maze = maze;
    this.score = 0;
    this.path = [];
    this.network = new NeuralNetwork(5, 4, 4);
    this.currentPosition = [0, 0];
  }

  move() {
    const status = this.getCellStatus();
    const output = this.network.getOutput(status);
    // this.walk(output);
    console.log(output);
  }

  getCellStatus() {
    const [row, col] = this.currentPosition;
    const cellUp = this.maze[row - 1] ? this.maze[row - 1][col] : -1;
    const cellDown = this.maze[row + 1] ? this.maze[row + 1][col] : -1;
    const cellLeft = this.maze[row][col - 1] === undefined ? -1 : this.maze[row][col - 1];
    const cellRight = this.maze[row][col + 1] === undefined ? -1 : this.maze[row][col + 1];

    return {
      [directions.UP]: +cellUp,
      [directions.DOWN]: +cellDown,
      [directions.LEFT]: +cellLeft,
      [directions.RIGHT]: +cellRight,
      position: this.getDistance()
    };
  }

  getDistance() {
    return 0.4; // TODO: implementar
  }
}

export default Cromossome;
