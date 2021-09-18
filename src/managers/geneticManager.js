import Cromossome from "../model/cromossome";
import directions from "../model/directions";

class GeneticManager {
  constructor(maze, parameters) {
    this.directionsPossibilities = Object.keys(directions).length;
    this.maze = maze;
    this.parameters = parameters;
  }

  populate(quantity, steps) {
    return Array(quantity)
      .fill(null)
      .map(() => Array.from({ length: steps }, () => this.getRandomDirection()))
      .map(
        (directionsSequence) => new Cromossome(directionsSequence, this.maze)
      );
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
      return next.score - prev.score;
    });

    const slicedSorted = sorted.slice(0, 2);
    return slicedSorted;
  }

  generateNewPopulation(mom, dad) {
    return this.recursivelyGenerateNewPopulation(mom, dad, []);
  }

  recursivelyGenerateNewPopulation(mom, dad, population) {
    const mask = this.getBinaryMask(mom.directionsSequence.length);
    const children = this.uniformCrossOver(mom, dad, mask);
    population.push(...children);
    this.runPopulation(population);

    if (population.length < this.parameters.POPULATION_SIZE) {
      const [newMom, newDad] = this.getBestParents(population);
      return this.recursivelyGenerateNewPopulation(newMom, newDad, population);
    }

    return population;
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
    const momSequence = mom.directionsSequence;
    const dadSequence = dad.directionsSequence;

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
        firstChildDirection.push(mom.directionsSequence[index]);
        secondChildDirection.push(dad.directionsSequence[index]);
      } else {
        firstChildDirection.push(dad.directionsSequence[index]);
        secondChildDirection.push(mom.directionsSequence[index]);
      }
    });

    const firstChild = new Cromossome(firstChildDirection, this.maze);
    const secondChild = new Cromossome(secondChildDirection, this.maze);

    return [firstChild, secondChild];
  }
}

export default GeneticManager;
