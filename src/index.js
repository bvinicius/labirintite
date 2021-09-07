const fs = require('fs');
// const Cromossome = require('./cromossome');
const genetic = require('./genetic');

const POPULATION = 10;
const maze = fs.readFileSync('../maze.txt')
    .toString()
    .split('\r\n')
    .map(line => line.split(' '));

const zeroAmount = 77;

const population = genetic.populate(POPULATION, zeroAmount);
console.log(population)

// PASSO 1: Definir uma matriz de X vetores com direções aleatórias (POPULAÇÃO) [OK]

// PASSO 2: Fazer o cálculo da aptidão para cada individuo da população
// PASSO 3: Se não encontrar solução, selecionar pais para a próxima etapa (com elitismo ou torneio)
// PASSO 4: Cruzamento dos pais (tem vários tipos, definir.)
// PASSO 5: Aplicar mutação nos filhos gerados
// repetir a partir do passo 2