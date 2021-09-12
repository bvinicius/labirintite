const Cromossome = require('./cromossome');
const Directions = require('./directions');

class Genetic {
    constructor(maze, parameters) {
        this.directionsPossibilities = Object.keys(Directions).length;
        this.maze = maze;
        this.parameters = parameters;
    }

    populate(quantity, steps) {
        return Array(quantity)
            .fill(null)
            .map(() => Array.from({ length: steps }, () => this.getRandomDirection()))
            .map((directionsSequence) => new Cromossome(directionsSequence, this.maze));
    }

    getRandomDirection() {
        return Math.floor(Math.random() * this.directionsPossibilities);
    }

    getBestParents(population) {
        return population.sort((prev, next) => next.score - prev.score).slice(0, 2);
    }

    generateNewPopulation(mom, dad) {
        const newPopulation = [];
        const children = this.crossover(mom, dad);
        newPopulation.push(...children);
    }

    /**
     * Crossover uniponto
     * @param {*} mom 
     * @param {*} dad 
     */
    crossover(mom, dad) {
        const momSequence = mom.directionsSequence;
        const dadSequence = dad.directionsSequence;

        const slicePoint = Math.floor(Math.random() * momSequence.length);

        const firstChildDirections = [...momSequence.slice(0, slicePoint), ...dadSequence.slice(slicePoint)];
        const secondChildDirections = [...dadSequence.slice(0, slicePoint), ...momSequence.slice(slicePoint)];

        const firstChild = new Cromossome(firstChildDirections, this.maze);
        const secondChild = new Cromossome(secondChildDirections, this.maze);
        return [firstChild, secondChild];
    }
}

module.exports = Genetic;
