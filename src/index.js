import mazeBuilder from "./managers/mazeBuilder";

const strInput = `E 0 0 0 0 0 0 0 0 0 0 0\n1 1 1 1 0 0 0 0 0 1 1 1\n1 0 0 0 0 1 1 1 0 1 1 0\n1 0 1 1 1 1 1 1 0 0 0 0\n0 0 0 1 0 0 0 0 1 0 1 1\n1 1 0 0 0 1 0 1 0 0 1 1\n1 1 1 0 1 1 0 0 0 1 1 0\n0 0 1 0 0 1 0 1 0 1 1 0\n0 0 0 0 1 1 0 0 0 1 1 0\n1 1 1 0 1 0 0 1 1 1 1 0\n1 1 1 0 1 0 0 0 0 1 1 1\n1 1 1 0 0 0 0 1 0 0 0 S`;
const freeSpotsAmount = (strInput.match(/0/g) || []).length;

const parameters = {
  POPULATION_SIZE: 100,
  MAX_STEPS: freeSpotsAmount,
  GENERATIONS: 10000,
  DELAY: 1000,
};

const maze = strInput.split("\n").map((line) => line.split(" "));

window.onload = () => {
  mazeBuilder.build(maze, document.querySelector(".maze-container"));

  const $runButton = document.querySelector("#startButton");
  const [$populationInput, $iterationsInput, $delayInput] =
    document.querySelectorAll("input.parameter-input");

  $populationInput.value = parameters.POPULATION_SIZE;
  $iterationsInput.value = parameters.GENERATIONS;
  $delayInput.value = parameters.DELAY;

  $runButton.addEventListener("click", onStartButtonClick);
};

const worker = new Worker(new URL("./workers/core.worker.js", import.meta.url));

function onStartButtonClick() {
  const [$populationInput, $iterationsInput, $delayInput] =
    document.querySelectorAll("input.parameter-input");

  parameters.POPULATION_SIZE = +$populationInput.value;
  parameters.GENERATIONS = +$iterationsInput.value;
  parameters.DELAY = +$delayInput.value;

  start();
}

function start() {
  worker.postMessage({ maze, parameters });
  disableButton();
  worker.onmessage = onFinishRunning;
}

function onFinishRunning(data) {
  console.log(`data: ${data}`);
  const $btn = document.querySelector("#startButton");
  $btn.disabled = false;
  $btn.classList.remove("disabled");
}

function disableButton() {
  const $btn = document.querySelector("#startButton");
  $btn.disabled = true;
  $btn.classList.add("disabled");

  const $loader = document.querySelector("#loader");
  $loader.classList.add("loader");
}

// PASSO 1: Definir uma matriz de X vetores com direções aleatórias (POPULAÇÃO) [OK]
// PASSO 2: Fazer o cálculo da aptidão para cada individuo da população [OK]
// PASSO 3: Se não encontrar solução, selecionar pais para a próxima etapa (com elitismo ou torneio)
// PASSO 4: Cruzamento dos pais (tem vários tipos, definir.)

// PASSO 5: Aplicar mutação nos filhos gerados

// repetir a partir do passo 2
