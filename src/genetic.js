const Directions = require('./directions');

class Genetic {
    constructor() {
        this.directionsPossibilities = Object.keys(Directions).length;
    }

    populate(quantity, steps) {
        return Array(quantity)
            .fill(null)
            .map(() => Array.from({ length: steps }, () => this.getRandomDirection()));
    }

    getRandomDirection() {
        return Math.floor(Math.random() * this.directionsPossibilities);
    }
}

module.exports = new Genetic();
