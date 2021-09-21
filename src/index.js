const fs = require("fs");
const Genetic = require("./genetic");

const strInput = fs.readFileSync("../maze.txt").toString();
const freeSpotsAmount = (strInput.match(/0/g) || []).length;

const parameters = {
  POPULATION_SIZE: 500,
  MAX_STEPS: freeSpotsAmount,
  ITERATIONS: 10000,
};

const maze = strInput.split("\r\n").map((line) => line.split(" "));

const genetic = new Genetic(maze, parameters);

let population = genetic.populate(
  parameters.POPULATION_SIZE,
  parameters.MAX_STEPS,
  maze
);

let iterationsCount = 0;
while (iterationsCount < parameters.ITERATIONS) {
  genetic.runPopulation(population);
  const [mom, dad] = genetic.getBestParents(population);
  population = genetic.generateNewPopulation(mom, dad);

  const best = genetic.getBestParents(population)[0];
  console.log(`best score: ${best.score};`);
  iterationsCount++;
}

console.log("ok!");

// PASSO 1: Definir uma matriz de X vetores com direções aleatórias (POPULAÇÃO) [OK]
// PASSO 2: Fazer o cálculo da aptidão para cada individuo da população [OK]
// PASSO 3: Se não encontrar solução, selecionar pais para a próxima etapa (com elitismo ou torneio)

// PASSO 4: Cruzamento dos pais (tem vários tipos, definir.)
// PASSO 5: Aplicar mutação nos filhos gerados
// repetir a partir do passo 2
