const Cromossome = require("./cromossome");
const directions = require("./directions");
const Directions = require("./directions");

class Genetic {
  constructor(maze, parameters) {
    this.directionsPossibilities = Object.keys(Directions).length;
    this.maze = maze;
    this.parameters = parameters;
    this.mutationRate = 0.7;
  }

  populate(quantity, steps) {
    return Array(quantity)
      .fill(null)
      .map(() => Array.from({ length: steps }, () => this.getRandomDirection()))
      .map((directions) => new Cromossome(directions, this.maze));
  }

  runPopulation(population) {
    population.forEach((cromossome) => {
      !cromossome.moved && cromossome.move();
    });
  }

  getRandomDirection() {
    return Math.floor(Math.random() * this.directionsPossibilities);
  }

  getBestParents(population) {
    const sorted = population.sort((prev, next) => {
      return prev.score - next.score;
    });

    const slicedSorted = sorted.slice(0, 2);
    return slicedSorted;
  }

  generateNewPopulation(mom, dad) {
    return this.recursivelyGenerateNewPopulation(mom, dad, []);
  }

  recursivelyGenerateNewPopulation(mom, dad, population) {
    const mask = this.getBinaryMask(mom.directions.length);
    const children = this.uniformCrossOver(mom, dad, mask);
    this.mutate(children, this.mutationRate);
    children.forEach((child) => (child.scores = []));
    population.push(...children);
    this.runPopulation(population);

    if (population.length < this.parameters.POPULATION_SIZE) {
      const [newMom, newDad] = this.getBestParents(population);
      return this.recursivelyGenerateNewPopulation(newMom, newDad, population);
    }

    return population;
  }

  mutate(children, mutationRate) {
    const random = Math.random();
    const child = children[random > 0.5 ? 0 : 1];

    const stepsToChange = Math.round(child.directions.length * mutationRate);
    // const indexes = Array.from({ length: stepsToChange }, () =>
    //   Math.floor(Math.random() * child.directions.length)
    // );

    const mutationQuatity = Math.floor(child.directions.length * mutationRate);
    const indexes = this.getWorstDirectionsIndexes(child, mutationQuatity);

    const numberOfDirections = Object.keys(directions).length;
    indexes.forEach((index) => {
      const oldDirection = child.directions[index];
      let randomDirection;

      do {
        randomDirection = Math.floor(Math.random() * numberOfDirections);
      } while (oldDirection === randomDirection);

      child.directions[index] = randomDirection;
    });
  }

  getWorstDirectionsIndexes(child, quantity) {
    return child.scores
      .map((score, index) => [score, index])
      .sort((prev, curr) => curr[0] - prev[0])
      .slice(0, quantity)
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
        firstChildDirection.push(mom.directions[index]);
        secondChildDirection.push(dad.directions[index]);
      } else {
        firstChildDirection.push(dad.directions[index]);
        secondChildDirection.push(mom.directions[index]);
      }
    });

    const firstChild = new Cromossome(firstChildDirection, this.maze);
    const secondChild = new Cromossome(secondChildDirection, this.maze);

    mask.forEach((value, index) => {
      if (value === 1) {
        firstChild.scores.push(mom.scores[index]);
        secondChild.scores.push(dad.scores[index]);
      } else {
        firstChild.scores.push(dad.scores[index]);
        secondChild.scores.push(mom.scores[index]);
      }
    });

    return [firstChild, secondChild];
  }
}

module.exports = Genetic;
