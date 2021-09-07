const fs = require('fs');
const genetic = require('./genetic');

const strInput = fs.readFileSync('../maze.txt').toString();
const freeSpotsAmount = (strInput.match(/0/g) || []).length;

const maze = strInput
    .split('\r\n')
    .map((line) => line.split(' '));

const parameters = {
    POPULATION_SIZE: 10,
    MAX_STEPS: freeSpotsAmount
};

const population = genetic.populate(parameters.POPULATION_SIZE, parameters.MAX_STEPS, maze);
population.forEach((cromossome) => {
    cromossome.go(maze);
});

const bestCromossomes = population.sort((prev, next) => next.score - prev.score);
console.log(bestCromossomes.map(e => e.score));

// PASSO 1: Definir uma matriz de X vetores com direções aleatórias (POPULAÇÃO) [OK]
// PASSO 2: Fazer o cálculo da aptidão para cada individuo da população [OK]

// PASSO 3: Se não encontrar solução, selecionar pais para a próxima etapa (com elitismo ou torneio)
// PASSO 4: Cruzamento dos pais (tem vários tipos, definir.)
// PASSO 5: Aplicar mutação nos filhos gerados
// repetir a partir do passo 2