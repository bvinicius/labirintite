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
    return this.recursivelyGenerateNewPopulation(mom, dad, []);
  }

  recursivelyGenerateNewPopulation(mom, dad, population) {
    const mask = this.getBinaryMask(mom.weights.length);
    const children = this.uniformCrossOver(mom, dad, mask);
    this.mutate(children, this.mutationRate);
    population.push(...children);
    this.runPopulation(population);

    if (population.length < this.parameters.POPULATION_SIZE) {
      const [newMom, newDad] = this.getBestParents(population);
      return this.recursivelyGenerateNewPopulation(newMom, newDad, population);
    }

    return population;
  }

  mutate(children) {
    const random = Math.random();
    const child = children[random > 0.5 ? 0 : 1];

    const mutateAmount = Math.floor(this.mutationRate * child.weights.length);
    const randomIndexes = this.getRandomIndexes(mutateAmount);

    randomIndexes.forEach(index => {
      const oldValue = child.weights[index];
      console.log('old', oldValue);
      child.weights[index] = oldValue * -1;
      console.log('curr', child.weights[index]);
    });

    // const indexes = this.getWorstDirectionsIndexes(child);

    // const numberOfDirections = Object.keys(directions).length;
    // indexes.forEach((index) => {
    //   const oldDirection = child.directions[index];
    //   let randomDirection;

    //   do {
    //     randomDirection = Math.floor(Math.random() * numberOfDirections);
    //   } while (oldDirection === randomDirection);

    //   child.directions[index] = randomDirection;
    // });
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

    // mask.forEach((value, index) => {
    //   if (value === 1) {
    //     firstChild.scores.push(mom.scores[index]);
    //     secondChild.scores.push(dad.scores[index]);
    //   } else {
    //     firstChild.scores.push(dad.scores[index]);
    //     secondChild.scores.push(mom.scores[index]);
    //   }
    // });

    return [firstChild, secondChild];
  }
}

export default new GeneticManager();
