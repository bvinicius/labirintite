import NeuralNetwork from "./neuralNetwork";
import directions from './directions';
import events from "./events";
import geneticManager from "../managers/geneticManager";
import { normalizedCellValues } from "./cellValues";
class Cromossome {
  constructor(weights, maze) {
    this.weights = [...weights];
    this.maze = maze;
    this.score = 0;
    this.network = new NeuralNetwork(5, 4, 4, weights);
    this.currentPosition = [0, 0];
    this.path = [[...this.currentPosition]];
    this.canContinue = true;
    this.maxSteps = geneticManager.parameters.MAX_STEPS;
    this.alreadyMoved = false;
  }

  /**
   * Retorna o valor da célula atual em que o agente está, retornando -1 caso o agente estiver fora do labirinto.
   */
  get currentCell() {
    const [row, col] = this.currentPosition;
    return this.maze[row] && this.maze[row][col] || -1;
  }

  /**
   * Inicia os movimentos do agente no labirinto, até que ele termine.
   */
  run() {
    if (this.alreadyMoved) {
      return;
    }

    this.alreadyMoved = true;
    let stepCount = 0;
    while (this.canContinue && stepCount < this.maxSteps) {
      const status = this.getCellStatus();
      const bestDirection = this.network.getOutput(status);
      this.takeStep(bestDirection);
      stepCount++;
    }
  }

  /**
   * Move-se uma casa no labirinto.
   * @param {number} direction o número que representa uma direção em que o agente vai se mover, de acordo com o enum `directions.js`
   */
  takeStep(direction) {
    switch (direction) {
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

    // console.log(direction);

    this.path.push([...this.currentPosition]);
    this.computeScores();
    // console.log([...this.path]);
  }

  /**
   * Ajusta o score do agente de acordo com a posição atual, encerrando o jogo caso ele tenha feito alguma jogada inválida.
   * @returns 
   */
  computeScores() {
    const arrEvents = Object.values(events);
    const hasSomeFatal = arrEvents.some(event => event.getScore(this) && event.isFatal);
    if (hasSomeFatal) {
      this.gameOver();
      return;
    }

    const roundScore = +arrEvents
      .map((event) => event.getScore(this))
      .reduce((prev, curr) => prev + curr, 0);

    this.score += roundScore;

    if (events.foundDestiny.getScore(this)) {
      this.gameWin();
    }
  }

  gameOver() {
    // console.log('game over.');
    this.canContinue = false;
  }

  gameWin() {
    console.log('game win.');
    this.canContinue = false;
  }

  /**
   * Retorna o conteúdo dos vizinhos do agente e a sua posição atual no labirinto.
   * @returns 
   */
  getCellStatus() {
    const [row, col] = this.currentPosition;
    if (row < 0 || col < 0) {
      return;
    }

    const rowUp = this.maze[row - 1];
    const rowDown = this.maze[row + 1];
    const colLeft = col - 1;
    const colRight = col + 1;

    const cellUp = rowUp ? rowUp[col] : -1;
    const cellDown = rowDown ? rowDown[col] : -1;
    const cellLeft = this.maze[row][colLeft] === undefined ? -1 : this.maze[row][colLeft];
    const cellRight = this.maze[row][colRight] === undefined ? -1 : this.maze[row][colRight];

    const distance = this.getDistance();
    return {
      [directions.UP]: normalizedCellValues[cellUp],
      [directions.DOWN]: normalizedCellValues[cellDown],
      [directions.LEFT]: normalizedCellValues[cellLeft],
      [directions.RIGHT]: normalizedCellValues[cellRight],
      position: distance % Math.floor(distance) || distance
    };
  }

  /**
   * Retorna a distância em linha reta entre a posição atual do agente e a saída do labirinto
   * @returns 
   */
  getDistance() {
    const lastIndex = this.maze.length - 1;
    const [row, col] = this.currentPosition;

    const xDelta = lastIndex - row;
    const yDelta = lastIndex - col;
    return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
  }
}

export default Cromossome;
