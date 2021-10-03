const Cromossome = require("./cromossome");
const directions = require("./directions");
const Directions = require("./directions");

class Genetic {
  constructor(maze, parameters) {
    this.directionsPossibilities = Object.keys(Directions).length;
    this.maze = maze;
    this.parameters = parameters;
    this.mutationRate = 0.7;
    this.nextDirection = 0;
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
    // console.log(`mom: ${mom.directions}`);
    // console.log(`dad: ${dad.directions}`);
    // const mask = this.getBinaryMask(mom.directions.length);

    // console.log(`bin: ${mask}`);
    const children = this.uniPointCrossover(mom, dad);
    // const children = this.uniformCrossOver(mom, dad, mask);
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

  mutate(children) {
    const random = Math.random();
    const child = children[random > 0.5 ? 0 : 1];

    const indexes = [this.getWorstDirectionsIndexes(child)];

    const numberOfDirections = Object.keys(directions).length;
    indexes.forEach((index) => {
      // const oldDirection = child.directions[index];
      let randomDirection;

      randomDirection = this.nextDirection;

      child.directions[index] = randomDirection;
      console.log(`tried direction ${randomDirection} for position ${index}`);
    });

    this.nextDirection = (this.nextDirection + 1) % numberOfDirections;
  }

  getWorstDirectionsIndexes(child) {
    return child.scores
      .map((score, index) => [score, index])
      .filter((args) => args[0] > 101)
      .map((args) => args[1])[0];

    // for (let i = 0; i < child.scores.length; i++) {
    //   const score = child.scores[i];
    //   if (score > 0) {
    //     return i;
    //   }
    // }
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

    // const slicePoint = Math.floor(Math.random() * momSequence.length); //deixar isso mais variável.
    const slicePoint = Math.floor(momSequence.length / 2);

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

    firstChildDirections.forEach((direction, index) => {
      if (index < slicePoint) {
        firstChild.scores.push(mom.scores[index]);
        secondChild.scores.push(dad.scores[index]);
      } else {
        firstChild.scores.push(dad.scores[index]);
        secondChild.scores.push(mom.scores[index]);
      }
    });

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
