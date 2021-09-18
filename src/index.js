import GeneticManager from "./managers/geneticManager";
import mazeBuilder from "./managers/mazeBuilder";

const strInput = `E 0 0 0 0 0 0 0 0 0 0 0\n1 1 1 1 0 0 0 0 0 1 1 1\n1 0 0 0 0 1 1 1 0 1 1 0\n1 0 1 1 1 1 1 1 0 0 0 0\n0 0 0 1 0 0 0 0 1 0 1 1\n1 1 0 0 0 1 0 1 0 0 1 1\n1 1 1 0 1 1 0 0 0 1 1 0\n0 0 1 0 0 1 0 1 0 1 1 0\n0 0 0 0 1 1 0 0 0 1 1 0\n1 1 1 0 1 0 0 1 1 1 1 0\n1 1 1 0 1 0 0 0 0 1 1 1\n1 1 1 0 0 0 0 1 0 0 0 S`;

const parameters = {
  POPULATION_SIZE: 40,
  MAX_STEPS: freeSpotsAmount,
  ITERATIONS: 10000,
};

const maze = strInput.split("\n").map((line) => line.split(" "));

window.onload = () => {
  mazeBuilder.build(maze, document.querySelector(".maze-container"));

  const $runButton = document.querySelector("#startButton");
  const [$populationInput, $iterationsInput] = document.querySelectorAll(
    "input.parameter-input"
  );

  $populationInput.value = parameters.POPULATION_SIZE;
  $iterationsInput.value = parameters.ITERATIONS;

  $runButton.addEventListener("click", onStartButtonClick);
};

const freeSpotsAmount = (strInput.match(/0/g) || []).length;

function onStartButtonClick() {
  const [$populationInput, $iterationsInput] = document.querySelectorAll(
    "input.parameter-input"
  );

  parameters.POPULATION_SIZE = $populationInput.value;
  parameters.MAX_STEPS = $iterationsInput.value;

  start();
}

function start() {
  const genetic = new GeneticManager(maze, parameters);

  let population = genetic.populate(
    parameters.POPULATION_SIZE,
    parameters.MAX_STEPS,
    maze
  );
  let best = null;
  let iterationsCount = 0;
  while (iterationsCount < parameters.ITERATIONS && !(best && best.reachesTarget)) {
    genetic.runPopulation(population);
    const [mom, dad] = genetic.getBestParents(population);
    population = genetic.generateNewPopulation(mom, dad);
  
    best = genetic.getBestParents(population)[0];
    console.log(`best score: ${best.score}; found S: ${best.reachesTarget}`);
    iterationsCount++;
  }
  
  
  if (best.reachesTarget) {
    console.log(`\nsolution found!`);
    console.log(`cromossome who found: ${JSON.stringify(best)}`);
}

// PASSO 1: Definir uma matriz de X vetores com direções aleatórias (POPULAÇÃO) [OK]
// PASSO 2: Fazer o cálculo da aptidão para cada individuo da população [OK]
// PASSO 3: Se não encontrar solução, selecionar pais para a próxima etapa (com elitismo ou torneio)
// PASSO 4: Cruzamento dos pais (tem vários tipos, definir.)

// PASSO 5: Aplicar mutação nos filhos gerados

// repetir a partir do passo 2
