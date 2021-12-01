import Cromossome from "../model/cromossome";
import directions from "../model/directions";

class GeneticManager {
  constructor() {
    this.directionsPossibilities = Object.keys(directions).length;
    this.mutationRate = 0.7;
  }

  populate(quantity, weights) {
    return Array(quantity)
      .fill(null)
      .map(() => Array.from({ length: weights }, () => this.getRandomWeight()))
      .map((weights) => new Cromossome(weights, this.maze));
  }

  /**
   * Gera um double aleatório entre -1 e 1.
   * @returns {number}
   */
  getRandomWeight() {
    const signalModifier = Math.random() > 0.5 ? 1 : -1;
    return Math.random() * signalModifier;
  }

  runPopulation(population) {
    population.forEach((cromossome) => {
      cromossome.run();
    });
  }

  getRandomDirection() {
    return Math.floor(Math.random() * this.directionsPossibilities);
  }

  getBestParents(population) {
    const sorted = population.sort((prev, next) => {
      return next.score - prev.score;
    });
    const slicedSorted = sorted.slice(0, 2);
    return slicedSorted;
  }

  generateNewPopulation(mom, dad) {
    return this.recursivelyGenerateNewPopulation(mom, dad, [mom, dad]);
  }

  recursivelyGenerateNewPopulation(mom, dad, population) {
    const child = this.averageCrossOver(mom, dad);
    this.mutate(child, this.mutationRate);
    population.push(child);
    this.runPopulation(population);

    if (population.length < this.parameters.POPULATION_SIZE) {
      const [newMom, newDad] = this.getBestParents(population);
      return this.recursivelyGenerateNewPopulation(newMom, newDad, population);
    }

    return population;
  }

  mutate(child) {
    const mutateAmount = Math.floor(this.mutationRate * child.weights.length);
    const randomIndexes = this.getRandomIndexes(mutateAmount);

    randomIndexes.forEach(index => {
      const oldValue = child.weights[index];
      child.weights[index] = oldValue * 0.5;
    });
  }

  getRandomIndexes(quantity) {
    const indexes = [];
    for (let i = 0; i < quantity; i++) {
      const randomInt = Math.floor(Math.random() * 100);
      if (randomInt < quantity && indexes.length < quantity) {
        indexes.push(randomInt);
      }
    }
    return indexes;
  }

  getWorstDirectionsIndexes(child) {
    return child.scores
      .map((score, index) => [score, index])
      .filter((args) => args[0] > 0)
      .map((args) => args[1]);
  }

  getBinaryMask(length) {
    return Array.from({ length }, () => (Math.random() > 0.5 ? 0 : 1));
  }

  /**
   * Crossover uniponto
   * @param {*} mom
   * @param {*} dad
   */
  uniPointCrossover(mom, dad) {
    const momSequence = mom.directions;
    const dadSequence = dad.directions;

    const slicePoint = Math.floor(Math.random() * momSequence.length);

    const firstChildDirections = [
      ...momSequence.slice(0, slicePoint),
      ...dadSequence.slice(slicePoint),
    ];
    const secondChildDirections = [
      ...dadSequence.slice(0, slicePoint),
      ...momSequence.slice(slicePoint),
    ];

    const firstChild = new Cromossome(firstChildDirections, this.maze);
    const secondChild = new Cromossome(secondChildDirections, this.maze);
    return [firstChild, secondChild];
  }

  averageCrossOver(mom, dad) {
    const avg = (num1, num2) => (num1 + num2) / 2;
    const weights = mom.weights.map((weight, index) => avg(weight, dad.weights[index]));
    return new Cromossome(weights, this.maze);
  }

  uniformCrossOver(mom, dad, mask) {
    const firstChildDirection = [];
    const secondChildDirection = [];

    mask.forEach((value, index) => {
      if (value === 1) {
        firstChildDirection.push(mom.weights[index]);
        secondChildDirection.push(dad.weights[index]);
      } else {
        firstChildDirection.push(dad.weights[index]);
        secondChildDirection.push(mom.weights[index]);
      }
    });

    const firstChild = new Cromossome(firstChildDirection, this.maze);
    const secondChild = new Cromossome(secondChildDirection, this.maze);
    return [firstChild, secondChild];
  }
}

export default new GeneticManager();
